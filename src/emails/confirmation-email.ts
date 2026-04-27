// Template email de confirmation après paiement — branding JusteCourrier / Sage.
// Retourne { html, text } pour l'API Resend — aucune dépendance externe requise.

interface ConfirmationEmailData {
  letterTitle: string;
  letterId: string;
  downloadUrl: string;
}

// Sage brand tokens (hardcoded for email — no CSS variables in email clients)
const jc = {
  primary: "#13314F",
  primaryHover: "#1B4670",
  accent: "#C9722D",
  accentSoft: "#F4E4D1",
  ink: "#0F2235",
  inkSoft: "#34465A",
  inkMuted: "#6B7785",
  bg: "#FAF8F4",
  surface: "#F2EFE8",
  line: "#E4DFD4",
};

export function renderConfirmationEmail(data: ConfirmationEmailData): {
  html: string;
  text: string;
} {
  const { letterTitle, letterId, downloadUrl } = data;
  const shortRef = letterId.substring(0, 8).toUpperCase();
  const year = new Date().getFullYear();

  // Logo SVG inline (envelope + accent dot, matching Logo.tsx)
  const logoSvg = `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="26" height="18" rx="1.5" stroke="#FFFFFF" stroke-width="1.6"/>
    <path d="M3 8.5 L16 17 L29 8.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="22.5" cy="20.5" r="3" fill="${jc.accent}"/>
  </svg>`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Votre courrier est prêt — ${escHtml(letterTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:${jc.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${jc.bg};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(15,34,53,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:${jc.primary};padding:24px 40px;">
              <table cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="vertical-align:middle;width:38px;">
                    ${logoSvg}
                  </td>
                  <td style="vertical-align:middle;padding-left:12px;">
                    <span style="font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.01em;font-family:Georgia,serif;">juste</span><span style="font-size:20px;font-weight:400;color:rgba(255,255,255,0.75);letter-spacing:-0.01em;font-family:Georgia,serif;">courrier</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:${jc.ink};font-family:Georgia,serif;">Votre courrier est prêt</p>

              <p style="margin:0 0 24px;font-size:16px;color:${jc.inkSoft};line-height:1.6;">
                Votre paiement a bien été reçu. Votre courrier
                <strong style="color:${jc.ink};">${escHtml(letterTitle)}</strong>
                est disponible en téléchargement.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${escHtml(downloadUrl)}"
                       style="display:inline-block;background-color:${jc.primary};color:#ffffff;font-size:16px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
                      Télécharger mon courrier (PDF)
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px;font-size:13px;color:${jc.inkMuted};">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:
              </p>
              <p style="margin:0 0 24px;font-size:13px;color:${jc.accent};word-break:break-all;">
                ${escHtml(downloadUrl)}
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

              <!-- Conseils -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:${jc.bg};border-radius:10px;padding:20px 24px;border:1px solid ${jc.line};">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${jc.accent};">Conseils d'envoi</p>
                    <p style="margin:8px 0 6px;font-size:14px;color:${jc.inkSoft};line-height:1.6;">• Imprimez votre courrier et signez-le à la main avant envoi.</p>
                    <p style="margin:0 0 6px;font-size:14px;color:${jc.inkSoft};line-height:1.6;">• Pour les mises en demeure et résiliations, privilégiez l'envoi en <strong style="color:${jc.ink};">lettre recommandée avec accusé de réception</strong>.</p>
                    <p style="margin:0;font-size:14px;color:${jc.inkSoft};line-height:1.6;">• Conservez une copie du courrier et du récépissé d'envoi.</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid ${jc.line};margin:24px 0;" />

              <p style="margin:0;font-size:13px;color:${jc.inkMuted};">
                Référence de votre courrier&nbsp;: <strong style="color:${jc.ink};">${shortRef}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${jc.surface};padding:24px 40px;border-top:1px solid ${jc.line};">
              <p style="margin:0 0 8px;font-size:12px;color:${jc.inkMuted};line-height:1.5;">
                © ${year} JusteCourrier — Ce document est généré automatiquement par intelligence artificielle à titre informatif.
                Il ne constitue pas un conseil juridique professionnel.
              </p>
              <p style="margin:0;font-size:12px;color:${jc.inkMuted};">
                Pour toute question : <a href="mailto:contact@justecourrier.fr" style="color:${jc.accent};">contact@justecourrier.fr</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Version texte brut (clients mail sans HTML, délivrabilité)
  const text = `JusteCourrier — Votre courrier est prêt

Votre paiement a bien été reçu. Votre courrier "${letterTitle}" est disponible en téléchargement.

Télécharger votre PDF :
${downloadUrl}

---
Conseils d'envoi :
- Imprimez votre courrier et signez-le à la main avant envoi.
- Pour les mises en demeure et résiliations, privilégiez l'envoi en lettre recommandée avec accusé de réception.
- Conservez une copie du courrier et du récépissé d'envoi.

Référence : ${shortRef}

© ${year} JusteCourrier — justecourrier.fr
Ce document est généré automatiquement par IA à titre informatif. Il ne constitue pas un conseil juridique professionnel.
Pour toute question : contact@justecourrier.fr`;

  return { html, text };
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
