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
    title: `${letterType.title} — JusteCourrier`,
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
    <div className="min-h-screen bg-jc-bg">
      {/* Header */}
      <header className="bg-jc-bg-elev border-b border-jc-line">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-jc-ink-muted hover:text-jc-ink-soft transition-colors"
          >
            ← Retour
          </Link>
          <span className="text-xl font-bold text-jc-ink">JusteCourrier</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{letterType.icon}</span>
            <h1 className="text-2xl font-bold text-jc-ink font-display">
              {letterType.title}
            </h1>
          </div>
          <p className="text-jc-ink-soft">{letterType.description}</p>
          <p className="mt-2 text-sm text-jc-accent font-medium">
            {(letterType.priceCents / 100).toFixed(2)} € — PDF personnalisé
          </p>
        </div>

        {/* Form */}
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-6 sm:p-8">
          <LetterForm letterType={letterType} />
        </div>
      </main>
    </div>
  );
}
