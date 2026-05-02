import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions générales de vente du service JusteCourrier. Prix, livraison, droit de rétractation, responsabilité.",
};

export default function CGVPage() {
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
          <span className="text-jc-ink">CGV</span>
        </nav>
      </div>

      {/* ─── Content ─── */}
      <main className="max-w-[820px] mx-auto px-8 pt-6 pb-20">
        <h1 className="text-[28px] sm:text-[36px] font-display font-bold text-jc-ink mb-10">
          Conditions Générales de Vente
        </h1>

        <div className="space-y-8 text-jc-ink-soft text-[15px] leading-relaxed">
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
              Les prix appliqués par le Prestataire sont les suivants :
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Génération du courrier au format PDF (sans envoi
                postal)</strong> : 3,90 € TTC.
              </li>
              <li>
                <strong>Génération + envoi par lettre simple (lettre verte
                La Poste, J+3)</strong> : 5,90 € TTC.
              </li>
              <li>
                <strong>Génération + envoi par lettre recommandée avec accusé
                de réception (LRAR La Poste, J+2 à J+5)</strong> : 11,90 € TTC.
              </li>
            </ul>
            <p className="mt-2">
              Le Prestataire bénéficie de la franchise en base de TVA (article 293 B
              du CGI). TVA non applicable. Les frais d&apos;affranchissement
              postal sont refacturés au prix coûtant pratiqué par le partenaire
              postal MySendingBox, sans marge dissimulée.
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
                href="mailto:contact@justecourrier.fr"
                className="text-jc-accent hover:underline no-underline"
              >
                contact@justecourrier.fr
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
                href="mailto:contact@justecourrier.fr"
                className="text-jc-accent hover:underline no-underline"
              >
                contact@justecourrier.fr
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
                className="text-jc-accent hover:underline no-underline"
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
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Catalogue</Link>
                <Link href="/guides" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Guides juridiques</Link>
                <Link href="/catalogue" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Tarifs</Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Société
              </h5>
              <div className="flex flex-col gap-1">
                <Link href="/mentions-legales" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Mentions légales</Link>
                <Link href="/cgv" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">CGV</Link>
                <Link href="/confidentialite" className="text-jc-ink-soft no-underline py-1 hover:text-jc-ink transition-colors">Confidentialité</Link>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-[0.06em] uppercase text-jc-ink mb-3">
                Contact
              </h5>
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
