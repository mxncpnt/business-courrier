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
// Recalibré 2026-05-02 après observation : un corps de ~1640 caractères
// (avec 5-6 paragraphes courts) déborde sur 2 pages dans le PDF AFNOR
// actuel. Cause : les zones non-éditables consomment beaucoup de place
// verticale (en-tête expéditeur ~25mm, fenêtre destinataire ~30mm, date+
// objet ~12mm, formule de politesse + signature ~20mm = ~90mm sur 247mm
// disponibles), il reste ~155mm pour le corps. À ~5mm par ligne (interligne
// 1.55) avec marges de paragraphe (10mm entre paragraphes), on tient ~22-25
// lignes utiles. À 70 caractères par ligne (largeur effective police 10pt),
// ça donne max ~1700 caractères avant débordement.
//
// Valeurs conservatrices pour MVP (à recalibrer si on revoit le générateur
// PDF — typiquement réduire les marges/espacements gagnerait 200-300 chars) :
//   - Cible "rentre confortablement"      : 1200 caractères
//   - Limite haute "ça passe encore"      : 1500 caractères
//   - Hard cap "ça va déborder à coup sûr": 1700 caractères
//
// Le compteur ne mesure QUE le corps éditable. Les zones fixes (expéditeur,
// destinataire, objet, signature) sont déduites en amont via le calcul ci-
// dessus.

export const AFNOR_TARGET_CHARS = 1200;
export const AFNOR_WARN_CHARS = 1500;
export const AFNOR_MAX_CHARS = 1700;

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
