"use client";

/**
 * Panneau d'édition du texte du courrier.
 *
 * Affiché sous le `LetterPreview` AFNOR sur `/preview/[id]`. Permet à
 * l'utilisateur de modifier le corps du courrier généré par l'IA et
 * d'enregistrer dans `letters.final_text` via la server action
 * `updateLetterText`.
 *
 * États affichés :
 *   - Verrouillé (`isLocked = true`) : message "Le courrier est parti, plus
 *     modifiable." (ne montre pas le bouton).
 *   - Non éditable et non édité : bouton "Modifier le texte".
 *   - Édité (texte ≠ generated_text) : badge "Texte modifié" + bouton
 *     "Modifier" + bouton "Réinitialiser au texte généré".
 *   - En édition : textarea + compteur + 3 actions (Enregistrer / Annuler /
 *     Réinitialiser au texte généré).
 *
 * La validation hard à `AFNOR_MAX_CHARS` est dupliquée côté client (UX) et
 * côté serveur (sécurité). Le compteur change de couleur selon `LengthState`.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AFNOR_MAX_CHARS,
  AFNOR_TARGET_CHARS,
  AFNOR_WARN_CHARS,
  getLengthState,
  type LengthState,
} from "@/lib/letters/text";
import { updateLetterText, resetLetterText } from "@/app/preview/[id]/actions";

interface EditableLetterTextProps {
  letterId: string;
  /** Texte actuellement affiché (final_text si édité, sinon generated_text) */
  currentText: string;
  /** Texte généré par l'IA, utilisé pour le bouton "Réinitialiser" */
  generatedText: string;
  /** True si le courrier est déjà en envoi → édition bloquée */
  isLocked: boolean;
}

const STATE_STYLES: Record<
  LengthState,
  { color: string; bg: string; label: string }
> = {
  ok: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    label: "Rentre confortablement sur 1 page",
  },
  warning: {
    color: "text-jc-accent",
    bg: "bg-jc-accent-soft",
    label: "Approche la limite — surveille la mise en page",
  },
  danger: {
    color: "text-orange-700",
    bg: "bg-orange-50",
    label: "Peut déborder — réduis si possible",
  },
  blocked: {
    color: "text-red-700",
    bg: "bg-red-50",
    label: "Trop long pour 1 page AFNOR — raccourcis",
  },
};

export default function EditableLetterText({
  letterId,
  currentText,
  generatedText,
  isLocked,
}: EditableLetterTextProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(currentText);
  const [error, setError] = useState<string | null>(null);

  const isEdited = currentText !== generatedText;
  const charCount = draft.length;
  const lengthState = getLengthState(charCount);
  const stateStyle = STATE_STYLES[lengthState];
  const overLimit = lengthState === "blocked";

  // ─── Verrouillé ─────────────────────────────────────────────────────────
  if (isLocked) {
    return (
      <div className="mt-6 bg-jc-surface rounded-jc-lg border border-jc-line p-5 text-center">
        <p className="text-[14px] text-jc-ink-soft">
          Ce courrier a été remis à La Poste — il n&apos;est plus modifiable.
        </p>
      </div>
    );
  }

  // ─── Vue non-éditante ───────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div className="mt-6 bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-[14px] text-jc-ink font-medium">
              Texte du courrier
            </p>
            {isEdited ? (
              <p className="text-[12px] text-jc-accent mt-0.5">
                ✓ Texte modifié manuellement
              </p>
            ) : (
              <p className="text-[12px] text-jc-ink-muted mt-0.5">
                Généré par l&apos;IA — éditable avant l&apos;envoi à La Poste
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEdited && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setError(null);
                  startTransition(async () => {
                    const res = await resetLetterText(letterId);
                    if (!res.ok) {
                      setError(res.error);
                      return;
                    }
                    setDraft(generatedText);
                    router.refresh();
                  });
                }}
                className="px-4 py-2 text-sm text-jc-ink-soft border border-jc-line-strong rounded-jc-sm hover:bg-jc-surface transition-colors disabled:opacity-50"
              >
                Réinitialiser
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setDraft(currentText);
                setIsEditing(true);
              }}
              className="px-4 py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors"
            >
              Modifier le texte
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-3 text-[13px] text-red-700 bg-red-50 rounded p-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  // ─── Vue édition ────────────────────────────────────────────────────────
  return (
    <div className="mt-6 bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5">
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-[14px] text-jc-ink font-medium">
          Modifier le texte du courrier
        </p>
        <span
          className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${stateStyle.bg} ${stateStyle.color}`}
          title={stateStyle.label}
        >
          {charCount} / {AFNOR_MAX_CHARS}
        </span>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={18}
        disabled={isPending}
        className="w-full text-[14px] text-jc-ink leading-[1.55] p-4 rounded-jc-sm border border-jc-line-strong bg-white font-body resize-y focus:outline-none focus:border-jc-primary disabled:opacity-50"
        placeholder="Le contenu de votre courrier…"
      />

      <p className={`mt-2 text-[12px] ${stateStyle.color}`}>
        {stateStyle.label}
        {lengthState === "ok" && charCount > AFNOR_TARGET_CHARS / 2 && (
          <> · cible confortable {AFNOR_TARGET_CHARS} caractères</>
        )}
        {lengthState !== "ok" && lengthState !== "blocked" && (
          <> · limite hard {AFNOR_MAX_CHARS} caractères ({AFNOR_WARN_CHARS}+ commence à risquer le débordement)</>
        )}
      </p>

      {error && (
        <p className="mt-3 text-[13px] text-red-700 bg-red-50 rounded p-2">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const res = await resetLetterText(letterId);
              if (!res.ok) {
                setError(res.error);
                return;
              }
              setDraft(generatedText);
              setIsEditing(false);
              router.refresh();
            });
          }}
          className="px-4 py-2 text-sm text-jc-ink-soft border border-jc-line-strong rounded-jc-sm hover:bg-jc-surface transition-colors disabled:opacity-50"
        >
          Réinitialiser au texte généré
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setError(null);
              setDraft(currentText);
              setIsEditing(false);
            }}
            className="px-4 py-2 text-sm text-jc-ink border border-jc-line-strong rounded-jc-sm hover:bg-jc-surface transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isPending || overLimit || draft === currentText}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const res = await updateLetterText(letterId, draft);
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                setIsEditing(false);
                router.refresh();
              });
            }}
            className="px-4 py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
