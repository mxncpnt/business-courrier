"use client";

interface LetterPreviewProps {
  text: string;
  isPaid: boolean;
  formData?: Record<string, string>;
  letterTitle?: string;
  /**
   * URL signée vers la signature manuscrite globale de l'user.
   * Si fourni, affichée dans la zone signature du preview AFNOR (juste
   * après la formule de politesse détectée). Doit pointer vers une image
   * accessible par le navigateur (signed URL Supabase Storage).
   */
  signatureUrl?: string | null;
}

// Index de la dernière ligne non-blank — c'est le nom typé du signataire.
// Aligné à droite, et la signature manuscrite est placée juste après.
// Cohérent avec `lib/pdf.ts`.
function findLastNonBlankIndex(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== "") return i;
  }
  return -1;
}

export default function LetterPreview({
  text,
  isPaid,
  formData,
  letterTitle,
  signatureUrl,
}: LetterPreviewProps) {
  const lines = text.split("\n");
  // Show salutation + first paragraph only when not paid
  const visibleCount = isPaid
    ? lines.length
    : (() => {
        let nonEmpty = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() !== "") nonEmpty++;
          if (nonEmpty >= 2) return i + 1;
        }
        return lines.length;
      })();

  // ─── Structured data from form ───
  const senderName =
    formData?.sender_firstname && formData?.sender_lastname
      ? `${formData.sender_firstname} ${formData.sender_lastname}`
      : "";
  const senderStreet = formData?.sender_street || "";
  const senderZipCity =
    formData?.sender_zipcode && formData?.sender_city
      ? `${formData.sender_zipcode} ${formData.sender_city}`
      : "";
  const senderEmail = formData?.sender_email || "";

  const recipientName = formData?.recipient_name || "";
  // Adresse destinataire : champs structurés (nouveau) avec fallback sur textarea legacy
  const recipientLine1 = formData?.recipient_address_line1 || "";
  const recipientLine2 = formData?.recipient_address_line2 || "";
  const recipientZipCity =
    formData?.recipient_zipcode && formData?.recipient_city
      ? `${formData.recipient_zipcode} ${formData.recipient_city}`
      : "";
  const recipientAddress = recipientLine1
    ? [recipientLine1, recipientLine2, recipientZipCity].filter((l) => l).join("\n")
    : formData?.recipient_address || "";

  const senderCity = formData?.sender_city || "";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const objectText = letterTitle || "";

  return (
    <div className="bg-jc-surface rounded-jc-lg p-6 sm:p-10">
      {/* A4 page */}
      <div
        className="bg-white border border-jc-line max-w-[420px] mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        style={{ aspectRatio: "210 / 297" }}
      >
        <div className="relative h-full overflow-hidden" style={{ padding: "7.5% 9.5%" }}>
          {/* ─── Zone 1 : Expéditeur (haut gauche) ─── */}
          <div className="text-[8px] leading-[1.5] text-gray-800 mb-[6%]">
            {senderName && <div className="font-semibold">{senderName}</div>}
            {senderStreet && <div>{senderStreet}</div>}
            {senderZipCity && <div>{senderZipCity}</div>}
            {senderEmail && <div className="text-gray-500">{senderEmail}</div>}
          </div>

          {/* ─── Zone 4 : Destinataire (aligné droite — fenêtre enveloppe) ─── */}
          <div className="text-[8px] leading-[1.5] text-gray-800 text-right mb-[2%]">
            {recipientName && <div className="font-semibold">{recipientName}</div>}
            {recipientAddress && (
              <div className="whitespace-pre-line">{recipientAddress}</div>
            )}
          </div>

          {/* ─── Lieu et date (sous le destinataire, aligné droite pour
              approximer le bord gauche de la zone destinataire — l'aperçu
              HTML n'est pas pixel-perfect avec le PDF) ─── */}
          <div className="text-[8px] text-gray-800 text-right mb-[4%]">
            {senderCity ? `${senderCity}, le ${today}` : `Le ${today}`}
          </div>

          {/* ─── Objet ─── */}
          {objectText && (
            <div className="text-[8px] text-gray-800 mb-[3%]">
              <span className="underline">Objet</span> : {objectText}
            </div>
          )}

          {/* ─── Corps du courrier ─── */}
          <div className="text-[8px] leading-[1.6] text-gray-800">
            {/* Visible portion : dernière ligne non-blank (= nom du signataire)
                alignée à droite, et signature manuscrite placée juste en-dessous,
                également à droite. Cohérent avec le rendu PDF (`lib/pdf.ts`). */}
            {(() => {
              const visibleLines = lines.slice(0, visibleCount);
              const lastNonBlankIdx = findLastNonBlankIndex(visibleLines);
              const renderedLines: React.ReactNode[] = [];

              for (let i = 0; i < visibleCount; i++) {
                const line = lines[i];
                const isSignerName =
                  line.trim() !== "" && i === lastNonBlankIdx;
                renderedLines.push(
                  <p
                    key={`vis-${i}`}
                    style={{
                      margin: line === "" ? "4px 0" : "0 0 3px",
                      textAlign: isSignerName ? "right" : undefined,
                    }}
                  >
                    {line || " "}
                  </p>
                );
              }

              if (signatureUrl && isPaid) {
                renderedLines.push(
                  <div
                    key="signature"
                    className="flex justify-end"
                    style={{ marginTop: "4px" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed URL Supabase, dynamique, pas optimisable par next/image */}
                    <img
                      src={signatureUrl}
                      alt="Signature"
                      style={{
                        height: "32px",
                        maxWidth: "140px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                );
              }
              return renderedLines;
            })()}

            {/* Blurred portion */}
            {!isPaid && visibleCount < lines.length && (
              <div className="relative">
                {lines.slice(visibleCount).map((line, i) => (
                  <p
                    key={i}
                    className="select-none"
                    style={{
                      margin: line === "" ? "4px 0" : "0 0 3px",
                      filter: "blur(3.5px)",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {line || " "}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
