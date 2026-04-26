"use client";

import { useState, useRef, useActionState } from "react";
import { recipientFields, senderFields, type LetterType, type FormField } from "@/config/letter-types";
import { submitLetterForm } from "@/app/courrier/[type]/actions";
import { IconArrow, IconCheck, IconLock } from "@/components/Icons";

// ─── Step definitions ───
const STEPS = [
  { id: "context", title: "Votre situation", description: "Quelques détails sur votre dossier." },
  { id: "identity", title: "Vos coordonnées", description: "Pour personnaliser l'en-tête de la lettre." },
  { id: "review", title: "Récapitulatif", description: "Vérifiez vos informations avant de générer le courrier." },
] as const;

interface LetterFormProps {
  letterType: LetterType;
}

export default function LetterForm({ letterType }: LetterFormProps) {
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      const result = await submitLetterForm(letterType.slug, formData);
      return result ?? null;
    },
    null
  );

  // Context fields = letter-specific fields + recipient fields
  const contextFields: FormField[] = [...letterType.fields, ...recipientFields];

  // Validate current step fields before advancing
  function validateStep(): boolean {
    if (!formRef.current) return false;
    const fields = step === 0 ? contextFields : step === 1 ? senderFields : [];
    for (const field of fields) {
      if (!field.required) continue;
      const input = formRef.current.elements.namedItem(field.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!input) continue;
      if (!input.value.trim()) {
        input.focus();
        // Trigger native validation UI
        input.reportValidity();
        return false;
      }
      if (field.type === "email" && input instanceof HTMLInputElement && !input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 2));
    }
  }

  function goPrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Build summary data from form for step 3
  function getSummary(): { label: string; value: string }[] {
    if (!formRef.current) return [];
    const items: { label: string; value: string }[] = [];
    const allFields = [...contextFields, ...senderFields];
    for (const field of allFields) {
      const el = formRef.current.elements.namedItem(field.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el && el.value.trim()) {
        items.push({ label: field.label, value: el.value });
      }
    }
    return items;
  }

  return (
    <form ref={formRef} action={formAction}>
      {/* ─── Step indicator ─── */}
      <div className="flex items-center gap-3 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.id} className="contents">
            <div className="flex items-center gap-2">
              {/* Step number / check */}
              <span
                className={`
                  w-[26px] h-[26px] rounded-full inline-flex items-center justify-center text-xs font-semibold border
                  ${i === step
                    ? "bg-jc-primary text-white border-jc-primary"
                    : i < step
                    ? "bg-jc-accent-soft text-jc-accent border-jc-accent-soft"
                    : "bg-jc-surface text-jc-ink-muted border-jc-line-strong"
                  }
                `}
              >
                {i < step ? <IconCheck /> : i + 1}
              </span>
              {/* Label — hidden on mobile */}
              <span
                className={`hidden sm:inline text-[13px] ${
                  i === step ? "text-jc-ink font-medium" : "text-jc-ink-muted"
                }`}
              >
                {s.title}
              </span>
            </div>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-jc-line-strong" />
            )}
          </div>
        ))}
      </div>

      {/* ─── Step header ─── */}
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
          Étape {step + 1} sur 3
        </span>
        <h2 className="mt-2.5 text-[28px] sm:text-[38px] font-display font-bold text-jc-ink leading-tight">
          {STEPS[step].title}
        </h2>
        <p className="mt-2 text-[15px] text-jc-ink-soft">
          {STEPS[step].description}
        </p>
      </div>

      {/* ─── Card ─── */}
      <div className="bg-jc-bg-elev border border-jc-line rounded-jc-lg p-5 sm:p-8">
        {state?.error && step === 2 && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-jc-sm text-red-700 text-sm">
            {state.error}
          </div>
        )}

        {/* Step 0 — Context */}
        <div className={step === 0 ? "block" : "hidden"}>
          <div className="space-y-6">
            {letterType.fields.map((field) => (
              <FieldRenderer key={field.name} field={field} />
            ))}
            {/* Separator */}
            <div className="border-t border-jc-line pt-6">
              <p className="text-[13px] text-jc-ink-muted mb-4">
                À qui le courrier doit-il être adressé ?
              </p>
              {recipientFields.map((field) => (
                <div key={field.name} className="mt-4">
                  <FieldRenderer field={field} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1 — Identity */}
        <div className={step === 1 ? "block" : "hidden"}>
          <div className="space-y-6">
            {/* Prénom + Nom on same row */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <FieldRenderer field={senderFields[0]} />
              </div>
              <div className="flex-1 min-w-[180px]">
                <FieldRenderer field={senderFields[1]} />
              </div>
            </div>
            {/* Adresse */}
            <FieldRenderer field={senderFields[2]} />
            {/* CP + Ville on same row */}
            <div className="flex gap-4 flex-wrap">
              <div className="w-[120px] shrink-0">
                <FieldRenderer field={senderFields[3]} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <FieldRenderer field={senderFields[4]} />
              </div>
            </div>
            {/* Email */}
            <div>
              <FieldRenderer field={senderFields[5]} />
              <p className="text-xs text-jc-ink-muted mt-1">
                Le PDF sera téléchargeable immédiatement et envoyé à cette adresse.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 — Review */}
        <div className={step === 2 ? "block" : "hidden"}>
          <ReviewStep getSummary={getSummary} />
        </div>

        {/* ─── Navigation buttons ─── */}
        <div className="flex justify-between mt-7 gap-3 flex-wrap">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-jc-line-strong text-jc-ink font-medium rounded-jc hover:bg-jc-surface transition-colors text-sm"
          >
            Précédent
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-sm"
            >
              Continuer <IconArrow />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
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
                  Génération en cours…
                </span>
              ) : (
                <>
                  <IconLock /> Payer 4,90 € et télécharger
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

// ─── Review step component ───
function ReviewStep({ getSummary }: { getSummary: () => { label: string; value: string }[] }) {
  const [summary, setSummary] = useState<{ label: string; value: string }[]>([]);

  // Build summary on mount
  useState(() => {
    setSummary(getSummary());
  });

  // Also refresh when rendered
  if (summary.length === 0) {
    const fresh = getSummary();
    if (fresh.length > 0) setSummary(fresh);
  }

  return (
    <div>
      <div className="flex gap-3 items-center mb-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-jc-accent-soft text-jc-accent">
          <IconCheck /> Récapitulatif prêt
        </span>
        <span className="text-[13px] text-jc-ink-muted">
          Vérifie tes informations avant de lancer la génération.
        </span>
      </div>

      <div className="divide-y divide-jc-line">
        {summary.map((item, i) => (
          <div key={i} className="py-2.5 flex justify-between gap-4">
            <span className="text-[13px] text-jc-ink-muted shrink-0">{item.label}</span>
            <span className="text-[13px] text-jc-ink text-right">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Price summary */}
      <div className="mt-5 p-4 bg-jc-surface rounded-jc flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="text-[13px] text-jc-ink-muted">Total à payer</div>
          <div className="text-[28px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
            4,90 € <span className="text-[13px] text-jc-ink-muted font-normal">TTC</span>
          </div>
        </div>
        <div className="text-xs text-jc-ink-muted max-w-[280px]">
          Paiement sécurisé Stripe. Aucune donnée bancaire n&apos;est stockée par JusteCourrier.
        </div>
      </div>
    </div>
  );
}

// ─── Field renderer ───
function FieldRenderer({ field }: { field: FormField }) {
  const inputClasses =
    "w-full bg-jc-bg-elev border border-jc-line-strong rounded-jc-sm text-jc-ink text-[15px] px-3.5 py-[11px] outline-none transition-[border-color,box-shadow] duration-150 focus:border-jc-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--jc-primary)_15%,transparent)] placeholder:text-jc-ink-muted font-body";

  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-[13px] font-medium text-jc-ink mb-1.5"
      >
        {field.label}
        {!field.required && (
          <span className="text-jc-ink-muted font-normal ml-1">(facultatif)</span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          rows={3}
          className={`${inputClasses} min-h-[100px] resize-y leading-relaxed`}
        />
      ) : field.type === "select" && field.options ? (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          className={inputClasses}
          defaultValue=""
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          className={inputClasses}
        />
      )}
    </div>
  );
}
