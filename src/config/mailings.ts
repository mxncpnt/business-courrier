/**
 * Configuration des modes d'envoi physique
 *
 * Les prix sont des estimations MVP qui seront calées sur les tarifs réels
 * MySendingBox lors de la Phase 4.2 (intégration sandbox + cotation live).
 *
 * Le markup est à 0 au MVP (prix coûtant transparent). Le schéma DB prévoit
 * un champ `markup_cents` par mailing pour activer une marge différenciée
 * plus tard sans migration.
 */

export type MailingMode = "simple" | "tracked" | "registered";

export interface MailingModeConfig {
  /** Identifiant interne */
  mode: MailingMode;
  /** Libellé court UI */
  label: string;
  /** Description longue UI */
  description: string;
  /** Coût estimé HT en centimes (provider) — à confirmer Phase 4.2 */
  costCentsEstimate: number;
  /** Le mode supporte un suivi en ligne */
  hasTracking: boolean;
  /** Type de preuve fournie (deposit = dépôt seul, receipt = AR signé) */
  proofType: "none" | "deposit" | "receipt";
  /** Délai de distribution indicatif (J+X) */
  deliveryEta: string;
}

export const MAILING_MODES: Record<MailingMode, MailingModeConfig> = {
  simple: {
    mode: "simple",
    label: "Lettre simple",
    description:
      "Envoi standard sans suivi. Idéal pour les courriers informatifs ou les demandes simples.",
    costCentsEstimate: 200,
    hasTracking: false,
    proofType: "none",
    deliveryEta: "J+2 à J+4",
  },
  tracked: {
    mode: "tracked",
    label: "Lettre suivie",
    description:
      "Suivi en ligne et preuve de dépôt. Recommandé pour les documents importants sans enjeu juridique.",
    costCentsEstimate: 400,
    hasTracking: true,
    proofType: "deposit",
    deliveryEta: "J+2 à J+4",
  },
  registered: {
    mode: "registered",
    label: "Recommandé avec AR",
    description:
      "Valeur juridique opposable. Obligatoire pour les mises en demeure, résiliations de bail et contestations administratives.",
    costCentsEstimate: 800,
    hasTracking: true,
    proofType: "receipt",
    deliveryEta: "J+2 à J+5",
  },
};

/**
 * Mode d'envoi recommandé par type de courrier.
 *
 * Logique : on force le recommandé pour tous les cas où la valeur juridique
 * est essentielle (mise en demeure, résiliation bail, contestation à délai
 * opposable). On suggère le suivi pour les contestations courantes et la
 * lettre simple pour les demandes informatives.
 */
export const RECOMMENDED_MODE: Record<string, MailingMode> = {
  // Mises en demeure → recommandé obligatoire (preuve de mise en demeure)
  "mise-en-demeure-payer": "registered",
  "mise-en-demeure-executer": "registered",

  // Résiliations à valeur juridique opposable
  "resiliation-bail": "registered",
  "resiliation-abonnement": "tracked",

  // Contestations
  "contestation-amende": "registered", // délai 45 jours opposable
  "contestation-decision": "registered", // recours gracieux à preuve
  "contestation-facture": "tracked",

  // Réclamations
  "reclamation-administration": "tracked",
  "reclamation-service-client": "simple",

  // Demandes
  "demande-remboursement": "tracked",
};

/**
 * Retourne le mode recommandé pour un type de courrier.
 * Fallback : 'tracked' (compromis raisonnable si le type n'est pas mappé).
 */
export function getRecommendedMode(letterTypeSlug: string): MailingMode {
  return RECOMMENDED_MODE[letterTypeSlug] ?? "tracked";
}

/**
 * Retourne la config d'un mode (label, prix, etc.).
 */
export function getMailingModeConfig(mode: MailingMode): MailingModeConfig {
  return MAILING_MODES[mode];
}

/**
 * Calcule le total facturé au client pour un envoi (cost + markup).
 * Au MVP : markup = 0, total = cost.
 */
export function computeMailingTotal(
  costCents: number,
  markupCents: number = 0
): number {
  return costCents + markupCents;
}
