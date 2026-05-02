/**
 * Helpers de lecture de la signature manuscrite globale d'un utilisateur.
 *
 * Une signature est stockée dans le bucket privé `signatures` à un path
 * `{user_id}/signature-{uuid}.{ext}`, et la référence est dans
 * `user_profiles.signature_storage_path` (NULL si pas de signature).
 *
 * Deux usages distincts :
 *   - `getSignatureBuffer(userId)` → buffer binaire pour intégration PDF
 *     côté serveur (utilisé par `lib/pdf.ts` via `submit.ts` et `download`).
 *   - `getSignatureSignedUrl(userId)` → URL signée temporaire (1h) pour
 *     l'aperçu HTML AFNOR sur `/preview/[id]` (la balise `<img>`).
 *
 * Les deux fonctions utilisent le `service_role` pour lire — l'auth a été
 * vérifiée en amont (par RLS sur `mailings`/`letters` ou par auth.uid() sur
 * la page profil). Au cas où le profil n'existe pas ou n'a pas de signature,
 * elles retournent `null` proprement.
 */

import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "signatures";
/** Durée de vie des signed URLs pour le preview HTML (en secondes) — 1h. */
const SIGNED_URL_TTL = 60 * 60;

interface SignatureInfo {
  storagePath: string;
  uploadedAt: string | null;
}

/**
 * Lit le path et la date d'upload de la signature d'un user (NULL si pas de
 * signature). N'appelle pas le Storage — purement DB. Retourne null si
 * l'user n'a pas de profil ou pas de signature uploadée.
 */
export async function getSignatureInfo(
  userId: string
): Promise<SignatureInfo | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("signature_storage_path, signature_uploaded_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("getSignatureInfo: query failed", error);
    return null;
  }
  if (!data?.signature_storage_path) {
    return null;
  }
  return {
    storagePath: data.signature_storage_path,
    uploadedAt: data.signature_uploaded_at,
  };
}

/**
 * Télécharge la signature de l'user en Buffer binaire (utilisable par
 * `@react-pdf/renderer`). Retourne null si l'user n'a pas de signature ou
 * si le Storage retourne une erreur.
 */
export async function getSignatureBuffer(userId: string): Promise<Buffer | null> {
  const info = await getSignatureInfo(userId);
  if (!info) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(info.storagePath);

  if (error || !data) {
    console.error(
      `getSignatureBuffer: download failed for ${info.storagePath}:`,
      error
    );
    return null;
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Génère une signed URL temporaire vers la signature de l'user. Utilisée
 * dans le preview HTML AFNOR (balise `<img src>`). Retourne null si pas
 * de signature.
 */
export async function getSignatureSignedUrl(
  userId: string
): Promise<string | null> {
  const info = await getSignatureInfo(userId);
  if (!info) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(info.storagePath, SIGNED_URL_TTL);

  if (error || !data?.signedUrl) {
    console.error(
      `getSignatureSignedUrl: signed URL failed for ${info.storagePath}:`,
      error
    );
    return null;
  }

  return data.signedUrl;
}
