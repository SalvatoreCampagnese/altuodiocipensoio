# AlTuoDioCiPensoIO

Preghiere personalizzate, scritte e recitate a voce, per i momenti in cui non
riesci a pregare tu.

L'utente sceglie la propria tradizione religiosa, il tipo di preghiera e scrive
la sua intenzione. OpenAI compone il testo rispettando le formule di quella
tradizione, ElevenLabs lo recita con una voce grave e posata, Stripe raccoglie
l'offerta.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Supabase (auth, Postgres, Storage) · Stripe · OpenAI · ElevenLabs · Resend

## Il listino

| Prodotto | Preghiere | Ritmo | Offerta |
|---|---|---|---|
| Una preghiera | 1 | subito | 2,90 € |
| Novena | 9 | una al giorno | 14,90 € |
| L'anno | 12 | una al mese | 19,90 € |
| Trigesimo | 30 | una al giorno | 39,90 € |
| **Lucernario** | una candela accesa 24 h | — | **importo libero** |

Nessun valore è scritto nel codice: prezzo, numero di preghiere, ritmo di
sblocco, attivazione e nome di ogni prodotto si governano dalle variabili
d'ambiente (sezione LISTINO in `.env.example`). Le pagine che mostrano prezzi
sono `force-dynamic`: cambi la variabile, riavvii, ed è fatta — nessun rebuild.

```bash
PRODUCT_SINGLE_CENTS=390        # alza la singola a 3,90 €
PRODUCT_TRIGESIMO_ENABLED=false # toglie il trigesimo dal sito
LUCERNARIO_SLOTS=100            # raddoppia le candele
```

---

## Avvio rapido

```bash
npm install
cp .env.example .env.local     # poi compila le chiavi (sotto)
npm run dev
```

L'app parte anche senza chiavi: le pagine si vedono, il checkout risponde
`503` con un messaggio chiaro finché non configuri i servizi.

---

## Configurazione

### 1. Supabase

1. Crea un progetto su [supabase.com](https://supabase.com).
2. **SQL Editor** → incolla ed esegui `supabase/schema.sql`. Crea tabelle,
   trigger, policy RLS e il bucket privato `prayers`.
3. **Project Settings → API** → copia in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo server, mai esposta al client)
4. **Authentication → URL Configuration** → aggiungi
   `http://localhost:3000/auth/callback` fra i Redirect URLs (e il dominio di
   produzione quando pubblichi).

### 2. Stripe

1. **Developers → API keys** → `STRIPE_SECRET_KEY`.
2. Facoltativo: crea un Price one-time in EUR per prodotto e mettilo in
   `PRODUCT_<ID>_STRIPE_PRICE`. Se li lasci vuoti, l'app costruisce i prezzi al
   volo dai `*_CENTS` e funziona lo stesso. Il Lucernario usa sempre un importo
   variabile, quindi non ha e non può avere un Price ID.
3. Webhook in locale:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Copia il `whsec_...` che stampa in `STRIPE_WEBHOOK_SECRET`.

   In produzione: **Developers → Webhooks → Add endpoint** su
   `https://tuodominio.it/api/webhooks/stripe`, eventi
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.expired`, `checkout.session.async_payment_failed`,
   `charge.refunded`.

### 3. Email — Resend

**Stripe non può recapitare il contenuto digitale**: le sue email sono ricevute
di pagamento e non accettano corpo personalizzato né allegati. Da Stripe
prendiamo l'indirizzo (lo raccoglie al checkout e finisce in `orders.email`),
l'invio lo fa `src/lib/mailer.ts` via Resend.

Servono `RESEND_API_KEY` e `EMAIL_FROM` su un dominio verificato in Resend.
Senza chiave il servizio funziona lo stesso: niente email, e la preghiera resta
raggiungibile dal suo link privato. Un invio fallito non fa mai fallire la
generazione.

Due messaggi: *la tua preghiera è pronta* (testo completo più link all'audio) e
*la tua candela è accesa*.

### 4. OpenAI

`OPENAI_API_KEY` da [platform.openai.com](https://platform.openai.com).
`OPENAI_MODEL` è `gpt-4o` di default.

### 5. ElevenLabs

`ELEVENLABS_API_KEY` da [elevenlabs.io](https://elevenlabs.io).
`ELEVENLABS_VOICE_ID` è preimpostata su una voce baritonale (`Daniel`), la più
vicina a un timbro da omelia. Per cambiarla, prendi un Voice ID dalla Voice
Library e incollalo. Puoi definire voci alternative per l'arabo e per il timbro
femminile con `ELEVENLABS_VOICE_ID_ARABIC` e `ELEVENLABS_VOICE_ID_FEMALE`.

---

## Come funziona dentro

### Preghiera singola (2,90 €)

```
/nuova-preghiera  →  POST /api/checkout
                     crea orders(status=pending, draft=payload)
                     → Stripe Checkout
                        ↓ pagamento
     webhook checkout.session.completed  →  fulfillPaidSession()
                     orders.status=paid, crea prayers(status=queued)
                        ↓
     /grazie?session_id=…  →  verifica su Stripe e completa se il webhook
                              non è ancora arrivato → redirect
                        ↓
     /preghiera/[id]?token=…  →  POST /api/prayers/[id]/generate
                     OpenAI → ElevenLabs → Storage → status=ready
```

Il draft resta nell'ordine finché il pagamento non è confermato: nessuna
preghiera viene generata prima di incassare. Quando è pronta, `generatePrayer()`
manda anche l'email con testo e link all'audio.

### Pacchetti (novena, anno, trigesimo)

Offerta unica che crea un record `bundles` con i crediti del prodotto e la sua
`cadence`. I crediti si sbloccano secondo il ritmo: il primo subito, gli altri
uno al giorno (novena, trigesimo) o uno al mese (l'anno) — `unlockedCredits` in
`src/lib/types.ts` e la funzione SQL gemella `bundle_unlocked_credits`. I
crediti non usati si accumulano e non scadono. Da `/dashboard/nuova` l'utente
ne consuma uno con `POST /api/bundle/redeem`, senza lasciare altra offerta.

### Lucernario (importo libero)

Una parete di 50 candele votive su `/lucernario`. L'utente sceglie una candela
spenta, decide lui quanto pagare (minimo configurabile) e dopo il pagamento
la candela si accende per 24 ore con il suo nome e la sua dedica sotto.

Le candele **non vengono spente da nessun job**: `loadWall()` filtra per
`expires_at > now()`, quindi allo scadere spariscono da sole e lo slot torna
libero. Se fra la scelta e il pagamento qualcun altro occupa la stessa
postazione, `lightCandle()` ne assegna un'altra libera invece di far perdere
l'offerta.

### Consegna automatica (il cron)

Novena e trigesimo vivono nella ripetizione: senza automatismo l'utente
dovrebbe venirsi a prendere il credito a mano ogni giorno, e il prodotto
perderebbe il suo senso.

**La prima preghiera del pacchetto diventa il modello.** L'utente la scrive
normalmente dalla dashboard; `bundles.template` la conserva e da lì in poi le
successive nascono da sola. È la logica del rito: una novena è la stessa
intenzione ripetuta nove giorni, non nove preghiere diverse. Il prompt riceve
anche la posizione nella sequenza (`sequence_index` / `sequence_total`), così
la prima apre il cammino, le intermedie tengono la perseveranza e l'ultima
chiude e affida l'esito.

`GET|POST /api/cron/prayers` fa un giro in due tempi:

1. **Accoda** — per ogni pacchetto con consegna automatica attiva, modello
   salvato, almeno un credito sbloccato e nessuna consegna oggi, scala il
   credito e crea la preghiera in stato `queued`.
2. **Svuota** — genera fino a `CRON_BATCH_SIZE` preghiere in coda, fermandosi
   con 60 s di margine sul budget per non farsi uccidere a metà.

Il secondo passo raccoglie anche le preghiere rimesse in coda da un tentativo
fallito: **il cron è la rete di sicurezza di tutto il sistema**, non solo dei
pacchetti. Chi chiude la pagina prima che la generazione finisca la riceve
comunque via email.

Il giro è idempotente — `bundles.last_delivered_on` blocca i doppioni — quindi
può girare ogni quarto d'ora senza danni.

L'utente può sospendere tutto con l'interruttore in dashboard
(`bundles.auto_deliver`): i crediti restano suoi e li usa a mano quando vuole.

**Perché pg_cron e non Vercel Cron.** Il piano Hobby di Vercel consente **un
solo cron al giorno**: troppo poco per una coda che va svuotata a più riprese,
e che è anche la rete di sicurezza delle generazioni fallite. pg_cron gira
dentro Postgres senza limiti di piano.

A spostarsi è solo la *pianificazione*, non l'*esecuzione*: il lavoro vero
(OpenAI, ElevenLabs, Storage, email) resta in TypeScript con gli SDK già
collegati, e pg_net si limita a chiamare lo stesso endpoint con lo stesso
bearer token. Il codice dell'applicazione non cambia di una riga.

Pianificazione in `supabase/migrations/006_pg_cron_delivery.sql`: ogni 15
minuti, ma solo fra le 6 e le 22 di Roma. La finestra oraria sta nel corpo del
job e non nell'espressione cron perché pg_cron ragiona in UTC — con
`at time zone 'Europe/Rome'` l'ora legale si sposta da sola. Il `CRON_SECRET`
sta nel Vault di Supabase, non nella definizione del job: `cron.job` è
leggibile da chiunque abbia accesso al database.

Resta una dipendenza da Vercel: `maxDuration = 300` sulla route, che è l'unica
cosa a limitare la durata di un giro.

### Le landing indicizzabili

Il traffico non arriva cercando «AlTuoDioCiPensoIO»: arriva cercando «preghiera
per la guarigione» o «duʿāʾ per un esame». Le landing esistono per intercettarlo.

**Due assi separati, mai incrociati.** `/preghiere/[fede]` sono 15 pagine, una
per tradizione. `/preghiera-per/[intenzione]` sono 12 pagine, una per bisogno.
Il prodotto cartesiano — 15 × 12 = 180 pagine tipo «preghiera di guarigione
cattolica» — è escluso di proposito: sarebbero varianti dello stesso testo col
nome della fede sostituito, cioè il pattern che la policy **Scaled Content
Abuse** di Google colpisce dal 2024 e su cui ha emesso manual action a giugno
2025. L'incrocio vive come *sezione* dentro la pagina della tradizione, dove ha
contenuto suo.

La regola per chi aggiunge una landing sta in `src/lib/landings/types.ts`: se il
testo che stai scrivendo funzionerebbe anche per un'altra fede cambiando due
parole, non scriverlo.

**Come si misura quale funziona.** Ogni CTA porta `?da=<landing>` nell'URL. Il
form parcheggia quel valore in `localStorage` (`src/lib/track.ts`) perché fra il
clic e la conversione c'è il checkout di Stripe, che porta l'utente fuori dal
sito e azzera lo stato in memoria. Al ritorno `/grazie` reindirizza attaccando
`?nuovo=<prodotto>`, e `ConversionTracker` — montato nel layout, non su
`/grazie`, che quasi sempre reindirizza — emette l'evento `conversione`.

Il divario fra `cta_landing`, `checkout_avviato` e `conversione` dice tre cose
diverse: quale landing attira, quale convince a iniziare, quale porta soldi.

### Consenso e dati particolari

La tradizione religiosa che l'utente sceglie rivela le sue convinzioni; se
scrive di una malattia, quello è un dato sulla salute. Sono entrambi dati
dell'**art. 9 GDPR**, vietati salvo eccezioni — e l'eccezione su cui il servizio
si fonda è il consenso esplicito.

Da qui tre conseguenze nel codice, non solo nei testi:

1. **Le caselle sono separate e mai pre-spuntate** (`ConsentBlock.tsx`). Un
   consenso ai dati particolari raccolto insieme all'accettazione dei termini
   non è né specifico né distinguibile, quindi non vale.
2. **Il rifiuto è lato server.** `consentSchema` accetta solo `true`: una spunta
   aggirata negli strumenti per sviluppatori non passa comunque.
3. **La prova resta a database** con data e versione dei testi
   (`007_consent.sql`). L'art. 7 par. 1 non chiede di raccogliere il consenso:
   chiede di poter dimostrare di averlo raccolto, anche fra due anni.

Il disclaimer su IA, voce sintetica e assenza di affiliazione sta **sopra il
bottone di acquisto**, non nel footer: è dove l'utente decide di pagare.

Dati del titolare, fornitori e tempi di conservazione stanno tutti in
`src/lib/legal.ts`. Finché `HOLDER` è vuoto, ogni pagina legale e il footer
mostrano un avviso visibile — il sito non deve poter andare online con
un'informativa senza titolare. Stato completo e cosa manca: `docs/compliance.md`.

**Nota sui fornitori.** Il piano Free di ElevenLabs non include la licenza
commerciale, e questo servizio vende l'audio generato: serve almeno lo Starter.
Il Creator è il primo piano su cui il catalogo sta in piedi, perché un trigesimo
da solo consuma ~45.000 caratteri contro i 30.000 mensili dello Starter.

### Robustezza

- **Doppio canale di fulfillment.** Il webhook è il canale primario; la pagina
  `/grazie` interroga Stripe e completa l'ordine se il webhook è in ritardo o
  non configurato. Entrambi passano da `fulfillPaidSession()`, che è
  idempotente: ordine già `paid` o preghiera già esistente → non fa nulla.
- **Generazione asincrona e autoriparante.** Nessun pulsante "riprova":
  `generatePrayer()` prende il lock solo se la preghiera è in uno stato
  prendibile e incrementa `attempts` nella stessa update, quindi due chiamate
  concorrenti non producono due sintesi. Un errore rimette la preghiera in
  `queued` e il polling della pagina la ripesca da solo, fino a
  `GENERATION_MAX_ATTEMPTS` (3). Una preghiera piantata in `generating` da più
  di `GENERATION_STALE_MINUTES` torna prendibile, così un processo morto a metà
  non la blocca per sempre. Il limite sta sul server: l'utente non può
  insistere a mano e far partire sintesi a ripetizione.
- **Allerte.** Esauriti i tentativi, `raiseAlert()` scrive una riga in
  `alerts` su Supabase **e** manda un'email ad `ALERT_EMAIL`. Doppio canale
  apposta: la riga resta anche se l'email non parte. Per guardarle:
  `select * from open_alerts;` nell'SQL Editor. L'utente vede un messaggio
  che dice che ce ne stiamo occupando noi, non un errore tecnico.
- **Crediti a prova di doppio clic.** Lo scalo usa un update condizionato al
  valore corrente di `used_credits`; se l'insert della preghiera fallisce, il
  credito viene restituito.
- **Accesso.** Ogni preghiera ha un `access_token` casuale: chi ha comprato da
  ospite apre il link diretto, chi è loggato vede le sue. Al login, gli
  acquisti fatti con la stessa email vengono ricollegati all'account.
- **Audio privato.** Il bucket non è pubblico: gli mp3 si servono con signed
  URL a 24 ore.

---

## Struttura

```
src/
  app/
    page.tsx                     landing
    nuova-preghiera/             form + offerta singola
    pacchetti/                   novena, anno, trigesimo
    lucernario/                  parete di 50 candele a offerta libera
    grazie/                      ritorno da Stripe, completa l'ordine
    preghiera/[id]/              testo, player, download
    dashboard/                   archivio + crediti
    dashboard/nuova/             usa un credito del bundle
    login/, auth/callback/       magic link Supabase
    api/
      checkout/                  crea ordine + sessione Stripe
      webhooks/stripe/           fulfillment
      prayers/[id]/              stato + signed URL (polling)
      prayers/[id]/generate/     pipeline di generazione
      bundle/redeem/             consuma un credito
      lucernario/                offerta libera e accensione candela
    preghiere/                   hub + 15 landing per tradizione (SEO)
    preghiera-per/               hub + 12 landing per intenzione (SEO)
    sitemap.ts, robots.ts        indicizzazione
  components/                    form, player, header, candela
  lib/
    landings/                    contenuti delle landing indicizzabili
    track.ts                     attribuzione conversione → landing
    religions.ts                 catalogo tradizioni + guidance per il modello
    openai.ts                    system prompt e composizione del testo
    elevenlabs.ts                sintesi vocale e scelta della voce
    generate.ts                  pipeline testo → voce → storage → DB
    fulfillment.ts               da pagamento a bene consegnato
    types.ts                     tipi + logica dei crediti a cadenza
    pricing.ts                   listino e Lucernario, letti dalle env
    lucernario.ts                stato della parete e accensione candele
    scheduler.ts                 accodamento e svuotamento della coda (cron)
    mailer.ts                    consegna via email (Resend)
    alerts.ts                    allerte su Supabase + email al gestore
supabase/schema.sql              tabelle, RLS, bucket
supabase/migrations/             002 prodotti · 003 lucernario · 004 allerte
                                 005 consegna automatica
                                 006 pianificazione del cron (pg_cron)
```

---

## Le tradizioni

Quindici tradizioni in `src/lib/religions.ts`: cattolica, ortodossa,
protestante, copta/etiope, islamica (con duʿāʾ, istikhāra, dhikr), ebraica,
induista, buddhista, sikh, bahá'í, jainista, taoista, shintoista, più
spiritualità libera e opzione laica. Ognuna ha i suoi rami/riti, i suoi tipi di
preghiera e un blocco `guidance` che detta al modello formule, nomi del divino e
registro.

Per aggiungerne una basta una voce nell'array: form, prompt e validazione la
prendono da lì.

Il system prompt in `src/lib/openai.ts` impone quattro regole dure: rispetto
assoluto di ogni fede, nessuna citazione scritturale inventata o numerata,
nessuna promessa di guarigione o di esito, e riorientamento gentile delle
intenzioni malevole verso la pace.

---

## Deploy

Vercel: importa il repo, incolla le variabili d'ambiente, imposta
`NEXT_PUBLIC_SITE_URL` sul dominio reale. Poi registra il webhook Stripe di
produzione e aggiungi il redirect URL in Supabase.

La generazione può durare 20–40 secondi: le route hanno `maxDuration = 120`,
che su Vercel richiede un piano Pro. In alternativa il polling del client
recupera comunque il risultato.

---

## Note

- La sintesi vocale è a pagamento: ogni preghiera consuma caratteri ElevenLabs
  e token OpenAI (~0,29 € in tutto), più 1,5% + 0,25 € di Stripe per
  transazione. È la commissione fissa di Stripe a rendere svantaggiosi gli
  importi bassi, non l'IA.
- Il Lucernario è a **importo libero**, non una donazione: chi paga riceve un
  bene digitale, quindi resta una cessione a tutti gli effetti. Il linguaggio
  del sito è commerciale apposta.
- La convinzione religiosa è un dato particolare (art. 9 GDPR): la pagina
  `/privacy` descrive il trattamento reale, ma prima della produzione va
  completata con i dati del titolare e fatta verificare.
- Il servizio non è affiliato ad alcuna autorità religiosa e non sostituisce i
  riti officiati dai ministri di culto: è scritto nel footer di ogni pagina.
