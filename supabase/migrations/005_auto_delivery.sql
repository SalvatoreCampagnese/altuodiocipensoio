-- ===========================================================================
-- Migrazione 005 — consegna automatica dei pacchetti
--
-- Novena e trigesimo vivono nella ripetizione: la stessa intenzione, ogni
-- giorno. Il pacchetto si ricorda com'era fatta la prima preghiera e da lì in
-- poi le successive partono da sole.
-- ===========================================================================

-- --- bundles: modello e interruttore ---------------------------------------
alter table public.bundles add column if not exists auto_deliver boolean not null default true;

-- Copia della prima preghiera del pacchetto: religione, tipo, intenzione,
-- destinatario, tono, lingua. Le successive nascono da qui.
alter table public.bundles add column if not exists template jsonb;

-- Ultimo giorno in cui il cron ha creato una preghiera per questo pacchetto:
-- rende l'invio idempotente anche se il cron gira più volte.
alter table public.bundles add column if not exists last_delivered_on date;

create index if not exists bundles_auto_idx
  on public.bundles(last_delivered_on)
  where auto_deliver;

-- --- prayers: posizione nella sequenza --------------------------------------
-- "terzo giorno di novena": serve al modello per dare progressione al testo.
alter table public.prayers add column if not exists sequence_index integer;
alter table public.prayers add column if not exists sequence_total integer;

-- Il cron pesca da qui: le preghiere in coda, più vecchie prima.
create index if not exists prayers_queue_idx
  on public.prayers(created_at)
  where status in ('queued', 'failed');

-- ===========================================================================
-- ALTERNATIVA a Vercel Cron: pg_cron + pg_net, se non sei su Vercel.
-- Fa la stessa cosa — chiama l'endpoint dell'app — solo da dentro Postgres.
-- Scommenta, sostituisci dominio e CRON_SECRET, ed esegui.
-- ===========================================================================
--
-- create extension if not exists pg_cron;
-- create extension if not exists pg_net;
--
-- select cron.schedule(
--   'preghiere-automatiche',
--   '*/15 * * * *',
--   $$
--     select net.http_post(
--       url     := 'https://tuodominio.it/api/cron/prayers',
--       headers := jsonb_build_object(
--         'Content-Type',  'application/json',
--         'Authorization', 'Bearer IL_TUO_CRON_SECRET'
--       )
--     );
--   $$
-- );
--
-- -- per fermarlo:  select cron.unschedule('preghiere-automatiche');
-- -- per guardarlo: select * from cron.job_run_details order by start_time desc limit 20;
