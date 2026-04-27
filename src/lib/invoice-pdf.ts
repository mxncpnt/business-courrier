import React from "react";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { business, formatInvoiceNumber } from "@/config/business";

const mm = (v: number) => `${v}mm`;

const colors = {
  primary: "#2563eb",
  ink: "#1a1a1a",
  muted: "#666",
  light: "#f5f5f5",
  line: "#e0e0e0",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: mm(15),
    paddingBottom: mm(20),
    paddingLeft: mm(20),
    paddingRight: mm(20),
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: colors.ink,
  },

  // ─── Header ───
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: mm(12),
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  companyLine: {
    fontSize: 8,
    color: colors.muted,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.ink,
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 10,
    color: colors.muted,
    textAlign: "right",
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 9,
    color: colors.muted,
    textAlign: "right",
    marginTop: 2,
  },

  // ─── Parties ───
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: mm(10),
  },
  partyBlock: {
    width: "48%",
  },
  partyLabel: {
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  partyLine: {
    fontSize: 9,
    color: colors.muted,
  },

  // ─── Tableau ───
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  colDescription: {
    width: "55%",
  },
  colQty: {
    width: "10%",
    textAlign: "center",
  },
  colUnitPrice: {
    width: "17.5%",
    textAlign: "right",
  },
  colTotal: {
    width: "17.5%",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.muted,
  },
  tableCellText: {
    fontSize: 9,
  },
  tableCellBold: {
    fontSize: 9,
    fontWeight: "bold",
  },

  // ─── Total ───
  totalBlock: {
    marginTop: mm(4),
    alignSelf: "flex-end",
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: colors.muted,
  },
  totalValue: {
    fontSize: 9,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    marginTop: 2,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  totalFinalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  // ─── Mentions ───
  mentionsBlock: {
    position: "absolute",
    bottom: mm(20),
    left: mm(20),
    right: mm(20),
  },
  vatMention: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 8,
    fontWeight: "bold",
  },
  mentionLine: {
    fontSize: 7,
    color: colors.muted,
    lineHeight: 1.4,
  },
  mentionSeparator: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    marginTop: 4,
  },
});

export interface InvoicePdfData {
  invoiceNumber: string;
  year: number;
  sequence: number;
  paidAt: string; // ISO date
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

  // ─── Build document ───
  const doc = React.createElement(
    Document,
    { title: `Facture ${invoiceNumber}`, author: biz.tradeName },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },

      // Header row
      React.createElement(
        View,
        { style: styles.headerRow },
        // Left: brand
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brand }, biz.tradeName),
          React.createElement(
            Text,
            { style: styles.companyLine },
            `${biz.name} — ${biz.legalForm}`
          ),
          React.createElement(
            Text,
            { style: styles.companyLine },
            `SIRET : ${biz.siret}`
          ),
          React.createElement(Text, { style: styles.companyLine }, addressLine),
          cityLine
            ? React.createElement(Text, { style: styles.companyLine }, cityLine)
            : null,
          React.createElement(
            Text,
            { style: styles.companyLine },
            biz.email
          )
        ),
        // Right: invoice info
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.invoiceTitle }, "FACTURE"),
          React.createElement(
            Text,
            { style: styles.invoiceNumber },
            `N° ${invoiceNumber}`
          ),
          React.createElement(
            Text,
            { style: styles.invoiceDate },
            `Date : ${dateStr}`
          )
        )
      ),

      // Parties
      React.createElement(
        View,
        { style: styles.partiesRow },
        // Vendeur
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
        // Client
        React.createElement(
          View,
          { style: styles.partyBlock },
          React.createElement(Text, { style: styles.partyLabel }, "Client"),
          React.createElement(
            Text,
            { style: styles.partyName },
            customerName
          ),
          React.createElement(
            Text,
            { style: styles.partyLine },
            customerEmail
          ),
          customerAddress
            ? React.createElement(
                Text,
                { style: styles.partyLine },
                customerAddress
              )
            : null
        )
      ),

      // Table header
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

      // Table row
      React.createElement(
        View,
        { style: styles.tableRow },
        React.createElement(
          Text,
          { style: { ...styles.tableCellText, ...styles.colDescription } },
          description
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableCellText, ...styles.colQty } },
          "1"
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableCellText, ...styles.colUnitPrice } },
          `${amountEur} ${biz.currencySymbol}`
        ),
        React.createElement(
          Text,
          { style: { ...styles.tableCellBold, ...styles.colTotal } },
          `${amountEur} ${biz.currencySymbol}`
        )
      ),

      // Total
      React.createElement(
        View,
        { style: styles.totalBlock },
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(
            Text,
            { style: styles.totalLabel },
            "Total HT"
          ),
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

      // Mentions légales obligatoires
      React.createElement(
        View,
        { style: styles.mentionsBlock },
        React.createElement(
          Text,
          { style: styles.vatMention },
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
            `En cas de retard de paiement, pénalités : ${biz.latePenaltyRate}`
          ),
          React.createElement(
            Text,
            { style: styles.mentionLine },
            `Indemnité forfaitaire pour frais de recouvrement : ${biz.recoveryIndemnity}`
          ),
          React.createElement(
            Text,
            { style: styles.mentionLine },
            `${biz.tradeName} — ${biz.name} — ${biz.legalForm} — SIRET : ${biz.siret}`
          )
        )
      )
    )
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
