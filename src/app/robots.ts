import type { MetadataRoute } from "next";

/**
 * robots.txt dynamique en fonction de l'environnement :
 *   - Production (justecourrier.fr) : règles d'indexation classiques
 *   - Preview / staging (toute autre URL) : tout interdit, pas de sitemap
 *
 * Détection via NEXT_PUBLIC_APP_URL qui est dédoublée par scope dans Vercel
 * (Production = https://justecourrier.fr, Preview = https://staging.justecourrier.fr).
 * Permet à staging.justecourrier.fr et aux deploy previews Vercel d'être
 * crawlable uniquement en interne, jamais indexés par Google.
 */
export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://justecourrier.fr";
  const isProd = appUrl === "https://justecourrier.fr";

  if (!isProd) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/preview/",
          "/paiement/",
          "/profil",
          "/mailings/",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://justecourrier.fr/sitemap.xml",
  };
}
