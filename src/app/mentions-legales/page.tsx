import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site justecourrier.fr. Éditeur, hébergeur, propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
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
          <span className="text-jc-ink">Mentions légales</span>
        </nav>
      </div>

      {/* ─── Content ─── */}
      <main className="max-w-[820px] mx-auto px-8 pt-6 pb-20">
        <h1 className="text-[28px] sm:text-[36px] font-display font-bold text-jc-ink mb-10">
          Mentions légales
        </h1>

        <div className="space-y-8 text-jc-ink-soft text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong>JusteCourrier</strong> est édité par :
            </p>
            <ul className="list-none pl-0 space-y-1 mt-2">
              <li>Maxence Pinta — Entrepreneur individuel (micro-entreprise)</li>
              <li>SIRET : 104 347 919 00011</li>
              <li>Code APE : 6201Z (programmation informatique)</li>
              <li>Adresse : 3 Rue Jean Giono, 34170 Castelnau-le-Lez, France</li>
              <li>Email : contact@justecourrier.fr</li>
              <li>TVA non applicable, art. 293 B du CGI (franchise en base)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              2. Directeur de la publication
            </h2>
            <p>
              Maxence Pinta, en qualité d&apos;éditeur du site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
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
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              4. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu du site JusteCourrier (textes, graphismes,
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
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              5. Responsabilité
            </h2>
            <p>
              Les courriers générés par JusteCourrier sont produits par
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
            <h2 className="text-lg font-semibold text-jc-ink mb-3">
              6. Données personnelles
            </h2>
            <p>
              Pour toute information relative au traitement de vos données
              personnelles, veuillez consulter notre{" "}
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
              7. Droit applicable
            </h2>
            <p>
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
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
