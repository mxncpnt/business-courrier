/**
 * Soumission d'un mailing au provider postal après paiement Stripe.
 *
 * Flow :
 *  1. Récupère le mailing + letter en DB
 *  2. Génère le PDF principal du courrier (via @react-pdf/renderer)
 *  3. Télécharge les pièces jointes depuis Supabase Storage et merge avec
 *     pdf-lib (cf. `lib/mailings/merge.ts`)
 *  4. Appelle provider.submitMailing()
 *  5. Update mailings.provider_mailing_id, status, submitted_at
 *
 * Erreur non-bloquante : si submit échoue, on logge + on marque le mailing
 * comme `failed` mais on ne throw pas (le webhook Stripe doit retourner 200).
 * Phase 4.4 ajoutera un cron de retry sur les mailings paid sans submit OK.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { getMailProvider } from "@/lib/mailings/mysendingbox";
import { mergePdfWithAttachments, type DbAttachment } from "@/lib/mailings/merge";
import { generatePdfBuffer } from "@/lib/pdf";
import { getLetterType } from "@/config/letter-types";
import type { MailingMode } from "@/config/mailings";
import type { PostalAddress } from "@/lib/mailings/provider";

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
