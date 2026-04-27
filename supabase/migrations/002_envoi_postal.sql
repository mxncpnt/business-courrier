-- ============================================
-- Migration 002 : Envoi postal physique
-- ============================================
-- Tables pour gérer l'envoi physique des courriers via un provider postal
-- (MySendingBox au MVP, abstraction prête pour multi-provider).

-- Table des envois physiques (1 mailing = 1 commande d'envoi)
create table public.mailings (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,

  -- Mode d'envoi
  mode text not null check (mode in ('simple', 'tracked', 'registered')),

  -- Provider et identifiants externes
  provider text not null default 'mysendingbox',
  provider_mailing_id text, -- ID retourné par le provider après submission
  tracking_number text,     -- Numéro de suivi La Poste si fourni

  -- Snapshot adresse expéditeur (figé au moment de la commande)
  sender_name text not null,
  sender_address_line1 text not null,
  sender_address_line2 text,
  sender_zipcode text not null,
  sender_city text not null,
  sender_country text not null default 'FR',

  -- Snapshot adresse destinataire (figé au moment de la commande)
  recipient_name text not null,
  recipient_address_line1 text not null,
  recipient_address_line2 text,
  recipient_zipcode text not null,
  recipient_city text not null,
  recipient_country text not null default 'FR',

  -- Validation d'adresse destinataire (via API provider)
  recipient_address_validated boolean not null default false,
  recipient_address_validated_at timestamptz,

  -- Tarification (snapshot — permet une marge différenciée future sans migration)
  cost_cents integer not null,        -- Coût provider HT
  markup_cents integer not null default 0, -- Marge JusteCourrier (0 au MVP)
  total_cents integer not null,        -- Ce qui est facturé au client TTC

  -- Statut du mailing
  status text not null default 'pending' check (status in (
    'pending',     -- Créé en DB, paiement Stripe en attente
    'paid',        -- Paiement reçu, à transmettre au provider
    'submitted',   -- Transmis au provider, en attente preuve dépôt
    'in_transit',  -- En cours d'acheminement
    'delivered',   -- Distribué (simple/suivie) ou retiré (recommandé)
    'returned',    -- NPAI / refusé / non retiré
    'failed'       -- Erreur provider, impression, ou validation adresse
  )),

  -- Preuves (URLs Supabase Storage)
  proof_of_deposit_url text, -- Preuve de dépôt (suivie + recommandé)
  proof_of_receipt_url text, -- AR signé (recommandé uniquement)

  -- Pièces jointes (Phase 4.3)
  -- Format : [{ name: string, storage_path: string, size_bytes: number }]
  attachments jsonb not null default '[]',

  -- Stripe (le mailing est lié au même checkout que la lettre)
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,

  -- Dernière activité (pour tri rapide UI)
  last_event_at timestamptz,
  last_event_status text,

  created_at timestamptz not null default now(),
  paid_at timestamptz,
  submitted_at timestamptz,
  delivered_at timestamptz
);

-- Journal des événements provider (audit + idempotence webhooks)
create table public.mailing_events (
  id uuid primary key default gen_random_uuid(),
  mailing_id uuid not null references public.mailings(id) on delete cascade,
  provider_event_id text,    -- ID événement chez le provider (idempotence)
  event_type text not null,  -- Ex: 'submitted', 'in_transit', 'delivered'
  payload jsonb not null,    -- Payload brut provider (audit complet)
  occurred_at timestamptz not null,
  received_at timestamptz not null default now()
);

-- Indexes
create index idx_mailings_letter_id on public.mailings(letter_id);
create index idx_mailings_user_id on public.mailings(user_id);
create index idx_mailings_status on public.mailings(status);
create index idx_mailings_provider_mailing_id on public.mailings(provider_mailing_id);
create index idx_mailings_stripe_session on public.mailings(stripe_checkout_session_id);
create index idx_mailing_events_mailing_id on public.mailing_events(mailing_id);
create unique index idx_mailing_events_provider_event
  on public.mailing_events(provider_event_id)
  where provider_event_id is not null;

-- ============================================
-- Row Level Security
-- ============================================

alter table public.mailings enable row level security;
alter table public.mailing_events enable row level security;

-- Utilisateurs : voir uniquement leurs propres envois
create policy "Users can view own mailings"
  on public.mailings for select
  using (auth.uid() = user_id);

-- Utilisateurs : créer un envoi pour leur propre courrier
create policy "Users can insert own mailings"
  on public.mailings for insert
  with check (auth.uid() = user_id or user_id is null);

-- Utilisateurs : modifier leur envoi (pour édition adresse avant paiement)
create policy "Users can update own mailings pending"
  on public.mailings for update
  using (auth.uid() = user_id and status = 'pending');

-- Événements visibles via le mailing parent
create policy "Users can view own mailing events"
  on public.mailing_events for select
  using (
    exists (
      select 1 from public.mailings
      where mailings.id = mailing_events.mailing_id
      and mailings.user_id = auth.uid()
    )
  );

-- ============================================
-- GRANTs PostgREST (obligatoire — apply_migration ne le fait pas)
-- ============================================

grant select, insert, update on public.mailings to authenticated;
grant select on public.mailing_events to authenticated;
grant select, insert, update on public.mailings to service_role;
grant select, insert on public.mailing_events to service_role;

-- Bucket Storage pour les preuves et pièces jointes
insert into storage.buckets (id, name, public)
values ('mailings', 'mailings', false)
on conflict (id) do nothing;

-- Storage : téléchargement uniquement pour le propriétaire (pattern user_id/...)
create policy "Users can download own mailing files"
  on storage.objects for select
  using (
    bucket_id = 'mailings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload own mailing files"
  on storage.objects for insert
  with check (
    bucket_id = 'mailings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
