import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import LetterPreview from "@/components/LetterPreview";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata = {
  title: "Prévisualisation — Courrier IA",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Votre courrier est prêt
          </h1>
          <p className="mt-1 text-gray-600">
            {isPaid
              ? "Votre courrier complet est affiché ci-dessous."
              : "Aperçu de votre courrier. Débloquez le texte complet et le PDF pour 4,90 €."}
          </p>
        </div>

        {/* Letter preview */}
        <LetterPreview text={letter.generated_text || ""} isPaid={isPaid} />

        {/* CTA */}
        {isPaid ? (
          <div className="mt-6 text-center">
            <a
              href={`/api/download/${letter.id}`}
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Télécharger le PDF
            </a>
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-gray-700 mb-4">
              Pour obtenir le texte complet et le télécharger en PDF :
            </p>
            <CheckoutButton letterId={letter.id} />
            <p className="mt-3 text-xs text-gray-400">
              Paiement sécurisé par Stripe. Satisfait ou remboursé.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
