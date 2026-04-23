-- ============================================
-- Migration 001 : Schéma initial Courrier IA
-- ============================================

-- Table des courriers
create table public.letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  type text not null,
  form_data jsonb not null default '{}',
  generated_text text,
  final_text text,
  status text not null default 'draft' check (status in ('draft', 'paid', 'delivered')),
  pdf_path text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- Table des paiements
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

-- Index pour les requêtes fréquentes
create index idx_letters_user_id on public.letters(user_id);
create index idx_letters_email on public.letters(email);
create index idx_letters_status on public.letters(status);
create index idx_payments_letter_id on public.payments(letter_id);
create index idx_payments_stripe_session on public.payments(stripe_checkout_session_id);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.letters enable row level security;
alter table public.payments enable row level security;

-- Utilisateurs connectés : voir uniquement leurs courriers
create policy "Users can view own letters"
  on public.letters for select
  using (auth.uid() = user_id);

-- Utilisateurs connectés : créer des courriers
create policy "Users can insert own letters"
  on public.letters for insert
  with check (auth.uid() = user_id or user_id is null);

-- Utilisateurs connectés : modifier leurs courriers (texte édité)
create policy "Users can update own letters"
  on public.letters for update
  using (auth.uid() = user_id);

-- Service role (backend) : accès total via SUPABASE_SERVICE_ROLE_KEY
-- Pas besoin de policy, le service_role bypass RLS par défaut

-- Payments : lecture seule pour l'utilisateur via ses letters
create policy "Users can view own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.letters
      where letters.id = payments.letter_id
      and letters.user_id = auth.uid()
    )
  );

-- Bucket Storage pour les PDFs
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- Policy storage : téléchargement uniquement pour le propriétaire
create policy "Users can download own PDFs"
  on storage.objects for select
  using (
    bucket_id = 'pdfs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
