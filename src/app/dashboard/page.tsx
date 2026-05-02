import { redirect } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { getLetterType } from "@/config/letter-types";
import Logo from "@/components/Logo";
import { IconDownload } from "@/components/Icons";

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

const STATUS_BADGES: Record<string, { label: string; classes: string }> = {
  draft: {
    label: "Brouillon",
    classes: "bg-jc-surface text-jc-ink-soft",
  },
  paid: {
    label: "Payé",
    classes: "bg-emerald-50 text-emerald-700",
  },
  delivered: {
    label: "Livré",
    classes: "bg-jc-accent-soft text-jc-accent",
  },
};

// Badge synthétique pour la colonne "Envoi" sur le dashboard.
// Mapping aligné sur `mailings.status` (cf. /mailings/[id] pour la version riche).
const MAILING_STATUS_BADGES: Record<
  string,
  { label: string; classes: string }
> = {
  pending: { label: "Envoi en attente", classes: "bg-jc-surface text-jc-ink-soft" },
  paid: { label: "Envoi à venir", classes: "bg-jc-surface text-jc-ink-soft" },
  submitted: { label: "Soumis", classes: "bg-blue-50 text-blue-700" },
  in_transit: {
    label: "En acheminement",
    classes: "bg-jc-accent-soft text-jc-accent",
  },
  delivered: { label: "Distribué", classes: "bg-emerald-50 text-emerald-700" },
  returned: { label: "Retourné", classes: "bg-orange-50 text-orange-700" },
  failed: { label: "Échec d'envoi", classes: "bg-red-50 text-red-700" },
};

export const metadata = {
  title: "Mes courriers",
};

export default async function DashboardPage() {
  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const supabase = createServiceClient();
  const { data: letters } = await supabase
    .from("letters")
    .select("id, type, status, created_at, email")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Récupérer les factures de l'utilisateur
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, letter_id, invoice_number")
    .eq("user_id", user.id);

  const invoiceByLetter = new Map(
    (invoices ?? []).map((inv) => [inv.letter_id, inv])
  );

  // Récupérer les envois physiques (1 par letter max au MVP). Permet
  // d'afficher le badge "Envoi" et le lien vers /mailings/[id] sur chaque card.
  const { data: mailings } = await supabase
    .from("mailings")
    .select("id, letter_id, status, mode")
    .eq("user_id", user.id);

  const mailingByLetter = new Map(
    (mailings ?? []).map((m) => [m.letter_id, m])
  );

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

        <div className="flex items-center gap-3">
          <LogoutButton />
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
          >
            Nouveau courrier
          </Link>
        </div>
      </header>

      {/* ─── Content ─── */}
      <section className="px-6 md:px-8 pt-10 pb-20 max-w-[820px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
            Espace personnel
          </span>
          <h1 className="mt-2 text-[28px] sm:text-[36px] font-display font-bold text-jc-ink">
            Mes courriers
          </h1>
          <p className="mt-2 text-[15px] text-jc-ink-soft">
            Connecté avec <strong className="text-jc-ink">{user.email}</strong>
          </p>
        </div>

        {/* Letters list or empty state */}
        {!letters || letters.length === 0 ? (
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jc-surface text-[28px] mb-5">
              ✉
            </div>
            <p className="text-jc-ink font-semibold mb-1.5">
              Aucun courrier pour le moment
            </p>
            <p className="text-jc-ink-muted text-sm mb-6">
              Tes courriers générés apparaîtront ici.
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors no-underline"
            >
              Générer un courrier
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => {
              const letterType = getLetterType(letter.type);
              const status = STATUS_BADGES[letter.status] ?? STATUS_BADGES.draft;
              const isPaid =
                letter.status === "paid" || letter.status === "delivered";
              const date = new Date(letter.created_at).toLocaleDateString(
                "fr-FR",
                { day: "numeric", month: "long", year: "numeric" }
              );
              const icon =
                CAT_ICONS[letter.type] || letterType?.icon || "📄";

              const mailing = mailingByLetter.get(letter.id);
              const mailingBadge = mailing
                ? MAILING_STATUS_BADGES[mailing.status]
                : null;

              return (
                <div
                  key={letter.id}
                  className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex gap-3.5 items-center min-w-0">
                    <div className="w-10 h-10 rounded-jc flex items-center justify-center bg-jc-surface text-[20px] font-display shrink-0">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-medium text-[15px] text-jc-ink truncate">
                          {letterType?.title ?? letter.type}
                        </p>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${status.classes}`}
                        >
                          {status.label}
                        </span>
                        {mailingBadge && (
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${mailingBadge.classes}`}
                          >
                            {mailingBadge.label}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-jc-ink-muted">{date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPaid ? (
                      <>
                        <a
                          href={`/api/download/${letter.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-jc-primary text-white text-sm font-medium rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
                        >
                          <IconDownload /> PDF
                        </a>
                        {invoiceByLetter.has(letter.id) && (
                          <a
                            href={`/api/invoice?id=${invoiceByLetter.get(letter.id)!.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-jc-line-strong text-jc-ink text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors no-underline"
                            title={`Facture ${invoiceByLetter.get(letter.id)!.invoice_number}`}
                          >
                            Facture
                          </a>
                        )}
                        {mailing && (
                          <Link
                            href={`/mailings/${mailing.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-jc-line-strong text-jc-ink text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors no-underline"
                          >
                            Suivi
                          </Link>
                        )}
                      </>
                    ) : (
                      <Link
                        href={`/preview/${letter.id}`}
                        className="px-4 py-2 border border-jc-line-strong text-jc-ink text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors no-underline"
                      >
                        Voir
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

function LogoutButton() {
  return (
    <form action="/auth/logout" method="POST">
      <button
        type="submit"
        className="text-sm text-jc-ink-soft font-medium hover:text-jc-ink transition-colors"
      >
        Se déconnecter
      </button>
    </form>
  );
}
