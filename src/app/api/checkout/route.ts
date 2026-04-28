import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { getLetterType } from "@/config/letter-types";

export async function POST(req: NextRequest) {
  const { letterId } = await req.json();

  if (!letterId) {
    return NextResponse.json({ error: "Missing letterId" }, { status: 400 });
  }

  // Fetch the letter to get details
  const supabase = createServiceClient();
  const { data: letter, error } = await supabase
    .from("letters")
    .select("id, type, email")
    .eq("id", letterId)
    .single();

  if (error || !letter) {
    return NextResponse.json({ error: "Letter not found" }, { status: 404 });
  }

  // Lecture dynamique du prix depuis la config (3,90€ par défaut, modifiable par type)
  const letterType = getLetterType(letter.type);
  const unitAmount = letterType?.priceCents ?? 390;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Create Stripe Checkout session
  // Phase 4.3 ajoutera un 2e line_item conditionnel pour l'envoi physique (mailing).
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: letter.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: unitAmount,
          product_data: {
            name: "Courrier personnalisé",
            description: `Type : ${letter.type.replace(/-/g, " ")}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      letter_id: letter.id,
    },
    success_url: `${appUrl}/paiement/succes?letter_id=${letter.id}`,
    cancel_url: `${appUrl}/preview/${letter.id}`,
  });

  return NextResponse.json({ url: session.url });
}
