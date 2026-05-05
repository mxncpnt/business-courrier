import { ImageResponse } from "next/og";

// Convention Next.js App Router : ce fichier sert le favicon haute résolution
// du site, utilisé par les navigateurs modernes, les onglets et — pour notre
// usage SEO — comme logo réutilisable pour Trustpilot, Google Business Profile,
// PagesJaunes, Société.com, Bing Places, etc.
//
// Le `favicon.ico` à la racine de src/app/ reste pour les vieux navigateurs.
// Next 16 priorise icon.tsx (PNG haute résolution) sur favicon.ico dans le
// <head> généré.
//
// Reproduction fidèle du LogoMark de src/components/Logo.tsx (SVG 32×32 :
// rectangle enveloppe + rabat triangle + cercle accent en bas-droite), mis à
// l'échelle 320/512 sur fond primary pour ressortir sur les vignettes des
// annuaires. Téléchargeable via https://justecourrier.fr/icon (SANS .png en
// Next 16, comme l'OG image).

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Fond canvas transparent : le PNG généré a un alpha, le logo
          // s'intègre proprement sur tout fond (Trustpilot, GBP, etc.).
        }}
      >
        <svg
          width="420"
          height="420"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Corps de l'enveloppe : intérieur en jc-bg (beige), contour en jc-primary (bleu) */}
          <rect
            x="3"
            y="7"
            width="26"
            height="18"
            rx="1.5"
            fill="#FAF8F4"
            stroke="#13314F"
            strokeWidth="1.6"
          />
          {/* Rabat triangulaire : tracé en jc-primary pour rester cohérent avec le contour */}
          <path
            d="M3 8.5 L16 17 L29 8.5"
            stroke="#13314F"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Sceau accent en bas-droite */}
          <circle cx="22.5" cy="20.5" r="3" fill="#C9722D" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
