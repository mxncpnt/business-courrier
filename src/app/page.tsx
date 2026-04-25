import Link from "next/link";
import { categories, letterTypes } from "@/config/letter-types";
import { createAuthClient } from "@/lib/supabase/server-auth";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createAuthClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Not logged in
  }

  return (
    <div className="flex flex-col min-h-screen bg-jc-bg-elev">
      {/* Header */}
      <header className="border-b border-jc-line">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-jc-ink">JusteCourrier</span>
          <nav className="flex items-center gap-6 text-sm text-jc-ink-soft">
            <a href="#catalogue" className="hover:text-jc-ink">
              Catalogue
            </a>
            <a href="#fonctionnement" className="hover:text-jc-ink">
              Comment ça marche
            </a>
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-jc-primary text-white font-medium rounded-jc-sm hover:bg-jc-primary-hover transition-colors"
              >
                Mes courriers
              </Link>
            ) : (
              <Link
                href="/connexion"
                className="px-4 py-2 border border-jc-line-strong text-jc-ink-soft font-medium rounded-jc-sm hover:bg-jc-surface transition-colors"
              >
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-jc-ink leading-tight sm:text-5xl font-display">
            Ton courrier personnalisé,
            <br />
            <span className="text-jc-accent">prêt en 2 minutes</span>
          </h1>
          <p className="mt-6 text-lg text-jc-ink-soft max-w-2xl mx-auto">
            Résiliation, mise en demeure, réclamation, contestation… Remplis
            un formulaire, notre IA rédige un courrier professionnel adapté à
            ta situation. PDF prêt à envoyer.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#catalogue"
              className="px-8 py-3 bg-jc-primary text-white font-medium rounded-jc hover:bg-jc-primary-hover transition-colors"
            >
              Choisir un courrier — 4,90 €
            </a>
            <a
              href="#fonctionnement"
              className="px-8 py-3 text-jc-ink-soft font-medium rounded-jc border border-jc-line hover:bg-jc-surface transition-colors"
            >
              Comment ça marche ?
            </a>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="py-16 px-6 bg-jc-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-jc-ink text-center mb-12 font-display">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choisis",
                desc: "Sélectionne le type de courrier dont tu as besoin.",
              },
              {
                step: "2",
                title: "Remplis",
                desc: "Réponds à quelques questions sur ta situation.",
              },
              {
                step: "3",
                title: "Télécharge",
                desc: "Obtiens ton courrier personnalisé en PDF, prêt à envoyer.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-jc-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-jc-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-jc-ink-soft">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-jc-ink text-center mb-12 font-display">
            Nos modèles de courriers
          </h2>

          {categories.map((cat) => {
            const letters = letterTypes.filter(
              (lt) => lt.category === cat.slug
            );
            if (letters.length === 0) return null;

            return (
              <div key={cat.slug} className="mb-12">
                <h3 className="text-lg font-semibold text-jc-ink mb-4 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {letters.map((letter) => (
                    <Link
                      key={letter.slug}
                      href={`/courrier/${letter.slug}`}
                      className="group block p-5 border border-jc-line rounded-jc hover:border-jc-accent hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{letter.icon}</span>
                        <div>
                          <h4 className="font-medium text-jc-ink group-hover:text-jc-accent transition-colors">
                            {letter.title}
                          </h4>
                          <p className="mt-1 text-sm text-jc-ink-muted">
                            {letter.description}
                          </p>
                          <p className="mt-2 text-sm font-medium text-jc-accent">
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
      <footer className="mt-auto border-t border-jc-line py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-jc-ink-muted">
          <p>© {new Date().getFullYear()} JusteCourrier. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="/mentions-legales" className="hover:text-jc-ink-soft">
              Mentions légales
            </a>
            <a href="/cgv" className="hover:text-jc-ink-soft">
              CGV
            </a>
            <a href="/confidentialite" className="hover:text-jc-ink-soft">
              Confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
