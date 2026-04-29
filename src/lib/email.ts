import { Resend } from "resend";
import {
  renderConfirmationEmail,
  type AttachmentSummary,
} from "@/emails/confirmation-email";
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Fonctions publiques
// ---------------------------------------------------------------------------

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

  const resend = getResend();
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

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}
