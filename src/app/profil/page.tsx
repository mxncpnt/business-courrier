/**
 * Page profil utilisateur — `/profil`.
 *
 * Section principale au MVP : signature manuscrite globale (réutilisée pour
 * tous les courriers PDF). Authentifiée. RLS garantit qu'un user ne voit
 * que son propre profil.
 *
 * Architecture :
 *   - Server component lit `user_profiles` via service_role (l'auth a déjà
 *     été validée juste avant)
 *   - Génère une signed URL pour la signature actuelle (preview HTML)
 *   - Délègue l'UI au composant client `SignatureUpload`
 *
 * Plus tard : préférences notifications, données personnelles éditables,
 * suppression de compte. Pour l'instant, focus sur la signature.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";
import {
  getSignatureInfo,
  getSignatureSignedUrl,
} from "@/lib/letters/signature";
import Logo from "@/components/Logo";
import SignatureUpload from "@/components/SignatureUpload";

export const metadata = {
  title: "Mon profil",
};

export default async function ProfilPage() {
  const auth = await createAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) {
    redirect("/connexion?redirect=/profil");
  }

  const info = await getSignatureInfo(user.id);
  const signedUrl = info ? await getSignatureSignedUrl(user.id) : null;

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
            href="/dashboard"
            className="text-jc-ink-soft text-sm font-medium no-underline hover:text-jc-ink transition-colors"
          >
            Mes courriers
          </Link>
        </nav>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-[14px] py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors no-underline"
        >
          Nouveau courrier
        </Link>
      </header>

      {/* ─── Content ─── */}
      <section className="px-6 md:px-8 pt-10 pb-20 max-w-[720px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-jc-accent font-body">
            Mon profil
          </span>
          <h1 className="mt-2 text-[28px] sm:text-[36px] font-display font-bold text-jc-ink">
            Paramètres
          </h1>
          <p className="mt-2 text-[15px] text-jc-ink-soft">
            Connecté avec <strong className="text-jc-ink">{user.email}</strong>
          </p>
        </div>

        {/* Section signature */}
        <div className="mb-10">
          <h2 className="text-[20px] font-display font-bold text-jc-ink mb-2">
            Signature manuscrite
          </h2>
          <p className="text-[14px] text-jc-ink-soft leading-[1.6] mb-5">
            Ajoutez votre signature pour qu&apos;elle apparaisse en bas des
            courriers PDF que vous générez. Elle est utilisée pour tous vos
            courriers — vous pouvez la remplacer ou la supprimer à tout moment.
            Optionnelle.
          </p>

          <SignatureUpload
            currentSignatureUrl={signedUrl}
            uploadedAt={info?.uploadedAt ?? null}
          />
        </div>

        {/* Lien retour dashboard */}
        <p className="mt-8 text-[13px] text-jc-ink-muted">
          <Link
            href="/dashboard"
            className="text-jc-ink-soft no-underline hover:text-jc-ink"
          >
            ← Retour à mes courriers
          </Link>
        </p>
      </section>

      {/* ─── Footer compact ─── */}
      <footer className="border-t border-jc-line px-8 pt-12 pb-7 text-[13px] text-jc-ink-muted">
        <div className="max-w-[1200px] mx-auto">
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
