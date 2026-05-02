"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { getMailProvider } from "@/lib/mailings/mysendingbox";
import { AFNOR_MAX_CHARS } from "@/lib/letters/text";
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

  // Sanitize filename + ajoute UUID pour éviter collisions
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);
  const storagePath = `${letterId}/${randomUUID()}-${safeName}`;

  // Upload via service client (bypass RLS)
  const fileBuffer = await file.arrayBuffer();
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
    },
  };
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
