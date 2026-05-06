// Génère 2 PDFs (cas standard + cas-limite) pour vérifier que le bloc
// destinataire reste dans la zone fenêtre MSB :
//   - zone MSB stricte : top 40mm, left 103mm, width 97mm, height 37mm
//   - notre zone applicative : top 45mm, left 108mm, width 92mm, height 32mm
//     (5mm de marge interne sur bord gauche + bord haut)
//   - bornes effectives destinataire : x ∈ [108, 200], y ∈ [45, 77]
//
// La mesure de position se fait dans un script Python séparé (pdfminer.six)
// pour éviter d'ajouter pdfjs-dist en dépendance Node.

import { generatePdfBuffer } from "../src/lib/pdf";
import { writeFileSync } from "node:fs";

interface TestCase {
  name: string;
  formData: Record<string, string>;
}

const cases: TestCase[] = [
  {
    name: "standard",
    formData: {
      sender_firstname: "Maxence",
      sender_lastname: "Pinta",
      sender_street: "3 Rue Jean Giono",
      sender_zipcode: "34170",
      sender_city: "Castelnau-le-Lez",
      sender_email: "maxence@example.com",
      recipient_name: "Service Client",
      recipient_address_line1: "10 rue de la Paix",
      recipient_zipcode: "75002",
      recipient_city: "Paris",
    },
  },
  {
    name: "edge",
    formData: {
      sender_firstname: "Maxence",
      sender_lastname: "Pinta",
      sender_street: "3 Rue Jean Giono",
      sender_zipcode: "34170",
      sender_city: "Castelnau-le-Lez",
      sender_email: "maxence@example.com",
      recipient_name: "Service Recouvrement Contentieux DGFIP Hauts-de-France",
      recipient_address_line1:
        "Centre des Finances Publiques de Lille-Métropole Nord",
      recipient_address_line2:
        "Bâtiment B - Service Particuliers - 4ème étage",
      recipient_zipcode: "59044",
      recipient_city: "Villeneuve-d'Ascq Cedex",
    },
  },
];

async function main() {
  for (const c of cases) {
    const buf = await generatePdfBuffer({
      text:
        "Madame, Monsieur,\n\n" +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n" +
        "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n" +
        "Maxence Pinta",
      letterId: "test-zone-msb-12345",
      formData: c.formData,
      letterTitle: "Test zone destinataire MSB",
    });
    // Sortie dans le dossier Cowork (visible par Claude via le mount + le user
    // peut l'ouvrir d'un double-clic depuis Finder)
    const out = `/Users/max/Documents/Cowork/Business-courrier/test-zone-msb-${c.name}.pdf`;
    writeFileSync(out, buf);
    console.log(`OK ${c.name} -> ${out}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
