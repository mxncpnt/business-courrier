"use client";

interface LetterPreviewProps {
  text: string;
  isPaid: boolean;
}

export default function LetterPreview({ text, isPaid }: LetterPreviewProps) {
  const lines = text.split("\n");
  const visibleCount = isPaid ? lines.length : Math.ceil(lines.length * 0.4);

  return (
    <div
      className="bg-white border border-jc-line rounded-jc-sm max-w-[595px] mx-auto shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      style={{ aspectRatio: "210 / 297" }}
    >
      <div className="px-[56px] py-[56px] font-body text-jc-ink text-[11.5px] leading-[1.7] h-full overflow-hidden">
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
  );
}
