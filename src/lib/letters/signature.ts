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

// Seuils pour le détourage de la signature (lib `sharp`). Calibrés pour des
// signatures scannées au stylo noir/bleu sur papier blanc/légèrement teinté.
//
// Algorithme :
//   - Convertit en grayscale (canal unique 0=noir → 255=blanc)
//   - Pour chaque pixel :
//       * v ≥ HIGH (180)    : alpha = 0       → transparent (fond papier)
//       * v ≤ LOW  (30)     : alpha = 255     → opaque (encre la plus sombre)
//       * sinon             : alpha interpolé → bord adouci (anti-aliasing)
//   - Sortie : PNG noir sur fond transparent
//
// À recalibrer si on observe que la signature perd ses détails (HIGH trop
// bas) ou que le fond reste visible (HIGH trop haut). Sur un scan classique
// au stylo noir, 180 est un bon point.

const SIGNATURE_THRESHOLD_HIGH = 180;
const SIGNATURE_THRESHOLD_LOW = 30;

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
 * Télécharge la signature de l'user, applique un détourage (encre noire sur
 * fond transparent), et retourne un Buffer PNG utilisable par
 * `@react-pdf/renderer`.
 *
 * Le traitement est fait à chaque appel (≈200ms par signature) plutôt qu'au
 * moment de l'upload. Avantages : on garde l'image source intacte côté
 * Storage (utile pour le preview HTML, et permet de re-traiter avec un
 * meilleur algo plus tard sans re-demander à l'user).
 *
 * Retourne null si l'user n'a pas de signature ou si le Storage/processing
 * échoue.
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
  const sourceBuffer = Buffer.from(arrayBuffer);

  try {
    return await processSignatureForPdf(sourceBuffer);
  } catch (err) {
    console.error(
      `getSignatureBuffer: processing failed for ${info.storagePath}:`,
      err
    );
    // Fallback : on renvoie l'image source non traitée plutôt que de perdre
    // la signature complètement. Sera moche mais visible.
    return sourceBuffer;
  }
}

/**
 * Détoure une signature scannée : fond papier (clair) → transparent, encre
 * (sombre) → noire opaque, bords interpolés (anti-aliasing).
 *
 * Implémentation via `sharp.raw()` + manipulation pixel-par-pixel pour
 * construire un canal alpha à partir du grayscale.
 */
export async function processSignatureForPdf(input: Buffer): Promise<Buffer> {
  // 1. Charger en grayscale + normaliser le contraste pour les scans pâles
  const greyscale = sharp(input).greyscale().normalise();

  // 2. Récupérer la matrice de pixels brute (1 octet/pixel)
  const { data: greyData, info } = await greyscale
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 3. Construire un buffer RGBA : pixels noirs + canal alpha selon le grey
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < greyData.length; i++) {
    const v = greyData[i];
    let alpha: number;
    if (v >= SIGNATURE_THRESHOLD_HIGH) {
      alpha = 0;
    } else if (v <= SIGNATURE_THRESHOLD_LOW) {
      alpha = 255;
    } else {
      // Interpolation linéaire entre LOW et HIGH pour adoucir les bords
      alpha = Math.round(
        (255 * (SIGNATURE_THRESHOLD_HIGH - v)) /
          (SIGNATURE_THRESHOLD_HIGH - SIGNATURE_THRESHOLD_LOW)
      );
    }
    const idx = i * 4;
    rgba[idx] = 0; // R (noir)
    rgba[idx + 1] = 0; // G
    rgba[idx + 2] = 0; // B
    rgba[idx + 3] = alpha;
  }

  // 4. Reconstruire en PNG depuis le buffer RGBA brut
  return await sharp(rgba, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
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
