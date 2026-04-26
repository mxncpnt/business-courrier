import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { getLetterType } from "@/config/letter-types";
import Logo from "@/components/Logo";
import { IconDownload, IconShield, IconBolt, IconDoc } from "@/components/Icons";

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

export const metadata = {
  title: "Paiement confirmé",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ letter_id?: string }>;
}) {
  const { letter_id } = await searchParams;

  let letter: Record<string, unknown> | null = null;
  if (letter_id) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("letters")
      .select("*")
      .eq("id", letter_id)
      .single();
    letter = data;
  }

  const letterType = letter?.type ? getLetterType(letter.type as string) : null;
  const refId = letter_id ? `JC-${letter_id.substring(0, 12).toUpperCase()}` : "";

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
      <section className="px-6 md:px-20 pt-[72px] pb-24 max-w-[720px] mx-auto text-center">
        {/* Stamp */}
        <div className="mb-6">
          <div
            className="inline-flex items-center justify-center w-[92px] h-[92px] rounded-full border-2 border-jc-accent text-jc-accent font-display text-[12px] font-semibold uppercase leading-[1.1] tracking-[0.04em] relative"
            style={{ transform: "rotate(-6deg)" }}
          >
            <span
              className="absolute inset-[5px] border border-dashed border-jc-accent rounded-full"
              aria-hidden="true"
            />
            Courrier
            <br />
            prêt
            <br />
            JC
          </div>
        </div>

        {/* Eyebrow */}
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
          Paiement confirmé
        </span>

        {/* Title */}
        <h1 className="mt-3.5 text-[32px] sm:text-[44px] font-display font-bold text-jc-ink leading-tight">
          Ton courrier est prêt.
        </h1>

        {/* Subtitle with email */}
        <p className="mt-4 text-[15px] sm:text-[17px] text-jc-ink-soft mb-8">
          Le PDF a été envoyé à{" "}
          <strong className="text-jc-ink">
            {(letter?.email as string) || "ton adresse email"}
          </strong>
          . Tu peux aussi le télécharger directement ci-dessous.
        </p>

        {/* ─── Download card ─── */}
        <div className="bg-jc-bg-elev border border-jc-line rounded-jc-lg p-6 text-left">
          {letterType && (
            <div className="flex gap-3.5 items-center mb-5">
              <div className="w-11 h-11 rounded-jc flex items-center justify-center bg-jc-surface text-[22px] font-display shrink-0">
                {CAT_ICONS[letterType.slug] || letterType.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-jc-ink">
                  {letterType.title}
                </h4>
                <span className="text-[12px] text-jc-ink-muted">
                  Référence #{refId}
                </span>
              </div>
            </div>
          )}

          {letter_id && (
            <>
              <a
                href={`/api/download/${letter_id}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
              >
                <IconDownload /> Télécharger le PDF
              </a>
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 border border-jc-line-strong text-jc-ink font-medium rounded-jc hover:bg-jc-surface transition-colors text-sm no-underline mt-2.5"
              >
                Voir mes courriers
              </Link>
            </>
          )}
        </div>

        {/* ─── Et maintenant ? ─── */}
        <div className="mt-7 bg-jc-surface rounded-jc p-5 text-left">
          <h4 className="text-[15px] font-semibold text-jc-ink mb-2">
            Et maintenant ?
          </h4>
          <ol className="list-decimal pl-5 text-[14px] text-jc-ink-soft space-y-1.5">
            <li>Imprime le PDF, signe-le à la main.</li>
            <li>
              Envoie-le en lettre recommandée avec accusé de réception (LRAR)
              — c&apos;est ce qui donne date certaine.
            </li>
            <li>Conserve l&apos;avis de réception pendant au moins 2 ans.</li>
          </ol>
        </div>

        {/* ─── Reassurance ─── */}
        <div className="mt-5 flex flex-col gap-2 text-[12px] text-jc-ink-muted">
          <span className="inline-flex items-center gap-2">
            <IconShield /> Paiement chiffré SSL
          </span>
          <span className="inline-flex items-center gap-2">
            <IconBolt /> Téléchargement immédiat après paiement
          </span>
          <span className="inline-flex items-center gap-2">
            <IconDoc /> Facture envoyée par email
          </span>
        </div>

        {/* Contact */}
        <p className="mt-7 text-[13px] text-jc-ink-muted">
          Une question ?{" "}
          <a
            href="mailto:contact@justecourrier.fr"
            className="text-jc-accent hover:underline no-underline"
          >
            contact@justecourrier.fr
          </a>
        </p>
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
