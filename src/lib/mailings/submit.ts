/**
 * Soumission d'un mailing au provider postal après paiement Stripe.
 *
 * Flow :
 *  1. Récupère le mailing + letter en DB
 *  2. Génère le PDF principal du courrier (via @react-pdf/renderer)
 *  3. Télécharge les pièces jointes depuis Supabase Storage
 *  4. Merge avec pdf-lib (PDF + JPG/PNG → PDF unique)
 *  5. Appelle provider.submitMailing()
 *  6. Update mailings.provider_mailing_id, status, submitted_at
 *
 * Erreur non-bloquante : si submit échoue, on logge + on marque le mailing
 * comme `failed` mais on ne throw pas (le webhook Stripe doit retourner 200).
 * Phase 4.4 ajoutera un cron de retry sur les mailings paid sans submit OK.
 */

import { PDFDocument } from "pdf-lib";
import { createServiceClient } from "@/lib/supabase/server";
import { getMailProvider } from "@/lib/mailings/mysendingbox";
import { generatePdfBuffer } from "@/lib/pdf";
import { getLetterType } from "@/config/letter-types";
import type { MailingMode } from "@/config/mailings";
import type { PostalAddress } from "@/lib/mailings/provider";

const STORAGE_BUCKET = "mailings";

interface DbAttachment {
  name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
}

type SupabaseClient = ReturnType<typeof createServiceClient>;

/**
 * Merge le PDF principal avec les pièces jointes (PDF, JPEG, PNG).
 * Les images sont placées chacune sur une page A4 avec marges 50pt.
 *
 * Erreur sur une PJ → log + skip cette PJ, le merge continue avec les autres.
 */
async function mergePdfWithAttachments(
  primaryPdf: Buffer,
  attachments: DbAttachment[],
  supabase: SupabaseClient
): Promise<Buffer> {
  const merged = await PDFDocument.load(new Uint8Array(primaryPdf));

  for (const att of attachments) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(att.storage_path);
      if (error || !data) {
        console.error(`Failed to download attachment ${att.storage_path}:`, error);
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
        console.warn(`Unsupported attachment mime_type: ${att.mime_type}`);
      }
    } catch (err) {
      console.error(`Error merging attachment ${att.storage_path}:`, err);
      // Continue avec les PJ suivantes — non-bloquant
    }
  }

  const out = await merged.save();
  return Buffer.from(out);
}

type EmbeddedImage = Awaited<ReturnType<PDFDocument["embedJpg"]>>;

/** Ajoute une page A4 (595 × 842 pt) avec l'image centrée et scalée pour rentrer. */
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
 * Soumet un mailing au provider postal.
 *
 * À appeler depuis le webhook Stripe après réception de checkout.session.completed.
 * Wrappée dans try/catch côté appelant — ne throw jamais (sécurité webhook).
 */
export async function submitMailingToProvider(mailingId: string): Promise<void> {
  const supabase = createServiceClient();

  // 1. Récupérer le mailing
  const { data: mailing, error: mailingError } = await supabase
    .from("mailings")
    .select("*")
    .eq("id", mailingId)
    .single();

  if (mailingError || !mailing) {
    console.error(`submitMailingToProvider: mailing ${mailingId} not found`, mailingError);
    return;
  }

  if (mailing.status !== "paid") {
    console.warn(
      `submitMailingToProvider: mailing ${mailingId} status='${mailing.status}' (expected 'paid'), skipping`
    );
    return;
  }

  try {
    // 2. Récupérer la letter associée
    const { data: letter, error: letterError } = await supabase
      .from("letters")
      .select("generated_text, type, form_data")
      .eq("id", mailing.letter_id)
      .single();

    if (letterError || !letter) {
      throw new Error(`Letter ${mailing.letter_id} not found`);
    }

    const letterType = getLetterType(letter.type);

    // 3. Générer le PDF principal du courrier (norme AFNOR)
    const pdfBuffer = await generatePdfBuffer({
      text: letter.generated_text || "",
      letterId: mailing.letter_id,
      formData: letter.form_data as Record<string, string> | undefined,
      letterTitle: letterType?.title,
    });

    // 4. Merger avec les pièces jointes si présentes
    const attachments = (mailing.attachments ?? []) as DbAttachment[];
    const finalPdfBuffer =
      attachments.length > 0
        ? await mergePdfWithAttachments(pdfBuffer, attachments, supabase)
        : pdfBuffer;

    // 5. Construire les PostalAddress depuis le snapshot DB
    const sender: PostalAddress = {
      name: mailing.sender_name,
      addressLine1: mailing.sender_address_line1,
      addressLine2: mailing.sender_address_line2 ?? undefined,
      zipcode: mailing.sender_zipcode,
      city: mailing.sender_city,
      country: mailing.sender_country,
    };
    const recipient: PostalAddress = {
      name: mailing.recipient_name,
      addressLine1: mailing.recipient_address_line1,
      addressLine2: mailing.recipient_address_line2 ?? undefined,
      zipcode: mailing.recipient_zipcode,
      city: mailing.recipient_city,
      country: mailing.recipient_country,
    };

    // 6. Appeler le provider
    const provider = getMailProvider();
    const result = await provider.submitMailing({
      mode: mailing.mode as MailingMode,
      sender,
      recipient,
      pdfBuffer: finalPdfBuffer,
      internalMailingId: mailing.id,
    });

    // 7. Update mailing en DB
    const { error: updateError } = await supabase
      .from("mailings")
      .update({
        provider_mailing_id: result.providerMailingId,
        tracking_number: result.trackingNumber ?? null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
        last_event_at: new Date().toISOString(),
        last_event_status: "submitted",
      })
      .eq("id", mailing.id);

    if (updateError) {
      console.error(`Failed to update mailing ${mailingId} after submit:`, updateError);
    } else {
      console.log(
        `Mailing ${mailingId} submitted to MSB. Provider ID: ${result.providerMailingId}`
      );
    }
  } catch (err) {
    console.error(`submitMailingToProvider: failed for mailing ${mailingId}:`, err);

    // Marquer comme failed (mais pas de throw, on est en fire-and-forget)
    const errorMsg =
      err instanceof Error ? err.message.slice(0, 200) : "unknown error";
    await supabase
      .from("mailings")
      .update({
        status: "failed",
        last_event_at: new Date().toISOString(),
        last_event_status: `submit_error: ${errorMsg}`,
      })
      .eq("id", mailingId);
  }
}
