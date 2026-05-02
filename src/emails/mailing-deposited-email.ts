/**
 * Email envoyé sur événement MSB `letter.filing_proof` (preuve de dépôt
 * disponible). Confirme la prise en charge à La Poste.
 *
 * Déclenché pour TOUS les modes (verte + lrar). Wording adapté :
 *   - Mode "simple"      → distribution sous 3 jours ouvrés, pas de tracking
 *   - Mode "registered"  → tracking number + AR à venir si LRAR
 */

import type { MailingMode } from "@/config/mailings";
import {
  jc,
  escHtml,
  renderCtaButton,
  renderCallout,
  renderEmailShell,
  renderTextShell,
} from "./_layout";

interface MailingDepositedEmailData {
  letterTitle: string;
  mailingMode: MailingMode;
  /** Numéro de suivi La Poste — fourni à filing_proof pour LR/LRAR. */
  trackingNumber?: string;
  /** URL S3 de la preuve de dépôt PDF — toujours présente à filing_proof. */
  proofOfDepositUrl?: string;
  /** URL absolue vers `/mailings/[id]` côté app — fallback CTA. */
  mailingPageUrl: string;
}

export function renderMailingDepositedEmail(data: MailingDepositedEmailData): {
  html: string;
  text: string;
} {
  const {
    letterTitle,
    mailingMode,
    trackingNumber,
    proofOfDepositUrl,
    mailingPageUrl,
  } = data;

  const headline = "Votre courrier a été déposé à La Poste";
  const subject = `Votre courrier est parti — ${letterTitle}`;

  // ─── Intro ───────────────────────────────────────────────────────────────

  const deliveryHint =
    mailingMode === "registered"
      ? "Distribution sous 2 à 5 jours ouvrés. Vous recevrez une notification dès remise au destinataire."
      : "Distribution sous 3 jours ouvrés en France métropolitaine.";

  const introHtml = `Votre courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> a bien été remis à La Poste pour acheminement. ${deliveryHint}`;

  const introText = `Votre courrier "${letterTitle}" a bien été remis à La Poste pour acheminement. ${deliveryHint}`;

  // ─── CTA : preuve de dépôt si dispo, sinon page de suivi ────────────────

  const ctaLabel = proofOfDepositUrl
    ? "Télécharger la preuve de dépôt"
    : "Voir le suivi";
  const ctaUrl = proofOfDepositUrl ?? mailingPageUrl;

  // ─── Bloc tracking (LR/LRAR uniquement) ──────────────────────────────────

  const trackingHtml = trackingNumber
    ? `<p style="margin:0 0 6px;font-size:14px;color:${jc.inkSoft};line-height:1.6;"><strong style="color:${jc.ink};">Numéro de suivi&nbsp;:</strong> ${escHtml(trackingNumber)}</p>
       <p style="margin:0;font-size:13px;color:${jc.inkMuted};line-height:1.6;">Vous pouvez aussi suivre votre envoi sur <a href="https://www.laposte.fr/outils/suivre-vos-envois?code=${escHtml(trackingNumber)}" style="color:${jc.accent};">laposte.fr</a>.</p>`
    : "";

  const trackingText = trackingNumber
    ? `\nNuméro de suivi : ${trackingNumber}\nSuivi La Poste : https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}\n`
    : "";

  // ─── Conseils ────────────────────────────────────────────────────────────

  const bullets =
    mailingMode === "registered"
      ? [
          "La preuve de dépôt PDF (jointe à ce mail via le bouton) fait foi de la date d'envoi.",
          "Vous recevrez une notification automatique dès la remise au destinataire.",
          "L'accusé de réception signé scanné vous sera transmis par email dès retour.",
        ]
      : [
          "La preuve de dépôt PDF est disponible en téléchargement.",
          "Aucun suivi de distribution n'est disponible pour la lettre verte (envoi non recommandé).",
          "Si le destinataire conteste la réception, conservez la preuve de dépôt comme élément de bonne foi.",
        ];

  const conseilsBodyHtml = bullets
    .map(
      (b, idx) =>
        `<p style="margin:${idx === 0 ? "8px 0 6px" : idx === bullets.length - 1 ? "0" : "0 0 6px"};font-size:14px;color:${jc.inkSoft};line-height:1.6;">• ${escHtml(b)}</p>`
    )
    .join("\n");

  const conseilsText = bullets.map((b) => `- ${b}`).join("\n");

  // ─── Composition HTML ────────────────────────────────────────────────────

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:${jc.ink};font-family:Georgia,serif;">${escHtml(headline)}</p>

    <p style="margin:0 0 24px;font-size:16px;color:${jc.inkSoft};line-height:1.6;">
      ${introHtml}
    </p>

    ${renderCtaButton({ label: ctaLabel, url: ctaUrl })}

    ${
      trackingHtml
        ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td>${trackingHtml}</td></tr></table>`
        : ""
    }

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    ${renderCallout({ title: "À retenir", bodyHtml: conseilsBodyHtml })}
  `;

  const html = renderEmailShell({ subject, contentHtml });

  const contentText = `JusteCourrier — ${headline}

${introText}
${trackingText}
${proofOfDepositUrl ? "Preuve de dépôt :" : "Voir le suivi :"}
${ctaUrl}

---
À retenir :
${conseilsText}`;

  const text = renderTextShell({ contentText });

  return { html, text };
}
