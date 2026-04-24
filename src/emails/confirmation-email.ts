// Template email de confirmation après paiement.
// Retourne { html, text } pour l'API Resend — aucune dépendance externe requise.

interface ConfirmationEmailData {
  letterTitle: string;
  letterId: string;
  downloadUrl: string;
}

export function renderConfirmationEmail(data: ConfirmationEmailData): {
  html: string;
  text: string;
} {
  const { letterTitle, letterId, downloadUrl } = data;
  const shortRef = letterId.substring(0, 8).toUpperCase();
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Votre courrier est prêt — ${escHtml(letterTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2563eb;padding:24px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Courrier IA</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">Votre courrier est prêt ✅</p>

              <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.6;">
                Votre paiement a bien été reçu. Votre courrier
                <strong>${escHtml(letterTitle)}</strong>
                est disponible en téléchargement.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${escHtml(downloadUrl)}"
                       style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:16px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                      Télécharger mon courrier (PDF)
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:
              </p>
              <p style="margin:0 0 24px;font-size:13px;color:#2563eb;word-break:break-all;">
                ${escHtml(downloadUrl)}
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

              <!-- Conseils -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f0f9ff;border-radius:6px;padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#0369a1;">💡 Conseils d'envoi</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#374151;line-height:1.6;">• Imprimez votre courrier et signez-le à la main avant envoi.</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#374151;line-height:1.6;">• Pour les mises en demeure et résiliations, privilégiez l'envoi en <strong>lettre recommandée avec accusé de réception</strong>.</p>
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">• Conservez une copie du courrier et du récépissé d'envoi.</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

              <p style="margin:0;font-size:13px;color:#6b7280;">
                Référence de votre courrier&nbsp;: <strong>${shortRef}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;line-height:1.5;">
                © ${year} Courrier IA — Ce document est généré automatiquement par intelligence artificielle à titre informatif.
                Il ne constitue pas un conseil juridique professionnel.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Pour toute question : <a href="mailto:contact@courrier-ia.fr" style="color:#6b7280;">contact@courrier-ia.fr</a>
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
  const text = `Courrier IA — Votre courrier est prêt

Votre paiement a bien été reçu. Votre courrier "${letterTitle}" est disponible en téléchargement.

Télécharger votre PDF :
${downloadUrl}

---
Conseils d'envoi :
- Imprimez votre courrier et signez-le à la main avant envoi.
- Pour les mises en demeure et résiliations, privilégiez l'envoi en lettre recommandée avec accusé de réception.
- Conservez une copie du courrier et du récépissé d'envoi.

Référence : ${shortRef}

© ${year} Courrier IA
Ce document est généré automatiquement par IA à titre informatif. Il ne constitue pas un conseil juridique professionnel.
Pour toute question : contact@courrier-ia.fr`;

  return { html, text };
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
