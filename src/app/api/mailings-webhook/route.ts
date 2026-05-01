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
 *   5. Phase 4.4 commit 6 : déclenche les emails Resend selon le statut.
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

  // ─── 4. Récupérer le mailing concerné via provider_mailing_id ────────────
  const { data: mailing, error: findError } = await supabase
    .from("mailings")
    .select("id, status, delivered_at, mode, letter_id, user_id")
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
    // → idempotent skip, on retourne 200 sans toucher au mailing
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

  // TODO Phase 4.4 commit 6 : déclencher email Resend selon event.status
  // (delivered → email "Courrier distribué", returned → email "Non distribué")

  return NextResponse.json({ received: true });
}
