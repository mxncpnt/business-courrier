import Link from "next/link";
import { guides } from "@/config/guides";
import { getLetterType } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";
import Logo from "@/components/Logo";
import { IconArrow } from "@/components/Icons";

export const metadata = {
  title: "Guides pratiques",
  description:
    "Guides juridiques et pratiques pour vos démarches administratives. Résiliation, contestation, mise en demeure : tout comprendre avant d'agir.",
};

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

      {/* ─── Articles ─── */}
      <section className="px-6 md:px-20 pt-2 pb-24 max-w-[860px] mx-auto">
        <div className="flex flex-col gap-4">
          {guides.map((guide) => {
            const letter = getLetterType(guide.relatedLetterSlug);
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="flex flex-col sm:flex-row sm:items-start gap-3 p-5 border border-jc-line rounded-jc bg-jc-bg-elev no-underline hover:border-jc-primary hover:-translate-y-px transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-semibold text-jc-ink leading-snug mb-1.5">
                    {guide.title}
                  </h2>
                  <p className="text-[14px] leading-relaxed text-jc-ink-soft mb-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-jc-ink-muted">
                    <span>Lecture {guide.readingTime}</span>
                    {letter && (
                      <>
                        <span>·</span>
                        <span className="text-jc-accent">
                          Courrier associé : {letter.title}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-jc-accent mt-1 sm:mt-2">
                  <IconArrow />
                </span>
              </Link>
            );
          })}
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
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Catalogue</Link>
                <Link href="/guides" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Guides juridiques</Link>
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Tarifs</Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h5>
              <div className="flex flex-col gap-1">
                <Link href="/mentions-legales" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Mentions légales</Link>
                <Link href="/cgv" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">CGV</Link>
                <Link href="/confidentialite" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Confidentialité</Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h5>
              <div className="flex flex-col gap-1">
                <span className="text-jc-ink-soft py-1">contact@justecourrier.fr</span>
                <span className="text-jc-ink-soft py-1">Aide &amp; FAQ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} JusteCourrier · SIRET en cours</span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
