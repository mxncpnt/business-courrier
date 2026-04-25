import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import LetterPreview from "@/components/LetterPreview";

export const metadata = {
  title: "Paiement réussi — JusteCourrier",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ letter_id?: string }>;
}) {
  const { letter_id } = await searchParams;

  let letter = null;
  if (letter_id) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("letters")
      .select("*")
      .eq("id", letter_id)
      .single();
    letter = data;
  }

  return (
    <div className="min-h-screen bg-jc-bg">
      <header className="bg-jc-bg-elev border-b border-jc-line">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <span className="text-xl font-bold text-jc-ink">JusteCourrier</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-8 text-center mb-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-jc-ink font-display">
            Paiement réussi !
          </h1>
          <p className="mt-2 text-jc-ink-soft">
            Ton courrier complet est disponible ci-dessous.
          </p>
        </div>

        {letter?.generated_text && (
          <LetterPreview text={letter.generated_text} isPaid={true} />
        )}

        <div className="mt-6 flex flex-col items-center gap-4">
          {letter_id && (
            <a
              href={`/api/download/${letter_id}`}
              className="inline-block px-8 py-3 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors"
            >
              Télécharger le PDF
            </a>
          )}
          <Link
            href="/"
            className="text-jc-primary hover:text-jc-primary-hover font-medium"
          >
            ← Générer un autre courrier
          </Link>
        </div>
      </main>
    </div>
  );
}
