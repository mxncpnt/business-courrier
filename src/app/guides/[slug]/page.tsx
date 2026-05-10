import { notFound } from "next/navigation";
import Link from "next/link";
import { guides, getGuide } from "@/config/guides";
import { getLetterType } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";
import {
  buildArticle,
  buildBreadcrumb,
  buildFAQPage,
} from "@/lib/jsonld";
import Logo from "@/components/Logo";
import GuideBody, { parseInline } from "@/components/GuideBody";
import { IconArrow } from "@/components/Icons";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    // title.absolute pour skipper le template "%s — JusteCourrier" du root
    // layout : les metaTitle des guides incluent déjà leur propre suffixe
    // descriptif (ex: "— Modèle et procédure"), pas besoin du suffixe marque.
    title: { absolute: guide.metaTitle },
    description: guide.description,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      locale: "fr_FR",
      siteName: "JusteCourrier",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const relatedLetter = getLetterType(guide.relatedLetterSlug);

  let user = null;
  try {
    const supabase = await createAuthClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Not logged in
  }

  // JSON-LD via builders centralisés (cf. src/lib/jsonld.ts).
  // FAQPage est ajouté UNIQUEMENT si le guide a un champ faq rempli — Google
  // marque comme spam un FAQPage vide ou avec des Q/R bidons.
  const articleLd = buildArticle(guide);
  const breadcrumbLd = buildBreadcrumb([
    { name: "Accueil", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ]);
  const faqLd = guide.faq && guide.faq.length > 0 ? buildFAQPage(guide.faq) : null;

  return (
    <div className="min-h-screen bg-jc-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

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
            className="text-jc-ink text-sm font-medium no-underline"
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

      <main>

      {/* ─── Article ─── */}
      <article className="px-6 md:px-20 pt-10 pb-20 max-w-[760px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-[13px] text-jc-ink-muted mb-6">
          <Link
            href="/"
            className="text-jc-ink-muted no-underline hover:text-jc-ink transition-colors"
          >
            Accueil
          </Link>
          {" / "}
          <Link
            href="/guides"
            className="text-jc-ink-muted no-underline hover:text-jc-ink transition-colors"
          >
            Guides
          </Link>
          {" / "}
          <span className="text-jc-ink">{guide.title}</span>
        </div>

        {/* Header */}
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
          Guide pratique · Lecture {guide.readingTime}
        </span>
        <h1 className="mt-3 mb-4 text-[38px] leading-[1.1] tracking-[-0.02em] font-display font-bold text-jc-ink max-md:text-[26px] max-md:leading-[1.15]">
          {guide.title}
        </h1>
        <p className="text-[17px] leading-relaxed text-jc-ink-soft mb-8 max-md:text-[15px]">
          {guide.description}
        </p>

        {/* CTA "haut" — conversion 5-15% en bas → 30-50% above-the-fold
            (best practice UX). Design sobre cohérent avec le bloc "Guide
            pratique associé" sur les pages courrier (accent-soft, border
            discrète). Pas d'impact SEO négatif : ratio CTA/contenu ~15%
            d'above-the-fold, lien interne contextuel renforce le maillage
            hub-and-spoke. Affiché UNIQUEMENT si un letterType lié existe. */}
        {relatedLetter && (
          <aside className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-jc-accent-soft border border-jc-accent/20 rounded-jc">
            <div className="flex-1">
              <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-accent mb-1">
                Besoin d&apos;envoyer ce courrier ?
              </div>
              <p className="text-[14px] text-jc-ink leading-snug">
                JusteCourrier rédige et envoie pour vous{" "}
                <strong className="font-semibold">
                  {relatedLetter.title.toLowerCase()}
                </strong>
                {" "}en 2 minutes, dès 3,90&nbsp;€.
              </p>
            </div>
            <Link
              href={`/courrier/${relatedLetter.slug}`}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-sm no-underline whitespace-nowrap"
            >
              Générer ma lettre
              <IconArrow />
            </Link>
          </aside>
        )}

        {/* Sections — body parsé via GuideBody (markdown minimal :
            **bold**, listes "- item", paragraphes \n\n) */}
        {guide.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-[22px] font-display font-bold text-jc-ink mb-3 max-md:text-[19px]">
              {section.heading}
            </h2>
            <GuideBody body={section.body} />
          </section>
        ))}

        {/* ─── FAQ ─── Visible dans le HTML ET référencée dans le JSON-LD
            FAQPage. Google ne match le rich snippet que si les Q/R sont
            réellement présentes dans la page (pas juste en JSON-LD). */}
        {guide.faq && guide.faq.length > 0 && (
          <section className="mt-12 pt-8 border-t border-jc-line">
            <h2 className="text-[22px] font-display font-bold text-jc-ink mb-5 max-md:text-[19px]">
              Questions fréquentes
            </h2>
            <div className="flex flex-col gap-3">
              {guide.faq.map((item, i) => (
                <details
                  key={i}
                  className="group bg-jc-bg-elev border border-jc-line rounded-jc px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                    <h3 className="text-[15px] font-semibold text-jc-ink leading-snug">
                      {item.q}
                    </h3>
                    <span className="text-jc-ink-muted text-xl leading-none shrink-0 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-[1.7] text-jc-ink-soft">
                    {parseInline(item.a)}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ─── CTA Card ─── */}
        {relatedLetter && (
          <div className="mt-10 p-6 bg-jc-bg-elev border border-jc-line rounded-jc-lg">
            <h3 className="text-lg font-display font-bold text-jc-ink mb-2">
              Besoin d&apos;envoyer ce courrier ?
            </h3>
            <p className="text-[14px] text-jc-ink-soft mb-4">
              JusteCourrier génère un courrier personnalisé et professionnel
              adapté à votre situation. PDF prêt à envoyer dès 3,90&nbsp;€,
              ou envoi postal inclus à partir de 5,90&nbsp;€.
            </p>
            <Link
              href={`/courrier/${relatedLetter.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-sm no-underline"
            >
              {relatedLetter.title} — Dès 3,90 € <IconArrow />
            </Link>
          </div>
        )}

        {/* ─── Other guides ─── */}
        {guides.filter((g) => g.slug !== guide.slug).length > 0 && (
          <div className="mt-12 pt-8 border-t border-jc-line">
            <h3 className="text-lg font-display font-bold text-jc-ink mb-4">
              Autres guides
            </h3>
            <div className="flex flex-col gap-3">
              {guides
                .filter((g) => g.slug !== guide.slug)
                .map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="flex items-center justify-between p-4 border border-jc-line rounded-jc bg-jc-bg-elev no-underline hover:border-jc-primary transition-colors"
                  >
                    <div>
                      <h4 className="text-[15px] font-semibold text-jc-ink">
                        {g.title}
                      </h4>
                      <span className="text-xs text-jc-ink-muted">
                        Lecture {g.readingTime}
                      </span>
                    </div>
                    <span className="text-jc-accent shrink-0 ml-3">
                      <IconArrow />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </article>

      {/* ─── Footer ─── */}
      </main>

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
              <h3 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Service
              </h3>
              <div className="flex flex-col gap-1">
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Catalogue</Link>
                <Link href="/guides" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Guides juridiques</Link>
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Tarifs</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h3>
              <div className="flex flex-col gap-1">
                <Link href="/mentions-legales" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Mentions légales</Link>
                <Link href="/cgv" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">CGV</Link>
                <Link href="/confidentialite" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Confidentialité</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h3>
              <div className="flex flex-col gap-1">
                <span className="text-jc-ink-soft py-1">contact@justecourrier.fr</span>
                <span className="text-jc-ink-soft py-1">Aide &amp; FAQ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} JusteCourrier · SIRET 104 347 919 00011</span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
