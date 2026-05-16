import Link from "next/link";
import { guides, GUIDE_CATEGORIES } from "@/config/guides";
import { getLetterType } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { buildBreadcrumb, buildCollectionPage } from "@/lib/jsonld";
import Logo from "@/components/Logo";
import GuidesBrowser, {
  type BrowserGuide,
} from "@/components/GuidesBrowser";

export const metadata = {
  title: "Guides pratiques",
  description:
    "Guides juridiques et pratiques pour vos démarches administratives. Résiliation, contestation, mise en demeure : tout comprendre avant d'agir.",
  alternates: { canonical: "/guides" },
};

// JSON-LD via builders centralisés (cf. src/lib/jsonld.ts)
const collectionLd = buildCollectionPage({
  name: "Guides pratiques JusteCourrier",
  description:
    "Guides juridiques et pratiques pour vos démarches administratives. Résiliation, contestation, mise en demeure : tout comprendre avant d'agir.",
  path: "/guides",
  itemListName: "Guides pratiques",
  itemListItems: guides.map((g) => ({
    name: g.title,
    path: `/guides/${g.slug}`,
  })),
});
const breadcrumbLd = buildBreadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Guides", path: "/guides" },
]);

// Enrichissement côté serveur : on pré-résout le titre du courrier associé
// pour chaque guide, afin d'éviter d'embarquer toute la config letter-types
// dans le bundle client de GuidesBrowser. La page reste server-rendered et
// le HTML servi à Google contient tous les guides (chips client = simple
// progressive enhancement).
const browserGuides: BrowserGuide[] = guides.map((g) => ({
  slug: g.slug,
  title: g.title,
  description: g.description,
  readingTime: g.readingTime,
  category: g.category,
  letterTitle: getLetterType(g.relatedLetterSlug)?.title ?? null,
}));

export default async function GuidesPage() {
  let user = null;
  try {
    const supabase = await createAuthClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-jc-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
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

      {/* ─── Hero ─── */}
      <section className="px-6 md:px-20 pt-14 pb-8 max-w-[860px] mx-auto">
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
          Guides pratiques
        </span>
        <h1 className="mt-3.5 mb-3.5 text-[44px] leading-[1.05] tracking-[-0.03em] font-display font-bold text-jc-ink max-md:text-[30px] max-md:leading-[1.1]">
          Comprendre vos droits avant d&apos;agir.
        </h1>
        <p className="text-[17px] leading-relaxed text-jc-ink-soft max-w-[640px] max-md:text-[15px]">
          Des guides clairs et concrets pour vos démarches administratives et
          juridiques. Chaque guide vous explique la procédure et vous propose un
          courrier prêt à envoyer.
        </p>
      </section>

      {/* ─── Guides groupés par catégorie (avec chips client) ─── */}
      <section className="px-6 md:px-20 pt-2 pb-24 max-w-[860px] mx-auto">
        <GuidesBrowser
          guides={browserGuides}
          categories={GUIDE_CATEGORIES}
        />
      </section>

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
