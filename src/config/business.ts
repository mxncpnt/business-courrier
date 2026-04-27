// Configuration légale de l'entreprise — utilisée pour les factures et mentions légales
// Mettre à jour dès réception du SIRET et de l'adresse de domiciliation

export const business = {
  // Identité
  name: "Maxence Pinta",
  tradeName: "JusteCourrier",
  legalForm: "Entrepreneur individuel",
  siret: "En cours d'attribution",

  // Adresse (domiciliation)
  address: {
    street: "Domiciliation en cours",
    zipCode: "",
    city: "",
  },

  // Contact
  email: "contact@justecourrier.fr",
  website: "https://justecourrier.fr",

  // TVA
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

// Format : JC-2026-0001
export function formatInvoiceNumber(year: number, sequence: number): string {
  return `${business.invoicePrefix}-${year}-${String(sequence).padStart(4, "0")}`;
}
