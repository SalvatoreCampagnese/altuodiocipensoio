-- ===========================================================================
-- AlTuoDioCiPensoIO — schema Supabase
-- Esegui questo file nell'SQL Editor del progetto Supabase.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: una riga per utente autenticato
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- orders: ogni checkout Stripe (singola o bundle)
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

create table if not exists public.orders (
  id                         uuid primary key default gen_random_uuid(),
  user_id                    uuid references auth.users(id) on delete set null,
  email                      text not null,
  product_id                 text not null,
  product_name               text,
  credits                    integer not null default 1,
  cadence                    text not null default 'instant'
                               check (cadence in ('instant','daily','monthly','subscription')),
  status                     public.order_status not null default 'pending',
  amount_cents               integer not null,
  currency                   text not null default 'eur',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id   text,
  -- payload della preghiera in attesa di pagamento (solo per credits = 1)
  draft                      jsonb,
  created_at                 timestamptz not null default now(),
  paid_at                    timestamptz
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_email_idx on public.orders(lower(email));

-- ---------------------------------------------------------------------------
-- bundles: pacchetto multi-preghiera (novena, anno, trigesimo...)
-- ---------------------------------------------------------------------------
create table if not exists public.bundles (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid references public.orders(id) on delete set null,
  user_id          uuid references auth.users(id) on delete set null,
  email            text not null,
  product_id       text not null default 'year',
  product_name     text,
  total_credits    integer not null default 12,
  used_credits     integer not null default 0,
  -- ritmo di sblocco dei crediti: tutti subito, uno al giorno o uno al mese
  cadence          text not null default 'monthly'
                     check (cadence in ('instant','daily','monthly')),
  -- il credito n-esimo si sblocca a starts_at + n giorni/mesi
  starts_at        timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create index if not exists bundles_user_id_idx on public.bundles(user_id);
create index if not exists bundles_email_idx on public.bundles(lower(email));

-- Quanti crediti risultano sbloccati oggi, secondo la cadenza del pacchetto.
create or replace function public.bundle_unlocked_credits(b public.bundles)
returns integer
language sql
stable
as $$
  select case b.cadence
    when 'instant' then b.total_credits
    when 'daily' then least(
      b.total_credits,
      1 + greatest(0, floor(extract(epoch from (now() - b.starts_at)) / 86400)::int)
    )
    else least(
      b.total_credits,
      1 + greatest(
        0,
        (extract(year from age(now(), b.starts_at)) * 12
         + extract(month from age(now(), b.starts_at)))::int
      )
    )
  end;
$$;

-- ---------------------------------------------------------------------------
-- prayers: la preghiera vera e propria
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.prayer_status as enum ('draft', 'queued', 'generating', 'ready', 'failed');
exception when duplicate_object then null; end $$;

create table if not exists public.prayers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  email           text not null,
  order_id        uuid references public.orders(id) on delete set null,
  bundle_id       uuid references public.bundles(id) on delete set null,

  -- input dell'utente
  religion        text not null,
  tradition       text,
  prayer_type     text not null,
  intention       text not null,          -- messaggio personalizzato
  recipient_name  text,
  language        text not null default 'it',
  tone            text not null default 'solenne',
  scheduled_for   timestamptz,            -- "quando non posso farla io"

  -- output
  status          public.prayer_status not null default 'draft',
  title           text,
  body            text,
  audio_path      text,
  audio_duration  numeric,
  voice_id        text,
  error_message   text,

  -- token per accesso ospite (senza login) alla pagina della preghiera
  access_token    text not null default encode(gen_random_bytes(24), 'hex'),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  generated_at    timestamptz
);

create index if not exists prayers_user_id_idx  on public.prayers(user_id);
create index if not exists prayers_email_idx    on public.prayers(lower(email));
create index if not exists prayers_bundle_idx   on public.prayers(bundle_id);
create index if not exists prayers_status_idx   on public.prayers(status);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists prayers_touch_updated_at on public.prayers;
create trigger prayers_touch_updated_at
  before update on public.prayers
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- candles: il Lucernario — parete di candele votive accese per offerta libera
-- ---------------------------------------------------------------------------
create table if not exists public.candles (
  id           uuid primary key default gen_random_uuid(),
  slot         integer not null,
  order_id     uuid references public.orders(id) on delete set null,
  user_id      uuid references auth.users(id) on delete set null,
  email        text,

  -- ciò che il donatore lascia scritto sotto la candela
  donor_name   text,
  intention    text,
  religion     text,

  amount_cents integer not null default 0,
  lit_at       timestamptz not null default now(),
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);

create index if not exists candles_slot_idx    on public.candles(slot);
create index if not exists candles_expires_idx on public.candles(expires_at desc);
create index if not exists candles_email_idx   on public.candles(lower(email));

-- Le candele accese sono pubbliche: il lucernario si guarda senza login.
alter table public.candles enable row level security;

drop policy if exists "candles: lit are public" on public.candles;
create policy "candles: lit are public"
  on public.candles for select
  using (expires_at > now());

-- Le candele attualmente accese, una riga per slot occupato.
create or replace function public.lit_candles()
returns setof public.candles
language sql
stable
as $$
  select distinct on (slot) *
    from public.candles
   where expires_at > now()
   order by slot, lit_at desc;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--   Il client legge solo ciò che è suo. Tutte le scritture passano dal
--   service role nelle route server (che bypassa RLS).
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.orders   enable row level security;
alter table public.bundles  enable row level security;
alter table public.prayers  enable row level security;

drop policy if exists "profiles: self read"   on public.profiles;
drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);

drop policy if exists "orders: own read" on public.orders;
create policy "orders: own read" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "bundles: own read" on public.bundles;
create policy "bundles: own read" on public.bundles for select using (auth.uid() = user_id);

drop policy if exists "prayers: own read" on public.prayers;
create policy "prayers: own read" on public.prayers for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: bucket privato per gli mp3, servito via signed URL
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('prayers', 'prayers', false)
on conflict (id) do nothing;

drop policy if exists "prayers audio: own read" on storage.objects;
create policy "prayers audio: own read"
  on storage.objects for select
  using (
    bucket_id = 'prayers'
    and exists (
      select 1 from public.prayers p
      where p.audio_path = storage.objects.name
        and p.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- daily_prayers: la Preghiera del Giorno — una per data, uguale per tutti
--
-- Non vive in `prayers` perché il rapporto è rovesciato: là una preghiera ha
-- un destinatario, qui un testo ne ha molti. Scriverne una copia per abbonato
-- ogni mattina sarebbe la stessa riga moltiplicata per la lista.
-- ---------------------------------------------------------------------------
create table if not exists public.daily_prayers (
  id              uuid primary key default gen_random_uuid(),
  -- Chiave naturale del giorno (ora di Roma). L'unicità è ciò che rende
  -- ripetibile il cron delle 7.
  prayer_date     date not null unique,

  religion        text not null default 'cattolica',
  language        text not null default 'it',
  tone            text not null default 'solenne',
  theme           text,
  theme_label     text,

  status          public.prayer_status not null default 'queued',
  title           text,
  body            text,
  audio_path      text,
  audio_duration  numeric,
  voice_id        text,

  attempts        integer not null default 0,
  last_attempt_at timestamptz,
  error_message   text,

  generated_at    timestamptz,
  sent_at         timestamptz,
  sent_count      integer not null default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists daily_prayers_date_idx   on public.daily_prayers(prayer_date desc);
create index if not exists daily_prayers_status_idx on public.daily_prayers(status);

drop trigger if exists daily_prayers_touch_updated_at on public.daily_prayers;
create trigger daily_prayers_touch_updated_at
  before update on public.daily_prayers
  for each row execute function public.touch_updated_at();

-- Il testo è il bene venduto: dal client non si legge mai per intero. La
-- pagina pubblica passa dal service role e decide lei quanto mostrarne.
alter table public.daily_prayers enable row level security;

-- ---------------------------------------------------------------------------
-- subscriptions: chi riceve la Preghiera del Giorno
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.subscription_status as enum
    ('incomplete', 'active', 'past_due', 'canceled');
exception when duplicate_object then null; end $$;

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  order_id               uuid references public.orders(id) on delete set null,
  user_id                uuid references auth.users(id) on delete set null,
  email                  text not null,

  product_id             text not null default 'quotidiana',
  status                 public.subscription_status not null default 'incomplete',

  stripe_customer_id     text,
  stripe_subscription_id text unique,

  amount_cents           integer not null default 490,
  currency               text not null default 'eur',
  interval               text not null default 'week'
                           check (interval in ('day','week','month')),

  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  started_at             timestamptz not null default now(),
  canceled_at            timestamptz,

  -- Ultimo giorno consegnato: rende idempotente l'invio delle 9.
  last_sent_on           date,

  -- Token del link "gestisci / disdici" in fondo a ogni email: si disdice
  -- senza account e con un clic.
  manage_token           text not null default encode(gen_random_bytes(24), 'hex'),

  consent_special_data   boolean not null default false,
  consent_terms          boolean not null default false,
  consent_immediate      boolean not null default false,
  consent_at             timestamptz,
  consent_version        text,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_email_idx on public.subscriptions(lower(email));
create index if not exists subscriptions_user_idx  on public.subscriptions(user_id);
create index if not exists subscriptions_due_idx
  on public.subscriptions(last_sent_on)
  where status in ('active', 'past_due');

-- Un'email, un abbonamento attivo: senza questo un doppio clic sul bottone
-- diventa due addebiti e due copie della stessa preghiera.
create unique index if not exists subscriptions_one_active_per_email
  on public.subscriptions(lower(email))
  where status in ('active', 'past_due');

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions: own read" on public.subscriptions;
create policy "subscriptions: own read"
  on public.subscriptions for select
  using (auth.uid() = user_id);
