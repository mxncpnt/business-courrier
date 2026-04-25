import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import LetterPreview from "@/components/LetterPreview";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata = {
  title: "Prévisualisation — JusteCourrier",
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
    <div className="min-h-screen bg-jc-bg">
      {/* Header */}
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

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-jc-ink font-display">
            Ton courrier est prêt
          </h1>
          <p className="mt-1 text-jc-ink-soft">
            {isPaid
              ? "Ton courrier complet est affiché ci-dessous."
              : "Aperçu de ton courrier. Débloque le texte complet et le PDF pour 4,90 €."}
          </p>
        </div>

        {/* Letter preview */}
        <LetterPreview text={letter.generated_text || ""} isPaid={isPaid} />

        {/* CTA */}
        {isPaid ? (
          <div className="mt-6 text-center">
            <a
              href={`/api/download/${letter.id}`}
              className="inline-block px-8 py-3 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors"
            >
              Télécharger le PDF
            </a>
          </div>
        ) : (
          <div className="mt-6 bg-jc-bg-elev rounded-jc-lg border border-jc-line p-6 text-center">
            <p className="text-jc-ink-soft mb-4">
              Pour obtenir le texte complet et le télécharger en PDF :
            </p>
            <CheckoutButton letterId={letter.id} />
            <p className="mt-3 text-xs text-jc-ink-muted">
              Paiement sécurisé par Stripe. Satisfait ou remboursé.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
