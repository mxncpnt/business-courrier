/**
 * Utilitaire de merge PDF + pièces jointes via pdf-lib.
 *
 * Utilisé dans deux contextes :
 *   1. `submitMailingToProvider` (lib/mailings/submit.ts) — pour envoyer le PDF
 *      complet à MSB lors de la soumission.
 *   2. `/api/download/[id]` — pour que le PDF téléchargé par l'utilisateur
 *      corresponde exactement à ce qui a été posté à La Poste (option A,
 *      validée 2026-04-28). Cohérence + preuve juridique.
 *
 * Comportement :
 *   - PDF principal : chargé tel quel (le courrier AFNOR généré).
 *   - Chaque PJ téléchargée depuis Supabase Storage et ajoutée :
 *     · MIME application/pdf → toutes les pages copiées et ajoutées
 *     · MIME image/jpeg ou image/png → embed sur une page A4 marges 50pt
 *   - Erreur sur une PJ → log + skip cette PJ, le merge continue.
 */

import { PDFDocument } from "pdf-lib";
import { createServiceClient } from "@/lib/supabase/server";

const STORAGE_BUCKET = "mailings";

export interface DbAttachment {
  name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
}

/**
 * Compte le nombre de pages qu'occupera un fichier dans le PDF mergé.
 *
 * Convention :
 *   - PDF : nombre de pages réel (via pdf-lib)
 *   - JPG/PNG : 1 page (le merge embed l'image sur 1 page A4)
 *   - Erreur de parse : 1 page (fallback conservateur)
 *
 * Utilisé pour la limite `MAX_MERGED_PAGES` (cf. config/mailings.ts) :
 * empêcher l'upload de PJ qui feraient déborder le total > 5 pages.
 */
export async function countPagesInBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<number> {
  if (mimeType === "application/pdf") {
    try {
      const pdf = await PDFDocument.load(new Uint8Array(buffer));
      return pdf.getPageCount();
    } catch (err) {
      console.warn("countPagesInBuffer: PDF parse failed:", err);
      return 1;
    }
  }
  // Image : 1 page A4 dans le merge
  return 1;
}

type SupabaseClient = ReturnType<typeof createServiceClient>;
type EmbeddedImage = Awaited<ReturnType<PDFDocument["embedJpg"]>>;

/**
 * Ajoute une page A4 (595 × 842 pt) avec l'image centrée et scalée pour rentrer
 * dans les marges (50pt de chaque côté).
 */
function addImagePage(merged: PDFDocument, image: EmbeddedImage): void {
  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const MARGIN = 50;
  const maxWidth = PAGE_WIDTH - MARGIN * 2;
  const maxHeight = PAGE_HEIGHT - MARGIN * 2;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const w = image.width * scale;
  const h = image.height * scale;
  const page = merged.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawImage(image, {
    x: (PAGE_WIDTH - w) / 2,
    y: (PAGE_HEIGHT - h) / 2,
    width: w,
    height: h,
  });
}

/**
 * Merge le PDF principal avec les pièces jointes (PDF, JPEG, PNG).
 * Erreur sur une PJ → log + skip cette PJ, le merge continue avec les autres.
 *
 * @param primaryPdf Buffer du PDF principal (courrier AFNOR)
 * @param attachments Liste des PJ depuis le snapshot DB (mailings.attachments jsonb)
 * @param supabase Client Supabase pour télécharger les PJ depuis Storage. Si non
 *                 fourni, un client service par défaut est utilisé.
 */
export async function mergePdfWithAttachments(
  primaryPdf: Buffer,
  attachments: DbAttachment[],
  supabase?: SupabaseClient
): Promise<Buffer> {
  const sb = supabase ?? createServiceClient();
  const merged = await PDFDocument.load(new Uint8Array(primaryPdf));

  for (const att of attachments) {
    try {
      const { data, error } = await sb.storage
        .from(STORAGE_BUCKET)
        .download(att.storage_path);
      if (error || !data) {
        console.error(
          `mergePdfWithAttachments: failed to download ${att.storage_path}:`,
          error
        );
        continue;
      }
      const bytes = new Uint8Array(await data.arrayBuffer());

      if (att.mime_type === "application/pdf") {
        const attDoc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(attDoc, attDoc.getPageIndices());
        for (const page of pages) merged.addPage(page);
      } else if (att.mime_type === "image/jpeg") {
        const image = await merged.embedJpg(bytes);
        addImagePage(merged, image);
      } else if (att.mime_type === "image/png") {
        const image = await merged.embedPng(bytes);
        addImagePage(merged, image);
      } else {
        console.warn(
          `mergePdfWithAttachments: unsupported mime_type ${att.mime_type}`
        );
      }
    } catch (err) {
      console.error(
        `mergePdfWithAttachments: error processing ${att.storage_path}:`,
        err
      );
      // Continue avec les PJ suivantes — non-bloquant
    }
  }

  const out = await merged.save();
  return Buffer.from(out);
}
