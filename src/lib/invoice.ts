import { createServiceClient } from "@/lib/supabase/server";
import { formatInvoiceNumber } from "@/config/business";
import { isTestEnv } from "@/lib/env-mode";

interface CreateInvoiceParams {
  letterId: string;
  paymentId: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerAddress?: string;
  description: string;
  amountCents: number;
  stripePaymentIntentId?: string;
  paidAt: string;
}

export async function createInvoice(params: CreateInvoiceParams) {
  const supabase = createServiceClient();

  const year = new Date(params.paidAt).getFullYear();

  // Obtenir le prochain numéro de séquence (atomique via la fonction SQL)
  const { data: seqData, error: seqError } = await supabase.rpc(
    "next_invoice_sequence",
    { target_year: year }
  );

  if (seqError) {
    throw new Error(`Failed to get invoice sequence: ${seqError.message}`);
  }

  const sequence = seqData as number;
  const invoiceNumber = formatInvoiceNumber(year, sequence);

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      year,
      sequence,
      letter_id: params.letterId,
      payment_id: params.paymentId,
      user_id: params.userId ?? null,
      customer_email: params.customerEmail,
      customer_name: params.customerName,
      customer_address: params.customerAddress ?? null,
      description: params.description,
      amount_cents: params.amountCents,
      stripe_payment_intent_id: params.stripePaymentIntentId ?? null,
      paid_at: params.paidAt,
      is_test: isTestEnv(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }

  return data;
}
