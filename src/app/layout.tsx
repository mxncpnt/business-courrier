import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
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
    "Résiliation, mise en demeure, réclamation, contestation… Remplis un formulaire, notre IA rédige un courrier professionnel adapté à ta situation. PDF prêt à envoyer, 4,90 €.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "JusteCourrier",
    title: "JusteCourrier — Ton courrier administratif, simple et juste",
    description:
      "Résiliation, mise en demeure, réclamation, contestation… Remplis un formulaire, notre IA rédige un courrier professionnel adapté à ta situation. PDF prêt à envoyer, 4,90 €.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JusteCourrier — Ton courrier administratif, simple et juste",
    description:
      "Résiliation, mise en demeure, réclamation, contestation… Remplis un formulaire, notre IA rédige un courrier professionnel adapté à ta situation. PDF prêt à envoyer, 4,90 €.",
  },
  alternates: {
    canonical: APP_URL,
  },
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
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--jc-font-body)", backgroundColor: "var(--jc-bg)", color: "var(--jc-ink)" }}>{children}</body>
    </html>
  );
}
