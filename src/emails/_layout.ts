/**
 * Layout commun pour tous les emails transactionnels JusteCourrier.
 *
 * Fournit :
 *   - Tokens de marque Sage (hardcodés car les variables CSS ne sont pas
 *     supportées dans la majorité des clients mail)
 *   - Helpers d'échappement HTML et de formatage tailles
 *   - Building blocks HTML : header (logo), footer, bouton CTA, callout
 *   - Shell (DOCTYPE + header + body + footer) à wrapper autour d'un contenu
 *
 * Chaque template d'email (confirmation, mailing-deposited, mailing-delivered,
 * mailing-receipt-signed, mailing-failed) construit son `contentHtml` puis
 * appelle `renderEmailShell` pour le wrapping final.
 *
 * Pas de dépendance externe — chaque fonction retourne du HTML/texte plain
 * directement consommable par l'API Resend.
 */

// ─── Brand tokens (Sage palette, alignés sur src/app/globals.css :root) ──────

export const jc = {
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
  success: "#1F7A4D",
  warn: "#A65A1F",
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Échappe HTML — à appliquer à TOUTE valeur dynamique injectée dans le HTML. */
export function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Format taille fichier en o / Ko / Mo (1 décimale Mo). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

// ─── Building blocks HTML ────────────────────────────────────────────────────

/**
 * Logo + wordmark sur fond bleu primaire — bandeau d'en-tête.
 * SVG inline pour éviter toute dépendance image externe.
 */
function renderHeaderHtml(): string {
  const logoSvg = `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="26" height="18" rx="1.5" stroke="#FFFFFF" stroke-width="1.6"/>
    <path d="M3 8.5 L16 17 L29 8.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="22.5" cy="20.5" r="3" fill="${jc.accent}"/>
  </svg>`;

  return `<tr>
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
  </tr>`;
}

/** Pied de page : copyright année + lien contact. */
function renderFooterHtml(year: number): string {
  return `<tr>
    <td style="background-color:${jc.surface};padding:24px 40px;border-top:1px solid ${jc.line};">
      <p style="margin:0 0 8px;font-size:12px;color:${jc.inkMuted};line-height:1.5;">
        © ${year} JusteCourrier — Ce document est généré automatiquement par intelligence artificielle à titre informatif.
        Il ne constitue pas un conseil juridique professionnel.
      </p>
      <p style="margin:0;font-size:12px;color:${jc.inkMuted};">
        Pour toute question : <a href="mailto:contact@justecourrier.fr" style="color:${jc.accent};">contact@justecourrier.fr</a>
      </p>
    </td>
  </tr>`;
}

/**
 * Bouton CTA principal (rectangle bleu, texte blanc).
 *
 * @param label — Texte du bouton (échappé en interne)
 * @param url   — URL cible (échappée en interne)
 */
export function renderCtaButton(opts: { label: string; url: string }): string {
  return `<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:8px 0 24px;">
        <a href="${escHtml(opts.url)}"
           style="display:inline-block;background-color:${jc.primary};color:#ffffff;font-size:16px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
          ${escHtml(opts.label)}
        </a>
      </td>
    </tr>
  </table>
  <p style="margin:0 0 4px;font-size:13px;color:${jc.inkMuted};">
    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:
  </p>
  <p style="margin:0 0 24px;font-size:13px;color:${jc.accent};word-break:break-all;">
    ${escHtml(opts.url)}
  </p>`;
}

/**
 * Encadré coloré (bg + bordure) avec une petite étiquette en caps + corps libre.
 *
 * @param variant
 *   - "subtle"  : fond beige clair (jc.bg) + label accent — pour conseils
 *   - "accent"  : fond accentSoft + label accent foncé — pour PJ ou alertes douces
 *   - "warning" : fond accentSoft + label warn — pour cas d'erreur/non distribution
 */
export function renderCallout(opts: {
  title: string;
  bodyHtml: string;
  variant?: "subtle" | "accent" | "warning";
}): string {
  const variant = opts.variant ?? "subtle";

  const bgColor =
    variant === "subtle"
      ? jc.bg
      : variant === "accent"
        ? "#ffffff"
        : jc.accentSoft;

  const labelColor = variant === "warning" ? jc.warn : jc.accent;

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr>
      <td style="background-color:${bgColor};border-radius:10px;padding:20px 24px;border:1px solid ${jc.line};">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${labelColor};">${escHtml(opts.title)}</p>
        ${opts.bodyHtml}
      </td>
    </tr>
  </table>`;
}

/**
 * Helper paragraphes "bullet" stylés ("• texte") pour usage dans un callout.
 * Évite la duplication des inline styles dans chaque template.
 */
export function renderBullets(items: string[]): string {
  if (items.length === 0) return "";
  return items
    .map((item, idx) => {
      const margin = idx === 0 ? "8px 0 6px" : "0 0 6px";
      const last = idx === items.length - 1 ? "0" : margin;
      return `<p style="margin:${idx === items.length - 1 ? last : margin};font-size:14px;color:${jc.inkSoft};line-height:1.6;">• ${item}</p>`;
    })
    .join("\n");
}

// ─── Shell (wrapping HTML/text complet) ──────────────────────────────────────

/**
 * Wrap le contenu d'un email dans la coquille standard JusteCourrier
 * (DOCTYPE + head + table outer + header + body + footer).
 *
 * @param subject     — Utilisé dans <title>, doit être identique à ce qui est
 *                       passé à Resend pour cohérence preview header.
 * @param contentHtml — HTML brut à insérer dans la cellule de body. Toute
 *                       valeur dynamique doit avoir été échappée avant.
 */
export function renderEmailShell(opts: {
  subject: string;
  contentHtml: string;
}): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${jc.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${jc.bg};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(15,34,53,0.08);max-width:600px;width:100%;">
          ${renderHeaderHtml()}
          <tr>
            <td style="padding:40px;">
              ${opts.contentHtml}
            </td>
          </tr>
          ${renderFooterHtml(year)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Wrap la version texte brut. Ajoute un séparateur + footer texte standard.
 */
export function renderTextShell(opts: { contentText: string }): string {
  const year = new Date().getFullYear();
  return `${opts.contentText}

---
© ${year} JusteCourrier — justecourrier.fr
Ce document est généré automatiquement par IA à titre informatif. Il ne constitue pas un conseil juridique professionnel.
Pour toute question : contact@justecourrier.fr`;
}
