import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Tu es un expert en rédaction de courriers administratifs et juridiques français.
Tu rédiges des courriers professionnels, clairs, et conformes aux usages français.

Règles :
- Format lettre française standard (expéditeur en haut à gauche, destinataire en haut à droite, lieu et date, objet, corps, formule de politesse, signature)
- Ton professionnel mais accessible
- Utilise le vouvoiement systématiquement
- Cite les articles de loi pertinents quand c'est applicable
- Inclus les références (numéro de contrat, de dossier, etc.) fournies par l'utilisateur
- Ne mets JAMAIS de crochets ou de texte à remplir — tout doit être personnalisé avec les données fournies
- Termine toujours par une formule de politesse appropriée
- Réponds UNIQUEMENT avec le texte du courrier, sans commentaire, sans explication avant ou après`;

interface GenerateLetterParams {
  type: string;
  title: string;
  formData: Record<string, string>;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
}

export async function generateLetter(params: GenerateLetterParams): Promise<string> {
  const {
    type,
    title,
    formData,
    senderName,
    senderAddress,
    recipientName,
    recipientAddress,
  } = params;

  const userPrompt = `Rédige un courrier de type "${title}".

Informations de l'expéditeur :
- Nom : ${senderName}
- Adresse : ${senderAddress}

Informations du destinataire :
- Nom : ${recipientName}
- Adresse : ${recipientAddress}

Lieu et date : France, ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}

Détails spécifiques :
${Object.entries(formData)
  .filter(([key]) => !key.startsWith("sender_") && !key.startsWith("recipient_"))
  .map(([key, value]) => `- ${key.replace(/_/g, " ")} : ${value}`)
  .join("\n")}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}
