/**
 * Email envoyé sur événement MSB `letter.delivery_proof` — l'AR signé scanné
 * est disponible. Pour LRAR uniquement (sans AR pas de signed proof).
 *
 * C'est le document juridiquement opposable. CTA principal = télécharger.
 */

import {
  jc,
  escHtml,
  renderCtaButton,
  renderCallout,
  renderEmailShell,
  renderTextShell,
} from "./_layout";

interface MailingReceiptSignedEmailData {
  letterTitle: string;
  /** URL S3 du PDF de l'AR signé scanné. */
  proofOfReceiptUrl: string;
  /** URL absolue vers `/mailings/[id]` côté app. */
  mailingPageUrl: string;
}

export function renderMailingReceiptSignedEmail(
  data: MailingReceiptSignedEmailData
): {
  html: string;
  text: string;
} {
  const { letterTitle, proofOfReceiptUrl, mailingPageUrl } = data;

  const headline = "Accusé de réception signé";
  const subject = `Accusé de réception signé — ${letterTitle}`;

  const introHtml = `L'accusé de réception de votre courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> a été signé et scanné par La Poste. Vous pouvez le télécharger ci-dessous : il fait foi en cas de contestation.`;

  const introText = `L'accusé de réception de votre courrier "${letterTitle}" a été signé et scanné par La Poste. Vous pouvez le télécharger ci-dessous : il fait foi en cas de contestation.`;

  const bullets = [
    "Conservez ce document avec une copie du courrier envoyé pour 5 ans (durée de prescription civile).",
    "Le PDF est aussi accessible à tout moment depuis votre espace JusteCourrier.",
    "En cas de litige, l'AR signé prouve la date et la qualité de la personne ayant reçu le courrier.",
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
      label: "Télécharger l'AR signé (PDF)",
      url: proofOfReceiptUrl,
    })}

    <p style="margin:0 0 24px;font-size:13px;color:${jc.inkMuted};">
      <a href="${escHtml(mailingPageUrl)}" style="color:${jc.accent};">Voir le suivi complet sur JusteCourrier</a>
    </p>

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    ${renderCallout({ title: "Conservation", bodyHtml: conseilsBodyHtml })}
  `;

  const html = renderEmailShell({ subject, contentHtml });

  const contentText = `JusteCourrier — ${headline}

${introText}

Télécharger l'AR signé :
${proofOfReceiptUrl}

Voir le suivi complet :
${mailingPageUrl}

---
Conservation :
${conseilsText}`;

  const text = renderTextShell({ contentText });

  return { html, text };
}
