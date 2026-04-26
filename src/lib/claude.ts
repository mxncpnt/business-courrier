import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Tu es un expert en rédaction de courriers administratifs et juridiques français.
Tu rédiges le CORPS d'un courrier professionnel, clair et conforme aux usages français.

IMPORTANT — Tu ne dois PAS inclure dans ta réponse :
- L'adresse de l'expéditeur
- L'adresse du destinataire
- Le lieu et la date
- La ligne "Objet :"
Ces éléments sont gérés automatiquement par le système de mise en page AFNOR.

Ta réponse doit commencer DIRECTEMENT par la formule d'appel (ex: "Madame, Monsieur,") et se terminer par la formule de politesse suivie du nom complet de l'expéditeur sur une ligne séparée.

Règles :
- Ton professionnel mais accessible
- Utilise le vouvoiement systématiquement
- Cite les articles de loi pertinents quand c'est applicable
- Inclus les références (numéro de contrat, de dossier, etc.) fournies par l'utilisateur
- Ne mets JAMAIS de crochets ou de texte à remplir — tout doit être personnalisé avec les données fournies
- Ne mets PAS de marqueurs markdown (pas de ** ou de ##)
- Termine toujours par une formule de politesse appropriée puis le nom complet de l'expéditeur
- Réponds UNIQUEMENT avec le corps du courrier, sans commentaire, sans explication avant ou après`;

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
    title,
    formData,
    senderName,
    senderAddress,
    recipientName,
    recipientAddress,
  } = params;

  const userPrompt = `Rédige le corps d'un courrier de type "${title}".

Informations de l'expéditeur (pour contexte, NE PAS inclure dans le courrier) :
- Nom : ${senderName}
- Adresse : ${senderAddress}

Informations du destinataire (pour contexte, NE PAS inclure dans le courrier) :
- Nom : ${recipientName}
- Adresse : ${recipientAddress}

Date du courrier : ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}

Détails spécifiques :
${Object.entries(formData)
  .filter(([key]) => !key.startsWith("sender_") && !key.startsWith("recipient_"))
  .map(([key, value]) => `- ${key.replace(/_/g, " ")} : ${value}`)
  .join("\n")}

RAPPEL : Commence directement par "Madame, Monsieur," (ou formule d'appel adaptée). Ne mets PAS les adresses, la date ou l'objet — ils sont gérés par la mise en page automatique. Termine par le nom "${senderName}" après la formule de politesse.`;

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
