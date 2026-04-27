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
  popular?: boolean;
  duration: string;
  useCases: string[];
  fields: FormField[];
}

export const categories = [
  { slug: "resiliation", label: "Résiliation", icon: "✂️", description: "Mettre fin à un contrat ou un abonnement." },
  { slug: "contestation", label: "Contestation", icon: "⚖️", description: "Faire valoir vos droits face à une décision." },
  { slug: "reclamation", label: "Réclamation", icon: "📢", description: "Obtenir réparation après un service défaillant." },
  { slug: "mise-en-demeure", label: "Mise en demeure", icon: "⚠️", description: "Exiger un paiement ou une exécution sous peine de poursuites." },
  { slug: "demande", label: "Demande", icon: "📋", description: "Solliciter un remboursement ou un droit." },
] as const;

// Champs destinataire (affichés dans l'étape 1 « Contexte »)
// Structurés pour permettre l'envoi physique et la validation d'adresse via API
export const recipientFields: FormField[] = [
  { name: "recipient_name", label: "Nom du destinataire", type: "text", placeholder: "Société XYZ / M. Martin", required: true },
  { name: "recipient_address_line1", label: "Adresse (n° et rue)", type: "text", placeholder: "1 avenue des Champs-Élysées", required: true },
  { name: "recipient_address_line2", label: "Complément d'adresse", type: "text", placeholder: "Service client, bâtiment B…", required: false },
  { name: "recipient_zipcode", label: "Code postal", type: "text", placeholder: "75008", required: true },
  { name: "recipient_city", label: "Ville", type: "text", placeholder: "Paris", required: true },
];

// Champs expéditeur (affichés dans l'étape 2 « Coordonnées »)
export const senderFields: FormField[] = [
  { name: "sender_firstname", label: "Prénom", type: "text", placeholder: "Camille", required: true },
  { name: "sender_lastname", label: "Nom", type: "text", placeholder: "Durand", required: true },
  { name: "sender_street", label: "Adresse postale", type: "text", placeholder: "14 rue des Lilas", required: true },
  { name: "sender_zipcode", label: "Code postal", type: "text", placeholder: "75011", required: true },
  { name: "sender_city", label: "Ville", type: "text", placeholder: "Paris", required: true },
  { name: "sender_email", label: "Email pour recevoir ton PDF", type: "email", placeholder: "camille.durand@email.fr", required: true },
];

// Legacy — pour compatibilité (sera supprimé quand toutes les pages migreront)
export const commonFields: FormField[] = [
  ...senderFields,
  ...recipientFields,
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
    popular: true,
    duration: "2 min",
    useCases: [
      "Tu veux mettre fin à un contrat sans engagement ou hors période d'engagement",
      "Tu souhaites invoquer un motif légitime (déménagement, hausse tarifaire…)",
      "Tu veux laisser une trace écrite avec date certaine",
    ],
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
    duration: "3 min",
    useCases: [
      "Tu quittes ton logement et dois informer ton propriétaire dans les règles",
      "Tu veux bénéficier du préavis réduit (zone tendue, mutation, perte d'emploi…)",
      "Tu as besoin d'une lettre de congé formelle avec date certaine",
    ],
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
    popular: true,
    duration: "3 min",
    useCases: [
      "Tu as reçu un PV que tu estimes injustifié (erreur de lieu, de plaque, de signalisation)",
      "Tu n'étais pas le conducteur au moment de l'infraction",
      "Tu veux contester dans le délai légal de 45 jours avec les bons arguments",
    ],
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
    duration: "2 min",
    useCases: [
      "Tu as été prélevé d'un montant que tu n'as pas autorisé ou qui ne correspond pas",
      "Tu constates une double facturation ou un service facturé mais non rendu",
      "Tu veux formaliser ta contestation par écrit pour obtenir un remboursement",
    ],
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
    duration: "4 min",
    useCases: [
      "Tu as reçu une décision de refus ou de suppression de droits que tu juges erronée",
      "Tu veux exercer un recours gracieux avant d'envisager un recours contentieux",
      "Tu as besoin de formaliser tes arguments pour obtenir un réexamen de ton dossier",
    ],
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
    duration: "2 min",
    useCases: [
      "Tu as reçu un produit défectueux, non conforme ou en retard",
      "Le service client ne répond pas ou ne traite pas ta demande",
      "Tu veux escalader ta réclamation par écrit pour obtenir une solution concrète",
    ],
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
    duration: "3 min",
    useCases: [
      "Tu fais face à un retard de traitement anormal de la part d'une administration",
      "Tu constates une erreur de calcul sur tes droits ou tes prestations",
      "Tu veux formaliser ta demande par écrit pour accélérer le traitement de ton dossier",
    ],
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
    duration: "3 min",
    useCases: [
      "Tu es créancier d'une somme impayée (loyer, facture, prêt entre particuliers)",
      "Tu veux formaliser ta demande de paiement avant d'engager des poursuites",
      "Tu as besoin d'un courrier avec valeur juridique pour prouver ta démarche amiable",
    ],
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
    duration: "3 min",
    useCases: [
      "Un prestataire, artisan ou fournisseur ne respecte pas ses engagements contractuels",
      "Tu veux fixer un délai formel avant d'envisager une résolution ou des dommages-intérêts",
      "Tu as besoin d'une trace écrite prouvant que tu as exigé l'exécution de l'obligation",
    ],
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
    duration: "2 min",
    useCases: [
      "Tu as exercé ton droit de rétractation dans les 14 jours et attends ton remboursement",
      "Tu as payé un service ou un produit qui n'a jamais été fourni",
      "Tu constates un trop-perçu ou un prélèvement en trop sur ton compte",
    ],
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

export function getCategoryLabel(categorySlug: string): string {
  return categories.find((c) => c.slug === categorySlug)?.label ?? categorySlug;
}
