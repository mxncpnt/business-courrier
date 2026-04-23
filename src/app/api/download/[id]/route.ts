import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generatePdfBuffer } from "@/lib/pdf";

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

  const text = letter.final_text || letter.generated_text;
  if (!text) {
    return NextResponse.json(
      { error: "No content available" },
      { status: 404 }
    );
  }

  // Generate PDF
  const pdfBuffer = await generatePdfBuffer({
    text,
    letterId: letter.id,
  });

  // Return PDF as download
  const filename = `courrier-${letter.type}-${letter.id.substring(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
