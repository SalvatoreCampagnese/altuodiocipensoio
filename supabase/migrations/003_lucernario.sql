-- ===========================================================================
-- Migrazione 003 — Lucernario
--
-- Una parete di candele votive. Ogni candela è uno slot numerato: chi fa
-- un'offerta libera ne accende una, che resta accesa per un numero di ore
-- configurabile (24 di default) e poi si spegne da sola liberando lo slot.
-- ===========================================================================

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
