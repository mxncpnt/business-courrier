"use client";

import { useState, useTransition } from "react";
import { validateRecipientAddress } from "@/app/preview/[id]/actions";
import type { PostalAddress } from "@/lib/mailings/provider";

interface AddressEditorProps {
  /** Libellé affiché au-dessus (ex: "Expéditeur" ou "Destinataire") */
  label: string;
  /** Adresse initiale (vient de form_data) */
  initialAddress: PostalAddress;
  /**
   * Callback notifié à chaque changement validé.
   * `valid` indique si l'adresse passe la validation provider.
   */
  onChange: (address: PostalAddress, valid: boolean) => void;
  /**
   * La ligne 2 est optionnelle pour l'expéditeur et obligatoire-affichée
   * (mais facultative en saisie) pour le destinataire. On laisse toujours
   * le champ visible.
   */
  showLine2?: boolean;
}

export default function AddressEditor({
  label,
  initialAddress,
  onChange,
  showLine2 = true,
}: AddressEditorProps) {
  const [address, setAddress] = useState<PostalAddress>(initialAddress);
  const [draft, setDraft] = useState<PostalAddress>(initialAddress);
  const [mode, setMode] = useState<"display" | "edit">("display");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function formatDisplay(addr: PostalAddress): string {
    const lines = [
      addr.name,
      addr.addressLine1,
      addr.addressLine2,
      `${addr.zipcode} ${addr.city}`,
    ].filter((l) => l && l.trim());
    return lines.join(" · ");
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await validateRecipientAddress(draft);
      if (!result.valid) {
        setError(result.reason ?? "Adresse invalide.");
        return;
      }
      // Adresse normalisée si fournie par le provider, sinon le draft tel quel
      const validated = result.normalized ?? draft;
      setAddress(validated);
      setDraft(validated);
      setMode("display");
      onChange(validated, true);
    });
  }

  function handleCancel() {
    setDraft(address);
    setError(null);
    setMode("display");
  }

  function inputClass(): string {
    return "w-full bg-jc-bg-elev border border-jc-line-strong rounded-jc-sm text-jc-ink text-[14px] px-3 py-2 outline-none transition-[border-color,box-shadow] duration-150 focus:border-jc-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--jc-primary)_15%,transparent)] placeholder:text-jc-ink-muted font-body";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-jc-ink-muted">
          {label}
        </span>
        {mode === "display" && (
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="text-[12px] text-jc-accent hover:underline"
          >
            Modifier
          </button>
        )}
      </div>

      {mode === "display" ? (
        <div className="text-[13px] text-jc-ink leading-[1.5]">
          {formatDisplay(address) || (
            <span className="text-jc-ink-muted italic">
              Adresse non renseignée
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          <input
            type="text"
            placeholder="Nom du destinataire"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className={inputClass()}
          />
          <input
            type="text"
            placeholder="Adresse (n° et rue)"
            value={draft.addressLine1}
            onChange={(e) =>
              setDraft({ ...draft, addressLine1: e.target.value })
            }
            className={inputClass()}
          />
          {showLine2 && (
            <input
              type="text"
              placeholder="Complément d'adresse (facultatif)"
              value={draft.addressLine2 ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, addressLine2: e.target.value })
              }
              className={inputClass()}
            />
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="CP"
              value={draft.zipcode}
              onChange={(e) => setDraft({ ...draft, zipcode: e.target.value })}
              className={`${inputClass()} w-[120px]`}
              inputMode="numeric"
              maxLength={5}
            />
            <input
              type="text"
              placeholder="Ville"
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              className={inputClass()}
            />
          </div>

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-jc-sm text-[12px] text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="px-4 py-1.5 bg-jc-primary text-white text-[13px] font-medium rounded-jc-sm hover:bg-jc-primary-hover transition-colors disabled:opacity-50"
            >
              {isPending ? "Vérification…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="px-4 py-1.5 border border-jc-line-strong text-jc-ink text-[13px] font-medium rounded-jc-sm hover:bg-jc-surface transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
