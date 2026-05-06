import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { getLetterType } from "@/config/letter-types";
import { MAILING_MODES, type MailingMode } from "@/config/mailings";
import { isTestEnv } from "@/lib/env-mode";
import type { PostalAddress } from "@/lib/mailings/provider";
import type { AttachmentInfo } from "@/app/preview/[id]/actions";

interface CheckoutRequestBody {
  letterId: string;
  mailingMode?: MailingMode;
  senderAddress?: PostalAddress;
  recipientAddress?: PostalAddress;
  attachments?: AttachmentInfo[];
}

function isValidAddress(addr?: PostalAddress): addr is PostalAddress {
  return !!(
    addr &&
    addr.name?.trim() &&
    addr.addressLine1?.trim() &&
    addr.zipcode?.trim() &&
    addr.city?.trim()
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutRequestBody;
  const { letterId, mailingMode, senderAddress, recipientAddress, attachments } =
    body;

  if (!letterId) {
    return NextResponse.json({ error: "Missing letterId" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch the letter
  const { data: letter, error: letterError } = await supabase
    .from("letters")
    .select("id, type, email, user_id")
    .eq("id", letterId)
    .single();

  if (letterError || !letter) {
    return NextResponse.json({ error: "Letter not found" }, { status: 404 });
  }

  // Lecture dynamique du prix depuis la config
  const letterType = getLetterType(letter.type);
  const letterPriceCents = letterType?.priceCents ?? 390;

  // Récupérer le user authentifié pour user_id du mailing
  let userId: string | null = letter.user_id ?? null;
  try {
    const authClient = await createAuthClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (user) userId = user.id;
  } catch {
    // anonyme OK
  }

  // ─── Préparer les line_items Stripe ──────────────────────────────────────
  const lineItems: Array<{
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; description?: string };
    };
    quantity: number;
  }> = [
    {
      price_data: {
        currency: "eur",
        unit_amount: letterPriceCents,
        product_data: {
          name: "Courrier personnalisé",
          description: `Type : ${letter.type.replace(/-/g, " ")}`,
        },
      },
      quantity: 1,
    },
  ];

  // ─── Si mailingMode défini : créer le mailings row + 2e line_item ────────
  let mailingId: string | null = null;

  if (mailingMode) {
    // Validation des adresses (sécurité côté serveur)
    if (!isValidAddress(senderAddress)) {
      return NextResponse.json(
        { error: "Adresse expéditeur incomplète" },
        { status: 400 }
      );
    }
    if (!isValidAddress(recipientAddress)) {
      return NextResponse.json(
        { error: "Adresse destinataire incomplète" },
        { status: 400 }
      );
    }

    const config = MAILING_MODES[mailingMode];
    if (!config) {
      return NextResponse.json(
        { error: `Mode d'envoi inconnu : ${mailingMode}` },
        { status: 400 }
      );
    }

    const costCents = config.costCentsEstimate;
    const markupCents = config.markupCentsEstimate;
    const totalCents = costCents + markupCents;

    // Sanitize attachments (empêche injection de paths arbitraires)
    const safeAttachments = (attachments ?? [])
      .filter((a) => a.storagePath?.startsWith(`${letterId}/`))
      .map((a) => ({
        name: a.name,
        storage_path: a.storagePath,
        size_bytes: a.sizeBytes,
        mime_type: a.mimeType,
      }));

    // Si un mailing pending existe déjà pour cette letter (= checkout
    // initié plusieurs fois — double-clic, retour navigateur, session
    // Stripe abandonnée), on le supprime avant d'en créer un nouveau.
    // Évite l'orphelin qui faisait disparaître le bouton "Confirmer et
    // envoyer" sur /preview/[id] (bug observé prod 2026-05-06).
    await supabase
      .from("mailings")
      .delete()
      .eq("letter_id", letterId)
      .eq("status", "pending")
      .is("stripe_checkout_session_id", null);

    // Créer le mailings row en pending
    const { data: mailing, error: mailingError } = await supabase
      .from("mailings")
      .insert({
        letter_id: letterId,
        user_id: userId,
        mode: mailingMode,
        provider: "mysendingbox",
        // Snapshot expéditeur
        sender_name: senderAddress.name,
        sender_address_line1: senderAddress.addressLine1,
        sender_address_line2: senderAddress.addressLine2 ?? null,
        sender_zipcode: senderAddress.zipcode,
        sender_city: senderAddress.city,
        sender_country: senderAddress.country ?? "FR",
        // Snapshot destinataire
        recipient_name: recipientAddress.name,
        recipient_address_line1: recipientAddress.addressLine1,
        recipient_address_line2: recipientAddress.addressLine2 ?? null,
        recipient_zipcode: recipientAddress.zipcode,
        recipient_city: recipientAddress.city,
        recipient_country: recipientAddress.country ?? "FR",
        recipient_address_validated: true, // déjà validé côté UI via server action
        recipient_address_validated_at: new Date().toISOString(),
        // Tarification snapshot
        cost_cents: costCents,
        markup_cents: markupCents,
        total_cents: totalCents,
        // Statut initial : en attente du paiement Stripe
        status: "pending",
        // Pièces jointes
        attachments: safeAttachments,
        // Tag environnement (test/live) pour filtrage admin
        is_test: isTestEnv(),
      })
      .select("id")
      .single();

    if (mailingError || !mailing) {
      console.error("Mailing insert error:", mailingError);
      return NextResponse.json(
        { error: "Erreur lors de la préparation de l'envoi" },
        { status: 500 }
      );
    }

    mailingId = mailing.id;

    // Ajouter le 2e line_item pour l'envoi
    lineItems.push({
      price_data: {
        currency: "eur",
        unit_amount: totalCents,
        product_data: {
          name: `Affranchissement — ${config.label}`,
          description:
            mailingMode === "registered"
              ? "Lettre recommandée avec accusé de réception (LRAR)"
              : "Lettre verte standard, distribution J+3",
        },
      },
      quantity: 1,
    });
  }

  // ─── Création de la session Stripe ───────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const stripe = getStripe();

  const metadata: Record<string, string> = { letter_id: letter.id };
  if (mailingId) metadata.mailing_id = mailingId;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: letter.email,
    line_items: lineItems,
    metadata,
    success_url: `${appUrl}/paiement/succes?letter_id=${letter.id}`,
    cancel_url: `${appUrl}/preview/${letter.id}`,
  });

  return NextResponse.json({ url: session.url });
}
