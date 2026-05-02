/**
 * Cron — traitement des mailings en attente de confirmation utilisateur.
 *
 * Édition A2 (2026-05-02) : depuis le découplage paiement / submission, le
 * mailing reste en `paid` après paiement Stripe. L'utilisateur peut éditer
 * son texte puis cliquer "Confirmer et envoyer" sur `/preview/[id]`. Si pas
 * d'action, ce cron prend le relais :
 *
 *   - À T+12h : email rappel "Confirmez l'envoi" (idempotent via colonne
 *     `mailings.reminder_sent_at`)
 *   - À T+24h : auto-submit MSB (passage à `submitted`)
 *
 * Fréquence d'exécution : configurée dans `vercel.json`. Idéal toutes les
 * heures (Vercel Pro), acceptable une fois par jour (Vercel Hobby).
 *
 * Sécurité : Vercel Cron envoie un header `Authorization: Bearer ${CRON_SECRET}`
 * à condition que `CRON_SECRET` soit défini dans les env vars. On rejette
 * les requêtes sans ce header (401).
 *
 * Méthode : Vercel Cron utilise GET. On accepte les 2 (POST utile pour test
 * manuel via curl).
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { submitMailingToProvider } from "@/lib/mailings/submit";
import { sendMailingPendingConfirmEmail } from "@/lib/email";
import { getLetterType } from "@/config/letter-types";

// Délais en heures
const REMINDER_AFTER_HOURS = 12;
const AUTO_SUBMIT_AFTER_HOURS = 24;

interface CronResult {
  ok: boolean;
  remindersSent: number;
  autoSubmitted: number;
  errors: number;
  details: string[];
}

async function handleCron(req: NextRequest): Promise<NextResponse> {
  // ─── 1. Auth via CRON_SECRET ────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET not configured — rejecting cron call");
    return NextResponse.json(
      { error: "Cron not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const result: CronResult = {
    ok: true,
    remindersSent: 0,
    autoSubmitted: 0,
    errors: 0,
    details: [],
  };

  // ─── 2. Récupérer tous les mailings en `paid` ───────────────────────────
  // On joint la letter (email destinataire pour notif + type pour titre)
  const { data: pending, error: fetchError } = await supabase
    .from("mailings")
    .select(
      `id, letter_id, paid_at, reminder_sent_at,
       letters!letter_id(email, type)`
    )
    .eq("status", "paid");

  if (fetchError) {
    console.error("Cron: fetch failed", fetchError);
    return NextResponse.json(
      { error: "DB fetch failed", details: fetchError.message },
      { status: 500 }
    );
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({ ...result, message: "no pending mailings" });
  }

  const now = Date.now();
  const reminderThreshold = now - REMINDER_AFTER_HOURS * 3600 * 1000;
  const submitThreshold = now - AUTO_SUBMIT_AFTER_HOURS * 3600 * 1000;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://justecourrier.fr";

  // ─── 3. Traiter chaque mailing ──────────────────────────────────────────
  for (const m of pending) {
    if (!m.paid_at) {
      // Cas anormal : status=paid mais paid_at NULL. On skip pour ne pas crasher.
      result.details.push(`mailing ${m.id}: status=paid but paid_at NULL, skip`);
      continue;
    }

    const paidAtMs = new Date(m.paid_at).getTime();

    // Letter associée — extraite via le join Supabase (peut être tableau)
    const letter = Array.isArray(m.letters) ? m.letters[0] : m.letters;
    const letterType = letter?.type ? getLetterType(letter.type) : undefined;
    const letterTitle =
      letterType?.title ?? letter?.type?.replace(/-/g, " ") ?? "Courrier";

    // ── 3a. Auto-submit si > 24h ──
    if (paidAtMs < submitThreshold) {
      try {
        await submitMailingToProvider(m.id);
        result.autoSubmitted++;
        result.details.push(`mailing ${m.id}: auto-submitted (>24h)`);
      } catch (err) {
        result.errors++;
        result.details.push(
          `mailing ${m.id}: auto-submit FAILED — ${err instanceof Error ? err.message : String(err)}`
        );
      }
      continue;
    }

    // ── 3b. Rappel email si > 12h et pas encore envoyé ──
    if (paidAtMs < reminderThreshold && !m.reminder_sent_at) {
      if (!letter?.email) {
        result.details.push(
          `mailing ${m.id}: reminder skipped (no recipient email)`
        );
        continue;
      }

      try {
        await sendMailingPendingConfirmEmail({
          to: letter.email,
          letterTitle,
          previewUrl: `${appUrl}/preview/${m.letter_id}`,
        });

        // Marquer le rappel comme envoyé pour idempotence sur les prochains crons
        const { error: updateError } = await supabase
          .from("mailings")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", m.id);

        if (updateError) {
          // Email envoyé mais update KO : on log, le user peut recevoir un
          // 2e rappel au prochain cron. Acceptable au MVP.
          console.error(
            `Cron: mailing ${m.id} reminder sent but reminder_sent_at update failed:`,
            updateError
          );
        }

        result.remindersSent++;
        result.details.push(`mailing ${m.id}: reminder sent (>12h)`);
      } catch (err) {
        result.errors++;
        result.details.push(
          `mailing ${m.id}: reminder FAILED — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }

  if (result.errors > 0) {
    result.ok = false;
  }

  console.log(
    `Cron process-pending-mailings: ${result.autoSubmitted} submitted, ${result.remindersSent} reminders, ${result.errors} errors`
  );

  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}
