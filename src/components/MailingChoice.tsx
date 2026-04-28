"use client";

import { useState } from "react";
import {
  MAILING_MODES,
  getRecommendedMode,
  type MailingMode,
} from "@/config/mailings";
import CheckoutButton from "@/components/CheckoutButton";
import { IconCheck } from "@/components/Icons";

/**
 * Mode étendu pour l'UI : "pdf" = pas d'envoi physique, l'utilisateur poste lui-même.
 * Côté API checkout, "pdf" → mailingMode undefined (pas de mailing créé).
 */
type ChoiceMode = "pdf" | MailingMode;

interface MailingChoiceProps {
  letterId: string;
  letterTypeSlug: string;
  /** Prix de génération du courrier seul (en cents). Vient de letterType.priceCents. */
  letterPriceCents: number;
}

function formatEuros(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function MailingChoice({
  letterId,
  letterTypeSlug,
  letterPriceCents,
}: MailingChoiceProps) {
  const recommendedMode = getRecommendedMode(letterTypeSlug);
  const [choice, setChoice] = useState<ChoiceMode>("pdf");

  // Calcul des prix par mode (lettre seule + envoi)
  const simpleConfig = MAILING_MODES.simple;
  const registeredConfig = MAILING_MODES.registered;
  const simpleEnvoiCents =
    simpleConfig.costCentsEstimate + simpleConfig.markupCentsEstimate;
  const registeredEnvoiCents =
    registeredConfig.costCentsEstimate + registeredConfig.markupCentsEstimate;

  const simpleTotalCents = letterPriceCents + simpleEnvoiCents;
  const registeredTotalCents = letterPriceCents + registeredEnvoiCents;

  // Total selon le choix actif
  let totalCents = letterPriceCents;
  let envoiCents = 0;
  if (choice === "simple") {
    totalCents = simpleTotalCents;
    envoiCents = simpleEnvoiCents;
  } else if (choice === "registered") {
    totalCents = registeredTotalCents;
    envoiCents = registeredEnvoiCents;
  }

  return (
    <div>
      {/* ─── Heading ─── */}
      <div className="mb-4">
        <h2 className="text-[18px] font-display font-semibold text-jc-ink mb-1">
          Comment envoyer ce courrier&nbsp;?
        </h2>
        <p className="text-[13px] text-jc-ink-soft">
          Tu télécharges juste le PDF, ou on s&apos;occupe de l&apos;envoi
          pour toi. Affranchissement au prix coûtant.
        </p>
      </div>

      {/* ─── 3 cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <ChoiceCard
          label="PDF seulement"
          eyebrow="Tu poste toi-même"
          priceCents={letterPriceCents}
          isSelected={choice === "pdf"}
          isRecommended={false}
          onSelect={() => setChoice("pdf")}
        />
        <ChoiceCard
          label="Lettre simple"
          eyebrow="Envoi J+3"
          priceCents={simpleTotalCents}
          isSelected={choice === "simple"}
          isRecommended={recommendedMode === "simple"}
          onSelect={() => setChoice("simple")}
        />
        <ChoiceCard
          label="Recommandé AR"
          eyebrow="Valeur juridique"
          priceCents={registeredTotalCents}
          isSelected={choice === "registered"}
          isRecommended={recommendedMode === "registered"}
          onSelect={() => setChoice("registered")}
        />
      </div>

      {/* ─── Récap prix ─── */}
      <div className="bg-jc-surface rounded-jc p-4 mb-5">
        <div className="flex justify-between items-baseline flex-wrap gap-3">
          <div>
            <div className="text-[13px] text-jc-ink-muted">Total à payer</div>
            <div className="text-[28px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
              {formatEuros(totalCents)}&nbsp;€{" "}
              <span className="text-[13px] text-jc-ink-muted font-normal">
                TTC
              </span>
            </div>
            {envoiCents > 0 && (
              <div className="text-[12px] text-jc-ink-muted mt-1">
                Courrier {formatEuros(letterPriceCents)}&nbsp;€ +
                Affranchissement {formatEuros(envoiCents)}&nbsp;€
              </div>
            )}
          </div>
          <div className="text-xs text-jc-ink-muted max-w-[280px] sm:text-right">
            {choice === "pdf"
              ? "Paiement sécurisé Stripe. Aucune donnée bancaire stockée."
              : "Affranchissement refacturé au prix coûtant. Pas de marge dissimulée."}
          </div>
        </div>
      </div>

      {/* ─── Checkout button ─── */}
      <CheckoutButton
        letterId={letterId}
        mailingMode={choice === "pdf" ? undefined : choice}
        totalCents={totalCents}
      />

      <p className="mt-3 text-xs text-jc-ink-muted text-center">
        Satisfait ou remboursé.
      </p>
    </div>
  );
}

// ─── Card sélectionnable ─────────────────────────────────────────────────────

interface ChoiceCardProps {
  label: string;
  eyebrow: string;
  priceCents: number;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}

function ChoiceCard({
  label,
  eyebrow,
  priceCents,
  isSelected,
  isRecommended,
  onSelect,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`
        relative text-left p-4 rounded-jc transition-all
        ${
          isSelected
            ? "border-2 border-jc-primary bg-jc-bg-elev shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
            : "border border-jc-line bg-jc-bg-elev hover:border-jc-line-strong"
        }
      `}
      style={
        // Compensation visuelle de la border 2px en mode sélectionné
        // pour éviter le shift
        !isSelected ? { padding: "calc(1rem + 1px)" } : undefined
      }
    >
      {isRecommended && (
        <span className="absolute -top-2 left-3 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-jc-accent-soft text-jc-accent">
          Recommandé
        </span>
      )}
      {isSelected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-jc-primary text-white flex items-center justify-center">
          <IconCheck />
        </span>
      )}
      <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-jc-ink-muted mb-1">
        {eyebrow}
      </div>
      <div className="text-[15px] font-semibold text-jc-ink mb-2">{label}</div>
      <div className="text-[20px] font-display font-semibold text-jc-ink tabular-nums">
        {formatEuros(priceCents)}&nbsp;€
      </div>
    </button>
  );
}
