export type FieldType = "text" | "textarea" | "email" | "date" | "select";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // pour les selects
}

export interface LetterType {
  slug: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  priceCents: number;
  fields: FormField[];
}

export const categories = [
  { slug: "resiliation", label: "Résiliation", icon: "✂️" },
  { slug: "contestation", label: "Contestation", icon: "⚖️" },
  { slug: "reclamation", label: "Réclamation", icon: "📢" },
  { slug: "mise-en-demeure", label: "Mise en demeure", icon: "⚠️" },
  { slug: "demande", label: "Demande", icon: "📋" },
] as const;

// Champs communs à tous les courriers
export const commonFields: FormField[] = [
  { name: "sender_name", label: "Votre nom complet", type: "text", placeholder: "Jean Dupont", required: true },
  { name: "sender_address", label: "Votre adresse", type: "textarea", placeholder: "12 rue de la Paix\n75002 Paris", required: true },
  { name: "sender_email", label: "Votre email", type: "email", placeholder: "jean@email.com", required: true },
  { name: "recipient_name", label: "Nom du destinataire", type: "text", placeholder: "Société XYZ / M. Martin", required: true },
  { name: "recipient_address", label: "Adresse du destinataire", type: "textarea", placeholder: "Service client\n1 avenue des Champs-Élysées\n75008 Paris", required: true },
];

export const letterTypes: LetterType[] = [
  // --- Résiliation ---
  {
    slug: "resiliation-abonnement",
    title: "Résiliation d'abonnement",
    category: "resiliation",
    description: "Résilier un contrat télécom, salle de sport, assurance, presse, etc.",
    icon: "✂️",
    priceCents: 490,
    fields: [
      { name: "provider", label: "Nom de l'opérateur / entreprise", type: "text", placeholder: "Orange, Basic-Fit, MAIF...", required: true },
      { name: "contract_number", label: "Numéro de contrat ou client", type: "text", placeholder: "CLI-123456", required: false },
      { name: "subscription_date", label: "Date de souscription", type: "date", required: false },
      { name: "reason", label: "Motif de résiliation", type: "select", required: true, options: ["Déménagement", "Offre trop chère", "Insatisfaction du service", "Changement de fournisseur", "Autre"] },
      { name: "details", label: "Précisions supplémentaires", type: "textarea", placeholder: "Détails sur votre situation...", required: false },
    ],
  },
  {
    slug: "resiliation-bail",
    title: "Résiliation de bail locatif",
    category: "resiliation",
    description: "Donner congé à votre propriétaire (préavis locataire).",
    icon: "🏠",
    priceCents: 490,
    fields: [
      { name: "landlord_name", label: "Nom du propriétaire / agence", type: "text", placeholder: "M. Martin / Agence Immobilière XYZ", required: true },
      { name: "property_address", label: "Adresse du logement", type: "textarea", placeholder: "Adresse complète du bien loué", required: true },
      { name: "lease_start_date", label: "Date de début du bail", type: "date", required: true },
      { name: "notice_type", label: "Type de préavis", type: "select", required: true, options: ["1 mois (zone tendue / meublé)", "3 mois (location vide classique)"] },
      { name: "departure_date", label: "Date de départ souhaitée", type: "date", required: true },
      { name: "reason", label: "Motif (si préavis réduit)", type: "textarea", placeholder: "Mutation professionnelle, perte d'emploi, etc.", required: false },
    ],
  },

  // --- Contestation ---
  {
    slug: "contestation-amende",
    title: "Contestation d'amende",
    category: "contestation",
    description: "Contester une amende de stationnement, excès de vitesse, etc.",
    icon: "🚗",
    priceCents: 490,
    fields: [
      { name: "fine_number", label: "Numéro de l'avis de contravention", type: "text", placeholder: "N° figurant sur l'avis", required: true },
      { name: "fine_date", label: "Date de l'infraction", type: "date", required: true },
      { name: "fine_type", label: "Type d'infraction", type: "select", required: true, options: ["Stationnement", "Excès de vitesse", "Feu rouge / stop", "Autre infraction routière"] },
      { name: "vehicle_plate", label: "Immatriculation du véhicule", type: "text", placeholder: "AB-123-CD", required: true },
      { name: "contestation_reason", label: "Motif de contestation", type: "textarea", placeholder: "Expliquez pourquoi vous contestez cette amende...", required: true },
    ],
  },
  {
    slug: "contestation-facture",
    title: "Contestation de facture",
    category: "contestation",
    description: "Contester un prélèvement abusif ou une facture injustifiée.",
    icon: "💳",
    priceCents: 490,
    fields: [
      { name: "company", label: "Entreprise concernée", type: "text", placeholder: "EDF, SFR, Amazon...", required: true },
      { name: "invoice_number", label: "Numéro de facture", type: "text", placeholder: "FA-2024-001234", required: false },
      { name: "invoice_date", label: "Date de la facture", type: "date", required: true },
      { name: "amount", label: "Montant contesté (€)", type: "text", placeholder: "49,90", required: true },
      { name: "reason", label: "Motif de contestation", type: "textarea", placeholder: "Service non fourni, double facturation, montant erroné...", required: true },
    ],
  },
  {
    slug: "contestation-decision",
    title: "Contestation de décision administrative",
    category: "contestation",
    description: "Contester une décision de la CAF, Pôle emploi, préfecture, etc.",
    icon: "🏛️",
    priceCents: 490,
    fields: [
      { name: "administration", label: "Administration concernée", type: "text", placeholder: "CAF, France Travail, Préfecture...", required: true },
      { name: "decision_date", label: "Date de la décision", type: "date", required: true },
      { name: "decision_reference", label: "Référence de la décision", type: "text", placeholder: "N° de dossier ou de courrier", required: false },
      { name: "decision_summary", label: "Résumé de la décision contestée", type: "textarea", placeholder: "Décrivez la décision que vous contestez...", required: true },
      { name: "arguments", label: "Vos arguments", type: "textarea", placeholder: "Pourquoi cette décision est erronée ou injuste...", required: true },
    ],
  },

  // --- Réclamation ---
  {
    slug: "reclamation-service-client",
    title: "Réclamation service client",
    category: "reclamation",
    description: "Réclamer suite à un retard de livraison, produit défectueux, etc.",
    icon: "📦",
    priceCents: 490,
    fields: [
      { name: "company", label: "Entreprise concernée", type: "text", placeholder: "Amazon, FNAC, Cdiscount...", required: true },
      { name: "order_number", label: "Numéro de commande", type: "text", placeholder: "CMD-123456", required: false },
      { name: "order_date", label: "Date de commande / incident", type: "date", required: true },
      { name: "problem_type", label: "Type de problème", type: "select", required: true, options: ["Retard de livraison", "Produit défectueux", "Produit non conforme", "Colis non reçu", "Service non rendu"] },
      { name: "description", label: "Description du problème", type: "textarea", placeholder: "Décrivez précisément le problème rencontré...", required: true },
      { name: "expected_resolution", label: "Ce que vous attendez", type: "select", required: true, options: ["Remboursement", "Échange", "Réparation", "Geste commercial"] },
    ],
  },
  {
    slug: "reclamation-administration",
    title: "Réclamation administration",
    category: "reclamation",
    description: "Réclamer auprès de la CAF, impôts, CPAM, mairie, etc.",
    icon: "🏛️",
    priceCents: 490,
    fields: [
      { name: "administration", label: "Administration concernée", type: "text", placeholder: "CAF, CPAM, Service des impôts...", required: true },
      { name: "dossier_number", label: "Numéro de dossier / allocataire", type: "text", placeholder: "N° de dossier", required: false },
      { name: "subject", label: "Objet de la réclamation", type: "text", placeholder: "Retard de traitement, erreur de calcul...", required: true },
      { name: "description", label: "Description détaillée", type: "textarea", placeholder: "Expliquez votre situation et ce qui pose problème...", required: true },
    ],
  },

  // --- Mise en demeure ---
  {
    slug: "mise-en-demeure-payer",
    title: "Mise en demeure de payer",
    category: "mise-en-demeure",
    description: "Exiger le paiement d'une somme due (loyer, facture, prêt).",
    icon: "💰",
    priceCents: 490,
    fields: [
      { name: "debt_nature", label: "Nature de la dette", type: "select", required: true, options: ["Loyer impayé", "Facture impayée", "Prêt non remboursé", "Caution non restituée", "Autre"] },
      { name: "amount_due", label: "Montant dû (€)", type: "text", placeholder: "1 500,00", required: true },
      { name: "due_date", label: "Date d'échéance initiale", type: "date", required: true },
      { name: "context", label: "Contexte", type: "textarea", placeholder: "Décrivez la situation : quand et pourquoi cette somme est due...", required: true },
      { name: "deadline_days", label: "Délai accordé", type: "select", required: true, options: ["8 jours", "15 jours", "30 jours"] },
    ],
  },
  {
    slug: "mise-en-demeure-executer",
    title: "Mise en demeure d'exécuter",
    category: "mise-en-demeure",
    description: "Exiger l'exécution d'un engagement (travaux, livraison, prestation).",
    icon: "🔧",
    priceCents: 490,
    fields: [
      { name: "obligation_type", label: "Type d'obligation", type: "select", required: true, options: ["Travaux non réalisés", "Livraison non effectuée", "Prestation non fournie", "Engagement contractuel non tenu"] },
      { name: "contract_date", label: "Date de l'engagement / contrat", type: "date", required: true },
      { name: "description", label: "Description de l'engagement non tenu", type: "textarea", placeholder: "Décrivez ce qui était prévu et ce qui n'a pas été fait...", required: true },
      { name: "deadline_days", label: "Délai accordé", type: "select", required: true, options: ["8 jours", "15 jours", "30 jours"] },
    ],
  },

  // --- Demande ---
  {
    slug: "demande-remboursement",
    title: "Demande de remboursement",
    category: "demande",
    description: "Demander le remboursement d'un achat, d'un trop-perçu, etc.",
    icon: "💶",
    priceCents: 490,
    fields: [
      { name: "company", label: "Entreprise / organisme", type: "text", placeholder: "Nom de l'entreprise ou administration", required: true },
      { name: "purchase_date", label: "Date d'achat / paiement", type: "date", required: true },
      { name: "amount", label: "Montant à rembourser (€)", type: "text", placeholder: "99,90", required: true },
      { name: "reason", label: "Motif du remboursement", type: "select", required: true, options: ["Rétractation (14 jours)", "Produit défectueux", "Service non rendu", "Trop-perçu", "Autre"] },
      { name: "details", label: "Précisions", type: "textarea", placeholder: "Détails supplémentaires sur votre demande...", required: false },
      { name: "reference", label: "Référence commande / dossier", type: "text", placeholder: "N° de commande ou de dossier", required: false },
    ],
  },
];

export function getLetterType(slug: string): LetterType | undefined {
  return letterTypes.find((lt) => lt.slug === slug);
}

export function getLettersByCategory(category: string): LetterType[] {
  return letterTypes.filter((lt) => lt.category === category);
}
