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

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  line: {
    marginBottom: 2,
  },
  paragraph: {
    marginBottom: 12,
  },
  spacer: {
    marginBottom: 24,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

interface GeneratePdfParams {
  text: string;
  letterId: string;
}

export async function generatePdfBuffer(params: GeneratePdfParams): Promise<Buffer> {
  const { text, letterId } = params;

  // Split text into paragraphs (double newline = paragraph, single = line)
  const paragraphs = text.split(/\n\n+/);

  const doc = React.createElement(
    Document,
    { title: "Courrier personnalisé", author: "Courrier IA" },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Content
      ...paragraphs.map((paragraph, pIdx) =>
        React.createElement(
          View,
          { key: `p-${pIdx}`, style: styles.paragraph },
          ...paragraph.split("\n").map((line, lIdx) =>
            React.createElement(
              Text,
              { key: `l-${pIdx}-${lIdx}`, style: styles.line },
              line
            )
          )
        )
      ),
      // Footer
      React.createElement(
        Text,
        { style: styles.footer, fixed: true },
        `Document généré par Courrier IA — Réf. ${letterId.substring(0, 8)}`
      )
    )
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
