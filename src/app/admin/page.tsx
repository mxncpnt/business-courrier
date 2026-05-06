import { redirect } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { getLetterType } from "@/config/letter-types";
import { business } from "@/config/business";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Administration",
  robots: "noindex, nofollow",
};

type EnvFilter = "live" | "test" | "all";

interface AdminPageProps {
  searchParams: Promise<{ env?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  // ─── Auth + admin check ───
  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user || !(business.adminEmails as readonly string[]).includes(user.email ?? "")) {
    redirect("/");
  }

  // ─── Filtre env (test/live/all) — default live ───
  // Source de vérité = colonne `is_test` sur les tables business (tagged à
  // l'insert via lib/env-mode.ts → isTestEnv()).
  //   isTestValue === null → pas de filtre (mode "all")
  //   isTestValue === true → uniquement les enregistrements is_test = true
  //   isTestValue === false → uniquement live (default)
  const sp = await searchParams;
  const envParam = sp.env;
  const envFilter: EnvFilter =
    envParam === "test" || envParam === "all" ? envParam : "live";
  const isTestValue: boolean | null =
    envFilter === "all" ? null : envFilter === "test";

  const supabase = createServiceClient();

  // ─── Requêtes parallèles ───
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 1
  ).toISOString();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  // Construction des requêtes — on applique conditionnellement le filtre
  // is_test selon envFilter. Quand isTestValue est null (mode "all"), on
  // saute le .eq.
  const allLettersQ = supabase
    .from("letters")
    .select("id, status, created_at")
    .order("created_at", { ascending: false });
  const paidLettersQ = supabase
    .from("payments")
    .select("amount_cents, created_at, letter_id, status")
    .eq("status", "succeeded");
  const invoicesQ = supabase
    .from("invoices")
    .select(
      "id, invoice_number, customer_name, customer_email, description, amount_cents, paid_at, letter_id"
    )
    .order("paid_at", { ascending: false })
    .limit(50);
  const recentOrdersQ = supabase
    .from("letters")
    .select("id, type, status, email, created_at, paid_at, user_id")
    .order("created_at", { ascending: false })
    .limit(20);
  const customersQ = supabase
    .from("letters")
    .select("user_id", { count: "exact", head: true })
    .not("user_id", "is", null);

  const [
    { data: allLetters },
    { data: paidLetters },
    { data: invoices },
    { data: recentOrders },
    { count: totalCustomers },
  ] = await Promise.all([
    isTestValue === null ? allLettersQ : allLettersQ.eq("is_test", isTestValue),
    isTestValue === null ? paidLettersQ : paidLettersQ.eq("is_test", isTestValue),
    isTestValue === null ? invoicesQ : invoicesQ.eq("is_test", isTestValue),
    isTestValue === null ? recentOrdersQ : recentOrdersQ.eq("is_test", isTestValue),
    isTestValue === null ? customersQ : customersQ.eq("is_test", isTestValue),
  ]);

  // ─── Stats ───
  const payments = paidLetters ?? [];
  const totalRevenueCents = payments.reduce(
    (sum, p) => sum + (p.amount_cents ?? 0),
    0
  );
  const todayRevenueCents = payments
    .filter((p) => p.created_at >= startOfDay)
    .reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);
  const weekRevenueCents = payments
    .filter((p) => p.created_at >= startOfWeek)
    .reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);
  const monthRevenueCents = payments
    .filter((p) => p.created_at >= startOfMonth)
    .reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);

  const totalOrders = payments.length;
  const totalDrafts = (allLetters ?? []).filter(
    (l) => l.status === "draft"
  ).length;
  const conversionRate =
    (allLetters ?? []).length > 0
      ? ((totalOrders / (allLetters ?? []).length) * 100).toFixed(1)
      : "0";

  const formatEur = (cents: number) => (cents / 100).toFixed(2) + " €";

  return (
    <div className="min-h-screen bg-jc-bg">
      {/* ─── Nav ─── */}
      <header className="flex items-center justify-between border-b border-jc-line bg-jc-bg px-8 py-[18px]">
        <Link href="/" className="no-underline">
          <Logo size={22} />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-red-500 bg-red-50 px-2 py-1 rounded">
            Admin
          </span>
          <Link
            href="/dashboard"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="px-6 md:px-8 pt-10 pb-20 max-w-[1100px] mx-auto">
        {/* ─── Header ─── */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-red-500 font-body">
            Administration
          </span>
          <h1 className="mt-2 text-[28px] sm:text-[36px] font-display font-bold text-jc-ink">
            Tableau de bord
          </h1>
        </div>

        {/* ─── Toggle Test/Live/Tous ─── */}
        <div className="mb-8 inline-flex items-center gap-1 p-1 bg-jc-surface rounded-jc-sm border border-jc-line">
          <EnvTab href="/admin" label="Live" active={envFilter === "live"} />
          <EnvTab href="/admin?env=test" label="Test" active={envFilter === "test"} />
          <EnvTab href="/admin?env=all" label="Tous" active={envFilter === "all"} />
        </div>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <KpiCard label="CA total" value={formatEur(totalRevenueCents)} />
          <KpiCard label="CA aujourd'hui" value={formatEur(todayRevenueCents)} />
          <KpiCard label="CA semaine" value={formatEur(weekRevenueCents)} />
          <KpiCard label="CA mois" value={formatEur(monthRevenueCents)} />
          <KpiCard label="Commandes payées" value={String(totalOrders)} />
          <KpiCard label="Brouillons" value={String(totalDrafts)} />
          <KpiCard label="Clients uniques" value={String(totalCustomers ?? 0)} />
          <KpiCard label="Taux conversion" value={`${conversionRate}%`} />
        </div>

        {/* ─── Factures récentes ─── */}
        <div className="mb-10">
          <h2 className="text-lg font-display font-bold text-jc-ink mb-4">
            Factures récentes
          </h2>
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-jc-line bg-jc-surface/50">
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      N° Facture
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Client
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Description
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Montant
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(invoices ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-jc-ink-muted"
                      >
                        Aucune facture émise
                      </td>
                    </tr>
                  ) : (
                    (invoices ?? []).map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-jc-line/50 last:border-b-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          {inv.invoice_number}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-jc-ink font-medium">
                            {inv.customer_name}
                          </div>
                          <div className="text-jc-ink-muted text-xs">
                            {inv.customer_email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-jc-ink-soft">
                          {inv.description}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium">
                          {formatEur(inv.amount_cents)}
                        </td>
                        <td className="px-4 py-3 text-jc-ink-muted">
                          {new Date(inv.paid_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <a
                            href={`/api/invoice?id=${inv.id}`}
                            className="text-jc-accent hover:text-jc-primary no-underline text-xs font-medium"
                          >
                            ↓ PDF
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── Commandes récentes ─── */}
        <div>
          <h2 className="text-lg font-display font-bold text-jc-ink mb-4">
            Commandes récentes
          </h2>
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-jc-line bg-jc-surface/50">
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Statut
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-jc-ink-soft text-xs uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(recentOrders ?? []).map((order) => {
                    const lt = getLetterType(order.type);
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-jc-line/50 last:border-b-0"
                      >
                        <td className="px-4 py-3 font-medium text-jc-ink">
                          {lt?.title ?? order.type}
                        </td>
                        <td className="px-4 py-3 text-jc-ink-soft">
                          {order.email}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-jc-ink-muted">
                          {new Date(order.created_at).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Components ───

function EnvTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-xs font-semibold rounded-jc-sm transition-colors no-underline ${
        active
          ? "bg-jc-bg text-jc-ink shadow-sm"
          : "text-jc-ink-muted hover:text-jc-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5">
      <p className="text-xs text-jc-ink-muted font-medium mb-1">{label}</p>
      <p className="text-[22px] font-display font-bold text-jc-ink tabular-nums">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    draft: { label: "Brouillon", classes: "bg-jc-surface text-jc-ink-soft" },
    paid: { label: "Payé", classes: "bg-emerald-50 text-emerald-700" },
    delivered: {
      label: "Livré",
      classes: "bg-jc-accent-soft text-jc-accent",
    },
  };
  const badge = map[status] ?? map.draft;
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.classes}`}
    >
      {badge.label}
    </span>
  );
}
