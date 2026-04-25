"use client";

import { useActionState } from "react";
import { commonFields, type LetterType } from "@/config/letter-types";
import { submitLetterForm } from "@/app/courrier/[type]/actions";

interface LetterFormProps {
  letterType: LetterType;
}

export default function LetterForm({ letterType }: LetterFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      const result = await submitLetterForm(letterType.slug, formData);
      return result ?? null;
    },
    null
  );

  const allFields = [...commonFields, ...letterType.fields];

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-jc-sm text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {/* Common fields */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-jc-ink mb-2">
          Vos informations
        </legend>
        {commonFields.map((field) => (
          <FormField key={field.name} field={field} />
        ))}
      </fieldset>

      {/* Specific fields */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-jc-ink mb-2">
          Détails du courrier
        </legend>
        {letterType.fields.map((field) => (
          <FormField key={field.name} field={field} />
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-6 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
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
          "Générer mon courrier"
        )}
      </button>
    </form>
  );
}

function FormField({
  field,
}: {
  field: (typeof commonFields)[number];
}) {
  const baseClasses =
    "w-full px-4 py-2.5 border border-jc-line-strong rounded-jc-sm text-jc-ink placeholder-jc-ink-muted focus:ring-2 focus:ring-jc-primary focus:border-jc-primary outline-none transition-colors";

  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-jc-ink-soft mb-1"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          rows={3}
          className={baseClasses}
        />
      ) : field.type === "select" && field.options ? (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          className={baseClasses}
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
          className={baseClasses}
        />
      )}
    </div>
  );
}
