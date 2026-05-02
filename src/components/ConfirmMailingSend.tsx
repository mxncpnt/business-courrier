"use client";

/**
 * Bouton de confirmation manuelle de l'envoi à La Poste.
 *
 * Affiché sur `/preview/[id]` quand le mailing associé est en statut `paid`
 * (paiement validé mais pas encore soumis à MSB). Permet à l'utilisateur de
 * relire et éditer son texte (via `EditableLetterText`) puis de déclencher
 * lui-même l'envoi via `confirmMailingSend`.
 *
 * Si l'utilisateur ne confirme pas, le cron `/api/cron/process-pending-mailings`
 * déclenche l'envoi automatiquement à T+24h après paiement (avec un email
 * de rappel à T+12h).
 *
 * Le bouton bascule en état "Envoi en cours…" pendant la transition. Une fois
 * la server action terminée, `router.refresh()` recharge la page : le mailing
 * passe en `submitted`/`in_transit`, le composant disparaît, le bandeau de
 * suivi prend le relais.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmMailingSend } from "@/app/preview/[id]/actions";

interface ConfirmMailingSendProps {
  mailingId: string;
  /** Mode envoi pour le wording ("simple" = lettre verte, "registered" = LRAR) */
  mailingMode: "simple" | "registered";
}

export default function ConfirmMailingSend({
  mailingId,
  mailingMode,
}: ConfirmMailingSendProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const modeLabel =
    mailingMode === "registered" ? "recommandé avec AR" : "lettre verte";

  return (
    <div className="mt-6 bg-jc-accent-soft border border-jc-accent rounded-jc-lg p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-[20px] leading-none mt-0.5">📮</span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-jc-ink">
            Prêt à partir à La Poste
          </p>
          <p className="mt-1 text-[14px] text-jc-ink-soft leading-[1.5]">
            Votre paiement est confirmé. Avant l&apos;envoi en {modeLabel}, vous
            pouvez relire et modifier le texte ci-dessus. Quand vous êtes prêt,
            cliquez ci-dessous pour déclencher l&apos;envoi.
          </p>
          <p className="mt-2 text-[12px] text-jc-ink-muted">
            Sans confirmation, l&apos;envoi sera déclenché automatiquement dans
            les 24 heures.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-3 text-[13px] text-red-700 bg-red-50 rounded p-2">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await confirmMailingSend(mailingId);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.refresh();
          });
        }}
        className="w-full px-6 py-3 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? "Envoi en cours…"
          : "Confirmer et envoyer à La Poste"}
      </button>
    </div>
  );
}
