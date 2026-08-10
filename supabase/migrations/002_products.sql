-- ===========================================================================
-- Migrazione 002 — listino a più prodotti
--
-- Serve SOLO se hai già eseguito la prima versione di schema.sql (quella con
-- `orders.kind` = single/bundle). Su un database nuovo basta schema.sql.
--
-- Passa da due prodotti fissi a un catalogo aperto pilotato dalle variabili
-- d'ambiente: ogni ordine e ogni pacchetto porta con sé prodotto, numero di
-- crediti e ritmo di sblocco.
-- ===========================================================================

-- --- orders ----------------------------------------------------------------
alter table public.orders add column if not exists product_id   text;
alter table public.orders add column if not exists product_name text;
alter table public.orders add column if not exists credits      integer not null default 1;
alter table public.orders add column if not exists cadence      text    not null default 'instant';

-- Travasa i vecchi valori di `kind` nel nuovo modello.
update public.orders
   set product_id = coalesce(product_id, case when kind::text = 'bundle' then 'year' else 'single' end),
       credits    = case when kind::text = 'bundle' then 12 else 1 end,
       cadence    = case when kind::text = 'bundle' then 'monthly' else 'instant' end
 where product_id is null;

alter table public.orders alter column product_id set not null;

do $$ begin
  alter table public.orders
    add constraint orders_cadence_check check (cadence in ('instant','daily','monthly'));
exception when duplicate_object then null; end $$;

alter table public.orders drop column if exists kind;
drop type if exists public.order_kind;

-- --- bundles ---------------------------------------------------------------
alter table public.bundles add column if not exists product_id   text not null default 'year';
alter table public.bundles add column if not exists product_name text;
alter table public.bundles add column if not exists cadence      text not null default 'monthly';

do $$ begin
  alter table public.bundles
    add constraint bundles_cadence_check check (cadence in ('instant','daily','monthly'));
exception when duplicate_object then null; end $$;

-- --- sblocco crediti secondo cadenza ---------------------------------------
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
