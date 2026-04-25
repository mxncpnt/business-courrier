import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Connexion — JusteCourrier",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-jc-bg">
      <header className="bg-jc-bg-elev border-b border-jc-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-jc-ink-muted hover:text-jc-ink-soft transition-colors"
          >
            ← Accueil
          </Link>
          <span className="text-xl font-bold text-jc-ink">JusteCourrier</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-8">
          <h1 className="text-2xl font-bold text-jc-ink mb-2 font-display">
            Se connecter
          </h1>
          <p className="text-jc-ink-soft mb-6">
            Entre ton email pour recevoir un lien de connexion. Pas de mot de
            passe nécessaire.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-jc-sm text-sm text-red-700">
              Une erreur est survenue lors de la connexion. Réessaie.
            </div>
          )}

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-jc-ink-muted">
          La connexion est optionnelle. Elle permet de retrouver l&apos;historique
          de tes courriers.
        </p>
      </main>
    </div>
  );
}
