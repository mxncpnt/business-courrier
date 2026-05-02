/**
 * Helper centralisé pour lire le texte affiché/imprimé d'une lettre.
 *
 * Une letter a 2 champs texte :
 *   - `generated_text` : texte produit par l'IA, immutable (sauf régénération
 *     complète depuis le tunnel `/courrier/[type]/rediger`).
 *   - `final_text`     : édition utilisateur. NULL tant que l'user n'a pas
 *     modifié le texte. Si non-NULL, prend le pas sur `generated_text`.
 *
 * Cette fonction encapsule la règle de précédence pour qu'on ne l'écrive
 * qu'une fois — appelée par la preview, le PDF généré, l'envoi MSB, et
 * partout ailleurs.
 *
 * Important : à la régénération IA (cf. `/courrier/[type]/actions.ts`), on
 * doit reset `final_text = null` pour repartir du nouveau `generated_text`
 * sinon l'user verra du texte "périmé" mélangé.
 */

interface LetterTextFields {
  generated_text: string | null;
  final_text: string | null;
}

export function getDisplayText(letter: LetterTextFields): string {
  return letter.final_text ?? letter.generated_text ?? "";
}

/**
 * Indique si le texte affiché est une édition utilisateur (true) ou la
 * sortie IA originale (false). Utile pour montrer le bouton "Réinitialiser"
 * uniquement quand pertinent.
 */
export function isEdited(letter: LetterTextFields): boolean {
  return letter.final_text !== null && letter.final_text !== undefined;
}

// ─── Limites AFNOR (calibrées empiriquement sur le rendu PDF actuel) ────────
//
// Le PDF AFNOR utilise une zone corps de ~150mm × 170mm avec police 11pt
// interligne 1.15. Espace réservé à l'en-tête expéditeur, fenêtre destinataire,
// date+lieu, objet, formule de politesse et signature → il reste ~25 lignes
// pour le corps. À 80 caractères par ligne moyens (largeur effective avec
// des mots français), ça fait :
//
//   - Cible "rentre confortablement"      : 2000 caractères
//   - Limite haute "ça passe encore"      : 2800 caractères
//   - Hard cap "ça va déborder à coup sûr": 3500 caractères
//
// Ces valeurs sont à recalibrer si on observe que le PDF déborde malgré tout.
// Une marge de sécurité est gardée car la longueur de ligne réelle dépend des
// mots (un texte en majuscules occupe plus, des paragraphes courts laissent
// de l'espace blanc qui consomme de la place verticale).

export const AFNOR_TARGET_CHARS = 2000;
export const AFNOR_WARN_CHARS = 2800;
export const AFNOR_MAX_CHARS = 3500;

/**
 * Niveau d'avertissement à afficher selon la longueur du texte.
 *   - "ok"      : confortable, rentre dans une page
 *   - "warning" : approche la limite, va probablement passer
 *   - "danger"  : dépasse la cible safe mais sous la limite hard
 *   - "blocked" : > AFNOR_MAX_CHARS, le PDF débordera presque sûrement
 */
export type LengthState = "ok" | "warning" | "danger" | "blocked";

export function getLengthState(charCount: number): LengthState {
  if (charCount > AFNOR_MAX_CHARS) return "blocked";
  if (charCount > AFNOR_WARN_CHARS) return "danger";
  if (charCount > AFNOR_TARGET_CHARS) return "warning";
  return "ok";
}
