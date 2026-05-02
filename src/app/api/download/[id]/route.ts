import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generatePdfBuffer } from "@/lib/pdf";
import { getLetterType } from "@/config/letter-types";
import { mergePdfWithAttachments, type DbAttachment } from "@/lib/mailings/merge";
import { getDisplayText } from "@/lib/letters/text";

/**
 * Sert le PDF du courrier après paiement.
 *
 * Cohérence "PDF téléchargé = PDF posté à La Poste" (option A, validée
 * 2026-04-28) :
 *   - Si la letter a un mailing avec des pièces jointes, on retourne le PDF
 *     mergé (courrier AFNOR + PJ) — strictement identique à ce qui est posté
 *     côté MSB. Preuve juridique pour l'utilisateur.
 *   - Sinon (mode PDF only ou mailing sans PJ), on retourne le courrier seul.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  // Fetch the letter
  const { data: letter, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !letter) {
    return NextResponse.json({ error: "Letter not found" }, { status: 404 });
  }

  // Check payment status
  if (letter.status !== "paid" && letter.status !== "delivered") {
    return NextResponse.json(
      { error: "Payment required" },
      { status: 402 }
    );
  }

  // Utilise le helper centralisé : final_text (édition user) si défini,
  // sinon generated_text (sortie IA). Cf. lib/letters/text.ts.
  const text = getDisplayText(letter);
  if (!text) {
    return NextResponse.json(
      { error: "No content available" },
      { status: 404 }
    );
  }

  // Génération du PDF principal (norme AFNOR)
  const letterType = getLetterType(letter.type);
  const pdfBuffer = await generatePdfBuffer({
    text,
    letterId: letter.id,
    formData: letter.form_data as Record<string, string> | undefined,
    letterTitle: letterType?.title,
  });

  // Si un mailing existe pour cette letter avec des PJ, on merge.
  // Le mailing peut être en pending/paid/submitted/in_transit/delivered/returned.
  // On accepte tous les statuts sauf 'failed' (où la submission a échoué)
  // pour rester cohérent avec ce que MSB a (ou aurait) reçu.
  const { data: mailing } = await supabase
    .from("mailings")
    .select("status, attachments")
    .eq("letter_id", letter.id)
    .neq("status", "failed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const attachments = ((mailing?.attachments ?? []) as DbAttachment[]).filter(
    (a) => a && a.storage_path
  );

  const finalPdf =
    attachments.length > 0
      ? await mergePdfWithAttachments(pdfBuffer, attachments, supabase)
      : pdfBuffer;

  // Filename : suffixe -avec-pj si mergé
  const suffix = attachments.length > 0 ? "-avec-pj" : "";
  const filename = `courrier-${letter.type}-${letter.id.substring(0, 8)}${suffix}.pdf`;

  return new NextResponse(new Uint8Array(finalPdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
