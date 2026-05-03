import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
