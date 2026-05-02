/**
 * Webhook MailProvider (MySendingBox).
 *
 * Reçoit les événements de cycle de vie d'un mailing après submission :
 *   letter.created / letter.accepted / letter.filing_proof / letter.sent /
 *   letter.in_transit / letter.waiting_to_be_withdrawn / letter.distributed /
 *   letter.delivery_proof / letter.returned_to_sender / letter.wrong_address /
 *   letter.error / letter.canceled
 *
 * Flow :
 *   1. Vérifie l'auth Basic via `provider.verifyWebhookAuth()` (MSB ne signe
 *      pas les webhooks, sécurité via Basic Auth dans l'URL configurée).
 *   2. Parse l'événement en format unifié `MailingEvent` avec extras
 *      (trackingNumber, proofOfDepositUrl, proofOfReceiptUrl).
 *   3. Insert dans `mailing_events` avec idempotence via unique index sur
 *      `provider_event_id` (un même event reçu 2x → 1 seule row).
 *   4. Update `mailings.status`, `last_event_at`, `last_event_status`,
 *      `tracking_number`, `proof_of_deposit_url`, `proof_of_receipt_url`,
 *      `delivered_at` si applicable.
 *   5. Phase 4.4 commit 6 : déclenche l'email Resend correspondant selon
 *      l'eventType (déposé / remis / AR signé / non distribué). Idempotence
 *      garantie par l'unique constraint au point 3 — un retry MSB sort en
 *      "idempotent skip" AVANT d'arriver ici.
 *
 * Configuration côté MSB :
 *   - Dashboard MSB → Paramètres → Webhook
 *   - URL : https://${MSB_WEBHOOK_USER}:${MSB_WEBHOOK_PASS}@justecourrier.fr/api/mailings-webhook
 *   - Variables d'env requises : MSB_WEBHOOK_USER + MSB_WEBHOOK_PASS
 *
 * En cas d'erreur, on retourne 200 dès que possible pour éviter les retries
 * MSB inutiles, sauf auth invalide (401) qui DOIT échouer.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getMailProvider } from "@/lib/mailings/mysendingbox";
import { getLetterType } from "@/config/letter-types";
import {
  sendMailingDepositedEmail,
  sendMailingDeliveredEmail,
  sendMailingReceiptSignedEmail,
  sendMailingFailedEmail,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // MSB envoie un header `Authorization: Basic base64(user:pass)` car la
  // sécurité est configurée via Basic Auth dans l'URL du webhook côté MSB.
  const authHeader = req.headers.get("authorization");

  // ─── 1. Init du provider ────────────────────────────────────────────────
  let provider;
  try {
    provider = getMailProvider();
  } catch (err) {
    console.error("MSB webhook: provider init failed:", err);
    return NextResponse.json(
      { error: "Provider not configured" },
      { status: 500 }
    );
  }

  // ─── 2. Vérifier Basic Auth ──────────────────────────────────────────────
  let authValid = false;
  try {
    authValid = provider.verifyWebhookAuth(authHeader);
  } catch (err) {
    // Le provider throw si MSB_WEBHOOK_USER ou MSB_WEBHOOK_PASS pas configurés
    console.error("MSB webhook: auth verification error:", err);
    return NextResponse.json(
      { error: "Auth verification unavailable" },
      { status: 500 }
    );
  }

  if (!authValid) {
    console.warn("MSB webhook: invalid Basic Auth, rejecting");
    // En-tête WWW-Authenticate pour indiquer le mécanisme attendu côté client
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="mailings-webhook"',
        "Content-Type": "application/json",
      },
    });
  }

  // ─── 3. Parser l'événement ───────────────────────────────────────────────
  let event;
  try {
    const payload = JSON.parse(rawBody);
    event = provider.parseWebhookEvent(payload);
  } catch (err) {
    console.error("MSB webhook: parse failed:", err);
    // 400 mais MSB ne retry pas pour un payload mal formé (perdu pour de bon)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // ─── 4. Récupérer le mailing + lettre associée pour l'envoi des emails ──
  // Join Supabase : on récupère aussi `letters.email` (destinataire de l'email)
  // et `letters.type` (slug pour titre humain). Évite un round-trip DB.
  const { data: mailing, error: findError } = await supabase
    .from("mailings")
    .select(
      `id, status, delivered_at, mode, letter_id, user_id,
       letters!letter_id(email, type)`
    )
    .eq("provider_mailing_id", event.providerMailingId)
    .maybeSingle();

  if (findError) {
    console.error("MSB webhook: mailing lookup failed:", findError);
    // 200 pour éviter retry sur une DB en panne — on log et on regardera
    return NextResponse.json({ received: true, error: "lookup_failed" });
  }

  if (!mailing) {
    // Cas typique : événement reçu pour un mailing qui n'a jamais été
    // soumis depuis cette instance (ex: ancien mailing supprimé, ou test
    // sandbox d'un autre dev). On log + return 200 pour fermer la boucle.
    console.warn(
      `MSB webhook: no mailing found for provider_mailing_id=${event.providerMailingId}, eventType=${event.eventType}`
    );
    return NextResponse.json({ received: true, ignored: "mailing_not_found" });
  }

  // ─── 5. Insert dans mailing_events (idempotent via unique index) ─────────
  const { error: insertError } = await supabase.from("mailing_events").insert({
    mailing_id: mailing.id,
    provider_event_id: event.providerEventId,
    event_type: event.eventType,
    payload: event.rawPayload as Record<string, unknown>,
    occurred_at: event.occurredAt,
  });

  if (insertError) {
    // 23505 = unique_violation : event déjà reçu, c'est le cas "retry MSB"
    // → idempotent skip, on retourne 200 sans toucher au mailing NI envoyer
    // d'email (c'est aussi notre garantie d'idempotence pour les emails).
    if (insertError.code === "23505") {
      console.log(
        `MSB webhook: duplicate event ${event.providerEventId} (mailing ${mailing.id}), idempotent skip`
      );
      return NextResponse.json({ received: true, idempotent: true });
    }
    console.error("MSB webhook: mailing_events insert failed:", insertError);
    // 200 pour ne pas que MSB retry indéfiniment sur une erreur de DB
    return NextResponse.json({ received: true, error: "insert_failed" });
  }

  // ─── 6. Update mailings : status + timestamps + tracking + preuves ──────
  const updates: Record<string, unknown> = {
    status: event.status,
    last_event_at: event.occurredAt,
    last_event_status: event.eventType,
  };

  // Tracking number : présent à partir de letter.sent pour LR/LRAR.
  // On ne l'écrase que si la nouvelle valeur est non vide.
  if (event.trackingNumber) {
    updates.tracking_number = event.trackingNumber;
  }

  // Preuve de dépôt (URL fournie à letter.filing_proof)
  if (event.proofOfDepositUrl) {
    updates.proof_of_deposit_url = event.proofOfDepositUrl;
  }

  // AR signé (URL fournie à letter.delivery_proof)
  if (event.proofOfReceiptUrl) {
    updates.proof_of_receipt_url = event.proofOfReceiptUrl;
  }

  // delivered_at : posé une seule fois (ne pas écraser si déjà rempli par
  // un événement antérieur)
  if (event.status === "delivered" && !mailing.delivered_at) {
    updates.delivered_at = event.occurredAt;
  }

  const { error: updateError } = await supabase
    .from("mailings")
    .update(updates)
    .eq("id", mailing.id);

  if (updateError) {
    console.error(
      `MSB webhook: failed to update mailing ${mailing.id}:`,
      updateError
    );
    // Non-bloquant : l'event est déjà dans mailing_events, on peut rejouer plus tard
  } else {
    console.log(
      `MSB webhook: mailing ${mailing.id} → ${event.status} (${event.eventType})`
    );
  }

  // ─── 7. Notifications email (commit 6) ──────────────────────────────────
  // Fire-and-forget : si un envoi échoue, log + continue. Le webhook répond
  // toujours 200 à MSB pour éviter retries inutiles. L'idempotence est
  // garantie au point 5 (un event en doublon a déjà court-circuité ici).
  await dispatchMailingEmail({
    eventType: event.eventType,
    mailing,
    event,
  });

  return NextResponse.json({ received: true });
}

/**
 * Dispatch l'email Resend approprié selon l'eventType.
 *
 * Mapping (cf. spec Phase 4.4 commit 6 dans project_envoi_postal.md) :
 *   letter.filing_proof       → "Votre courrier est parti" (tous modes)
 *   letter.distributed        → "Votre courrier a été remis" (registered uniquement)
 *   letter.delivery_proof     → "Accusé de réception signé" (registered uniquement)
 *   letter.returned_to_sender → "Courrier non distribué"
 *   letter.wrong_address      → "Courrier non distribué"
 *   autres                    → no-op (created/accepted/sent/in_transit/etc.)
 */
async function dispatchMailingEmail(opts: {
  eventType: string;
  mailing: {
    id: string;
    mode: string | null;
    letters: { email: string | null; type: string } | { email: string | null; type: string }[] | null;
  };
  event: {
    trackingNumber?: string;
    proofOfDepositUrl?: string;
    proofOfReceiptUrl?: string;
  };
}): Promise<void> {
  const { eventType, mailing, event } = opts;

  // Le join Supabase peut renvoyer un tableau ou un objet selon les versions.
  // On normalise pour extraire la lettre liée (1-1 via foreign key).
  const letter = Array.isArray(mailing.letters)
    ? mailing.letters[0]
    : mailing.letters;

  if (!letter?.email) {
    console.warn(
      `MSB webhook: no recipient email for mailing ${mailing.id}, skipping notification`
    );
    return;
  }

  const letterType = getLetterType(letter.type);
  const letterTitle = letterType?.title ?? letter.type.replace(/-/g, " ");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://justecourrier.fr";
  const mailingPageUrl = `${appUrl}/mailings/${mailing.id}`;

  try {
    switch (eventType) {
      case "letter.filing_proof":
        await sendMailingDepositedEmail({
          to: letter.email,
          letterTitle,
          mailingMode: (mailing.mode === "registered" ? "registered" : "simple"),
          trackingNumber: event.trackingNumber,
          proofOfDepositUrl: event.proofOfDepositUrl,
          mailingPageUrl,
        });
        break;

      case "letter.distributed":
        // Lettre verte : pas d'email "remis" (l'utilisateur a déjà reçu
        // l'email "déposé", et MSB ne tracke pas la distribution lettre verte
        // de toute façon — défensif).
        if (mailing.mode === "registered") {
          await sendMailingDeliveredEmail({
            to: letter.email,
            letterTitle,
            mailingMode: "registered",
            mailingPageUrl,
          });
        }
        break;

      case "letter.delivery_proof":
        if (event.proofOfReceiptUrl) {
          await sendMailingReceiptSignedEmail({
            to: letter.email,
            letterTitle,
            proofOfReceiptUrl: event.proofOfReceiptUrl,
            mailingPageUrl,
          });
        } else {
          console.warn(
            `MSB webhook: letter.delivery_proof received without proofOfReceiptUrl for mailing ${mailing.id}`
          );
        }
        break;

      case "letter.returned_to_sender":
      case "letter.wrong_address":
        await sendMailingFailedEmail({
          to: letter.email,
          letterTitle,
          eventType,
          mailingPageUrl,
        });
        break;

      default:
        // Pas d'email pour les autres événements (created, accepted, sent,
        // in_transit, waiting_to_be_withdrawn, lost, error, canceled,
        // return_to_sender_proof, electronic.*).
        break;
    }
  } catch (err) {
    // Log mais ne propage pas — webhook doit toujours répondre 200 à MSB
    console.error(
      `MSB webhook: email send failed for mailing ${mailing.id} (${eventType}):`,
      err
    );
  }
}
