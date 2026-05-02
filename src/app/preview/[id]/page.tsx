import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { getLetterType } from "@/config/letter-types";
import LetterPreview from "@/components/LetterPreview";
import EditableLetterText from "@/components/EditableLetterText";
import ConfirmMailingSend from "@/components/ConfirmMailingSend";
import MailingChoice from "@/components/MailingChoice";
import Logo from "@/components/Logo";
import { IconCheck } from "@/components/Icons";
import { getDisplayText } from "@/lib/letters/text";
import { getSignatureSignedUrl } from "@/lib/letters/signature";
import type { MailingMode } from "@/config/mailings";

export const metadata = {
  title: "Aperçu du courrier",
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
  const letterType = getLetterType(letter.type);
  const letterTitle = letterType?.title;

  // Mailing associé (si commande envoi physique). Utilisé pour verrouiller
  // l'édition une fois que le courrier a été remis à La Poste, et pour
  // afficher le bouton "Confirmer et envoyer à La Poste" quand le mailing
  // est en attente de confirmation utilisateur (status='paid').
  const { data: mailing } = await supabase
    .from("mailings")
    .select("id, status, mode")
    .eq("letter_id", letter.id)
    .maybeSingle();
  const LOCKED_STATUSES = new Set([
    "submitted",
    "in_transit",
    "delivered",
    "returned",
    "failed",
  ]);
  const editingLocked = mailing
    ? LOCKED_STATUSES.has(mailing.status)
    : false;
  // Mailing en attente de confirmation utilisateur post-paiement.
  const awaitingConfirm = mailing?.status === "paid";

  // Texte affiché : édition utilisateur si présente, sinon texte IA.
  const displayText = getDisplayText(letter);
  const generatedText = letter.generated_text ?? "";

  // Signature manuscrite globale de l'user (URL signée temporaire pour le
  // preview HTML AFNOR). Affichée uniquement quand isPaid (sinon le corps
  // est flouté, pas d'enjeu).
  const signatureUrl = letter.user_id
    ? await getSignatureSignedUrl(letter.user_id)
    : null;

  let user = null;
  try {
    const authClient = await createAuthClient();
    const { data } = await authClient.auth.getUser();
    user = data.user;
  } catch {
    // Not logged in
  }

  return (
    <div className="min-h-screen bg-jc-bg">
      {/* ─── Nav ─── */}
      <header className="flex items-center justify-between border-b border-jc-line bg-jc-bg px-8 py-[18px]">
        <Link href="/" className="no-underline">
          <Logo size={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/catalogue"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Catalogue
          </Link>
          <Link
            href="/guides"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/#fonctionnement"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Comment ça marche
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
            >
              Mes courriers
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors hidden sm:inline"
              >
                Se connecter
              </Link>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
              >
                Commencer un courrier
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── Content ─── */}
      <main className="px-6 md:px-20 pt-10 pb-24 max-w-[880px] mx-auto">
        {/* Badge + heading */}
        <div className="mb-6">
          <div className="flex gap-3 items-center mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-jc-accent-soft text-jc-accent">
              <IconCheck /> {isPaid ? "Courrier prêt" : "Aperçu prêt"}
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[38px] font-display font-bold text-jc-ink leading-tight">
            {isPaid ? "Ton courrier est prêt" : "Aperçu de ton courrier"}
          </h1>
          <p className="mt-2 text-[15px] text-jc-ink-soft">
            {isPaid
              ? "Ton courrier complet est affiché ci-dessous. Tu peux le télécharger en PDF."
              : "Voici un extrait de ton courrier. La version complète est livrée après paiement."}
          </p>
        </div>

        {/* Letter preview */}
        <LetterPreview
          text={displayText}
          isPaid={isPaid}
          formData={letter.form_data as Record<string, string> | undefined}
          letterTitle={letterTitle}
          signatureUrl={signatureUrl}
        />

        {/* Lien vers /profil pour ajouter/modifier sa signature */}
        {isPaid && (
          <p className="mt-4 text-center text-[13px] text-jc-ink-muted">
            {signatureUrl ? (
              <>
                Signature appliquée à votre courrier.{" "}
                <Link
                  href="/profil"
                  className="text-jc-accent hover:underline"
                >
                  Modifier ma signature →
                </Link>
              </>
            ) : (
              <Link
                href="/profil"
                className="text-jc-accent hover:underline"
              >
                ✍ Ajouter ma signature manuscrite →
              </Link>
            )}
          </p>
        )}

        {/* Édition du texte — visible uniquement quand le texte complet est
            affiché (isPaid). Avant paiement, le texte est flouté donc éditer
            n'a pas de sens. */}
        {isPaid && (
          <EditableLetterText
            letterId={letter.id}
            currentText={displayText}
            generatedText={generatedText}
            isLocked={editingLocked}
          />
        )}

        {/* Confirmation manuelle de l'envoi à La Poste — Édition A2.
            Affiché uniquement si le mailing est en `paid` (ni encore submit
            ni déjà submitted). Permet à l'user de relire/éditer puis de
            déclencher lui-même l'envoi MSB. Sinon le cron auto-submit à T+24h. */}
        {awaitingConfirm && mailing && (
          <ConfirmMailingSend
            mailingId={mailing.id}
            mailingMode={mailing.mode as MailingMode}
          />
        )}

        {/* CTA */}
        {isPaid ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={`/api/download/${letter.id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
            >
              Télécharger le PDF
            </a>
            <Link
              href="/dashboard"
              className="text-[13px] text-jc-ink-muted no-underline hover:text-jc-ink transition-colors"
            >
              Voir mes courriers →
            </Link>
          </div>
        ) : (
          <div className="mt-6 bg-jc-bg-elev border border-jc-line rounded-jc-lg p-5 sm:p-8">
            <MailingChoice
              letterId={letter.id}
              letterTypeSlug={letter.type}
              letterPriceCents={letterType?.priceCents ?? 390}
              formData={(letter.form_data ?? {}) as Record<string, string>}
            />
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-jc-line px-8 pt-12 pb-7 text-[13px] text-jc-ink-muted">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 pb-8">
            <div className="col-span-2 md:col-span-1">
              <Logo size={22} />
              <p className="mt-3.5 max-w-[280px] text-jc-ink-muted">
                Le courrier administratif simple, transparent et juste. Pas
                d&apos;abonnement, pas de piège.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Service
              </h5>
              <div className="flex flex-col gap-1">
                <Link
                  href="/catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Catalogue
                </Link>
                <Link
                  href="/guides"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Guides juridiques
                </Link>
                <Link
                  href="/catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Tarifs
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h5>
              <div className="flex flex-col gap-1">
                <Link
                  href="/mentions-legales"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Mentions légales
                </Link>
                <Link
                  href="/cgv"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  CGV
                </Link>
                <Link
                  href="/confidentialite"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Confidentialité
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h5>
              <div className="flex flex-col gap-1">
                <span className="text-jc-ink-soft py-1">
                  contact@justecourrier.fr
                </span>
                <span className="text-jc-ink-soft py-1">Aide &amp; FAQ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>
              © {new Date().getFullYear()} JusteCourrier · SIRET 104 347 919 00011
            </span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
