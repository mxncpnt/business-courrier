import type { MetadataRoute } from "next";
import { letterTypes } from "@/config/letter-types";

const BASE = "https://justecourrier.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/catalogue`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/connexion`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/cgv`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Pages produit dynamiques (une par type de courrier)
  const letterPages: MetadataRoute.Sitemap = letterTypes.map((lt) => ({
    url: `${BASE}/courrier/${lt.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...letterPages];
}
