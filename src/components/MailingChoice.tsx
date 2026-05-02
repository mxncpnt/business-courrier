"use client";

import { useEffect, useState } from "react";
import {
  MAILING_MODES,
  getRecommendedMode,
  type MailingMode,
} from "@/config/mailings";
import CheckoutButton from "@/components/CheckoutButton";
import AddressEditor from "@/components/AddressEditor";
import AttachmentUploader from "@/components/AttachmentUploader";
import { IconCheck } from "@/components/Icons";
import type { PostalAddress } from "@/lib/mailings/provider";
import { listAttachments, type AttachmentInfo } from "@/app/preview/[id]/actions";

/**
 * Mode étendu pour l'UI : "pdf" = pas d'envoi physique, l'utilisateur poste
 * lui-même. Côté API checkout, "pdf" → mailingMode undefined (pas de mailing
 * créé).
 */
type ChoiceMode = "pdf" | MailingMode;

interface MailingChoiceProps {
  letterId: string;
  letterTypeSlug: string;
  /** Prix de génération du courrier seul (en cents). Vient de letterType.priceCents. */
  letterPriceCents: number;
  /** Form data sauvegardé en DB (sender_*, recipient_*) — sert d'init aux adresses */
  formData: Record<string, string>;
}

function formatEuros(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function buildSenderAddress(formData: Record<string, string>): PostalAddress {
  const firstname = formData.sender_firstname || "";
  const lastname = formData.sender_lastname || "";
  return {
    name: `${firstname} ${lastname}`.trim(),
    addressLine1: formData.sender_street || "",
    zipcode: formData.sender_zipcode || "",
    city: formData.sender_city || "",
    country: "FR",
  };
}

function buildRecipientAddress(
  formData: Record<string, string>
): PostalAddress {
  return {
    name: formData.recipient_name || "",
    addressLine1: formData.recipient_address_line1 || "",
    addressLine2: formData.recipient_address_line2 || undefined,
    zipcode: formData.recipient_zipcode || "",
    city: formData.recipient_city || "",
    country: "FR",
  };
}

export default function MailingChoice({
  letterId,
  letterTypeSlug,
  letterPriceCents,
  formData,
}: MailingChoiceProps) {
  const recommendedMode = getRecommendedMode(letterTypeSlug);
  const [choice, setChoice] = useState<ChoiceMode>("pdf");

  // Adresses (initialisées depuis form_data, présupposées valides)
  const [senderAddress, setSenderAddress] = useState<PostalAddress>(() =>
    buildSenderAddress(formData)
  );
  const [senderValid, setSenderValid] = useState(true);
  const [recipientAddress, setRecipientAddress] = useState<PostalAddress>(() =>
    buildRecipientAddress(formData)
  );
  const [recipientValid, setRecipientValid] = useState(true);

  // Pièces jointes (uploadées au fur et à mesure dans Storage). Bootstrap
  // au mount via `listAttachments` pour récupérer les PJ déjà uploadées
  // (cas refresh page) avec leur `pagesCount` exact.
  const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
  useEffect(() => {
    let cancelled = false;
    listAttachments(letterId).then((list) => {
      if (!cancelled && list.length > 0) setAttachments(list);
    });
    return () => {
      cancelled = true;
    };
  }, [letterId]);

  // Warn-no-block : checkbox d'acceptation du downgrade pour types critiques
  const [warnAccepted, setWarnAccepted] = useState(false);

  // Calcul des prix par mode
  const simpleConfig = MAILING_MODES.simple;
  const registeredConfig = MAILING_MODES.registered;
  const simpleEnvoiCents =
    simpleConfig.costCentsEstimate + simpleConfig.markupCentsEstimate;
  const registeredEnvoiCents =
    registeredConfig.costCentsEstimate + registeredConfig.markupCentsEstimate;
  const simpleTotalCents = letterPriceCents + simpleEnvoiCents;
  const registeredTotalCents = letterPriceCents + registeredEnvoiCents;

  let totalCents = letterPriceCents;
  if (choice === "simple") totalCents = simpleTotalCents;
  else if (choice === "registered") totalCents = registeredTotalCents;

  // Mode envoi physique (≠ PDF) : on demande adresses + PJ
  const isPhysical = choice !== "pdf";

  // Warn-no-block : recommendedMode est registered, choice est inférieur
  const showWarning =
    recommendedMode === "registered" && choice !== "registered";
  const warningMessage = (() => {
    if (choice === "pdf") {
      return "Ce type de courrier nécessite généralement un recommandé avec accusé de réception pour avoir valeur juridique opposable. Sans envoi par JusteCourrier, tu devras t'occuper toi-même de l'expédition en LRAR à La Poste.";
    }
    if (choice === "simple") {
      return "Ce type de courrier nécessite généralement un recommandé avec accusé de réception pour avoir valeur juridique opposable. La lettre simple ne fournit ni preuve de dépôt ni AR signé.";
    }
    return "";
  })();

  // Disabled checkout selon les conditions
  const checkoutDisabled =
    (isPhysical && (!senderValid || !recipientValid)) ||
    (showWarning && !warnAccepted);

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

      {/* ─── Bloc adresses + PJ (uniquement si envoi physique) ─── */}
      {isPhysical && (
        <div className="mb-5 space-y-4 p-4 sm:p-5 border border-jc-line rounded-jc bg-jc-surface">
          <div>
            <h3 className="text-[14px] font-semibold text-jc-ink mb-2">
              Vérifie les adresses
            </h3>
            <div className="space-y-3.5">
              <AddressEditor
                label="Expéditeur"
                initialAddress={senderAddress}
                showLine2={false}
                onChange={(addr, valid) => {
                  setSenderAddress(addr);
                  setSenderValid(valid);
                }}
              />
              <AddressEditor
                label="Destinataire"
                initialAddress={recipientAddress}
                showLine2={true}
                onChange={(addr, valid) => {
                  setRecipientAddress(addr);
                  setRecipientValid(valid);
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-jc-ink mb-1">
              Pièces jointes <span className="text-jc-ink-muted font-normal">(facultatif)</span>
            </h3>
            <p className="text-[12px] text-jc-ink-soft mb-2.5">
              Bail, facture, état des lieux, photo… ajoute jusqu&apos;à 5
              fichiers (10 Mo total).
            </p>
            <AttachmentUploader
              letterId={letterId}
              attachments={attachments}
              onChange={setAttachments}
            />
          </div>
        </div>
      )}

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
          </div>
          <div className="text-xs text-jc-ink-muted max-w-[280px] sm:text-right">
            {choice === "pdf"
              ? "Paiement sécurisé Stripe. Aucune donnée bancaire stockée."
              : "Affranchissement refacturé au prix coûtant. Pas de marge dissimulée."}
          </div>
        </div>
      </div>

      {/* ─── Warn-no-block (option c) ─── */}
      {showWarning && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-300 rounded-jc">
          <div className="text-[13px] text-amber-900 leading-[1.5] mb-3">
            <strong className="font-semibold">Attention juridique. </strong>
            {warningMessage}
          </div>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={warnAccepted}
              onChange={(e) => setWarnAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-amber-400 accent-amber-600 cursor-pointer"
            />
            <span className="text-[13px] leading-[1.4] text-amber-900">
              Je comprends et je choisis ce mode quand même, sous ma
              responsabilité.
            </span>
          </label>
        </div>
      )}

      {/* ─── Checkout button ─── */}
      <CheckoutButton
        letterId={letterId}
        mailingMode={choice === "pdf" ? undefined : choice}
        totalCents={totalCents}
        senderAddress={isPhysical ? senderAddress : undefined}
        recipientAddress={isPhysical ? recipientAddress : undefined}
        attachments={isPhysical ? attachments : undefined}
        disabledExternal={checkoutDisabled}
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
