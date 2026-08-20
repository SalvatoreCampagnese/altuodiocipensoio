import type { ArchivePrayer } from "./types";

/**
 * Il corpus.
 *
 * Le voci `verificata` sono formule devozionali della tradizione italiana in
 * uso comune e non legate al diritto d'autore di una singola edizione.
 *
 * Le voci `da-rivedere` NON vengono servite (vedi `listArchive()`). Sono qui
 * perché il lavoro che manca sia visibile invece che dimenticato, e ciascuna
 * dice nel `sourceNote` esattamente che cosa aspetta. Due i motivi ricorrenti:
 *
 *  - TRADUZIONI SOTTO DIRITTO. I testi biblici nella versione CEI sono
 *    coperti da copyright: vanno sostituiti con una traduzione di pubblico
 *    dominio o autorizzata prima di pubblicarli.
 *  - TRADIZIONI NON CRISTIANE. Traslitterazioni e traduzioni vanno controllate
 *    da una persona di quella tradizione, non da noi. Sbagliare qui non è un
 *    refuso: è una mancanza di rispetto verso chi quel testo lo prega.
 */
export const ARCHIVE: ArchivePrayer[] = [
  /* ---------------------------------------------------------------------
   * Cristianesimo — cattolico
   * ------------------------------------------------------------------- */
  {
    slug: "padre-nostro",
    title: "Padre nostro",
    alsoKnownAs: ["Pater noster", "Preghiera del Signore"],
    religionId: "cattolica",
    origin: "La preghiera insegnata da Gesù nei Vangeli. Nella forma liturgica italiana in uso dal 2020.",
    text: `Padre nostro, che sei nei cieli,
sia santificato il tuo nome,
venga il tuo regno,
sia fatta la tua volontà,
come in cielo così in terra.

Dacci oggi il nostro pane quotidiano,
e rimetti a noi i nostri debiti
come anche noi li rimettiamo ai nostri debitori,
e non abbandonarci alla tentazione,
ma liberaci dal male.

Amen.`,
    howToPray:
      "È la preghiera che tutte le confessioni cristiane hanno in comune, e quella che si dice quando non si sa cosa dire. Nella tradizione cattolica apre e chiude quasi ogni altra devozione. Va bene detta una volta sola, lentamente, fermandosi sulla riga che in quel giorno pesa di più.",
    tags: ["mattino", "sera", "perdono", "pace"],
    status: "verificata",
    sourceNote:
      "Formula liturgica italiana entrata in vigore con il Messale Romano del 2020 («non abbandonarci alla tentazione»). Controllare che resti allineata in caso di revisioni future.",
  },
  {
    slug: "ave-maria",
    title: "Ave Maria",
    alsoKnownAs: ["Ave, o Maria"],
    religionId: "cattolica",
    origin: "Composta dal saluto dell'angelo e da quello di Elisabetta nel Vangelo di Luca, con l'invocazione finale fissata nel XVI secolo.",
    text: `Ave, o Maria, piena di grazia,
il Signore è con te.
Tu sei benedetta fra le donne
e benedetto è il frutto del tuo seno, Gesù.

Santa Maria, Madre di Dio,
prega per noi peccatori,
adesso e nell'ora della nostra morte.

Amen.`,
    howToPray:
      "È la preghiera dell'intercessione: non si chiede a Maria di fare, si chiede di pregare insieme. Per questo torna così spesso accanto al letto di un malato e nell'ora della morte, che è l'unica cosa che il testo nomina esplicitamente.",
    tags: ["malattia", "protezione", "famiglia", "lutto"],
    status: "verificata",
    sourceNote:
      "Formula devozionale italiana in uso comune, stabilizzata nel XVI secolo. Testo di pubblico dominio.",
  },
  {
    slug: "gloria-al-padre",
    title: "Gloria al Padre",
    alsoKnownAs: ["Gloria Patri", "Piccola dossologia"],
    religionId: "cattolica",
    origin: "Dossologia dei primi secoli cristiani, comune a Oriente e Occidente.",
    text: `Gloria al Padre e al Figlio e allo Spirito Santo,
come era nel principio, e ora e sempre,
nei secoli dei secoli.

Amen.`,
    howToPray:
      "Due righe, e non chiedono niente: è pura lode. Si usa per chiudere qualsiasi altra preghiera, e da sola è la formula di ringraziamento più breve che la tradizione cristiana possieda — abbastanza corta da stare in un momento rubato.",
    tags: ["ringraziamento", "lavoro"],
    status: "verificata",
    sourceNote: "Dossologia dei primi secoli. Testo di pubblico dominio.",
  },
  {
    slug: "salve-regina",
    title: "Salve Regina",
    religionId: "cattolica",
    origin: "Antifona mariana dell'XI secolo, tradizionalmente cantata a compieta.",
    text: `Salve, Regina, Madre di misericordia,
vita, dolcezza e speranza nostra, salve.

A te ricorriamo, esuli figli di Eva;
a te sospiriamo, gementi e piangenti
in questa valle di lacrime.

Orsù dunque, avvocata nostra,
rivolgi a noi gli occhi tuoi misericordiosi.
E mostraci, dopo questo esilio, Gesù,
il frutto benedetto del tuo seno.

O clemente, o pia, o dolce Vergine Maria.`,
    howToPray:
      "Chiude la giornata monastica da quasi mille anni: si canta al termine di compieta, l'ultima ora prima del silenzio della notte. È una preghiera che non nasconde la fatica di vivere — «gementi e piangenti» — e per questo regge anche le sere in cui non si riesce a fingere che vada tutto bene.",
    tags: ["sera", "lutto", "paura"],
    status: "verificata",
    sourceNote: "Antifona mariana medievale, versione italiana tradizionale. Testo di pubblico dominio.",
  },
  {
    slug: "angelo-di-dio",
    title: "Angelo di Dio",
    alsoKnownAs: ["Angele Dei", "Preghiera all'angelo custode"],
    religionId: "cattolica",
    origin: "Invocazione all'angelo custode, diffusa in Italia dal XV secolo.",
    text: `Angelo di Dio,
che sei il mio custode,
illumina, custodisci,
reggi e governa me,
che ti fui affidato
dalla pietà celeste.

Amen.`,
    howToPray:
      "È la prima preghiera che in Italia si insegna ai bambini, e per moltissimi resta l'unica che si ricorda a memoria da adulti. Si dice la sera, e la si dice per i figli quando dormono. Quattro verbi in fila — illumina, custodisci, reggi, governa — che coprono tutto quello che si vorrebbe chiedere.",
    tags: ["protezione", "sera", "famiglia"],
    status: "verificata",
    sourceNote: "Preghiera devozionale tradizionale italiana. Testo di pubblico dominio.",
  },
  {
    slug: "eterno-riposo",
    title: "L'eterno riposo",
    alsoKnownAs: ["Requiem aeternam"],
    religionId: "cattolica",
    origin: "Antifona della liturgia dei defunti, di uso antichissimo nel rito romano.",
    text: `L'eterno riposo dona loro, o Signore,
e splenda ad essi la luce perpetua.

Riposino in pace.

Amen.`,
    howToPray:
      "È la formula del suffragio: si dice davanti a una tomba, al passaggio di un funerale, negli anniversari, e ogni volta che il pensiero torna a qualcuno che non c'è più. Si può dire al singolare — «dona a lui», «dona a lei» — quando si prega per una persona precisa.",
    tags: ["lutto"],
    status: "verificata",
    sourceNote: "Antifona tradizionale della liturgia dei defunti. Testo di pubblico dominio.",
  },
  {
    slug: "anima-christi",
    title: "Anima di Cristo",
    alsoKnownAs: ["Anima Christi"],
    religionId: "cattolica",
    origin: "Preghiera del XIV secolo, diffusa da sant'Ignazio di Loyola che la pose in apertura degli Esercizi spirituali.",
    text: `Anima di Cristo, santificami.
Corpo di Cristo, salvami.
Sangue di Cristo, inebriami.
Acqua del costato di Cristo, lavami.
Passione di Cristo, confortami.

O buon Gesù, esaudiscimi.
Dentro le tue piaghe nascondimi.
Non permettere che io mi separi da te.
Dal nemico maligno difendimi.
Nell'ora della mia morte chiamami.

E comandami di venire a te,
perché con i tuoi santi ti lodi
nei secoli dei secoli.

Amen.`,
    howToPray:
      "Preghiera di ringraziamento dopo la comunione, ma usata largamente anche fuori dalla messa nei momenti di prova fisica. La riga «dentro le tue piaghe nascondimi» è quella per cui la maggior parte delle persone la cerca: chiede riparo, non spiegazioni.",
    tags: ["malattia", "paura", "protezione"],
    status: "verificata",
    sourceNote: "Preghiera del XIV secolo, versione italiana tradizionale. Testo di pubblico dominio.",
  },
  {
    slug: "sotto-la-tua-protezione",
    title: "Sotto la tua protezione",
    alsoKnownAs: ["Sub tuum praesidium"],
    religionId: "cattolica",
    origin: "La più antica preghiera mariana conosciuta: un papiro egiziano che la riporta risale al III secolo.",
    text: `Sotto la tua protezione cerchiamo rifugio,
santa Madre di Dio:
non disprezzare le suppliche
di noi che siamo nella prova,
e liberaci da ogni pericolo,
o Vergine gloriosa e benedetta.`,
    howToPray:
      "Sono le parole con cui i cristiani chiedono riparo da almeno milleottocento anni, ritrovate su un frammento di papiro in Egitto. Si dice quando la minaccia è concreta e vicina: una diagnosi, un viaggio pericoloso, una notte di attesa.",
    tags: ["protezione", "paura", "malattia", "viaggio"],
    status: "verificata",
    sourceNote:
      "Sub tuum praesidium, versione italiana tradizionale. Testo di pubblico dominio. La datazione al III secolo è quella comunemente accettata per il papiro Rylands 470: se citata pubblicamente, verificare che sia presentata come datazione probabile.",
  },
  {
    slug: "vieni-santo-spirito",
    title: "Vieni, Santo Spirito",
    religionId: "cattolica",
    origin: "Invocazione allo Spirito Santo, in uso liturgico da secoli come apertura di ogni lavoro o decisione.",
    text: `Vieni, Santo Spirito,
riempi i cuori dei tuoi fedeli
e accendi in essi il fuoco del tuo amore.

Manda il tuo Spirito e sarà una nuova creazione,
e rinnoverai la faccia della terra.`,
    howToPray:
      "È la preghiera che si dice prima di cominciare qualcosa: un lavoro, uno studio, una riunione, una decisione che non si sa come prendere. Nella pratica cattolica precede il discernimento — prima si chiede luce, poi si sceglie.",
    tags: ["lavoro", "mattino", "pace"],
    status: "verificata",
    sourceNote: "Invocazione liturgica tradizionale. Testo di pubblico dominio.",
  },
  {
    slug: "atto-di-dolore",
    title: "Atto di dolore",
    religionId: "cattolica",
    origin: "Formula di pentimento della tradizione catechistica italiana, usata nel sacramento della riconciliazione.",
    text: `Mio Dio, mi pento e mi dolgo
con tutto il cuore dei miei peccati,
perché peccando ho meritato i tuoi castighi,
e molto più perché ho offeso te,
infinitamente buono
e degno di essere amato sopra ogni cosa.

Propongo con il tuo santo aiuto
di non offenderti mai più
e di fuggire le occasioni prossime di peccato.

Signore, misericordia, perdonami.`,
    howToPray:
      "Si recita nella confessione, ma la tradizione la prevede anche da soli, la sera, come esame della giornata. Non richiede un sacerdote per essere detta: richiede di essersi fermati abbastanza a lungo da sapere di che cosa ci si sta pentendo.",
    tags: ["perdono", "sera"],
    status: "verificata",
    sourceNote: "Formula catechistica tradizionale italiana. Testo di pubblico dominio.",
  },
  {
    slug: "preghiera-semplice",
    title: "Preghiera semplice",
    alsoKnownAs: ["Signore, fa' di me uno strumento della tua pace"],
    religionId: "cattolica",
    origin:
      "Comparsa in Francia nel 1912 su una rivista devozionale, anonima. L'attribuzione a san Francesco d'Assisi è successiva e storicamente infondata, anche se ormai inseparabile dal testo.",
    text: `O Signore, fa' di me uno strumento della tua pace:
dove è odio, fa' ch'io porti l'amore,
dove è offesa, ch'io porti il perdono,
dove è discordia, ch'io porti l'unione,
dove è dubbio, ch'io porti la fede,
dove è errore, ch'io porti la verità,
dove è disperazione, ch'io porti la speranza,
dove è tristezza, ch'io porti la gioia,
dove sono le tenebre, ch'io porti la luce.

O Maestro, fa' che io non cerchi tanto:
essere consolato, quanto consolare;
essere compreso, quanto comprendere;
essere amato, quanto amare.

Poiché è dando, che si riceve;
perdonando, che si è perdonati;
morendo, che si risuscita a vita eterna.`,
    howToPray:
      "È la preghiera della riconciliazione, e funziona meglio quando si è dalla parte del torto subito: non chiede che l'altro cambi, chiede di cambiare noi. Preghiera scomoda, per questo. Diciamo apertamente che non è di san Francesco perché il testo non ha bisogno della firma per reggere.",
    tags: ["pace", "perdono", "lavoro"],
    status: "verificata",
    sourceNote:
      "Testo apparso anonimo su «La Clochette» (Parigi, 1912), di pubblico dominio. L'attribuzione francescana è tradizionale ma infondata: la nota sull'origine va tenuta, non è un dettaglio da tagliare.",
  },

  /* ---------------------------------------------------------------------
   * Cristianesimo — ortodosso
   * ------------------------------------------------------------------- */
  {
    slug: "preghiera-di-gesu",
    title: "Preghiera di Gesù",
    alsoKnownAs: ["Preghiera del cuore", "Preghiera esicasta"],
    religionId: "ortodossa",
    origin: "Formula dei padri del deserto, cuore della tradizione esicasta e della spiritualità ortodossa.",
    text: `Signore Gesù Cristo, Figlio di Dio,
abbi pietà di me peccatore.`,
    howToPray:
      "Una riga sola, ripetuta. La tradizione esicasta la lega al respiro: la prima metà inspirando, la seconda espirando, per centinaia di volte, finché non si dice da sé senza sforzo. È la preghiera che regge quando la mente non regge più niente altro — l'insonnia, il panico, la sala d'attesa. Non richiede concentrazione: richiede solo di ricominciare.",
    tags: ["paura", "perdono", "malattia"],
    status: "verificata",
    sourceNote:
      "Formula tradizionale dei padri del deserto, versione italiana comune. Testo di pubblico dominio.",
  },
  {
    slug: "trisagio",
    title: "Trisagio",
    alsoKnownAs: ["Santo Dio", "Agios o Theos"],
    religionId: "ortodossa",
    origin: "Inno del V secolo, presente in tutte le liturgie orientali e nella liturgia romana del Venerdì santo.",
    text: `Santo Dio,
Santo Forte,
Santo Immortale,
abbi pietà di noi.`,
    howToPray:
      "Si ripete tre volte, con un inchino a ciascuna. Apre la preghiera quotidiana ortodossa e accompagna i defunti: nella tradizione bizantina si canta al momento della sepoltura. Tre attributi e una domanda, senza una parola in più.",
    tags: ["lutto", "mattino", "protezione"],
    status: "verificata",
    sourceNote: "Inno liturgico del V secolo, versione italiana comune. Testo di pubblico dominio.",
  },

  /* ---------------------------------------------------------------------
   * In attesa di revisione — non servite in pagina
   * ------------------------------------------------------------------- */
  {
    slug: "salmo-23",
    title: "Salmo 23 — Il Signore è il mio pastore",
    alsoKnownAs: ["Salmo del Buon Pastore", "Dominus regit me"],
    religionId: "ebraismo",
    origin: "Salterio ebraico, attribuito a Davide. Pregato da ebrei e cristiani, e letto in quasi ogni funerale occidentale.",
    text: "",
    howToPray:
      "È il salmo che si legge ai funerali e al capezzale dei morenti, in tutte le confessioni. La riga che tutti aspettano è quella della valle oscura: non dice che il male non c'è, dice che non si è soli mentre lo si attraversa.",
    tags: ["lutto", "malattia", "paura"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. La versione CEI è coperta da copyright e non si può ripubblicare. Scegliere una traduzione di pubblico dominio (Diodati 1607, Riveduta 1924) oppure ottenere licenza, e indicare sempre quale versione si sta usando.",
  },
  {
    slug: "de-profundis",
    title: "Salmo 130 — Dal profondo a te grido",
    alsoKnownAs: ["De profundis"],
    religionId: "ebraismo",
    origin: "Salterio ebraico, uno dei salmi penitenziali. Nella tradizione cristiana è la preghiera per i defunti per eccellenza.",
    text: "",
    howToPray:
      "Si prega per i morti e dal fondo delle proprie notti: il salmo non chiede una via d'uscita, chiede di essere ascoltati mentre si è ancora dentro.",
    tags: ["lutto", "perdono", "paura"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Stesso vincolo del Salmo 23: serve una traduzione di pubblico dominio o licenziata.",
  },
  {
    slug: "shema",
    title: "Shemà Israel",
    alsoKnownAs: ["Ascolta, Israele"],
    religionId: "ebraismo",
    origin: "Deuteronomio 6. La dichiarazione centrale dell'ebraismo, recitata al mattino, alla sera e in punto di morte.",
    text: "",
    howToPray:
      "Non è una richiesta ma una dichiarazione, ed è la formula che un ebreo cerca di avere sulle labbra come ultima cosa. Si recita al mattino e alla sera, coprendosi gli occhi con la mano destra sulla prima riga.",
    tags: ["mattino", "sera", "lutto"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Servono traslitterazione dall'ebraico e traduzione, entrambe controllate da una persona ebrea competente. Verificare anche l'accuratezza della nota sull'uso, scritta da fonte secondaria.",
  },
  {
    slug: "mi-sheberach",
    title: "Mi Sheberach — preghiera per il malato",
    religionId: "ebraismo",
    origin: "Formula di benedizione per i malati, recitata in sinagoga durante la lettura della Torah.",
    text: "",
    howToPray:
      "Si chiede al lettore di pronunciare il nome della persona malata, con il nome della madre. Chiede insieme guarigione del corpo e guarigione dello spirito, in quest'ordine inverso rispetto a come le chiederemmo noi.",
    tags: ["malattia"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Le formulazioni variano molto fra riti e comunità: serve indicare quale versione si riporta, con revisione rabbinica.",
  },
  {
    slug: "al-fatiha",
    title: "Al-Fātiḥa — l'Aprente",
    religionId: "islam",
    origin: "La prima sura del Corano, recitata in ogni unità di ogni preghiera quotidiana.",
    text: "",
    howToPray:
      "È il testo più ripetuto dell'islam: nessuna preghiera rituale è valida senza. Si recita in arabo; le traduzioni servono a capire, non a sostituire la recitazione.",
    tags: ["mattino", "protezione", "ringraziamento"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Va pubblicata come «traduzione del significato», mai come «il Corano in italiano»: è la convenzione corretta e il contrario è offensivo. Traslitterazione e resa da far controllare a una persona musulmana competente, indicando il traduttore.",
  },
  {
    slug: "dua-per-il-malato",
    title: "Duʿāʾ per il malato",
    religionId: "islam",
    origin: "Supplica riportata nella tradizione profetica, recitata al capezzale di chi è malato.",
    text: "",
    howToPray:
      "Si dice accanto al malato, toccandolo se possibile. La tradizione la lega alla visita: la supplica non sostituisce il fatto di essere presenti, lo accompagna.",
    tags: ["malattia"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Serve individuare la fonte esatta nella raccolta di hadith, riportarne il riferimento e far controllare traslitterazione e traduzione a una persona musulmana competente. Non pubblicare senza riferimento verificato.",
  },
  {
    slug: "metta",
    title: "Mettā — l'augurio di benevolenza",
    alsoKnownAs: ["Preghiera di amorevole gentilezza"],
    religionId: "buddhismo",
    origin: "Pratica del buddhismo Theravāda, legata al Mettā Sutta del Canone pāli.",
    text: "",
    howToPray:
      "Non è una richiesta rivolta a qualcuno: è un augurio che si formula e si estende per cerchi — a sé, a chi si ama, agli estranei, a chi ci ha fatto del male. L'ultimo cerchio è quello che rende la pratica difficile.",
    tags: ["pace", "perdono", "paura"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Chiarire se si riporta il Mettā Sutta o la formula contemplativa moderna: non sono la stessa cosa e confonderle è un errore. Revisione di un praticante o studioso.",
  },
  {
    slug: "dedica-dei-meriti",
    title: "Dedica dei meriti",
    religionId: "buddhismo",
    origin: "Formula di chiusura della pratica buddhista, presente in forme diverse in tutte le scuole.",
    text: "",
    howToPray:
      "Chiude la meditazione o la recitazione: il beneficio della pratica non si trattiene, si destina ad altri. È la cosa più vicina, nel buddhismo, al pregare per qualcuno.",
    tags: ["lutto", "pace", "ringraziamento"],
    status: "da-rivedere",
    sourceNote:
      "MANCA IL TESTO. Le formule variano molto per scuola: sceglierne una, dichiarare a quale tradizione appartiene, far controllare la traduzione.",
  },
  /* ---------------------------------------------------------------------
   * IN ATTESA DI VERIFICA — aggiunte per copertura di ricerca
   *
   * Selezionate sui volumi reali di ricerca in Italia, non a intuito: da
   * sole valgono più impression di tutto il corpus attuale (il solo Credo
   * sta intorno alle 33.000 ricerche al mese fra le sue varianti).
   *
   * Sono tutte `da-rivedere` e quindi NON sono servite. Non è prudenza
   * eccessiva: la regola in types.ts vieta di trascrivere a memoria, e queste
   * sono trascritte a memoria. Ogni voce ha già origine, uso e tag scritti —
   * manca solo il confronto del TESTO con la fonte indicata nel sourceNote.
   * Verificata una voce, si cambia una parola: `da-rivedere` → `verificata`.
   * ------------------------------------------------------------------- */
  {
    slug: "credo",
    title: "Credo",
    alsoKnownAs: ["Simbolo degli Apostoli", "Io credo in Dio"],
    religionId: "cattolica",
    origin:
      "Simbolo degli Apostoli, nella forma fissata fra il II e il IX secolo. È il Credo breve, quello del Rosario e del Battesimo.",
    text: "",
    howToPray:
      "Si dice all'inizio del Rosario e nella professione di fede del Battesimo. Non è una richiesta ma una dichiarazione, ed è il motivo per cui molti lo trovano difficile: si afferma qualcosa invece di chiederla. Chi fatica a dirlo tutto può fermarsi sulla riga che regge e ripartire da lì un'altra volta.",
    tags: ["mattino", "pace"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE sul Compendio del Catechismo della Chiesa Cattolica o sul Rito del Battesimo (CEI). Attenzione: esistono due Credo e non vanno confusi — questo è il Simbolo APOSTOLICO, breve; l'altro è il Niceno-Costantinopolitano, voce `credo-niceno`.",
  },
  {
    slug: "credo-niceno",
    title: "Credo in un solo Dio",
    alsoKnownAs: ["Simbolo niceno-costantinopolitano", "Credo lungo"],
    religionId: "cattolica",
    origin:
      "Simbolo niceno-costantinopolitano, dai concili di Nicea (325) e Costantinopoli (381). È il Credo della Messa domenicale.",
    text: "",
    howToPray:
      "Si recita alla Messa della domenica e delle solennità, dopo l'omelia. È il testo che le Chiese cristiane hanno in comune da milleseicento anni: la stessa formula che si dice in una parrocchia italiana la dicono, con una differenza di una riga, gli ortodossi in greco e in russo.",
    tags: ["mattino", "pace"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE sul Messale Romano CEI in vigore. La differenza con la versione ortodossa (la questione del Filioque) va descritta, non appianata.",
  },
  {
    slug: "san-michele-arcangelo",
    title: "Preghiera a San Michele Arcangelo",
    alsoKnownAs: ["San Michele Arcangelo, difendici nella battaglia"],
    religionId: "cattolica",
    origin: "Composta da papa Leone XIII nel 1886. Recitata a fine Messa fino al 1964, poi tornata nella devozione privata.",
    text: "",
    howToPray:
      "È la preghiera di protezione più richiesta della devozione italiana, e si dice nei momenti in cui si ha la sensazione di dover reggere qualcosa di più grande di sé. Breve, si impara a memoria in un paio di volte.",
    tags: ["protezione", "paura"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE sul testo di Leone XIII (1886), pubblico dominio. Circolano online varianti allungate di origine recente: usare la forma breve originale.",
  },
  {
    slug: "preghiera-a-san-benedetto",
    title: "Preghiera a San Benedetto",
    alsoKnownAs: ["Croce di San Benedetto", "Vade retro Satana"],
    religionId: "cattolica",
    origin: "Legata alla medaglia-croce benedettina, la cui formula in sigle è attestata dal XVII secolo.",
    text: "",
    howToPray:
      "Si accompagna alla medaglia di San Benedetto, che moltissime famiglie italiane tengono in casa o all'ingresso senza ricordarne più il testo. È una preghiera di protezione della casa più che della persona.",
    tags: ["protezione", "paura"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE su una fonte benedettina (Abbazia di Montecassino o Subiaco). Le sigle sulla medaglia vanno riportate e sciolte con la traduzione italiana.",
  },
  {
    slug: "sacro-cuore-di-gesu",
    title: "Preghiera al Sacro Cuore di Gesù",
    alsoKnownAs: ["Atto di offerta al Sacro Cuore", "Cuore di Gesù"],
    religionId: "cattolica",
    origin: "Devozione diffusa dalle apparizioni a santa Margherita Maria Alacoque (1673-1675) e dalla pratica dei primi venerdì del mese.",
    text: "",
    howToPray:
      "Si dice il primo venerdì del mese e nel mese di giugno, che la devozione italiana dedica al Sacro Cuore. L'atto di offerta è la forma più comune: si offre la giornata prima che cominci.",
    tags: ["mattino", "ringraziamento"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE su un manuale di devozione con imprimatur. Esistono più formule per il Sacro Cuore: scegliere l'atto di offerta quotidiano e dichiarare quale si è scelto.",
  },
  {
    slug: "atto-di-fede-speranza-carita",
    title: "Atti di fede, speranza e carità",
    religionId: "cattolica",
    origin: "Formule del catechismo tridentino, in uso nella catechesi italiana da secoli.",
    text: "",
    howToPray:
      "Si dicono di seguito, uno dopo l'altro, e nella tradizione si recitano prima della confessione. Sono tre affermazioni brevi, una per ciascuna delle virtù che la teologia chiama teologali.",
    tags: ["perdono", "mattino"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE sul Compendio del Catechismo della Chiesa Cattolica. Va indicato che si tratta di tre formule distinte e non di una sola.",
  },
  {
    slug: "veni-creator",
    title: "Vieni, o Spirito Creatore",
    alsoKnownAs: ["Veni Creator Spiritus"],
    religionId: "cattolica",
    origin: "Inno del IX secolo, attribuito a Rabano Mauro. Si canta a Pentecoste e in ogni inizio solenne.",
    text: "",
    howToPray:
      "È l'inno che la Chiesa canta quando comincia qualcosa di importante: un anno, un concilio, un'ordinazione, un conclave. Nella pratica personale si dice all'inizio di un impegno che si teme di non essere all'altezza di reggere.",
    tags: ["lavoro", "mattino"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE sulla Liturgia delle Ore (CEI). ATTENZIONE AL DIRITTO D'AUTORE: la traduzione italiana della Liturgia delle Ore è coperta. Serve una versione di pubblico dominio o l'autorizzazione, altrimenti si pubblica solo il latino con una traduzione propria.",
  },
  {
    slug: "preghiera-a-santa-rita",
    title: "Preghiera a Santa Rita da Cascia",
    alsoKnownAs: ["Santa Rita degli impossibili"],
    religionId: "cattolica",
    origin: "Devozione legata a santa Rita (1381-1457), invocata nella tradizione popolare per le cause disperate.",
    text: "",
    howToPray:
      "Si prega per le situazioni che sembrano chiuse — un matrimonio in crisi, una malattia senza risposte, un figlio che si è perso — perché la devozione popolare le ha affidato proprio quelle. Il 22 maggio è la sua festa e il giorno delle rose benedette.",
    tags: ["famiglia", "malattia"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE su una fonte del Monastero di Santa Rita a Cascia. Circolano molte versioni popolari di autore ignoto e data recente: preferire una formula con imprimatur e dichiararne l'origine.",
  },
  {
    slug: "preghiera-a-sant-antonio",
    title: "Preghiera a Sant'Antonio di Padova",
    alsoKnownAs: ["Responsorio di sant'Antonio", "Si quaeris miracula"],
    religionId: "cattolica",
    origin: "Il Responsorio è attribuito a fra Giuliano da Spira, XIII secolo. Sant'Antonio è invocato per ciò che si è perduto.",
    text: "",
    howToPray:
      "Il Responsorio si dice per le cose perdute, che nella devozione popolare comprendono anche le persone e la pace. Il martedì è il suo giorno, e la tredicina lo precede per tredici martedì.",
    tags: ["protezione", "famiglia"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE sul testo francescano (Basilica del Santo, Padova). Distinguere il Responsorio dalle preghiere devozionali moderne che circolano con lo stesso nome.",
  },
  {
    slug: "preghiera-di-san-efrem",
    title: "Preghiera di sant'Efrem il Siro",
    alsoKnownAs: ["Signore e Sovrano della mia vita"],
    religionId: "ortodossa",
    origin: "Attribuita a sant'Efrem (IV secolo). È la preghiera quaresimale per eccellenza della Chiesa ortodossa.",
    text: "",
    howToPray:
      "Si dice ogni giorno della Grande Quaresima ortodossa, accompagnata da prostrazioni. Chiede di essere liberati da quattro cose e di riceverne altre quattro, e la sua forza sta nella precisione dell'elenco: non chiede di essere buoni in generale.",
    tags: ["perdono", "pace"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE con una fonte ortodossa italiana. Far controllare la traduzione a una persona della tradizione prima di pubblicare.",
  },
  {
    slug: "modeh-ani",
    title: "Modeh Ani",
    alsoKnownAs: ["Ti ringrazio"],
    religionId: "ebraismo",
    origin: "Formula del risveglio, attestata nei manuali di preghiera a partire dal XVI secolo.",
    text: "",
    howToPray:
      "È la prima cosa che si dice al mattino, prima di alzarsi e prima di lavarsi le mani. Ringrazia per la restituzione dell'anima dopo il sonno, che la tradizione considera un piccolo assaggio di morte. Bastano pochi secondi.",
    tags: ["mattino", "ringraziamento"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE su un siddur italiano. Traslitterazione e traduzione da far controllare a una persona di tradizione ebraica.",
  },
  {
    slug: "ayat-al-kursi",
    title: "Āyat al-Kursī",
    alsoKnownAs: ["Il versetto del Trono"],
    religionId: "islam",
    origin: "Versetto del Corano fra i più recitati nella devozione quotidiana musulmana.",
    text: "",
    howToPray:
      "Si recita dopo le preghiere obbligatorie e prima di dormire, e nella pratica comune è il testo di protezione per eccellenza. Molti lo insegnano ai bambini come prima cosa da sapere a memoria.",
    tags: ["protezione", "sera"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE con una fonte islamica italiana. Il testo coranico non va parafrasato né citato a memoria: serve una traduzione riconosciuta e il controllo di una persona musulmana. In caso di dubbio, non pubblicare.",
  },
  {
    slug: "gayatri-mantra",
    title: "Gāyatrī Mantra",
    religionId: "induismo",
    origin: "Dal Rigveda. Fra i mantra più antichi ancora in uso quotidiano.",
    text: "",
    howToPray:
      "Si recita all'alba, a mezzogiorno e al tramonto, rivolti al sole. È una richiesta di luce per l'intelligenza, non di beni: chiede che il pensiero sia illuminato.",
    tags: ["mattino", "pace"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE con una fonte induista. Traslitterazione dal sanscrito e traduzione da far controllare a una persona della tradizione.",
  },
  {
    slug: "tre-rifugi",
    title: "I Tre Rifugi",
    alsoKnownAs: ["Presa di rifugio", "Buddham saranam gacchami"],
    religionId: "buddhismo",
    origin: "Formula comune a tutte le scuole buddhiste, in uso dai testi in pali più antichi.",
    text: "",
    howToPray:
      "Si recita tre volte all'inizio di ogni pratica, e nel buddhismo è ciò che segna l'ingresso nella tradizione. Non chiede nulla a nessuno: dichiara dove ci si appoggia.",
    tags: ["pace", "mattino"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE con un centro buddhista italiano. Indicare la scuola di riferimento della formula riportata: la traslitterazione cambia fra pali e sanscrito.",
  },
  {
    slug: "mul-mantar",
    title: "Mūl Mantar",
    alsoKnownAs: ["Ik Onkar"],
    religionId: "sikhismo",
    origin: "Apre il Guru Granth Sahib. Composto da Guru Nanak (1469-1539).",
    text: "",
    howToPray:
      "È la prima cosa scritta nel libro sacro sikh e il fondamento di tutto il resto. Si recita al mattino e si impara come primo testo. Dice chi è Dio in poche righe, prima di qualunque richiesta.",
    tags: ["mattino", "pace"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE con un gurdwara italiano. Traslitterazione dal punjabi e traduzione da far controllare a una persona sikh.",
  },
  {
    slug: "navkar-mantra",
    title: "Navkār Mantra",
    alsoKnownAs: ["Namokar Mantra"],
    religionId: "jainismo",
    origin: "Il mantra fondamentale del giainismo, attestato nei testi più antichi della tradizione.",
    text: "",
    howToPray:
      "Si recita al mattino e prima di ogni atto importante. Non nomina nessuna divinità e non chiede nulla: rende omaggio a chi ha percorso la via, chiunque sia stato. È la ragione per cui i giainisti lo considerano universale.",
    tags: ["mattino", "pace"],
    status: "da-rivedere",
    sourceNote:
      "DA VERIFICARE con una fonte giainista. Traslitterazione e traduzione da far controllare a una persona della tradizione.",
  },
];
