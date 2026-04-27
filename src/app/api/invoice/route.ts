import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { generateInvoicePdfBuffer } from "@/lib/invoice-pdf";

export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get("id");

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoice id" }, { status: 400 });
  }

  // Vérifier l'authentification
  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupérer la facture (service client pour bypass RLS, on vérifie le user_id manuellement)
  const supabase = createServiceClient();
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Vérifier que la facture appartient à l'utilisateur
  if (invoice.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Générer le PDF
  const pdfBuffer = await generateInvoicePdfBuffer({
    invoiceNumber: invoice.invoice_number,
    year: invoice.year,
    sequence: invoice.sequence,
    paidAt: invoice.paid_at,
    customerName: invoice.customer_name,
    customerEmail: invoice.customer_email,
    customerAddress: invoice.customer_address ?? undefined,
    description: invoice.description,
    amountCents: invoice.amount_cents,
    stripePaymentIntentId: invoice.stripe_payment_intent_id ?? undefined,
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${invoice.invoice_number}.pdf"`,
    },
  });
}
