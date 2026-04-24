import { redirect } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { getLetterType } from "@/config/letter-types";

export const metadata = {
  title: "Mes courriers — Courrier IA",
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
    draft: { label: "Brouillon", color: "bg-gray-100 text-gray-700" },
    paid: { label: "Payé", color: "bg-green-100 text-green-700" },
    delivered: { label: "Livré", color: "bg-blue-100 text-blue-700" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Accueil
            </Link>
            <span className="text-xl font-bold text-gray-900">Courrier IA</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mes courriers</h1>
          <p className="mt-1 text-gray-600">
            Connecté avec {user.email}
          </p>
        </div>

        {!letters || letters.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-700 font-medium mb-2">
              Aucun courrier pour le moment
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Vos courriers générés apparaîtront ici.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg">
                        {letterType?.icon ?? "📄"}
                      </span>
                      <p className="font-medium text-gray-900 truncate">
                        {letterType?.title ?? letter.type}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 ml-9">{date}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPaid ? (
                      <a
                        href={`/api/download/${letter.id}`}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        PDF
                      </a>
                    ) : (
                      <Link
                        href={`/preview/${letter.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Se déconnecter
      </button>
    </form>
  );
}
