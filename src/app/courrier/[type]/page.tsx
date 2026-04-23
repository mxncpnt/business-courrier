import { notFound } from "next/navigation";
import Link from "next/link";
import { getLetterType, letterTypes } from "@/config/letter-types";
import LetterForm from "@/components/LetterForm";

// Generate static params for all letter types
export function generateStaticParams() {
  return letterTypes.map((lt) => ({ type: lt.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const letterType = getLetterType(type);
  if (!letterType) return {};

  return {
    title: `${letterType.title} — Courrier IA`,
    description: letterType.description,
  };
}

export default async function LetterFormPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const letterType = getLetterType(type);

  if (!letterType) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </Link>
          <span className="text-xl font-bold text-gray-900">Courrier IA</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{letterType.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900">
              {letterType.title}
            </h1>
          </div>
          <p className="text-gray-600">{letterType.description}</p>
          <p className="mt-2 text-sm text-blue-600 font-medium">
            {(letterType.priceCents / 100).toFixed(2)} € — PDF personnalisé
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <LetterForm letterType={letterType} />
        </div>
      </main>
    </div>
  );
}
