/**
 * Implémentation MySendingBox du MailProvider
 *
 * SKELETON Phase 4.1 — toutes les méthodes throw "not_implemented".
 * Implémentation réelle en Phase 4.2 contre la sandbox MSB.
 *
 * Configuration (à mettre dans .env.local et Vercel) :
 * - MSB_API_KEY_TEST     : clé API sandbox
 * - MSB_API_KEY_LIVE     : clé API production
 * - MSB_MODE             : 'test' ou 'live' (défaut: 'test' en dev/staging)
 * - MSB_WEBHOOK_SECRET   : secret pour valider la signature des webhooks
 *
 * Documentation MSB : https://www.mysendingbox.fr/api-courrier/
 */

import type {
  AddressValidationResult,
  MailProvider,
  MailingEvent,
  MailingStatusResult,
  PostalAddress,
  SubmitMailingInput,
  SubmitMailingResult,
} from "./provider";

const NOT_IMPLEMENTED = "MySendingBoxProvider: not implemented (Phase 4.2)";

export class MySendingBoxProvider implements MailProvider {
  readonly name = "mysendingbox";

  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly baseUrl = "https://api.mysendingbox.fr";

  constructor(opts?: { apiKey?: string; webhookSecret?: string; mode?: "test" | "live" }) {
    const mode = opts?.mode ?? (process.env.MSB_MODE === "live" ? "live" : "test");
    const apiKey =
      opts?.apiKey ??
      (mode === "live" ? process.env.MSB_API_KEY_LIVE : process.env.MSB_API_KEY_TEST);
    const webhookSecret = opts?.webhookSecret ?? process.env.MSB_WEBHOOK_SECRET;

    if (!apiKey) {
      throw new Error(
        `MSB_API_KEY_${mode.toUpperCase()} is not set. Cannot init MySendingBoxProvider.`
      );
    }
    if (!webhookSecret) {
      throw new Error("MSB_WEBHOOK_SECRET is not set. Cannot init MySendingBoxProvider.");
    }

    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateAddress(_address: PostalAddress): Promise<AddressValidationResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async submitMailing(_input: SubmitMailingInput): Promise<SubmitMailingResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMailingStatus(_providerMailingId: string): Promise<MailingStatusResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyWebhookSignature(_payload: string, _signature: string): boolean {
    throw new Error(NOT_IMPLEMENTED);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parseWebhookEvent(_rawPayload: unknown): MailingEvent {
    throw new Error(NOT_IMPLEMENTED);
  }
}

/**
 * Factory : retourne le provider courant configuré.
 * À utiliser dans toutes les server actions / webhook handlers.
 *
 * En Phase 4.1, on ne peut pas instancier le provider sans clés.
 * L'appelant doit gérer l'absence de configuration.
 */
export function getMailProvider(): MailProvider {
  return new MySendingBoxProvider();
}
