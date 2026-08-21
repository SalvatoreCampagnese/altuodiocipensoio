# AlTuoDioCiPensoIO

Le parole per pregare, per i momenti in cui non ti vengono. **A pregarle è
l'utente:** il servizio scrive formulari, non prega al posto di nessuno — e
questa distinzione è il prodotto, non una nota legale. Se una modifica al copy
la annacqua, è una regressione.

Tre strade, in quest'ordine:

1. **L'archivio** (`/preghiere-tradizionali`) — le preghiere che la tradizione
   ha già scritto, ordinate per situazione. Gratuito, senza registrazione. È
   l'ingresso del funnel e la sezione che porta traffico organico.
2. **La Preghiera del Giorno** (`/preghiera-del-giorno`) — l'abbonamento, e
   **l'offerta di punta**: una preghiera nuova ogni mattina alle 9 via email,
   la stessa per tutti gli abbonati. 0,70 € al giorno. È il prodotto con
   l'attrito più basso — non c'è niente da scrivere — e l'unico ricorrente.
3. **Il testo su misura** (`/nuova-preghiera`) — quando nessuna formula
   esistente dice quella situazione. OpenAI compone rispettando le formule
   della tradizione scelta, ElevenLabs registra una voce che accompagna la
   lettura, Stripe raccoglie l'offerta.

L'obiezione «una macchina non può pregare» è affrontata per esteso in
`/pregare-con-lintelligenza-artificiale`, che è insieme la risposta agli
scettici e una pagina di acquisizione.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Supabase (auth, Postgres, Storage) · Stripe · OpenAI · ElevenLabs · Resend

## Il listino

| Prodotto | Preghiere | Ritmo | Offerta |
|---|---|---|---|
| **La Preghiera del Giorno** | una al giorno, sempre | ogni mattina alle 9 | **0,70 €/giorno** (4,90 € a settimana) |
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
SUB_DAILY_PER_DAY_CENTS=90      # porta l'abbonamento a 0,90 €/giorno (6,30 €/sett.)
SUB_DAILY_INTERVAL=month        # passa all'addebito mensile (30 × il prezzo al giorno)
PRODUCT_SINGLE_CENTS=390        # alza la singola a 3,90 €
PRODUCT_TRIGESIMO_ENABLED=false # toglie il trigesimo dal sito
LUCERNARIO_SLOTS=100            # raddoppia le candele
```

**Perché il prezzo si annuncia al giorno ma si addebita a settimana.** Stripe
prende 0,25 € fissi più l'1,5 % per transazione: incassare 0,70 € ogni giorno
lascerebbe al processore circa il **38 %** dell'incasso, contro il **6,5 %** di
un addebito settimanale. Raggruppare sette giorni è ciò che permette di tenere
il prezzo a settanta centesimi invece di alzarlo. Le due cifre non divergono
mai da sole: `amountCents` si calcola da `perDayCents × giorni del periodo`, e
`SUB_DAILY_CENTS` esiste solo per forzarlo di proposito.

---

## L'archivio

Il corpus sta in `src/lib/archive/texts.ts`, i tag (che sono situazioni della
vita, non categorie teologiche) in `tags.ts`.

**Nessuna pagina importa `ARCHIVE` direttamente.** Si passa sempre da
`listArchive()`, che serve solo le voci `verificata` e con testo non vuoto: è
il punto unico in cui si decide che cosa il mondo può leggere.

Ogni voce nasce `da-rivedere` e passa a `verificata` solo dopo il confronto con
la fonte — e per le tradizioni non cristiane solo dopo il controllo di una
persona di quella tradizione. Le voci in attesa restano nel file, con nel
`sourceNote` esattamente che cosa manca:

```bash
# quante voci aspettano revisione
grep -c '"da-rivedere"' src/lib/archive/texts.ts
# e che cosa manca a ciascuna
grep -A2 '"da-rivedere"' src/lib/archive/texts.ts | grep MANCA
```

`pendingReview()` in `src/lib/archive/index.ts` restituisce lo stesso elenco a
runtime, se serve mostrarlo da qualche parte.

I due motivi ricorrenti sono i diritti sulle traduzioni bibliche (la versione
CEI non è ripubblicabile: serve una traduzione di pubblico dominio o
licenziata) e le tradizioni non cristiane, dove traslitterazione e resa vanno
controllate da chi quel testo lo prega davvero.

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
   Su un database **già in uso**, `schema.sql` non basta: esegui in ordine le
   migrazioni in `supabase/migrations/` che non hai ancora applicato. Per la
   Preghiera del Giorno servono la **008** (tabelle `daily_prayers` e
   `subscriptions`) e la **009** (i due job delle 7 e delle 9).
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
   `charge.refunded`, e — per l'abbonamento —
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.paid`, `invoice.payment_failed`.

   **Senza i quattro eventi di abbonamento** le iscrizioni si aprono ma non si
   aggiornano mai: un abbonamento disdetto o non pagato continuerebbe a
   ricevere la preghiera, perché è quella colonna a decidere chi il cron delle
   9 serve.

4. **Abbonamento.** Se usi un Price ID in `SUB_DAILY_STRIPE_PRICE` dev'essere
   un prezzo **ricorrente** (`recurring`), non one-time: un prezzo singolo fa
   fallire la sessione `mode=subscription`. Lasciandolo vuoto, il prezzo
   ricorrente viene costruito al volo dai valori `SUB_DAILY_*`.
5. **Settings → Billing → Customer portal** → attivalo. È ciò che alimenta
   `/api/subscription/portal`, cioè l'unico posto dove un abbonato con la carta
   scaduta può aggiornarla. Finché è spento, quel bottone risponde con
   l'errore di Stripe — e all'abbonato resta come sola strada la disdetta.

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

### La Preghiera del Giorno (l'abbonamento)

Il prodotto di punta. Una preghiera sola al giorno, uguale per tutti, che
arriva via email senza che l'abbonato debba fare nulla.

```
/preghiera-del-giorno  →  POST /api/subscribe
                          crea orders(cadence=subscription, prova del consenso)
                          → Stripe Checkout in mode=subscription
                             ↓ pagamento
     webhook checkout.session.completed  →  ensureSubscription()
                          crea subscriptions(status, manage_token)
                          + email di benvenuto con la preghiera di oggi
                             ↓
     ogni mattina, da pg_cron:
       07:00 Roma  →  POST /api/cron/preghiera-del-giorno?step=genera
                      composeDailyPrayer(): OpenAI → ElevenLabs → Storage
       09:00 Roma  →  POST /api/cron/preghiera-del-giorno?step=invia
                      deliverDailyPrayer(): lotto di 100 email via Resend
```

**Perché due tabelle nuove e non `prayers`.** In `prayers` una riga è una
preghiera con un committente, un ordine e un destinatario. Qui il rapporto è
rovesciato: un testo, molti lettori. Scrivere una copia identica per abbonato
ogni mattina sarebbe la stessa riga moltiplicata per la lista.

- `daily_prayers` — una riga per data, `prayer_date` **unica**. È quel vincolo
  a rendere ripetibile il giro delle 7: se scatta due volte non nascono due
  preghiere.
- `subscriptions` — chi riceve, fin quando, e il giorno dell'ultima consegna.
  Un indice unico parziale su `lower(email)` impedisce due abbonamenti attivi
  sullo stesso indirizzo, cioè due addebiti e due email identiche al giorno.

**Perché due ore fra le 7 e le 9.** Se testo e voce si componessero alle nove
meno un minuto, una brutta giornata di OpenAI significherebbe nessuna email
quel giorno. Con il margine c'è il tempo per il tentativo delle 8, e nessuno
se ne accorge.

**Il tema del giorno.** A un modello a cui si chiede «una preghiera per oggi»
esce trecentosessantacinque volte la stessa preghiera sulla luce del mattino.
`THEMES` in `src/lib/dailyPrayer.ts` impone un argomento diverso ogni giorno.
Sono **trentuno**, che è primo: con trenta il ciclo cadrebbe sempre di lunedì
e ogni lunedì avrebbe lo stesso tema.

**Prima si segna, poi si spedisce.** In `deliverDailyPrayer()` la marcatura
`last_sent_on` precede l'invio. Sembra sbagliato, ed è deliberato: fra ricevere
due volte la stessa preghiera e non riceverla per un giorno, il doppione è
molto peggio — è così che un mittente quotidiano si prende una segnalazione di
spam, e quella danneggia la consegna a tutti gli altri. Se l'invio fallisce del
tutto, la marcatura si annulla e il giro dopo riprova.

**La disdetta è a un clic**, dal link in fondo a ogni email (`manage_token`,
nessun account richiesto) e con gli header `List-Unsubscribe` /
`List-Unsubscribe-Post` che Gmail e Yahoo pretendono da chi spedisce in volume.
Rendere difficile andarsene non trattiene nessuno: converte la disdetta in una
segnalazione di spam.

**Il paywall.** Su `/preghiera-del-giorno` chi non è abbonato vede titolo, tema
e primo paragrafo; il resto è sfocato ma visibile — un muro che non mostra cosa
nasconde non convince nessuno. Gli abbonati entrano dal token dell'email o da
una sessione il cui indirizzo risulta abbonato.

---

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

### Pubblicità (Google AdSense)

`src/lib/ads.ts` tiene la configurazione, `<AdSlot placement="…" />` disegna
l'unità, lo script sta nel `layout.tsx`. Editore: `ca-pub-5107049257138780`.

**Il cambio da link sponsorizzato ad AdSense non è di fornitore, è di natura.**
Un link di affiliazione non tocca il browser di chi legge; AdSense carica uno
script che imposta cookie, costruisce un profilo pubblicitario e segue le
persone da un sito all'altro. Da qui discende tutto il resto:

- **`/cookie` è stata riscritta da cima a fondo.** Diceva «non c'è il banner
  perché non ci sono cookie di profilazione» — vero fino a ieri, falso da
  adesso. Una cookie policy falsa è peggio di una assente: è una
  dichiarazione, non un'omissione. Anche `/privacy` (punti 2 e 12) e
  `/termini` (punto 9) sono aggiornate, e `LEGAL_VERSION` è salita.
- **Il consenso NON si raccoglie dal codice.** Per il traffico SEE/UK Google
  pretende una CMP certificata TCF: un banner fatto in casa non lo è, e Google
  limiterebbe gli annunci in Europa comunque. Ne fornisce una gratuita —
  cruscotto AdSense → **Privacy e messaggi → messaggio GDPR** — e va accesa lì.
- **Gli annunci automatici sono accesi**, quindi le posizioni le sceglie
  Google: ovunque nel sito, preghiere acquistate, Lucernario e checkout
  compresi. È una scelta deliberata del titolare, e `/termini`, `/cookie` e
  `/privacy` la dichiarano invece di promettere posizioni non garantibili.
  `<AdSlot>` resta per la strada opposta — unità piazzate a mano — e va
  compilato solo dopo aver spento gli automatici, altrimenti si ottengono
  entrambe le cose sulla stessa pagina.
- **Nessun dato della preghiera passa alla pubblicità**: né la tradizione, né
  l'intenzione, né il nome del destinatario, né l'esistenza di un abbonamento.

```bash
ADS_ENABLED=false                # spegne script, unità e ads.txt
ADSENSE_SLOT_FOOTER=1234567890   # solo dopo aver spento gli annunci automatici
ADSENSE_SLOT_ARTICOLO=0987654321 # idem
```

Finché gli `ADSENSE_SLOT_*` sono vuoti **non viene disegnato alcun riquadro**:
un `<ins>` senza `data-ad-slot` non si riempie mai e lascerebbe in pagina un
box «Pubblicità» perennemente vuoto. Lo script si carica comunque, che è
quanto serve agli annunci automatici — ed è la configurazione in uso.

**Avviso a chi blocca la pubblicità** (`AdblockNotice.tsx`, `lib/adblock.ts`).
Tre segnali indipendenti, perché nessuno li prende tutti: un'esca nel DOM per
i filtri cosmetici (uBlock, AdBlock), una fetch che deve fallire per i filtri
di rete, e la presenza dello script di Google. L'esca da sola basta; rete e
script devono concordare, perché ciascuno da solo sbaglia — su localhost
`window.adsbygoogle` risulta assente pur senza alcun blocco, e da solo
accuserebbe un innocente.

Restano fuori i casi che nessuna tecnica lato pagina può vedere: un proxy che
serve uno script vuoto, un'estensione che simula il caricamento. **«Prenderli
tutti» non è ottenibile** e prometterlo sarebbe falso.

**Modalità `blocco` (attiva).** Il contenuto non è leggibile finché il blocco
pubblicità è attivo: `main` passa a `visibility:hidden`, lo scorrimento si
ferma, e non ci sono X né Esc. Il bottone «L'ho disattivato» rimisura e, se è
vero, ricarica da sé. `ADBLOCK_NOTICE_MODE=avviso` riporta tutto all'avviso
gentile che si chiude.

Due cose non negoziabili in questa modalità.

1. **I crawler non vengono mai murati** — `isLikelyCrawler()` in
   `lib/adblock.ts`. Se un giorno Googlebot non passasse la rilevazione
   vedrebbe pagine senza testo, e su tutto il sito quello non è un calo di
   posizioni: è la deindicizzazione. Non è cloaking, perché la pagina servita
   è identica per tutti e il muro cade per chiunque non blocchi la pubblicità.
   Verificato: 9 user agent di crawler passano, 5 di browser reali no.
2. **La soglia si alza** — con `strict` il solo fallimento di rete non basta
   più, serve la conferma dell'esca. Con un avviso un falso positivo costa tre
   secondi di fastidio; con il muro costa la pagina a qualcuno che cercava una
   preghiera per sua madre malata e ha soltanto il firewall dell'ufficio.

Il testo resta nel DOM anche mentre è murato, quindi l'HTML servito non cambia
di una riga: verificato, 2575 caratteri di testo visibile identici fra utente
e Googlebot. Chi apre gli strumenti per sviluppatori può aggirarlo, come in
qualunque muro lato browser mai scritto.

Non era un muro, e i motivi per cui non lo era restano validi. Il primo è di merito: su un sito dove si arriva
alle tre di notte per un lutto, una porta chiusa è una cattiveria. Il secondo è
aritmetico: chi trova un blocco torna in SERP e clicca il risultato dopo, e un
rimbalzo vale meno di zero. Si chiede una volta, si accetta il no, e si tace
per `ADBLOCK_NOTICE_DISMISS_DAYS` giorni.

Per provarlo senza installare nulla: `?adblock=test` su qualunque pagina.

Alternativa ufficiale: AdSense ha una propria **Ad blocking recovery** in
«Privacy e messaggi», integrata con la CMP. Se la accendi, spegni questa con
`ADBLOCK_NOTICE_ENABLED=false` — due avvisi sullo stesso schermo sono peggio
di nessuno.

`ADSENSE_TEST_MODE` segue `NODE_ENV`: fuori produzione le unità hanno
`data-adtest="on"`. Le impression da localhost o dalle anteprime sono traffico
non valido, ed è il motivo più comune di sospensione di un account.

**`/ads.txt`** è generato da `src/app/ads.txt/route.ts`, non è un file statico:
l'identificativo dell'editore vive già in `ADSENSE_CLIENT`, e una seconda copia
in `public/` divergerebbe alla prima modifica — con un guasto silenzioso,
perché autorizzare l'editore sbagliato non dà errori, solo annunci che smettono
di rendere. La route toglie da sola il prefisso `ca-`, che lo script vuole e il
record no.

Con `ADS_ENABLED=false` risponde **404 e non un file vuoto**. È la differenza
più facile da sbagliare del formato: un ads.txt assente vale «nessuna
restrizione» e gli annunci continuano, uno presente ma vuoto vale «nessuno è
autorizzato a vendere questo inventario» e li blocca su tutto il dominio.


## Struttura

```
src/
  app/
    page.tsx                     landing
    preghiera-del-giorno/        abbonamento: preghiera di oggi + paywall
    preghiera-del-giorno/gestisci/  area abbonato (token, senza account)
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
      subscribe/                 iscrizione (Stripe mode=subscription)
      subscription/cancel/       disdetta a fine periodo, con un clic
      subscription/portal/       portale Stripe: carta e ricevute
      cron/preghiera-del-giorno/ ?step=genera (7:00) · ?step=invia (9:00)
      webhooks/stripe/           fulfillment + ciclo di vita abbonamento
      prayers/[id]/              stato + signed URL (polling)
      prayers/[id]/generate/     pipeline di generazione
      bundle/redeem/             consuma un credito
      lucernario/                offerta libera e accensione candela
    preghiere/                   hub + 15 landing per tradizione (SEO)
    preghiera-per/               hub + 12 landing per intenzione (SEO)
    sitemap.ts, robots.ts        indicizzazione
  components/                    form, player, header, candela
    DailyPrayerUpsell.tsx        l'offerta di punta, in quattro formati
    SubscribeForm.tsx            iscrizione: un campo e tre spunte
    AdSlot.tsx / AdUnit.tsx      unità AdSense, etichettata «Pubblicità»
  lib/
    landings/                    contenuti delle landing indicizzabili
    track.ts                     attribuzione conversione → landing
    religions.ts                 catalogo tradizioni + guidance per il modello
    openai.ts                    system prompt e composizione del testo
    elevenlabs.ts                sintesi vocale e scelta della voce
    generate.ts                  pipeline testo → voce → storage → DB
    fulfillment.ts               da pagamento a bene consegnato
    types.ts                     tipi + logica dei crediti a cadenza
    pricing.ts                   listino, abbonamento e Lucernario, dalle env
    dailyPrayer.ts               composizione delle 7 e consegna delle 9
    ads.ts                       configurazione AdSense (editore, slot)
    lucernario.ts                stato della parete e accensione candele
    scheduler.ts                 accodamento e svuotamento della coda (cron)
    mailer.ts                    consegna via email (Resend)
    alerts.ts                    allerte su Supabase + email al gestore
supabase/schema.sql              tabelle, RLS, bucket
supabase/migrations/             002 prodotti · 003 lucernario · 004 allerte
                                 005 consegna automatica
                                 006 pianificazione del cron (pg_cron)
                                 007 prova del consenso
                                 008 Preghiera del Giorno (tabelle)
                                 009 i job delle 7 e delle 9 (pg_cron)
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

Per la Preghiera del Giorno, in più:

1. applica le migrazioni **008** e **009** al database;
2. controlla che l'URL nella 009 punti al dominio vero (è scritto per esteso
   nel corpo dei job, non letto da una variabile);
3. verifica i due job — `select * from cron.job;` deve mostrare
   `preghiera-del-giorno-genera` e `preghiera-del-giorno-invia`;
4. attiva il **Customer portal** di Stripe e aggiungi i quattro eventi di
   abbonamento al webhook.

Il primo giro si può forzare senza aspettare le 7:

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  'https://tuodominio.it/api/cron/preghiera-del-giorno?step=genera'
```

`?giorno=2026-08-19` recupera un giorno saltato.

La generazione può durare 20–40 secondi: le route hanno `maxDuration = 120`,
che su Vercel richiede un piano Pro. In alternativa il polling del client
recupera comunque il risultato.

---

## Note

- La sintesi vocale è a pagamento: ogni preghiera consuma caratteri ElevenLabs
  e token OpenAI (~0,29 € in tutto), più 1,5% + 0,25 € di Stripe per
  transazione. È la commissione fissa di Stripe a rendere svantaggiosi gli
  importi bassi, non l'IA.
- **L'abbonamento ribalta quel conto.** La preghiera del giorno si compone una
  volta sola e la leggono tutti: il costo di OpenAI ed ElevenLabs è ~0,29 € al
  giorno *in totale*, non per abbonato, e non cresce con la lista. Il costo
  marginale di un abbonato in più è la sola email. È il motivo per cui è il
  prodotto da spingere, prima ancora del prezzo d'ingresso più basso.
- L'invio quotidiano usa il **lotto** di Resend (100 email per chiamata): il
  limite di due richieste al secondo renderebbe un ciclo email-per-email più
  lento del budget del cron. Oltre i 100 abbonati servono più passaggi, ed è
  per questo che il job delle 9 gira ogni 20 minuti fino alle 10.
- Il Lucernario è a **importo libero**, non una donazione: chi paga riceve un
  bene digitale, quindi resta una cessione a tutti gli effetti. Il linguaggio
  del sito è commerciale apposta.
- La convinzione religiosa è un dato particolare (art. 9 GDPR): la pagina
  `/privacy` descrive il trattamento reale, ma prima della produzione va
  completata con i dati del titolare e fatta verificare.
- Il servizio non è affiliato ad alcuna autorità religiosa e non sostituisce i
  riti officiati dai ministri di culto: è scritto nel footer di ogni pagina.
