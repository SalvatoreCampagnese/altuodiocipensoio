import type { IntentionLanding } from "./types";

/**
 * Una landing per intenzione, trasversale alle fedi.
 *
 * `acrossFaiths` è il cuore: mostra come tradizioni diverse trattano LA STESSA
 * necessità. È ciò che rende queste pagine diverse dalle pagine-tradizione (che
 * partono dalla fede e attraversano le intenzioni) e diverse fra loro — nessuna
 * intenzione ha la stessa geografia religiosa di un'altra.
 */
export const INTENTION_LANDINGS: IntentionLanding[] = [
  {
    slug: "la-guarigione",
    prayerTypeId: "guarigione",
    title: "Preghiera per la guarigione di una persona cara",
    description:
      "Una preghiera per chi sta male, scritta sulla tua intenzione e recitata a voce. In quindici tradizioni religiose, o in forma laica.",
    h1: "Una preghiera per la guarigione",
    lede:
      "Quando qualcuno che ami sta male, la sensazione peggiore è non poter fare niente. Scrivere una preghiera per lui è una cosa che puoi fare.",
    when:
      "Una diagnosi arrivata ieri. Un intervento fissato per giovedì. Una terapia lunga che non dà segni. Il momento in cui i medici hanno detto tutto quello che potevano dire, e resta il tempo dell'attesa — che è quasi sempre il tempo più lungo.",
    acrossFaiths: [
      {
        religionId: "ebraismo",
        note: "Il Mi Sheberach nomina il malato e chiede refuah shlemah, guarigione piena: del corpo e dello spirito insieme, mai solo del corpo.",
      },
      {
        religionId: "islam",
        note: "Il duʿāʾ invoca al-Shāfī, il Guaritore, riconoscendo che la guarigione viene da Lui e la medicina è un mezzo che Lui ha dato.",
      },
      {
        religionId: "cattolica",
        note: "Cristo medico, e l'intercessione dei santi che la devozione ha legato alla malattia — san Pio, la Madonna di Lourdes, san Camillo.",
      },
      {
        religionId: "induismo",
        note: "Dhanvantari, che nella tradizione porta l'amrita e la medicina, e Shiva nella forma di Vaidyanatha, il signore dei guaritori.",
      },
      {
        religionId: "buddhismo",
        note: "Non una richiesta ma un'aspirazione: che tu sia libero dalla sofferenza. E la dedica dei meriti alla persona malata.",
      },
      {
        religionId: "laica",
        note: "Un augurio onesto, che non promette la guarigione perché non può. A volte è la versione che si sopporta meglio.",
      },
    ],
    faq: [
      {
        q: "Può guarire davvero qualcuno?",
        a: "No, e nessuno che sia serio te lo dirà. Una preghiera non è una terapia e non sostituisce un medico. Quello che fa è dare forma a un'intenzione, e a chi prega un modo di stare in un'attesa che altrimenti è muta.",
      },
      {
        q: "Devo dire il nome del malato?",
        a: "Puoi indicarlo e in molte tradizioni ha un senso preciso — nel Mi Sheberach il nome è parte della formula. Ma non è obbligatorio: se preferisci non scriverlo, la preghiera funziona lo stesso.",
      },
      {
        q: "Posso riceverne una al giorno finché dura la terapia?",
        a: "Sì. La novena sono nove giorni consecutivi, il trigesimo trenta. Arrivano da sole, una al giorno, senza che tu debba ricordarti di chiederle.",
      },
    ],
  },
  {
    slug: "un-defunto",
    prayerTypeId: "defunti",
    title: "Preghiera per un defunto, scritta e recitata",
    description:
      "Una preghiera in memoria di chi non c'è più, composta sulla tua intenzione. In quindici tradizioni religiose, o come pensiero laico da leggere.",
    h1: "Una preghiera per chi non c'è più",
    lede:
      "Il primo anniversario. Un funerale a cui non puoi andare. Un lutto di cui non hai ancora parlato con nessuno. Scrivi il suo nome.",
    when:
      "Nei giorni subito dopo, quando servono parole e non ne vengono. All'anniversario, che arriva ogni anno e ogni anno coglie impreparati. Per un funerale lontano a cui non riesci a essere presente. O anni dopo, per un lutto che non hai mai davvero attraversato.",
    acrossFaiths: [
      {
        religionId: "cattolica",
        note: "Il suffragio: «L'eterno riposo dona a lui, o Signore». La tradizione lega il trigesimo al trentesimo giorno dalla morte.",
      },
      {
        religionId: "ebraismo",
        note: "Il Kaddish, che sorprende chi lo scopre: non parla di morte né di lutto: è pura lode a Dio, detta proprio da chi è in lutto.",
      },
      {
        religionId: "ortodossa",
        note: "Memoria eterna. Nella tradizione ortodossa ricordare il nome davanti a Dio è già, di per sé, l'atto di preghiera.",
      },
      {
        religionId: "islam",
        note: "La richiesta di misericordia e di riposo per il defunto, nella forma che segue la preghiera funebre.",
      },
      {
        religionId: "buddhismo",
        note: "L'accompagnamento nel passaggio e la dedica dei meriti, senza affermare nulla su ciò che accade dopo.",
      },
      {
        religionId: "laica",
        note: "Un testo da leggere ad alta voce a un funerale civile, quando ti chiedono due parole e non sai da dove cominciare.",
      },
    ],
    faq: [
      {
        q: "Posso leggerla al funerale?",
        a: "Sì, ed è uno degli usi più frequenti. Scrivi nell'intenzione che sarà letta ad alta voce davanti ad altri: cambia la costruzione delle frasi, che diventano più brevi e più dicibili.",
      },
      {
        q: "Cos'è il trigesimo?",
        a: "Nella tradizione cattolica è la messa che si celebra il trentesimo giorno dalla morte. Qui il pacchetto trigesimo sono trenta preghiere, una al giorno per trenta giorni, consegnate automaticamente.",
      },
      {
        q: "E se non credo?",
        a: "C'è la versione laica: nessuna divinità, nessuna formula, nessuna promessa sull'aldilà. Solo un testo scritto bene per ricordare una persona.",
      },
    ],
  },
  {
    slug: "la-pace-interiore",
    prayerTypeId: "pace",
    title: "Preghiera per la pace interiore e contro l'ansia",
    description:
      "Una preghiera per le notti in cui non si dorme e i giorni in cui non si respira. Scritta sulla tua intenzione e recitata a voce.",
    h1: "Una preghiera per la pace interiore",
    lede:
      "Ci sono periodi in cui la testa non si ferma. Un testo da riascoltare, sempre lo stesso, è una delle poche cose che aiutano.",
    when:
      "Le tre di notte, quando i pensieri girano e il sonno non torna. I giorni in cui il petto è stretto senza un motivo preciso. I periodi di cambiamento in cui tutto è incerto, e l'incertezza pesa più del problema.",
    acrossFaiths: [
      {
        religionId: "ortodossa",
        note: "La preghiera del cuore: il nome di Gesù ripetuto finché la mente si acquieta. È una tecnica, oltre che una preghiera.",
      },
      {
        religionId: "buddhismo",
        note: "Il registro della pratica, non della consolazione: osservare l'ansia senza combatterla, che è il modo in cui il buddhismo la disinnesca.",
      },
      {
        religionId: "taoismo",
        note: "La quiete come ritorno, non come conquista. L'acqua che vince cedendo — niente da forzare, il che è già un sollievo.",
      },
      {
        religionId: "islam",
        note: "Il dhikr, il ricordo ripetuto dei nomi di Allah, che ha la stessa funzione di ancoraggio della preghiera del cuore.",
      },
      {
        religionId: "bahai",
        note: "Il distacco come via alla quiete: alleggerire la presa sulle cose, che è il taglio bahá'í del tema.",
      },
      {
        religionId: "spiritualita-libera",
        note: "Senza appartenenza e senza formule: un testo da riascoltare quando serve, e basta.",
      },
    ],
    faq: [
      {
        q: "Sostituisce uno psicologo?",
        a: "No, in nessun modo. Se l'ansia ti sta condizionando la vita, quello che serve è un professionista. Una preghiera può accompagnare un percorso di cura, non prenderne il posto: chiunque suggerisca il contrario ti sta facendo un danno.",
      },
      {
        q: "Posso riascoltarla tutte le sere?",
        a: "Sì, il file audio resta tuo e il link non scade. Molte persone usano proprio così questa preghiera: sempre la stessa, come un'abitudine prima di dormire.",
      },
      {
        q: "Meglio il tono solenne o intimo?",
        a: "Per questa intenzione quasi sempre intimo: è più basso e più lento, e a tre di notte una voce da chiesa può ottenere l'effetto contrario.",
      },
    ],
  },
  {
    slug: "un-esame",
    prayerTypeId: "esame",
    title: "Preghiera per un esame, un concorso, un colloquio",
    description:
      "Una preghiera per il giorno decisivo: esame, concorso, colloquio di lavoro. Scritta sulla tua intenzione e recitata a voce.",
    h1: "Una preghiera per un esame",
    lede:
      "Hai studiato tutto quello che potevi. Resta la parte che non dipende da te, ed è quella che tiene svegli la notte prima.",
    when:
      "La sera prima della maturità. Il mattino di un concorso pubblico preparato per mesi. Il colloquio per il lavoro che cambierebbe le cose. L'esame che hai già ritentato due volte.",
    acrossFaiths: [
      {
        religionId: "cattolica",
        note: "San Giuseppe da Copertino è il patrono degli studenti, e la devozione popolare lo invoca proprio per gli esami.",
      },
      {
        religionId: "induismo",
        note: "Sarasvati, dea del sapere, prima dello studio; Ganesha per rimuovere l'ostacolo prima della prova.",
      },
      {
        religionId: "shintoismo",
        note: "Tenjin, il kami degli studi. Gli studenti giapponesi vanno a Dazaifu prima degli esami e ci lasciano una tavoletta.",
      },
      {
        religionId: "islam",
        note: "L'istikhāra quando la scelta è aperta, e il duʿāʾ per la facilitazione quando la prova è già fissata.",
      },
      {
        religionId: "laica",
        note: "Un incoraggiamento scritto bene, senza scaramanzie e senza promesse sul risultato.",
      },
    ],
    faq: [
      {
        q: "Serve a passare l'esame?",
        a: "No. Serve a te, la sera prima, e questo è già qualcosa. Nessuna preghiera cambia il voto di una commissione, e chi te lo lascia credere ti prende in giro.",
      },
      {
        q: "Posso farla per mio figlio?",
        a: "Sì, indica il suo nome nell'intenzione. È una delle richieste più frequenti in questa categoria, spesso da parte di genitori che non lo diranno mai al diretto interessato.",
      },
      {
        q: "Arriva in tempo se l'esame è domani mattina?",
        a: "Sì: la generazione richiede pochi minuti e la preghiera ti arriva via email appena pronta.",
      },
    ],
  },
  {
    slug: "il-lavoro",
    prayerTypeId: "lavoro",
    title: "Preghiera per il lavoro e per le difficoltà economiche",
    description:
      "Una preghiera per chi cerca lavoro, ha perso il posto o non arriva a fine mese. Scritta sulla tua intenzione e recitata a voce.",
    h1: "Una preghiera per il lavoro",
    lede:
      "Non è solo una questione di soldi: il lavoro è dignità, e quando manca manca anche quella. Scrivi la tua situazione.",
    when:
      "Una lettera di licenziamento. Mesi di candidature senza risposta. Un'attività che non regge più. La fine del mese che arriva prima dello stipendio, tutti i mesi.",
    acrossFaiths: [
      {
        religionId: "cattolica",
        note: "San Giuseppe lavoratore, che la Chiesa celebra il 1° maggio, e santa Rita per le situazioni che sembrano chiuse.",
      },
      {
        religionId: "protestante",
        note: "La tradizione riformata non separa fede e lavoro, e non ha imbarazzo a chiedere il pane quotidiano in modo concreto.",
      },
      {
        religionId: "sikhismo",
        note: "Kirat karo, il lavoro onesto, è uno dei tre pilastri della vita sikh: chiedere lavoro qui significa chiedere di poterlo fare con onestà.",
      },
      {
        religionId: "induismo",
        note: "Lakshmi per la prosperità, Ganesha per l'ostacolo che blocca. La tradizione distingue le due richieste.",
      },
      {
        religionId: "islam",
        note: "al-Razzāq, il Provvidente: il duʿāʾ per il rizq, il sostentamento, che nell'Islam ha un nome proprio.",
      },
    ],
    faq: [
      {
        q: "Non è un po' materiale come richiesta?",
        a: "Quasi nessuna tradizione la pensa così. Il pane quotidiano è nel Padre Nostro, il rizq ha un nome proprio nell'Islam, il lavoro onesto è un pilastro nel sikhismo. Chiedere di poter mantenere la propria famiglia è una delle preghiere più antiche che esistano.",
      },
      {
        q: "Posso farla per qualcun altro?",
        a: "Sì, e succede spesso: un genitore per un figlio che non trova lavoro, o qualcuno per un amico in difficoltà che non lo chiederebbe mai per sé.",
      },
      {
        q: "Il pacchetto mensile ha senso qui?",
        a: "Ha senso quando la situazione è lunga: dodici preghiere, una al mese per un anno, che accompagnano una ricerca invece di esaurirsi in un giorno.",
      },
    ],
  },
  {
    slug: "la-famiglia",
    prayerTypeId: "famiglia",
    title: "Preghiera per la famiglia, il matrimonio, una nascita",
    description:
      "Una preghiera per la tua famiglia: una nascita, un matrimonio, una riconciliazione. Scritta sulla tua intenzione e recitata a voce.",
    h1: "Una preghiera per la famiglia",
    lede:
      "Le famiglie si tengono insieme con gesti piccoli. Questo è uno: mettere per iscritto un augurio, e darlo a una voce.",
    when:
      "Una nascita. Un matrimonio. Una riconciliazione dopo anni di silenzio. Il trasferimento di un figlio all'estero. O semplicemente una casa che sta attraversando un periodo difficile.",
    acrossFaiths: [
      {
        religionId: "ebraismo",
        note: "La benedizione dei figli dello Shabbat, con il riferimento ai patriarchi e alle matriarche. Si dice ogni settimana, non solo nei momenti speciali.",
      },
      {
        religionId: "cattolica",
        note: "La Santa Famiglia come modello, e la benedizione della casa che il parroco porta a Pasqua.",
      },
      {
        religionId: "shintoismo",
        note: "Il culto domestico degli antenati, che nello shintō non è periferia ma centro della pratica.",
      },
      {
        religionId: "protestante",
        note: "La benedizione sulla casa e sul matrimonio, tema centrale della spiritualità evangelica.",
      },
      {
        religionId: "bahai",
        note: "L'unità della famiglia come immagine, in piccolo, dell'unità del genere umano.",
      },
      {
        religionId: "laica",
        note: "Per matrimoni civili e nascite, senza riferimenti religiosi: un augurio, scritto bene.",
      },
    ],
    faq: [
      {
        q: "Posso regalarla?",
        a: "Sì. Molte persone la ordinano per un matrimonio o una nascita e inoltrano il link e l'audio. Scrivi nell'intenzione che è un regalo e per chi: il testo si rivolgerà a loro, non a te.",
      },
      {
        q: "Va bene per un matrimonio misto?",
        a: "Indica entrambe le tradizioni nell'intenzione. Il testo cercherà il registro condiviso invece di privilegiarne una, che nelle famiglie miste è spesso la richiesta vera.",
      },
      {
        q: "E se la famiglia è in conflitto?",
        a: "Scrivilo. Una preghiera per una riconciliazione ha un tono diverso da una benedizione, e fingere che vada tutto bene si sentirebbe.",
      },
    ],
  },
  {
    slug: "la-protezione",
    prayerTypeId: "protezione",
    title: "Preghiera di protezione per sé o per una persona cara",
    description:
      "Una preghiera di protezione per chi ami, scritta sulla tua intenzione e recitata a voce. In quindici tradizioni religiose.",
    h1: "Una preghiera di protezione",
    lede:
      "Per qualcuno che è esposto, o lontano, o semplicemente fragile in questo periodo. Scrivi chi, e da cosa.",
    when:
      "Un figlio che esce la sera. Una persona che fa un lavoro pericoloso. Qualcuno che vive in un posto in guerra. Un periodo in cui hai la sensazione che qualcosa possa andare storto, senza saper dire cosa.",
    acrossFaiths: [
      {
        religionId: "cattolica",
        note: "L'angelo custode, e san Michele arcangelo per una protezione che la devozione popolare sente più combattiva.",
      },
      {
        religionId: "ortodossia-copta",
        note: "L'intercessione dei martiri, che nella Chiesa copta non è memoria storica ma presenza viva e quotidiana.",
      },
      {
        religionId: "shintoismo",
        note: "La logica dell'omamori, l'amuleto del santuario: una protezione che si porta addosso e si rinnova ogni anno.",
      },
      {
        religionId: "islam",
        note: "Il duʿāʾ che invoca al-Ḥafīẓ, il Custode, e affida la persona alla Sua protezione.",
      },
      {
        religionId: "sikhismo",
        note: "L'affidamento a Waheguru e la richiesta di chardi kala: lo spirito alto anche nella difficoltà.",
      },
    ],
    faq: [
      {
        q: "È un amuleto?",
        a: "No, e non lo vendiamo come tale. È un testo di preghiera. Non protegge da nulla in senso materiale, non porta fortuna e non allontana sfortuna: chi vende quello vende un'altra cosa, e la vende male.",
      },
      {
        q: "Protegge dal malocchio?",
        a: "No. Non facciamo scongiuri, rituali di rimozione né niente che assomigli alla magia. Se cerchi quello, questo non è il posto giusto.",
      },
      {
        q: "Posso farla per una persona che non lo sa?",
        a: "Sì, ed è frequente. La preghiera resta tua: la ricevi tu, e decidi se dirglielo o no.",
      },
    ],
  },
  {
    slug: "ringraziare",
    prayerTypeId: "ringraziamento",
    title: "Preghiera di ringraziamento, scritta e recitata",
    description:
      "Una preghiera per qualcosa che è andato bene: una guarigione, una nascita, uno scampato pericolo. Scritta sulla tua intenzione.",
    h1: "Una preghiera di ringraziamento",
    lede:
      "Si prega molto per chiedere e poco per ringraziare. Se qualcosa è andato bene, questa è l'occasione di dirlo.",
    when:
      "Un esito che non era scontato. Una guarigione arrivata. Un figlio nato sano. Un pericolo scampato di poco. O la fine di un periodo lungo e brutto, che finalmente è finito.",
    acrossFaiths: [
      {
        religionId: "ebraismo",
        note: "La berakhah: nell'ebraismo si benedice prima di chiedere, e la gratitudine è la forma base di ogni preghiera, non un caso particolare.",
      },
      {
        religionId: "protestante",
        note: "La lode che apre, prima ancora della richiesta: la postura tipica della preghiera evangelica.",
      },
      {
        religionId: "shintoismo",
        note: "Nello shintō il ringraziamento precede sempre la domanda, e chiedere troppo senza aver ringraziato è una scortesia.",
      },
      {
        religionId: "cattolica",
        note: "Il Te Deum e il Magnificat, le due grandi preghiere di lode della tradizione latina.",
      },
      {
        religionId: "islam",
        note: "Alhamdulillah — la lode ad Allah — che nella pratica quotidiana viene prima e più spesso di qualsiasi richiesta.",
      },
    ],
    faq: [
      {
        q: "Ha senso ringraziare se non ho chiesto niente?",
        a: "Nella maggior parte delle tradizioni sì, e anzi è considerata la forma più matura di preghiera: quella che non è mossa da un bisogno.",
      },
      {
        q: "Posso ringraziare per una grazia ricevuta?",
        a: "Sì. Scrivi nell'intenzione cosa hai chiesto e cosa è successo: il testo terrà insieme le due cose, che è esattamente la forma dell'ex voto.",
      },
      {
        q: "Che tono conviene?",
        a: "Gioioso è quello pensato per questa intenzione. Solenne funziona se il ringraziamento è per qualcosa di grave che si è risolto.",
      },
    ],
  },
  {
    slug: "chiedere-perdono",
    prayerTypeId: "perdono",
    title: "Preghiera per chiedere o concedere perdono",
    description:
      "Una preghiera per un torto fatto o subito, scritta sulla tua intenzione e recitata a voce. In quindici tradizioni religiose.",
    h1: "Una preghiera per il perdono",
    lede:
      "C'è chi deve chiederlo e chi non riesce a concederlo. Sono due preghiere diverse: scrivi quale delle due è la tua.",
    when:
      "Un torto che non hai mai riparato. Una persona a cui non hai fatto in tempo a chiedere scusa. Un rancore che ti porti da anni e che pesa più a te che a chi te l'ha causato.",
    acrossFaiths: [
      {
        religionId: "jainismo",
        note: "«Micchāmi dukkaḍam» — che il male fatto sia vano. Nel Kshamavani i jaina chiedono perdono a ogni essere vivente, senza eccezioni.",
      },
      {
        religionId: "ebraismo",
        note: "La teshuvah, che è ritorno più che pentimento. E la regola dura: per un torto verso una persona, il perdono va chiesto a lei, non a Dio.",
      },
      {
        religionId: "cattolica",
        note: "L'atto di dolore, e la distinzione fra il pentimento interiore e il sacramento della confessione, che resta cosa da fare in chiesa.",
      },
      {
        religionId: "islam",
        note: "La tawba e l'invocazione ad al-Ghafūr, il Perdonatore, con l'istighfār ripetuto.",
      },
      {
        religionId: "buddhismo",
        note: "Non colpa ma consapevolezza: riconoscere il danno, comprenderne l'origine, lasciare andare il rancore che avvelena chi lo tiene.",
      },
    ],
    faq: [
      {
        q: "Sostituisce la confessione?",
        a: "No. Nella tradizione cattolica il sacramento richiede un sacerdote, e questo non lo sostituisce in nessun modo. È un testo di pentimento personale, che semmai prepara.",
      },
      {
        q: "Posso chiedere perdono a chi è morto?",
        a: "Sì, ed è una delle richieste più frequenti in questa categoria — il torto rimasto in sospeso quando qualcuno se ne va all'improvviso. Scrivi la situazione, il testo la terrà.",
      },
      {
        q: "E se sono io a non riuscire a perdonare?",
        a: "Scrivilo così com'è. Una preghiera per riuscire a perdonare è diversa da una preghiera di scuse, e non fingerà che tu ci sia già arrivato.",
      },
    ],
  },
  {
    slug: "chi-parte",
    prayerTypeId: "viaggio",
    title: "Preghiera per chi parte o è lontano",
    description:
      "Una preghiera per un viaggio, una partenza, una persona lontana. Scritta sulla tua intenzione e recitata a voce.",
    h1: "Una preghiera per chi parte",
    lede:
      "Chi resta ha poco da fare, se non aspettare. Scrivere qualcosa per chi parte è un modo per accompagnarlo lo stesso.",
    when:
      "Un figlio che si trasferisce all'estero. Una persona che emigra per lavoro. Un viaggio lungo o difficile. O qualcuno che è lontano già da anni, e la distanza non si è mai abituata.",
    acrossFaiths: [
      {
        religionId: "cattolica",
        note: "San Cristoforo, patrono dei viaggiatori, e la benedizione sul cammino che i pellegrini ricevono prima di partire.",
      },
      {
        religionId: "ebraismo",
        note: "La Tefillat HaDerech, la preghiera del viaggiatore, che si dice una volta usciti dalla città.",
      },
      {
        religionId: "islam",
        note: "Il duʿāʾ del viaggio, che la tradizione lega alla partenza e che ogni pellegrino conosce.",
      },
      {
        religionId: "taoismo",
        note: "L'immagine della via — dao è anche, letteralmente, la strada — e del procedere senza forzare il passo.",
      },
      {
        religionId: "ortodossia-copta",
        note: "Un tema che la diaspora copta ed eritrea conosce da vicino: chi è partito e chi è rimasto ad aspettare.",
      },
    ],
    faq: [
      {
        q: "Posso mandarla a chi è già partito?",
        a: "Sì. Ricevi un link e un file audio, e li inoltri a chi vuoi, dove si trova.",
      },
      {
        q: "In che lingua conviene?",
        a: "Se chi parte vive già in un'altra lingua, spesso ha più senso quella: sentirsi pregare nella lingua di casa da lontano ha un effetto che la traduzione non ha. Sono disponibili venticinque lingue.",
      },
      {
        q: "Va bene per un'emigrazione, non solo per un viaggio?",
        a: "Sì, e il tono cambia parecchio: una partenza definitiva non è una vacanza. Scrivi di cosa si tratta.",
      },
    ],
  },
  {
    slug: "chiedere-una-grazia",
    prayerTypeId: "richiesta",
    title: "Preghiera per chiedere una grazia o un aiuto",
    description:
      "Una supplica per una situazione difficile, scritta sulla tua intenzione e recitata a voce. In quindici tradizioni religiose.",
    h1: "Una preghiera per chiedere aiuto",
    lede:
      "Quando la situazione è più grande di te e non sai più a chi chiedere. Scrivila qui, per esteso.",
    when:
      "Una causa che sembra persa. Una situazione familiare bloccata da anni. Una decisione che non riesci a prendere. Un momento in cui hai provato tutto quello che sapevi provare.",
    acrossFaiths: [
      {
        religionId: "cattolica",
        note: "Santa Rita e san Giuda Taddeo, che la devozione popolare invoca per le cause impossibili. E la novena, che è preghiera insistente per nove giorni.",
      },
      {
        religionId: "islam",
        note: "L'istikhāra quando bisogna scegliere e non si vede chiaro: non chiede l'esito, chiede la guida.",
      },
      {
        religionId: "sikhismo",
        note: "L'Ardās, dove prima di chiedere si ricordano i Guru — una sequenza che ridimensiona la domanda prima ancora di formularla.",
      },
      {
        religionId: "induismo",
        note: "Ganesha, che si invoca per primo perché è quello che rimuove l'ostacolo prima che l'impresa cominci.",
      },
      {
        religionId: "ortodossa",
        note: "Il registro della supplica insistente, dove «Signore, pietà» ripetuto non è impazienza ma respiro.",
      },
    ],
    faq: [
      {
        q: "Funziona?",
        a: "Non lo sappiamo, e chi ti dice di sì sta vendendo. Quello che possiamo garantire è il testo: scritto bene, dentro la tua tradizione, sulla tua situazione. Il resto non dipende da noi né da nessun altro servizio.",
      },
      {
        q: "Meglio una preghiera o una novena?",
        a: "La novena — nove giorni sulla stessa intenzione — è la forma che quasi tutte le tradizioni danno alla richiesta insistente. Se la questione è grave, ha più senso di una preghiera sola.",
      },
      {
        q: "Quanto posso scrivere nell'intenzione?",
        a: "Fino a 1500 caratteri. Più contesto dai, più il testo è tuo: i dettagli concreti fanno la differenza fra una preghiera generica e una che parla della tua situazione.",
      },
    ],
  },
  {
    slug: "ogni-giorno",
    prayerTypeId: "quotidiana",
    title: "Preghiera quotidiana personalizzata, una al giorno",
    description:
      "Una preghiera al giorno, sulla tua intenzione, consegnata automaticamente. Novena di nove giorni, trigesimo di trenta, o un anno intero.",
    h1: "Una preghiera per ogni giorno",
    lede:
      "Le tradizioni che durano non chiedono molto una volta: chiedono poco, tutti i giorni. Questa è la versione quotidiana.",
    when:
      "Quando la situazione è lunga e non si risolve in un giorno: una malattia, un lutto, una ricerca di lavoro. O quando semplicemente vuoi ricominciare a pregare e ti serve qualcosa che torni da solo, senza dipendere dalla tua costanza.",
    acrossFaiths: [
      {
        religionId: "islam",
        note: "Cinque volte al giorno, a orari fissi: nessuna tradizione ha strutturato la quotidianità della preghiera con altrettanta precisione.",
      },
      {
        religionId: "ebraismo",
        note: "Shacharit, Mincha, Arvit: mattino, pomeriggio, sera. La giornata ebraica è scandita da tre appuntamenti.",
      },
      {
        religionId: "cattolica",
        note: "La Liturgia delle Ore, e la novena come forma della preghiera ripetuta su una sola intenzione.",
      },
      {
        religionId: "buddhismo",
        note: "La pratica quotidiana, dove la costanza conta più dell'intensità del singolo giorno.",
      },
      {
        religionId: "ortodossa",
        note: "La preghiera del cuore, che nella tradizione esicasta tende a diventare continua, non solo quotidiana.",
      },
    ],
    faq: [
      {
        q: "Come funziona la consegna automatica?",
        a: "La prima preghiera la scrivi tu dalla dashboard, e diventa il modello. Dalle successive il sistema le genera e te le manda da solo, una al giorno, senza che tu debba fare niente.",
      },
      {
        q: "Sono tutte uguali?",
        a: "No. Il testo tiene conto della posizione nella sequenza: la prima apre il cammino, quelle in mezzo tengono la perseveranza, l'ultima chiude e affida l'esito. È la logica della novena.",
      },
      {
        q: "Posso interromperla?",
        a: "Sì, con l'interruttore in dashboard. I crediti restano tuoi e li usi a mano quando vuoi, senza perderli.",
      },
    ],
  },
];

export function getIntentionLanding(slug: string): IntentionLanding | undefined {
  return INTENTION_LANDINGS.find((l) => l.slug === slug);
}
