import { Resend } from "resend";
import {
  renderConfirmationEmail,
  type AttachmentSummary,
} from "@/emails/confirmation-email";
import { renderMailingDepositedEmail } from "@/emails/mailing-deposited-email";
import { renderMailingDeliveredEmail } from "@/emails/mailing-delivered-email";
import { renderMailingReceiptSignedEmail } from "@/emails/mailing-receipt-signed-email";
import { renderMailingFailedEmail } from "@/emails/mailing-failed-email";
import { renderMailingPendingConfirmEmail } from "@/emails/mailing-pending-confirm-email";
import type { MailingMode } from "@/config/mailings";

// ---------------------------------------------------------------------------
// Initialisation Resend (lazy — évite le crash au build si la clé est absente)
// ---------------------------------------------------------------------------

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "Missing RESEND_API_KEY — add it to .env.local and to Vercel environment variables"
      );
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// ---------------------------------------------------------------------------
// Adresse expéditeur — domaine vérifié dans Resend (justecourrier.fr)
// ---------------------------------------------------------------------------

const FROM_ADDRESS = "JusteCourrier <noreply@justecourrier.fr>";

/**
 * Wrapper centralisé sur `resend.emails.send` — uniformise le `from`,
 * le mapping d'erreurs et le logging.
 */
async function sendViaResend(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

// ===========================================================================
// 1. Email de confirmation après paiement Stripe (existant)
// ===========================================================================

interface SendConfirmationEmailParams {
  /** Email du destinataire (acheteur du courrier) */
  to: string;
  /** Titre du type de courrier, ex: "Résiliation d'abonnement" */
  letterTitle: string;
  /** UUID du courrier en base */
  letterId: string;
  /** URL complète de téléchargement du PDF */
  downloadUrl: string;
  /**
   * Mode d'envoi commandé. undefined = PDF only.
   * Si défini, le contenu de l'email est adapté (sujet + texte).
   */
  mailingMode?: MailingMode;
  /**
   * Liste des PJ incluses dans l'envoi (pertinent uniquement si mailingMode
   * est défini). Affichées dans une section "Inclus dans l'envoi".
   */
  attachments?: AttachmentSummary[];
}

/**
 * Envoie l'email de confirmation après paiement Stripe.
 * Contient le lien de téléchargement du PDF.
 *
 * @throws si Resend retourne une erreur (à catcher côté appelant)
 */
export async function sendConfirmationEmail(
  params: SendConfirmationEmailParams
): Promise<void> {
  const { to, letterTitle, letterId, downloadUrl, mailingMode, attachments } =
    params;

  const { html, text } = renderConfirmationEmail({
    letterTitle,
    letterId,
    downloadUrl,
    mailingMode,
    attachments,
  });

  const subject = mailingMode
    ? `Votre courrier part à La Poste — ${letterTitle}`
    : `Votre courrier est prêt — ${letterTitle}`;

  await sendViaResend({ to, subject, html, text });
}

// ===========================================================================
// 2. Emails postaux MSB — déclenchés depuis /api/mailings-webhook
// ===========================================================================

interface SendMailingDepositedEmailParams {
  to: string;
  letterTitle: string;
  mailingMode: MailingMode;
  trackingNumber?: string;
  proofOfDepositUrl?: string;
  mailingPageUrl: string;
}

/**
 * Sur événement MSB `letter.filing_proof` : confirme le dépôt à La Poste.
 * Déclenché pour TOUS les modes (verte + lrar).
 */
export async function sendMailingDepositedEmail(
  params: SendMailingDepositedEmailParams
): Promise<void> {
  const { html, text } = renderMailingDepositedEmail(params);
  await sendViaResend({
    to: params.to,
    subject: `Votre courrier est parti — ${params.letterTitle}`,
    html,
    text,
  });
}

interface SendMailingDeliveredEmailParams {
  to: string;
  letterTitle: string;
  /** "registered" requis — la fonction n'est pas appelée pour mode "simple". */
  mailingMode: "registered";
  mailingPageUrl: string;
}

/**
 * Sur événement MSB `letter.distributed` : courrier remis au destinataire.
 * Déclenché UNIQUEMENT pour mode `registered`.
 */
export async function sendMailingDeliveredEmail(
  params: SendMailingDeliveredEmailParams
): Promise<void> {
  const { html, text } = renderMailingDeliveredEmail(params);
  await sendViaResend({
    to: params.to,
    subject: `Votre courrier a été remis — ${params.letterTitle}`,
    html,
    text,
  });
}

interface SendMailingReceiptSignedEmailParams {
  to: string;
  letterTitle: string;
  proofOfReceiptUrl: string;
  mailingPageUrl: string;
}

/**
 * Sur événement MSB `letter.delivery_proof` : AR signé scanné disponible.
 * LRAR uniquement.
 */
export async function sendMailingReceiptSignedEmail(
  params: SendMailingReceiptSignedEmailParams
): Promise<void> {
  const { html, text } = renderMailingReceiptSignedEmail(params);
  await sendViaResend({
    to: params.to,
    subject: `Accusé de réception signé — ${params.letterTitle}`,
    html,
    text,
  });
}

interface SendMailingFailedEmailParams {
  to: string;
  letterTitle: string;
  eventType: "letter.returned_to_sender" | "letter.wrong_address";
  mailingPageUrl: string;
}

/**
 * Sur événement MSB `letter.returned_to_sender` ou `letter.wrong_address` :
 * courrier non distribué.
 */
export async function sendMailingFailedEmail(
  params: SendMailingFailedEmailParams
): Promise<void> {
  const { html, text } = renderMailingFailedEmail(params);
  await sendViaResend({
    to: params.to,
    subject: `Courrier non distribué — ${params.letterTitle}`,
    html,
    text,
  });
}

interface SendMailingPendingConfirmEmailParams {
  to: string;
  letterTitle: string;
  /** URL absolue vers `/preview/[letterId]` */
  previewUrl: string;
}

/**
 * Rappel envoyé à T+12h après paiement quand le mailing est toujours en
 * attente de confirmation utilisateur (status='paid', pas encore submit).
 * Déclenché par le cron `/api/cron/process-pending-mailings`.
 */
export async function sendMailingPendingConfirmEmail(
  params: SendMailingPendingConfirmEmailParams
): Promise<void> {
  const { html, text } = renderMailingPendingConfirmEmail(params);
  await sendViaResend({
    to: params.to,
    subject: `Votre courrier est prêt — confirmez l'envoi — ${params.letterTitle}`,
    html,
    text,
  });
}
