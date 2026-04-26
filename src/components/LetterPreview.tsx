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

  // Sender info from form data
  const senderName =
    formData?.sender_firstname && formData?.sender_lastname
      ? `${formData.sender_firstname} ${formData.sender_lastname}`
      : formData?.sender_name || "";
  const senderAddress =
    formData?.sender_street && formData?.sender_zipcode && formData?.sender_city
      ? `${formData.sender_street}, ${formData.sender_zipcode} ${formData.sender_city}`
      : formData?.sender_address || "";
  const senderEmail = formData?.sender_email || "";
  const senderCity = formData?.sender_city || "Paris";

  // Recipient info
  const recipientName = formData?.recipient_name || "";
  const recipientAddress = formData?.recipient_address || "";

  // Build object line
  const objectLine = letterTitle
    ? `Objet : ${letterTitle}`
    : "";

  // Today formatted
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasStructuredHeader = !!(senderName || recipientName);

  return (
    <div className="bg-jc-bg-elev border border-jc-line rounded-jc-sm max-w-[720px] mx-auto">
      <div className="px-8 py-8 sm:px-10 sm:py-8 font-body text-jc-ink text-[13px] leading-[1.65]">
        {/* ─── Structured header ─── */}
        {hasStructuredHeader && (
          <>
            {/* Sender + Date row */}
            <div className="flex justify-between mb-6 text-xs">
              <div>
                {senderName && (
                  <div className="font-semibold text-jc-ink">{senderName}</div>
                )}
                {senderAddress && (
                  <div className="text-jc-ink-muted">{senderAddress}</div>
                )}
                {senderEmail && (
                  <div className="text-jc-ink-muted">{senderEmail}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-jc-ink-muted">
                  {senderCity}, le {today}
                </div>
                <div className="text-jc-ink-muted mt-1">
                  Lettre recommandée AR
                </div>
              </div>
            </div>

            {/* Recipient */}
            {recipientName && (
              <div className="mb-[18px] text-xs">
                <div className="font-semibold text-jc-ink">
                  {recipientName}
                </div>
                {recipientAddress && (
                  <div className="text-jc-ink-muted whitespace-pre-line">
                    {recipientAddress}
                  </div>
                )}
              </div>
            )}

            {/* Object line */}
            {objectLine && (
              <div className="mb-[18px] text-xs">
                <span className="underline">Objet</span>
                &nbsp;: {letterTitle}
              </div>
            )}
          </>
        )}

        {/* ─── Letter body ─── */}
        <div className="text-[13px] leading-[1.7]">
          {/* Visible portion */}
          {lines.slice(0, visibleCount).map((line, i) => (
            <p
              key={i}
              className="text-jc-ink"
              style={{ margin: line === "" ? "6px 0" : "0 0 6px" }}
            >
              {line || " "}
            </p>
          ))}

          {/* Blurred portion */}
          {!isPaid && visibleCount < lines.length && (
            <div className="relative">
              {lines.slice(visibleCount).map((line, i) => (
                <p
                  key={i}
                  className="text-jc-ink select-none"
                  style={{
                    margin: line === "" ? "6px 0" : "0 0 6px",
                    filter: "blur(4.5px)",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  {line || " "}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
