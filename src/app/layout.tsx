import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./brand-tokens.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const APP_URL = "https://justecourrier.fr";

export const metadata: Metadata = {
  title: {
    default: "JusteCourrier — Ton courrier administratif, simple et juste",
    template: "%s — JusteCourrier",
  },
  description:
    "Résiliation, mise en demeure, réclamation… Notre IA rédige le courrier, on le poste pour toi. PDF 3,90 €, envoi 5,90 € ou recommandé AR 11,90 €.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "JusteCourrier",
    title: "JusteCourrier — Ton courrier administratif, simple et juste",
    description:
      "Résiliation, mise en demeure, réclamation… Notre IA rédige le courrier, on le poste pour toi. PDF 3,90 €, envoi 5,90 € ou recommandé AR 11,90 €.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JusteCourrier — Ton courrier administratif, simple et juste",
    description:
      "Résiliation, mise en demeure, réclamation… Notre IA rédige le courrier, on le poste pour toi. PDF 3,90 €, envoi 5,90 € ou recommandé AR 11,90 €.",
  },
  // ⚠️ Pas de `alternates.canonical` ici : un canonical au niveau du root layout
  // s'applique par défaut à TOUTES les pages enfants qui ne l'overrident pas et
  // les fait toutes pointer vers la home → Google n'indexe que la home et ignore
  // les pages produit/guides comme "duplicates". Chaque page doit définir son
  // propre canonical via `export const metadata` ou `generateMetadata`.
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--jc-font-body)", backgroundColor: "var(--jc-bg)", color: "var(--jc-ink)" }}>
        {children}
        {/* Vercel Web Analytics — mesure le parcours réel des visiteurs
            (pages vues, sources, où ils décrochent). Indispensable pour
            comprendre le funnel entre l'arrivée SEO et la génération de
            lettre, aujourd'hui une boîte noire. */}
        <Analytics />
      </body>
    </html>
  );
}
