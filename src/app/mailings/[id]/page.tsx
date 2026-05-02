/**
 * Page de suivi d'un envoi postal — `/mailings/[id]`.
 *
 * Authentifiée. RLS garantit qu'un user ne voit que ses propres mailings :
 *   - SELECT mailings : `auth.uid() = user_id`
 *   - SELECT mailing_events : EXISTS via mailings.user_id
 *
 * Affiche :
 *   - Statut courant (badge + libellé)
 *   - Détails (mode, tracking, dates, total facturé)
 *   - Adresses expéditeur + destinataire (snapshot DB)
 *   - Timeline des événements (mailing_events, plus récent en haut)
 *   - Téléchargements : PDF posté (= courrier + PJ mergé), preuve de dépôt,
 *     AR signé (selon disponibilité)
 *   - Lien direct suivi La Poste si tracking_number disponible
 */

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { getLetterType } from "@/config/letter-types";
import { getMailingModeConfig, type MailingMode } from "@/config/mailings";
import Logo from "@/components/Logo";
import { IconDownload } from "@/components/Icons";

// ─── Mapping statut → badge ──────────────────────────────────────────────────

const STATUS_BADGES: Record<
  string,
  { label: string; classes: string; description: string }
> = {
  pending: {
    label: "En attente",
    classes: "bg-jc-surface text-jc-ink-soft",
    description: "Le paiement n'a pas encore été confirmé.",
  },
  paid: {
    label: "Payé",
    classes: "bg-emerald-50 text-emerald-700",
    description: "Paiement reçu, soumission à La Poste en cours.",
  },
  submitted: {
    label: "Soumis",
    classes: "bg-blue-50 text-blue-700",
    description: "Le courrier a été transmis à La Poste pour traitement.",
  },
  in_transit: {
    label: "En cours d'acheminement",
    classes: "bg-jc-accent-soft text-jc-accent",
    description: "Votre courrier est en circuit postal.",
  },
  delivered: {
    label: "Distribué",
    classes: "bg-emerald-50 text-emerald-700",
    description: "Le destinataire a bien reçu votre courrier.",
  },
  returned: {
    label: "Retourné",
    classes: "bg-orange-50 text-orange-700",
    description: "Le courrier n'a pas pu être distribué.",
  },
  failed: {
    label: "Échec",
    classes: "bg-red-50 text-red-700",
    description: "Une erreur est survenue lors de l'envoi.",
  },
};

// ─── Mapping event_type → label humain + variant ────────────────────────────

const EVENT_LABELS: Record<
  string,
  { label: string; variant: "neutral" | "info" | "success" | "warning" | "error" }
> = {
  "letter.created": { label: "Courrier créé chez l'imprimeur", variant: "neutral" },
  "letter.accepted": { label: "Accepté par l'imprimerie", variant: "info" },
  "letter.filing_proof": { label: "Déposé à La Poste", variant: "info" },
  "letter.sent": { label: "Envoyé en circuit postal", variant: "info" },
  "letter.in_transit": { label: "En cours de distribution", variant: "info" },
  "letter.waiting_to_be_withdrawn": {
    label: "En attente de retrait au bureau de poste",
    variant: "warning",
  },
  "letter.distributed": { label: "Remis au destinataire", variant: "success" },
  "letter.delivery_proof": {
    label: "Accusé de réception signé",
    variant: "success",
  },
  "letter.returned_to_sender": {
    label: "Retourné à l'expéditeur",
    variant: "warning",
  },
  "letter.return_to_sender_proof": {
    label: "Preuve de retour scannée",
    variant: "warning",
  },
  "letter.wrong_address": {
    label: "Adresse non identifiée (NPAI)",
    variant: "error",
  },
  "letter.lost": { label: "Lettre perdue", variant: "error" },
  "letter.error": { label: "Erreur de traitement", variant: "error" },
  "letter.canceled": { label: "Annulée", variant: "neutral" },
};

const EVENT_DOT_CLASSES: Record<
  "neutral" | "info" | "success" | "warning" | "error",
  string
> = {
  neutral: "bg-jc-line-strong",
  info: "bg-jc-accent",
  success: "bg-emerald-500",
  warning: "bg-orange-500",
  error: "bg-red-500",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

interface AttachmentSnapshot {
  name: string;
  storage_path: string;
  size_bytes: number;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Suivi de votre envoi",
};

export default async function MailingTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?redirect=/mailings/${id}`);
  }

  // ─── Récupération mailing + lettre liée (RLS auto via auth.uid()) ────────
  const { data: mailing, error: mailingError } = await supabase
    .from("mailings")
    .select(
      `id, mode, status, last_event_status, last_event_at,
       provider_mailing_id, tracking_number,
       sender_name, sender_address_line1, sender_address_line2,
       sender_zipcode, sender_city, sender_country,
       recipient_name, recipient_address_line1, recipient_address_line2,
       recipient_zipcode, recipient_city, recipient_country,
       cost_cents, markup_cents, total_cents,
       proof_of_deposit_url, proof_of_receipt_url,
       attachments,
       created_at, paid_at, submitted_at, delivered_at,
       letter_id,
       letters!letter_id(type)`
    )
    .eq("id", id)
    .maybeSingle();

  if (mailingError || !mailing) {
    notFound();
  }

  // ─── Récupération events (RLS via mailings.user_id) ──────────────────────
  const { data: eventsRaw } = await supabase
    .from("mailing_events")
    .select("event_type, occurred_at, received_at")
    .eq("mailing_id", id)
    .order("occurred_at", { ascending: false });

  const events = eventsRaw ?? [];

  // ─── Données dérivées ────────────────────────────────────────────────────
  const letterRow = Array.isArray(mailing.letters)
    ? mailing.letters[0]
    : mailing.letters;
  const letterType = letterRow?.type
    ? getLetterType(letterRow.type)
    : undefined;
  const letterTitle =
    letterType?.title ?? letterRow?.type?.replace(/-/g, " ") ?? "Courrier";

  const mode = mailing.mode as MailingMode;
  const modeConfig = getMailingModeConfig(mode);
  const statusBadge =
    STATUS_BADGES[mailing.status] ?? STATUS_BADGES.pending;

  const attachments = (mailing.attachments ?? []) as AttachmentSnapshot[];

  const trackingUrl = mailing.tracking_number
    ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(mailing.tracking_number)}`
    : null;

  const shortRef = mailing.id.slice(0, 8).toUpperCase();

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
            href="/dashboard"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Mes courriers
          </Link>
        </nav>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
        >
          Nouveau courrier
        </Link>
      </header>

      {/* ─── Content ─── */}
      <section className="px-6 md:px-8 pt-8 pb-20 max-w-[820px] mx-auto">
        {/* Breadcrumb */}
        <p className="text-[13px] text-jc-ink-muted mb-4">
          <Link
            href="/dashboard"
            className="text-jc-ink-soft no-underline hover:text-jc-ink"
          >
            Mes courriers
          </Link>
          <span className="mx-2">›</span>
          <span>Suivi de l&apos;envoi {shortRef}</span>
        </p>

        {/* En-tête */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
            Suivi d&apos;envoi
          </span>
          <h1 className="mt-2 text-[28px] sm:text-[36px] font-display font-bold text-jc-ink">
            {letterTitle}
          </h1>
          <p className="mt-2 text-[15px] text-jc-ink-soft">
            Envoi {modeConfig.label} · Référence{" "}
            <strong className="text-jc-ink">{shortRef}</strong>
          </p>
        </div>

        {/* Statut hero */}
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span
                className={`inline-flex items-center text-[12px] font-semibold px-2.5 py-1 rounded-full ${statusBadge.classes}`}
              >
                {statusBadge.label}
              </span>
              <p className="mt-3 text-[15px] text-jc-ink-soft max-w-[480px]">
                {statusBadge.description}
              </p>
              {mailing.last_event_at && (
                <p className="mt-2 text-[13px] text-jc-ink-muted">
                  Dernière mise à jour&nbsp;:{" "}
                  {formatDateTime(mailing.last_event_at)}
                </p>
              )}
            </div>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-jc-line-strong text-jc-ink text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors no-underline"
              >
                Suivi La Poste ↗
              </a>
            )}
          </div>
          {mailing.tracking_number && (
            <div className="mt-4 pt-4 border-t border-jc-line">
              <p className="text-[12px] uppercase tracking-[0.06em] text-jc-ink-muted">
                Numéro de suivi
              </p>
              <p className="mt-1 text-[15px] font-mono text-jc-ink">
                {mailing.tracking_number}
              </p>
            </div>
          )}
        </div>

        {/* Téléchargements */}
        {(mailing.proof_of_deposit_url ||
          mailing.proof_of_receipt_url ||
          mailing.letter_id) && (
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-6 mb-6">
            <h2 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-jc-accent mb-4">
              Documents
            </h2>
            <div className="flex flex-wrap gap-2">
              {mailing.letter_id && (
                <a
                  href={`/api/download/${mailing.letter_id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-jc-primary text-white text-sm font-medium rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
                >
                  <IconDownload /> Courrier complet (PDF)
                </a>
              )}
              {mailing.proof_of_deposit_url && (
                <a
                  href={mailing.proof_of_deposit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-jc-line-strong text-jc-ink text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors no-underline"
                >
                  <IconDownload /> Preuve de dépôt
                </a>
              )}
              {mailing.proof_of_receipt_url && (
                <a
                  href={mailing.proof_of_receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-jc-line-strong text-jc-ink text-sm font-medium rounded-jc-sm hover:bg-jc-surface transition-colors no-underline"
                >
                  <IconDownload /> Accusé de réception signé
                </a>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-6 mb-6">
          <h2 className="text-[12px] font-semibold tracking-[0.08em] uppercase text-jc-accent mb-5">
            Historique
          </h2>
          {events.length === 0 ? (
            <p className="text-[14px] text-jc-ink-muted">
              Aucun événement reçu pour le moment. Les premières notifications
              de La Poste arriveront sous peu.
            </p>
          ) : (
            <ol className="relative ml-2 border-l border-jc-line">
              {events.map((ev, idx) => {
                const cfg = EVENT_LABELS[ev.event_type] ?? {
                  label: ev.event_type,
                  variant: "neutral" as const,
                };
                return (
                  <li
                    key={`${ev.event_type}-${ev.occurred_at}-${idx}`}
                    className="ml-5 mb-5 last:mb-0"
                  >
                    <span
                      className={`absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ${EVENT_DOT_CLASSES[cfg.variant]}`}
                      aria-hidden="true"
                    />
                    <p className="text-[14px] font-medium text-jc-ink">
                      {cfg.label}
                    </p>
                    <p className="mt-0.5 text-[12px] text-jc-ink-muted">
                      {formatDateTime(ev.occurred_at)}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Adresses */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-accent mb-2">
              Expéditeur
            </h3>
            <p className="text-[14px] text-jc-ink font-medium">
              {mailing.sender_name}
            </p>
            <p className="text-[14px] text-jc-ink-soft mt-1">
              {mailing.sender_address_line1}
              {mailing.sender_address_line2 && (
                <>
                  <br />
                  {mailing.sender_address_line2}
                </>
              )}
              <br />
              {mailing.sender_zipcode} {mailing.sender_city}
              <br />
              {mailing.sender_country}
            </p>
          </div>
          <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-accent mb-2">
              Destinataire
            </h3>
            <p className="text-[14px] text-jc-ink font-medium">
              {mailing.recipient_name}
            </p>
            <p className="text-[14px] text-jc-ink-soft mt-1">
              {mailing.recipient_address_line1}
              {mailing.recipient_address_line2 && (
                <>
                  <br />
                  {mailing.recipient_address_line2}
                </>
              )}
              <br />
              {mailing.recipient_zipcode} {mailing.recipient_city}
              <br />
              {mailing.recipient_country}
            </p>
          </div>
        </div>

        {/* Détails commande */}
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5 mb-6">
          <h3 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-accent mb-3">
            Détails de la commande
          </h3>
          <dl className="text-[14px] text-jc-ink-soft space-y-1.5">
            <div className="flex justify-between gap-2">
              <dt>Type d&apos;envoi</dt>
              <dd className="text-jc-ink">{modeConfig.label}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Total facturé (envoi)</dt>
              <dd className="text-jc-ink font-medium">
                {formatPrice(mailing.total_cents)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Pièces jointes</dt>
              <dd className="text-jc-ink">
                {attachments.length === 0
                  ? "Aucune"
                  : `${attachments.length} fichier${attachments.length > 1 ? "s" : ""}`}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Date de création</dt>
              <dd className="text-jc-ink">{formatDateTime(mailing.created_at)}</dd>
            </div>
            {mailing.submitted_at && (
              <div className="flex justify-between gap-2">
                <dt>Soumission à La Poste</dt>
                <dd className="text-jc-ink">
                  {formatDateTime(mailing.submitted_at)}
                </dd>
              </div>
            )}
            {mailing.delivered_at && (
              <div className="flex justify-between gap-2">
                <dt>Distribution</dt>
                <dd className="text-jc-ink">
                  {formatDateTime(mailing.delivered_at)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <p className="mt-8 text-[13px] text-jc-ink-muted text-center">
          Une question ? Écrivez-nous à{" "}
          <a
            href="mailto:contact@justecourrier.fr"
            className="text-jc-accent hover:underline"
          >
            contact@justecourrier.fr
          </a>
        </p>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-jc-line px-8 pt-12 pb-7 text-[13px] text-jc-ink-muted">
        <div className="max-w-[1200px] mx-auto">
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>
              © {new Date().getFullYear()} JusteCourrier · SIRET en cours
            </span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
