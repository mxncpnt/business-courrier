// Logo.tsx — Logo JusteCourrier avec marque SVG + wordmark

function LogoMark({
  size = 22,
  color = "var(--jc-ink)",
  accent = "var(--jc-accent)",
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="26"
        height="18"
        rx="1.5"
        stroke={color}
        strokeWidth="1.6"
      />
      <path
        d="M3 8.5 L16 17 L29 8.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="20.5" r="3" fill={accent} />
    </svg>
  );
}

export default function Logo({
  size = 22,
  color = "var(--jc-ink)",
  accent = "var(--jc-accent)",
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <span
      className="inline-flex items-center font-display"
      style={{
        gap: 10,
        fontWeight: 600,
        fontSize: size * 0.82,
        color,
        letterSpacing: "-0.01em",
        lineHeight: 1,
      }}
    >
      <LogoMark size={size} color={color} accent={accent} />
      <span>
        <span style={{ fontWeight: 600 }}>juste</span>
        <span style={{ fontWeight: 400, color: "var(--jc-ink-soft)" }}>
          courrier
        </span>
      </span>
    </span>
  );
}
