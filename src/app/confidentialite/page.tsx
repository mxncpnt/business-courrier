import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité — Courrier IA",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Accueil
          </Link>
          <span className="text-xl font-bold text-gray-900">Courrier IA</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Responsable du traitement
            </h2>
            <p>
              Le responsable du traitement des données personnelles est :
            </p>
            <ul className="list-none pl-0 space-y-1 mt-2">
              <li>Maxence Pinta, entrepreneur individuel</li>
              <li>Email : maxence.pinta@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Données collectées
            </h2>
            <p>
              Dans le cadre de l&apos;utilisation du service Courrier IA, nous
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
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
                href="mailto:maxence.pinta@gmail.com"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                maxence.pinta@gmail.com
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
                className="text-blue-600 hover:text-blue-700 underline"
              >
                www.cnil.fr
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Cookies
            </h2>
            <p>
              Le site Courrier IA utilise uniquement des cookies strictement
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Modifications
            </h2>
            <p>
              La présente politique de confidentialité peut être mise à jour à
              tout moment. La date de dernière mise à jour est indiquée en bas de
              page. En cas de modification substantielle, les utilisateurs en
              seront informés.
            </p>
          </section>

          <p className="text-sm text-gray-400 mt-10">
            Dernière mise à jour : avril 2026
          </p>
        </div>
      </main>
    </div>
  );
}
