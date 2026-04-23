import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import LetterPreview from "@/components/LetterPreview";

export const metadata = {
  title: "Paiement réussi — Courrier IA",
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <span className="text-xl font-bold text-gray-900">Courrier IA</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Paiement réussi !
          </h1>
          <p className="mt-2 text-gray-600">
            Votre courrier complet est disponible ci-dessous.
          </p>
        </div>

        {letter?.generated_text && (
          <LetterPreview text={letter.generated_text} isPaid={true} />
        )}

        <div className="mt-6 flex flex-col items-center gap-4">
          {letter_id && (
            <a
              href={`/api/download/${letter_id}`}
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Télécharger le PDF
            </a>
          )}
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Générer un autre courrier
          </Link>
        </div>
      </main>
    </div>
  );
}
