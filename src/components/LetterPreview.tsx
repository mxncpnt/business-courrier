"use client";

interface LetterPreviewProps {
  text: string;
  isPaid: boolean;
  formData?: Record<string, string>;
  letterTitle?: string;
}

export default function LetterPreview({
  text,
  isPaid,
  formData,
  letterTitle,
}: LetterPreviewProps) {
  const lines = text.split("\n");
  const visibleCount = isPaid ? lines.length : Math.ceil(lines.length * 0.4);

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
  const recipientAddress = formData?.recipient_address || "";

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

          {/* ─── Zone 4 : Destinataire (décalé droite — fenêtre enveloppe) ─── */}
          <div className="text-[8px] leading-[1.5] text-gray-800 ml-[50%] mb-[4%]">
            {recipientName && <div className="font-semibold">{recipientName}</div>}
            {recipientAddress && (
              <div className="whitespace-pre-line">{recipientAddress}</div>
            )}
          </div>

          {/* ─── Lieu et date (aligné droite) ─── */}
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
            {/* Visible portion */}
            {lines.slice(0, visibleCount).map((line, i) => (
              <p
                key={i}
                style={{ margin: line === "" ? "4px 0" : "0 0 3px" }}
              >
                {line || " "}
              </p>
            ))}

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
