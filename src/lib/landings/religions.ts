import type { ReligionLanding } from "./types";

/**
 * Una landing per tradizione. Il contenuto di `howItPrays` viene dal modo in
 * cui quella fede prega davvero — struttura dell'orazione, nomi del divino,
 * formule di chiusura — non da un modello riempito col nome della religione.
 */
export const RELIGION_LANDINGS: ReligionLanding[] = [
  {
    slug: "cattolica",
    religionId: "cattolica",
    title: "Preghiera cattolica personalizzata, scritta e recitata",
    description:
      "Una preghiera cattolica composta sulla tua intenzione, nel registro delle orazioni del Messale, e recitata a voce. Rito romano, ambrosiano, devozione mariana.",
    h1: "Una preghiera cattolica scritta per la tua intenzione",
    lede:
      "Ci sono giorni in cui vorresti far dire una preghiera e non riesci ad andare in chiesa. Scrivi qui la tua intenzione: ne nasce un'orazione cattolica, tua, che puoi ascoltare e riascoltare.",
    howItPrays:
      "L'orazione cattolica ha una forma antica e riconoscibile: ci si rivolge a Dio Padre per mezzo di Cristo, si ricorda un attributo divino, si formula la domanda, si chiude nello Spirito Santo. È la struttura delle collette del Messale, e la usiamo. Quando l'intenzione lo chiede, la preghiera passa per un intercessore — la Vergine Maria, o il santo che la devozione popolare ha legato a quella necessità: sant'Antonio per ciò che si è perduto, santa Rita per le cause impossibili, san Giuseppe per il lavoro e per la buona morte. La chiusura è quella che conosci: «Nel nome del Padre, del Figlio e dello Spirito Santo. Amen».",
    languageNote:
      "In italiano di default, nel registro liturgico che si sente in parrocchia. Disponibile anche in latino d'uso corrente attraverso le formule tradizionali, e in polacco, portoghese, spagnolo e filippino — le lingue delle comunità cattoliche più numerose fuori dall'Italia.",
    intentions: [
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Il suffragio per l'anima, nella forma del «L'eterno riposo dona a lui/lei, o Signore».",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Con l'invocazione a Cristo medico e, se vuoi, l'intercessione di san Pio o della Madonna di Lourdes.",
      },
      {
        prayerTypeId: "novena",
        label: "Novena",
        note: "Nove giorni di preghiera insistente sulla stessa intenzione, una al giorno, consegnate da sole.",
      },
      {
        prayerTypeId: "rosario",
        label: "Intenzione del Rosario",
        note: "Una decina offerta per la persona che indichi, col mistero adatto al momento.",
      },
    ],
    faq: [
      {
        q: "È una preghiera approvata dalla Chiesa?",
        a: "No, e non lo pretende. È una preghiera privata, come quella che scriveresti tu con parole tue se ne avessi il tempo e il registro. Non sostituisce la Messa, i sacramenti né le intenzioni affidate a un sacerdote: quelle si chiedono in parrocchia.",
      },
      {
        q: "Posso far celebrare una Messa da qui?",
        a: "No. La Messa la celebra un sacerdote ordinato e va richiesta alla tua parrocchia o a un santuario. Qui ricevi un testo di preghiera personale, scritto e recitato.",
      },
      {
        q: "Posso scegliere il rito?",
        a: "Sì: romano, ambrosiano, devozione mariana o spiritualità francescana. Il rito cambia il lessico e le immagini — l'ambrosiano ha un suo respiro, il francescano parla di creature e di povertà.",
      },
    ],
  },
  {
    slug: "ortodossa",
    religionId: "ortodossa",
    title: "Preghiera ortodossa personalizzata, scritta e recitata",
    description:
      "Una preghiera nella tradizione ortodossa sulla tua intenzione: registro innodico, invocazione alla Theotokos, dossologia trinitaria. In italiano, russo, greco, rumeno o ucraino.",
    h1: "Una preghiera ortodossa per la tua intenzione",
    lede:
      "La preghiera ortodossa non argomenta: invoca, e ripete. Scrivi la tua intenzione e ricevi un testo che segue quel respiro, recitato a voce.",
    howItPrays:
      "Nella tradizione ortodossa la preghiera è più vicina all'inno che alla richiesta. Torna su se stessa — «Signore, pietà» ripetuto non è insistenza ma respiro — e chiama la Madre di Dio col titolo che il Concilio di Efeso le ha riconosciuto, Theotokos. Non c'è la scansione argomentativa dell'orazione latina: c'è un accumulo di invocazioni che porta chi prega dentro un ritmo. La chiusura è la dossologia: «ora e sempre e nei secoli dei secoli. Amen». Quando l'intenzione è personale e insistente, la forma naturale è la preghiera del cuore, il nome di Gesù ripetuto finché la mente si acquieta.",
    languageNote:
      "Oltre all'italiano puoi scegliere il russo, il greco, il rumeno o l'ucraino. Non è un dettaglio: per molte comunità ortodosse in Italia la lingua della preghiera è ancora quella di casa, e sentirla nella propria fa una differenza che la traduzione non copre.",
    intentions: [
      {
        prayerTypeId: "gesu",
        label: "Preghiera del cuore",
        note: "«Signore Gesù Cristo, Figlio di Dio, abbi pietà di me peccatore», nella sua forma ripetuta.",
      },
      {
        prayerTypeId: "theotokos",
        label: "Alla Theotokos",
        note: "Rivolta alla Madre di Dio, nel registro degli inni acatisti.",
      },
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Memoria eterna: il ricordo del nome davanti a Dio, che nella tradizione ortodossa è già preghiera.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Con l'invocazione ai santi guaritori, gli anàrgiri che curavano senza compenso.",
      },
    ],
    faq: [
      {
        q: "Segue il calendario giuliano?",
        a: "Il testo non dipende dal calendario, ma se la tua intenzione è legata a una festa puoi scriverlo: la preghiera terrà conto del tempo liturgico che indichi.",
      },
      {
        q: "Posso farla recitare in slavo ecclesiastico?",
        a: "No, non è fra le lingue disponibili. Il russo moderno è l'alternativa più vicina, e per una preghiera personale è la scelta che la maggior parte delle comunità usa comunque.",
      },
      {
        q: "Che differenza c'è fra greco-ortodosso e russo-ortodosso, qui?",
        a: "Cambiano il lessico e le immagini: la tradizione greca è più vicina agli inni bizantini, quella russa alla spiritualità dei padri del deserto ripresa dalla Filocalia. Scegli quella in cui ti riconosci.",
      },
    ],
  },
  {
    slug: "evangelica",
    religionId: "protestante",
    title: "Preghiera evangelica e protestante personalizzata",
    description:
      "Una preghiera protestante o evangelica sulla tua intenzione: rivolta a Dio nel nome di Gesù, radicata nella Scrittura, senza intercessione dei santi.",
    h1: "Una preghiera evangelica per la tua intenzione",
    lede:
      "Nella fede evangelica si prega senza intermediari: si parla a Dio come si parla a un padre. Scrivi cosa hai sul cuore, ricevi un testo che lo dice bene.",
    howItPrays:
      "La preghiera protestante è diretta e personale. Non passa per i santi né per la Vergine: si rivolge a Dio nel nome di Gesù, perché è quello il solo mediatore che la Riforma riconosce. Il registro è caldo, parlato, più vicino alla lettera che all'orazione liturgica — e la Scrittura non è un ornamento ma la sostanza: una promessa biblica citata a proposito vale più di dieci aggettivi. Nelle tradizioni pentecostali ed evangeliche c'è anche il ringraziamento che precede la richiesta, la lode come postura di partenza. La chiusura è semplice: «Nel nome di Gesù, amen».",
    languageNote:
      "Italiano, inglese, portoghese e spagnolo. Il portoghese e lo spagnolo non sono di contorno: le comunità evangeliche brasiliane e latinoamericane in Italia sono fra le più vive, e pregano nella loro lingua.",
    intentions: [
      {
        prayerTypeId: "ringraziamento",
        label: "Ringraziamento",
        note: "La lode che apre, prima ancora di chiedere: la forma tipica della preghiera evangelica.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Con le promesse bibliche sulla guarigione, senza pretendere di garantirla.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Per la famiglia",
        note: "Benedizione sulla casa, sul matrimonio, sui figli — tema centrale nella spiritualità evangelica.",
      },
      {
        prayerTypeId: "lavoro",
        label: "Lavoro e provvidenza",
        note: "La richiesta concreta, senza imbarazzo: la tradizione riformata non separa fede e lavoro.",
      },
    ],
    faq: [
      {
        q: "Cita versetti biblici?",
        a: "Sì, ma solo versetti reali e verificabili, mai inventati né con riferimenti approssimativi. Se un riferimento non è certo, la preghiera usa il contenuto della promessa senza attribuirle capitolo e versetto.",
      },
      {
        q: "Vale per luterani, valdesi, battisti e pentecostali insieme?",
        a: "Puoi scegliere la tua tradizione: luterana, riformata/valdese, evangelica/pentecostale, anglicana o battista. Il registro cambia — l'anglicano è più liturgico, il pentecostale più diretto.",
      },
      {
        q: "Prega ai santi?",
        a: "No, mai. È una delle differenze su cui la tradizione protestante non transige, e il testo la rispetta.",
      },
    ],
  },
  {
    slug: "islamica",
    religionId: "islam",
    title: "Duʿāʾ personalizzato, scritto e recitato in arabo",
    description:
      "Un duʿāʾ composto sulla tua intenzione: apertura con la Basmala, invocazione con i bei nomi di Allah, benedizione sul Profeta. In arabo, urdu, persiano, turco o indonesiano.",
    h1: "Un duʿāʾ scritto per la tua intenzione",
    lede:
      "Il duʿāʾ è l'invocazione libera, quella che ognuno rivolge ad Allah con parole sue. Scrivi la tua necessità: ne nasce un testo che la porta, recitato a voce.",
    howItPrays:
      "Un duʿāʾ non è una sura: è invocazione personale, e la distinzione qui è rigorosa. Il testo si apre con la Basmala — «Bismillāhi r-raḥmāni r-raḥīm» — e chiama Allah con i Suoi bei nomi, scegliendo quello che l'intenzione richiede: al-Shāfī, il Guaritore, quando si chiede salute; al-Razzāq, il Provvidente, quando si chiede sostentamento; al-Ghafūr, il Perdonatore, quando si chiede perdono. Prima della richiesta viene la lode, e sul Profeta si invoca la benedizione — «la pace e la benedizione siano su di lui». Si chiude con «Āmīn».",
    languageNote:
      "L'arabo è la lingua in cui l'invocazione suona come deve, ed è quella che consigliamo. Ma la umma non è solo araba: trovi anche l'urdu per il Pakistan, il persiano per l'Iran, il turco e l'indonesiano — che è la lingua del Paese musulmano più popoloso al mondo. Per urdu e persiano usiamo un modello vocale diverso, l'unico che le pronuncia correttamente.",
    intentions: [
      {
        prayerTypeId: "istikhara",
        label: "Istikhāra",
        note: "L'invocazione per chiedere guida quando si deve scegliere e non si vede chiaro.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione (shifāʾ)",
        note: "Con l'invocazione ad al-Shāfī, e la formula per il malato che la tradizione conserva.",
      },
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "La richiesta di misericordia e di riposo, secondo l'uso che segue il funerale.",
      },
      {
        prayerTypeId: "dhikr",
        label: "Dhikr",
        note: "Il ricordo: i nomi di Allah ripetuti, nella forma che la tradizione sufi ha coltivato.",
      },
    ],
    faq: [
      {
        q: "Recita versetti del Corano?",
        a: "No, e questa è una regola che non violiamo. Il testo è un duʿāʾ, invocazione personale. Non cita versetti coranici, non attribuisce numeri di sura o di versetto, non inventa testo sacro. Il Corano si recita dal Corano.",
      },
      {
        q: "Va bene per sunniti e sciiti?",
        a: "Puoi indicare la tua tradizione — sunnita, sciita o sufi — e il registro si adegua. Le formule di apertura e chiusura restano quelle condivise.",
      },
      {
        q: "La voce è maschile o femminile?",
        a: "Maschile di default, e per le lingue a scrittura araba usiamo una voce madrelingua: un timbro italiano che legge l'arabo si sente, e in preghiera stona.",
      },
    ],
  },
  {
    slug: "ebraica",
    religionId: "ebraismo",
    title: "Preghiera ebraica personalizzata, scritta e recitata",
    description:
      "Una preghiera nella tradizione ebraica sulla tua intenzione: forma della berakhah, rispetto del Nome, Mi Sheberach per la guarigione. In italiano o in ebraico.",
    h1: "Una preghiera ebraica per la tua intenzione",
    lede:
      "Nella tradizione ebraica si benedice prima di chiedere. Scrivi la tua intenzione: ne nasce un testo che ne ha la forma, e la voce per dirlo.",
    howItPrays:
      "La forma è quella della berakhah: «Barukh atah Adonai, Elohenu melekh ha-olam» — benedetto sei Tu, Signore nostro Dio, Re dell'universo. Si comincia riconoscendo, non domandando. Il Nome non si pronuncia: il testo usa HaShem o «il Signore», come si fa fuori dalla liturgia, e questa non è una precauzione formale ma il rispetto di una legge. Quando l'intenzione è la salute di qualcuno, la forma è quella del Mi Sheberach, che nomina il malato e chiede refuah shlemah, guarigione piena del corpo e dello spirito. Per un defunto, l'intenzione si lega al Kaddish — che, va detto, non parla di morte ma è pura lode.",
    languageNote:
      "In italiano o in ebraico. L'ebraico merita una nota tecnica: il modello vocale che usiamo per tutte le altre lingue non lo supporta, quindi per l'ebraico passiamo a un modello diverso. È il motivo per cui questa lingua è arrivata solo ora.",
    intentions: [
      {
        prayerTypeId: "refuah",
        label: "Mi Sheberach",
        note: "La preghiera per la guarigione, che nomina il malato e chiede refuah shlemah.",
      },
      {
        prayerTypeId: "kaddish",
        label: "Intenzione di Kaddish",
        note: "In memoria di un defunto, nel registro della lode che il Kaddish è davvero.",
      },
      {
        prayerTypeId: "shabbat",
        label: "Per lo Shabbat",
        note: "La benedizione del settimo giorno, sulla casa e su chi la abita.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Per la famiglia",
        note: "Con il riferimento ai patriarchi e alle matriarche, come vuole la benedizione dei figli.",
      },
    ],
    faq: [
      {
        q: "Pronuncia il Tetragramma?",
        a: "No. Il testo usa HaShem o «il Signore». È una regola che rispettiamo sempre, in italiano come in ebraico.",
      },
      {
        q: "Sostituisce il Kaddish detto in sinagoga?",
        a: "No. Il Kaddish si dice con il minyan, e nessun testo generato può prenderne il posto. Qui ricevi un'intenzione di memoria, che è un'altra cosa e non pretende di essere quella.",
      },
      {
        q: "Vale per ortodossi, conservative e riformati?",
        a: "Puoi indicare la tua tradizione, incluso il mondo chassidico. Cambia il registro e cambia quanto il testo si appoggia alla formula fissa rispetto alla parola libera.",
      },
    ],
  },
  {
    slug: "induista",
    religionId: "induismo",
    title: "Preghiera induista personalizzata, scritta e recitata",
    description:
      "Una preghiera nella tradizione induista sulla tua intenzione, rivolta alla divinità adatta: Ganesha per gli ostacoli, Lakshmi per la prosperità, Dhanvantari per la salute.",
    h1: "Una preghiera induista per la tua intenzione",
    lede:
      "Nell'induismo si sceglie la divinità secondo la necessità. Scrivi la tua: il testo invoca quella giusta, e la voce la recita.",
    howItPrays:
      "La preghiera induista comincia da una scelta che le altre tradizioni non fanno: a chi rivolgersi. Ganesha si invoca quando c'è un ostacolo da rimuovere, ed è per questo che apre quasi ogni impresa; Lakshmi quando si chiede prosperità; Dhanvantari e Shiva nella forma di Vaidyanatha quando si chiede salute; Sarasvati prima di uno studio o di un esame. Il testo può aprirsi con «Oṃ» e contenere un mantra semplice e diffuso, di quelli che si ripetono in japa. La chiusura tradizionale è la triplice invocazione di pace: «Oṃ śāntiḥ śāntiḥ śāntiḥ» — tre volte, per i tre livelli di disturbo che la pace deve raggiungere.",
    languageNote:
      "In italiano, hindi o tamil. Il tamil non è un di più: la devozione del sud dell'India ha una sua letteratura e un suo suono, e chi prega in tamil non prega in hindi tradotto.",
    intentions: [
      {
        prayerTypeId: "ganesha",
        label: "A Ganesha",
        note: "Per rimuovere un ostacolo: l'invocazione con cui si apre ogni cosa nuova.",
      },
      {
        prayerTypeId: "puja",
        label: "Intenzione di pūjā",
        note: "L'offerta rituale, con l'intenzione che la accompagna.",
      },
      {
        prayerTypeId: "mantra",
        label: "Mantra e japa",
        note: "Un mantra diffuso, nella forma pensata per la ripetizione.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Rivolta a Dhanvantari, che nella tradizione porta l'amrita e la medicina.",
      },
    ],
    faq: [
      {
        q: "Posso indicare la mia ishta-devata?",
        a: "Sì, scrivila nell'intenzione. Se non la indichi, il testo sceglie la divinità che la tradizione associa a quel tipo di necessità.",
      },
      {
        q: "Il mantra è traslitterato correttamente?",
        a: "Usiamo mantra diffusi e consolidati, in traslitterazione standard. Non ne inventiamo di nuovi e non attribuiamo mantra a testi che non li contengono.",
      },
      {
        q: "Vaishnava, Shaiva, Shakta: cambia qualcosa?",
        a: "Cambia molto — la divinità centrale, le immagini, il vocabolario. Puoi scegliere la tua linea, o restare sullo Smarta se preferisci un registro generale.",
      },
    ],
  },
  {
    slug: "buddhista",
    religionId: "buddhismo",
    title: "Aspirazione buddhista personalizzata, scritta e recitata",
    description:
      "Non una supplica ma un'aspirazione: mettā per chi indichi e dedica dei meriti, nella tradizione Theravāda, Mahāyāna, Vajrayāna o Zen.",
    h1: "Un'aspirazione buddhista per la tua intenzione",
    lede:
      "Nel buddhismo non si supplica: si formula un'aspirazione e si dedica il bene compiuto. Scrivi per chi, e ricevi il testo che lo fa.",
    howItPrays:
      "Qui la parola «preghiera» va usata con cautela, perché non c'è un dio creatore da pregare. C'è invece la mettā, la gentilezza amorevole formulata come augurio: «che tu sia libero dalla sofferenza, che tu sia in pace» — ripetuta allargando il cerchio, da sé alla persona cara, fino a tutti gli esseri. E c'è la dedica dei meriti, che è il gesto più caratteristico: il bene generato non si trattiene, si offre. Il riferimento è ai Tre Gioielli — il Buddha, il Dharma, il Sangha. Il tono non implora e non promette: constata, augura, lascia andare.",
    languageNote:
      "Italiano, cinese, giapponese, coreano o vietnamita. Il vietnamita richiede un modello vocale diverso dagli altri, per ragioni tecniche: lo abbiamo aggiunto perché la comunità buddhista vietnamita in Europa è numerosa e prega nella propria lingua.",
    intentions: [
      {
        prayerTypeId: "metta",
        label: "Mettā",
        note: "L'augurio di bene, formulato per la persona che indichi e poi allargato.",
      },
      {
        prayerTypeId: "dedica",
        label: "Dedica dei meriti",
        note: "Offrire ad altri il bene compiuto: il gesto che chiude ogni pratica.",
      },
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Accompagnamento nel passaggio, senza pretese su ciò che accade dopo.",
      },
      {
        prayerTypeId: "pace",
        label: "Pace interiore",
        note: "Per l'ansia e l'insonnia: il registro della pratica, non della consolazione.",
      },
    ],
    faq: [
      {
        q: "Ma il buddhismo prega?",
        a: "Dipende da cosa si intende. Non c'è supplica a un creatore, ma esistono recitazione, aspirazione e dedica dei meriti, che sono pratiche vive in tutte le scuole. Il testo che ricevi sta in quella forma, non in quella della richiesta.",
      },
      {
        q: "Theravāda e Zen danno lo stesso testo?",
        a: "No. Il Theravāda resta più vicino alle formule pali, lo Zen è essenziale fino all'osso, il Vajrayāna è più ricco di immagini. Scegli la scuola e il testo cambia davvero.",
      },
      {
        q: "Posso dedicarla a una persona che non è buddhista?",
        a: "Sì. La dedica dei meriti non chiede nulla a chi la riceve, e nella logica della tradizione questo non è un problema.",
      },
    ],
  },
  {
    slug: "sikh",
    religionId: "sikhismo",
    title: "Ardās personalizzata, scritta e recitata in punjabi",
    description:
      "Una supplica nella tradizione sikh sulla tua intenzione: apertura con Ik Onkar, ricordo dei Guru, richiesta umile. In italiano o in punjabi.",
    h1: "Una preghiera sikh per la tua intenzione",
    lede:
      "L'Ardās è la supplica che i sikh fanno insieme, in piedi. Scrivi la tua intenzione e ricevine una versione personale, recitata a voce.",
    howItPrays:
      "Si apre con Ik Onkar: l'Uno, senza forma, senza nemici, senza paura. Poi la struttura dell'Ardās fa una cosa precisa — prima di chiedere, ricorda: i Guru, uno dopo l'altro, e chi ha sofferto per la fede. Solo dopo questo ricordo arriva la domanda, e arriva umile, perché il senso della sequenza è proprio ridimensionare la richiesta rispetto a ciò che è già stato dato. Ci si rivolge a Waheguru. La chiusura è quella condivisa: «Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh».",
    languageNote:
      "In italiano o in punjabi. Il punjabi ha richiesto un modello vocale diverso da quello che usiamo per la maggior parte delle lingue — è la ragione per cui non c'era prima. La comunità sikh in Italia è fra le più numerose d'Europa, soprattutto nella pianura padana, e la lingua della preghiera è la sua.",
    intentions: [
      {
        prayerTypeId: "ardas",
        label: "Ardās",
        note: "La supplica nella sua forma propria: ricordo dei Guru, poi la richiesta.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Per la famiglia",
        note: "Sulla casa e su chi la abita, nel registro della benedizione sikh.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Con l'affidamento a Waheguru e la richiesta di chardi kala, spirito alto.",
      },
      {
        prayerTypeId: "lavoro",
        label: "Lavoro e onestà",
        note: "Kirat karo, il lavoro onesto: uno dei tre pilastri della vita sikh.",
      },
    ],
    faq: [
      {
        q: "Sostituisce l'Ardās del gurdwara?",
        a: "No. L'Ardās si fa insieme, davanti al Guru Granth Sahib, ed è un atto comunitario. Questo è un testo personale che ne ha la forma e il rispetto, non il valore rituale.",
      },
      {
        q: "Cita il Guru Granth Sahib?",
        a: "Non riporta passi attribuiti al Guru Granth Sahib. Usa il registro e le formule condivise dell'Ardās, senza inventare scrittura sacra.",
      },
      {
        q: "Punjabi in gurmukhi?",
        a: "Il testo scritto è in punjabi e la voce lo recita. La resa della scrittura gurmukhi dipende dal supporto del tuo dispositivo.",
      },
    ],
  },
  {
    slug: "bahai",
    religionId: "bahai",
    title: "Preghiera bahá'í personalizzata, scritta e recitata",
    description:
      "Una preghiera nella tradizione bahá'í sulla tua intenzione: registro elevato, temi di unità, distacco e servizio. Scritta e recitata a voce.",
    h1: "Una preghiera bahá'í per la tua intenzione",
    lede:
      "La preghiera bahá'í ha un tono suo, alto e poetico, e tre temi che tornano sempre. Scrivi la tua intenzione e ricevi un testo che li porta.",
    howItPrays:
      "Ci si rivolge a Dio con appellativi che aprono verso l'alto — «O Tu, Signore misericordioso», «O Tu, il Compassionevole» — e il registro resta elevato per tutto il testo: la preghiera bahá'í non abbassa mai il tono al colloquiale. Tre temi la attraversano quasi sempre, anche quando l'intenzione è particolare: l'unità del genere umano, il distacco dalle cose, il servizio agli altri. La richiesta personale viene inquadrata dentro questi, mai contro di essi. La chiusura riconosce gli attributi divini: «Tu sei, in verità, il Potente, il Generoso».",
    languageNote:
      "In italiano o in inglese, e in persiano — la lingua in cui gran parte degli scritti bahá'í è stata rivelata. Per il persiano usiamo un modello vocale diverso, l'unico che lo pronuncia correttamente.",
    intentions: [
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Nel registro della preghiera di guarigione, che chiede il rimedio e il distacco insieme.",
      },
      {
        prayerTypeId: "pace",
        label: "Pace interiore",
        note: "Il distacco come via alla quiete, che è il taglio bahá'í del tema.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Per la famiglia",
        note: "Unità della casa come immagine dell'unità del genere umano.",
      },
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Il progresso dell'anima nei mondi di Dio, come la tradizione lo descrive.",
      },
    ],
    faq: [
      {
        q: "È una preghiera rivelata?",
        a: "No, ed è una distinzione che nella fede bahá'í conta molto. Le preghiere rivelate da Bahá'u'lláh, dal Báb e da 'Abdu'l-Bahá sono quelle e si leggono dai loro scritti. Questo è un testo personale nel loro registro, non un'aggiunta al corpus.",
      },
      {
        q: "Va bene per le preghiere obbligatorie?",
        a: "No. Le tre preghiere obbligatorie hanno testo e condizioni fissati, e non si sostituiscono.",
      },
      {
        q: "Posso usarla in una riunione di preghiera?",
        a: "Puoi leggerla come si legge un testo personale, ma sappi che non ha lo statuto di preghiera rivelata e va presentata per quello che è.",
      },
    ],
  },
  {
    slug: "jainista",
    religionId: "jainismo",
    title: "Preghiera jainista personalizzata, scritta e recitata",
    description:
      "Una preghiera nella tradizione jaina sulla tua intenzione: ahimsa, perdono, distacco, con riferimento al Namokar Mantra e ai Tirthankara.",
    h1: "Una preghiera jainista per la tua intenzione",
    lede:
      "Il jainismo non chiede a un dio: si volge verso chi ha già attraversato. Scrivi la tua intenzione e ricevi un testo che sta in quella logica.",
    howItPrays:
      "Il Namokar Mantra, che apre ogni pratica, non chiede nulla: rende omaggio ai cinque esseri supremi, e questo dice già tutto sulla forma della preghiera jaina. Non c'è un creatore che concede grazie; c'è l'omaggio a chi ha raggiunto la liberazione, e la trasformazione di chi prega. Ahimsa, la non violenza, non è un tema fra gli altri ma la lente su tutto: anche una richiesta per sé viene formulata in modo da non pesare su nessun essere vivente. Quando il tema è il perdono, la chiusura è «Micchāmi dukkaḍam» — che il male fatto sia vano — la formula del Kshamavani, il giorno in cui si chiede perdono a tutti.",
    languageNote:
      "In italiano o in hindi. Il gujarati, che è la lingua di gran parte della comunità jaina, non è ancora fra quelle disponibili.",
    intentions: [
      {
        prayerTypeId: "namokar",
        label: "Intenzione del Namokar",
        note: "L'omaggio ai cinque esseri supremi, con l'intenzione che vi si appoggia.",
      },
      {
        prayerTypeId: "perdono",
        label: "Perdono",
        note: "Nella forma del Kshamavani: chiedere perdono a ogni essere, senza eccezioni.",
      },
      {
        prayerTypeId: "pace",
        label: "Pace interiore",
        note: "Il distacco come pratica, non come rassegnazione.",
      },
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Nel quadro jaina del cammino dell'anima, senza affermazioni sul suo esito.",
      },
    ],
    faq: [
      {
        q: "Il jainismo prega una divinità?",
        a: "No. Rende omaggio ai Tirthankara e ai liberati, che non intervengono e non concedono: sono modelli. Il testo rispetta questa differenza e non li tratta come intercessori.",
      },
      {
        q: "Rispetta l'ahimsa anche nel linguaggio?",
        a: "Sì. Nessuna immagine di violenza, nessuna richiesta che implichi un danno a qualcuno, nemmeno indiretto o metaforico.",
      },
      {
        q: "È disponibile in gujarati?",
        a: "Non ancora. Al momento italiano e hindi.",
      },
    ],
  },
  {
    slug: "taoista",
    religionId: "taoismo",
    title: "Preghiera taoista personalizzata, scritta e recitata",
    description:
      "Un testo nella tradizione taoista sulla tua intenzione: linguaggio sobrio, per immagini naturali, nella logica del wu wei. In italiano o cinese.",
    h1: "Un testo taoista per la tua intenzione",
    lede:
      "Il taoismo non comanda e non implora: asseconda. Scrivi la tua intenzione e ricevi un testo che la dice per immagini, non per richieste.",
    howItPrays:
      "Qui la preghiera non chiede che le cose cambino: cerca il modo di stare dentro il loro corso. È il wu wei, l'agire senza forzare, e cambia la grammatica stessa del testo — niente imperativi, niente promesse, nessuna pretesa di piegare un evento. Il linguaggio procede per immagini prese dalla natura: l'acqua che vince cedendo, la valle che riceve, il vuoto che rende utile il vaso. Sono le immagini del Daodejing, e non sono decorazione: sono il modo in cui il pensiero taoista argomenta. Non c'è una formula di chiusura obbligata; il testo finisce su un'immagine quieta, come si chiude una porta piano.",
    languageNote:
      "In italiano o in cinese. Il cinese cambia molto il risultato: la brevità che il taoismo cerca in cinese è naturale, in italiano va costruita.",
    intentions: [
      {
        prayerTypeId: "pace",
        label: "Pace interiore",
        note: "Il tema più taoista che ci sia: quiete come ritorno, non come conquista.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "L'equilibrio che si ristabilisce da sé, se non lo si ostacola.",
      },
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Il ritorno, che nella lettura taoista non è perdita ma trasformazione.",
      },
      {
        prayerTypeId: "viaggio",
        label: "Per chi parte",
        note: "L'immagine della via — dao è anche, letteralmente, la strada.",
      },
    ],
    faq: [
      {
        q: "È una preghiera o una meditazione?",
        a: "Sta in mezzo, e in questa tradizione la distinzione conta meno. Non è una supplica a una divinità: è un testo contemplativo che accompagna un'intenzione.",
      },
      {
        q: "Cita il Daodejing?",
        a: "Usa le sue immagini, che sono patrimonio comune, senza attribuire citazioni testuali né numeri di capitolo.",
      },
      {
        q: "Va bene per il taoismo religioso, con le sue divinità?",
        a: "Il registro che usiamo è quello filosofico. Se la tua devozione è rivolta a divinità specifiche del taoismo religioso, scrivilo nell'intenzione.",
      },
    ],
  },
  {
    slug: "shintoista",
    religionId: "shintoismo",
    title: "Preghiera shintoista personalizzata, scritta e recitata",
    description:
      "Un testo nella tradizione shintō sulla tua intenzione: registro del norito, gratitudine ai kami, riferimenti alla natura e agli antenati.",
    h1: "Una preghiera shintoista per la tua intenzione",
    lede:
      "Nello shintō ci si presenta puliti, si ringrazia, e solo dopo si chiede — poco. Scrivi la tua intenzione e ricevi un testo con quel garbo.",
    howItPrays:
      "Il norito, la formula che il sacerdote pronuncia al santuario, ha una sequenza che il testo rispetta: prima la purificazione, poi l'offerta, poi — misurata — la richiesta. Ci si rivolge ai kami, che non sono dèi onnipotenti ma presenze: nel monte, nell'albero, nel fiume, negli antenati di casa. Per questo il registro è di gratitudine più che di domanda, e la richiesta resta contenuta: chiedere troppo, qui, è una scortesia. La natura non è sfondo ma interlocutore, e le stagioni entrano nel testo come entrano nella vita di un santuario.",
    languageNote:
      "In italiano o in giapponese. In giapponese il registro cortese cambia la sostanza del testo: la lingua ha forme di rispetto che l'italiano può solo approssimare.",
    intentions: [
      {
        prayerTypeId: "ringraziamento",
        label: "Ringraziamento",
        note: "La forma più naturale della preghiera shintō: riconoscere prima di chiedere.",
      },
      {
        prayerTypeId: "protezione",
        label: "Protezione",
        note: "Sulla casa e su chi vi abita, come per un omamori.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Per la famiglia e gli antenati",
        note: "Il culto domestico, che nello shintō è il centro e non la periferia.",
      },
      {
        prayerTypeId: "esame",
        label: "Per un esame",
        note: "Il tema per cui si va a Dazaifu: gli studenti giapponesi lo conoscono bene.",
      },
    ],
    faq: [
      {
        q: "Sostituisce la visita al santuario?",
        a: "No. Nello shintō il luogo conta, e il gesto fisico — l'inchino, le mani, la campana — è parte della preghiera. Questo è un testo, non un rito.",
      },
      {
        q: "Posso indicare un kami preciso?",
        a: "Sì, scrivilo nell'intenzione: Inari, Tenjin, il kami del tuo santuario. Se non lo indichi il testo resta generale.",
      },
      {
        q: "È un norito autentico?",
        a: "No. I norito sono formule liturgiche che pronuncia un sacerdote. Questo ne segue il registro e la sequenza, senza pretendere di esserlo.",
      },
    ],
  },
  {
    slug: "copta-etiope",
    religionId: "ortodossia-copta",
    title: "Preghiera copta ed etiope personalizzata",
    description:
      "Una preghiera nella tradizione cristiana orientale, copta ed etiope: registro antico, invocazioni ripetute, memoria dei martiri e della Vergine.",
    h1: "Una preghiera copta o etiope per la tua intenzione",
    lede:
      "Le Chiese d'Egitto e d'Etiopia custodiscono il cristianesimo più antico. Scrivi la tua intenzione e ricevi un testo nel loro respiro.",
    howItPrays:
      "È il registro più arcaico del cristianesimo, e si sente: invocazioni che tornano, epiteti accumulati, un ritmo che viene dalla salmodia più che dal discorso. La memoria dei martiri non è un accessorio devozionale — per la Chiesa copta è identità, e il calendario stesso conta gli anni dall'era dei martiri. La Vergine ha un posto centrale, con i titoli che la tradizione orientale le riconosce. La tradizione etiope aggiunge il suo: il ritmo del ge'ez, i tamburi, una gioia che le liturgie occidentali non hanno. Si chiude con «Amen», spesso ripetuto.",
    languageNote:
      "In italiano o in arabo, che è la lingua della Chiesa copta d'Egitto oggi. Il ge'ez e l'amarico non sono ancora disponibili — è un limite che ci pesa, perché per la comunità etiope ed eritrea sono le lingue della preghiera.",
    intentions: [
      {
        prayerTypeId: "defunti",
        label: "Per un defunto",
        note: "Il suffragio nella forma orientale, con la memoria dei nomi.",
      },
      {
        prayerTypeId: "protezione",
        label: "Protezione",
        note: "Con l'intercessione dei martiri, che in questa tradizione sono presenza viva.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Nel registro delle litanie di supplica, con l'invocazione ripetuta.",
      },
      {
        prayerTypeId: "viaggio",
        label: "Per chi è lontano",
        note: "Un tema che la diaspora copta ed eritrea conosce da vicino.",
      },
    ],
    faq: [
      {
        q: "Copta ed etiope sono la stessa cosa?",
        a: "No, sono Chiese distinte con liturgie proprie, storicamente vicine e in comunione. Il testo tiene un registro condiviso; se vuoi il taglio dell'una o dell'altra, scrivilo nell'intenzione.",
      },
      {
        q: "È disponibile in ge'ez o amarico?",
        a: "Non ancora. Al momento italiano e arabo. È fra le lingue che vorremmo aggiungere.",
      },
      {
        q: "Segue il calendario copto?",
        a: "Non automaticamente. Se la tua intenzione è legata a una festa o a un digiuno, indicalo e il testo ne terrà conto.",
      },
    ],
  },
  {
    slug: "spirituale-non-religiosa",
    religionId: "spiritualita-libera",
    title: "Preghiera spirituale non confessionale, scritta e recitata",
    description:
      "Un testo spirituale senza appartenenza religiosa: rivolto alla Vita, alla Luce o alla persona amata. Registro poetico, nessuna formula rituale.",
    h1: "Un testo spirituale, senza appartenenza",
    lede:
      "Credi in qualcosa ma non in una chiesa. Scrivi la tua intenzione: ne nasce un testo che la porta, senza nominare nessun dio in particolare.",
    howItPrays:
      "Qui manca di proposito ciò che struttura tutte le altre pagine di questo sito: non c'è una formula di apertura, non c'è un nome del divino, non c'è una chiusura obbligata. Il testo si rivolge alla Vita, all'Universo, alla Luce — oppure direttamente alla persona a cui pensi, che spesso è la scelta più onesta. Il registro è poetico e umano, e la libertà è anche un rischio: senza il sostegno di una tradizione, un testo così regge solo se è scritto bene. Per questo qui l'immagine conta più della formula, e la concretezza più dell'astrazione.",
    languageNote:
      "In tutte le lingue disponibili. Non essendoci una lingua liturgica di riferimento, la scelta dipende solo da quale ti suona più tua.",
    intentions: [
      {
        prayerTypeId: "defunti",
        label: "Per chi non c'è più",
        note: "Ricordare senza dover dire dove sia: spesso è esattamente ciò che serve.",
      },
      {
        prayerTypeId: "pace",
        label: "Pace interiore",
        note: "Per l'ansia e le notti lunghe, senza consolazioni che non si possono garantire.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per la guarigione",
        note: "Un augurio che non promette e non mente.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Famiglia e amore",
        note: "Nascite, riconciliazioni, addii: i passaggi che chiedono parole anche senza una fede.",
      },
    ],
    faq: [
      {
        q: "Nomina Dio?",
        a: "No, non nomina divinità di tradizioni precise. Si rivolge alla Vita, all'Universo, alla Luce, o alla persona stessa. Se preferisci un testo del tutto privo di riferimenti spirituali, c'è la versione laica.",
      },
      {
        q: "Si può leggere a un funerale civile?",
        a: "Sì, è uno degli usi più frequenti. Indicalo nell'intenzione, così il testo tiene conto che sarà letto ad alta voce davanti ad altri.",
      },
      {
        q: "Che differenza c'è con la versione laica?",
        a: "Questa conserva un'apertura verso qualcosa di più grande, anche senza nominarlo. Quella laica no: è un pensiero, e basta.",
      },
    ],
  },
  {
    slug: "laica",
    religionId: "laica",
    title: "Un pensiero laico, scritto e recitato a voce",
    description:
      "Nessuna divinità, nessuna formula: un testo laico e ben scritto per una persona a cui tieni. Come una lettera detta ad alta voce.",
    h1: "Un pensiero laico, non una preghiera",
    lede:
      "Non credi, e non vuoi fingere. Ma vorresti dire qualcosa di giusto a qualcuno. Scrivilo qui: te lo scriviamo bene, e te lo diamo con una voce.",
    howItPrays:
      "Questa pagina non promette nulla di soprannaturale, e la differenza rispetto a tutto il resto del sito è sostanziale. Niente divinità, niente formule, niente «amen». Quello che resta è la parte che funziona anche senza fede: onorare un'intenzione dicendola bene. Il modello è la lettera, o l'elogio funebre di chi non sa da dove cominciare — testi in cui la cura delle parole è l'unico rito disponibile. Il registro è sobrio: niente retorica consolatoria, nessuna promessa che le cose andranno bene, perché sarebbe una bugia e si sentirebbe.",
    languageNote:
      "In tutte le lingue disponibili, senza vincoli liturgici: qui la lingua è solo quella in cui la persona a cui pensi ti verrebbe naturale parlare.",
    intentions: [
      {
        prayerTypeId: "defunti",
        label: "Per chi non c'è più",
        note: "Il testo che serve quando ti chiedono due parole e non sai da dove partire.",
      },
      {
        prayerTypeId: "guarigione",
        label: "Per chi sta male",
        note: "Un augurio onesto, che non promette guarigioni.",
      },
      {
        prayerTypeId: "esame",
        label: "Esami e prove",
        note: "Un incoraggiamento scritto bene, senza scaramanzie.",
      },
      {
        prayerTypeId: "famiglia",
        label: "Famiglia e amore",
        note: "Matrimoni civili, nascite, riconciliazioni.",
      },
    ],
    faq: [
      {
        q: "Perché un servizio di preghiere offre testi laici?",
        a: "Perché il bisogno che porta qui — dire qualcosa di giusto a qualcuno, in un momento che conta — non è esclusivo di chi crede. Chi non crede merita lo stesso testo scritto bene, senza doversi adattare a un vocabolario che non è suo.",
      },
      {
        q: "Si può leggere a un funerale?",
        a: "Sì, è pensato anche per questo. Scrivi nell'intenzione che sarà letto ad alta voce e per chi: cambia la costruzione delle frasi.",
      },
      {
        q: "La voce è la stessa delle preghiere religiose?",
        a: "Sì, ma il registro del testo è diverso: nessuna solennità liturgica. Se vuoi un tono ancora più asciutto, scegli «intimo» invece di «solenne».",
      },
    ],
  },
];

export function getReligionLanding(slug: string): ReligionLanding | undefined {
  return RELIGION_LANDINGS.find((l) => l.slug === slug);
}

/** La landing che corrisponde a una religione del catalogo, se esiste. */
export function landingForReligion(religionId: string): ReligionLanding | undefined {
  return RELIGION_LANDINGS.find((l) => l.religionId === religionId);
}
