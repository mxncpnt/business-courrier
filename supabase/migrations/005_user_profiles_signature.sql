-- Migration 005 — Édition courrier B (signature manuscrite globale)
--
-- Crée :
--   1. Table `user_profiles` avec champ `signature_storage_path` pointant
--      vers le bucket Storage privé `signatures`. Une signature globale par
--      utilisateur, réutilisée pour tous les courriers générés.
--   2. RLS + GRANTs : l'user lit/modifie SON profil (auth.uid() = id).
--   3. Bucket Storage `signatures` (privé).
--   4. Storage policies : un user peut lire/upload/supprimer SES propres
--      fichiers (path préfixé par son user_id).
--
-- L'identifiant `user_profiles.id` est une FK directe vers `auth.users.id`
-- (pattern Supabase standard). Une row par user max — INSERT déclenché
-- automatiquement à la première upload de signature.

-- ─── Table ───────────────────────────────────────────────────────────────────
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  signature_storage_path TEXT,
  signature_uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_profiles IS
  'Profil utilisateur — signature manuscrite globale réutilisée pour les courriers PDF.';
COMMENT ON COLUMN public.user_profiles.signature_storage_path IS
  'Path dans le bucket Storage `signatures` (ex: {user_id}/signature-{uuid}.png). NULL si pas de signature uploadée.';

-- Trigger updated_at automatique
CREATE OR REPLACE FUNCTION public.set_updated_at_user_profiles()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_user_profiles();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── GRANTs PostgREST (cf. feedback_supabase_grants.md) ──────────────────────
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO service_role;

-- ─── Bucket Storage `signatures` ────────────────────────────────────────────
-- Privé : les URLs ne sont pas publiques, on génère des signed URLs depuis
-- le serveur quand on a besoin d'inclure la signature dans un PDF.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'signatures',
  'signatures',
  false,
  1048576, -- 1 Mo
  ARRAY['image/png', 'image/jpeg', 'image/jpg']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ─── Storage policies ───────────────────────────────────────────────────────
-- Path convention : `{user_id}/signature-{uuid}.png`
-- Donc le 1er segment du path est le user_id. On vérifie via split_part.

CREATE POLICY "Users can read own signatures"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'signatures'
    AND (split_part(name, '/', 1)::uuid) = auth.uid()
  );

CREATE POLICY "Users can upload own signatures"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'signatures'
    AND (split_part(name, '/', 1)::uuid) = auth.uid()
  );

CREATE POLICY "Users can delete own signatures"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'signatures'
    AND (split_part(name, '/', 1)::uuid) = auth.uid()
  );
