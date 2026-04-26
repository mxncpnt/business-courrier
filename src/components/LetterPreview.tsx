"use client";

interface LetterPreviewProps {
  text: string;
  isPaid: boolean;
}

export default function LetterPreview({ text, isPaid }: LetterPreviewProps) {
  const lines = text.split("\n");
  const visibleCount = isPaid ? lines.length : Math.ceil(lines.length * 0.4);

  return (
    <div className="bg-jc-surface rounded-jc-lg p-6 sm:p-10">
      {/* A4 page */}
      <div
        className="bg-white border border-jc-line max-w-[420px] mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        style={{ aspectRatio: "210 / 297" }}
      >
        <div className="px-[40px] py-[40px] font-body text-jc-ink text-[10px] leading-[1.65] h-full overflow-hidden">
          {/* Visible portion */}
          {lines.slice(0, visibleCount).map((line, i) => (
            <p
              key={i}
              className="text-jc-ink"
              style={{ margin: line === "" ? "5px 0" : "0 0 4px" }}
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
                  className="text-jc-ink select-none"
                  style={{
                    margin: line === "" ? "5px 0" : "0 0 4px",
                    filter: "blur(4px)",
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
  );
}
