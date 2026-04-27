import React from "react";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { business } from "@/config/business";

// ─── Register fonts matching the Sage design system ───
// Newsreader for display/titles, Inter can't be embedded easily so we use Helvetica as body fallback
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

const mm = (v: number) => `${v}mm`;

// ─── Sage brand tokens (hardcoded for PDF) ───
const jc = {
  primary: "#13314F",
  accent: "#C9722D",
  ink: "#0F2235",
  inkSoft: "#34465A",
  inkMuted: "#6B7785",
  bg: "#FAF8F4",
  surface: "#F2EFE8",
  line: "#E4DFD4",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: mm(18),
    paddingBottom: mm(22),
    paddingLeft: mm(20),
    paddingRight: mm(20),
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: jc.ink,
    backgroundColor: "#FFFFFF",
  },

  // ─── Header ───
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: mm(8),
    borderBottomWidth: 2,
    borderBottomColor: jc.primary,
    marginBottom: mm(10),
  },
  brandName: {
    fontSize: 20,
    fontWeight: "bold",
    color: jc.primary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  brandSubline: {
    fontSize: 7.5,
    color: jc.inkMuted,
    marginBottom: 1,
  },
  invoiceTitleBlock: {
    alignItems: "flex-end",
  },
  invoiceLabel: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 2,
    color: jc.accent,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: jc.primary,
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 8.5,
    color: jc.inkMuted,
  },

  // ─── Parties ───
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: mm(10),
  },
  partyBlock: {
    width: "46%",
    padding: mm(4),
    backgroundColor: jc.bg,
    borderRadius: 4,
  },
  partyLabel: {
    fontSize: 6.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: jc.accent,
    marginBottom: 5,
  },
  partyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: jc.ink,
    marginBottom: 2,
  },
  partyLine: {
    fontSize: 8.5,
    color: jc.inkSoft,
    lineHeight: 1.4,
  },

  // ─── Tableau ───
  tableHeader: {
    flexDirection: "row",
    backgroundColor: jc.primary,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 1,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: jc.line,
  },
  colDescription: { width: "52%" },
  colQty: { width: "12%", textAlign: "center" },
  colUnitPrice: { width: "18%", textAlign: "right" },
  colTotal: { width: "18%", textAlign: "right" },
  cellText: { fontSize: 9, color: jc.ink },
  cellBold: { fontSize: 9, fontWeight: "bold", color: jc.ink },

  // ─── Total ───
  totalBlock: {
    marginTop: mm(5),
    alignSelf: "flex-end",
    width: "42%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  totalLabel: {
    fontSize: 8.5,
    color: jc.inkMuted,
  },
  totalValue: {
    fontSize: 8.5,
    color: jc.ink,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 6,
    backgroundColor: jc.primary,
    borderRadius: 3,
    marginTop: 3,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  totalFinalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // ─── Mentions légales ───
  mentionsBlock: {
    position: "absolute",
    bottom: mm(18),
    left: mm(20),
    right: mm(20),
  },
  vatBadge: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: jc.accent,
    backgroundColor: jc.bg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  mentionSeparator: {
    borderTopWidth: 1,
    borderTopColor: jc.line,
    paddingTop: 8,
  },
  mentionLine: {
    fontSize: 7,
    color: jc.inkMuted,
    lineHeight: 1.5,
    marginBottom: 1,
  },
  footerBrand: {
    fontSize: 7,
    color: jc.inkMuted,
    marginTop: 6,
    textAlign: "center",
  },
});

export interface InvoicePdfData {
  invoiceNumber: string;
  year: number;
  sequence: number;
  paidAt: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  description: string;
  amountCents: number;
  stripePaymentIntentId?: string;
}

export async function generateInvoicePdfBuffer(
  data: InvoicePdfData
): Promise<Buffer> {
  const {
    invoiceNumber,
    paidAt,
    customerName,
    customerEmail,
    customerAddress,
    description,
    amountCents,
  } = data;

  const amountEur = (amountCents / 100).toFixed(2);
  const dateStr = new Date(paidAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const biz = business;
  const addressLine = biz.address.street;
  const cityLine =
    biz.address.zipCode && biz.address.city
      ? `${biz.address.zipCode} ${biz.address.city}`
      : "";

  const doc = React.createElement(
    Document,
    { title: `Facture ${invoiceNumber}`, author: biz.tradeName },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },

      // ─── Header with brand line ───
      React.createElement(
        View,
        { style: styles.headerRow },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brandName }, biz.tradeName),
          React.createElement(
            Text,
            { style: styles.brandSubline },
            `${biz.name} · ${biz.legalForm}`
          ),
          React.createElement(
            Text,
            { style: styles.brandSubline },
            `SIRET : ${biz.siret}`
          ),
          React.createElement(Text, { style: styles.brandSubline }, addressLine),
          cityLine
            ? React.createElement(Text, { style: styles.brandSubline }, cityLine)
            : null,
          React.createElement(Text, { style: styles.brandSubline }, biz.email)
        ),
        React.createElement(
          View,
          { style: styles.invoiceTitleBlock },
          React.createElement(Text, { style: styles.invoiceLabel }, "FACTURE"),
          React.createElement(
            Text,
            { style: styles.invoiceNumber },
            invoiceNumber
          ),
          React.createElement(Text, { style: styles.invoiceDate }, dateStr)
        )
      ),

      // ─── Vendeur / Client ───
      React.createElement(
        View,
        { style: styles.partiesRow },
        React.createElement(
          View,
          { style: styles.partyBlock },
          React.createElement(Text, { style: styles.partyLabel }, "Vendeur"),
          React.createElement(Text, { style: styles.partyName }, biz.tradeName),
          React.createElement(Text, { style: styles.partyLine }, biz.name),
          React.createElement(Text, { style: styles.partyLine }, addressLine),
          cityLine
            ? React.createElement(Text, { style: styles.partyLine }, cityLine)
            : null
        ),
        React.createElement(
          View,
          { style: styles.partyBlock },
          React.createElement(Text, { style: styles.partyLabel }, "Client"),
          React.createElement(Text, { style: styles.partyName }, customerName),
          React.createElement(Text, { style: styles.partyLine }, customerEmail),
          customerAddress
            ? React.createElement(
                Text,
                { style: styles.partyLine },
                customerAddress
              )
            : null
        )
      ),

      // ─── Table header ───
      React.createElement(
        View,
        { style: styles.tableHeader },
        React.createElement(
          Text,
          { style: { ...styles.tableHeaderText, ...styles.colDescription } },
          "Description"
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableHeaderText, ...styles.colQty } },
          "Qté"
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableHeaderText, ...styles.colUnitPrice } },
          "Prix unitaire"
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableHeaderText, ...styles.colTotal } },
          "Total"
        )
      ),

      // ─── Table row ───
      React.createElement(
        View,
        { style: styles.tableRow },
        React.createElement(
          Text,
          { style: { ...styles.cellText, ...styles.colDescription } },
          description
        ),
        React.createElement(
          Text,
          { style: { ...styles.cellText, ...styles.colQty } },
          "1"
        ),
        React.createElement(
          Text,
          { style: { ...styles.cellText, ...styles.colUnitPrice } },
          `${amountEur} ${biz.currencySymbol}`
        ),
        React.createElement(
          Text,
          { style: { ...styles.cellBold, ...styles.colTotal } },
          `${amountEur} ${biz.currencySymbol}`
        )
      ),

      // ─── Totaux ───
      React.createElement(
        View,
        { style: styles.totalBlock },
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, "Total HT"),
          React.createElement(
            Text,
            { style: styles.totalValue },
            `${amountEur} ${biz.currencySymbol}`
          )
        ),
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, "TVA"),
          React.createElement(
            Text,
            { style: styles.totalValue },
            "Non applicable"
          )
        ),
        React.createElement(
          View,
          { style: styles.totalFinalRow },
          React.createElement(
            Text,
            { style: styles.totalFinalLabel },
            "Total TTC"
          ),
          React.createElement(
            Text,
            { style: styles.totalFinalValue },
            `${amountEur} ${biz.currencySymbol}`
          )
        )
      ),

      // ─── Mentions légales ───
      React.createElement(
        View,
        { style: styles.mentionsBlock },
        React.createElement(
          Text,
          { style: styles.vatBadge },
          biz.vatMention
        ),
        React.createElement(
          View,
          { style: styles.mentionSeparator },
          React.createElement(
            Text,
            { style: styles.mentionLine },
            `Conditions de règlement : ${biz.paymentTerms}`
          ),
          React.createElement(
            Text,
            { style: styles.mentionLine },
            `En cas de retard de paiement : ${biz.latePenaltyRate}`
          ),
          React.createElement(
            Text,
            { style: styles.mentionLine },
            `Indemnité forfaitaire de recouvrement : ${biz.recoveryIndemnity}`
          )
        ),
        React.createElement(
          Text,
          { style: styles.footerBrand },
          `${biz.tradeName} · ${biz.name} · ${biz.legalForm} · SIRET : ${biz.siret} · ${biz.website}`
        )
      )
    )
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
