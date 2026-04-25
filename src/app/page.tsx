import Link from "next/link";
import { categories, letterTypes } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";
import HeroLetter from "@/components/HeroLetter";
import {
  IconArrow,
  IconCheck,
  IconBolt,
  IconShield,
  IconDoc,
} from "@/components/Icons";

// Icônes catalogue par slug
const CAT_ICONS: Record<string, string> = {
  "resiliation-abonnement": "✂",
  "resiliation-bail": "⌂",
  "contestation-amende": "⚖",
  "contestation-facture": "€",
  "contestation-decision": "▣",
  "reclamation-service-client": "✉",
  "reclamation-administration": "▤",
  "mise-en-demeure-payer": "!",
  "mise-en-demeure-executer": "↻",
  "demande-remboursement": "↩",
};

export default async function Home() {
  let user = null;
  try {
    const supabase = await createAuthClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Not logged in
  }

  // 6 premiers courriers pour le preview catalogue
  const previewLetters = letterTypes.slice(0, 6);

  return (
    <div className="min-h-screen bg-jc-bg">
      {/* ─── Nav ─── */}
      <header className="flex items-center justify-between border-b border-jc-line bg-jc-bg px-8 py-[18px]">
        <Link
          href="/"
          className="text-xl font-bold text-jc-ink font-display tracking-tight no-underline"
        >
          JusteCourrier
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#catalogue"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Catalogue
          </a>
          <Link
            href="#"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Guides
          </Link>
          <a
            href="#fonctionnement"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Comment ça marche
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
            >
              Mes courriers
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors hidden sm:inline"
              >
                Se connecter
              </Link>
              <Link
                href="#catalogue"
                className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
              >
                Commencer un courrier
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="px-6 md:px-20 pt-[72px] pb-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-16 items-center">
          {/* Colonne gauche */}
          <div>
            <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
              Service de courrier IA
            </span>
            <h1 className="mt-4 mb-5 text-[56px] leading-[1.05] tracking-[-0.03em] font-display font-bold text-jc-ink max-md:text-[32px] max-md:leading-[1.1]">
              Ton courrier&nbsp;administratif,{" "}
              <span className="text-jc-ink-soft">simple et juste</span>.
            </h1>
            <p className="text-lg leading-relaxed text-jc-ink-soft mb-7 max-w-[520px] max-md:text-base">
              Résiliation, mise en demeure, réclamation, contestation… Réponds à
              quelques questions, notre IA rédige un courrier professionnel
              adapté à ta situation. Tu télécharges le PDF, prêt à envoyer.
            </p>

            <div className="flex gap-3 flex-wrap">
              <a
                href="#catalogue"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
              >
                Choisir un courrier — 4,90 € <IconArrow />
              </a>
              <a
                href="#fonctionnement"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-jc-line-strong text-jc-ink font-medium rounded-jc hover:bg-jc-surface transition-colors text-base no-underline"
              >
                Voir un exemple
              </a>
            </div>

            <div className="flex gap-6 mt-8 flex-wrap text-jc-ink-muted text-[13px]">
              <span className="inline-flex items-center gap-1.5">
                <IconCheck /> Prêt en 2 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck /> Sans abonnement
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck /> Aperçu avant paiement
              </span>
            </div>
          </div>

          {/* Colonne droite — HeroLetter */}
          <div className="hidden md:block">
            <HeroLetter />
          </div>
        </div>
      </section>

      {/* ─── Comment ça marche ─── */}
      <section
        id="fonctionnement"
        className="px-6 md:px-20 py-16 bg-jc-surface border-t border-b border-jc-line"
      >
        <div className="max-w-[1200px] mx-auto">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
            En 3 étapes
          </span>
          <h2 className="mt-3 mb-9 text-4xl font-display font-bold text-jc-ink max-w-[600px] max-md:text-2xl">
            Un tunnel court, conçu pour aller droit au but.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                t: "Choisis ton courrier",
                d: "Sélectionne le type adapté à ta situation. 10+ modèles couvrant les cas les plus fréquents.",
              },
              {
                n: "02",
                t: "Réponds aux questions",
                d: "Un formulaire court, en français clair. Aucune connaissance juridique requise.",
              },
              {
                n: "03",
                t: "Télécharge ton PDF",
                d: "Aperçu avant paiement, puis téléchargement immédiat. Prêt à envoyer en LRAR.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-jc-bg-elev border border-jc-line rounded-jc p-5"
              >
                <span className="block font-display font-bold text-[48px] leading-none text-jc-accent tracking-[-0.02em]">
                  {step.n}
                </span>
                <h3 className="mt-3 mb-2 text-[22px] leading-[1.25] font-display font-bold text-jc-ink">
                  {step.t}
                </h3>
                <p className="text-sm text-jc-ink-soft">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Catalogue preview ─── */}
      <section id="catalogue" className="px-6 md:px-20 py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-7 flex-wrap gap-3">
            <div>
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
                Catalogue
              </span>
              <h2 className="mt-3 text-4xl font-display font-bold text-jc-ink max-md:text-2xl">
                Tous les courriers les plus demandés.
              </h2>
            </div>
            <Link
              href="#catalogue"
              className="inline-flex items-center gap-2 px-5 py-3 border border-jc-line-strong text-jc-ink font-medium rounded-jc hover:bg-jc-surface transition-colors text-sm no-underline"
            >
              Voir le catalogue complet <IconArrow />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {previewLetters.map((letter) => (
              <Link
                key={letter.slug}
                href={`/courrier/${letter.slug}`}
                className="flex items-start gap-3.5 p-[18px] border border-jc-line rounded-jc bg-jc-bg-elev no-underline hover:border-jc-primary hover:-translate-y-px transition-all"
              >
                {/* Icône */}
                <span className="w-[38px] h-[38px] rounded-jc-sm bg-jc-accent-soft text-jc-accent flex items-center justify-center shrink-0 text-lg font-display">
                  {CAT_ICONS[letter.slug] || letter.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 mb-1">
                    <h4 className="text-[15px] font-semibold text-jc-ink leading-snug">
                      {letter.title}
                    </h4>
                    <span className="text-[13px] font-medium text-jc-ink tabular-nums shrink-0">
                      {(letter.priceCents / 100).toFixed(2)}&nbsp;€
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.4] text-jc-ink-soft">
                    {letter.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust band ─── */}
      <section className="px-6 md:px-20 py-16 bg-jc-bg-elev border-t border-jc-line">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <IconBolt />,
              t: "Rédigé en 2 minutes",
              d: "Notre IA structure ta lettre selon les codes de la correspondance administrative française.",
            },
            {
              icon: <IconShield />,
              t: "Vérifié avant paiement",
              d: "Tu vois un aperçu complet de ton courrier. Si ça ne convient pas, tu ne paies rien.",
            },
            {
              icon: <IconDoc />,
              t: "PDF prêt à envoyer",
              d: "Format A4, mise en page AFNOR. Imprime-le, signe-le, envoie-le en recommandé.",
            },
          ].map((item) => (
            <div key={item.t}>
              <div className="text-jc-accent mb-3">{item.icon}</div>
              <h4 className="text-[17px] leading-[1.3] font-display font-bold text-jc-ink mb-1.5">
                {item.t}
              </h4>
              <p className="text-sm text-jc-ink-soft">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA band ─── */}
      <section className="px-6 md:px-20 py-20 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-4xl font-display font-bold text-jc-ink mb-3.5 max-md:text-2xl">
            Tu as une démarche à faire ?
          </h2>
          <p className="text-[17px] text-jc-ink-soft mb-7 max-md:text-[15px]">
            4,90 € le courrier. Pas d&apos;abonnement, pas de surprise.
          </p>
          <a
            href="#catalogue"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
          >
            Commencer maintenant <IconArrow />
          </a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-jc-line px-8 pt-12 pb-7 text-[13px] text-jc-ink-muted">
        <div className="max-w-[1200px] mx-auto">
          {/* Grille 4 colonnes */}
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 pb-8">
            {/* Col 1 — Logo + description */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-bold text-jc-ink font-display tracking-tight">
                JusteCourrier
              </span>
              <p className="mt-3.5 max-w-[280px] text-jc-ink-muted">
                Le courrier administratif simple, transparent et juste. Pas
                d&apos;abonnement, pas de piège.
              </p>
            </div>

            {/* Col 2 — Service */}
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Service
              </h5>
              <div className="flex flex-col gap-1">
                <a
                  href="#catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Catalogue
                </a>
                <Link
                  href="#"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Guides juridiques
                </Link>
                <a
                  href="#catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Tarifs
                </a>
              </div>
            </div>

            {/* Col 3 — Société */}
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h5>
              <div className="flex flex-col gap-1">
                <Link
                  href="/mentions-legales"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Mentions légales
                </Link>
                <Link
                  href="/cgv"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  CGV
                </Link>
                <Link
                  href="/confidentialite"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Confidentialité
                </Link>
              </div>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h5>
              <div className="flex flex-col gap-1">
                <span className="text-jc-ink-soft py-1">
                  contact@justecourrier.fr
                </span>
                <span className="text-jc-ink-soft py-1">Aide &amp; FAQ</span>
              </div>
            </div>
          </div>

          {/* Barre basse */}
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>
              © {new Date().getFullYear()} JusteCourrier · SIRET en cours
            </span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
