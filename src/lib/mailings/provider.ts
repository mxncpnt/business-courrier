/**
 * Interface MailProvider
 *
 * Abstraction des providers d'envoi postal (MySendingBox au MVP, Merci Facteur
 * en backup documenté). Permet de switcher de provider sans toucher au code
 * applicatif.
 *
 * Toutes les implémentations doivent respecter ce contrat.
 */

import type { MailingMode } from "@/config/mailings";

// ─── Types métier ───

export interface PostalAddress {
  /** Nom du destinataire ou de l'expéditeur */
  name: string;
  /** Ligne 1 obligatoire (n° et rue) */
  addressLine1: string;
  /** Ligne 2 facultative (complément, bâtiment, service) */
  addressLine2?: string;
  /** Code postal */
  zipcode: string;
  /** Ville */
  city: string;
  /** Code pays ISO 3166-1 alpha-2 (FR par défaut) */
  country?: string;
}

export interface AddressValidationResult {
  /** L'adresse est valide et délivrable */
  valid: boolean;
  /** Adresse normalisée par le provider (si différente de l'input) */
  normalized?: PostalAddress;
  /** Raison du refus si invalid */
  reason?: string;
  /** Niveau de confiance fourni par le provider (0-1) si disponible */
  confidence?: number;
}

export interface SubmitMailingInput {
  /** Mode d'envoi (simple, registered) */
  mode: MailingMode;
  /** Adresse de l'expéditeur */
  sender: PostalAddress;
  /** Adresse du destinataire */
  recipient: PostalAddress;
  /** Buffer du PDF principal (courrier) */
  pdfBuffer: Buffer;
  /** Pièces jointes optionnelles (Phase 4.3) */
  attachments?: Array<{ filename: string; buffer: Buffer; mimeType: string }>;
  /**
   * ID interne du mailing JusteCourrier — passé en metadata au provider
   * pour idempotence et corrélation des webhooks.
   */
  internalMailingId: string;
}

export interface SubmitMailingResult {
  /** ID du mailing chez le provider */
  providerMailingId: string;
  /** Numéro de suivi La Poste si déjà disponible */
  trackingNumber?: string;
  /** Coût HT en centimes facturé par le provider (peut différer de l'estimation) */
  costCents: number;
}

export type MailingStatus =
  | "pending"
  | "paid"
  | "submitted"
  | "in_transit"
  | "delivered"
  | "returned"
  | "failed";

export interface MailingStatusResult {
  /** Statut unifié JusteCourrier */
  status: MailingStatus;
  /** Numéro de suivi si disponible */
  trackingNumber?: string;
  /** URL preuve de dépôt (suivie + recommandé) */
  proofOfDepositUrl?: string;
  /** URL AR signé (recommandé uniquement) */
  proofOfReceiptUrl?: string;
  /** Date du dernier événement */
  lastEventAt?: string;
}

export interface MailingEvent {
  /** ID unique de l'événement chez le provider (idempotence) */
  providerEventId: string;
  /** ID du mailing chez le provider */
  providerMailingId: string;
  /** Statut unifié résultant de cet événement */
  status: MailingStatus;
  /** Type d'événement brut côté provider (ex: "letter.distributed") */
  eventType: string;
  /** Date d'occurrence */
  occurredAt: string;
  /** Payload brut pour audit */
  rawPayload: unknown;
  /**
   * Numéro de suivi La Poste, présent dans l'objet letter à partir de
   * `letter.sent` pour les LR/LRAR.
   */
  trackingNumber?: string;
  /**
   * URL de la preuve de dépôt (sous-objet `filing_proof` côté MSB).
   * Renseigné lors de l'événement `letter.filing_proof`.
   */
  proofOfDepositUrl?: string;
  /**
   * URL de l'accusé de réception signé (sous-objet `delivery_proof` côté MSB).
   * Renseigné lors de l'événement `letter.delivery_proof` pour les LRAR.
   */
  proofOfReceiptUrl?: string;
}

// ─── Interface du provider ───

export interface MailProvider {
  /** Nom du provider (pour logs et stockage en DB) */
  readonly name: string;

  /**
   * Valide et normalise une adresse postale.
   * Bloquant avant la submission : si invalide, l'utilisateur doit corriger.
   */
  validateAddress(address: PostalAddress): Promise<AddressValidationResult>;

  /**
   * Soumet un courrier pour impression et envoi.
   * Retourne l'ID provider et le coût réel facturé.
   */
  submitMailing(input: SubmitMailingInput): Promise<SubmitMailingResult>;

  /**
   * Récupère l'état actuel d'un mailing (polling de fallback).
   * En production, on s'appuie surtout sur les webhooks.
   */
  getMailingStatus(providerMailingId: string): Promise<MailingStatusResult>;

  /**
   * Vérifie que la requête webhook entrante est authentifiée par le provider.
   *
   * Mécanisme d'auth dépendant du provider :
   *  - MySendingBox : Basic Auth via header `Authorization: Basic base64(user:pass)`
   *    (config côté MSB via URL `https://user:pass@endpoint/...`)
   *  - D'autres providers (Stripe, GitHub, etc.) utiliseraient HMAC ou Bearer
   *
   * À appeler AVANT tout parsing pour éviter le spoofing.
   *
   * @param authHeader Valeur du header `Authorization` (ou null si absent)
   */
  verifyWebhookAuth(authHeader: string | null): boolean;

  /**
   * Parse un événement webhook en notre format unifié.
   * À appeler après vérification d'auth.
   */
  parseWebhookEvent(rawPayload: unknown): MailingEvent;
}
