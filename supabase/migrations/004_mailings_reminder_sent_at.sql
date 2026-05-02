-- Migration 004 — Édition courrier A2 : découplage paiement / submission MSB
--
-- Ajoute la colonne `reminder_sent_at` sur `mailings` pour tracker l'envoi
-- du mail "Confirmer l'envoi à La Poste" à T+12h après paiement (rappel à
-- l'utilisateur qu'il a la possibilité d'éditer son courrier avant l'envoi
-- automatique à T+24h).
--
-- Permet l'idempotence du cron `/api/cron/process-pending-mailings` :
--   - Si `paid_at < now() - 24h` → submit auto + email "Votre courrier est parti"
--   - Sinon si `paid_at < now() - 12h AND reminder_sent_at IS NULL` →
--     email rappel + UPDATE reminder_sent_at = now()
--
-- Nullable car le rappel n'est pas envoyé si l'utilisateur a confirmé
-- manuellement avant T+12h (le mailing passe à `submitted` directement).

ALTER TABLE public.mailings
ADD COLUMN reminder_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.mailings.reminder_sent_at IS
  'Timestamp envoi email "Confirmer l''envoi à La Poste" à T+12h. NULL tant que pas envoyé. Permet l''idempotence du cron de rappel.';
