import Link from "next/link";
import Logo from "@/components/Logo";
import { IconArrow, IconCheck, IconLock } from "@/components/Icons";
import { buildPricingProduct, buildBreadcrumb } from "@/lib/jsonld";

export const metadata = {
  title: "Tarifs",
  description:
    "Trois prix simples, sans abonnement : courrier PDF à 3,90 €, lettre simple postée à 5,90 €, recommandé avec accusé de réception à 11,90 €. Affranchissement refacturé au prix coûtant.",
  alternates: { canonical: "/tarifs" },
};

// JSON-LD via builders centralisés (cf. src/lib/jsonld.ts).
// Migration 2026-05-03 : ItemList → Product + AggregateOffer pour débloquer
// le rich snippet "à partir de 3,90 €" en SERP. shippingDetails et
// hasMerchantReturnPolicy inclus dans le builder.
const pricingProductLd = buildPricingProduct();
const breadcrumbLd = buildBreadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Tarifs", path: "/tarifs" },
]);

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-jc-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingProductLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ─── Nav ─── */}
      <header className="flex items-center justify-between border-b border-jc-line bg-jc-bg px-8 py-[18px]">
        <Link href="/" className="no-underline">
          <Logo size={22} />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/catalogue"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Catalogue
          </Link>
          <Link
            href="/guides"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/#fonctionnement"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Comment ça marche
          </Link>
        </nav>

        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
        >
          Commencer un courrier
        </Link>
      </header>

      {/* ─── Breadcrumb ─── */}
      <div className="px-8 pt-5 max-w-[1100px] mx-auto">
        <nav className="text-[13px] text-jc-ink-muted flex items-center gap-1.5">
          <Link
            href="/"
            className="hover:text-jc-ink transition-colors no-underline"
          >
            Accueil
          </Link>
          <span>›</span>
          <span className="text-jc-ink">Tarifs</span>
        </nav>
      </div>

      {/* ─── Hero ─── */}
      <section className="px-6 md:px-20 pt-12 pb-12 max-w-[1100px] mx-auto">
        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
          Tarifs
        </span>
        <h1 className="mt-3.5 text-[40px] sm:text-[48px] leading-[1.05] tracking-[-0.02em] font-display font-bold text-jc-ink max-md:text-[30px]">
          Trois prix simples.{" "}
          <span className="text-jc-ink-soft">Aucune surprise.</span>
        </h1>
        <p className="mt-4 text-[17px] text-jc-ink-soft max-w-[680px] max-md:text-base">
          Tu choisis ce dont tu as besoin : juste le PDF, ou bien on poste pour
          toi en lettre simple, ou en recommandé avec accusé de réception. Pas
          d&apos;abonnement, pas d&apos;engagement, paiement à l&apos;usage.
        </p>
      </section>

      {/* ─── 3 niveaux — cards ─── */}
      <section className="px-6 md:px-20 pb-16 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 — PDF seul */}
          <div className="bg-jc-bg-elev border border-jc-line rounded-jc-lg p-6 flex flex-col">
            <div className="mb-4">
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-ink-muted">
                Courrier PDF
              </span>
              <h2 className="mt-1.5 text-[22px] font-display font-bold text-jc-ink">
                Tu poste toi-même
              </h2>
            </div>
            <div className="mb-4">
              <span className="text-[36px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
                3,90&nbsp;€
              </span>
              <span className="ml-1.5 text-[13px] text-jc-ink-muted">TTC</span>
            </div>
            <p className="text-[13px] text-jc-ink-soft mb-5 leading-[1.5]">
              Le courrier rédigé par IA, formaté norme AFNOR, prêt à imprimer
              et glisser dans une enveloppe. Idéal pour les démarches simples.
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Génération IA personnalisée
              </li>
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                PDF haute qualité norme AFNOR
              </li>
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Téléchargement immédiat
              </li>
            </ul>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-jc-line-strong text-jc-ink font-medium rounded-jc hover:bg-jc-surface transition-colors text-sm no-underline"
            >
              Choisir ce mode
            </Link>
          </div>

          {/* Card 2 — Lettre simple (mise en avant comme produit principal) */}
          <div className="bg-jc-bg-elev border-2 border-jc-primary rounded-jc-lg p-6 flex flex-col relative">
            <span className="absolute -top-3 left-6 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-jc-primary text-white">
              Le plus choisi
            </span>
            <div className="mb-4">
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-ink-muted">
                Lettre simple
              </span>
              <h2 className="mt-1.5 text-[22px] font-display font-bold text-jc-ink">
                On poste pour toi
              </h2>
            </div>
            <div className="mb-4">
              <span className="text-[36px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
                5,90&nbsp;€
              </span>
              <span className="ml-1.5 text-[13px] text-jc-ink-muted">TTC</span>
            </div>
            <p className="text-[13px] text-jc-ink-soft mb-5 leading-[1.5]">
              On imprime, on met sous pli, on dépose à La Poste. Lettre verte
              neutre carbone, distribution sous 3 jours ouvrés. Pas de
              déplacement.
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Tout inclus : impression + envoi
              </li>
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Distribution J+3 (lettre verte)
              </li>
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Affranchissement au prix coûtant
              </li>
            </ul>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-sm no-underline"
            >
              Choisir ce mode
            </Link>
          </div>

          {/* Card 3 — Recommandé AR */}
          <div className="bg-jc-bg-elev border border-jc-line rounded-jc-lg p-6 flex flex-col">
            <div className="mb-4">
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-jc-ink-muted">
                Recommandé AR
              </span>
              <h2 className="mt-1.5 text-[22px] font-display font-bold text-jc-ink">
                Valeur juridique opposable
              </h2>
            </div>
            <div className="mb-4">
              <span className="text-[36px] font-display font-semibold text-jc-ink tabular-nums tracking-tight">
                11,90&nbsp;€
              </span>
              <span className="ml-1.5 text-[13px] text-jc-ink-muted">TTC</span>
            </div>
            <p className="text-[13px] text-jc-ink-soft mb-5 leading-[1.5]">
              Lettre recommandée avec accusé de réception. Obligatoire pour les
              mises en demeure, résiliations de bail, contestations
              administratives à délai opposable.
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Preuve de dépôt + AR signé numérisé
              </li>
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Suivi en temps réel La Poste
              </li>
              <li className="flex gap-2 text-[13px] text-jc-ink-soft">
                <span className="text-jc-accent shrink-0 mt-0.5">
                  <IconCheck />
                </span>
                Affranchissement au prix coûtant
              </li>
            </ul>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-jc-line-strong text-jc-ink font-medium rounded-jc hover:bg-jc-surface transition-colors text-sm no-underline"
            >
              Choisir ce mode
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Comparatif concurrents ─── */}
      <section className="px-6 md:px-20 pb-16 max-w-[1100px] mx-auto">
        <div className="bg-jc-surface rounded-jc-lg p-6 md:p-10">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
            Comparatif
          </span>
          <h2 className="mt-2 mb-2.5 text-[28px] font-display font-bold text-jc-ink max-md:text-[24px]">
            Pourquoi tant moins cher ?
          </h2>
          <p className="text-[15px] text-jc-ink-soft mb-6 max-w-[680px]">
            Pas d&apos;avocat dans la boucle, pas d&apos;abonnement à amortir,
            pas de marge dissimulée sur l&apos;affranchissement. Voici les
            tarifs publics des autres plateformes pour un recommandé avec AR
            tout compris.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-jc-line">
                  <th className="text-left font-semibold text-jc-ink py-3 pr-4">
                    Plateforme
                  </th>
                  <th className="text-right font-semibold text-jc-ink py-3 pl-4 tabular-nums">
                    LRAR tout compris
                  </th>
                  <th className="text-right font-semibold text-jc-ink py-3 pl-4 hidden sm:table-cell">
                    Rédaction par IA ?
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-jc-line bg-jc-accent-soft">
                  <td className="py-3 pr-4 font-semibold text-jc-ink">
                    JusteCourrier
                  </td>
                  <td className="text-right py-3 pl-4 font-semibold text-jc-ink tabular-nums">
                    11,90&nbsp;€
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink hidden sm:table-cell">
                    Oui (Claude Sonnet)
                  </td>
                </tr>
                <tr className="border-b border-jc-line">
                  <td className="py-3 pr-4 text-jc-ink-soft">
                    Captain Contrat (lettre seule, envoi à ta charge)
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft tabular-nums">
                    ~16,72&nbsp;€
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft hidden sm:table-cell">
                    Non (modèle avocat)
                  </td>
                </tr>
                <tr className="border-b border-jc-line">
                  <td className="py-3 pr-4 text-jc-ink-soft">
                    Lettre24 (sans abonnement)
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft tabular-nums">
                    18,77&nbsp;€
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft hidden sm:table-cell">
                    Non (sauf plan Entreprise 49&nbsp;€/mois)
                  </td>
                </tr>
                <tr className="border-b border-jc-line">
                  <td className="py-3 pr-4 text-jc-ink-soft">Litige.fr</td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft tabular-nums">
                    ~36,89&nbsp;€
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft hidden sm:table-cell">
                    Non (modèles)
                  </td>
                </tr>
                <tr className="border-b border-jc-line">
                  <td className="py-3 pr-4 text-jc-ink-soft">
                    Demanderjustice
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft tabular-nums">
                    39,90&nbsp;€
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft hidden sm:table-cell">
                    Non (modèles)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-jc-ink-soft">
                    Cabinet d&apos;avocat traditionnel
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft tabular-nums">
                    ~300&nbsp;€
                  </td>
                  <td className="text-right py-3 pl-4 text-jc-ink-soft hidden sm:table-cell">
                    Non (humain)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-[12px] text-jc-ink-muted">
            Tarifs concurrents constatés au 28 avril 2026 sur leurs sites
            officiels respectifs. Comparatif réalisé pour un envoi LRAR
            standard 1 page vers la France métropolitaine.
          </p>
        </div>
      </section>

      {/* ─── Différenciateurs ─── */}
      <section className="px-6 md:px-20 pb-16 max-w-[1100px] mx-auto">
        <h2 className="text-[28px] font-display font-bold text-jc-ink mb-6 max-md:text-[24px]">
          Quatre engagements simples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-jc-bg-elev border border-jc-line rounded-jc p-5">
            <div className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-full bg-jc-accent-soft text-jc-accent flex items-center justify-center shrink-0">
                <IconCheck />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-jc-ink mb-1">
                  Affranchissement au prix coûtant
                </h3>
                <p className="text-[13px] text-jc-ink-soft leading-[1.5]">
                  On te refacture exactement ce que la Poste nous facture, via
                  notre partenaire MySendingBox. Aucune marge dissimulée.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-jc-bg-elev border border-jc-line rounded-jc p-5">
            <div className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-full bg-jc-accent-soft text-jc-accent flex items-center justify-center shrink-0">
                <IconLock />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-jc-ink mb-1">
                  Pas d&apos;abonnement
                </h3>
                <p className="text-[13px] text-jc-ink-soft leading-[1.5]">
                  Un courrier = un paiement. Tu ne nous revois plus tant que tu
                  n&apos;as pas une nouvelle démarche à faire.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-jc-bg-elev border border-jc-line rounded-jc p-5">
            <div className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-full bg-jc-accent-soft text-jc-accent flex items-center justify-center shrink-0">
                <IconCheck />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-jc-ink mb-1">
                  Pas d&apos;engagement
                </h3>
                <p className="text-[13px] text-jc-ink-soft leading-[1.5]">
                  Pas de carte bancaire enregistrée, pas de prélèvement
                  surprise. Stripe sécurise le paiement, on ne stocke rien.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-jc-bg-elev border border-jc-line rounded-jc p-5">
            <div className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-full bg-jc-accent-soft text-jc-accent flex items-center justify-center shrink-0">
                <IconCheck />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-jc-ink mb-1">
                  Vraie IA, pas un modèle figé
                </h3>
                <p className="text-[13px] text-jc-ink-soft leading-[1.5]">
                  Chaque courrier est rédigé par Claude Sonnet à partir de tes
                  réponses. Pas de gabarit générique avec ton nom collé dessus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section className="px-6 md:px-20 pb-24 text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-3xl font-display font-bold text-jc-ink mb-3 max-md:text-2xl">
            Une démarche à faire ?
          </h2>
          <p className="text-[15px] text-jc-ink-soft mb-6">
            Choisis le type de courrier qui correspond à ta situation. On
            t&apos;accompagne en moins de 3 minutes.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors text-base no-underline"
          >
            Voir le catalogue <IconArrow />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-jc-line px-8 pt-12 pb-7 text-[13px] text-jc-ink-muted">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 pb-8">
            <div className="col-span-2 md:col-span-1">
              <Logo size={22} />
              <p className="mt-3.5 max-w-[280px] text-jc-ink-muted">
                Le courrier administratif simple, transparent et juste. Pas
                d&apos;abonnement, pas de piège.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Service
              </h5>
              <div className="flex flex-col gap-1">
                <Link
                  href="/catalogue"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Catalogue
                </Link>
                <Link
                  href="/guides"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Guides juridiques
                </Link>
                <Link
                  href="/tarifs"
                  className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors"
                >
                  Tarifs
                </Link>
              </div>
            </div>
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
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>
              © {new Date().getFullYear()} JusteCourrier · SIRET 104 347 919 00011
            </span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
