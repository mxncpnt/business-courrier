import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import LetterPreview from "@/components/LetterPreview";
import CheckoutButton from "@/components/CheckoutButton";
import Logo from "@/components/Logo";
import { IconCheck } from "@/components/Icons";

export const metadata = {
  title: "Aperçu — JusteCourrier",
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: letter, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !letter) {
    notFound();
  }

  const isPaid = letter.status === "paid" || letter.status === "delivered";

  let user = null;
  try {
    const authClient = await createAuthClient();
    const { data } = await authClient.auth.getUser();
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

      {/* ─── Content ─── */}
      <main className="px-6 md:px-20 pt-10 pb-24 max-w-[880px] mx-auto">
        {/* Badge + heading */}
        <div className="mb-6">
          <div className="flex gap-3 items-center mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-jc-accent-soft text-jc-accent">
              <IconCheck /> {isPaid ? "Courrier prêt" : "Aperçu prêt"}
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[38px] font-display font-bold text-jc-ink leading-tight">
            {isPaid ? "Ton courrier est prêt" : "Aperçu de ton courrier"}
          </h1>
          <p className="mt-2 text-[15px] text-jc-ink-soft">
            {isPaid
              ? "Ton courrier complet est affiché ci-dessous. Tu peux le télécharger en PDF."
              : "Voici un extrait de ton courrier. La version complète est livrée après paiement."}
          </p>
        </div>

        {/* Letter preview */}
        <LetterPreview text={letter.generated_text || ""} isPaid={isPaid} />

        {/* CTA */}
        {isPaid ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={`/api/download/${letter.id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
            >
              Télécharger le PDF
            </a>
            <Link
              href="/dashboard"
              className="text-[13px] text-jc-ink-muted no-underline hover:text-jc-ink transition-colors"
            >
              Voir mes courriers →
            </Link>
          </div>
        ) : (
          <div className="mt-6 bg-jc-bg-elev border border-jc-line rounded-jc-lg p-5 sm:p-8">
            {/* Price band */}
            <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
              <div>
                <div className="text-[13px] text-jc-ink-muted">Total à payer</div>
                <div className="text-[28px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
                  4,90 € <span className="text-[13px] text-jc-ink-muted font-normal">TTC</span>
                </div>
              </div>
              <div className="text-xs text-jc-ink-muted max-w-[280px]">
                Paiement sécurisé Stripe. Aucune donnée bancaire n&apos;est stockée par JusteCourrier.
              </div>
            </div>

            <CheckoutButton letterId={letter.id} />

            <p className="mt-3 text-xs text-jc-ink-muted text-center">
              Satisfait ou remboursé.
            </p>
          </div>
        )}
      </main>

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
