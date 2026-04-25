import Link from "next/link";

export const metadata = {
  title: "Conditions Générales de Vente — JusteCourrier",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-jc-bg">
      <header className="bg-jc-bg-elev border-b border-jc-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-jc-ink-muted hover:text-jc-ink-soft transition-colors"
          >
            ← Accueil
          </Link>
          <span className="text-xl font-bold text-jc-ink">JusteCourrier</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-jc-ink mb-8 font-display">
          Conditions Générales de Vente
        </h1>

        <div className="prose max-w-none space-y-8 text-jc-ink-soft text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les
              relations contractuelles entre l&apos;éditeur du site JusteCourrier
              (ci-après « le Prestataire ») et toute personne physique effectuant
              un achat sur le site (ci-après « le Client »).
            </p>
            <p className="mt-2">
              Toute commande implique l&apos;acceptation sans réserve des
              présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              2. Description du service
            </h2>
            <p>
              JusteCourrier propose un service de génération de courriers
              administratifs et juridiques personnalisés par intelligence
              artificielle. Le Client remplit un formulaire en ligne, un courrier
              est généré automatiquement, et après paiement, le Client accède au
              texte complet et peut le télécharger au format PDF.
            </p>
            <p className="mt-2 font-medium text-jc-ink">
              Les courriers générés sont produits à titre informatif et ne
              constituent pas un conseil juridique professionnel. Le Client est
              invité à consulter un professionnel du droit pour toute situation
              complexe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              3. Prix
            </h2>
            <p>
              Le prix de chaque courrier est de <strong>4,90 € TTC</strong>. Le
              Prestataire bénéficie de la franchise en base de TVA (article 293 B
              du CGI). TVA non applicable.
            </p>
            <p className="mt-2">
              Le prix est indiqué avant validation de la commande. Le Prestataire
              se réserve le droit de modifier ses prix à tout moment, le prix
              applicable étant celui affiché au moment de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              4. Modalités de paiement
            </h2>
            <p>
              Le paiement s&apos;effectue en ligne par carte bancaire via la
              plateforme sécurisée Stripe. Le paiement est exigible immédiatement
              à la commande. Aucune donnée bancaire n&apos;est stockée sur nos
              serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              5. Livraison
            </h2>
            <p>
              Le courrier est livré immédiatement après confirmation du paiement
              sous forme numérique : accès au texte complet en ligne et
              téléchargement au format PDF. Un email de confirmation contenant le
              lien de téléchargement est envoyé à l&apos;adresse indiquée par le
              Client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              6. Droit de rétractation
            </h2>
            <p>
              Conformément à l&apos;article L. 221-28 du Code de la
              consommation, le droit de rétractation ne peut être exercé pour les
              contrats de fourniture de contenu numérique non fourni sur un
              support matériel dont l&apos;exécution a commencé avec
              l&apos;accord préalable exprès du consommateur et pour lequel il a
              renoncé à son droit de rétractation.
            </p>
            <p className="mt-2">
              En validant sa commande, le Client reconnaît et accepte que la
              fourniture du courrier commence immédiatement après le paiement et
              renonce expressément à son droit de rétractation.
            </p>
            <p className="mt-2">
              Toutefois, le Prestataire s&apos;engage à rembourser tout Client
              insatisfait sur simple demande par email à{" "}
              <a
                href="mailto:maxence.pinta@gmail.com"
                className="text-jc-primary hover:text-jc-primary-hover underline"
              >
                maxence.pinta@gmail.com
              </a>{" "}
              dans un délai de 14 jours suivant l&apos;achat (politique
              « satisfait ou remboursé »).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              7. Responsabilité
            </h2>
            <p>
              Le Prestataire s&apos;engage à fournir un service conforme à sa
              description. Cependant, le contenu généré étant produit par
              intelligence artificielle, le Prestataire ne garantit pas
              l&apos;exactitude juridique, l&apos;exhaustivité ou
              l&apos;adéquation du courrier à la situation particulière du
              Client.
            </p>
            <p className="mt-2">
              La responsabilité du Prestataire est limitée au montant de la
              commande.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              8. Réclamations
            </h2>
            <p>
              Pour toute réclamation, le Client peut contacter le Prestataire par
              email à{" "}
              <a
                href="mailto:maxence.pinta@gmail.com"
                className="text-jc-primary hover:text-jc-primary-hover underline"
              >
                maxence.pinta@gmail.com
              </a>
              . Le Prestataire s&apos;engage à répondre dans un délai de 7 jours
              ouvrés.
            </p>
            <p className="mt-2">
              Conformément aux articles L. 616-1 et R. 616-1 du Code de la
              consommation, en cas de litige non résolu, le Client peut recourir
              gratuitement au service de médiation de la consommation. Le
              médiateur compétent est :{" "}
              <span className="text-amber-600 font-medium">
                [À COMPLÉTER — choisir un médiateur de la consommation]
              </span>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              9. Propriété intellectuelle
            </h2>
            <p>
              Les courriers générés sont la propriété du Client dès le paiement.
              Le Prestataire ne conserve aucun droit d&apos;exploitation sur les
              contenus générés pour le Client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              10. Données personnelles
            </h2>
            <p>
              Le traitement des données personnelles est décrit dans notre{" "}
              <Link
                href="/confidentialite"
                className="text-jc-primary hover:text-jc-primary-hover underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              11. Droit applicable et juridiction compétente
            </h2>
            <p>
              Les présentes CGV sont soumises au droit français. Tout litige
              relatif à leur interprétation ou leur exécution relève de la
              compétence des tribunaux français.
            </p>
          </section>

          <p className="text-sm text-jc-ink-muted mt-10">
            Dernière mise à jour : avril 2026
          </p>
        </div>
      </main>
    </div>
  );
}
