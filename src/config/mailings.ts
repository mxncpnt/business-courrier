/**
 * Configuration des modes d'envoi physique
 *
 * Grille tarifaire MVP (validée 2026-04-28) :
 *   - PDF seul (génération uniquement) : 3,90€ TTC (cf. letter-types.ts priceCents)
 *   - Lettre simple (gen + envoi verte) : 5,90€ TTC = 3,90 + 1,28 (cost) + 0,72 (markup)
 *   - LRAR (gen + envoi recommandé AR)  : 11,90€ TTC = 3,90 + 7,97 (cost) + 0,03 (markup)
 *
 * Marges nettes attendues (hors Stripe ~0,30-0,40€ et Claude API ~0,03€) :
 *   - PDF seul     : 3,56€ (91%)
 *   - Lettre simple : 4,25€ (72%)
 *   - LRAR         : 3,47€ (29%)
 *
 * Le markup est explicite par mode pour permettre l'ajustement sans toucher
 * aux coûts MSB. Champ `markup_cents` aussi en DB sur table `mailings` pour
 * snapshot par mailing (futur ajustement par segment / promo).
 */

export type MailingMode = "simple" | "registered";

export interface MailingModeConfig {
  /** Identifiant interne */
  mode: MailingMode;
  /** Libellé court UI */
  label: string;
  /** Description longue UI */
  description: string;
  /** Coût provider en centimes (MSB) — confirmé sandbox 2026-04-28 */
  costCentsEstimate: number;
  /** Marge JusteCourrier en centimes ajoutée au coût provider */
  markupCentsEstimate: number;
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
    label: "Lettre verte",
    description:
      "Envoi standard sans suivi (lettre verte, J+3, neutre carbone). Idéal pour les courriers informatifs ou les demandes simples.",
    costCentsEstimate: 128, // MSB sandbox 2026-04-28
    markupCentsEstimate: 72, // → total envoi 200c, soit lettre simple à 5,90€ avec letterPrice 390c
    hasTracking: false,
    proofType: "none",
    deliveryEta: "J+3",
  },
  registered: {
    mode: "registered",
    label: "Recommandé avec AR",
    description:
      "Valeur juridique opposable. Obligatoire pour les mises en demeure, résiliations de bail et contestations administratives.",
    costCentsEstimate: 797, // MSB sandbox 2026-04-28
    markupCentsEstimate: 3, // → total envoi 800c, soit LRAR à 11,90€ avec letterPrice 390c
    hasTracking: true,
    proofType: "receipt",
    deliveryEta: "J+2 à J+5",
  },
};

/**
 * Mode d'envoi recommandé par type de courrier.
 *
 * Logique : on force le recommandé AR pour tous les cas où la valeur juridique
 * est essentielle (mise en demeure, résiliation bail, contestation à délai
 * opposable). Lettre simple par défaut pour les demandes informatives,
 * réclamations et résiliations courantes — l'utilisateur peut surclasser
 * en LRAR depuis l'UI s'il le souhaite.
 *
 * Note : avant 2026-04-28, on avait un 3e niveau "tracked" (suivi sans AR)
 * basé sur le postage_type "suivie" de MSB. MSB a retiré cette option ; on
 * passe à 2 niveaux (simple + registered) pour éviter d'utiliser "lr"
 * (recommandé sans AR) trop proche en prix du LRAR.
 */
export const RECOMMENDED_MODE: Record<string, MailingMode> = {
  // Mises en demeure → recommandé obligatoire (preuve de mise en demeure)
  "mise-en-demeure-payer": "registered",
  "mise-en-demeure-executer": "registered",

  // Résiliations à valeur juridique opposable
  "resiliation-bail": "registered",
  "resiliation-abonnement": "simple",

  // Contestations
  "contestation-amende": "registered", // délai 45 jours opposable
  "contestation-decision": "registered", // recours gracieux à preuve
  "contestation-facture": "simple",

  // Réclamations
  "reclamation-administration": "simple",
  "reclamation-service-client": "simple",

  // Demandes
  "demande-remboursement": "simple",
};

/**
 * Retourne le mode recommandé pour un type de courrier.
 * Fallback : 'simple' (la grande majorité des courriers admin).
 */
export function getRecommendedMode(letterTypeSlug: string): MailingMode {
  return RECOMMENDED_MODE[letterTypeSlug] ?? "simple";
}

/**
 * Retourne la config d'un mode (label, prix, etc.).
 */
export function getMailingModeConfig(mode: MailingMode): MailingModeConfig {
  return MAILING_MODES[mode];
}

/**
 * Calcule le total facturé au client pour un envoi (cost + markup).
 * Snapshot des deux composantes en DB sur table `mailings`.
 */
export function computeMailingTotal(
  costCents: number,
  markupCents: number = 0
): number {
  return costCents + markupCents;
}

/**
 * Prix total facturé au client pour la combinaison "courrier + envoi".
 *   - Si pas d'envoi (mode = undefined/null) : retourne juste le prix de la lettre
 *   - Si envoi : letterPriceCents + costCents + markupCents
 *
 * Exemple : letterPriceCents=390, mode='registered' → 390 + 797 + 3 = 1190 (11,90€)
 */
export function computeBundlePriceCents(
  letterPriceCents: number,
  mode?: MailingMode | null
): number {
  if (!mode) return letterPriceCents;
  const config = MAILING_MODES[mode];
  return letterPriceCents + computeMailingTotal(config.costCentsEstimate, config.markupCentsEstimate);
}
