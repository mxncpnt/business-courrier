import { ImageResponse } from "next/og";

// Convention Next.js App Router : ce fichier génère automatiquement
// /opengraph-image.png à la racine du site, utilisé pour :
//   - les partages OG (Facebook, X, LinkedIn, Slack, Discord…)
//   - les images des JSON-LD (Product, Article, Organization)
// Avant ce fichier : /logo.png était référencé dans Organization mais 404, et
// les JSON-LD Product/Article n'avaient pas d'image → erreurs critiques GSC.

export const alt = "JusteCourrier — Ton courrier administratif, simple et juste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#FAF8F4",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#13314F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FAF8F4",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            ✉
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#0F2235",
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            JusteCourrier
          </div>
        </div>

        {/* Satori (next/og) exige `display: flex` sur tout div à >1 enfant.
            Pour le retour à la ligne, on utilise deux <div> enfants d'un
            wrapper flex column plutôt qu'un <br/> qui créerait 3 nœuds. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "78px",
            color: "#0F2235",
            fontWeight: 600,
            letterSpacing: "-2px",
            lineHeight: 1.05,
            maxWidth: "950px",
          }}
        >
          <div>Ton courrier administratif,</div>
          <div>simple et juste.</div>
        </div>

        <div
          style={{
            fontSize: "30px",
            color: "#34465A",
            marginTop: "40px",
            maxWidth: "1000px",
            lineHeight: 1.3,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Résiliations, mises en demeure, réclamations rédigées par IA et envoyées
          par La Poste.
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
            fontSize: "22px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "#F4E4D1",
              color: "#C9722D",
              fontWeight: 600,
            }}
          >
            PDF · 3,90 €
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "#F4E4D1",
              color: "#C9722D",
              fontWeight: 600,
            }}
          >
            Lettre simple · 5,90 €
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "#F4E4D1",
              color: "#C9722D",
              fontWeight: 600,
            }}
          >
            Recommandé AR · 11,90 €
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
