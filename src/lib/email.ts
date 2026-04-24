import { Resend } from "resend";
import { renderConfirmationEmail } from "@/emails/confirmation-email";

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
// Adresse expéditeur
// Pendant les tests : "onboarding@resend.dev" fonctionne sans domaine vérifié,
// mais Resend limite les envois à l'email de votre compte uniquement.
// En prod : vérifier votre domaine dans Resend puis remplacer par :
//   "Courrier IA <noreply@votre-domaine.fr>"
// ---------------------------------------------------------------------------

const FROM_ADDRESS = "Courrier IA <onboarding@resend.dev>";
// TODO: const FROM_ADDRESS = "Courrier IA <noreply@courrier-ia.fr>";

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
  const { to, letterTitle, letterId, downloadUrl } = params;

  const resend = getResend();
  const { html, text } = renderConfirmationEmail({ letterTitle, letterId, downloadUrl });

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Votre courrier est prêt — ${letterTitle}`,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}
