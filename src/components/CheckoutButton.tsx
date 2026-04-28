"use client";

import { useState } from "react";
import { IconLock } from "@/components/Icons";
import type { MailingMode } from "@/config/mailings";
import type { PostalAddress } from "@/lib/mailings/provider";
import type { AttachmentInfo } from "@/app/preview/[id]/actions";

interface CheckoutButtonProps {
  letterId: string;
  /** Mode d'envoi sélectionné (undefined = PDF only, pas de mailing créé). */
  mailingMode?: MailingMode;
  /**
   * Total à payer en centimes. Si non fourni, l'API retombe sur le prix de la
   * lettre (priceCents) — utile pour le flow PDF only sans MailingChoice.
   */
  totalCents?: number;
  /** Adresse expéditeur (uniquement si mailingMode défini). Branché en commit 3. */
  senderAddress?: PostalAddress;
  /** Adresse destinataire (uniquement si mailingMode défini). Branché en commit 3. */
  recipientAddress?: PostalAddress;
  /** Pièces jointes uploadées (uniquement si mailingMode défini). Branché en commit 3. */
  attachments?: AttachmentInfo[];
  /**
   * Désactivation forcée par le parent (ex: adresse invalide, warning non
   * accepté). S'ajoute à la condition `!accepted` (checkbox responsabilité).
   */
  disabledExternal?: boolean;
}

function formatEuros(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function CheckoutButton({
  letterId,
  mailingMode,
  totalCents,
  senderAddress,
  recipientAddress,
  attachments,
  disabledExternal = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  async function handleCheckout() {
    if (!accepted || disabledExternal) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // mailingMode + adresses + attachments sont envoyés dès maintenant ;
        // l'API checkout les ignore tant que la Phase 4.3 commit 3 n'est pas
        // livrée. Pas d'effet de bord.
        body: JSON.stringify({
          letterId,
          mailingMode,
          senderAddress,
          recipientAddress,
          attachments,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création du paiement. Réessayez.");
        setLoading(false);
      }
    } catch {
      alert("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  // Texte du bouton selon le mode
  const displayCents = totalCents ?? 390;
  const verbe = mailingMode ? "et envoyer" : "et télécharger";
  const buttonLabel = `Payer ${formatEuros(displayCents)} € ${verbe}`;

  const isDisabled = loading || !accepted || disabledExternal;

  return (
    <div>
      {/* Checkbox responsabilité */}
      <label className="flex items-start gap-3 cursor-pointer mb-4 select-none">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-jc-line-strong accent-jc-primary cursor-pointer"
        />
        <span className="text-[13px] leading-[1.5] text-jc-ink-soft">
          Je reconnais que ce courrier est généré par intelligence artificielle
          et ne constitue pas un conseil juridique. J&apos;ai relu le contenu
          et j&apos;en assume l&apos;utilisation.{" "}
          <a
            href="/cgv"
            target="_blank"
            className="text-jc-accent no-underline hover:underline"
          >
            CGV
          </a>
        </span>
      </label>

      {/* Bouton paiement */}
      <button
        onClick={handleCheckout}
        disabled={isDisabled}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Redirection vers le paiement…
          </span>
        ) : (
          <>
            <IconLock /> {buttonLabel}
          </>
        )}
      </button>
    </div>
  );
}
