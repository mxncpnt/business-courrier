"use client";

/**
 * Composant client de gestion de la signature manuscrite (page `/profil`).
 *
 * 3 états :
 *   - Aucune signature : drop zone PNG/JPG (max 1 Mo) avec aperçu pré-upload
 *   - Signature uploadée : preview de la signature actuelle + bouton
 *     "Remplacer" (rebascule en mode upload) + bouton "Supprimer"
 *
 * Validation client-side (UX rapide) : MIME + taille. Le serveur revalide
 * de toute façon (cf. `/profil/actions.ts`).
 *
 * Le canvas pad sera ajouté en B2 (sous-onglet en plus du drop zone).
 */

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadSignatureImage, removeSignature } from "@/app/profil/actions";

interface SignatureUploadProps {
  /** URL signée vers la signature actuelle (null si pas de signature) */
  currentSignatureUrl: string | null;
  /** Date d'upload de la signature actuelle (pour affichage UI) */
  uploadedAt: string | null;
}

const MAX_BYTES = 1_048_576;
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg"];

export default function SignatureUpload({
  currentSignatureUrl,
  uploadedAt,
}: SignatureUploadProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showUploadZone = !currentSignatureUrl || isReplacing;

  function validateFile(file: File): string | null {
    if (!ALLOWED_MIME.includes(file.type)) {
      return `Format non supporté (${file.type || "inconnu"}). Formats acceptés : PNG, JPEG.`;
    }
    if (file.size > MAX_BYTES) {
      const sizeMo = (file.size / 1024 / 1024).toFixed(2);
      return `Fichier trop volumineux (${sizeMo} Mo). Max 1 Mo.`;
    }
    return null;
  }

  function handleUpload(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await uploadSignatureImage(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setIsReplacing(false);
      router.refresh();
    });
  }

  function handleRemove() {
    if (
      !confirm(
        "Supprimer votre signature ? Elle ne sera plus appliquée à vos prochains courriers."
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await removeSignature();
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      {/* Preview signature actuelle */}
      {currentSignatureUrl && !isReplacing && (
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5 mb-4">
          <p className="text-[12px] uppercase tracking-[0.06em] text-jc-ink-muted mb-3">
            Signature actuelle
          </p>
          <div className="bg-white border border-jc-line rounded-jc-sm p-6 flex items-center justify-center min-h-[120px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSignatureUrl}
              alt="Votre signature"
              className="max-h-[100px] max-w-[300px] object-contain"
            />
          </div>
          {uploadedAt && (
            <p className="text-[12px] text-jc-ink-muted mt-3">
              Mise à jour le{" "}
              {new Date(uploadedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setError(null);
                setIsReplacing(true);
              }}
              className="px-4 py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors disabled:opacity-50"
            >
              Remplacer
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleRemove}
              className="px-4 py-2 text-sm text-red-700 border border-red-200 rounded-jc-sm hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isPending ? "…" : "Supprimer"}
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {showUploadZone && (
        <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line p-5">
          <p className="text-[12px] uppercase tracking-[0.06em] text-jc-ink-muted mb-3">
            {isReplacing ? "Nouvelle signature" : "Ajouter une signature"}
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isPending) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (isPending) return;
              const file = e.dataTransfer.files[0];
              if (file) handleUpload(file);
            }}
            onClick={() => !isPending && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-jc-sm p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-jc-primary bg-jc-accent-soft"
                : "border-jc-line-strong hover:border-jc-primary hover:bg-white"
            } ${isPending ? "opacity-50 cursor-wait" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              disabled={isPending}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                // Reset l'input pour permettre de re-uploader le même fichier
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
            <p className="text-[14px] text-jc-ink font-medium mb-1">
              {isPending
                ? "Upload en cours…"
                : "Glisse une image ici, ou clique pour parcourir"}
            </p>
            <p className="text-[12px] text-jc-ink-muted">
              PNG ou JPEG · max 1 Mo · idéalement avec fond transparent ou blanc
            </p>
          </div>

          <p className="text-[12px] text-jc-ink-muted mt-3">
            <strong className="text-jc-ink">Astuce :</strong> signez sur une
            feuille blanche au stylo noir, photographiez la zone signée, puis
            recadrez. Plus la signature est nette, mieux elle s&apos;intégrera
            dans le PDF.
          </p>

          {isReplacing && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsReplacing(false);
              }}
              className="mt-3 text-[13px] text-jc-ink-soft hover:text-jc-ink"
            >
              Annuler le remplacement
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-[13px] text-red-700 bg-red-50 rounded p-2">
          {error}
        </p>
      )}
    </div>
  );
}
