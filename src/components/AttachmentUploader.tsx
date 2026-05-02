"use client";

import { useRef, useState, useTransition } from "react";
import {
  uploadAttachment,
  removeAttachment,
  type AttachmentInfo,
} from "@/app/preview/[id]/actions";
import { MAX_MERGED_PAGES, ESTIMATED_LETTER_PAGES } from "@/config/mailings";

const MAX_ATTACHMENTS = 5;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPT_ATTR = ALLOWED_MIME_TYPES.join(",");
/** Quota pages PJ disponible = total max - estimation courrier (1) */
const MAX_ATTACHMENT_PAGES = MAX_MERGED_PAGES - ESTIMATED_LETTER_PAGES;

interface AttachmentUploaderProps {
  letterId: string;
  /** Liste actuelle des pièces jointes (state lifted up dans le parent) */
  attachments: AttachmentInfo[];
  /** Callback quand la liste change (upload réussi ou suppression) */
  onChange: (attachments: AttachmentInfo[]) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function fileIcon(mimeType: string): string {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("image/")) return "IMG";
  return "FIL";
}

export default function AttachmentUploader({
  letterId,
  attachments,
  onChange,
}: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  const totalBytes = attachments.reduce((sum, a) => sum + a.sizeBytes, 0);
  const totalPages = attachments.reduce((sum, a) => sum + (a.pagesCount ?? 1), 0);
  const remainingBytes = MAX_TOTAL_BYTES - totalBytes;
  const remainingSlots = MAX_ATTACHMENTS - attachments.length;
  const remainingPages = MAX_ATTACHMENT_PAGES - totalPages;
  const canAddMore =
    remainingSlots > 0 && remainingBytes > 0 && remainingPages > 0;

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const file = files[0]; // Upload un par un (UX plus claire)

    // Validation côté client (re-validée serveur)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Format non supporté. Accepté : PDF, JPEG, PNG.`);
      return;
    }
    if (file.size > remainingBytes) {
      setError(
        `Fichier trop volumineux (${formatBytes(file.size)}). Reste ${formatBytes(remainingBytes)} disponibles.`
      );
      return;
    }
    if (attachments.length >= MAX_ATTACHMENTS) {
      setError(`Maximum ${MAX_ATTACHMENTS} pièces jointes par courrier.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadAttachment(letterId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onChange([...attachments, result.attachment]);
    });
  }

  function handleRemove(att: AttachmentInfo) {
    setError(null);
    startTransition(async () => {
      const result = await removeAttachment(letterId, att.storagePath);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onChange(attachments.filter((a) => a.storagePath !== att.storagePath));
    });
  }

  return (
    <div>
      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-jc p-5 text-center cursor-pointer transition-colors
            ${dragOver ? "border-jc-primary bg-jc-accent-soft" : "border-jc-line-strong bg-jc-bg-elev hover:border-jc-primary"}
            ${isPending ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="text-[14px] font-medium text-jc-ink mb-1">
            {isPending
              ? "Upload en cours…"
              : "Cliquer ou glisser un fichier ici"}
          </div>
          <div className="text-[12px] text-jc-ink-muted">
            PDF, JPEG ou PNG · max {formatBytes(remainingBytes)} restants ·{" "}
            <strong>{remainingPages}</strong> page{remainingPages > 1 ? "s" : ""}{" "}
            disponible{remainingPages > 1 ? "s" : ""} ({totalPages}/
            {MAX_ATTACHMENT_PAGES} utilisée{totalPages > 1 ? "s" : ""})
          </div>
        </div>
      )}

      {!canAddMore && attachments.length > 0 && (
        <div className="text-[12px] text-jc-ink-muted italic mb-2">
          Limite atteinte ({attachments.length}/{MAX_ATTACHMENTS} fichiers,{" "}
          {formatBytes(totalBytes)}/{formatBytes(MAX_TOTAL_BYTES)},{" "}
          {totalPages}/{MAX_ATTACHMENT_PAGES} pages). Supprime une PJ pour en
          ajouter une autre.
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-jc-sm text-[12px] text-red-700">
          {error}
        </div>
      )}

      {/* Liste fichiers */}
      {attachments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {attachments.map((att) => (
            <li
              key={att.storagePath}
              className="flex items-center gap-3 p-2.5 bg-jc-bg-elev border border-jc-line rounded-jc-sm"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-jc-sm bg-jc-accent-soft text-jc-accent text-[10px] font-semibold tabular-nums">
                {fileIcon(att.mimeType)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-jc-ink truncate">
                  {att.name}
                </div>
                <div className="text-[11px] text-jc-ink-muted">
                  {formatBytes(att.sizeBytes)}
                  {att.pagesCount != null && (
                    <>
                      {" · "}
                      {att.pagesCount} page{att.pagesCount > 1 ? "s" : ""}
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(att)}
                disabled={isPending}
                className="text-[12px] text-jc-ink-muted hover:text-red-600 transition-colors disabled:opacity-50"
                aria-label={`Supprimer ${att.name}`}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
