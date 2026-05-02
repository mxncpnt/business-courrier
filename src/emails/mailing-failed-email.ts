/**
 * Email envoyé sur événement MSB `letter.returned_to_sender` ou
 * `letter.wrong_address`. Le courrier n'a pas atteint son destinataire.
 *
 * Wording adapté selon le type :
 *   - returned_to_sender : NPAI ou non retiré au bureau de poste après délai
 *   - wrong_address      : adresse non identifiée par La Poste (NPAI direct)
 *
 * Les deux cas convergent sur la même action user : vérifier l'adresse,
 * éventuellement renvoyer.
 */

import {
  jc,
  escHtml,
  renderCtaButton,
  renderCallout,
  renderEmailShell,
  renderTextShell,
} from "./_layout";

type FailedEventType =
  | "letter.returned_to_sender"
  | "letter.wrong_address";

interface MailingFailedEmailData {
  letterTitle: string;
  eventType: FailedEventType;
  /** URL absolue vers `/mailings/[id]` côté app. */
  mailingPageUrl: string;
}

export function renderMailingFailedEmail(data: MailingFailedEmailData): {
  html: string;
  text: string;
} {
  const { letterTitle, eventType, mailingPageUrl } = data;

  const headline = "Votre courrier n'a pas pu être distribué";
  const subject = `Courrier non distribué — ${letterTitle}`;

  // ─── Intro adaptée à la cause ────────────────────────────────────────────

  const reasonHtml =
    eventType === "letter.wrong_address"
      ? `L'adresse du destinataire n'a pas pu être identifiée par La Poste (mention <strong style="color:${jc.ink};">N'habite Pas à l'Adresse Indiquée</strong>).`
      : `Le destinataire n'a pas retiré le courrier au bureau de poste dans le délai imparti, ou l'adresse n'a pas pu être desservie.`;

  const reasonText =
    eventType === "letter.wrong_address"
      ? "L'adresse du destinataire n'a pas pu être identifiée par La Poste (mention NPAI : N'habite Pas à l'Adresse Indiquée)."
      : "Le destinataire n'a pas retiré le courrier au bureau de poste dans le délai imparti, ou l'adresse n'a pas pu être desservie.";

  const introHtml = `Votre courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> a été retourné à l'expéditeur. ${reasonHtml}`;
  const introText = `Votre courrier "${letterTitle}" a été retourné à l'expéditeur. ${reasonText}`;

  // ─── Conseils ────────────────────────────────────────────────────────────

  const bullets = [
    "Vérifiez l'adresse du destinataire (orthographe, numéro de rue, code postal).",
    "Pour un courrier juridique (LRAR), conservez la preuve de tentative d'envoi : elle peut être opposée au destinataire qui aurait délibérément refusé le pli.",
    "Vous pouvez relancer un envoi depuis JusteCourrier en quelques clics, avec une adresse corrigée si besoin.",
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

    ${renderCtaButton({ label: "Voir le détail du suivi", url: mailingPageUrl })}

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    ${renderCallout({
      title: "Que faire ?",
      bodyHtml: conseilsBodyHtml,
      variant: "warning",
    })}
  `;

  const html = renderEmailShell({ subject, contentHtml });

  const contentText = `JusteCourrier — ${headline}

${introText}

Voir le détail du suivi :
${mailingPageUrl}

---
Que faire ?
${conseilsText}`;

  const text = renderTextShell({ contentText });

  return { html, text };
}
