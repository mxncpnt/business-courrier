// Configuration légale de l'entreprise — utilisée pour les factures, mentions
// légales, footers, factures PDF, etc. Source de vérité unique : tout
// changement (déménagement, changement de raison sociale, etc.) se fait ici.
//
// Helpers :
//   - `business.siretFormatted` : SIRET avec espaces (lisibilité humaine)
//   - `business.fullAddress` : adresse formatée single-line

export const business = {
  // Identité
  name: "Maxence Pinta",
  tradeName: "JusteCourrier",
  legalForm: "Entrepreneur individuel",
  siret: "10434791900011",

  // Adresse (domiciliation)
  address: {
    street: "3 Rue Jean Giono",
    zipCode: "34170",
    city: "Castelnau-le-Lez",
  },

  // Contact
  email: "contact@justecourrier.fr",
  website: "https://justecourrier.fr",

  // TVA — micro-entreprise sous franchise (seuil 37 500 € HT/an pour services)
  vatMention: "TVA non applicable, art. 293 B du CGI",

  // Facturation
  invoicePrefix: "JC",
  currency: "EUR",
  currencySymbol: "€",

  // Conditions de paiement (paiement immédiat par carte)
  paymentTerms: "Paiement comptant à la commande par carte bancaire",
  latePenaltyRate: "3 fois le taux d'intérêt légal",
  recoveryIndemnity: "40,00 €", // indemnité forfaitaire de recouvrement

  // Admin
  adminEmails: ["maxence.pinta@gmail.com"],
} as const;

/** SIRET formaté avec espaces : "104 347 919 00011" */
export const siretFormatted = business.siret.replace(
  /(\d{3})(\d{3})(\d{3})(\d{5})/,
  "$1 $2 $3 $4"
);

/** Adresse complète sur une ligne : "3 Rue Jean Giono, 34170 Castelnau-le-Lez" */
export const fullAddress = `${business.address.street}, ${business.address.zipCode} ${business.address.city}`;

/** Footer copyright standard utilisé partout : "© 2026 JusteCourrier · SIRET 104 347 919 00011" */
export function copyrightLine(year: number): string {
  return `© ${year} ${business.tradeName} · SIRET ${siretFormatted}`;
}

// Format : JC-2026-0001
export function formatInvoiceNumber(year: number, sequence: number): string {
  return `${business.invoicePrefix}-${year}-${String(sequence).padStart(4, "0")}`;
}
