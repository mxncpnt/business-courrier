import React from "react";
import { renderToBuffer, Document, Image, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register a standard font for French characters
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

// ─── AFNOR NF Z 11-001 + zone fenêtre MSB ───
// A4 = 210 x 297 mm. Paddings page : 20mm gauche, 15mm droite, 18mm haut/bas.
//
// Zone destinataire MSB (toujours visible enveloppe à fenêtre) :
//   - top 40mm, left 103mm, width 97mm, height 37mm (bornes absolues)
//   - = top 22mm, left 83mm relatifs au headerZone (compense paddings 18/20)
//
// Le bloc destinataire est en `position: absolute` calé sur la zone MSB.
// La date sort de cette zone et part dans le flow normal sous le headerZone,
// alignée à droite (convention AFNOR), pour ne pas consommer de hauteur dans
// la fenêtre. headerZone réserve 65mm minHeight pour laisser passer la zone
// destinataire (22+37=59mm) + 6mm de respiration avant la date.

const mm = (v: number) => `${v}mm`;

const styles = StyleSheet.create({
  page: {
    paddingTop: mm(18),
    paddingBottom: mm(18),
    paddingLeft: mm(20),
    paddingRight: mm(15),
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: "#1a1a1a",
  },

  // Wrapper expéditeur (flow) + zone destinataire (absolute).
  // minHeight 59mm = top zone destinataire (22mm) + height MSB (37mm).
  // Le bottom du headerZone tombe pile sur le bottom de la zone fenêtre
  // (= 77mm absolu). La date suit ensuite dans le flow avec marginTop 5mm.
  headerZone: {
    position: "relative",
    minHeight: mm(59),
  },

  // Zone 1 — Expéditeur (haut gauche)
  sender: {
    marginBottom: 0,
  },
  senderName: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 1,
  },
  senderLine: {
    fontSize: 9,
    color: "#333",
  },
  senderEmail: {
    fontSize: 8,
    color: "#666",
    marginTop: 2,
  },

  // Zone destinataire — calée exactement sur la zone fenêtre MSB
  // (top 40mm, left 103mm, width 97mm, height 37mm en absolu sur la page).
  // En relatif au headerZone (qui hérite des paddings 18/20) :
  //   top : 40 - 18 = 22mm
  //   left : 103 - 20 = 83mm
  //   width : 97mm
  // 97mm de largeur ≈ 61 chars en 9pt / 50 chars en 10pt bold → wrap rare.
  recipientZone: {
    position: "absolute",
    top: mm(22),
    left: mm(83),
    width: mm(97),
  },

  recipient: {
    // pas de marginBottom — la date a été déplacée hors de cette zone.
  },
  recipientName: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 1,
  },
  recipientLine: {
    fontSize: 9,
    color: "#333",
  },

  // Lieu et date — flow normal après le headerZone, alignée verticalement
  // sur le bord gauche de la zone destinataire (x = 103mm absolu, donc
  // marginLeft 83mm relatif au paddingLeft 20mm de la page). marginTop 5mm
  // = 1 ligne d'écart sous la zone fenêtre MSB (qui finit à 77mm absolu).
  // → date à y ≈ 82mm absolu, x ≈ 103mm absolu.
  dateRow: {
    fontSize: 9,
    color: "#333",
    textAlign: "left",
    marginLeft: mm(83),
    marginTop: mm(5),
    marginBottom: mm(5),
  },

  // Objet — 1 ligne d'écart avant et après le bloc
  objectRow: {
    fontSize: 9,
    marginTop: mm(5),
    marginBottom: mm(5),
  },
  objectLabel: {
    textDecoration: "underline",
  },

  // Corps — espacement compacté pour maximiser le contenu sur 1 page
  bodyLine: {
    fontSize: 10,
    marginBottom: 1,
  },
  bodyParagraphGap: {
    marginBottom: 6,
  },

  // Zone signature manuscrite (image PNG/JPG fournie par l'user)
  // Placée APRÈS le nom typé du signataire, alignée à droite. Hauteur fixe
  // pour préserver le rapport h/l de l'image source.
  signatureBlock: {
    marginTop: mm(3),
    marginBottom: mm(2),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureImage: {
    height: mm(22),
    maxWidth: mm(70),
    objectFit: "contain",
  },
  // Style spécifique pour la dernière ligne du corps = nom typé du signataire,
  // aligné à droite (cohérent avec la signature manuscrite juste en-dessous)
  bodyLineSignerName: {
    fontSize: 10,
    marginBottom: 1,
    textAlign: "right",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: mm(10),
    left: mm(20),
    right: mm(15),
    fontSize: 7,
    color: "#999",
    textAlign: "center",
  },
});

interface GeneratePdfParams {
  text: string;
  letterId: string;
  formData?: Record<string, string>;
  letterTitle?: string;
  /**
   * Buffer binaire de la signature manuscrite de l'user (PNG ou JPG).
   * Si fourni, insérée à droite après la formule de politesse détectée
   * (heuristique : ligne contenant "agréer", "salutations distinguées",
   * "cordialement"…). Sinon, à la fin du corps.
   */
  signatureBuffer?: Buffer;
}

/**
 * Index de la dernière ligne non-blank du corps. Convention : c'est le nom
 * typé du signataire (l'IA termine ses courriers par `\n\nNom Prénom`).
 * Aligné à droite par le rendu, et la signature manuscrite est insérée
 * juste après. Retourne -1 si toutes les lignes sont blank.
 */
function findLastNonBlankIndex(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== "") return i;
  }
  return -1;
}

/**
 * Détecte le MIME type d'une image (PNG ou JPG) via ses magic bytes et
 * construit le data URL base64 attendu par `@react-pdf/renderer`.
 *
 * Magic bytes :
 *   - PNG : 89 50 4E 47 (premiers 4 octets)
 *   - JPG : FF D8 FF (premiers 3 octets)
 *
 * Fallback PNG si format inconnu (très improbable car l'upload server-side
 * ne laisse passer que PNG/JPG validés par MIME).
 */
function buildSignatureDataUrl(buffer: Buffer): string {
  const isPng =
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isJpg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const mime = isPng ? "image/png" : isJpg ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function generatePdfBuffer(params: GeneratePdfParams): Promise<Buffer> {
  const { text, letterId, formData, letterTitle, signatureBuffer } = params;

  // ─── Extract structured data from formData ───
  const senderName =
    formData?.sender_firstname && formData?.sender_lastname
      ? `${formData.sender_firstname} ${formData.sender_lastname}`
      : "";
  const senderStreet = formData?.sender_street || "";
  const senderZipCity =
    formData?.sender_zipcode && formData?.sender_city
      ? `${formData.sender_zipcode} ${formData.sender_city}`
      : "";
  const senderEmail = formData?.sender_email || "";

  const recipientName = formData?.recipient_name || "";
  // Adresse destinataire : champs structurés (nouveau) avec fallback sur textarea legacy
  const recipientLine1 = formData?.recipient_address_line1 || "";
  const recipientLine2 = formData?.recipient_address_line2 || "";
  const recipientZipCity =
    formData?.recipient_zipcode && formData?.recipient_city
      ? `${formData.recipient_zipcode} ${formData.recipient_city}`
      : "";
  const recipientAddressLines = recipientLine1
    ? [recipientLine1, recipientLine2, recipientZipCity].filter((l) => l)
    : (formData?.recipient_address || "").split("\n").filter((l) => l.trim());
  const recipientAddress = recipientAddressLines.join("\n");

  const senderCity = formData?.sender_city || "";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const objectText = letterTitle || "";

  // Split body into lines
  const lines = text.split("\n");

  // Build React elements
  const children: React.ReactElement[] = [];

  // ── Wrapper en-tête : sender (flow) + recipient (position absolute) ──
  const headerChildren: React.ReactElement[] = [];

  // Zone 1 — Sender
  if (senderName || senderStreet) {
    const senderChildren: React.ReactElement[] = [];
    if (senderName) {
      senderChildren.push(
        React.createElement(Text, { key: "sn", style: styles.senderName }, senderName)
      );
    }
    if (senderStreet) {
      senderChildren.push(
        React.createElement(Text, { key: "ss", style: styles.senderLine }, senderStreet)
      );
    }
    if (senderZipCity) {
      senderChildren.push(
        React.createElement(Text, { key: "sz", style: styles.senderLine }, senderZipCity)
      );
    }
    if (senderEmail) {
      senderChildren.push(
        React.createElement(Text, { key: "se", style: styles.senderEmail }, senderEmail)
      );
    }
    headerChildren.push(
      React.createElement(View, { key: "sender", style: styles.sender }, ...senderChildren)
    );
  }

  const dateText = senderCity ? `${senderCity}, le ${today}` : `Le ${today}`;

  // Zone destinataire (absolute) — calée sur la fenêtre MSB
  if (recipientName) {
    const recipientChildren: React.ReactElement[] = [];
    recipientChildren.push(
      React.createElement(Text, { key: "rn", style: styles.recipientName }, recipientName)
    );
    if (recipientAddress) {
      const addrLines = recipientAddress.split("\n");
      addrLines.forEach((line, i) => {
        recipientChildren.push(
          React.createElement(Text, { key: `ra-${i}`, style: styles.recipientLine }, line)
        );
      });
    }
    headerChildren.push(
      React.createElement(
        View,
        { key: "recipient-zone", style: styles.recipientZone },
        React.createElement(View, { key: "recipient", style: styles.recipient }, ...recipientChildren)
      )
    );
  }

  // Push wrapper en-tête : minHeight 59mm = bottom du headerZone tombe pile
  // sur le bottom de la zone fenêtre MSB (77mm absolu). La date suit en
  // flow avec marginTop 5mm + marginLeft 83mm → atterrit à (x=103mm,
  // y=82mm absolu), 5mm sous la fenêtre, alignée sur le bord gauche de la
  // zone destinataire.
  if (headerChildren.length > 0) {
    children.push(
      React.createElement(
        View,
        { key: "header-zone", style: styles.headerZone },
        ...headerChildren
      )
    );
  }

  // Date — sous la zone fenêtre, alignée sur l'axe vertical du destinataire
  children.push(
    React.createElement(Text, { key: "date", style: styles.dateRow }, dateText)
  );

  // Object
  if (objectText) {
    children.push(
      React.createElement(
        Text,
        { key: "object", style: styles.objectRow },
        React.createElement(Text, { style: styles.objectLabel }, "Objet"),
        ` : ${objectText}`
      )
    );
  }

  // Body — render each line.
  // Convention française : le nom typé du signataire est typiquement sur la
  // DERNIÈRE ligne non-blank du corps (l'IA termine par `\n\nNom Prénom`).
  // On l'aligne à droite et on place la signature manuscrite juste en-dessous.
  //
  // `data:image/{type};base64,...` requis par @react-pdf/renderer pour les
  // buffers. Détection PNG/JPG via magic bytes (sinon rejet silencieux).
  const signatureDataUrl = signatureBuffer
    ? buildSignatureDataUrl(signatureBuffer)
    : null;
  const lastNonBlankIdx = findLastNonBlankIndex(lines);

  lines.forEach((line, i) => {
    const isBlank = line.trim() === "";
    const isSignerName = !isBlank && i === lastNonBlankIdx;
    const lineStyle = isBlank
      ? styles.bodyParagraphGap
      : isSignerName
        ? styles.bodyLineSignerName
        : styles.bodyLine;

    children.push(
      React.createElement(
        Text,
        { key: `body-${i}`, style: lineStyle },
        isBlank ? " " : line
      )
    );
  });

  // Signature manuscrite après le nom typé, alignée à droite.
  if (signatureDataUrl) {
    children.push(
      React.createElement(
        View,
        { key: "signature-block", style: styles.signatureBlock },
        React.createElement(Image, {
          src: signatureDataUrl,
          style: styles.signatureImage,
        })
      )
    );
  }

  const doc = React.createElement(
    Document,
    { title: `Courrier — ${objectText || "JusteCourrier"}`, author: "JusteCourrier" },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      ...children,
      // Footer
      React.createElement(
        Text,
        { style: styles.footer, fixed: true },
        `Document généré par JusteCourrier — Réf. ${letterId.substring(0, 8)}`
      )
    )
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
