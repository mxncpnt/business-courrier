import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Connexion — Courrier IA",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Accueil
          </Link>
          <span className="text-xl font-bold text-gray-900">Courrier IA</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Se connecter
          </h1>
          <p className="text-gray-600 mb-6">
            Entrez votre email pour recevoir un lien de connexion. Pas de mot de
            passe nécessaire.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Une erreur est survenue lors de la connexion. Veuillez réessayer.
            </div>
          )}

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          La connexion est optionnelle. Elle permet de retrouver l&apos;historique
          de vos courriers.
        </p>
      </main>
    </div>
  );
}
