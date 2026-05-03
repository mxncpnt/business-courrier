import Link from "next/link";
import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";
import { IconShield } from "@/components/Icons";

export const metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre espace JusteCourrier pour retrouver vos courriers et télécharger vos PDF.",
  alternates: { canonical: "/connexion" },
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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

        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
        >
          Commencer un courrier
        </Link>
      </header>

      {/* ─── Content ─── */}
      <section className="px-6 pt-16 pb-24 max-w-[420px] mx-auto">
        {/* Eyebrow */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
            Espace personnel
          </span>
          <h1 className="mt-3 text-[28px] sm:text-[36px] font-display font-bold text-jc-ink leading-tight">
            Se connecter
          </h1>
          <p className="mt-3 text-[15px] text-jc-ink-soft">
            Entre ton email pour recevoir un lien de connexion. Pas de mot de
            passe nécessaire.
          </p>
        </div>

        {/* Card */}
        <div className="bg-jc-bg-elev border border-jc-line rounded-jc-lg p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-jc-sm text-sm text-red-700">
              Une erreur est survenue lors de la connexion. Réessaie.
            </div>
          )}

          <LoginForm />
        </div>

        {/* Reassurance */}
        <div className="mt-5 flex flex-col items-center gap-2 text-[12px] text-jc-ink-muted">
          <span className="inline-flex items-center gap-2">
            <IconShield /> Connexion sécurisée par lien magique
          </span>
          <p className="text-center">
            La connexion est optionnelle. Elle permet de retrouver
            l&apos;historique de tes courriers.
          </p>
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
            <span>© {new Date().getFullYear()} JusteCourrier · SIRET 104 347 919 00011</span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
