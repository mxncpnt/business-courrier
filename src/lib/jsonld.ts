/**
 * Builders centralisés pour les JSON-LD du site.
 *
 * Pourquoi un module dédié ?
 *   - DRY : avant ce fichier, chaque page (home, courrier/[type], guides/[slug],
 *     tarifs) construisait ses propres objets schema.org inline, avec des bugs
 *     de désynchronisation (logo 404, image manquante, URL avec .png alors que
 *     Next 16 sert sans).
 *   - Audit : un seul endroit à inspecter quand GSC remonte un problème.
 *   - Évolution : ajouter un nouveau champ schema (ex: AggregateRating quand
 *     Trustpilot sera live) se fait à un seul endroit.
 *
 * Convention : chaque builder retourne un objet JSON-LD prêt à être stringify
 * dans `<script type="application/ld+json">`. Les URLs sont absolues
 * (schema.org l'exige) et toujours construites depuis SITE_URL.
 */

import { letterTypes, type LetterType, getCategoryLabel } from "@/config/letter-types";
import { computeBundlePriceCents } from "@/config/mailings";
import type { Guide } from "@/config/guides";

// ─── Constantes ────────────────────────────────────────────────────────────

export const SITE_URL = "https://justecourrier.fr";
export const SITE_NAME = "JusteCourrier";

/**
 * URL de l'OG image générée par `src/app/opengraph-image.tsx` (1200×630 paysage).
 * ⚠️ Next 16 sert l'image SANS extension `.png` — la version `.png` retourne 404.
 * Référencée dans Product/Article/Organization comme `image` (visuel principal).
 */
export const OG_IMAGE_URL = `${SITE_URL}/opengraph-image`;

/**
 * URL de l'icône carrée 512×512 générée par `src/app/icon.tsx`.
 * Utilisée comme `logo` (qui doit être carré idéalement) dans les schemas
 * Organization et Article.publisher. Convention Next 16 : pas d'extension.
 */
export const ICON_URL = `${SITE_URL}/icon`;

const PUBLISHER = {
  "@type": "Organization" as const,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: ICON_URL,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const url = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const eurosFromCents = (cents: number) => (cents / 100).toFixed(2);

// ─── Builders : entités globales ───────────────────────────────────────────

/**
 * Schema Organization affiché sur la home. Aide Google Knowledge Graph et les
 * LLMs à identifier l'entité (raison sociale, services, gamme de prix, contact).
 */
export function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Maxence Pinta — Entrepreneur individuel",
    url: SITE_URL,
    logo: ICON_URL,
    image: OG_IMAGE_URL,
    email: "contact@justecourrier.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 Rue Jean Giono",
      postalCode: "34170",
      addressLocality: "Castelnau-le-Lez",
      addressCountry: "FR",
    },
    description:
      "Service en ligne de génération et envoi de courriers administratifs et juridiques en France : résiliations, mises en demeure, réclamations, contestations. PDF dès 3,90 €, lettre verte 5,90 €, recommandé AR 11,90 €.",
    areaServed: { "@type": "Country", name: "France" },
    priceRange: "€",
    taxID: "10434791900011",
    naics: "6201Z",
    foundingDate: "2026",
  };
}

// ─── Builders : navigation ─────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  /** Chemin relatif (ex: "/catalogue"), absolutisé via SITE_URL */
  path: string;
}

export function buildBreadcrumb(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

// ─── Builders : Product (pages /courrier/[type] et /tarifs) ────────────────

/**
 * Schema Product avec AggregateOffer englobant les 3 tiers de prix
 * (PDF / lettre simple / LRAR). Permet à Google d'afficher le rich snippet
 * "à partir de X €" en SERP au lieu d'un prix unique.
 *
 * Inclut shippingDetails (résout le warning facultatif GSC) et
 * hasMerchantReturnPolicy (idem). Pour un service numérique pleinement
 * exécuté à la livraison du PDF, MerchantReturnNotPermitted est juridiquement
 * cohérent avec l'article L.221-28 du Code de la consommation (rétractation
 * exclue pour les services pleinement exécutés avec accord exprès).
 */
export function buildProductWithAggregateOffer(letterType: LetterType) {
  const pdfCents = letterType.priceCents;
  const simpleCents = computeBundlePriceCents(pdfCents, "simple");
  const registeredCents = computeBundlePriceCents(pdfCents, "registered");

  const offerBase = {
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "FR",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: url("/cgv"),
    },
  } as const;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: letterType.title,
    description: letterType.description,
    image: OG_IMAGE_URL,
    url: url(`/courrier/${letterType.slug}`),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: getCategoryLabel(letterType.category),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: eurosFromCents(pdfCents),
      highPrice: eurosFromCents(registeredCents),
      offerCount: 3,
      offers: [
        {
          ...offerBase,
          "@type": "Offer",
          name: `${letterType.title} — PDF`,
          price: eurosFromCents(pdfCents),
          url: url(`/courrier/${letterType.slug}/rediger`),
          // PDF instantané : pas de transit
          shippingDetails: shippingFR(0, 0),
        },
        {
          ...offerBase,
          "@type": "Offer",
          name: `${letterType.title} — Lettre verte (envoi inclus)`,
          price: eurosFromCents(simpleCents),
          url: url(`/courrier/${letterType.slug}/rediger`),
          // Lettre verte La Poste : J+3 typique
          shippingDetails: shippingFR(2, 4),
        },
        {
          ...offerBase,
          "@type": "Offer",
          name: `${letterType.title} — Recommandé AR (envoi inclus)`,
          price: eurosFromCents(registeredCents),
          url: url(`/courrier/${letterType.slug}/rediger`),
          // LRAR : 1-3 jours selon distribution
          shippingDetails: shippingFR(1, 3),
        },
      ],
    },
  };
}

/**
 * Helper interne : OfferShippingDetails minimaliste pour la France, transit
 * variable selon le tier. Réutilisé par buildProductWithAggregateOffer et
 * buildPricingProduct pour cohérence.
 */
function shippingFR(transitMin: number, transitMax: number) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "EUR" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "FR" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: transitMin,
        maxValue: transitMax,
        unitCode: "DAY",
      },
    },
  };
}

/**
 * Schema Product générique pour la page /tarifs.
 * Représente le service global "Courrier JusteCourrier" avec les 3 tiers
 * de prix (PDF / lettre verte / LRAR). Permet le rich snippet "à partir de
 * 3,90 €" sur la page tarifs elle-même (en plus des pages produit
 * /courrier/[type] qui ont chacune leur Product).
 */
export function buildPricingProduct() {
  const offerBase = {
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "FR",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: url("/cgv"),
    },
  } as const;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Courrier administratif personnalisé",
    description:
      "Service de génération et envoi de courriers administratifs et juridiques en France. Résiliation, mise en demeure, réclamation, contestation, demande de remboursement. PDF, lettre verte ou recommandé AR.",
    image: OG_IMAGE_URL,
    url: url("/tarifs"),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "3.90",
      highPrice: "11.90",
      offerCount: 3,
      offers: [
        {
          ...offerBase,
          "@type": "Offer",
          name: "Courrier PDF",
          description:
            "Génération du courrier au format PDF. L'utilisateur poste lui-même.",
          price: "3.90",
          url: url("/catalogue"),
          shippingDetails: shippingFR(0, 0),
        },
        {
          ...offerBase,
          "@type": "Offer",
          name: "Lettre verte (génération + envoi)",
          description:
            "Génération du courrier et envoi par lettre verte La Poste, distribution en J+3.",
          price: "5.90",
          url: url("/catalogue"),
          shippingDetails: shippingFR(2, 4),
        },
        {
          ...offerBase,
          "@type": "Offer",
          name: "Recommandé AR (génération + envoi)",
          description:
            "Génération du courrier et envoi en recommandé avec accusé de réception, valeur juridique opposable.",
          price: "11.90",
          url: url("/catalogue"),
          shippingDetails: shippingFR(1, 3),
        },
      ],
    },
  };
}

// ─── Builders : Article (pages /guides/[slug]) ─────────────────────────────

/**
 * Schema Article. `image` requis pour rich snippet. publisher.logo doit être
 * un ImageObject (pas une string), Google le valide différemment.
 */
export function buildArticle(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: OG_IMAGE_URL,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url(`/guides/${guide.slug}`),
    },
  };
}

/**
 * Schema FAQPage à inclure SEUL et UNIQUEMENT s'il y a des Q/R structurées
 * (sinon Google marque comme spam). Génère le rich snippet "Personnes ont
 * aussi posé ces questions" / accordion FAQ en SERP.
 *
 * Note : on strip le markdown `**bold**` du `text` parce que Google ne
 * l'interprète pas et l'afficherait en clair dans le rich snippet.
 * Le rendu HTML visible côté page passe lui par parseInline (cf. GuideBody).
 */
export function buildFAQPage(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: stripMarkdown(f.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMarkdown(f.a),
      },
    })),
  };
}

/** Retire le markdown bold `**texte**` → `texte`. Pas d'autre transformation. */
function stripMarkdown(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

// ─── Builders : pages liste (/catalogue, /guides) ──────────────────────────

/**
 * Schema CollectionPage pour les pages d'index (liste de produits/articles).
 * Aide Google à comprendre que c'est un hub plutôt qu'une page unitaire.
 */
export function buildCollectionPage(args: {
  name: string;
  description: string;
  path: string;
  itemListName: string;
  itemListItems: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: url(args.path),
    mainEntity: {
      "@type": "ItemList",
      name: args.itemListName,
      numberOfItems: args.itemListItems.length,
      itemListElement: args.itemListItems.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        url: url(item.path),
      })),
    },
  };
}

// ─── Aides "site-wide" ─────────────────────────────────────────────────────

/**
 * Liste des produits pour /catalogue.
 * Centralisé ici pour rester en phase avec letterTypes.
 */
export function getCatalogueItems() {
  return letterTypes.map((lt) => ({
    name: lt.title,
    path: `/courrier/${lt.slug}`,
  }));
}
