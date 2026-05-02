/**
 * Email envoyé sur événement MSB `letter.distributed`.
 *
 * Déclenché UNIQUEMENT pour `mode === "registered"` (LR/LRAR). Pour la lettre
 * verte, MSB ne remonte pas cet event de toute façon (pas de tracking).
 *
 * Pour LRAR : annonce que l'AR signé arrive sous 24-72h (l'event
 * `letter.delivery_proof` déclenchera l'email avec le lien AR signé).
 */

import {
  jc,
  escHtml,
  renderCtaButton,
  renderCallout,
  renderEmailShell,
  renderTextShell,
} from "./_layout";

interface MailingDeliveredEmailData {
  letterTitle: string;
  /** Mode "registered" requis (la fonction n'est pas appelée pour "simple"). */
  mailingMode: "registered";
  /** URL absolue vers `/mailings/[id]`. */
  mailingPageUrl: string;
}

export function renderMailingDeliveredEmail(data: MailingDeliveredEmailData): {
  html: string;
  text: string;
} {
  const { letterTitle, mailingPageUrl } = data;

  const headline = "Votre courrier a été remis";
  const subject = `Votre courrier a été remis — ${letterTitle}`;

  const introHtml = `Votre courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> a bien été remis au destinataire. L'accusé de réception signé sera disponible dans les 24 à 72 heures, et vous le recevrez automatiquement par email dès qu'il aura été scanné par La Poste.`;

  const introText = `Votre courrier "${letterTitle}" a bien été remis au destinataire. L'accusé de réception signé sera disponible dans les 24 à 72 heures, et vous le recevrez automatiquement par email dès qu'il aura été scanné par La Poste.`;

  const bullets = [
    "La date de remise constitue la date juridique de notification du courrier.",
    "Les délais légaux courant à compter de la remise (préavis, prescription) démarrent maintenant.",
    "L'AR signé scanné vous parviendra par email dès traitement par La Poste.",
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

    ${renderCtaButton({ label: "Voir le suivi", url: mailingPageUrl })}

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    ${renderCallout({ title: "À retenir", bodyHtml: conseilsBodyHtml })}
  `;

  const html = renderEmailShell({ subject, contentHtml });

  const contentText = `JusteCourrier — ${headline}

${introText}

Voir le suivi :
${mailingPageUrl}

---
À retenir :
${conseilsText}`;

  const text = renderTextShell({ contentText });

  return { html, text };
}
