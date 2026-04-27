import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";
import { getLetterType } from "@/config/letter-types";
import { createInvoice } from "@/lib/invoice";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const letterId = session.metadata?.letter_id;

    if (!letterId) {
      console.error("No letter_id in session metadata");
      return NextResponse.json({ error: "No letter_id" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 1. Marquer le courrier comme payé
    const { error: letterError } = await supabase
      .from("letters")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", letterId);

    if (letterError) {
      console.error("Failed to update letter:", letterError);
      return NextResponse.json(
        { error: "DB update failed" },
        { status: 500 }
      );
    }

    // 2. Enregistrer le paiement
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    const amountCents = session.amount_total ?? 490;

    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        letter_id: letterId,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        amount_cents: amountCents,
        status: "succeeded",
      })
      .select("id")
      .single();

    if (paymentError) {
      console.error("Failed to insert payment:", paymentError);
      // Non-bloquant : on continue même si l'enregistrement du paiement échoue
    }

    // 3. Récupérer les infos du courrier pour l'email et la facture
    const { data: letter, error: fetchError } = await supabase
      .from("letters")
      .select("email, type, user_id, form_data")
      .eq("id", letterId)
      .single();

    if (fetchError || !letter) {
      console.error("Failed to fetch letter for email:", fetchError);
      // Non-bloquant : le paiement est confirmé, l'email est secondaire
    } else {
      // 4. Créer la facture
      const letterType = getLetterType(letter.type);
      const letterTitle = letterType?.title ?? letter.type.replace(/-/g, " ");

      if (paymentData?.id) {
        const formData = (letter.form_data ?? {}) as Record<string, string>;
        const customerName =
          formData.sender_firstname && formData.sender_lastname
            ? `${formData.sender_firstname} ${formData.sender_lastname}`
            : letter.email;

        try {
          await createInvoice({
            letterId,
            paymentId: paymentData.id,
            userId: letter.user_id ?? undefined,
            customerEmail: letter.email,
            customerName,
            description: `Courrier — ${letterTitle}`,
            amountCents,
            stripePaymentIntentId: paymentIntentId ?? undefined,
            paidAt: new Date().toISOString(),
          });
          console.log(`Invoice created for letter ${letterId}`);
        } catch (invoiceError) {
          console.error("Failed to create invoice:", invoiceError);
          // Non-bloquant : la facture peut être régénérée manuellement
        }
      }

      // 5. Envoyer l'email de confirmation
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";
      const downloadUrl = `${appUrl}/api/download/${letterId}`;

      try {
        await sendConfirmationEmail({
          to: letter.email,
          letterTitle,
          letterId,
          downloadUrl,
        });
        console.log(`Confirmation email sent to ${letter.email} for letter ${letterId}`);
      } catch (emailError) {
        // Non-bloquant : on log l'erreur mais on ne fait pas échouer le webhook.
        // Stripe réessaierait le webhook, ce qui redéclencherait un double email.
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    console.log(`Payment succeeded for letter ${letterId}`);
  }

  // Toujours retourner 200 à Stripe — sinon il réessaie le webhook
  return NextResponse.json({ received: true });
}
