-- ===========================================================================
-- Migrazione 007 — prova del consenso
--
-- L'art. 7 par. 1 GDPR non chiede di raccogliere il consenso: chiede di poter
-- DIMOSTRARE di averlo raccolto. Una spunta che vive solo nel browser non
-- dimostra niente, quindi il consenso va registrato accanto all'ordine cui si
-- riferisce, con il momento e la versione dei testi accettati.
--
-- La versione serve al caso concreto: se fra un anno riscrivi l'informativa e
-- qualcuno contesta, devi poter dire quale testo aveva davanti quel giorno.
--
-- NON registriamo l'indirizzo IP. Sarebbe un dato personale in più da
-- proteggere, e per dimostrare il consenso bastano identità dell'utente,
-- momento e versione: il principio di minimizzazione (art. 5 par. 1 lett. c)
-- dice di non raccogliere ciò che non serve.
-- ===========================================================================

-- Consenso esplicito al trattamento dei dati che rivelano convinzioni
-- religiose e, spesso, dati sulla salute di terzi (art. 9 par. 2 lett. a).
alter table public.orders add column if not exists consent_special_data boolean not null default false;

-- Accettazione di termini e informativa privacy.
alter table public.orders add column if not exists consent_terms boolean not null default false;

-- Dichiarazione di avere titolo per fornire dati riferiti ad altre persone
-- (il malato, il defunto, il destinatario della preghiera).
alter table public.orders add column if not exists consent_third_party boolean not null default false;

-- Richiesta di esecuzione immediata con rinuncia al recesso: senza questa
-- il contenuto digitale non andrebbe consegnato prima di 14 giorni
-- (art. 59 comma 1 lett. o, D.Lgs. 206/2005).
alter table public.orders add column if not exists consent_immediate boolean not null default false;

alter table public.orders add column if not exists consent_at timestamptz;

-- Versione dei testi accettati, da LEGAL_VERSION in src/lib/legal.ts.
alter table public.orders add column if not exists consent_version text;

-- Per rispondere a "mostrami la prova del consenso per questo ordine" senza
-- scansionare l'intera tabella.
create index if not exists orders_consent_idx
  on public.orders(consent_at desc)
  where consent_special_data;

comment on column public.orders.consent_special_data is
  'Consenso esplicito ex art. 9 par. 2 lett. a GDPR ai dati religiosi e di salute.';
comment on column public.orders.consent_immediate is
  'Richiesta di esecuzione immediata con perdita del diritto di recesso, art. 59 Cod. Consumo.';
