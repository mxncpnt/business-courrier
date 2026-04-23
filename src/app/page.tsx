import Link from "next/link";
import { categories, letterTypes } from "@/config/letter-types";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Courrier IA</span>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#catalogue" className="hover:text-gray-900">
              Catalogue
            </a>
            <a href="#fonctionnement" className="hover:text-gray-900">
              Comment ça marche
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight sm:text-5xl">
            Votre courrier personnalisé,
            <br />
            <span className="text-blue-600">prêt en 2 minutes</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Résiliation, mise en demeure, réclamation, contestation… Remplissez
            un formulaire, notre IA rédige un courrier professionnel adapté à
            votre situation. Téléchargez le PDF, prêt à envoyer.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#catalogue"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choisir un courrier — 4,90 €
            </a>
            <a
              href="#fonctionnement"
              className="px-8 py-3 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Comment ça marche ?
            </a>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choisissez",
                desc: "Sélectionnez le type de courrier dont vous avez besoin.",
              },
              {
                step: "2",
                title: "Remplissez",
                desc: "Répondez à quelques questions sur votre situation.",
              },
              {
                step: "3",
                title: "Téléchargez",
                desc: "Obtenez votre courrier personnalisé en PDF, prêt à envoyer.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Nos modèles de courriers
          </h2>

          {categories.map((cat) => {
            const letters = letterTypes.filter(
              (lt) => lt.category === cat.slug
            );
            if (letters.length === 0) return null;

            return (
              <div key={cat.slug} className="mb-12">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {letters.map((letter) => (
                    <Link
                      key={letter.slug}
                      href={`/courrier/${letter.slug}`}
                      className="group block p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{letter.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {letter.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {letter.description}
                          </p>
                          <p className="mt-2 text-sm font-medium text-blue-600">
                            {(letter.priceCents / 100).toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Courrier IA. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="/mentions-legales" className="hover:text-gray-700">
              Mentions légales
            </a>
            <a href="/cgv" className="hover:text-gray-700">
              CGV
            </a>
            <a href="/confidentialite" className="hover:text-gray-700">
              Confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
