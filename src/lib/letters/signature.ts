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

import sharp from "sharp";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "signatures";
/** Durée de vie des signed URLs pour le preview HTML (en secondes) — 1h. */
const SIGNED_URL_TTL = 60 * 60;

// Paramètres du détourage signature.
//
// Algorithme : high-pass filter + threshold adaptatif local.
//   1. Greyscale + normalize contraste
//   2. Calcul d'un "fond local" estimé via blur Gaussien (sigma proportionnel
//      à la taille image). Capture les variations lentes d'éclairage.
//   3. Diff par pixel : `bg - src` → positif si pixel plus sombre que son
//      voisinage. Capture les traits de stylo (variations rapides).
//   4. Threshold sur le diff :
//      * diff < DIFF_LOW (25)         : alpha = 0       (transparent)
//      * diff ≥ DIFF_HIGH (80)        : alpha = 255     (encre opaque)
//      * sinon                        : alpha interpolé (anti-aliasing)
//
// Avantages vs threshold global naïf :
//   - Robuste aux gradients d'éclairage (photo iPhone non uniforme, ombre)
//   - Robuste aux fonds papiers teintés (jaune, beige, gris clair)
//   - Préserve les traits fins (encre légèrement diluée reste visible)
//
// À recalibrer si :
//   - Signature trop fine, perd des détails  → baisser DIFF_LOW
//   - Tâches du fond visibles                → monter DIFF_LOW

const DIFF_LOW = 25;
const DIFF_HIGH = 80;

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
 * Télécharge la signature de l'user (déjà traitée à l'upload, fond transparent).
 * Retourne null si l'user n'a pas de signature.
 *
 * Note : le traitement (détourage) est fait UNE FOIS à l'upload via
 * `processSignatureForPdf` puis stocké tel quel. Cette fonction se contente
 * de relire le PNG transparent.
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
 * Détoure une signature scannée/photographiée : fond papier → transparent,
 * encre → noire opaque, bords adoucis (anti-aliasing).
 *
 * Algorithme high-pass + threshold adaptatif (résistant aux gradients
 * d'éclairage et aux papiers teintés) :
 *   1. Greyscale + normalise (étire le contraste sur 0-255)
 *   2. Blur Gaussien sigma proportionnel à la taille → estime le "fond local"
 *   3. Pour chaque pixel : `diff = bg - src` (positif si plus sombre que voisin)
 *   4. Threshold sur `diff` → canal alpha (0/255 ou interpolation entre)
 *   5. Sortie PNG RGBA (noir + alpha calculé)
 *
 * Performance : ~200-500ms pour une signature 1000×500. Appelé UNE FOIS à
 * l'upload — pas à chaque génération PDF.
 */
export async function processSignatureForPdf(input: Buffer): Promise<Buffer> {
  // 1. Image source en grayscale + contraste normalisé
  const sourcePipeline = sharp(input).greyscale().normalise();
  const { data: sourceData, info } = await sourcePipeline
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // 2. Estimation "fond local" : blur Gaussien avec sigma calibré sur la
  //    plus petite dimension de l'image. ~3% de la taille = bon compromis
  //    pour ne pas effacer les boucles fines de signature mais bien lisser
  //    le gradient d'éclairage.
  const blurSigma = Math.max(8, Math.min(width, height) * 0.03);
  const blurredData = await sharp(input)
    .greyscale()
    .normalise()
    .blur(blurSigma)
    .raw()
    .toBuffer();

  // 3. Construire le buffer RGBA pixel-par-pixel
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < sourceData.length; i++) {
    const src = sourceData[i];
    const bg = blurredData[i];
    // Différence : positif si le pixel est plus sombre que le fond local
    const diff = bg - src;

    let alpha: number;
    if (diff < DIFF_LOW) {
      alpha = 0; // pixel proche ou plus clair que voisinage = fond
    } else if (diff >= DIFF_HIGH) {
      alpha = 255; // beaucoup plus sombre = encre franche
    } else {
      alpha = Math.round(
        (255 * (diff - DIFF_LOW)) / (DIFF_HIGH - DIFF_LOW)
      );
    }

    const idx = i * 4;
    rgba[idx] = 0; // R noir
    rgba[idx + 1] = 0; // G
    rgba[idx + 2] = 0; // B
    rgba[idx + 3] = alpha;
  }

  // 4. Encoder en PNG depuis le RGBA brut
  return await sharp(rgba, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();
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
