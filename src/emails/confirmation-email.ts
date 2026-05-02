/**
 * Email de confirmation après paiement Stripe — déclenché depuis
 * `/api/stripe-webhook` une fois `checkout.session.completed`.
 *
 * Couvre 3 cas :
 *   - PDF only           : pas de mailing, conseils impression
 *   - Lettre simple      : mailing.mode === "simple"
 *   - LRAR               : mailing.mode === "registered"
 *
 * Le contenu (intro, CTA, conseils) est conditionné par `mailingMode`.
 * Layout (header logo, footer copyright) factorisé dans `_layout.ts`.
 */

import type { MailingMode } from "@/config/mailings";
import {
  jc,
  escHtml,
  formatBytes,
  renderCtaButton,
  renderCallout,
  renderEmailShell,
  renderTextShell,
} from "./_layout";

export interface AttachmentSummary {
  name: string;
  sizeBytes: number;
}

interface ConfirmationEmailData {
  letterTitle: string;
  letterId: string;
  downloadUrl: string;
  /** undefined = PDF only (l'utilisateur poste lui-même). */
  mailingMode?: MailingMode;
  /** PJ incluses dans l'envoi — pertinent uniquement si mailingMode défini. */
  attachments?: AttachmentSummary[];
}

export function renderConfirmationEmail(data: ConfirmationEmailData): {
  html: string;
  text: string;
} {
  const { letterTitle, letterId, downloadUrl, mailingMode, attachments } = data;
  const shortRef = letterId.substring(0, 8).toUpperCase();
  const hasAttachments = mailingMode && attachments && attachments.length > 0;

  // ─── Texte adapté au mode d'envoi ────────────────────────────────────────

  const headline = mailingMode
    ? "Votre courrier part à La Poste"
    : "Votre courrier est prêt";

  const subject = `${headline} — ${letterTitle}`;

  const introHtml = mailingMode
    ? `Votre paiement a bien été reçu. Le courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> sera déposé à La Poste sous 24h ouvrées.${mailingMode === "registered" ? " L'accusé de réception signé vous sera envoyé dès distribution." : ""} Une copie PDF est disponible en archive.`
    : `Votre paiement a bien été reçu. Votre courrier <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong> est disponible en téléchargement.`;

  const introText = mailingMode
    ? `Votre paiement a bien été reçu. Le courrier "${letterTitle}" sera déposé à La Poste sous 24h ouvrées.${mailingMode === "registered" ? " L'accusé de réception signé vous sera envoyé dès distribution." : ""} Une copie PDF est disponible en archive.`
    : `Votre paiement a bien été reçu. Votre courrier "${letterTitle}" est disponible en téléchargement.`;

  const ctaLabel = mailingMode
    ? "Télécharger ma copie (PDF)"
    : "Télécharger mon courrier (PDF)";

  // ─── Conseils (HTML + texte) ─────────────────────────────────────────────

  const conseilsTitle = mailingMode ? "Et maintenant ?" : "Conseils d'envoi";

  const bullets =
    mailingMode === "registered"
      ? [
          [
            `Le courrier sera <strong style="color:${jc.ink};">imprimé, mis sous pli et déposé à La Poste sous 24h ouvrées</strong>.`,
            "Le courrier sera imprimé, mis sous pli et déposé à La Poste sous 24h ouvrées.",
          ],
          [
            "Vous recevrez une notification email à chaque étape : dépôt, distribution, AR signé.",
            "Vous recevrez une notification email à chaque étape : dépôt, distribution, AR signé.",
          ],
          [
            "L'accusé de réception signé scanné sera disponible dans votre espace dès retour de La Poste.",
            "L'accusé de réception signé scanné sera disponible dans votre espace dès retour de La Poste.",
          ],
        ]
      : mailingMode === "simple"
        ? [
            [
              `Le courrier sera <strong style="color:${jc.ink};">imprimé, mis sous pli et déposé à La Poste sous 24h ouvrées</strong>.`,
              "Le courrier sera imprimé, mis sous pli et déposé à La Poste sous 24h ouvrées.",
            ],
            [
              "Distribution sous 3 jours ouvrés en France métropolitaine (lettre verte).",
              "Distribution sous 3 jours ouvrés en France métropolitaine (lettre verte).",
            ],
            [
              "Vous recevrez une notification email à la dépose.",
              "Vous recevrez une notification email à la dépose.",
            ],
          ]
        : [
            [
              "Imprimez votre courrier et signez-le à la main avant envoi.",
              "Imprimez votre courrier et signez-le à la main avant envoi.",
            ],
            [
              `Pour les mises en demeure et résiliations, privilégiez l'envoi en <strong style="color:${jc.ink};">lettre recommandée avec accusé de réception</strong>.`,
              "Pour les mises en demeure et résiliations, privilégiez l'envoi en lettre recommandée avec accusé de réception.",
            ],
            [
              "Conservez une copie du courrier et du récépissé d'envoi.",
              "Conservez une copie du courrier et du récépissé d'envoi.",
            ],
          ];

  const conseilsBodyHtml = bullets
    .map(
      ([html], idx) =>
        `<p style="margin:${idx === 0 ? "8px 0 6px" : idx === bullets.length - 1 ? "0" : "0 0 6px"};font-size:14px;color:${jc.inkSoft};line-height:1.6;">• ${html}</p>`
    )
    .join("\n");

  const conseilsText = bullets.map(([, text]) => `- ${text}`).join("\n");

  // ─── Section "Inclus dans l'envoi" (PJ) ──────────────────────────────────

  const attachmentsHtml = hasAttachments
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
        <tr>
          <td style="background-color:#ffffff;border-radius:10px;padding:18px 22px;border:1px solid ${jc.line};">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${jc.accent};">Inclus dans l'envoi</p>
            <p style="margin:8px 0 8px;font-size:14px;color:${jc.inkSoft};line-height:1.5;">Le courrier généré + ${attachments!.length} pièce${attachments!.length > 1 ? "s" : ""} jointe${attachments!.length > 1 ? "s" : ""} :</p>
            ${attachments!
              .map(
                (a) =>
                  `<p style="margin:0 0 4px;font-size:13px;color:${jc.ink};display:flex;justify-content:space-between;"><span>${escHtml(a.name)}</span><span style="color:${jc.inkMuted};">${formatBytes(a.sizeBytes)}</span></p>`
              )
              .join("")}
            <p style="margin:10px 0 0;font-size:12px;color:${jc.inkMuted};font-style:italic;">Le PDF téléchargeable contient l'ensemble (courrier + pièces jointes), strictement identique à ce qui sera posté à La Poste.</p>
          </td>
        </tr>
      </table>`
    : "";

  const attachmentsText = hasAttachments
    ? `\n\nInclus dans l'envoi :\nLe courrier généré + ${attachments!.length} pièce${attachments!.length > 1 ? "s" : ""} jointe${attachments!.length > 1 ? "s" : ""} :\n${attachments!.map((a) => `- ${a.name} (${formatBytes(a.sizeBytes)})`).join("\n")}\nLe PDF téléchargeable contient l'ensemble (courrier + pièces jointes), strictement identique à ce qui sera posté à La Poste.`
    : "";

  // ─── Composition HTML ────────────────────────────────────────────────────

  const contentHtml = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:${jc.ink};font-family:Georgia,serif;">${escHtml(headline)}</p>

    <p style="margin:0 0 24px;font-size:16px;color:${jc.inkSoft};line-height:1.6;">
      ${introHtml}
    </p>

    ${renderCtaButton({ label: ctaLabel, url: downloadUrl })}

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    ${attachmentsHtml}

    ${renderCallout({ title: conseilsTitle, bodyHtml: conseilsBodyHtml })}

    <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

    <p style="margin:0;font-size:13px;color:${jc.inkMuted};">
      Référence de votre courrier&nbsp;: <strong style="color:${jc.ink};">${shortRef}</strong>
    </p>
  `;

  const html = renderEmailShell({ subject, contentHtml });

  const contentText = `JusteCourrier — ${headline}

${introText}

${mailingMode ? "Télécharger votre copie PDF" : "Télécharger votre PDF"} :
${downloadUrl}${attachmentsText}

---
${conseilsTitle} :
${conseilsText}

Référence : ${shortRef}`;

  const text = renderTextShell({ contentText });

  return { html, text };
}
