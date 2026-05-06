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
 *   MSB_WEBHOOK_USER     — username Basic Auth pour les webhooks entrants (Phase 4.4)
 *   MSB_WEBHOOK_PASS     — password Basic Auth pour les webhooks entrants (Phase 4.4)
 *
 * Sécurité webhooks (vérifiée doc MSB 2026-05-01) :
 *   MSB ne signe PAS les webhooks (pas de HMAC). La sécurité repose sur
 *   l'URL configurée côté dashboard avec Basic Auth :
 *     https://${MSB_WEBHOOK_USER}:${MSB_WEBHOOK_PASS}@justecourrier.fr/api/mailings-webhook
 *   Notre endpoint vérifie le header `Authorization: Basic ...`.
 */

import { timingSafeEqual } from "crypto";
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

// Valeurs postage_type MSB vérifiées via réponse d'erreur sandbox 2026-04-28 :
//   Available values : ecopli, verte, prioritaire, lr, lrar,
//                      destineo_esprit_libre_seuil_1, destineo_esprit_libre_seuil_2
//
// Mapping retenu (MVP, 2 niveaux) :
//   verte = lettre verte J+3, neutre carbone (notre "simple")
//   lrar  = lettre recommandée avec AR (notre "registered")
//
// Note : "suivie" était utilisé jusqu'au 2026-04-28 mais MSB l'a retiré
// ("postage_type 'suivie' is no longer available"). On a abandonné le 3e
// niveau "tracked" plutôt que d'utiliser "lr" (recommandé sans AR) trop
// proche en prix du LRAR — décision produit pour clarifier l'UX MVP.
const MODE_TO_POSTAGE: Record<MailingMode, string> = {
  simple: "verte",
  registered: "lrar",
};

// ─── Mapping événements MSB → statuts JusteCourrier ─────────────────────────
//
// Liste exhaustive des événements MSB (vérifiée via dropdown du débogueur
// MSB sandbox 2026-05-02) : papier + électronique (LRE).
//
// Papier (utilisé par notre flow MVP) :
//   letter.created               = créée
//   letter.accepted              = acceptée par le système d'impression
//   letter.filing_proof          = preuve de dépôt disponible (LR/LRAR)
//   letter.sent                  = envoyée (tracking_number dispo si LR/LRAR)
//   letter.in_transit            = tracking event disponible (LR/LRAR)
//   letter.waiting_to_be_withdrawn = en attente au guichet (LR/LRAR)
//   letter.distributed           = reçue par le destinataire (LR/LRAR)
//   letter.delivery_proof        = AR signé reçu (sous-objet delivery_proof)
//   letter.returned_to_sender    = retournée à l'expéditeur (LR/LRAR)
//   letter.return_to_sender_proof = preuve scannée du retour à l'expéditeur
//   letter.wrong_address         = NPAI (si manage_returned_mail: true)
//   letter.lost                  = lettre perdue
//   letter.error                 = erreur (refus Poste, problème impression…)
//   letter.canceled              = annulée
//
// Électronique / LRE (non utilisé au MVP, V2) — mapping defensive pour ne
// pas masquer ces cas en fallback "submitted" :
//   letter.electronic.accepted        = LRE acceptée
//   letter.electronic.sent            = LRE envoyée au destinataire
//   letter.electronic.waiting_download = en attente de téléchargement par destinataire
//   letter.electronic.failed_tracking = échec du tracking LRE
//   letter.electronic.not_distributed = LRE non distribuée
//   letter.electronic.refused         = LRE refusée par destinataire
//   letter.electronic.negligence      = LRE non récupérée (négligence destinataire)
//   letter.electronic.locked          = LRE verrouillée

const MSB_STATUS_MAP: Record<string, MailingStatus> = {
  // ── Papier ──
  "letter.created": "submitted",
  "letter.accepted": "submitted",
  "letter.filing_proof": "in_transit", // preuve dépôt → la lettre est physiquement à La Poste
  "letter.sent": "in_transit",
  "letter.in_transit": "in_transit",
  "letter.waiting_to_be_withdrawn": "in_transit",
  "letter.distributed": "delivered",
  "letter.delivery_proof": "delivered", // AR signé → distribué
  "letter.returned_to_sender": "returned",
  "letter.return_to_sender_proof": "returned", // preuve du retour
  "letter.wrong_address": "returned",
  "letter.lost": "failed",
  "letter.error": "failed",
  "letter.canceled": "failed",
  // ── Électronique / LRE (V2 defensive mapping) ──
  "letter.electronic.accepted": "submitted",
  "letter.electronic.sent": "in_transit",
  "letter.electronic.waiting_download": "in_transit",
  "letter.electronic.failed_tracking": "failed",
  "letter.electronic.not_distributed": "returned",
  "letter.electronic.refused": "returned",
  "letter.electronic.negligence": "returned",
  "letter.electronic.locked": "failed",
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

/**
 * Structure réelle d'un webhook MSB (vérifiée doc 2026-05-01) :
 *   { created_at, event: { _id, name, letter (id), category, ... }, letter: { _id, ... } }
 *
 * `event.name` contient le type d'événement (ex: "letter.distributed").
 * `letter` contient la version complète de l'objet letter, avec :
 *   - tracking_number (présent à partir de letter.sent pour LR/LRAR)
 *   - filing_proof (présent à partir de letter.filing_proof — sous-objet avec file.url)
 *   - delivery_proof (présent à partir de letter.delivery_proof — sous-objet avec file.url)
 */
interface MsbWebhookEvent {
  _id: string;
  name: string;
  category: string;
  description?: string;
  letter: string;
  created_at: string;
  updated_at?: string;
  webhook_failed?: boolean;
  webhook_called?: boolean;
}

/**
 * Sous-objet preuve (filing_proof ou delivery_proof) côté MSB.
 * Structure réelle vérifiée via débogueur 2026-05-02 :
 *   { url, _id, source, letter, type, path, originalname, ... }
 * L'URL est directement sur le sous-objet (pas dans un sous-sous-objet `file`).
 */
interface MsbProof {
  url?: string;
  _id?: string;
  source?: string;
  type?: string;
  path?: string;
  originalname?: string;
}

interface MsbLetterWithExtras extends MsbLetterResponse {
  tracking_number?: string;
  filing_proof?: MsbProof;
  delivery_proof?: MsbProof;
  events?: Array<{ _id: string; name: string; created_at: string }>;
}

interface MsbWebhookPayload {
  created_at: string;
  event: MsbWebhookEvent;
  letter: MsbLetterWithExtras;
  /** Présent à `true` quand l'event vient du débogueur du dashboard MSB. */
  debugger?: boolean;
}

interface MsbErrorResponse {
  error?: { message?: string; code?: string };
  message?: string;
}

// ─── Classe principale ───────────────────────────────────────────────────────

export class MySendingBoxProvider implements MailProvider {
  readonly name = "mysendingbox";

  private readonly apiKey: string;
  private readonly webhookUser: string | null;
  private readonly webhookPass: string | null;
  private readonly baseUrl = "https://api.mysendingbox.fr";

  constructor(opts?: {
    apiKey?: string;
    webhookUser?: string;
    webhookPass?: string;
    mode?: "test" | "live";
  }) {
    const mode = opts?.mode ?? (process.env.MSB_MODE === "live" ? "live" : "test");
    const apiKey =
      opts?.apiKey ??
      (mode === "live" ? process.env.MSB_API_KEY_LIVE : process.env.MSB_API_KEY_TEST);

    if (!apiKey) {
      throw new Error(
        `MSB_API_KEY_${mode.toUpperCase()} is not set. Cannot init MySendingBoxProvider.`
      );
    }

    // Webhook credentials : optionnels au constructeur, requis seulement pour
    // verifyWebhookAuth (qui throw explicitement si absent/placeholder).
    const rawUser = opts?.webhookUser ?? process.env.MSB_WEBHOOK_USER;
    const rawPass = opts?.webhookPass ?? process.env.MSB_WEBHOOK_PASS;
    this.webhookUser = rawUser && rawUser !== "..." ? rawUser : null;
    this.webhookPass = rawPass && rawPass !== "..." ? rawPass : null;
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
    // Impression recto-verso (duplex) — décidé 2026-05-06.
    // Cohérent avec la page blanche d'alignement insérée par lib/mailings/merge.ts
    // pour que les PJ démarrent toujours sur un recto. Économie côté MSB
    // (~2x moins de feuilles) à confirmer sur la facturation réelle.
    form.append("both_sides", "true");
    // Description = ID interne pour corrélation (visible dans le dashboard MSB)
    form.append("description", `JC-${internalMailingId}`);

    // PDF principal — champ "source_file" + "source_file_type=file" (obligatoire)
    // Uint8Array nécessaire : Buffer<ArrayBufferLike> n'est pas directement assignable à BlobPart
    form.append(
      "source_file",
      new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }),
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

  // ─── Méthode 4 : verifyWebhookAuth ────────────────────────────────────────
  //
  // MSB ne signe PAS les webhooks (vérifié doc 2026-05-01). La sécurité repose
  // sur Basic Auth dans l'URL configurée côté dashboard MSB :
  //   https://${MSB_WEBHOOK_USER}:${MSB_WEBHOOK_PASS}@justecourrier.fr/api/mailings-webhook
  //
  // Quand MSB POST sur l'URL, le navigateur/client envoie automatiquement un
  // header `Authorization: Basic base64(user:pass)`. On le compare au tuple
  // attendu côté serveur via `timingSafeEqual` (anti-timing-attack).

  verifyWebhookAuth(authHeader: string | null): boolean {
    if (!this.webhookUser || !this.webhookPass) {
      throw new Error(
        "MSB_WEBHOOK_USER ou MSB_WEBHOOK_PASS non configurés. " +
          "Ajoutez-les dans .env.local et Vercel, et configurez l'URL " +
          "https://${USER}:${PASS}@justecourrier.fr/api/mailings-webhook " +
          "dans le dashboard MySendingBox."
      );
    }

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return false;
    }

    const expected = Buffer.from(`${this.webhookUser}:${this.webhookPass}`).toString("base64");
    const provided = authHeader.slice("Basic ".length).trim();

    // timingSafeEqual exige des buffers de même longueur ; on encode et on compare.
    const expectedBuf = Buffer.from(expected);
    const providedBuf = Buffer.from(provided);
    if (expectedBuf.length !== providedBuf.length) return false;

    try {
      return timingSafeEqual(expectedBuf, providedBuf);
    } catch {
      return false;
    }
  }

  // ─── Méthode 5 : parseWebhookEvent ────────────────────────────────────────
  //
  // Structure du payload (vérifiée doc 2026-05-01) :
  //   { created_at, event: { _id, name, letter: id, ... }, letter: { _id, ... } }
  //
  // Extraction des données pertinentes :
  //   - providerEventId   = event._id (idempotence)
  //   - providerMailingId = letter._id
  //   - eventType         = event.name (ex: "letter.distributed")
  //   - status            = mappé via MSB_STATUS_MAP
  //   - trackingNumber    = letter.tracking_number (présent à partir de letter.sent)
  //   - proofOfDepositUrl = letter.filing_proof.url (à letter.filing_proof)
  //   - proofOfReceiptUrl = letter.delivery_proof.url (à letter.delivery_proof)

  parseWebhookEvent(rawPayload: unknown): MailingEvent {
    const payload = rawPayload as MsbWebhookPayload;

    if (!payload?.event?._id || !payload?.letter?._id) {
      throw new Error(
        `MSB parseWebhookEvent: payload invalide — champs "event._id" ou "letter._id" manquants. ` +
          `Payload reçu : ${JSON.stringify(payload).slice(0, 500)}`
      );
    }

    const event = payload.event;
    const letter = payload.letter;
    const status: MailingStatus = MSB_STATUS_MAP[event.name] ?? "submitted";

    return {
      providerEventId: event._id,
      providerMailingId: letter._id,
      status,
      eventType: event.name,
      occurredAt:
        event.created_at ??
        payload.created_at ??
        letter.updated_at ??
        new Date().toISOString(),
      rawPayload,
      trackingNumber: letter.tracking_number ?? undefined,
      // Vrai chemin (vérifié débogueur 2026-05-02) : letter.filing_proof.url
      // (pas letter.filing_proof.file.url comme initialement supposé)
      proofOfDepositUrl: letter.filing_proof?.url,
      proofOfReceiptUrl: letter.delivery_proof?.url,
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
