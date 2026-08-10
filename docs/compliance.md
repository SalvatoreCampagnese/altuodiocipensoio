# Compliance — stato e cosa manca

Questo documento serve a due cose: dare al consulente legale un punto di
partenza invece di una pagina bianca, e impedire che ciò che è già stato fatto
venga rifatto o dimenticato.

**Non è una consulenza legale.** È la descrizione tecnica di come il servizio
tratta i dati, scritta da chi ha scritto il codice.

---

## Cosa è già implementato

| Requisito | Dove | Stato |
|---|---|---|
| Consenso esplicito art. 9, separato e non pre-spuntato | `src/components/ConsentBlock.tsx` | fatto |
| Rifiuto lato server senza consenso | `src/lib/validation.ts` (`consentSchema`) | fatto |
| Prova del consenso con data e versione | `supabase/migrations/007_consent.sql` | fatto |
| Disclaimer AI + voce sintetica + non affiliazione **prima** dell'acquisto | `ConsentBlock`, sopra il bottone | fatto |
| Rinuncia espressa al recesso art. 59 Cod. Consumo | `ConsentBlock` + `orders.consent_immediate` | fatto |
| Dichiarazione su dati di terzi | `ConsentBlock` + `orders.consent_third_party` | fatto |
| Informativa privacy con art. 9, trasferimenti, diritti, reclamo | `src/app/privacy/page.tsx` | fatto, da far rivedere |
| Termini e condizioni | `src/app/termini/page.tsx` | fatto, da far rivedere |
| Cookie policy | `src/app/cookie/page.tsx` | fatto |
| Statistiche senza cookie né profilazione | Vercel Web Analytics | fatto |
| Pagine private escluse da indicizzazione e sitemap | `robots.ts`, `sitemap.ts`, `noindex` | fatto |
| Identità del titolare in ogni pagina | `layout.tsx` + `src/lib/legal.ts` | **dati da inserire** |

## Cosa manca, in ordine di urgenza

### 1. Dati del titolare — blocca la pubblicazione

Compilare `HOLDER` in `src/lib/legal.ts`: denominazione, forma giuridica,
partita IVA, codice fiscale, sede, PEC, eventuale REA.

Finché sono vuoti il sito mostra un avviso rosso in ogni pagina legale e nel
footer. È voluto: un'informativa senza titolare individuabile non assolve
l'obbligo, e una partita IVA inventata sarebbe peggio dell'omissione.

### 2. Verificare i sub-responsabili

`SUB_PROCESSORS` in `src/lib/legal.ts` elenca fornitori, finalità e dati sulla
base di cosa fa il codice. Vanno confermati sul contratto di ciascuno:

- **la regione del progetto Supabase** — non è deducibile dal codice, la decide
  chi ha creato il progetto. Se è negli Stati Uniti va detto nell'informativa;
- il DPA firmato con ciascun fornitore;
- per OpenAI, che i dati inviati via API non alimentino l'addestramento.

### 3. Valutazione d'impatto (DPIA, art. 35 GDPR)

Probabilmente dovuta: si trattano dati dell'art. 9 su larga scala potenziale,
con trattamento automatizzato e trasferimento extra-UE. Elementi già pronti per
redigerla: finalità e basi giuridiche (informativa, sezioni 4-5), categorie di
dati (sezione 1), destinatari (sezione 6), tempi di conservazione (`RETENTION`),
misure di sicurezza (sotto).

### 4. Registro dei trattamenti (art. 30)

Da redigere. Le informazioni necessarie stanno già in `src/lib/legal.ts` e
nell'informativa.

### 5. Cancellazione self-service

Oggi la cancellazione avviene su richiesta via email, il che è conforme se le
richieste vengono onorate nei termini. Un pulsante "cancella il mio account e i
miei dati" in dashboard ridurrebbe il carico e il rischio di sforare il mese.
Non implementato.

### 6. Fuori dal codice

- Registrazione del marchio (classi 45 e 42).
- Verifica che il piano ElevenLabs includa la **licenza commerciale**: il piano
  Free non la include, e il servizio vende l'audio generato. Vedi README.
- Nomina dei responsabili esterni ex art. 28 dove non coperta dal DPA standard.

---

## Misure di sicurezza in essere

- Chiavi di servizio solo lato server; `SUPABASE_SERVICE_ROLE_KEY` mai esposta
  al client.
- Row Level Security attiva su `profiles`, `orders`, `bundles`, `prayers`,
  `candles`; ogni utente vede solo le proprie righe.
- File audio in bucket privato, raggiungibili solo con link firmato a scadenza.
- Pagine delle preghiere con token di accesso, `noindex`, escluse dalla sitemap
  e bloccate in `robots.txt`.
- Pagamenti interamente su Stripe: i dati della carta non transitano dai nostri
  sistemi.
- Endpoint del cron protetto da bearer token; il segreto sta nel Vault di
  Supabase e non nella definizione del job.
- Ai fornitori di IA viene inviato il solo contenuto della preghiera, senza
  email né identificativi dell'account.

## Minimizzazione: un punto aperto

Il campo intenzione accetta fino a 1500 caratteri liberi, e l'utente può
scriverci dentro qualsiasi cosa — diagnosi, nomi completi, dettagli familiari.
L'interfaccia oggi invita a inserire solo il necessario, ma non lo impone.

È il punto su cui il servizio è più esposto e vale la pena discuterne con il
consulente: una limitazione più stretta ridurrebbe il rischio ma toglierebbe al
prodotto ciò che lo rende utile.
