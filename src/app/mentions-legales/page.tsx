import Link from "next/link";

export const metadata = {
  title: "Mentions légales — Courrier IA",
};

export default function MentionsLegalesPage() {
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
          Mentions légales
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong>Courrier IA</strong> est édité par :
            </p>
            <ul className="list-none pl-0 space-y-1 mt-2">
              <li>Maxence Pinta, entrepreneur individuel</li>
              <li>
                SIRET : <span className="text-amber-600 font-medium">[À COMPLÉTER après immatriculation]</span>
              </li>
              <li>
                Adresse : <span className="text-amber-600 font-medium">[À COMPLÉTER]</span>
              </li>
              <li>Email : maxence.pinta@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Directeur de la publication
            </h2>
            <p>
              Maxence Pinta, en qualité d&apos;éditeur du site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Hébergement
            </h2>
            <p>Le site est hébergé par :</p>
            <ul className="list-none pl-0 space-y-1 mt-2">
              <li>Vercel Inc.</li>
              <li>440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis</li>
              <li>Site web : vercel.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu du site Courrier IA (textes, graphismes,
              logo, icônes, logiciels, code source) est la propriété exclusive de
              l&apos;éditeur ou de ses partenaires et est protégé par les lois
              françaises et internationales relatives à la propriété
              intellectuelle.
            </p>
            <p className="mt-2">
              Les courriers générés par le service sont la propriété de
              l&apos;utilisateur qui les a commandés. L&apos;éditeur ne conserve
              aucun droit d&apos;exploitation sur ces contenus.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Responsabilité
            </h2>
            <p>
              Les courriers générés par Courrier IA sont produits par
              intelligence artificielle à titre informatif. Ils ne constituent en
              aucun cas un conseil juridique professionnel. L&apos;éditeur ne
              saurait être tenu responsable des conséquences liées à
              l&apos;utilisation des documents générés.
            </p>
            <p className="mt-2">
              L&apos;utilisateur est invité à consulter un professionnel du droit
              pour toute situation complexe ou litigieuse.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Données personnelles
            </h2>
            <p>
              Pour toute information relative au traitement de vos données
              personnelles, veuillez consulter notre{" "}
              <Link
                href="/confidentialite"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Droit applicable
            </h2>
            <p>
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
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
