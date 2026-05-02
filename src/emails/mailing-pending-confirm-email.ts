/**
 * Email rappel envoyé à T+12h après paiement quand l'utilisateur n'a pas
 * encore cliqué "Confirmer et envoyer à La Poste" sur `/preview/[id]`.
 *
 * Mailing toujours en statut `paid` (pas encore submitted). L'email rappelle
 * que :
 *   - Le paiement est validé
 *   - Le courrier est prêt mais n'est pas encore parti
 *   - L'utilisateur peut relire/éditer puis confirmer manuellement
 *   - Sans action, l'envoi sera déclenché automatiquement dans 12 heures
 *
 * Déclenché par le cron `/api/cron/process-pending-mailings`. Idempotent via
 * la colonne `mailings.reminder_sent_at` (NULL → on envoie + UPDATE,
 * non-NULL → skip).
 */

import {
  jc,
  escHtml,
  renderCtaButton,
  renderCallout,
  renderEmailShell,
  renderTextShell,
} from "./_layout";

interface MailingPendingConfirmEmailData {
  letterTitle: string;
  /** URL absolue vers `/preview/[letterId]` (CTA principal). */
  previewUrl: string;
}

export function renderMailingPendingConfirmEmail(
  data: MailingPendingConfirmEmailData
): {
  html: string;
  text: string;
} {
  const { letterTitle, previewUrl } = data;

  const headline = "Confirmez l'envoi de votre courrier";
  const subject = `Votre courrier est prêt — confirmez l'envoi`;

  const introHtml = `Votre paiement pour le courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> est bien validé. Le courrier est prêt à partir, mais nous attendons votre confirmation pour le déposer à La Poste.`;

  const introText = `Votre paiement pour le courrier "${letterTitle}" est bien validé. Le courrier est prêt à partir, mais nous attendons votre confirmation pour le déposer à La Poste.`;

  const bullets = [
    "Vous pouvez relire et modifier le texte sur la page de votre courrier avant l'envoi.",
    "Cliquez sur 'Confirmer et envoyer' pour déclencher l'envoi immédiatement.",
    "Sans action de votre part, l'envoi sera déclenché automatiquement dans les 12 prochaines heures.",
  ];

  const conseilsBodyHtml = bullets
    .map(
      (b, idx) =>
        `<p style="margin:${idx === 0 ? "8px 0 6px" : idx === bullets.length - 1 ? "0" : "0 0 6px"};font-size:14px;color:${jc.inkSoft};line-height:1.6;">• ${escHtml(b)}</p>`
    )
    .join("\n");

  const conseilsText = bullets.map((b) => `- ${b}`).join("\n");

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:${jc.ink};font-family:Georgia,serif;">${escHtml(headline)}</p>

    <p style="margin:0 0 24px;font-size:16px;color:${jc.inkSoft};line-height:1.6;">
      ${introHtml}
    </p>

    ${renderCtaButton({
      label: "Confirmer et envoyer",
      url: previewUrl,
    })}

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    ${renderCallout({
      title: "Comment ça marche",
      bodyHtml: conseilsBodyHtml,
    })}
  `;

  const html = renderEmailShell({ subject, contentHtml });

  const contentText = `JusteCourrier — ${headline}

${introText}

Confirmer et envoyer :
${previewUrl}

---
Comment ça marche :
${conseilsText}`;

  const text = renderTextShell({ contentText });

  return { html, text };
}
