import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./brand-tokens.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Courrier IA — Votre courrier personnalisé en 2 minutes",
  description:
    "Générez un courrier administratif ou juridique personnalisé (résiliation, mise en demeure, réclamation, contestation) grâce à l'IA. PDF prêt à envoyer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
