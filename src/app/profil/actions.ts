"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { processSignatureForPdf } from "@/lib/letters/signature";

const BUCKET = "signatures";
const MAX_BYTES = 1_048_576; // 1 Mo
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg"]);

interface ActionError {
  ok: false;
  error: string;
}

// ─── 1. uploadSignatureImage ────────────────────────────────────────────────
//
// Upload d'une image PNG/JPG depuis le composant SignatureUpload (drop zone).
// Valide MIME + taille, génère un path `{user_id}/signature-{uuid}.{ext}`,
// upload via service_role, et UPSERT le `user_profiles.signature_storage_path`.
//
// Idempotence : si l'user avait déjà une signature, on supprime l'ancienne
// du Storage après l'upload réussi de la nouvelle (pas avant — éviter perte
// si l'upload échoue).

export async function uploadSignatureImage(
  formData: FormData
): Promise<{ ok: true } | ActionError> {
  // Auth
  const auth = await createAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { ok: false, error: "Vous devez être connecté pour uploader une signature." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Aucun fichier reçu." };
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      error: `Format non supporté (${file.type || "inconnu"}). Formats acceptés : PNG, JPEG.`,
    };
  }

  if (file.size > MAX_BYTES) {
    const sizeMo = (file.size / 1024 / 1024).toFixed(2);
    return {
      ok: false,
      error: `Fichier trop volumineux (${sizeMo} Mo). Max 1 Mo.`,
    };
  }

  const supabase = createServiceClient();

  // Récupère l'éventuelle signature existante pour cleanup ultérieur
  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("signature_storage_path")
    .eq("id", user.id)
    .maybeSingle();

  const oldPath = existingProfile?.signature_storage_path ?? null;

  // Path : user_id/signature-{uuid}.png. Toujours PNG car on traite l'image
  // (détourage fond → transparent) avant de stocker. UUID pour invalider le
  // cache CDN au remplacement.
  const newPath = `${user.id}/signature-${randomUUID()}.png`;

  // Traitement : détourage du fond papier, encre noire sur transparent.
  // On fait ça à l'upload (≈300ms) plutôt qu'à chaque génération PDF —
  // gain de perf et même image pour preview HTML et PDF.
  const sourceBuffer = Buffer.from(await file.arrayBuffer());
  let processedBuffer: Buffer;
  try {
    processedBuffer = await processSignatureForPdf(sourceBuffer);
  } catch (err) {
    console.error("uploadSignatureImage: processing failed", err);
    return {
      ok: false,
      error:
        "Erreur lors du traitement de la signature. Vérifiez que l'image n'est pas corrompue.",
    };
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(newPath, new Uint8Array(processedBuffer), {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    console.error("uploadSignatureImage: upload failed", uploadError);
    return { ok: false, error: "Erreur lors de l'upload du fichier." };
  }

  // UPSERT user_profiles
  const { error: upsertError } = await supabase
    .from("user_profiles")
    .upsert(
      {
        id: user.id,
        signature_storage_path: newPath,
        signature_uploaded_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (upsertError) {
    // L'upload a marché mais l'update DB a échoué → on tente de cleaner
    // la nouvelle signature pour ne pas laisser un orphelin
    await supabase.storage.from(BUCKET).remove([newPath]).catch(() => {});
    console.error("uploadSignatureImage: profile upsert failed", upsertError);
    return { ok: false, error: "Erreur lors de l'enregistrement du profil." };
  }

  // Cleanup ancienne signature (best-effort, on log mais on n'échoue pas)
  if (oldPath) {
    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove([oldPath]);
    if (removeError) {
      console.warn(
        `uploadSignatureImage: failed to remove old signature ${oldPath}:`,
        removeError
      );
    }
  }

  revalidatePath("/profil");
  return { ok: true };
}

// ─── 2. removeSignature ─────────────────────────────────────────────────────
//
// Supprime la signature de l'user (Storage + reset des colonnes).

export async function removeSignature(): Promise<{ ok: true } | ActionError> {
  const auth = await createAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { ok: false, error: "Vous devez être connecté." };
  }

  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("signature_storage_path")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.signature_storage_path) {
    // Idempotent — pas de signature à supprimer
    revalidatePath("/profil");
    return { ok: true };
  }

  // Reset DB d'abord (si l'user retente, il aura un état cohérent)
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      signature_storage_path: null,
      signature_uploaded_at: null,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("removeSignature: profile update failed", updateError);
    return { ok: false, error: "Erreur lors de la suppression." };
  }

  // Cleanup Storage (best-effort)
  const { error: removeError } = await supabase.storage
    .from(BUCKET)
    .remove([profile.signature_storage_path]);

  if (removeError) {
    console.warn(
      `removeSignature: failed to remove ${profile.signature_storage_path}:`,
      removeError
    );
    // On ne signale pas l'erreur à l'user : la DB est déjà nettoyée,
    // un fichier orphelin en Storage n'a pas d'impact pratique.
  }

  revalidatePath("/profil");
  return { ok: true };
}
