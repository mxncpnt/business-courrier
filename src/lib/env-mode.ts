/**
 * Détection du mode d'environnement (test/live).
 *
 * Source unique de vérité pour tagger les enregistrements DB
 * (`letters`, `payments`, `invoices`, `mailings`) avec un flag `is_test`,
 * afin de pouvoir filtrer le dashboard /admin par environnement.
 *
 * Logique : `true` (= test) si l'un OU l'autre de Stripe ou MSB est en test.
 *   - Stripe : la clé secrète commence par `sk_test_` (live = `sk_live_`)
 *   - MSB : variable d'env `MSB_MODE` (default `test` si absente)
 *
 * On est en "live" UNIQUEMENT quand les deux APIs sont en mode live —
 * sinon on considère l'envoi comme test pour ne pas polluer les KPIs business.
 */
export function isTestEnv(): boolean {
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  const isStripeTest = !stripeKey.startsWith("sk_live_");
  const isMsbTest = (process.env.MSB_MODE ?? "test") !== "live";
  return isStripeTest || isMsbTest;
}
