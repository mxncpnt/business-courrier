/**
 * Rattache à un user authentifié tous les enregistrements business orphelins
 * (user_id IS NULL) qui correspondent à son email.
 *
 * Cas d'usage : un visiteur génère un courrier en étant non-connecté, paie,
 * puis se connecte par magic link pour ajouter sa signature et confirmer
 * l'envoi. Sans claim, son courrier reste orphelin (user_id null) :
 *   - Invisible dans /dashboard (qui filtre par user_id)
 *   - "Accès refusé" sur le bouton "Confirmer et envoyer à La Poste"
 *     (confirmMailingSend rejette si mailing.user_id !== user.id)
 *
 * Fix : à chaque login (callback Supabase Auth), on appelle ce helper qui
 * fait un UPDATE...WHERE email = X AND user_id IS NULL sur les 4 tables
 * business. Idempotent : si rien n'est orphelin, no-op silencieux.
 *
 * Bug observé prod 2026-05-07 sur le compte margaux.artiguenave@gmail.com
 * (facture JC-2026-0041).
 */

import { createServiceClient } from "@/lib/supabase/server";

export async function claimOrphanedRecords(
  userId: string,
  email: string
): Promise<{ letters: number; mailings: number; invoices: number; payments: number }> {
  const supabase = createServiceClient();
  const counts = { letters: 0, mailings: 0, invoices: 0, payments: 0 };

  // 1. Letters orphelines pour cet email
  const { data: claimedLetters, error: lettersError } = await supabase
    .from("letters")
    .update({ user_id: userId })
    .eq("email", email)
    .is("user_id", null)
    .select("id");

  if (lettersError) {
    console.error("claimOrphanedRecords: letters update failed", lettersError);
  } else {
    counts.letters = claimedLetters?.length ?? 0;
  }

  if (counts.letters === 0) {
    // Pas d'orphelin → no-op pour les autres tables aussi (mailings/invoices/
    // payments sont tous joints aux letters via letter_id).
    return counts;
  }

  const claimedLetterIds = (claimedLetters ?? []).map((l) => l.id);

  // 2. Mailings rattachés aux letters claimées
  const { data: claimedMailings, error: mailingsError } = await supabase
    .from("mailings")
    .update({ user_id: userId })
    .in("letter_id", claimedLetterIds)
    .is("user_id", null)
    .select("id");
  if (mailingsError) {
    console.error("claimOrphanedRecords: mailings update failed", mailingsError);
  } else {
    counts.mailings = claimedMailings?.length ?? 0;
  }

  // 3. Invoices rattachées aux letters claimées
  const { data: claimedInvoices, error: invoicesError } = await supabase
    .from("invoices")
    .update({ user_id: userId })
    .in("letter_id", claimedLetterIds)
    .is("user_id", null)
    .select("id");
  if (invoicesError) {
    console.error("claimOrphanedRecords: invoices update failed", invoicesError);
  } else {
    counts.invoices = claimedInvoices?.length ?? 0;
  }

  // 4. Payments — pas de user_id sur cette table aujourd'hui (lien letter_id
  // suffit pour les requêtes). Si on en ajoute un un jour, étendre ici.

  if (counts.letters > 0 || counts.mailings > 0 || counts.invoices > 0) {
    console.log(
      `claimOrphanedRecords: claimed for ${email} (user ${userId}) — ` +
        `letters=${counts.letters} mailings=${counts.mailings} invoices=${counts.invoices}`
    );
  }

  return counts;
}
