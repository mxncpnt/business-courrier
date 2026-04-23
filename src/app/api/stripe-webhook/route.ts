import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
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

    // Update letter status
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

    // Insert payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      letter_id: letterId,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      amount_cents: session.amount_total ?? 490,
      status: "succeeded",
    });

    if (paymentError) {
      console.error("Failed to insert payment:", paymentError);
    }

    console.log(`Payment succeeded for letter ${letterId}`);
  }

  return NextResponse.json({ received: true });
}
