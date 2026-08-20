-- ===========================================================================
-- Migrazione 009 — i due appuntamenti della Preghiera del Giorno
--
--   07:00 Roma  →  si compone la preghiera del giorno (testo + voce)
--   09:00 Roma  →  parte l'email a tutti gli abbonati
--
-- Due ore di margine fra i due momenti: comporre testo e audio richiede
-- meno di un minuto, ma se OpenAI o ElevenLabs hanno una brutta mattina
-- c'è tutto il tempo per accorgersene e per il tentativo delle 8.
--
-- Come in 006, la finestra oraria sta nel CORPO del job e non
-- nell'espressione cron: pg_cron ragiona in UTC, e un orario fisso sarebbe
-- giusto d'inverno e sbagliato d'estate. Con `at time zone 'Europe/Rome'`
-- l'ora legale si sposta da sola.
--
-- Entrambi i giri sono idempotenti — `daily_prayers.prayer_date` è unica,
-- `subscriptions.last_sent_on` segna chi ha già ricevuto — quindi l'ora di
-- riserva non fa danni: se il primo tentativo è andato, il secondo trova
-- tutto già fatto e non fa nulla.
-- ===========================================================================

-- Il segreto è lo stesso di 006 (`cron_secret` nel Vault): non va ricreato.

-- --- 07:00 — composizione ---------------------------------------------------
select cron.unschedule('preghiera-del-giorno-genera')
 where exists (select 1 from cron.job where jobname = 'preghiera-del-giorno-genera');

select cron.schedule(
  'preghiera-del-giorno-genera',
  '0 * * * *',
  $$
    select net.http_post(
      url     := 'https://altuodiocipensoio.com/api/cron/preghiera-del-giorno?step=genera',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret'
        )
      ),
      timeout_milliseconds := 300000
    )
    -- Le 7, più le 8 come secondo tentativo se il primo è fallito.
    where extract(hour from (now() at time zone 'Europe/Rome')) between 7 and 8;
  $$
);

-- --- 09:00 — invio ----------------------------------------------------------
select cron.unschedule('preghiera-del-giorno-invia')
 where exists (select 1 from cron.job where jobname = 'preghiera-del-giorno-invia');

select cron.schedule(
  'preghiera-del-giorno-invia',
  '0,20,40 * * * *',
  $$
    select net.http_post(
      url     := 'https://altuodiocipensoio.com/api/cron/preghiera-del-giorno?step=invia',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret'
        )
      ),
      timeout_milliseconds := 300000
    )
    -- Ogni 20 minuti fra le 9 e le 10: un giro solo spedisce al massimo
    -- CRON_MAIL_BATCH indirizzi, quindi con molti abbonati servono più
    -- passaggi per svuotare la lista. Chi ha già ricevuto viene saltato.
    where extract(hour from (now() at time zone 'Europe/Rome')) between 9 and 10;
  $$
);

-- ---------------------------------------------------------------------------
-- per fermarli:
--   select cron.unschedule('preghiera-del-giorno-genera');
--   select cron.unschedule('preghiera-del-giorno-invia');
-- per guardarli:
--   select * from cron.job_run_details order by start_time desc limit 20;
-- per provare a mano, senza aspettare le 7:
--   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
--     'https://altuodiocipensoio.com/api/cron/preghiera-del-giorno?step=genera'
-- ---------------------------------------------------------------------------
