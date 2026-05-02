import { notFound } from "next/navigation";
import Link from "next/link";
import { getLetterType, getCategoryLabel, letterTypes } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";
import Logo from "@/components/Logo";
import {
  IconArrow,
  IconCheck,
  IconBolt,
  IconShield,
  IconDoc,
} from "@/components/Icons";

// Generate static params for all letter types
export function generateStaticParams() {
  return letterTypes.map((lt) => ({ type: lt.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const letterType = getLetterType(type);
  if (!letterType) return {};

  return {
    title: letterType.title,
    description: `${letterType.description} Courrier professionnel rédigé par IA, prêt à envoyer dès 3,90 €.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const letterType = getLetterType(type);

  if (!letterType) {
    notFound();
  }

  const categoryLabel = getCategoryLabel(letterType.category);

  let user = null;
  try {
    const supabase = await createAuthClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Not logged in
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: letterType.title,
    description: letterType.description,
    url: `https://justecourrier.fr/courrier/${letterType.slug}`,
    brand: { "@type": "Brand", name: "JusteCourrier" },
    offers: {
      "@type": "Offer",
      price: (letterType.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://justecourrier.fr/courrier/${letterType.slug}/rediger`,
      seller: {
        "@type": "Organization",
        name: "JusteCourrier",
        url: "https://justecourrier.fr",
      },
    },
    category: categoryLabel,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://justecourrier.fr" },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: "https://justecourrier.fr/catalogue" },
      { "@type": "ListItem", position: 3, name: letterType.title, item: `https://justecourrier.fr/courrier/${letterType.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-jc-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* ─── Nav ─── */}
      <header className="flex items-center justify-between border-b border-jc-line bg-jc-bg px-8 py-[18px]">
        <Link href="/" className="no-underline">
          <Logo size={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/catalogue"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Catalogue
          </Link>
          <Link
            href="/guides"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/#fonctionnement"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Comment ça marche
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
            >
              Mes courriers
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors hidden sm:inline"
              >
                Se connecter
              </Link>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
              >
                Commencer un courrier
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── Content ─── */}
      <section className="px-6 md:px-20 pt-10 pb-24 max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-[13px] text-jc-ink-muted mb-4">
          <Link
            href="/"
            className="text-jc-ink-muted no-underline hover:text-jc-ink transition-colors"
          >
            Accueil
          </Link>
          {" / "}
          <Link
            href="/catalogue"
            className="text-jc-ink-muted no-underline hover:text-jc-ink transition-colors"
          >
            {categoryLabel}
          </Link>
          {" / "}
          <span className="text-jc-ink">{letterType.title}</span>
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-7 md:gap-14">
          {/* ─── Left column ─── */}
          <div>
            <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
              {categoryLabel}
            </span>
            <h1 className="mt-3.5 mb-4 text-[44px] leading-[1.05] tracking-[-0.03em] font-display font-bold text-jc-ink max-md:text-[30px] max-md:leading-[1.1]">
              {letterType.title}
            </h1>
            <p className="text-[17px] leading-relaxed text-jc-ink-soft mb-6 max-md:text-[15px]">
              {letterType.description}
            </p>

            {/* Quand utiliser ce courrier ? */}
            <h3 className="mt-7 mb-3 text-lg font-display font-bold text-jc-ink">
              Quand utiliser ce courrier ?
            </h3>
            <ul className="list-none p-0 m-0">
              {letterType.useCases.map((useCase, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 py-2 border-b border-jc-line text-sm"
                >
                  <span className="text-jc-accent shrink-0 mt-0.5">
                    <IconCheck />
                  </span>
                  <span className="text-jc-ink-soft">{useCase}</span>
                </li>
              ))}
            </ul>

            {/* Ce que tu obtiens */}
            <h3 className="mt-9 mb-3 text-lg font-display font-bold text-jc-ink">
              Ce que tu obtiens
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  t: "Lettre PDF format A4",
                  d: "Mise en page AFNOR, prête à imprimer.",
                },
                {
                  t: "Personnalisée",
                  d: "Tes informations, ta situation, tes pièces.",
                },
                {
                  t: "Références juridiques",
                  d: "Articles de loi cités automatiquement.",
                },
                {
                  t: "Modifiable",
                  d: "Tu peux relire et ajuster avant paiement.",
                },
              ].map((benefit) => (
                <div
                  key={benefit.t}
                  className="bg-jc-bg-elev border border-jc-line rounded-jc p-3.5"
                >
                  <h4 className="text-sm font-semibold text-jc-ink mb-1">
                    {benefit.t}
                  </h4>
                  <p className="text-[13px] text-jc-ink-soft">{benefit.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right column — sticky sidebar ─── */}
          <aside className="md:sticky md:top-6 self-start">
            {/* Price card */}
            <div className="bg-jc-bg-elev border border-jc-line rounded-jc-lg p-6">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[13px] text-jc-ink-muted">
                  À partir de
                </span>
                <span className="text-[32px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
                  {(letterType.priceCents / 100).toFixed(2).replace(".", ",")}&nbsp;€
                </span>
              </div>
              <p className="text-[13px] text-jc-ink-soft mb-[18px]">
                PDF téléchargeable. Option d&apos;envoi postal disponible :
                lettre simple 5,90&nbsp;€, recommandé avec AR 11,90&nbsp;€.
                Pas d&apos;abonnement, pas de frais cachés.
              </p>
              <Link
                href={`/courrier/${letterType.slug}/rediger`}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
              >
                Rédiger mon courrier <IconArrow />
              </Link>

              {/* Info lines */}
              <div className="mt-4 flex flex-col gap-2 text-[13px] text-jc-ink-soft">
                <span className="flex items-center gap-2">
                  <span className="text-jc-accent shrink-0">
                    <IconBolt />
                  </span>
                  ~{letterType.duration} de remplissage
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-jc-accent shrink-0">
                    <IconShield />
                  </span>
                  Aperçu complet avant paiement
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-jc-accent shrink-0">
                    <IconDoc />
                  </span>
                  PDF immédiat &amp; email de confirmation
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 p-4 border border-dashed border-jc-line-strong rounded-jc text-[13px] text-jc-ink-muted">
              <strong className="text-jc-ink">À noter :</strong> JusteCourrier
              n&apos;est pas un service juridique. Pour les litiges complexes,
              consulte un avocat ou une association.
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-jc-line px-8 pt-12 pb-7 text-[13px] text-jc-ink-muted">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 pb-8">
            <div className="col-span-2 md:col-span-1">
              <Logo size={22} />
              <p className="mt-3.5 max-w-[280px] text-jc-ink-muted">
                Le courrier administratif simple, transparent et juste. Pas
                d&apos;abonnement, pas de piège.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Service
              </h5>
              <div className="flex flex-col gap-1">
                <Link
                  href="/catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Catalogue
                </Link>
                <Link
                  href="/guides"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Guides juridiques
                </Link>
                <Link
                  href="/catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Tarifs
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h5>
              <div className="flex flex-col gap-1">
                <Link
                  href="/mentions-legales"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Mentions légales
                </Link>
                <Link
                  href="/cgv"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  CGV
                </Link>
                <Link
                  href="/confidentialite"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Confidentialité
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h5>
              <div className="flex flex-col gap-1">
                <span className="text-jc-ink-soft py-1">
                  contact@justecourrier.fr
                </span>
                <span className="text-jc-ink-soft py-1">Aide &amp; FAQ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>
              © {new Date().getFullYear()} JusteCourrier · SIRET 104 347 919 00011
            </span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
