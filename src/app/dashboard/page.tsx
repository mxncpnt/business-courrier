import { redirect } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { getLetterType } from "@/config/letter-types";

export const metadata = {
  title: "Mes courriers — JusteCourrier",
};

export default async function DashboardPage() {
  // Check auth
  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // Fetch user's letters
  const supabase = createServiceClient();
  const { data: letters } = await supabase
    .from("letters")
    .select("id, type, status, created_at, email")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: "Brouillon", color: "bg-jc-surface text-jc-ink-soft" },
    paid: { label: "Payé", color: "bg-jc-success/10 text-jc-success" },
    delivered: { label: "Livré", color: "bg-jc-primary/10 text-jc-primary" },
  };

  return (
    <div className="min-h-screen bg-jc-bg">
      <header className="bg-jc-bg-elev border-b border-jc-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-jc-ink-muted hover:text-jc-ink-soft transition-colors"
            >
              ← Accueil
            </Link>
            <span className="text-xl font-bold text-jc-ink">JusteCourrier</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-jc-ink font-display">Mes courriers</h1>
          <p className="mt-1 text-jc-ink-soft">
            Connecté avec {user.email}
          </p>
        </div>

        {!letters || letters.length === 0 ? (
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-jc-ink-soft font-medium mb-2">
              Aucun courrier pour le moment
            </p>
            <p className="text-jc-ink-muted text-sm mb-6">
              Tes courriers générés apparaîtront ici.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors"
            >
              Générer un courrier
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => {
              const letterType = getLetterType(letter.type);
              const status = statusLabels[letter.status] ?? statusLabels.draft;
              const isPaid =
                letter.status === "paid" || letter.status === "delivered";
              const date = new Date(letter.created_at).toLocaleDateString(
                "fr-FR",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={letter.id}
                  className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg">
                        {letterType?.icon ?? "📄"}
                      </span>
                      <p className="font-medium text-jc-ink truncate">
                        {letterType?.title ?? letter.type}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-jc-ink-muted ml-9">{date}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPaid ? (
                      <a
                        href={`/api/download/${letter.id}`}
                        className="px-4 py-2 bg-jc-primary text-white text-sm font-medium rounded-jc-sm hover:bg-jc-primary-hover transition-colors"
                      >
                        PDF
                      </a>
                    ) : (
                      <Link
                        href={`/preview/${letter.id}`}
                        className="px-4 py-2 border border-jc-line-strong text-jc-ink-soft text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors"
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
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/auth/logout" method="POST">
      <button
        type="submit"
        className="text-sm text-jc-ink-muted hover:text-jc-ink-soft transition-colors"
      >
        Se déconnecter
      </button>
    </form>
  );
}
