import React from "react";

/**
 * Parse une portion de texte et interprète le bold inline `**texte**`.
 * Renvoie un fragment React avec <strong> aux bons endroits.
 * Exporté pour réutilisation dans la FAQ et tout autre rendu inline.
 */
export function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-jc-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/**
 * Rend le body d'une section de guide. Le format `body` est un texte plat
 * avec une syntaxe markdown minimale :
 *   - paragraphes séparés par `\n\n`
 *   - listes à puces avec lignes commençant par `- `
 *   - bold inline `**texte**` (interprété comme <strong>)
 *
 * Chaque bloc paragraphe-séparé peut mélanger une intro et une liste : le
 * parser regroupe les lignes consécutives `- ` en <ul>, le reste en <p>.
 *
 * Pourquoi pas une lib markdown : on évite la dépendance + le risque XSS de
 * dangerouslySetInnerHTML pour un besoin simple. Si on a besoin de plus
 * (titres, liens, code), on migrera vers react-markdown.
 */
export default function GuideBody({ body }: { body: string }) {
  return (
    <>
      {body.split("\n\n").map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("> [!CONSEIL]")) {
          return <ConseilCallout key={i} block={trimmed} />;
        }
        return <BlockRenderer key={i} block={block} />;
      })}
    </>
  );
}

/**
 * Encadré « Conseil de l'expert » — signal d'expertise pour les guides
 * juridiques. Le bloc est introduit en markdown par une ligne `> [!CONSEIL]`
 * (style GitHub-flavored alerts) suivie d'une ou plusieurs lignes préfixées
 * par `>`. Toutes les lignes sont concaténées en un seul paragraphe, parsé
 * avec `parseInline` pour conserver le **gras** éventuel.
 *
 * Rendu : aside avec border-left accent + fond légèrement teinté, icône
 * ampoule, label "Conseil de l'expert". `role="note"` + `aria-label` pour
 * que les lecteurs d'écran annoncent correctement le bloc.
 *
 * Convention volontairement proche du markdown GitHub pour rester lisible
 * dans le source TS sans dépendance externe.
 */
function ConseilCallout({ block }: { block: string }) {
  const text = block
    .split("\n")
    .map((line) => {
      let s = line.trim();
      if (s.startsWith(">")) s = s.slice(1).trim();
      if (s.startsWith("[!CONSEIL]")) s = s.slice("[!CONSEIL]".length).trim();
      return s;
    })
    .filter(Boolean)
    .join(" ");

  return (
    <aside
      role="note"
      aria-label="Conseil de l'expert"
      className="my-5 rounded-lg p-4 sm:p-5"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--jc-accent) 8%, var(--jc-bg))",
        borderLeft: "4px solid var(--jc-accent)",
      }}
    >
      <div
        className="flex items-center gap-2 mb-2 text-[12px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--jc-accent)" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.4.3.7.7.9 1.1.2.4.3.8.3 1.2v1h5.6v-1c0-.4.1-.8.3-1.2.2-.4.5-.8.9-1.1A7 7 0 0 0 12 2Z" />
        </svg>
        <span>Conseil de l&apos;expert</span>
      </div>
      <p
        className="text-[15px] leading-[1.7]"
        style={{ color: "var(--jc-ink)" }}
      >
        {parseInline(text)}
      </p>
    </aside>
  );
}

function BlockRenderer({ block }: { block: string }) {
  const lines = block.split("\n");
  const nodes: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      nodes.push(
        <p
          key={`p-${nodes.length}`}
          className="text-[15px] leading-[1.7] text-jc-ink-soft mb-3"
        >
          {parseInline(paragraphBuffer.join(" "))}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      const items = [...listBuffer];
      nodes.push(
        <ul
          key={`ul-${nodes.length}`}
          className="list-disc pl-5 mb-3 text-[15px] leading-[1.7] text-jc-ink-soft"
        >
          {items.map((item, j) => (
            <li key={j} className="mb-1">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.replace(/^-\s*/, ""));
    } else {
      flushList();
      paragraphBuffer.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <>{nodes}</>;
}
