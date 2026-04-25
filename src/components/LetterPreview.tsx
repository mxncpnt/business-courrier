"use client";

interface LetterPreviewProps {
  text: string;
  isPaid: boolean;
}

export default function LetterPreview({ text, isPaid }: LetterPreviewProps) {
  const lines = text.split("\n");

  // Show first 40% of lines clearly, blur the rest
  const visibleCount = isPaid ? lines.length : Math.ceil(lines.length * 0.4);

  return (
    <div className="bg-jc-bg-elev rounded-jc-lg border border-jc-line shadow-sm overflow-hidden">
      {/* Paper-like container */}
      <div className="p-8 sm:p-12 font-display text-jc-ink leading-relaxed relative">
        {/* Visible portion */}
        <div className="whitespace-pre-wrap">
          {lines.slice(0, visibleCount).join("\n")}
        </div>

        {/* Blurred portion */}
        {!isPaid && visibleCount < lines.length && (
          <div className="relative mt-0">
            <div
              className="whitespace-pre-wrap select-none"
              style={{
                filter: "blur(5px)",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              {lines.slice(visibleCount).join("\n")}
            </div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
