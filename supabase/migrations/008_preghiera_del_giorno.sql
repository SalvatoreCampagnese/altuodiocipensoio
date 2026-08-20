-- ===========================================================================
-- Migrazione 008 — Preghiera del Giorno (abbonamento)
--
-- Il prodotto di punta: 0,70 € al giorno, addebitati 4,90 € a settimana.
-- Ogni mattina alle 7 (ora di Roma) si compone UNA preghiera, la stessa per
-- tutti, e alle 9 parte via email a chi è abbonato.
--
-- Due tabelle e nient'altro:
--   daily_prayers  — una riga per giorno, il testo del giorno
--   subscriptions  — chi è abbonato, e fin quando
--
-- La preghiera del giorno NON vive in `prayers`: quella tabella è fatta per
-- il su misura (una preghiera, un destinatario, un ordine). Qui il rapporto
-- è rovesciato — un testo, molti destinatari — e forzarlo in `prayers`
-- vorrebbe dire scrivere N righe identiche ogni mattina.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- orders / bundles: la cadenza 'subscription'
-- ---------------------------------------------------------------------------
-- Un abbonamento non ha crediti che si sbloccano: ha un periodo pagato che
-- scade. Il vincolo va allargato prima di poterne inserire uno.
alter table public.orders drop constraint if exists orders_cadence_check;
alter table public.orders
  add constraint orders_cadence_check
  check (cadence in ('instant','daily','monthly','subscription'));

-- ---------------------------------------------------------------------------
-- daily_prayers — il testo del giorno, uno solo, uguale per tutti
-- ---------------------------------------------------------------------------
create table if not exists public.daily_prayers (
  id              uuid primary key default gen_random_uuid(),

  -- Chiave naturale del giorno, in ora di Roma. È unica: è ciò che rende
  -- ripetibile il cron delle 7 senza generare due preghiere per lo stesso
  -- giorno se scatta due volte.
  prayer_date     date not null unique,

  religion        text not null default 'cattolica',
  language        text not null default 'it',
  tone            text not null default 'solenne',
  -- Il filo conduttore del giorno, scelto a rotazione: serve al modello per
  -- non scrivere trenta volte la stessa preghiera generica.
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
  -- Quando è partito l'invio di massa, e a quante persone.
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

-- Il testo è il bene venduto: dal client non si legge. La pagina pubblica
-- passa dal service role e decide lei quanto mostrarne (titolo e primo
-- paragrafo a tutti, il resto agli abbonati).
alter table public.daily_prayers enable row level security;

-- ---------------------------------------------------------------------------
-- subscriptions — chi riceve la preghiera del giorno
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
  -- Unico: è la chiave con cui il webhook ritrova l'abbonamento senza
  -- crearne un secondo quando Stripe rimanda lo stesso evento.
  stripe_subscription_id text unique,

  amount_cents           integer not null default 490,
  currency               text not null default 'eur',
  -- Ogni quanto si paga: 'day' | 'week' | 'month'.
  interval               text not null default 'week'
                           check (interval in ('day','week','month')),

  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  started_at             timestamptz not null default now(),
  canceled_at            timestamptz,

  -- Ultimo giorno in cui questo abbonato ha ricevuto la preghiera. Rende
  -- l'invio delle 9 idempotente: se il cron riparte, chi ha già ricevuto
  -- non riceve due volte.
  last_sent_on           date,

  -- Token del link "gestisci / disdici" in fondo a ogni email. Un abbonato
  -- deve poter disdire senza avere un account: la disdetta a un clic non è
  -- una cortesia, è ciò che tiene le email fuori dallo spam.
  --
  -- Il token NON usa `gen_random_bytes()`: quella funzione è di pgcrypto, che su
  -- Supabase vive nello schema `extensions`. L'SQL Editor ce l'ha nel
  -- search_path e il runner delle migrazioni no, quindi lo stesso file
  -- funzionava a mano e falliva con `supabase db push`. Qualificarla come
  -- `extensions.gen_random_bytes` sposterebbe solo il problema: su un progetto
  -- dove pgcrypto sta in `public` fallirebbe l'opposto.
  -- `gen_random_uuid()` è invece nel core di Postgres dalla 13, non richiede
  -- estensioni, ed è già la sorgente casuale di ogni chiave primaria di questo
  -- schema. Due UUID concatenati e ripuliti dai trattini danno 64 caratteri
  -- esadecimali, cioè 244 bit di entropia contro i 192 di 24 byte: più di
  -- prima, e senza dipendenze.
  manage_token           text not null
                           default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),

  -- Prova del consenso, come per gli ordini (art. 7 par. 1 GDPR).
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
-- L'indice che serve al cron delle 9: gli attivi che oggi non hanno ancora
-- ricevuto. Parziale, perché i disdetti non vanno nemmeno guardati.
create index if not exists subscriptions_due_idx
  on public.subscriptions(last_sent_on)
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

-- ---------------------------------------------------------------------------
-- Un'email = un abbonamento attivo. Senza questo vincolo un doppio clic sul
-- bottone produce due abbonamenti e due addebiti, e l'utente riceve la stessa
-- preghiera due volte pagandola il doppio.
-- ---------------------------------------------------------------------------
create unique index if not exists subscriptions_one_active_per_email
  on public.subscriptions(lower(email))
  where status in ('active', 'past_due');

comment on column public.subscriptions.manage_token is
  'Token del link di disdetta in fondo a ogni email: consente di annullare senza account.';
comment on table public.daily_prayers is
  'La preghiera del giorno: una riga per data, uguale per tutti gli abbonati.';
