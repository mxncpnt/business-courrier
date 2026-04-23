import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: letter.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: 490,
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
