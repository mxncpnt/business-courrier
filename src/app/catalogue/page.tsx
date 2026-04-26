import Link from "next/link";
import { categories, letterTypes } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";
import Logo from "@/components/Logo";
import { IconArrow } from "@/components/Icons";

export const metadata = {
  title: "Catalogue — JusteCourrier",
  description:
    "10 modèles de courriers administratifs, un seul prix. Résiliation, contestation, réclamation, mise en demeure, demande de remboursement.",
};

// Icônes catalogue par slug
const CAT_ICONS: Record<string, string> = {
  "resiliation-abonnement": "✂",
  "resiliation-bail": "⌂",
  "contestation-amende": "⚖",
  "contestation-facture": "€",
  "contestation-decision": "▣",
  "reclamation-service-client": "✉",
  "reclamation-administration": "▤",
  "mise-en-demeure-payer": "!",
  "mise-en-demeure-executer": "↻",
  "demande-remboursement": "↩",
};

export default async function CataloguePage() {
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
      {/* ─── Nav ─── */}
      <header className="flex items-center justify-between border-b border-jc-line bg-jc-bg px-8 py-[18px]">
        <Link href="/" className="no-underline">
          <Logo size={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/catalogue"
            className="text-jc-ink text-sm font-medium no-underline"
          >
            Catalogue
          </Link>
          <Link
            href="#"
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

      {/* ─── Hero ─── */}
      <section className="px-6 md:px-20 pt-14 pb-8 max-w-[1200px] mx-auto">
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
          Catalogue
        </span>
        <h1 className="mt-3.5 mb-3.5 text-[48px] leading-[1.05] tracking-[-0.03em] font-display font-bold text-jc-ink max-md:text-[32px] max-md:leading-[1.1]">
          10 modèles de courriers, un seul prix.
        </h1>
        <p className="text-[17px] leading-relaxed text-jc-ink-soft mb-7 max-w-[640px] max-md:text-[15px]">
          Choisis le type de courrier qui correspond à ta situation. Tous nos
          courriers sont à{" "}
          <strong className="text-jc-ink">4,90 € à l&apos;unité</strong>, sans
          abonnement.
        </p>

        {/* Barre de recherche (cosmétique) */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-jc-line-strong rounded-jc bg-jc-bg-elev max-w-[480px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-jc-ink-muted shrink-0"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="m20 20-3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un type de courrier…"
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-jc-ink placeholder:text-jc-ink-muted font-body"
          />
        </div>
      </section>

      {/* ─── Catégories ─── */}
      <section className="px-6 md:px-20 pt-4 pb-24 max-w-[1200px] mx-auto">
        {categories.map((cat) => {
          const letters = letterTypes.filter((lt) => lt.category === cat.slug);
          if (letters.length === 0) return null;

          return (
            <div key={cat.slug} className="mt-9">
              {/* En-tête catégorie */}
              <div className="flex items-baseline justify-between mb-3.5 gap-3 flex-wrap">
                <h2 className="text-[28px] font-display font-bold text-jc-ink max-md:text-[22px]">
                  {cat.label}
                </h2>
                <span className="text-[13px] text-jc-ink-muted">
                  {cat.description}
                </span>
              </div>

              {/* Grille items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {letters.map((letter) => (
                  <Link
                    key={letter.slug}
                    href={`/courrier/${letter.slug}`}
                    className="flex items-start gap-3.5 p-[18px] border border-jc-line rounded-jc bg-jc-bg-elev no-underline hover:border-jc-primary hover:-translate-y-px transition-all"
                  >
                    {/* Icône */}
                    <span className="w-10 h-10 rounded-jc-sm bg-jc-accent-soft text-jc-accent flex items-center justify-center shrink-0 text-xl font-display">
                      {CAT_ICONS[letter.slug] || letter.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Titre + badge + prix */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-[15px] font-semibold text-jc-ink leading-snug">
                            {letter.title}
                          </h4>
                          {letter.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-jc-accent-soft text-jc-accent">
                              Populaire
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-jc-ink tabular-nums shrink-0">
                          4,90 €
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[13px] leading-[1.45] text-jc-ink-soft mb-1.5">
                        {letter.description}
                      </p>

                      {/* Durée */}
                      <span className="text-xs text-jc-ink-muted">
                        ⏱ {letter.duration}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
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
                  href="#"
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
              © {new Date().getFullYear()} JusteCourrier · SIRET en cours
            </span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
