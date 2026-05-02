"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { getMailProvider } from "@/lib/mailings/mysendingbox";
import { submitMailingToProvider } from "@/lib/mailings/submit";
import { countPagesInBuffer } from "@/lib/mailings/merge";
import { AFNOR_MAX_CHARS } from "@/lib/letters/text";
import { MAX_MERGED_PAGES, ESTIMATED_LETTER_PAGES } from "@/config/mailings";
import type {
  AddressValidationResult,
  PostalAddress,
} from "@/lib/mailings/provider";

// ─── Constantes pièces jointes ───────────────────────────────────────────────

const MAX_ATTACHMENTS = 5;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const STORAGE_BUCKET = "mailings";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AttachmentInfo {
  /** Nom de fichier original (pour affichage UI) */
  name: string;
  /** Chemin dans le bucket Supabase Storage : {letterId}/{uuid}-{name} */
  storagePath: string;
  /** Taille en bytes */
  sizeBytes: number;
  /** MIME type */
  mimeType: string;
  /**
   * Nombre de pages qu'occupera la PJ dans le PDF mergé.
   * - PDF : nombre de pages réel (parsé via pdf-lib à l'upload)
   * - JPG/PNG : 1 page A4 (embed)
   * Permet la limite totale `MAX_MERGED_PAGES` (cf. config/mailings.ts).
   */
  pagesCount: number;
}

export interface UploadAttachmentResult {
  ok: true;
  attachment: AttachmentInfo;
}

export interface ActionError {
  ok: false;
  error: string;
}

// ─── 1. validateRecipientAddress ─────────────────────────────────────────────
//
// Appelle MailProvider.validateAddress() côté serveur. Validation locale
// (champs requis + format CP FR + longueur AFNOR 38 chars) — la vraie
// validation métier MSB se produit lors de submitMailing (HTTP 422 si refus).

export async function validateRecipientAddress(
  address: PostalAddress
): Promise<AddressValidationResult> {
  const provider = getMailProvider();
  return provider.validateAddress(address);
}

// ─── 2. uploadAttachment ─────────────────────────────────────────────────────
//
// Upload un fichier dans Supabase Storage bucket "mailings" sous le path
// {letterId}/{uuid}-{filename}. Utilise le service client (bypass RLS) car
// l'auth est optionnelle dans le tunnel courrier.
//
// Vérification existing : on récupère la liste actuelle des PJ via Storage
// pour appliquer les limites (max 5 fichiers, 10 Mo total).

export async function uploadAttachment(
  letterId: string,
  formData: FormData
): Promise<UploadAttachmentResult | ActionError> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, error: "Aucun fichier reçu." };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      error: `Format non supporté (${file.type || "inconnu"}). Formats acceptés : PDF, JPEG, PNG.`,
    };
  }

  // Valider que la letter existe (sécurité : empêche upload sur un letterId arbitraire)
  const supabase = createServiceClient();
  const { data: letter, error: letterError } = await supabase
    .from("letters")
    .select("id")
    .eq("id", letterId)
    .single();

  if (letterError || !letter) {
    return { ok: false, error: "Courrier introuvable." };
  }

  // Lister les pièces jointes déjà uploadées pour appliquer les limites
  const { data: existing, error: listError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(letterId, { limit: 100 });

  if (listError) {
    console.error("Storage list error:", listError);
    return { ok: false, error: "Erreur lors de la vérification des fichiers existants." };
  }

  const existingFiles = existing ?? [];
  if (existingFiles.length >= MAX_ATTACHMENTS) {
    return {
      ok: false,
      error: `Maximum ${MAX_ATTACHMENTS} pièces jointes par courrier.`,
    };
  }

  const existingTotalBytes = existingFiles.reduce(
    (sum, f) => sum + (f.metadata?.size ?? 0),
    0
  );
  if (existingTotalBytes + file.size > MAX_TOTAL_BYTES) {
    const usedMo = (existingTotalBytes / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      error: `Limite de 10 Mo dépassée (déjà ${usedMo} Mo utilisés). Réduis la taille des fichiers.`,
    };
  }

  // ─── Vérification limite pages totales (courrier + PJ ≤ MAX_MERGED_PAGES) ──
  // On compte d'abord les pages des PJ existantes (download chaque PDF + parse).
  // Coût : ~50-100ms par PJ. Avec max 5 PJ → ~500ms maxi à l'upload.
  const fileBuffer = await file.arrayBuffer();
  const newFileBuf = Buffer.from(fileBuffer);
  const newFilePages = await countPagesInBuffer(newFileBuf, file.type);

  let existingPages = 0;
  for (const f of existingFiles) {
    const { data: existingBlob } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(`${letterId}/${f.name}`);
    if (!existingBlob) continue;
    const buf = Buffer.from(await existingBlob.arrayBuffer());
    const mime = f.metadata?.mimetype ?? "application/octet-stream";
    existingPages += await countPagesInBuffer(buf, mime);
  }

  const totalPages = ESTIMATED_LETTER_PAGES + existingPages + newFilePages;
  if (totalPages > MAX_MERGED_PAGES) {
    const remainingPagesQuota =
      MAX_MERGED_PAGES - ESTIMATED_LETTER_PAGES - existingPages;
    return {
      ok: false,
      error:
        remainingPagesQuota <= 0
          ? `Limite de ${MAX_MERGED_PAGES} pages atteinte (courrier + ${existingPages} page${existingPages > 1 ? "s" : ""} de PJ). Supprimez une PJ pour en ajouter une autre.`
          : `Ce fichier (${newFilePages} page${newFilePages > 1 ? "s" : ""}) dépasse votre quota restant (${remainingPagesQuota} page${remainingPagesQuota > 1 ? "s" : ""}). Limite totale : ${MAX_MERGED_PAGES} pages (courrier + PJ).`,
    };
  }

  // Sanitize filename + ajoute UUID pour éviter collisions
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);
  const storagePath = `${letterId}/${randomUUID()}-${safeName}`;

  // Upload via service client (bypass RLS)
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, new Uint8Array(fileBuffer), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return { ok: false, error: "Erreur lors de l'upload du fichier." };
  }

  return {
    ok: true,
    attachment: {
      name: file.name,
      storagePath,
      sizeBytes: file.size,
      mimeType: file.type,
      pagesCount: newFilePages,
    },
  };
}

// ─── 2bis. listAttachments ───────────────────────────────────────────────────
//
// Liste les pièces jointes existantes pour une letter (post-refresh page,
// retour navigation, etc.). Utilisé pour bootstrap le state du composant
// `AttachmentUploader` avec leur `pagesCount` réel.
//
// Coût : 1 download par PJ + 1 parse pdf-lib. Acceptable au mount (≤500ms
// pour 5 PJ). Pas appelé pendant l'upload (uploadAttachment a déjà tout
// téléchargé).

export async function listAttachments(
  letterId: string
): Promise<AttachmentInfo[]> {
  const supabase = createServiceClient();

  const { data: files, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(letterId, { limit: 100 });

  if (error || !files) {
    console.error("listAttachments: list failed", error);
    return [];
  }

  const result: AttachmentInfo[] = [];
  for (const f of files) {
    const path = `${letterId}/${f.name}`;
    // Reconstituer le nom original (uuid-name.ext → name.ext)
    const originalName = f.name.replace(/^[0-9a-f-]{36}-/i, "");
    const mime = f.metadata?.mimetype ?? "application/octet-stream";
    const size = f.metadata?.size ?? 0;

    // Compter les pages (download + parse)
    let pagesCount = 1;
    const { data: blob } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(path);
    if (blob) {
      const buf = Buffer.from(await blob.arrayBuffer());
      pagesCount = await countPagesInBuffer(buf, mime);
    }

    result.push({
      name: originalName,
      storagePath: path,
      sizeBytes: size,
      mimeType: mime,
      pagesCount,
    });
  }

  return result;
}

// ─── 3. removeAttachment ─────────────────────────────────────────────────────
//
// Supprime un fichier du bucket Storage. Le storagePath doit commencer par
// le letterId (sécurité : empêche suppression d'un fichier d'un autre courrier).

export async function removeAttachment(
  letterId: string,
  storagePath: string
): Promise<{ ok: true } | ActionError> {
  // Validation : le path doit commencer par {letterId}/
  if (!storagePath.startsWith(`${letterId}/`)) {
    return { ok: false, error: "Chemin de fichier invalide." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("Storage remove error:", error);
    return { ok: false, error: "Erreur lors de la suppression du fichier." };
  }

  return { ok: true };
}

// ─── 4. updateLetterText ─────────────────────────────────────────────────────
//
// Édite le texte du courrier (champ `final_text`). Garde `generated_text`
// inchangé pour permettre `resetLetterText`.
//
// Verrouillage : on refuse l'édition si un mailing associé est déjà en envoi
// (`submitted` / `in_transit` / `delivered` / `returned` / `failed`). Tant
// que le mailing est en `pending` ou `paid`, l'édition reste possible.
// Le découplage paiement/submission (commit A2) garantit que le mailing
// ne passe pas automatiquement à `submitted` immédiatement après paiement.
//
// Pour mode PDF only (pas de mailing) : pas de verrouillage. L'user peut
// éditer indéfiniment.

const LOCKED_MAILING_STATUSES = new Set([
  "submitted",
  "in_transit",
  "delivered",
  "returned",
  "failed",
]);

export async function updateLetterText(
  letterId: string,
  newText: string
): Promise<{ ok: true } | ActionError> {
  // Validation côté serveur (l'UI fait déjà ce check, mais défense en profondeur)
  if (newText.length > AFNOR_MAX_CHARS) {
    return {
      ok: false,
      error: `Le texte dépasse la limite (${newText.length} / ${AFNOR_MAX_CHARS} caractères). Réduis-le pour rester sur 1 page.`,
    };
  }

  const supabase = createServiceClient();

  // Vérifier si un mailing existe et son statut
  const { data: mailing, error: mailingError } = await supabase
    .from("mailings")
    .select("status")
    .eq("letter_id", letterId)
    .maybeSingle();

  if (mailingError) {
    console.error("updateLetterText: mailing lookup failed:", mailingError);
    return { ok: false, error: "Erreur lors de la vérification du statut d'envoi." };
  }

  if (mailing && LOCKED_MAILING_STATUSES.has(mailing.status)) {
    return {
      ok: false,
      error:
        "Le courrier a déjà été remis à La Poste, il n'est plus modifiable.",
    };
  }

  const { error: updateError } = await supabase
    .from("letters")
    .update({ final_text: newText })
    .eq("id", letterId);

  if (updateError) {
    console.error("updateLetterText: letter update failed:", updateError);
    return { ok: false, error: "Erreur lors de l'enregistrement du texte." };
  }

  revalidatePath(`/preview/${letterId}`);
  return { ok: true };
}

// ─── 5. resetLetterText ──────────────────────────────────────────────────────
//
// Reset `final_text = NULL` → l'affichage retombe sur `generated_text` (la
// version IA originale). Mêmes contraintes de verrouillage que updateLetterText.

export async function resetLetterText(
  letterId: string
): Promise<{ ok: true } | ActionError> {
  const supabase = createServiceClient();

  const { data: mailing, error: mailingError } = await supabase
    .from("mailings")
    .select("status")
    .eq("letter_id", letterId)
    .maybeSingle();

  if (mailingError) {
    console.error("resetLetterText: mailing lookup failed:", mailingError);
    return { ok: false, error: "Erreur lors de la vérification du statut d'envoi." };
  }

  if (mailing && LOCKED_MAILING_STATUSES.has(mailing.status)) {
    return {
      ok: false,
      error: "Le courrier a déjà été remis à La Poste, il n'est plus modifiable.",
    };
  }

  const { error: updateError } = await supabase
    .from("letters")
    .update({ final_text: null })
    .eq("id", letterId);

  if (updateError) {
    console.error("resetLetterText: letter update failed:", updateError);
    return { ok: false, error: "Erreur lors de la réinitialisation." };
  }

  revalidatePath(`/preview/${letterId}`);
  return { ok: true };
}

// ─── 6. confirmMailingSend ───────────────────────────────────────────────────
//
// L'utilisateur confirme explicitement l'envoi à La Poste après paiement.
// Déclenche `submitMailingToProvider` qui génère le PDF (avec final_text si
// édité) et appelle l'API MSB. Le mailing passe de `paid` à `submitted`.
//
// Garde-fous :
//   - Auth : on vérifie `auth.uid() = mailing.user_id` (anti-CSRF basique)
//   - Status : on n'autorise la confirmation que si le mailing est `paid`.
//     Si déjà submitted/in_transit/etc. → no-op idempotent (pas d'erreur,
//     juste retour OK pour rafraîchir l'UI).
//   - Si `submitMailingToProvider` échoue, le mailing passe à `failed` côté
//     submit.ts. On retourne quand même `ok: true` car le mailing a été
//     "tenté" — l'admin verra le mailing en `failed` et relancera.

export async function confirmMailingSend(
  mailingId: string
): Promise<{ ok: true } | ActionError> {
  // Vérification ownership via auth client
  const auth = await createAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { ok: false, error: "Vous devez être connecté pour confirmer l'envoi." };
  }

  const supabase = createServiceClient();

  const { data: mailing, error: findError } = await supabase
    .from("mailings")
    .select("id, status, user_id, letter_id")
    .eq("id", mailingId)
    .maybeSingle();

  if (findError || !mailing) {
    console.error("confirmMailingSend: mailing not found:", findError);
    return { ok: false, error: "Courrier introuvable." };
  }

  if (mailing.user_id !== user.id) {
    return { ok: false, error: "Accès refusé." };
  }

  // Idempotent : si déjà soumis ou en cours d'envoi, on retourne ok sans action
  if (mailing.status !== "paid") {
    revalidatePath(`/preview/${mailing.letter_id}`);
    return { ok: true };
  }

  try {
    await submitMailingToProvider(mailingId);
  } catch (err) {
    // submitMailingToProvider ne devrait pas throw (gère ses erreurs en interne
    // et passe le mailing à `failed`). Filet de sécurité.
    console.error(
      `confirmMailingSend: unexpected throw from submitMailingToProvider(${mailingId}):`,
      err
    );
  }

  revalidatePath(`/preview/${mailing.letter_id}`);
  return { ok: true };
}
