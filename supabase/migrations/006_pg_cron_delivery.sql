-- ===========================================================================
-- Migrazione 006 — la consegna automatica passa da Vercel Cron a pg_cron
--
-- Il piano Hobby di Vercel consente un solo cron al giorno: troppo poco per
-- una coda che deve essere svuotata a più riprese. pg_cron gira dentro
-- Postgres senza limiti di piano e chiama lo stesso endpoint, con lo stesso
-- bearer token: l'applicazione non cambia di una riga.
-- ===========================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- --- il segreto sta nel Vault -----------------------------------------------
-- Non nella definizione del job: `cron.job` è leggibile da chiunque abbia
-- accesso al database, e ci finirebbe in chiaro il CRON_SECRET.
--
-- Da eseguire UNA VOLTA, sostituendo il valore (non è idempotente: se lo
-- rilanci crea un secondo segreto con lo stesso nome):
--
--   select vault.create_secret('IL_TUO_CRON_SECRET', 'cron_secret');
--
-- Per cambiarlo in seguito:
--
--   select vault.update_secret(
--     (select id from vault.secrets where name = 'cron_secret'),
--     'IL_NUOVO_CRON_SECRET'
--   );

-- --- il giro ----------------------------------------------------------------
-- Ogni quarto d'ora, ma solo fra le 6 e le 22 di Roma.
--
-- La finestra oraria sta nel corpo del job e non nell'espressione cron perché
-- pg_cron ragiona in UTC: un `4-20 * * *` sarebbe giusto d'estate e sbagliato
-- d'inverno. Con `at time zone 'Europe/Rome'` l'ora legale si sposta da sola.
--
-- Il giro è idempotente (`bundles.last_delivered_on`), quindi le chiamate
-- fuori finestra che non partono non lasciano buchi: la prima chiamata utile
-- del mattino recupera tutto l'arretrato.
select cron.schedule(
  'preghiere-automatiche',
  '*/15 * * * *',
  $$
    select net.http_post(
      url     := 'https://altuodiocipensoio.com/api/cron/prayers',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret
            from vault.decrypted_secrets
           where name = 'cron_secret'
        )
      ),
      -- Il default di pg_net è 5 s: qui sarebbe sbagliato. L'endpoint lavora
      -- in modo sincrono e può impiegare fino a CRON_TIME_BUDGET_SECONDS
      -- (240) prima di rispondere, quindi curl abortirebbe la connessione a
      -- ogni giro, mentre una preghiera è a metà generazione. Teniamo il
      -- timeout allineato al `maxDuration = 300` della route.
      timeout_milliseconds := 300000
    )
    where extract(hour from (now() at time zone 'Europe/Rome')) between 6 and 22;
  $$
);

-- ---------------------------------------------------------------------------
-- per fermarlo:   select cron.unschedule('preghiere-automatiche');
-- per guardarlo:  select * from cron.job_run_details order by start_time desc limit 20;
-- per le risposte HTTP (pg_net le tiene qualche ora):
--   select * from net._http_response order by created desc limit 20;
-- ---------------------------------------------------------------------------
