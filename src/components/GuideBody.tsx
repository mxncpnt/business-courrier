import React from "react";

/**
 * Parse une portion de texte et interprète le bold inline `**texte**`.
 * Renvoie un fragment React avec <strong> aux bons endroits.
 */
function parseInline(text: string): React.ReactNode {
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
      {body.split("\n\n").map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </>
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
