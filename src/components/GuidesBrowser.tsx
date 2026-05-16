"use client";

import { useState } from "react";
import Link from "next/link";
import type { GuideCategory } from "@/config/guides";
import { IconArrow } from "@/components/Icons";

/**
 * Forme minimale d'un guide pour l'affichage liste — la page serveur
 * pré-calcule `letterTitle` à partir de `getLetterType(relatedLetterSlug)`
 * pour éviter d'embarquer toute la config letter-types côté client.
 */
export interface BrowserGuide {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  category: GuideCategory;
  letterTitle: string | null;
}

interface CategoryMeta {
  slug: GuideCategory;
  label: string;
  icon: string;
  description: string;
}

/**
 * Liste des guides regroupée par catégorie de domaine de vie, avec un
 * filtre par chips au sommet. Composant client minimal — le rendu initial
 * (sans interaction) affiche toutes les catégories, donc le HTML servi à
 * Google contient l'intégralité des liens internes. La logique client se
 * limite à masquer/afficher les sections selon la chip active.
 */
export default function GuidesBrowser({
  guides,
  categories,
}: {
  guides: BrowserGuide[];
  categories: CategoryMeta[];
}) {
  // null = "Tous" — état par défaut, équivalent au rendu serveur initial.
  const [active, setActive] = useState<GuideCategory | null>(null);

  // Pré-groupement par catégorie, dans l'ordre déclaré de `categories`.
  // On filtre les catégories vides pour ne pas afficher de bloc orphelin
  // (utile tant qu'on a peu de guides dans certains domaines, ex: Énergie).
  const groups = categories
    .map((cat) => ({
      meta: cat,
      items: guides.filter((g) => g.category === cat.slug),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* ─── Chips de filtrage ─── */}
      <div
        role="tablist"
        aria-label="Filtrer les guides par catégorie"
        className="flex flex-wrap gap-2 mb-10"
      >
        <Chip active={active === null} onClick={() => setActive(null)}>
          Tous
        </Chip>
        {categories.map((cat) => (
          <Chip
            key={cat.slug}
            active={active === cat.slug}
            onClick={() => setActive(cat.slug)}
            icon={cat.icon}
          >
            {cat.label}
          </Chip>
        ))}
      </div>

      {/* ─── Sections par catégorie ─── */}
      <div className="flex flex-col gap-12">
        {groups
          .filter((g) => active === null || g.meta.slug === active)
          .map((group) => (
            <section
              key={group.meta.slug}
              id={`cat-${group.meta.slug}`}
              aria-labelledby={`cat-${group.meta.slug}-heading`}
            >
              <h2
                id={`cat-${group.meta.slug}-heading`}
                className="flex items-center gap-2.5 text-[22px] font-display font-bold text-jc-ink mb-1 max-md:text-[19px]"
              >
                <span aria-hidden="true">{group.meta.icon}</span>
                {group.meta.label}
              </h2>
              <p className="text-[14px] text-jc-ink-muted mb-4">
                {group.meta.description}
              </p>
              <div className="flex flex-col gap-3">
                {group.items.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="flex flex-col sm:flex-row sm:items-start gap-3 p-5 border border-jc-line rounded-jc bg-jc-bg-elev no-underline hover:border-jc-primary hover:-translate-y-px transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-semibold text-jc-ink leading-snug mb-1.5">
                        {guide.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-jc-ink-soft mb-2">
                        {guide.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-jc-ink-muted">
                        <span>Lecture {guide.readingTime}</span>
                        {guide.letterTitle && (
                          <>
                            <span>·</span>
                            <span className="text-jc-accent">
                              Courrier associé : {guide.letterTitle}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-jc-accent mt-1 sm:mt-2">
                      <IconArrow />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </>
  );
}

/**
 * Chip de filtre — bouton rond pill, état actif en jc-primary, inactif en
 * outline jc-line. Cohérent avec le style des CTA secondaires de la home
 * (catalogue, footer links) pour rester dans la charte graphique Sage.
 */
function Chip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors no-underline",
        active
          ? "bg-jc-primary text-white"
          : "border border-jc-line text-jc-ink-soft hover:border-jc-primary hover:text-jc-ink",
      ].join(" ")}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
