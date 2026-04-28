/**
 * Implémentation MySendingBox du MailProvider — Phase 4.2
 *
 * API REST MySendingBox : https://docs.mysendingbox.fr
 * Auth : Basic auth — API key en username, mot de passe vide.
 * Content-Type : multipart/form-data pour la création de courrier.
 *
 * Endpoint vérifié contre la doc et les SDKs officiels (PHP/Python/Java) :
 *   POST /letters         — créer un courrier
 *   GET  /letters/:id     — statut d'un courrier
 *
 * Noms de champs adresse MSB (NE PAS confondre avec d'autres APIs) :
 *   to[name]                 — nom destinataire
 *   to[address_line1]        — rue (ligne 1)
 *   to[address_line2]        — complément (optionnel)
 *   to[address_postalcode]   — code postal (pas zip_code !)
 *   to[address_city]         — ville (pas city !)
 *   to[address_country]      — pays en nom complet ("France")
 *
 * Champ fichier :
 *   source_file      — le PDF (Blob)
 *   source_file_type — "file" (obligatoire quand on envoie un fichier)
 *
 * Couleur : "bw" (noir et blanc) ou "color"
 *
 * Variables d'env :
 *   MSB_API_KEY_TEST     — clé sandbox
 *   MSB_API_KEY_LIVE     — clé production
 *   MSB_MODE             — "test" (défaut) ou "live"
 *   MSB_WEBHOOK_SECRET   — secret HMAC pour valider les webhooks (Phase 4.4)
 */

import { createHmac, timingSafeEqual } from "crypto";
import type { MailingMode } from "@/config/mailings";
import type {
  AddressValidationResult,
  MailingEvent,
  MailingStatus,
  MailingStatusResult,
  MailProvider,
  PostalAddress,
  SubmitMailingInput,
  SubmitMailingResult,
} from "./provider";

// ─── Mapping modes → postage_type MSB ───────────────────────────────────────

// Valeurs postage_type MSB vérifiées via SDKs officiels et doc publique :
//   prioritaire = lettre prioritaire J+1 (notre "simple")
//   lettre_suivi = lettre avec suivi (notre "tracked")
//   lrar = lettre recommandée avec AR (notre "registered")
const MODE_TO_POSTAGE: Record<MailingMode, string> = {
  simple: "prioritaire",
  tracked: "lettre_suivi",
  registered: "lrar",
};

// ─── Mapping statuts MSB → statuts JusteCourrier ────────────────────────────
//
// Le champ `status` de la réponse MSB est un objet { name, event_id, ... }.
// On mappe sur `status.name` (format "letter.<event>") :
//   letter.created          = créé, en attente d'envoi à l'imprimeur
//   letter.waiting_upload   = en attente de fichier
//   letter.in_print         = en cours d'impression
//   letter.print_sent       = envoyé à CORUS (imprimeur La Poste)
//   letter.sent             = déposé en bureau de poste
//   letter.in_transit       = en transit (suivi)
//   letter.delivered        = distribué
//   letter.returned_to_sender = NPAI / refusé / non retiré
//   letter.error            = erreur provider / adresse invalide
//   letter.canceled         = annulé

const MSB_STATUS_MAP: Record<string, MailingStatus> = {
  "letter.created": "submitted",
  "letter.waiting_upload": "submitted",
  "letter.in_print": "submitted",
  "letter.print_sent": "submitted",
  "letter.sent": "in_transit",
  "letter.in_transit": "in_transit",
  "letter.delivered": "delivered",
  "letter.returned_to_sender": "returned",
  "letter.error": "failed",
  "letter.canceled": "failed",
};

// ─── Types internes (réponses MSB) ──────────────────────────────────────────

interface MsbAddress {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_postalcode: string;
  address_city: string;
  address_country: string;
}

// Le prix est un objet décomposé (pas un float simple)
interface MsbPrice {
  pack: string;
  postage: number;
  service: number;
  total: number;
}

// Le statut est un objet (pas une string simple)
interface MsbStatus {
  /** Ex: "letter.created", "letter.sent", "letter.delivered" */
  name: string;
  event_id: string;
  description: string;
  updated_at: string;
}

interface MsbTrackingEvent {
  date: string;
  label: string;
  location?: string;
}

interface MsbLetterResponse {
  /** L'ID MSB est dans `_id`, pas `id` */
  _id: string;
  object: "letter";
  status: MsbStatus;
  postage_type: string;
  color: string;     // "bw" ou "color" (string, pas boolean)
  both_sides: boolean;
  to: MsbAddress;
  from: MsbAddress;
  price: MsbPrice;
  /** Événements de suivi La Poste (lettre suivie / LRAR) */
  tracking_events: MsbTrackingEvent[];
  description?: string;
  created_at: string;
  updated_at?: string;
  send_date?: string;
  expected_delivery_date?: string;
}

interface MsbWebhookPayload {
  _id: string;
  object: "event";
  /** ex: "letter.created", "letter.sent", "letter.delivered" */
  name: string;
  /** Timestamp ISO */
  created_at: string;
  letter: MsbLetterResponse;
}

interface MsbErrorResponse {
  error?: { message?: string; code?: string };
  message?: string;
}

// ─── Classe principale ───────────────────────────────────────────────────────

export class MySendingBoxProvider implements MailProvider {
  readonly name = "mysendingbox";

  private readonly apiKey: string;
  private readonly webhookSecret: string | null;
  private readonly baseUrl = "https://api.mysendingbox.fr";

  constructor(opts?: { apiKey?: string; webhookSecret?: string; mode?: "test" | "live" }) {
    const mode = opts?.mode ?? (process.env.MSB_MODE === "live" ? "live" : "test");
    const apiKey =
      opts?.apiKey ??
      (mode === "live" ? process.env.MSB_API_KEY_LIVE : process.env.MSB_API_KEY_TEST);

    if (!apiKey) {
      throw new Error(
        `MSB_API_KEY_${mode.toUpperCase()} is not set. Cannot init MySendingBoxProvider.`
      );
    }

    // Le webhook secret est optionnel au constructeur : il n'est requis qu'en Phase 4.4.
    // On le stocke null si absent/placeholder, les méthodes concernées throwent explicitement.
    const rawSecret = opts?.webhookSecret ?? process.env.MSB_WEBHOOK_SECRET;
    this.webhookSecret = rawSecret && rawSecret !== "..." ? rawSecret : null;
    this.apiKey = apiKey;
  }

  // ─── Helpers privés ──────────────────────────────────────────────────────

  /** Construit le header Authorization Basic. */
  private authHeader(): string {
    return "Basic " + Buffer.from(this.apiKey + ":").toString("base64");
  }

  /** Appel HTTP authentifié vers l'API MSB. */
  private async msbFetch(path: string, init?: RequestInit): Promise<Response> {
    const headers: HeadersInit = {
      Authorization: this.authHeader(),
      ...(init?.headers ?? {}),
    };
    return fetch(`${this.baseUrl}${path}`, { ...init, headers });
  }

  /** Convertit notre PostalAddress vers les champs MSB (multipart).
   *
   * Noms de champs MSB (vérifiés via SDKs PHP/Python/Java officiels) :
   *   to[address_postalcode] — code postal (pas zip_code !)
   *   to[address_city]       — ville (pas city !)
   *   to[address_country]    — pays en nom complet français
   */
  private appendAddress(
    form: FormData,
    prefix: "to" | "from",
    addr: PostalAddress
  ): void {
    form.append(`${prefix}[name]`, addr.name);
    form.append(`${prefix}[address_line1]`, addr.addressLine1);
    if (addr.addressLine2) form.append(`${prefix}[address_line2]`, addr.addressLine2);
    form.append(`${prefix}[address_postalcode]`, addr.zipcode);
    form.append(`${prefix}[address_city]`, addr.city);
    // MSB attend le nom complet du pays (pas le code ISO)
    const country = addr.country ?? "FR";
    form.append(`${prefix}[address_country]`, country === "FR" ? "France" : country);
  }

  /** Lit et formate le message d'erreur d'une réponse MSB. */
  private async formatError(res: Response, context: string): Promise<string> {
    try {
      const body = (await res.json()) as MsbErrorResponse;
      const msg = body?.error?.message ?? body?.message ?? "erreur inconnue";
      return `MSB ${context} HTTP ${res.status}: ${msg}`;
    } catch {
      return `MSB ${context} HTTP ${res.status}`;
    }
  }

  // ─── Méthode 1 : validateAddress ─────────────────────────────────────────
  //
  // MySendingBox ne fournit pas d'endpoint de validation d'adresse séparé.
  // On effectue une validation locale (champs requis + format code postal FR).
  // La vraie validation d'adresse se produit lors de la soumission (submitMailing) :
  // si l'adresse est invalide, MSB retourne une erreur HTTP 422.
  //
  // Pour une validation pré-paiement plus robuste, on pourrait appeler l'API
  // Hexalign de La Poste (api.laposte.fr) — à envisager en Phase 4.3.

  async validateAddress(address: PostalAddress): Promise<AddressValidationResult> {
    // Champs requis
    if (!address.name?.trim()) {
      return { valid: false, reason: "Le nom du destinataire est obligatoire." };
    }
    if (!address.addressLine1?.trim()) {
      return { valid: false, reason: "La ligne d'adresse 1 est obligatoire." };
    }
    if (!address.zipcode?.trim()) {
      return { valid: false, reason: "Le code postal est obligatoire." };
    }
    if (!address.city?.trim()) {
      return { valid: false, reason: "La ville est obligatoire." };
    }

    // Format code postal France : 5 chiffres
    const country = address.country ?? "FR";
    if (country === "FR" && !/^\d{5}$/.test(address.zipcode.trim())) {
      return {
        valid: false,
        reason: `Code postal invalide : "${address.zipcode}" — format attendu : 5 chiffres (ex: 75002).`,
      };
    }

    // Longueur max MSB : 38 caractères par ligne (contrainte postale AFNOR)
    if (address.addressLine1.length > 38) {
      return {
        valid: false,
        reason: `Ligne d'adresse 1 trop longue (${address.addressLine1.length} caractères, max 38).`,
      };
    }
    if (address.addressLine2 && address.addressLine2.length > 38) {
      return {
        valid: false,
        reason: `Ligne d'adresse 2 trop longue (${address.addressLine2.length} caractères, max 38).`,
      };
    }
    if (address.name.length > 38) {
      return {
        valid: false,
        reason: `Nom trop long (${address.name.length} caractères, max 38).`,
      };
    }

    return { valid: true };
  }

  // ─── Méthode 2 : submitMailing ────────────────────────────────────────────

  async submitMailing(input: SubmitMailingInput): Promise<SubmitMailingResult> {
    const { mode, sender, recipient, pdfBuffer, internalMailingId } = input;

    const form = new FormData();

    this.appendAddress(form, "to", recipient);
    this.appendAddress(form, "from", sender);

    form.append("postage_type", MODE_TO_POSTAGE[mode]);
    // MSB attend "bw" (noir et blanc) ou "color" — pas un booléen
    form.append("color", "bw");
    form.append("both_sides", "false");
    // Description = ID interne pour corrélation (visible dans le dashboard MSB)
    form.append("description", `JC-${internalMailingId}`);

    // PDF principal — champ "source_file" + "source_file_type=file" (obligatoire)
    form.append(
      "source_file",
      new Blob([pdfBuffer], { type: "application/pdf" }),
      "courrier.pdf"
    );
    form.append("source_file_type", "file");

    // Pièces jointes Phase 4.3 (non implémentées ici)
    if (input.attachments && input.attachments.length > 0) {
      console.warn(
        "MSB submitMailing: pièces jointes non encore supportées (Phase 4.3) — ignorées."
      );
    }

    const res = await this.msbFetch("/letters", {
      method: "POST",
      body: form,
      // Note : ne pas setter Content-Type manuellement — fetch le gère pour multipart/form-data
    });

    if (!res.ok) {
      throw new Error(await this.formatError(res, "submitMailing"));
    }

    const data = (await res.json()) as MsbLetterResponse;

    // Numéro de suivi La Poste : présent dans tracking_events pour lettre suivie/LRAR.
    // Pour une lettre simple, tracking_events est vide (normal).
    const lastTracking = data.tracking_events?.[data.tracking_events.length - 1];

    return {
      providerMailingId: data._id,                     // MSB utilise _id, pas id
      trackingNumber: lastTracking?.label ?? undefined, // numéro de suivi si dispo
      // MSB retourne price.total en euros (float). On convertit en centimes entiers.
      costCents: Math.round((data.price?.total ?? 0) * 100),
    };
  }

  // ─── Méthode 3 : getMailingStatus ─────────────────────────────────────────

  async getMailingStatus(providerMailingId: string): Promise<MailingStatusResult> {
    const res = await this.msbFetch(`/letters/${providerMailingId}`);

    if (!res.ok) {
      throw new Error(await this.formatError(res, "getMailingStatus"));
    }

    const data = (await res.json()) as MsbLetterResponse;
    // data.status est un objet { name: "letter.sent", ... }
    const status: MailingStatus = MSB_STATUS_MAP[data.status?.name] ?? "submitted";
    const lastTracking = data.tracking_events?.[data.tracking_events.length - 1];

    return {
      status,
      trackingNumber: lastTracking?.label ?? undefined,
      // Note : MSB fournit les URLs de preuve via webhooks (Phase 4.4),
      // pas systématiquement dans la réponse GET.
    };
  }

  // ─── Méthode 4 : verifyWebhookSignature ───────────────────────────────────
  //
  // MSB signe les webhooks avec HMAC-SHA256(webhookSecret, rawBody).
  // Le résultat est envoyé dans le header "Mysendingbox-Signature" en hexadécimal.
  // À configurer en Phase 4.4 (enregistrement du webhook dans le dashboard MSB).

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.webhookSecret) {
      throw new Error(
        "MSB_WEBHOOK_SECRET non configuré. " +
          "Ajoutez le secret depuis le dashboard MySendingBox (Phase 4.4)."
      );
    }

    const expected = createHmac("sha256", this.webhookSecret)
      .update(payload, "utf8")
      .digest("hex");

    try {
      // timingSafeEqual évite les attaques par timing side-channel
      return timingSafeEqual(
        Buffer.from(signature.toLowerCase(), "hex"),
        Buffer.from(expected, "hex")
      );
    } catch {
      // Buffer.from lance si la chaîne hex est invalide ou de longueur différente
      return false;
    }
  }

  // ─── Méthode 5 : parseWebhookEvent ────────────────────────────────────────

  parseWebhookEvent(rawPayload: unknown): MailingEvent {
    const payload = rawPayload as MsbWebhookPayload;

    // Structure réelle du webhook MSB (vérifiée via réponse sandbox) :
    //   payload._id         — ID de l'événement
    //   payload.name        — ex: "letter.created", "letter.sent"
    //   payload.created_at  — timestamp ISO de l'événement
    //   payload.letter._id  — ID de la lettre
    //   payload.letter.status.name — statut courant
    if (!payload?._id || !payload?.letter?._id) {
      throw new Error(
        `MSB parseWebhookEvent: payload invalide — champs "_id" ou "letter._id" manquants. ` +
          `Payload reçu : ${JSON.stringify(payload)}`
      );
    }

    const letterObj = payload.letter;
    const status: MailingStatus = MSB_STATUS_MAP[payload.name] ?? "submitted";

    return {
      providerEventId: payload._id,
      providerMailingId: letterObj._id,
      status,
      eventType: payload.name ?? "unknown",
      occurredAt: payload.created_at ?? letterObj.updated_at ?? new Date().toISOString(),
      rawPayload,
    };
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Retourne le provider configuré selon les variables d'env.
 * À utiliser dans les server actions et webhook handlers.
 */
export function getMailProvider(): MySendingBoxProvider {
  return new MySendingBoxProvider();
}
