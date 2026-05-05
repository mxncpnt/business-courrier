import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de JusteCourrier. Données collectées, finalités, droits des utilisateurs, cookies.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-jc-bg">
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
      <div className="px-8 pt-5 max-w-[820px] mx-auto">
        <nav className="text-[13px] text-jc-ink-muted flex items-center gap-1.5">
          <Link href="/" className="hover:text-jc-ink transition-colors no-underline">
            Accueil
          </Link>
          <span>›</span>
          <span className="text-jc-ink">Confidentialité</span>
        </nav>
      </div>

      {/* ─── Content ─── */}
      <main className="max-w-[820px] mx-auto px-8 pt-6 pb-20">
        <h1 className="text-[28px] sm:text-[36px] font-display font-bold text-jc-ink mb-10">
          Politique de confidentialité
        </h1>

        <div className="space-y-8 text-jc-ink-soft text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              1. Responsable du traitement
            </h2>
            <p>
              Le responsable du traitement des données personnelles est :
            </p>
            <ul className="list-none pl-0 space-y-1 mt-2">
              <li>Maxence Pinta, entrepreneur individuel</li>
              <li>Email : contact@justecourrier.fr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              2. Données collectées
            </h2>
            <p>
              Dans le cadre de l&apos;utilisation du service JusteCourrier, nous
              collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Données du formulaire</strong> : nom, adresse, email de
                l&apos;expéditeur ; nom et adresse du destinataire du courrier ;
                informations spécifiques au type de courrier (numéro de contrat,
                dates, motif, etc.).
              </li>
              <li>
                <strong>Données de paiement</strong> : les transactions sont
                traitées par Stripe. Nous ne stockons aucune donnée bancaire
                (numéro de carte, CVV). Nous conservons uniquement
                l&apos;identifiant de la transaction Stripe.
              </li>
              <li>
                <strong>Données techniques</strong> : adresse IP, type de
                navigateur, pages consultées (via les logs serveur de
                l&apos;hébergeur Vercel).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              3. Finalités du traitement
            </h2>
            <p>Vos données sont collectées pour les finalités suivantes :</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Exécution du service</strong> : générer votre courrier
                personnalisé et vous fournir le PDF (base légale : exécution du
                contrat, art. 6.1.b RGPD).
              </li>
              <li>
                <strong>Gestion des paiements</strong> : traiter votre paiement
                et conserver la preuve de la transaction (base légale : obligation
                légale, art. 6.1.c RGPD).
              </li>
              <li>
                <strong>Email de confirmation</strong> : vous envoyer le lien de
                téléchargement de votre courrier (base légale : exécution du
                contrat).
              </li>
              <li>
                <strong>Amélioration du service</strong> : analyser
                l&apos;utilisation du site de manière agrégée et anonymisée (base
                légale : intérêt légitime, art. 6.1.f RGPD).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              4. Sous-traitants et transferts de données
            </h2>
            <p>
              Vos données peuvent être transmises aux sous-traitants suivants,
              dans le strict cadre des finalités décrites ci-dessus :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Anthropic</strong> (États-Unis) : traitement du texte du
                formulaire pour générer le courrier via l&apos;API Claude. Les
                données du formulaire sont envoyées à Anthropic lors de la
                génération.
              </li>
              <li>
                <strong>Supabase</strong> (UE) : hébergement de la base de
                données contenant les courriers et paiements.
              </li>
              <li>
                <strong>Stripe</strong> (États-Unis) : traitement sécurisé des
                paiements par carte bancaire.
              </li>
              <li>
                <strong>Vercel</strong> (États-Unis) : hébergement du site web.
              </li>
              <li>
                <strong>Resend</strong> (États-Unis) : envoi des emails
                transactionnels.
              </li>
            </ul>
            <p className="mt-3">
              Les transferts vers les États-Unis sont encadrés par les clauses
              contractuelles types de la Commission européenne et/ou le Data
              Privacy Framework UE–États-Unis, selon les fournisseurs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              5. Durée de conservation
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Données des courriers</strong> : 12 mois après la
                génération, puis suppression automatique.
              </li>
              <li>
                <strong>Données de paiement</strong> : conservées pendant la
                durée légale de conservation des pièces comptables (10 ans,
                article L. 123-22 du Code de commerce).
              </li>
              <li>
                <strong>Logs techniques</strong> : 12 mois maximum.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              6. Vos droits
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez des
              droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Droit d&apos;accès</strong> : obtenir la communication
                de vos données personnelles.
              </li>
              <li>
                <strong>Droit de rectification</strong> : demander la correction
                de données inexactes.
              </li>
              <li>
                <strong>Droit à l&apos;effacement</strong> : demander la
                suppression de vos données (sous réserve des obligations légales
                de conservation).
              </li>
              <li>
                <strong>Droit à la portabilité</strong> : recevoir vos données
                dans un format structuré et lisible par machine.
              </li>
              <li>
                <strong>Droit d&apos;opposition</strong> : vous opposer au
                traitement de vos données pour motif légitime.
              </li>
              <li>
                <strong>Droit à la limitation</strong> : demander la limitation
                du traitement dans certains cas.
              </li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, envoyez un email à{" "}
              <a
                href="mailto:contact@justecourrier.fr"
                className="text-jc-accent hover:underline no-underline"
              >
                contact@justecourrier.fr
              </a>{" "}
              en précisant votre demande et en joignant un justificatif
              d&apos;identité. Nous nous engageons à répondre dans un délai d&apos;un
              mois.
            </p>
            <p className="mt-2">
              Vous pouvez également introduire une réclamation auprès de la CNIL
              (Commission Nationale de l&apos;Informatique et des Libertés) sur{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-jc-accent hover:underline no-underline"
              >
                www.cnil.fr
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              7. Cookies
            </h2>
            <p>
              Le site JusteCourrier utilise uniquement des cookies strictement
              nécessaires au fonctionnement du service (cookies de session, état
              du paiement). Aucun cookie publicitaire ou de suivi n&apos;est
              utilisé.
            </p>
            <p className="mt-2">
              Ces cookies étant indispensables au fonctionnement du site, ils ne
              nécessitent pas de consentement préalable conformément aux
              recommandations de la CNIL.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              8. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles
              appropriées pour protéger vos données : chiffrement des échanges
              (HTTPS/TLS), accès restreint à la base de données (Row Level
              Security), aucun stockage de données bancaires, sous-traitants
              certifiés (Stripe PCI-DSS, Supabase SOC 2).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              9. Modifications
            </h2>
            <p>
              La présente politique de confidentialité peut être mise à jour à
              tout moment. La date de dernière mise à jour est indiquée en bas de
              page. En cas de modification substantielle, les utilisateurs en
              seront informés.
            </p>
          </section>

          <p className="text-sm text-jc-ink-muted mt-10">
            Dernière mise à jour : avril 2026
          </p>
        </div>
      </main>

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
              <h3 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Service
              </h3>
              <div className="flex flex-col gap-1">
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Catalogue</Link>
                <Link href="/guides" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Guides juridiques</Link>
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Tarifs</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h3>
              <div className="flex flex-col gap-1">
                <Link href="/mentions-legales" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Mentions légales</Link>
                <Link href="/cgv" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">CGV</Link>
                <Link href="/confidentialite" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Confidentialité</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h3>
              <div className="flex flex-col gap-1">
                <span className="text-jc-ink-soft py-1">contact@justecourrier.fr</span>
                <span className="text-jc-ink-soft py-1">Aide &amp; FAQ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-jc-line pt-5 flex justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} JusteCourrier · SIRET 104 347 919 00011</span>
            <span>Édité en France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
