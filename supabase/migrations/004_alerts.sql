-- ===========================================================================
-- Migrazione 004 — generazione asincrona e allerte
--
-- Toglie di mezzo il pulsante "Riprova": i tentativi li fa il sistema, e
-- quando non ce la fa lascia una traccia qui e manda un'email al gestore.
-- ===========================================================================

-- --- prayers: contatore dei tentativi --------------------------------------
alter table public.prayers add column if not exists attempts        integer not null default 0;
alter table public.prayers add column if not exists last_attempt_at timestamptz;

-- Serve a ripescare le preghiere piantate in 'generating' da troppo tempo.
create index if not exists prayers_generating_idx
  on public.prayers(last_attempt_at)
  where status = 'generating';

-- --- alerts: cosa è andato storto ------------------------------------------
create table if not exists public.alerts (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null,                 -- es. 'generation_failed'
  severity    text not null default 'error'  check (severity in ('info','warning','error')),
  message     text not null,
  prayer_id   uuid references public.prayers(id) on delete set null,
  order_id    uuid references public.orders(id) on delete set null,
  email       text,                          -- utente coinvolto
  context     jsonb,
  notified    boolean not null default false,-- email al gestore partita?
  resolved_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists alerts_created_idx  on public.alerts(created_at desc);
create index if not exists alerts_kind_idx     on public.alerts(kind);
create index if not exists alerts_unresolved_idx on public.alerts(created_at desc)
  where resolved_at is null;

-- Nessuno può leggerle dal client: si guardano dalla dashboard di Supabase.
alter table public.alerts enable row level security;

-- Le ultime allerte ancora aperte, per un'occhiata veloce nell'SQL Editor.
create or replace view public.open_alerts as
  select a.id, a.created_at, a.kind, a.severity, a.message, a.email,
         a.prayer_id, a.context
    from public.alerts a
   where a.resolved_at is null
   order by a.created_at desc;
