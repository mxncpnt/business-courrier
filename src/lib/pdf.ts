import React from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register a standard font for French characters
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

// ─── AFNOR NF Z 11-001 layout ───
// A4 = 210 x 297 mm. Marges 20mm gauche, 15mm droite, 18mm haut/bas.
//
// Zone fenêtre enveloppe DL standard :
//   - Adresse destinataire visible quand la lettre est pliée en 3
//   - Position : top 45mm depuis bord supérieur de la feuille
//   - Position : left 105mm depuis bord gauche (zone droite, ~50% page)
//   - Largeur : 85mm, max 6 lignes de 38 caractères
//
// Le bloc destinataire est en `position: absolute` pour rester dans la zone
// fenêtre quel que soit le contenu du bloc expéditeur (variable). Un wrapper
// `headerZone` réserve la hauteur correspondante (~80mm) avant que le flow
// reprenne avec date+objet+corps.

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

  // Wrapper pour zones expéditeur (flow) + colonne droite (absolute).
  // Hauteur réduite à ~55mm — l'expéditeur tient sur 4 lignes maxi (sender
  // name + 3 lignes adresse + email = ~25mm), la fenêtre destinataire
  // commence à 27mm dans le wrapper et fait ~22mm (destinataire + date
  // collés à 1 ligne d'écart). Le flow reprend juste après.
  headerZone: {
    position: "relative",
    minHeight: mm(55),
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

  // Colonne droite — destinataire + date (fenêtre enveloppe AFNOR DL)
  // Position : `right: 0` cale le bloc à 65mm du bord droit (largeur 65mm
  // à partir du bord — donc commence à 145mm depuis bord gauche absolu,
  // soit 130mm depuis paddingLeft). top 27mm dans le wrapper = 45mm depuis
  // le bord supérieur de la feuille (centre fenêtre DL).
  rightColumn: {
    position: "absolute",
    top: mm(27),
    right: 0,
    width: mm(65),
  },

  // Zone 4 — Destinataire (dans la colonne droite)
  recipient: {
    marginBottom: mm(5), // 1 ligne d'écart avant la date
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

  // Lieu et date — dans la colonne droite, juste sous le destinataire
  dateRow: {
    fontSize: 9,
    color: "#333",
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
}

export async function generatePdfBuffer(params: GeneratePdfParams): Promise<Buffer> {
  const { text, letterId, formData, letterTitle } = params;

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

  // Colonne droite (absolute) — destinataire + date dans la fenêtre AFNOR
  const dateText = senderCity ? `${senderCity}, le ${today}` : `Le ${today}`;
  const rightColumnChildren: React.ReactElement[] = [];

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
    rightColumnChildren.push(
      React.createElement(View, { key: "recipient", style: styles.recipient }, ...recipientChildren)
    );
  }

  rightColumnChildren.push(
    React.createElement(Text, { key: "date", style: styles.dateRow }, dateText)
  );

  headerChildren.push(
    React.createElement(
      View,
      { key: "right-column", style: styles.rightColumn },
      ...rightColumnChildren
    )
  );

  // Push wrapper en-tête : la zone réserve ~55mm de hauteur (expéditeur en
  // flow + colonne droite en absolute). Le flow reprend ensuite avec objet
  // et corps.
  if (headerChildren.length > 0) {
    children.push(
      React.createElement(
        View,
        { key: "header-zone", style: styles.headerZone },
        ...headerChildren
      )
    );
  }

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

  // Body — render each line
  lines.forEach((line, i) => {
    const isBlank = line.trim() === "";
    children.push(
      React.createElement(
        Text,
        {
          key: `body-${i}`,
          style: isBlank ? styles.bodyParagraphGap : styles.bodyLine,
        },
        isBlank ? " " : line
      )
    );
  });

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
