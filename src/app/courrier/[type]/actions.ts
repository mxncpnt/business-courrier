"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { generateLetter } from "@/lib/claude";
import { getLetterType } from "@/config/letter-types";

const baseSchema = z.object({
  sender_firstname: z.string().min(1, "Prénom requis"),
  sender_lastname: z.string().min(1, "Nom requis"),
  sender_street: z.string().min(2, "Adresse requise"),
  sender_zipcode: z.string().min(4, "Code postal requis"),
  sender_city: z.string().min(1, "Ville requise"),
  sender_email: z.string().email("Email invalide"),
  recipient_name: z.string().min(2, "Nom du destinataire requis"),
  recipient_address_line1: z.string().min(2, "Adresse du destinataire requise"),
  recipient_address_line2: z.string().optional(),
  recipient_zipcode: z.string().min(4, "Code postal du destinataire requis"),
  recipient_city: z.string().min(1, "Ville du destinataire requise"),
});

export async function submitLetterForm(
  letterTypeSlug: string,
  formData: FormData
) {
  const letterType = getLetterType(letterTypeSlug);
  if (!letterType) {
    throw new Error("Type de courrier inconnu");
  }

  // Extract all form fields
  const rawData: Record<string, string> = {};
  formData.forEach((value, key) => {
    rawData[key] = value.toString();
  });

  // Validate base fields
  const baseResult = baseSchema.safeParse(rawData);
  if (!baseResult.success) {
    return {
      error: baseResult.error.issues.map((e) => e.message).join(", "),
    };
  }

  // Validate required specific fields
  for (const field of letterType.fields) {
    if (field.required && !rawData[field.name]?.trim()) {
      return { error: `Le champ "${field.label}" est requis` };
    }
  }

  // Recombine sender + recipient fields for Claude (backward-compatible format)
  const senderName = `${rawData.sender_firstname} ${rawData.sender_lastname}`;
  const senderAddress = `${rawData.sender_street}\n${rawData.sender_zipcode} ${rawData.sender_city}`;
  const recipientAddressLines = [
    rawData.recipient_address_line1,
    rawData.recipient_address_line2,
    `${rawData.recipient_zipcode} ${rawData.recipient_city}`,
  ].filter((l) => l && l.trim());
  const recipientAddress = recipientAddressLines.join("\n");

  const supabase = createServiceClient();

  // Check if user is logged in (optional auth)
  let userId: string | null = null;
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Not logged in — that's fine, auth is optional
  }

  // Insert letter as draft
  const { data: letter, error: insertError } = await supabase
    .from("letters")
    .insert({
      email: rawData.sender_email,
      type: letterTypeSlug,
      form_data: rawData,
      status: "draft",
      ...(userId ? { user_id: userId } : {}),
    })
    .select("id")
    .single();

  if (insertError || !letter) {
    console.error("Insert error:", insertError);
    return { error: "Erreur lors de la sauvegarde. Réessayez." };
  }

  // Generate letter with Claude
  try {
    const generatedText = await generateLetter({
      type: letterTypeSlug,
      title: letterType.title,
      formData: rawData,
      senderName,
      senderAddress,
      recipientName: rawData.recipient_name,
      recipientAddress,
    });

    // Update letter with generated text.
    // On reset aussi `final_text` à NULL : si l'utilisateur avait édité le
    // texte précédent, il a explicitement déclenché une régénération IA
    // donc son édition antérieure n'a plus de sens. L'affichage retombe sur
    // la nouvelle sortie IA.
    const { error: updateError } = await supabase
      .from("letters")
      .update({ generated_text: generatedText, final_text: null })
      .eq("id", letter.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return { error: "Erreur lors de la sauvegarde du courrier généré." };
    }
  } catch (err) {
    console.error("Claude API error:", err);
    return {
      error: "Erreur lors de la génération du courrier. Vérifiez votre clé API.",
    };
  }

  redirect(`/preview/${letter.id}`);
}
