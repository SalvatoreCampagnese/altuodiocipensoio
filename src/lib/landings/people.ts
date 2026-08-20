import type { PersonLanding } from "./types";

/**
 * Le landing per persona: per CHI si prega.
 *
 * Perché esistono, in una riga: su «preghiera per mia madre malata» il primo
 * risultato di Google è un post di Facebook, e in prima pagina ci sono un
 * thread di Reddit e siti stranieri tradotti a macchina così male da scrivere
 * «Pregho». È una coda lunga enorme presidiata male, e una pagina scritta
 * davvero la vince.
 *
 * REGOLA PER CHI NE AGGIUNGE UNA. `when` e `difficulty` devono essere veri di
 * questa relazione e di nessun'altra. Se puoi spostarli su un'altra pagina
 * cambiando il nome del parente, non hai scritto una pagina nuova: hai
 * duplicato quella di prima, e Google lo chiama Scaled Content Abuse.
 *
 * Il banco di prova è semplice: pregare per una madre che sta morendo non
 * somiglia a pregare per un figlio che ha smesso di parlarti, che non somiglia
 * a pregare per chi ti ha fatto del male. Se le tre pagine si somigliano, il
 * problema è nel testo, non nell'elenco.
 */
export const PERSON_LANDINGS: PersonLanding[] = [
  /* ---------------------------------------------------------------------
   * Genitori
   * ------------------------------------------------------------------- */
  {
    slug: "mia-madre",
    group: "genitori",
    title: "Preghiera per mia madre",
    description:
      "Una preghiera per tua madre, scritta sulla tua storia e recitata a voce. Più le preghiere della tradizione per una madre, con testo integrale.",
    h1: "Una preghiera per mia madre",
    lede:
      "Per la donna a cui devi di essere qui, e a cui quasi mai si riesce a dire qualcosa all'altezza.",
    when:
      "Il suo compleanno. La festa della mamma, che arriva ogni anno e ogni anno mette in imbarazzo. Un periodo in cui la vedi stanca e non te lo dice. O nessuna occasione: solo un giovedì qualunque in cui ti è venuta in mente.",
    difficulty:
      "Con una madre il problema non è trovare le parole: è che ce ne sono troppe e sono tutte vecchie. Ci si è detti tutto e il contrario di tutto per quarant'anni, e ogni frase che viene in mente suona già detta, o già litigata. Una preghiera aggira il problema perché non è rivolta a lei: si parla di lei a qualcun altro, e questo permette di dire cose che a lei, in faccia, non diresti mai.",
    archiveSlugs: ["ave-maria", "sotto-la-tua-protezione", "angelo-di-dio"],
    tagSlug: "famiglia",
    prayerTypeId: "protezione",
    related: ["mia-madre-malata", "mia-madre-anziana", "mio-padre", "i-miei-genitori"],
    faq: [
      {
        q: "Quale preghiera si dice per una madre?",
        a: "Nella tradizione cattolica si usa l'Ave Maria, e non per una simmetria facile fra madri: è la formula con cui da secoli si affida una donna a un'altra donna. Il Sub tuum praesidium — «Sotto la tua protezione» — è ancora più antico, del III secolo, ed è la più vecchia preghiera mariana che ci sia arrivata. Le trovi entrambe integrali nell'archivio, gratis.",
      },
      {
        q: "E se mia madre non crede?",
        a: "Pregare per qualcuno non richiede il suo permesso né la sua fede. Se ti mette a disagio l'idea di un testo religioso puoi sceglierne uno laico: dice la stessa cosa senza nominare Dio, e resta una cosa che hai fatto per lei.",
      },
      {
        q: "Posso dedicargliela senza dirglielo?",
        a: "Sì, ed è il caso più comune. La preghiera arriva nella tua email, con il testo e la registrazione: sta a te decidere se resta tua o se le mandi il link.",
      },
    ],
  },
  {
    slug: "mia-madre-malata",
    group: "genitori",
    title: "Preghiera per mia madre malata",
    description:
      "Una preghiera per tua madre che sta male, scritta sul suo nome e sulla sua situazione. Con le preghiere della tradizione per un malato, testo integrale.",
    h1: "Una preghiera per mia madre malata",
    lede:
      "Quando è lei ad avere bisogno, e per la prima volta i ruoli si sono invertiti.",
    when:
      "Il giorno della diagnosi. La settimana prima di un intervento. Un ciclo di terapia che va avanti da mesi. Le sere in cui torni dall'ospedale e la casa è come l'ha lasciata.",
    difficulty:
      "Pregare per una madre malata ha una difficoltà che le altre malattie non hanno: è la persona che ti ha curato quando eri tu a stare male, e vederla dall'altra parte del letto rovescia qualcosa che sembrava fisso. A questo si aggiunge la colpa di chi non fa abbastanza — non ci sono abbastanza ore, non c'è abbastanza distanza da coprire — e la colpa non è un buon punto di partenza per le parole. Una preghiera scritta da qualcun altro toglie almeno quello: non devi trovarle tu, mentre stai già facendo tutto il resto.",
    archiveSlugs: ["mi-sheberach", "anima-christi", "salmo-23", "sotto-la-tua-protezione"],
    tagSlug: "malattia",
    prayerTypeId: "guarigione",
    related: ["mia-madre", "mio-padre-malato", "chi-e-in-ospedale", "chi-assiste-un-malato"],
    faq: [
      {
        q: "Qual è una preghiera per un genitore malato?",
        a: "Il Mi Sheberach ebraico è la più diretta: nomina il malato e chiede refuah shlemah, guarigione piena del corpo e dello spirito insieme. Nella tradizione cattolica l'Anima Christi e il Salmo 23 sono i testi che si dicono più spesso accanto a un letto d'ospedale. Sono tutti e tre nell'archivio, integrali e gratuiti.",
      },
      {
        q: "Serve a qualcosa, se la medicina non può fare più niente?",
        a: "Non guarisce, e chi ti dice il contrario ti sta ingannando. Quello che fa è dare una forma alle ore in cui non c'è niente da fare — e quelle ore, in una malattia lunga, sono la maggior parte. Non è poco e non è tutto.",
      },
      {
        q: "Posso riceverne una al giorno per tutta la terapia?",
        a: "Sì. La novena copre nove giorni, il trigesimo trenta, e arrivano da sole senza che tu debba ricordartene. Chi assiste un malato non ha testa per gli abbonamenti da gestire, ed è il motivo per cui non c'è niente da gestire.",
      },
    ],
  },
  {
    slug: "mia-madre-defunta",
    group: "genitori",
    title: "Preghiera per mia madre defunta",
    description:
      "Una preghiera in memoria di tua madre, scritta sul suo nome e sulla vostra storia. Con le preghiere di suffragio della tradizione, testo integrale.",
    h1: "Una preghiera per mia madre che non c'è più",
    lede: "Per il suo anniversario, o per una sera qualunque in cui ti è mancata più del solito.",
    when:
      "L'anniversario della morte, che torna ogni anno. Il suo compleanno, che è peggio. La festa della mamma, che dopo diventa una data ostile. Il primo Natale senza. O il momento, mesi dopo, in cui il telefono squilla e per mezzo secondo pensi che sia lei.",
    difficulty:
      "Il lutto per una madre ha una coda lunga che nessuno avverte: passano gli anni, la vita riprende, e poi capita di voler raccontare una cosa proprio a lei e a nessun altro. È lì che serve un posto dove metterla. La preghiera per i morti serve esattamente a questo, e per questo tutte le tradizioni ne hanno una: non cambia niente per chi è morto, dà un luogo a chi resta.",
    archiveSlugs: ["eterno-riposo", "de-profundis", "salmo-23", "shema"],
    tagSlug: "lutto",
    prayerTypeId: "defunti",
    related: ["mio-padre-defunto", "i-miei-nonni-defunti", "chi-ha-perso-qualcuno", "mia-madre"],
    faq: [
      {
        q: "Cosa si dice per una madre morta?",
        a: "Nella tradizione cattolica il suffragio: «L'eterno riposo dona a lei, o Signore». Il De profundis è il salmo che si dice dal fondo, e il Salmo 23 è quello che si legge più spesso ai funerali. Nella tradizione ebraica il Kaddish sorprende chi lo scopre: non nomina la morte, è pura lode, e proprio per questo lo dice chi è in lutto.",
      },
      {
        q: "Ha senso se sono passati molti anni?",
        a: "Sì, e sono spesso le preghiere migliori. Il lutto recente ha già le sue parole obbligate — il funerale, le condoglianze, i rosari. Dieci anni dopo non c'è più niente di previsto, e proprio per questo serve qualcosa di scritto apposta.",
      },
      {
        q: "Posso farla recitare a voce?",
        a: "Sì, ogni preghiera arriva con una registrazione. Alcuni la ascoltano al cimitero, altri la tengono nel telefono per l'anniversario. Il file è tuo e puoi scaricarlo.",
      },
    ],
  },
  {
    slug: "mia-madre-anziana",
    group: "genitori",
    title: "Preghiera per la mamma anziana",
    description:
      "Una preghiera per una madre che invecchia, scritta sulla vostra situazione. Con i testi della tradizione per la vecchiaia e la protezione.",
    h1: "Una preghiera per mia madre che invecchia",
    lede: "Per gli anni in cui è ancora qui, e già cominci a perderla un po' per volta.",
    when:
      "Il giorno in cui ti accorgi che non ricorda una cosa che sapeva. Quando serve decidere se può ancora restare a casa sua. Dopo una caduta. O al telefono, quando riattacchi e resti fermo un minuto.",
    difficulty:
      "La vecchiaia di un genitore è un lutto che si consuma mentre la persona è ancora viva, e questo lo rende impronunciabile: non puoi dire a nessuno che ti manca qualcuno che è di là in cucina. Si prega allora per due cose insieme e in contraddizione fra loro — che duri, e che non soffra — e nessuna formula standard le tiene tutte e due. Una preghiera scritta sulla situazione può dirle entrambe senza doverne scegliere una.",
    archiveSlugs: ["sotto-la-tua-protezione", "salmo-23", "ave-maria", "angelo-di-dio"],
    tagSlug: "protezione",
    prayerTypeId: "protezione",
    related: ["i-miei-genitori-anziani", "mia-madre-malata", "chi-assiste-un-malato", "mia-madre"],
    faq: [
      {
        q: "Si può pregare perché una persona muoia serenamente?",
        a: "Sì, ed è una delle richieste più antiche che esistano: la tradizione la chiama buona morte, e le ha dedicato preghiere apposta. Non c'è niente di sbagliato nel chiedere che una sofferenza lunga finisca bene. È diverso dal chiedere che finisca prima.",
      },
      {
        q: "Mia madre ha la demenza e non capirebbe. Ha senso lo stesso?",
        a: "La preghiera non richiede che chi la riceve la capisca. In questo caso serve soprattutto a te, ed è una ragione sufficiente. Molti la usano come testo da leggerle ad alta voce: il senso delle parole può non arrivare, il tono di una voce che parla piano quasi sempre sì.",
      },
    ],
  },
  {
    slug: "mio-padre",
    group: "genitori",
    title: "Preghiera per mio padre",
    description:
      "Una preghiera per tuo padre, scritta sulla vostra storia e recitata a voce. Con le preghiere della tradizione per un padre, testo integrale.",
    h1: "Una preghiera per mio padre",
    lede: "Per l'uomo con cui, spesso, si è parlato meno di quanto si sarebbe voluto.",
    when:
      "La festa del papà. Il suo compleanno. Il giorno in cui hai capito una cosa che diceva e allora non capivi. O dopo una telefonata finita, come sempre, senza dirsi niente di importante.",
    difficulty:
      "Con molti padri il problema è il silenzio, e non è un silenzio ostile: è che non è mai stato previsto un modo di parlarsi di certe cose, e a sessant'anni non se ne inventa uno. Pregare per un padre è spesso il primo posto in cui si dice qualcosa che a lui non si è mai detto — e conta che sia un testo, non una conversazione, perché un testo non pretende una risposta.",
    archiveSlugs: ["padre-nostro", "sotto-la-tua-protezione", "salmo-23"],
    tagSlug: "famiglia",
    prayerTypeId: "protezione",
    related: ["mio-padre-malato", "mio-padre-defunto", "mia-madre", "i-miei-genitori"],
    faq: [
      {
        q: "Quale preghiera si dice per un padre?",
        a: "Il Padre Nostro, per una ragione più letterale di quanto si pensi: è la preghiera in cui si chiama padre qualcun altro, e molti la trovano il posto naturale dove mettere anche il proprio. Nell'islam c'è una formula precisa per i genitori — «Signore, abbi misericordia di loro come loro hanno avuto cura di me da piccolo» — che vale per entrambi.",
      },
      {
        q: "E se il rapporto è stato difficile?",
        a: "Si può pregare anche per questo, ed è forse il caso in cui serve di più. Non è obbligatorio scrivere una preghiera affettuosa: puoi chiedere di riuscire a perdonare, o solo di smettere di portartelo dietro. Scrivilo nell'intenzione così com'è.",
      },
    ],
  },
  {
    slug: "mio-padre-malato",
    group: "genitori",
    title: "Preghiera per mio padre malato",
    description:
      "Una preghiera per tuo padre che sta male, scritta sul suo nome e sulla sua situazione, con la registrazione a voce. E i testi della tradizione per i malati.",
    h1: "Una preghiera per mio padre malato",
    lede: "Quando l'uomo che ti sembrava indistruttibile si è rivelato fatto come tutti gli altri.",
    when:
      "Un ricovero improvviso. Il referto arrivato ieri. Una convalescenza che non procede. La prima volta che ti chiede aiuto per una cosa che ha sempre fatto da solo.",
    difficulty:
      "La malattia di un padre spesso arriva insieme a un altro colpo: il crollo dell'idea che fosse forte. Per molti figli è il momento in cui si diventa adulti, e capita a cinquant'anni. C'è poi una difficoltà pratica: i padri malati tendono a minimizzare, quindi si prega spesso senza sapere davvero come stanno. Scriverlo — che non dice tutto, che non sai quanto è grave — è un modo per metterlo da qualche parte.",
    archiveSlugs: ["anima-christi", "salmo-23", "mi-sheberach", "preghiera-di-gesu"],
    tagSlug: "malattia",
    prayerTypeId: "guarigione",
    related: ["mio-padre", "mia-madre-malata", "chi-affronta-un-intervento", "chi-e-in-ospedale"],
    faq: [
      {
        q: "Mio padre non vuole che si parli della sua malattia. Posso pregare lo stesso?",
        a: "Sì. Pregare per qualcuno non è parlare della sua malattia con altri: non c'è niente da rivelare a nessuno. La preghiera arriva nella tua email e resta tua, a meno che tu non decida diversamente.",
      },
      {
        q: "Posso farla recitare da una voce d'uomo?",
        a: "La voce di default è maschile, grave e posata. Se preferisci diversamente puoi indicarlo nell'intenzione.",
      },
    ],
  },
  {
    slug: "mio-padre-defunto",
    group: "genitori",
    title: "Preghiera per mio padre defunto",
    description:
      "Una preghiera in memoria di tuo padre, scritta sul suo nome e sulla vostra storia. Con le preghiere di suffragio della tradizione, testo integrale.",
    h1: "Una preghiera per mio padre che non c'è più",
    lede: "Per l'anniversario, o per il giorno in cui avresti voluto chiedergli una cosa sola.",
    when:
      "L'anniversario. La festa del papà. Il giorno in cui diventi padre a tua volta, che è quando molti lo cercano davvero. O davanti a una decisione su cui avresti voluto sentire lui.",
    difficulty:
      "Il lutto per un padre si presenta spesso in ritardo e travestito: non come tristezza ma come domande rimaste senza risposta, e per molti figli come la scoperta di non aver mai saputo granché di lui. Pregare per un padre morto è per questo diverso dal pregare per una madre morta — non è soprattutto nostalgia, è più spesso una conversazione che non si è fatta e che ora non si può più fare.",
    archiveSlugs: ["eterno-riposo", "de-profundis", "padre-nostro", "trisagio"],
    tagSlug: "lutto",
    prayerTypeId: "defunti",
    related: ["mia-madre-defunta", "i-miei-nonni-defunti", "chi-ha-perso-qualcuno", "mio-padre"],
    faq: [
      {
        q: "Cosa si recita nell'anniversario di una morte?",
        a: "Nella tradizione cattolica il suffragio — «L'eterno riposo» — e la Messa di anniversario. Nella tradizione ebraica lo Yahrzeit, con il Kaddish e una candela che resta accesa ventiquattr'ore. Nell'ortodossia la memoria eterna. I testi cristiani sono nell'archivio, integrali.",
      },
      {
        q: "Posso farne una a nome di tutta la famiglia?",
        a: "Sì. Scrivilo nell'intenzione — i nomi dei fratelli, dei nipoti — e il testo li includerà. Il link è condivisibile: molti lo mandano nel gruppo di famiglia il giorno dell'anniversario.",
      },
    ],
  },
  {
    slug: "i-miei-genitori",
    group: "genitori",
    title: "Preghiera per i miei genitori",
    description:
      "Una preghiera per entrambi i tuoi genitori, scritta sulla vostra storia di famiglia. Con i testi della tradizione per padre e madre insieme.",
    h1: "Una preghiera per i miei genitori",
    lede: "Per tutti e due insieme, che è come li si pensa quasi sempre.",
    when:
      "Un anniversario di matrimonio. Un Natale in cui ci siete ancora tutti. Il momento in cui li guardi invecchiare insieme e ti sembra che il tempo abbia accelerato.",
    difficulty:
      "Pregare per due persone insieme è più difficile che pregarle una alla volta, perché una coppia di genitori non è la somma di due individui: è un equilibrio, spesso con una storia complicata, e chi ci è cresciuto dentro lo sa meglio di chiunque. La tentazione è scrivere qualcosa di generico che valga per entrambi e non dica niente di nessuno dei due. Vale la pena resistere e nominarli separatamente, anche dentro la stessa preghiera.",
    archiveSlugs: ["padre-nostro", "ave-maria", "angelo-di-dio", "al-fatiha"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["i-miei-genitori-anziani", "mia-madre", "mio-padre", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "C'è una preghiera per i genitori nell'islam?",
        a: "Sì, ed è una delle più conosciute: «Rabbi irhamhumā kamā rabbayānī saghīra» — Signore, abbi misericordia di loro come loro hanno avuto cura di me quand'ero piccolo. Si dice per i genitori vivi e per quelli morti, senza cambiare una parola.",
      },
      {
        q: "Uno dei due è morto e l'altro no. Come funziona?",
        a: "Scrivilo nell'intenzione. Il testo terrà i due registri distinti — memoria per uno, richiesta per l'altro — invece di appiattirli, che è l'errore in cui cade una formula standard.",
      },
    ],
  },
  {
    slug: "i-miei-genitori-anziani",
    group: "genitori",
    title: "Preghiera per i genitori anziani",
    description:
      "Una preghiera per genitori che invecchiano, scritta sulla vostra situazione. Con i testi della tradizione per la vecchiaia, integrali e gratuiti.",
    h1: "Una preghiera per i miei genitori anziani",
    lede: "Per gli anni in cui tocca a te tenerli, e nessuno ti ha spiegato come si fa.",
    when:
      "Quando bisogna parlare della casa, della patente, della badante. Dopo un ricovero. Nella settimana in cui capisci che il prossimo Natale forse non sarà uguale a questo.",
    difficulty:
      "Chi assiste due genitori anziani vive dentro una stanchezza che non ha nome e di cui è difficile lamentarsi, perché lamentarsi sembra ingrato. Si aggiunge il fatto che spesso uno dei due sta peggio dell'altro e le energie non bastano per entrambi, con la colpa che ne segue. Una preghiera non risolve niente di tutto questo, ma è uno dei pochi posti dove si può dire di essere stanchi senza sentirsi cattivi figli.",
    archiveSlugs: ["sotto-la-tua-protezione", "salmo-23", "preghiera-semplice"],
    tagSlug: "protezione",
    prayerTypeId: "famiglia",
    related: ["mia-madre-anziana", "i-miei-genitori", "chi-assiste-un-malato", "chi-e-solo"],
    faq: [
      {
        q: "Posso chiedere qualcosa anche per me, non solo per loro?",
        a: "Sì, e conviene. Chi assiste è dentro la situazione quanto chi è assistito. Scrivere «e che io regga» dentro la stessa preghiera non è egoismo: è la parte realistica.",
      },
      {
        q: "Ci sono preghiere brevi da dire in fretta?",
        a: "Sì, e sono quelle giuste in questa fase. La preghiera di Gesù è di una riga sola e si ripete; il Salmo 23 si impara in pochi giorni. Le trovi nell'archivio, gratis e senza registrarsi.",
      },
    ],
  },
  /* ---------------------------------------------------------------------
   * Figli
   * ------------------------------------------------------------------- */
  {
    slug: "mio-figlio",
    group: "figli",
    title: "Preghiera per mio figlio",
    description:
      "Una preghiera per tuo figlio, scritta sul suo nome e sulla sua età, con la registrazione a voce. E i testi della tradizione per i figli, integrali.",
    h1: "Una preghiera per mio figlio",
    lede: "Per la persona che hai messo al mondo e che, a un certo punto, smette di essere in tuo potere.",
    when:
      "Il primo giorno di scuola. La sera in cui esce e tu resti sveglio. Il giorno in cui parte di casa. O nessun giorno particolare: la maggior parte dei genitori prega per i figli senza motivo, in continuazione.",
    difficulty:
      "La preghiera di un genitore per un figlio ha un difetto ricorrente: diventa una lista di cose che vorremmo per lui — che studi, che stia bene, che trovi la strada giusta — cioè un programma, non una preghiera. Il passaggio difficile è chiedere il suo bene e non il proprio progetto su di lui, e quasi nessuno ci riesce da solo la prima volta. Scriverlo aiuta a vedere la differenza in bianco su nero.",
    archiveSlugs: ["angelo-di-dio", "sotto-la-tua-protezione", "ave-maria", "padre-nostro"],
    tagSlug: "protezione",
    prayerTypeId: "protezione",
    related: ["mia-figlia", "un-figlio-lontano", "un-figlio-adolescente", "un-figlio-che-soffre"],
    faq: [
      {
        q: "Qual è la preghiera più usata per i figli?",
        a: "L'Angelo di Dio, che è la prima che moltissimi italiani hanno imparato e che i genitori continuano a dire per i figli anche quando i figli hanno quarant'anni. È di quattro righe e sta nell'archivio, integrale.",
      },
      {
        q: "Quale santo si prega per i figli?",
        a: "Nella devozione italiana soprattutto santa Rita e san Giuseppe, e la Madonna in quasi tutte le sue forme. Se hai una devozione precisa puoi indicarla e il testo la seguirà — sant'Antonio, padre Pio, il santo del tuo paese.",
      },
      {
        q: "Qual è una preghiera per un figlio adulto?",
        a: "Cambia meno di quanto si creda nella forma e molto nel contenuto: con un figlio adulto si smette di chiedere protezione e si comincia a chiedere di saper stare indietro. È esattamente il tipo di sfumatura che una formula generica non ha e che vale la pena scrivere.",
      },
    ],
  },
  {
    slug: "mia-figlia",
    group: "figli",
    title: "Preghiera per mia figlia",
    description:
      "Una preghiera per tua figlia, scritta sulla sua situazione e recitata a voce. Con i testi della tradizione per i figli, integrali e gratuiti.",
    h1: "Una preghiera per mia figlia",
    lede: "Per lei, in un mondo che le chiederà più cose e gliene perdonerà meno.",
    when:
      "Il giorno in cui va a vivere da sola. Prima di un esame o di un colloquio. Quando ti racconta qualcosa che ti spaventa e non puoi farlo vedere. O quando diventa madre a sua volta.",
    difficulty:
      "Molti genitori scoprono di pregare per una figlia in un modo diverso da come pregano per un figlio, e la cosa li mette a disagio: c'è più paura, e la paura porta a chiedere protezione più che libertà. Vale la pena accorgersene mentre si scrive. Una preghiera per una figlia adulta funziona meglio se chiede che sia forte, non che sia al sicuro.",
    archiveSlugs: ["sotto-la-tua-protezione", "angelo-di-dio", "ave-maria"],
    tagSlug: "protezione",
    prayerTypeId: "protezione",
    related: ["mio-figlio", "un-figlio-lontano", "un-figlio-che-soffre", "una-coppia-che-si-sposa"],
    faq: [
      {
        q: "Posso farla recitare da una voce femminile?",
        a: "Sì: indicalo nell'intenzione e la registrazione userà una voce di donna.",
      },
      {
        q: "Mia figlia è lontana. Posso mandargliela?",
        a: "Ogni preghiera ha un link privato, con testo e audio. Puoi mandarlo a chi vuoi, anche in un messaggio.",
      },
    ],
  },
  {
    slug: "un-figlio-malato",
    group: "figli",
    title: "Preghiera per un figlio malato",
    description:
      "Una preghiera per un figlio che sta male, scritta sul suo nome e sulla sua età. Con le preghiere della tradizione per un bambino malato, integrali.",
    h1: "Una preghiera per un figlio malato",
    lede: "La situazione in cui nessun genitore trova le parole, perché non ce ne sono di adeguate.",
    when:
      "Un ricovero. Una diagnosi che hai dovuto cercare su internet perché non avevi capito il nome. Una notte in ospedale su una poltrona. Il giorno prima di un intervento.",
    difficulty:
      "È l'unica preghiera in cui quasi tutti, prima o poi, arrivano a offrire uno scambio: prendi me al posto suo. Non è una richiesta che la tradizione accolga — nessuna la formula così — ma è quello che sente chi la fa, e fingere il contrario non aiuta. Scriverla per intero, compresa quella parte, è spesso il primo momento in cui un genitore ammette a se stesso quanta paura ha.",
    archiveSlugs: ["mi-sheberach", "dua-per-il-malato", "sotto-la-tua-protezione", "anima-christi"],
    tagSlug: "malattia",
    prayerTypeId: "guarigione",
    related: ["mio-figlio", "chi-e-in-ospedale", "chi-e-in-terapia-intensiva", "chi-affronta-un-intervento"],
    faq: [
      {
        q: "Posso chiedere di soffrire io al posto suo?",
        a: "Puoi scriverlo, e molti lo scrivono. Il testo non lo trasformerà in una formula magica di scambio, perché nessuna tradizione seria lo fa, ma non lo censurerà: è ciò che stai provando e ha diritto di stare nella preghiera.",
      },
      {
        q: "Mio figlio è piccolo e non capisce. Serve comunque?",
        a: "Serve a te, e in questo momento sei tu quello che deve reggere. Molti genitori usano la registrazione come una cosa da ascoltare in corridoio, fuori dalla stanza.",
      },
    ],
  },
  {
    slug: "un-figlio-lontano",
    group: "figli",
    title: "Preghiera per un figlio lontano",
    description:
      "Una preghiera per un figlio che vive lontano, scritta sulla vostra distanza. Con i testi della tradizione per chi è in viaggio e per la protezione.",
    h1: "Una preghiera per un figlio lontano",
    lede: "Per chi è partito, e per il fuso orario che si è messo in mezzo.",
    when:
      "La settimana dopo che è partito. Un Natale in cui non torna. Quando senti che sta passando un brutto periodo e sei a tremila chilometri. O semplicemente quando è troppo tempo che non chiama.",
    difficulty:
      "La lontananza di un figlio ha una particolarità: non è una disgrazia, e questo la rende impossibile da lamentare. Se n'è andato per lavorare, per studiare, per amore — cioè per le cose giuste, quelle che gli avevi augurato. Restare senza è il prezzo di un successo, e non esiste una parola per il dolore che non ha diritto di lamentarsi. La preghiera è uno dei pochi posti dove può stare senza dover chiedere scusa.",
    archiveSlugs: ["angelo-di-dio", "sotto-la-tua-protezione", "salmo-23"],
    tagSlug: "viaggio",
    prayerTypeId: "viaggio",
    related: ["mio-figlio", "mia-figlia", "chi-e-solo", "chi-non-mi-parla-piu"],
    faq: [
      {
        q: "Posso mandargliela senza sembrare invadente?",
        a: "Il link è solo testo e audio, senza commento e senza richiami. Molti genitori lo mandano il giorno del compleanno, che è l'occasione che non ha bisogno di spiegazioni.",
      },
      {
        q: "Si può fare in un'altra lingua?",
        a: "Sì, in venticinque lingue. Se tuo figlio vive all'estero e i suoi figli non parlano italiano, può avere senso farla nella lingua in cui vivono.",
      },
    ],
  },
  {
    slug: "un-figlio-adolescente",
    group: "figli",
    title: "Preghiera per un figlio adolescente",
    description:
      "Una preghiera per un figlio adolescente, scritta sulla vostra situazione. Con i testi della tradizione per la pace e la protezione, integrali.",
    h1: "Una preghiera per un figlio adolescente",
    lede: "Per gli anni in cui è in casa e irraggiungibile allo stesso tempo.",
    when:
      "Dopo una lite. Quando smette di raccontarti le cose. La sera in cui non risponde al telefono. O quando ti accorgi che sta male e non ti fa entrare.",
    difficulty:
      "Con un adolescente si prega quasi sempre subito dopo aver litigato, e questo inquina tutto: la preghiera diventa una richiesta che lui cambi, cioè che dia ragione a te. La parte utile viene se si riesce a chiedere anche il contrario — di capire, di non reagire, di reggere il silenzio senza forzarlo. Chi ci prova scoprendo di non riuscirci ha comunque scoperto qualcosa.",
    archiveSlugs: ["preghiera-semplice", "vieni-santo-spirito", "angelo-di-dio"],
    tagSlug: "pace",
    prayerTypeId: "famiglia",
    related: ["mio-figlio", "un-figlio-che-soffre", "un-figlio-che-ha-perso-la-fede", "chi-non-mi-parla-piu"],
    faq: [
      {
        q: "Ha senso pregare per un figlio che non crede?",
        a: "Sì, e non c'è niente di scorretto: non gli stai imponendo nulla, e in genere non lo sa. Se ti pesa la forma religiosa esiste anche la versione laica.",
      },
      {
        q: "Posso chiedere che torni a parlarmi?",
        a: "Puoi. Tieni presente che le preghiere che chiedono un cambiamento nell'altro deludono quasi sempre, mentre quelle che chiedono qualcosa a chi prega reggono meglio. Puoi scrivere entrambe le cose.",
      },
    ],
  },
  {
    slug: "un-figlio-che-soffre",
    group: "figli",
    title: "Preghiera per un figlio che soffre",
    description:
      "Una preghiera per un figlio in difficoltà, scritta sulla sua situazione. Con i testi della tradizione per l'angoscia e la pace interiore.",
    h1: "Una preghiera per un figlio che sta soffrendo",
    lede: "Quando il problema non è una malattia, e proprio per questo non sai dove mettere le mani.",
    when:
      "Una depressione che dura da mesi. Una separazione. Un fallimento su cui aveva costruito tutto. Il momento in cui capisci che sta male da più tempo di quanto pensassi.",
    difficulty:
      "Un figlio che soffre senza avere una malattia mette il genitore in una posizione senza appigli: non c'è un medico da chiamare, non c'è una terapia da seguire, non c'è niente da organizzare. Chi è abituato a risolvere non ha strumenti, e il rischio è di trasformare l'affetto in pressione — «reagisci», «esci», «datti da fare» — che è la cosa che funziona peggio. Una preghiera è una delle poche azioni possibili che non pesa su di lui.",
    archiveSlugs: ["preghiera-di-gesu", "salmo-23", "metta", "preghiera-semplice"],
    tagSlug: "paura",
    prayerTypeId: "pace",
    related: ["chi-soffre-di-depressione", "un-figlio-adolescente", "mio-figlio", "chi-lotta-con-una-dipendenza"],
    faq: [
      {
        q: "Non sarebbe meglio uno psicologo?",
        a: "Sì, e le due cose non sono alternative. Se tuo figlio sta male serve una persona vera: la preghiera non cura una depressione e non lo sostiene chi te lo dice. Questo è per te, mentre lo accompagni.",
      },
      {
        q: "Posso non dirgli che l'ho fatta?",
        a: "Certo. Resta nella tua email e nessuno la vede.",
      },
    ],
  },
  {
    slug: "un-figlio-che-ha-perso-la-fede",
    group: "figli",
    title: "Preghiera per un figlio che ha perso la fede",
    description:
      "Una preghiera per un figlio che si è allontanato dalla fede, scritta senza rimprovero. Con i testi della tradizione, integrali e gratuiti.",
    h1: "Una preghiera per un figlio che non crede più",
    lede: "Per chi ha smesso, e per il genitore che non sa se sia una perdita o solo una strada diversa.",
    when:
      "Quando smette di venire a Messa. Quando decide di non far battezzare i suoi figli. Al matrimonio civile. O in una discussione a tavola che finisce male.",
    difficulty:
      "È la preghiera che più facilmente diventa un giudizio travestito: si chiede che torni, cioè che ammetta di aver sbagliato. Chi la scrive così quasi sempre lo sente, e resta insoddisfatto senza capire perché. La versione che regge è più scomoda e più onesta — chiedere che sia in pace, anche se la sua pace non assomiglia alla tua — e va scritta scegliendola, non ci si arriva per caso.",
    archiveSlugs: ["preghiera-semplice", "padre-nostro", "vieni-santo-spirito"],
    tagSlug: "pace",
    prayerTypeId: "richiesta",
    related: ["un-figlio-adolescente", "mio-figlio", "chi-non-mi-parla-piu", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "Posso chiedere che torni a credere?",
        a: "Puoi scriverlo, ed è una richiesta legittima che i genitori fanno da sempre. Il testo non lo giudicherà e non lo descriverà come perduto: non è il tono di questo servizio.",
      },
      {
        q: "Mi sento in colpa: pensa che sia colpa mia.",
        a: "Scrivilo nell'intenzione. Una preghiera che dice anche questo è più vera di una che chiede solo il ritorno dell'altro, e in genere fa più bene a chi la dice.",
      },
    ],
  },
  {
    slug: "un-figlio-che-non-ce-piu",
    group: "figli",
    title: "Preghiera per un figlio che non c'è più",
    description:
      "Una preghiera in memoria di un figlio, scritta sul suo nome. Con le preghiere di suffragio della tradizione, testo integrale e gratuito.",
    h1: "Una preghiera per un figlio che non c'è più",
    lede: "Per il lutto che nella nostra lingua non ha nemmeno un nome.",
    when:
      "L'anniversario. Il compleanno che sarebbe stato. Il giorno in cui qualcuno ti chiede quanti figli hai e non sai cosa rispondere.",
    difficulty:
      "In italiano chi perde i genitori è orfano e chi perde il coniuge è vedovo; per chi perde un figlio non esiste la parola, e l'assenza non è casuale — la lingua non ha previsto che accadesse. Di conseguenza mancano anche le formule: le preghiere per i defunti sono scritte per chi muore nell'ordine giusto. Un testo per questo lutto va scritto apposta, ed è forse il caso in cui una preghiera su misura ha più ragione di esistere.",
    archiveSlugs: ["eterno-riposo", "de-profundis", "salve-regina", "salmo-23"],
    tagSlug: "lutto",
    prayerTypeId: "defunti",
    related: ["mia-madre-defunta", "chi-ha-perso-qualcuno", "un-bambino-che-deve-nascere", "mio-figlio"],
    faq: [
      {
        q: "Esiste una preghiera per un figlio morto?",
        a: "Non una formula dedicata, ed è di per sé significativo. Si usano i testi di suffragio comuni — l'eterno riposo, il De profundis, il Salmo 23 — che però parlano di una morte nell'ordine naturale. È il motivo per cui molti, arrivati qui, ne fanno scrivere una.",
      },
      {
        q: "Posso farla per un bambino mai nato?",
        a: "Sì. La perdita in gravidanza è un lutto vero e trattato come tale, con o senza un nome da scrivere.",
      },
    ],
  },
  {
    slug: "un-bambino-che-deve-nascere",
    group: "figli",
    title: "Preghiera per un bambino che deve nascere",
    description:
      "Una preghiera per una gravidanza e per il bambino in arrivo, scritta sulla vostra attesa. Con i testi della tradizione per la protezione.",
    h1: "Una preghiera per un bambino che deve nascere",
    lede: "Per i mesi in cui c'è già e non si può ancora fare niente per lui.",
    when:
      "Dopo la prima ecografia. Dopo un esame con un risultato che non avete capito. Nelle ultime settimane. O all'inizio di una gravidanza arrivata dopo altre che non sono andate.",
    difficulty:
      "L'attesa di un figlio è l'unico caso in cui si prega per qualcuno che non si è ancora conosciuto, e questo cambia tutto: non c'è un carattere, una storia, un nome — a volte nemmeno quello. Si prega per una possibilità. Chi ha già avuto una perdita porta poi dentro una superstizione difficile da dire ad alta voce, la paura che sperare troppo porti sfortuna. Metterla per iscritto è spesso il primo modo per disinnescarla.",
    archiveSlugs: ["sotto-la-tua-protezione", "ave-maria", "angelo-di-dio"],
    tagSlug: "protezione",
    prayerTypeId: "protezione",
    related: ["un-neonato", "mia-figlia", "un-figlio-che-non-ce-piu", "una-coppia-che-si-sposa"],
    faq: [
      {
        q: "Si può fare senza sapere ancora il nome?",
        a: "Sì, ed è normalissimo. Il testo può rivolgersi a lui senza nominarlo, e molti poi ne fanno una seconda dopo la nascita.",
      },
      {
        q: "Ho già avuto una perdita e ho paura. Posso scriverlo?",
        a: "Scrivilo. È l'informazione più importante che puoi dare, e cambia completamente il testo che ne esce.",
      },
    ],
  },
  {
    slug: "un-neonato",
    group: "figli",
    title: "Preghiera per un neonato",
    description:
      "Una preghiera per un bambino appena nato, per il battesimo o per i primi giorni. Con i testi della tradizione per la protezione dei piccoli.",
    h1: "Una preghiera per un bambino appena nato",
    lede: "Per la prima settimana, quando la gioia e la paura arrivano insieme e nella stessa quantità.",
    when:
      "I giorni in ospedale. Il ritorno a casa. Il battesimo, o il giorno del nome. La prima notte in cui dorme in un'altra stanza.",
    difficulty:
      "Nei primi giorni di un figlio nessuno ha lucidità: si dorme a tratti e si è attraversati da un affetto sproporzionato che spaventa. Le preghiere che escono in quello stato sono quasi sempre confuse, e non è un difetto — è il momento. Serve però qualcuno che le metta in ordine, ed è esattamente ciò che un testo scritto per te fa, meglio di una formula generica che non sa niente di questa nascita.",
    archiveSlugs: ["angelo-di-dio", "sotto-la-tua-protezione", "ave-maria"],
    tagSlug: "protezione",
    prayerTypeId: "protezione",
    related: ["un-bambino-che-deve-nascere", "mio-figlio", "un-nipote", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "Va bene come regalo per un battesimo?",
        a: "È uno degli usi più frequenti. Arriva testo e audio, con un link condivisibile: alcuni lo fanno leggere durante la festa, altri lo stampano.",
      },
      {
        q: "Posso farla fare dai nonni?",
        a: "Sì, e cambia il punto di vista del testo: chi scrive l'intenzione è chi prega. Indica il rapporto e il testo ne terrà conto.",
      },
    ],
  },
  /* ---------------------------------------------------------------------
   * Coppia
   * ------------------------------------------------------------------- */
  {
    slug: "mio-marito",
    group: "coppia",
    title: "Preghiera per mio marito",
    description:
      "Una preghiera per tuo marito, scritta sulla vostra storia e recitata a voce. Con i testi della tradizione per la coppia e la famiglia.",
    h1: "Una preghiera per mio marito",
    lede: "Per l'uomo con cui dividi le giornate, e che proprio per questo si finisce per non guardare più.",
    when:
      "Un anniversario. Un periodo in cui lavora troppo e lo vedi consumarsi. Una difficoltà che sta attraversando e di cui non parla. O una sera qualunque, dopo che si è addormentato sul divano.",
    difficulty:
      "Nel matrimonio lungo il rischio non è il conflitto: è l'abitudine, che rende invisibile la persona che si ha accanto. Pregare per un marito costringe a guardarlo di nuovo da fuori, come lo vedrebbe uno sconosciuto, e quasi sempre salta fuori qualcosa che non si notava da anni. È il motivo per cui questa preghiera fa spesso più effetto a chi la scrive che a chi la riceve.",
    archiveSlugs: ["padre-nostro", "preghiera-semplice", "ave-maria"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["mia-moglie", "un-matrimonio-in-crisi", "una-coppia-che-si-sposa", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "Posso fargliela leggere?",
        a: "Ogni preghiera ha un link privato con testo e registrazione. Molti la mandano il giorno dell'anniversario, che è l'occasione in cui non serve spiegare perché.",
      },
      {
        q: "Mio marito non è credente.",
        a: "Puoi scegliere la forma laica: stesso testo, stessa cura, senza rivolgersi a Dio. Molte coppie miste usano questa versione.",
      },
    ],
  },
  {
    slug: "mia-moglie",
    group: "coppia",
    title: "Preghiera per mia moglie",
    description:
      "Una preghiera per tua moglie, scritta sulla vostra storia e recitata a voce. Con i testi della tradizione per la coppia, integrali e gratuiti.",
    h1: "Una preghiera per mia moglie",
    lede: "Per la donna che regge la parte di vita che non si vede e di cui non si parla.",
    when:
      "Un anniversario. Un periodo difficile che sta attraversando lei. Dopo una nascita. O quando ti accorgi che da mesi tiene insieme tutto e nessuno gliel'ha detto.",
    difficulty:
      "Molti uomini non hanno mai avuto un posto dove dire cosa provano per la propria moglie: non si fa in famiglia, non si fa fra amici, e a lei si dice per lo più con i fatti. La preghiera è uno dei pochi formati in cui è socialmente ammesso, perché non è rivolta a lei ma a qualcun altro. Chi la scrive scopre spesso di avere molto più materiale di quanto credesse.",
    archiveSlugs: ["ave-maria", "preghiera-semplice", "gloria-al-padre"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["mio-marito", "un-matrimonio-in-crisi", "una-coppia-che-si-sposa", "mia-figlia"],
    faq: [
      {
        q: "Va bene come regalo?",
        a: "È uno degli usi più frequenti, soprattutto per gli anniversari. Arrivano testo e audio, e il link si può mandare o stampare.",
      },
      {
        q: "Posso farla recitare da una voce femminile?",
        a: "Sì, basta indicarlo nell'intenzione.",
      },
    ],
  },
  {
    slug: "la-persona-che-amo",
    group: "coppia",
    title: "Preghiera per la persona che amo",
    description:
      "Una preghiera per chi ami, scritta sulla vostra storia e recitata a voce. Anche in forma laica. Con i testi della tradizione, integrali.",
    h1: "Una preghiera per la persona che amo",
    lede: "Per chi non è ancora famiglia sull'anagrafe, e lo è già da un pezzo nei fatti.",
    when:
      "Un anniversario che conta solo per voi due. Prima di una scelta importante insieme. Un periodo difficile che sta attraversando. O il giorno in cui capisci che vorresti che restasse.",
    difficulty:
      "Le preghiere della tradizione per la coppia presuppongono quasi tutte un matrimonio, e chi non ce l'ha si trova con formule che non lo nominano. Non è un dettaglio: usare un testo che parla di sposi quando non lo siete suona falso, e una preghiera che suona falsa non serve a niente. Qui il testo si scrive sulla relazione che c'è davvero, con il nome che ha.",
    archiveSlugs: ["preghiera-semplice", "sotto-la-tua-protezione", "metta"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["mio-marito", "mia-moglie", "una-coppia-che-si-sposa", "un-amore-finito"],
    faq: [
      {
        q: "Vale anche per una coppia non sposata?",
        a: "Sì, e per qualunque coppia. Scrivi la vostra situazione così com'è: il testo la seguirà senza aggiungere una cornice che non avete chiesto.",
      },
      {
        q: "E se non siamo della stessa religione?",
        a: "Scegli la tradizione che vuoi, o la forma laica. Molte coppie miste scelgono quest'ultima proprio per non dare la precedenza a nessuna delle due.",
      },
    ],
  },
  {
    slug: "un-matrimonio-in-crisi",
    group: "coppia",
    title: "Preghiera per un matrimonio in crisi",
    description:
      "Una preghiera per una coppia in difficoltà, scritta sulla vostra situazione reale. Con i testi della tradizione per la pace e il perdono.",
    h1: "Una preghiera per un matrimonio in crisi",
    lede: "Quando non è ancora finito e non funziona più, che è lo stato più lungo e meno raccontato.",
    when:
      "Dopo l'ennesima discussione uguale alle altre. Nelle settimane in cui vi parlate solo dell'organizzazione. Quando uno dei due ha detto la parola separazione e l'altro fa finta di non averla sentita.",
    difficulty:
      "Chi prega per un matrimonio in crisi quasi sempre prega perché l'altro cambi, ed è la ragione per cui quasi sempre non funziona: si sta chiedendo di avere ragione, con una forma devota. La preghiera che serve è più scomoda — che io veda la mia parte, che smetta di tenere il conto — e va scelta consapevolmente, perché non viene spontanea a nessuno.",
    archiveSlugs: ["preghiera-semplice", "atto-di-dolore", "metta", "padre-nostro"],
    tagSlug: "perdono",
    prayerTypeId: "perdono",
    related: ["mio-marito", "mia-moglie", "un-amore-finito", "chi-non-mi-parla-piu"],
    faq: [
      {
        q: "Non è meglio un consulente di coppia?",
        a: "Quasi certamente sì, e le due cose non si escludono. Una preghiera non ricuce una relazione e nessuno serio lo sostiene: tiene compagnia mentre ci lavorate, o mentre decidete di smettere.",
      },
      {
        q: "Posso chiedere che finisca bene, anche se finisce?",
        a: "Sì, ed è una delle richieste più mature che riceviamo. Non tutte le preghiere per una coppia chiedono che resti insieme.",
      },
    ],
  },
  {
    slug: "una-coppia-che-si-sposa",
    group: "coppia",
    title: "Preghiera per una coppia che si sposa",
    description:
      "Una preghiera per un matrimonio, da leggere alla cerimonia o da regalare agli sposi. Con i testi della tradizione per la benedizione nuziale.",
    h1: "Una preghiera per chi si sposa",
    lede: "Da leggere durante la cerimonia, o da dare agli sposi come una cosa che resta.",
    when:
      "Le settimane prima del matrimonio. Il giorno stesso, se ti hanno chiesto di leggere qualcosa. O per un anniversario importante, il decimo, il venticinquesimo.",
    difficulty:
      "A chi viene chiesto di leggere qualcosa a un matrimonio capita quasi sempre la stessa cosa: cerca online, trova gli stessi tre testi che tutti hanno già sentito, e li legge sapendo che non dicono niente di questi due sposi. Il problema non è la qualità di quei testi, è che sono generici per costruzione. Una preghiera scritta con i loro nomi e la loro storia risolve esattamente questo, ed è l'occasione in cui la differenza si sente di più, perché c'è un pubblico.",
    archiveSlugs: ["preghiera-semplice", "vieni-santo-spirito", "gloria-al-padre"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["mio-marito", "mia-moglie", "la-persona-che-amo", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "Posso leggerla in chiesa?",
        a: "Chiedilo prima a chi celebra: molte parrocchie ammettono una lettura scelta dagli sposi in un punto preciso del rito, altre no. Il testo è pensato per essere detto ad alta voce.",
      },
      {
        q: "Si può fare in due lingue?",
        a: "Puoi farne una per lingua, ed è quello che fanno le coppie miste. Il servizio ne copre venticinque.",
      },
    ],
  },
  {
    slug: "un-amore-finito",
    group: "coppia",
    title: "Preghiera per un amore finito",
    description:
      "Una preghiera dopo una separazione, scritta sulla tua situazione. Con i testi della tradizione per la pace interiore e il perdono.",
    h1: "Una preghiera per un amore che è finito",
    lede: "Per il lutto che non riceve condoglianze, perché nessuno è morto.",
    when:
      "Le prime settimane, quelle in cui non si dorme. Il giorno in cui dividete le cose. Quando scopri che ha ricominciato. O un anno dopo, quando pensavi di aver finito e torna tutto.",
    difficulty:
      "La fine di una relazione è un lutto senza rito: non c'è funerale, non ci sono condoglianze, non c'è una data da ricordare, e in genere dopo un mese le persone smettono di chiedere come stai. Manca cioè tutto l'apparato che nel lutto vero serve a scandire il dolore e farlo passare. Una preghiera scritta apposta è, per molti, il primo atto formale in cui quella perdita viene trattata come una perdita.",
    archiveSlugs: ["preghiera-di-gesu", "salmo-23", "metta", "preghiera-semplice"],
    tagSlug: "pace",
    prayerTypeId: "pace",
    related: ["un-matrimonio-in-crisi", "la-persona-che-amo", "chi-mi-ha-fatto-del-male", "chi-e-solo"],
    faq: [
      {
        q: "Posso pregare per qualcuno che mi ha lasciato?",
        a: "Sì, e non è debolezza. Molte tradizioni considerano il bene augurato a chi ci ha fatto male la forma più alta di preghiera, e la più difficile. Se non ci riesci ancora, si può scrivere anche quello.",
      },
      {
        q: "Voglio solo smettere di stare male.",
        a: "È un'intenzione perfettamente valida e più onesta di molte altre. Scrivila così.",
      },
    ],
  },
  {
    slug: "chi-non-mi-parla-piu",
    group: "coppia",
    title: "Preghiera per chi non mi parla più",
    description:
      "Una preghiera per una frattura familiare o un rapporto interrotto, scritta sulla vostra storia. Con i testi della tradizione per il perdono.",
    h1: "Una preghiera per chi ha smesso di parlarmi",
    lede: "Per il silenzio che dura da mesi o da anni, e che nessuno dei due sa più come rompere.",
    when:
      "Un Natale in cui manca una sedia. Il giorno in cui vieni a sapere una sua notizia da qualcun altro. Un funerale in cui vi siete visti e non salutati. O quando capisci che potreste morire così.",
    difficulty:
      "Le fratture familiari lunghe hanno una caratteristica crudele: dopo un po' nessuno ricorda più con precisione da cosa siano cominciate, ma il silenzio è diventato più forte del motivo. Pregare per quella persona significa ammettere che ci si tiene ancora — cosa che a se stessi si nega da anni — ed è il vero passaggio difficile, molto più del perdono. Chi ci arriva ha già fatto la parte più dura.",
    archiveSlugs: ["padre-nostro", "atto-di-dolore", "preghiera-semplice", "metta"],
    tagSlug: "perdono",
    prayerTypeId: "perdono",
    related: ["chi-mi-ha-fatto-del-male", "un-figlio-adolescente", "mio-fratello", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "Devo perdonare per pregare?",
        a: "No, e sarebbe un ordine impossibile. Puoi pregare chiedendo di arrivarci un giorno, che è una richiesta diversa e alla portata di chiunque.",
      },
      {
        q: "Posso mandargliela?",
        a: "Puoi, ma pensaci: una preghiera ricevuta dopo anni di silenzio può leggersi come un rimprovero. Molti la tengono per sé, ed è spesso la scelta giusta.",
      },
    ],
  },

  /* ---------------------------------------------------------------------
   * Famiglia
   * ------------------------------------------------------------------- */
  {
    slug: "mia-nonna",
    group: "famiglia",
    title: "Preghiera per mia nonna",
    description:
      "Una preghiera per tua nonna, viva o defunta, scritta sulla vostra storia. Con i testi della tradizione che le nonne italiane hanno tramandato.",
    h1: "Una preghiera per mia nonna",
    lede: "Per la donna che, in moltissime famiglie italiane, è quella che pregava davvero.",
    when:
      "Il suo compleanno. Un ricovero. L'anniversario, se non c'è più. O quando ti accorgi di ripetere un suo gesto senza averlo deciso.",
    difficulty:
      "Con una nonna capita una cosa che non capita con nessun altro parente: spesso è stata lei a insegnarci le preghiere che sappiamo, e pregare per lei significa restituirle uno strumento che ci ha dato. Chi non crede più lo sente in modo particolarmente forte, e non sempre riesce a dirlo. È una delle intenzioni che vengono meglio quando si scrive esattamente questo, invece di aggirarlo.",
    archiveSlugs: ["ave-maria", "salve-regina", "angelo-di-dio", "eterno-riposo"],
    tagSlug: "famiglia",
    prayerTypeId: "protezione",
    related: ["mio-nonno", "i-miei-nonni-defunti", "mia-madre-anziana", "un-nipote"],
    faq: [
      {
        q: "Qual è la preghiera che dicevano le nonne?",
        a: "Quasi sempre il Rosario, e nel quotidiano l'Ave Maria, la Salve Regina e l'Angelo di Dio, che è quella che si insegnava ai bambini. Sono tutte nell'archivio, con il testo integrale e la loro origine.",
      },
      {
        q: "Non credo più, ma lei sì. Ha senso?",
        a: "Molti sono qui esattamente per questo. Far scrivere una preghiera nella tradizione di qualcun altro è un modo di rispettarla, e non richiede di condividerla.",
      },
    ],
  },
  {
    slug: "mio-nonno",
    group: "famiglia",
    title: "Preghiera per mio nonno",
    description:
      "Una preghiera per tuo nonno, vivo o defunto, scritta sulla vostra storia e recitata a voce. Con i testi della tradizione, integrali.",
    h1: "Una preghiera per mio nonno",
    lede: "Per l'uomo che ti ha raccontato cose che nessun altro in famiglia racconta più.",
    when:
      "Il suo compleanno. Una malattia. L'anniversario. O il giorno in cui ti serve un consiglio che avrebbe saputo darti solo lui.",
    difficulty:
      "Con un nonno il rimpianto più comune non riguarda l'affetto ma le domande: quasi tutti scoprono troppo tardi di non avergli chiesto niente della sua vita, della guerra, di com'era il paese, di suo padre. Resta un vuoto di informazioni oltre che di persona, e non si colma. Una preghiera non risponde a quelle domande, ma è un posto dove ammettere di averle.",
    archiveSlugs: ["padre-nostro", "eterno-riposo", "salmo-23"],
    tagSlug: "famiglia",
    prayerTypeId: "protezione",
    related: ["mia-nonna", "i-miei-nonni-defunti", "mio-padre", "un-nipote"],
    faq: [
      {
        q: "Posso farne una da leggere al cimitero?",
        a: "Sì, ed è un uso comune. Il testo è pensato per essere detto ad alta voce, e la registrazione si può ascoltare dal telefono.",
      },
    ],
  },
  {
    slug: "i-miei-nonni-defunti",
    group: "famiglia",
    title: "Preghiera per i nonni defunti",
    description:
      "Una preghiera in memoria dei nonni, scritta sui loro nomi e sulla vostra storia. Con le preghiere di suffragio della tradizione, integrali.",
    h1: "Una preghiera per i miei nonni che non ci sono più",
    lede: "Per la generazione che se n'è andata, e con cui è andata via anche una parte di memoria.",
    when:
      "Il 2 novembre. Un anniversario. Una visita al cimitero del paese. O quando in famiglia si comincia a dire «non c'è più nessuno che se lo ricorda».",
    difficulty:
      "Con i nonni il lutto è quasi sempre già passato, e quello che resta è un altro tipo di dolore: la sensazione di essere l'ultimo anello che li ricorda da vivi, e che quando toccherà a te finiranno davvero. Molte tradizioni hanno risposto proprio a questo — la memoria dei nomi è essa stessa un atto di preghiera — e vale la pena saperlo, perché cambia il senso di quello che si sta facendo.",
    archiveSlugs: ["eterno-riposo", "de-profundis", "trisagio", "dedica-dei-meriti"],
    tagSlug: "lutto",
    prayerTypeId: "defunti",
    related: ["mia-nonna", "mio-nonno", "mia-madre-defunta", "chi-ha-perso-qualcuno"],
    faq: [
      {
        q: "Cosa si fa il 2 novembre?",
        a: "Nella tradizione cattolica è la commemorazione dei defunti: si visita il cimitero e si dice il suffragio, «L'eterno riposo». Nell'ortodossia ci sono i sabati dei defunti, in cui i nomi vengono letti ad alta voce uno per uno.",
      },
      {
        q: "Posso metterli tutti in una preghiera sola?",
        a: "Sì. Scrivi i nomi nell'intenzione e il testo li nominerà. In diverse tradizioni nominare è il punto centrale del rito.",
      },
    ],
  },
  {
    slug: "mio-fratello",
    group: "famiglia",
    title: "Preghiera per mio fratello",
    description:
      "Una preghiera per tuo fratello, scritta sulla vostra storia. Con i testi della tradizione per la famiglia e la riconciliazione.",
    h1: "Una preghiera per mio fratello",
    lede: "Per la persona che ti conosce da più tempo di chiunque altro, compresi i tuoi genitori.",
    when:
      "Un periodo difficile che sta attraversando. Una malattia. Dopo una lite sull'eredità, che è la lite che divide più famiglie italiane. O quando è lui a occuparsi dei vostri genitori e tu sei lontano.",
    difficulty:
      "Il rapporto fra fratelli adulti porta un archivio che nessun'altra relazione ha: ricordi d'infanzia, torti mai chiariti, un conto aperto su chi è stato il preferito. È anche il legame che si rompe più facilmente quando muoiono i genitori, perché viene a mancare il perno. Pregare per un fratello significa quasi sempre pregare anche per quell'archivio, e vale la pena nominarlo invece di scrivere una preghiera che finge che non ci sia.",
    archiveSlugs: ["padre-nostro", "preghiera-semplice", "metta"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["mia-sorella", "chi-non-mi-parla-piu", "i-miei-genitori-anziani", "tutta-la-mia-famiglia"],
    faq: [
      {
        q: "Abbiamo litigato per l'eredità. Posso pregare lo stesso?",
        a: "Sì, ed è uno dei casi più frequenti. Non serve aver risolto niente per pregare per qualcuno: semmai è il contrario.",
      },
    ],
  },
  {
    slug: "mia-sorella",
    group: "famiglia",
    title: "Preghiera per mia sorella",
    description:
      "Una preghiera per tua sorella, scritta sulla vostra storia e recitata a voce. Con i testi della tradizione per la famiglia, integrali.",
    h1: "Una preghiera per mia sorella",
    lede: "Per chi ha attraversato la stessa infanzia e ne è uscita con una versione diversa.",
    when:
      "Una malattia. Una separazione. Il periodo in cui vi dividete l'assistenza ai genitori. O il suo compleanno, che è l'unico giorno in cui vi sentite davvero.",
    difficulty:
      "Fra sorelle il confronto è quasi sempre presente, anche a cinquant'anni e anche quando i rapporti sono buoni: chi ha avuto più fortuna, chi si è sacrificata di più, chi ha fatto la scelta giusta. È una cosa che raramente si dice ad alta voce e che rende difficile pregare per lei senza che si infili dentro un giudizio. Accorgersene mentre si scrive è metà del lavoro.",
    archiveSlugs: ["ave-maria", "preghiera-semplice", "sotto-la-tua-protezione"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["mio-fratello", "chi-non-mi-parla-piu", "i-miei-genitori-anziani", "un-amico"],
    faq: [
      {
        q: "Posso regalargliela?",
        a: "Sì: arriva un link privato con testo e audio, che puoi mandarle quando vuoi.",
      },
    ],
  },
  {
    slug: "un-nipote",
    group: "famiglia",
    title: "Preghiera per un nipote",
    description:
      "Una preghiera per un nipote o una nipote, scritta sulla sua età e sulla sua situazione. Con i testi della tradizione per i piccoli.",
    h1: "Una preghiera per un nipote",
    lede: "Per chi si ama senza doverlo crescere, che è una libertà che i genitori non hanno.",
    when:
      "Una nascita. Un battesimo o una comunione. Un esame. O un periodo difficile in cui i suoi genitori sono in affanno e tu guardi da fuori.",
    difficulty:
      "I nonni vedono cose dei nipoti che i genitori non vedono, e non possono quasi mai dirle: intervenire è il modo più rapido per creare un problema con i figli. Ne nasce una preoccupazione che non ha sfogo, e la preghiera diventa uno dei pochi posti in cui può esistere senza fare danni. Vale anche il contrario: è il luogo dove dire un affetto che a voce sembrerebbe eccessivo.",
    archiveSlugs: ["angelo-di-dio", "sotto-la-tua-protezione", "ave-maria"],
    tagSlug: "protezione",
    prayerTypeId: "protezione",
    related: ["un-neonato", "mia-nonna", "mio-nonno", "mio-figlio"],
    faq: [
      {
        q: "Va bene per una prima comunione?",
        a: "È uno degli usi più comuni, insieme al battesimo. Puoi stamparla o mandare il link.",
      },
    ],
  },
  {
    slug: "tutta-la-mia-famiglia",
    group: "famiglia",
    title: "Preghiera per tutta la famiglia",
    description:
      "Una preghiera per la tua famiglia intera, scritta sui vostri nomi e sulla vostra situazione. Con i testi della tradizione per la casa.",
    h1: "Una preghiera per tutta la mia famiglia",
    lede: "Per la casa intera, compresi quelli con cui in questo momento non è semplice.",
    when:
      "Un Natale. Un trasloco. Un periodo in cui tutti stanno attraversando qualcosa insieme. O dopo un lutto, quando bisogna ricominciare a essere una famiglia con una persona in meno.",
    difficulty:
      "Una preghiera per l'intera famiglia rischia più di ogni altra di diventare una formula vuota, perché nominare tutti significa spesso non dire niente di nessuno. Funziona quando si accetta che una famiglia non è un blocco: dentro ci sono chi sta bene e chi no, chi si parla e chi no. Un testo che tiene queste differenze è più utile di uno che le appiattisce in un augurio generale.",
    archiveSlugs: ["padre-nostro", "angelo-di-dio", "al-fatiha", "preghiera-semplice"],
    tagSlug: "famiglia",
    prayerTypeId: "famiglia",
    related: ["i-miei-genitori", "mio-fratello", "chi-non-mi-parla-piu", "una-coppia-che-si-sposa"],
    faq: [
      {
        q: "Si può benedire la casa?",
        a: "La benedizione della casa è un atto liturgico e la fa un ministro di culto: questo non lo sostituisce e non lo pretende. Quello che ricevi è un testo da dire voi, che è una cosa diversa e legittima.",
      },
      {
        q: "Posso nominarli tutti?",
        a: "Sì, scrivi i nomi nell'intenzione. Il testo li includerà invece di parlare della famiglia in astratto.",
      },
    ],
  },
  /* ---------------------------------------------------------------------
   * Vicini
   * ------------------------------------------------------------------- */
  {
    slug: "un-amico",
    group: "vicini",
    title: "Preghiera per un amico",
    description:
      "Una preghiera per un amico, scritta sulla vostra storia e recitata a voce. Con i testi della tradizione, integrali e gratuiti.",
    h1: "Una preghiera per un amico",
    lede: "Per la famiglia che ci si sceglie, e per cui non esiste quasi nessuna formula.",
    when:
      "Un periodo nero che sta attraversando. Un trasloco che vi allontana. Il suo compleanno. O il momento in cui capisci di dovergli qualcosa che non gli hai mai detto.",
    difficulty:
      "La tradizione ha preghiere per i genitori, i figli, gli sposi, i defunti: per gli amici quasi niente, perché l'amicizia non è mai stata un legame giuridico o sacramentale. Chi cerca un testo per un amico trova quindi solo formule generiche da adattare, e si sente in imbarazzo a usarle. È una lacuna vera, ed è il caso in cui scriverne una nuova non è un lusso ma l'unica strada.",
    archiveSlugs: ["preghiera-semplice", "metta", "padre-nostro"],
    tagSlug: "pace",
    prayerTypeId: "richiesta",
    related: ["un-amico-malato", "una-persona-cara", "chi-e-solo", "mia-sorella"],
    faq: [
      {
        q: "Esiste una preghiera per gli amici?",
        a: "Non una formula classica dedicata, ed è una lacuna storica: la tradizione ha codificato i legami di sangue e di rito, non le amicizie. Si usano di solito la Preghiera semplice attribuita a san Francesco e, nel buddhismo, il Metta, che è un'aspirazione di bene rivolta a chiunque.",
      },
      {
        q: "Posso mandargliela?",
        a: "Sì. Arriva un link privato con testo e audio: molti lo mandano come messaggio di compleanno, che è l'occasione che non ha bisogno di spiegazioni.",
      },
    ],
  },
  {
    slug: "un-amico-malato",
    group: "vicini",
    title: "Preghiera per un amico malato",
    description:
      "Una preghiera per un amico che sta male, scritta sulla sua situazione. Con le preghiere della tradizione per i malati, testo integrale.",
    h1: "Una preghiera per un amico malato",
    lede: "Quando non sei famiglia, e proprio per questo non sai quanto spazio prenderti.",
    when:
      "Dopo la telefonata in cui te l'ha detto. Prima di andarlo a trovare. Quando la famiglia si è chiusa intorno a lui e tu resti un passo fuori.",
    difficulty:
      "Chi è amico di un malato ha un problema che i parenti non hanno: non sa qual è il suo posto. Scrivere troppo sembra invadente, scrivere poco sembra freddo, e quasi tutti finiscono per mandare un messaggio breve e sentirsi in colpa. Una preghiera è una via d'uscita da questa misura difficile, perché non chiede niente a chi la riceve — nemmeno di rispondere.",
    archiveSlugs: ["mi-sheberach", "dua-per-il-malato", "anima-christi", "salmo-23"],
    tagSlug: "malattia",
    prayerTypeId: "guarigione",
    related: ["un-amico", "chi-e-in-ospedale", "un-malato-di-tumore", "una-persona-cara"],
    faq: [
      {
        q: "Non so se è credente. Cosa faccio?",
        a: "Se non lo sai, la forma laica è la scelta prudente: dice la stessa cosa senza presupporre nulla. Oppure tienila per te e non dirglielo, che è quello che fanno in molti.",
      },
    ],
  },
  {
    slug: "una-persona-cara",
    group: "vicini",
    title: "Preghiera per una persona cara",
    description:
      "Una preghiera per una persona a cui tieni, scritta sulla vostra situazione e recitata a voce. Con i testi della tradizione, integrali.",
    h1: "Una preghiera per una persona cara",
    lede: "Quando il legame non ha un nome preciso, e conta comunque.",
    when:
      "Per qualcuno che non è parente né esattamente amico. Un ex suocero. Un vicino. Un maestro. Una persona che ha contato in un periodo della tua vita e che adesso vedi poco.",
    difficulty:
      "Ci sono legami veri che la lingua non nomina, e per i quali non esiste nessuna formula: chi ti ha cresciuto senza essere tuo genitore, chi ti ha insegnato un mestiere, la persona che c'era in un anno decisivo. Non avere una parola per un rapporto lo rende difficile anche da mettere in una preghiera. Scriverlo per esteso, con la storia che c'è, è l'unico modo di dargli una forma.",
    archiveSlugs: ["preghiera-semplice", "sotto-la-tua-protezione", "metta"],
    tagSlug: "protezione",
    prayerTypeId: "richiesta",
    related: ["un-amico", "chi-e-solo", "un-amico-malato", "chi-ha-perso-qualcuno"],
    faq: [
      {
        q: "Come la descrivo se il rapporto è complicato?",
        a: "Scrivilo com'è, senza semplificarlo. Le intenzioni più dettagliate producono i testi migliori, e questo servizio non ha bisogno che i rapporti siano lineari.",
      },
    ],
  },
  {
    slug: "chi-mi-ha-fatto-del-male",
    group: "vicini",
    title: "Preghiera per chi mi ha fatto del male",
    description:
      "Una preghiera per chi ti ha ferito, senza fingere che sia facile. Con i testi della tradizione sul perdono, integrali e gratuiti.",
    h1: "Una preghiera per chi mi ha fatto del male",
    lede: "La più difficile che esista, e quella su cui tutte le tradizioni insistono di più.",
    when:
      "Dopo un tradimento. Dopo un licenziamento ingiusto. Anni dopo un abuso. O quando ti accorgi che quella persona occupa ancora troppo spazio nella tua testa.",
    difficulty:
      "Qui l'ostacolo non è trovare le parole: è che pregare per chi ci ha ferito sembra dargli ragione, o assolverlo. Non lo è — nessuna tradizione seria chiede di dichiarare non grave ciò che è grave — ma la sensazione resta, e va nominata invece di far finta che non ci sia. Le preghiere che funzionano qui non chiedono di perdonare adesso: chiedono di essere liberati dal peso, che è una richiesta molto più onesta e alla portata.",
    archiveSlugs: ["padre-nostro", "atto-di-dolore", "metta", "preghiera-semplice"],
    tagSlug: "perdono",
    prayerTypeId: "perdono",
    related: ["chi-non-mi-parla-piu", "un-amore-finito", "un-matrimonio-in-crisi", "una-persona-cara"],
    faq: [
      {
        q: "Devo perdonare?",
        a: "No, e nessuno può ordinartelo. Puoi chiedere di riuscirci un giorno, o solo di smettere di starci male. Sono intenzioni legittime e il testo le seguirà senza spingerti dove non vuoi andare.",
      },
      {
        q: "E se quello che ha fatto è grave davvero?",
        a: "Allora resta grave. Una preghiera non minimizza e non riconcilia con nessuno: se hai subito un reato la risposta è la giustizia, e questo semmai è ciò che ti tiene compagnia nel frattempo.",
      },
    ],
  },
  {
    slug: "chi-e-solo",
    group: "vicini",
    title: "Preghiera per chi è solo",
    description:
      "Una preghiera per una persona sola, scritta sulla sua situazione. Con i testi della tradizione per la solitudine e la pace interiore.",
    h1: "Una preghiera per chi è solo",
    lede: "Per chi passa i giorni senza che nessuno gli chieda come sta.",
    when:
      "Per un vicino anziano. Per un parente in casa di riposo. Per qualcuno rimasto solo dopo un lutto. O per te, se la persona sola sei tu.",
    difficulty:
      "La solitudine ha una particolarità: chi la vive smette di raccontarla, perché dirla fa vergogna e perché non c'è nessuno a cui dirla. Chi la guarda da fuori se ne accorge tardi. Pregare per una persona sola è quindi spesso l'unico gesto che si riesce a fare quando si è capito troppo tardi — e vale la pena dire che una telefonata, nella maggior parte dei casi, vale di più.",
    archiveSlugs: ["salmo-23", "preghiera-di-gesu", "metta", "sotto-la-tua-protezione"],
    tagSlug: "paura",
    prayerTypeId: "pace",
    related: ["i-miei-genitori-anziani", "una-persona-cara", "chi-ha-perso-qualcuno", "un-amore-finito"],
    faq: [
      {
        q: "Posso farla per me stesso?",
        a: "Sì, e succede spesso. Scrivi la tua situazione in prima persona: il testo ti si rivolgerà direttamente invece di parlare di te da fuori.",
      },
    ],
  },

  /* ---------------------------------------------------------------------
   * Malattia
   * ------------------------------------------------------------------- */
  {
    slug: "un-malato-di-tumore",
    group: "malattia",
    title: "Preghiera per un malato di tumore",
    description:
      "Una preghiera per chi affronta un tumore, scritta sulla sua situazione e sul suo nome. Con i testi della tradizione per i malati, integrali.",
    h1: "Una preghiera per chi ha un tumore",
    lede: "Per la malattia che, più di ogni altra, si combatte a tempo indeterminato.",
    when:
      "Il giorno della diagnosi. L'inizio della chemioterapia. Il controllo a sei mesi. La settimana in cui si aspetta un referto e nessuno in casa parla d'altro.",
    difficulty:
      "Un tumore non ha il decorso netto delle altre malattie: ha esami, attese, remissioni, ricadute, e ogni tappa riapre tutto da capo. Chi prega si trova a farlo per mesi o anni, e le formule si consumano — dopo la ventesima volta le stesse parole non dicono più niente. È la ragione per cui in questa malattia funziona meglio un testo nuovo a ogni passaggio che una preghiera sola ripetuta.",
    archiveSlugs: ["mi-sheberach", "anima-christi", "salmo-23", "dua-per-il-malato"],
    tagSlug: "malattia",
    prayerTypeId: "guarigione",
    related: ["chi-ha-avuto-una-diagnosi", "chi-e-in-ospedale", "chi-assiste-un-malato", "un-amico-malato"],
    faq: [
      {
        q: "Posso averne una nuova a ogni ciclo di terapia?",
        a: "Sì, ed è il caso in cui ha più senso. La novena copre nove giorni, il trigesimo trenta, e arrivano da sole. Chi è dentro una terapia non ha testa per ricordarsi di chiedere.",
      },
      {
        q: "Si può pregare per guarire?",
        a: "Si può chiedere, come si è sempre fatto. Nessuna preghiera cura un tumore e chiunque lo lasci intendere ti sta ingannando: la terapia la fanno gli oncologi.",
      },
    ],
  },
  {
    slug: "chi-e-in-ospedale",
    group: "malattia",
    title: "Preghiera per chi è in ospedale",
    description:
      "Una preghiera per una persona ricoverata, scritta sulla sua situazione. Con i testi brevi della tradizione da dire accanto a un letto.",
    h1: "Una preghiera per chi è in ospedale",
    lede: "Per le giornate che in corsia durano il doppio, e per chi le passa in un corridoio.",
    when:
      "La notte del ricovero. Le ore fuori dalla stanza. Il viaggio in macchina per andare a trovarlo. La sera in cui torni a casa e la casa è vuota.",
    difficulty:
      "In ospedale il tempo si deforma: non succede quasi niente e non si riesce a pensare ad altro. È un contesto ostile alla preghiera lunga — c'è rumore, si è interrotti, non c'è un posto dove stare — e le formule articolate non reggono. Servono testi brevi, che stiano in un respiro e si possano ripetere in ascensore. È il criterio con cui sono scelti quelli qui sotto.",
    archiveSlugs: ["preghiera-di-gesu", "salmo-23", "sotto-la-tua-protezione", "anima-christi"],
    tagSlug: "malattia",
    prayerTypeId: "guarigione",
    related: ["chi-affronta-un-intervento", "chi-e-in-terapia-intensiva", "chi-assiste-un-malato", "un-malato-di-tumore"],
    faq: [
      {
        q: "Ci sono preghiere brevi per l'ospedale?",
        a: "La preghiera di Gesù è di una riga sola e nasce per essere ripetuta: è la più adatta a un corridoio. Il Salmo 23 si impara in pochi giorni. Entrambe sono nell'archivio, gratis.",
      },
      {
        q: "Posso farmela recitare nelle cuffie?",
        a: "Ogni preghiera arriva con una registrazione scaricabile. Molti l'ascoltano in sala d'attesa, che è l'uso per cui l'audio serve di più.",
      },
    ],
  },
  {
    slug: "chi-affronta-un-intervento",
    group: "malattia",
    title: "Preghiera prima di un intervento",
    description:
      "Una preghiera per chi sta per essere operato, scritta sulla sua situazione. Con i testi della tradizione per il coraggio e la protezione.",
    h1: "Una preghiera prima di un intervento",
    lede: "Per le ore prima, che sono quasi sempre peggio dell'operazione.",
    when:
      "La sera prima. La mattina, a digiuno, in attesa della barella. Le ore in sala d'aspetto mentre è dentro.",
    difficulty:
      "Un intervento ha una cosa che quasi nessun'altra paura ha: un'ora precisa. Si sa quando comincia, e questo concentra l'angoscia in un punto invece di spalmarla. Ne consegue che la preghiera qui ha una funzione pratica — riempire un'attesa a orario — e deve essere qualcosa che si può dire mentre si guarda l'orologio. Non è il momento delle meditazioni lunghe.",
    archiveSlugs: ["sotto-la-tua-protezione", "anima-christi", "preghiera-di-gesu", "angelo-di-dio"],
    tagSlug: "paura",
    prayerTypeId: "guarigione",
    related: ["chi-e-in-ospedale", "chi-e-in-terapia-intensiva", "un-figlio-malato", "mia-madre-malata"],
    faq: [
      {
        q: "Posso farla arrivare a un'ora precisa?",
        a: "Sì: puoi indicare data e ora e il testo terrà conto del momento in cui verrà recitato.",
      },
      {
        q: "Serve anche per chi aspetta fuori?",
        a: "Puoi scrivere l'intenzione dal tuo punto di vista, ed è quello che fanno in molti: chi è in sala operatoria dorme, chi aspetta no.",
      },
    ],
  },
  {
    slug: "chi-e-in-terapia-intensiva",
    group: "malattia",
    title: "Preghiera per chi è in terapia intensiva",
    description:
      "Una preghiera per una persona in rianimazione, scritta sulla vostra situazione. Con i testi della tradizione per le ore più difficili.",
    h1: "Una preghiera per chi è in terapia intensiva",
    lede: "Per quando le visite durano dieci minuti e il resto della giornata è un telefono che non squilla.",
    when:
      "Le ore dopo un incidente. I giorni di un coma. La finestra di visita. La notte, aspettando una chiamata che speri non arrivi.",
    difficulty:
      "In rianimazione si prega senza sapere per cosa: non si sa se chiedere che viva, che si svegli, che non soffra, o che finisca. I medici parlano con cautela e la famiglia non osa formulare la domanda vera. È l'unica situazione in cui l'oggetto stesso della preghiera è incerto, e forzarlo in una formula chiusa la rende falsa. Un testo scritto qui deve poter tenere insieme richieste opposte senza risolverle.",
    archiveSlugs: ["salmo-23", "preghiera-di-gesu", "anima-christi", "de-profundis"],
    tagSlug: "paura",
    prayerTypeId: "guarigione",
    related: ["chi-e-in-ospedale", "chi-non-guarira", "chi-affronta-un-intervento", "chi-assiste-un-malato"],
    faq: [
      {
        q: "Non so nemmeno cosa chiedere.",
        a: "Scrivi esattamente questo. È una delle intenzioni più oneste che si possano dare, e produce testi migliori di una richiesta finta.",
      },
    ],
  },
  {
    slug: "chi-non-guarira",
    group: "malattia",
    title: "Preghiera per chi non guarirà",
    description:
      "Una preghiera per una persona alla fine della vita, scritta senza promesse. Con i testi della tradizione per l'accompagnamento.",
    h1: "Una preghiera per chi non guarirà",
    lede: "Quando la medicina ha smesso di curare e ha cominciato ad accompagnare.",
    when:
      "Dopo il colloquio in cui i medici hanno cambiato tono. Nelle settimane di cure palliative. Nell'hospice. Nelle ultime notti.",
    difficulty:
      "Qui cade tutto l'impianto della preghiera per i malati, che è costruita per chiedere la guarigione. Chiedere ancora che guarisca diventa una bugia detta ad alta voce, e le persone accanto a un morente lo sentono come una stonatura. Quello che resta da chiedere è diverso e più difficile da formulare: che non soffra, che non sia solo, che chi resta regga. Sono richieste vere, e vanno scritte al posto dell'altra, non insieme.",
    archiveSlugs: ["anima-christi", "salmo-23", "salve-regina", "eterno-riposo"],
    tagSlug: "lutto",
    prayerTypeId: "defunti",
    related: ["chi-e-in-terapia-intensiva", "chi-assiste-un-malato", "chi-ha-perso-qualcuno", "mia-madre-anziana"],
    faq: [
      {
        q: "Si può pregare perché finisca?",
        a: "Si può chiedere che non soffra e che la fine sia serena: la tradizione lo chiama buona morte e ci ha dedicato preghiere apposta, da secoli. È diverso dal chiedere di anticiparla, che è un'altra questione e non riguarda una preghiera.",
      },
      {
        q: "Cosa si legge accanto a un morente?",
        a: "Nella tradizione cattolica l'Anima Christi e la Salve Regina, che è la preghiera della sera e della fine. Il Salmo 23 è il testo più letto in assoluto in questo momento, anche da chi non è credente. Sono tutti nell'archivio.",
      },
    ],
  },
  {
    slug: "chi-assiste-un-malato",
    group: "malattia",
    title: "Preghiera per chi assiste un malato",
    description:
      "Una preghiera per chi si prende cura di una persona malata, scritta sulla sua fatica. Con i testi della tradizione per la forza.",
    h1: "Una preghiera per chi assiste un malato",
    lede: "Per la persona che nessuno chiede come sta, perché non è lei quella malata.",
    when:
      "Il sesto mese di assistenza. La notte in cui non ce la fai più e ti spaventi di averlo pensato. Il giorno in cui capisci che non finirà presto.",
    difficulty:
      "Chi assiste vive dentro un divieto non scritto: non può lamentarsi, perché c'è qualcuno che sta peggio. Ne segue un esaurimento di cui è vietato parlare e, prima o poi, il pensiero che sarebbe un sollievo se finisse — seguito da una colpa enorme. È materiale che quasi nessuno dice ad alta voce a un'altra persona. Una preghiera è uno dei pochissimi posti dove può essere detto senza conseguenze.",
    archiveSlugs: ["preghiera-semplice", "salmo-23", "vieni-santo-spirito", "preghiera-di-gesu"],
    tagSlug: "pace",
    prayerTypeId: "pace",
    related: ["mia-madre-malata", "i-miei-genitori-anziani", "chi-non-guarira", "chi-e-in-ospedale"],
    faq: [
      {
        q: "Mi sento in colpa per essere stanco.",
        a: "Scrivilo. È il contenuto più frequente delle intenzioni che riceviamo da chi assiste, e un testo che lo nomina fa più bene di uno che finge che tu sia infaticabile.",
      },
      {
        q: "Posso chiedere qualcosa per me?",
        a: "Sì, ed è il senso di questa pagina. Non tutte le preghiere devono essere per qualcun altro.",
      },
    ],
  },
  {
    slug: "chi-ha-avuto-una-diagnosi",
    group: "malattia",
    title: "Preghiera dopo una diagnosi",
    description:
      "Una preghiera per il giorno in cui arriva una diagnosi, scritta sulla tua situazione. Con i testi brevi della tradizione per lo spavento.",
    h1: "Una preghiera per il giorno della diagnosi",
    lede: "Per le ventiquattr'ore in cui la vita si divide in prima e dopo.",
    when:
      "Il giorno stesso. La notte che segue, in cui non si dorme. La settimana in cui bisogna dirlo agli altri e non si sa come.",
    difficulty:
      "Il giorno della diagnosi non si riesce a pensare: si è dentro uno stordimento in cui le informazioni non entrano e le parole non si trovano. È il momento peggiore per mettersi a comporre qualcosa, e quello in cui serve di più avere già un testo davanti. Per questo qui contano più le formule brevissime che le preghiere articolate — non c'è la lucidità per reggerne una lunga.",
    archiveSlugs: ["preghiera-di-gesu", "salmo-23", "sotto-la-tua-protezione"],
    tagSlug: "paura",
    prayerTypeId: "pace",
    related: ["un-malato-di-tumore", "chi-e-in-ospedale", "mia-madre-malata", "chi-soffre-di-ansia"],
    faq: [
      {
        q: "È per me o per chi è malato?",
        a: "Per entrambi: puoi scriverla in prima persona se la diagnosi è tua, o per un'altra persona. Indicalo nell'intenzione e cambia il registro del testo.",
      },
    ],
  },

  /* ---------------------------------------------------------------------
   * Fatiche
   * ------------------------------------------------------------------- */
  {
    slug: "chi-soffre-di-depressione",
    group: "fatiche",
    title: "Preghiera per chi soffre di depressione",
    description:
      "Una preghiera per una persona depressa, scritta senza retorica e senza promesse. Con i testi della tradizione per il buio, integrali.",
    h1: "Una preghiera per chi soffre di depressione",
    lede: "Per una malattia che quasi nessuno tratta come tale, nemmeno chi ce l'ha.",
    when:
      "Quando dura da mesi e non se ne parla in casa. Quando smette di rispondere ai messaggi. Quando hai finito le cose da dire e le hai già dette tutte due volte.",
    difficulty:
      "La depressione manda in cortocircuito la preghiera più di ogni altra sofferenza, perché è una malattia che toglie proprio la capacità di sperare — cioè il presupposto di chiedere qualcosa. Chi ne soffre trova insopportabili i testi consolatori, che suonano come l'ennesima persona che gli dice di reagire. Le preghiere che reggono qui non promettono luce: restano nel buio e si limitano a dire che c'è qualcuno. È una scelta di tono, e va fatta apposta.",
    archiveSlugs: ["de-profundis", "salmo-23", "preghiera-di-gesu", "metta"],
    tagSlug: "paura",
    prayerTypeId: "pace",
    related: ["chi-soffre-di-ansia", "un-figlio-che-soffre", "chi-e-solo", "chi-lotta-con-una-dipendenza"],
    faq: [
      {
        q: "Non è meglio uno psichiatra?",
        a: "Sì, senza discussione. La depressione è una malattia e si cura con la medicina e la psicoterapia: una preghiera non la tocca, e chiunque sostenga il contrario sta facendo un danno. Questo semmai tiene compagnia a chi sta accanto, o a chi è in cura.",
      },
      {
        q: "Esiste una preghiera per la disperazione?",
        a: "Il De profundis, che comincia letteralmente «dal profondo»: è il testo che la tradizione ha per chi è in fondo, e non promette niente. Lo trovi integrale nell'archivio.",
      },
    ],
  },
  {
    slug: "chi-soffre-di-ansia",
    group: "fatiche",
    title: "Preghiera per l'ansia e gli attacchi di panico",
    description:
      "Una preghiera breve per l'ansia, da ripetere quando serve. Con i testi brevi della tradizione per l'angoscia, integrali e gratuiti.",
    h1: "Una preghiera per chi soffre d'ansia",
    lede: "Corta, ripetibile, e che stia dentro un respiro che non viene bene.",
    when:
      "Alle tre di notte. Prima di entrare da qualche parte. In macchina, prima di scendere. Durante un attacco, quando serve qualcosa a cui aggrapparsi.",
    difficulty:
      "L'ansia ha un vincolo tecnico che le altre sofferenze non hanno: durante una crisi non si riesce a leggere. Le frasi lunghe non si seguono, il pensiero non tiene, e una preghiera articolata diventa un'ulteriore cosa che non si riesce a fare — cioè un peggioramento. Serve una formula corta al punto da poter essere ripetuta a memoria e senza capirla, che è esattamente il principio su cui è costruita la preghiera del cuore.",
    archiveSlugs: ["preghiera-di-gesu", "trisagio", "salmo-23", "metta"],
    tagSlug: "paura",
    prayerTypeId: "pace",
    related: ["chi-soffre-di-depressione", "chi-ha-avuto-una-diagnosi", "un-figlio-che-soffre", "chi-e-solo"],
    faq: [
      {
        q: "Qual è la preghiera più breve?",
        a: "La preghiera di Gesù: «Signore Gesù Cristo, Figlio di Dio, abbi pietà di me peccatore». Nella tradizione orientale si ripete legandola al respiro, ed esiste proprio per essere detta quando non si riesce a fare altro. Testo integrale nell'archivio.",
      },
      {
        q: "Sostituisce la terapia?",
        a: "No. Se hai attacchi di panico serve uno specialista. Questo è qualcosa da tenere in tasca nel frattempo, non una cura.",
      },
    ],
  },
  {
    slug: "chi-lotta-con-una-dipendenza",
    group: "fatiche",
    title: "Preghiera per chi lotta con una dipendenza",
    description:
      "Una preghiera per chi combatte una dipendenza, o per chi gli sta accanto. Con i testi della tradizione, integrali e gratuiti.",
    h1: "Una preghiera per chi lotta con una dipendenza",
    lede: "Per una battaglia che si vince un giorno alla volta, e si può perdere ogni giorno.",
    when:
      "All'inizio di un percorso. Dopo una ricaduta. Nella settimana in cui la famiglia ha smesso di crederci. O per un genitore che aspetta una telefonata.",
    difficulty:
      "La dipendenza logora chi sta intorno in un modo particolare: dopo qualche ricaduta la speranza diventa faticosa, e chi ama comincia a difendersene. Nasce allora una preghiera stanca, che chiede senza credere, e chi la fa se ne accorge. Vale la pena scriverlo — che non ci si crede più tanto — invece di produrre l'ennesima richiesta di guarigione detta per abitudine. I percorsi che funzionano, dai dodici passi in poi, partono proprio dall'ammettere di non farcela.",
    archiveSlugs: ["preghiera-semplice", "atto-di-dolore", "preghiera-di-gesu", "salmo-23"],
    tagSlug: "pace",
    prayerTypeId: "richiesta",
    related: ["un-figlio-che-soffre", "chi-soffre-di-depressione", "chi-e-in-carcere", "chi-non-mi-parla-piu"],
    faq: [
      {
        q: "Posso pregare per qualcuno che non vuole smettere?",
        a: "Sì, ed è la situazione più comune. Non serve il consenso di nessuno per pregare, e non cambia niente della sua situazione: cambia dove metti quello che provi.",
      },
    ],
  },
  {
    slug: "chi-e-in-carcere",
    group: "fatiche",
    title: "Preghiera per chi è in carcere",
    description:
      "Una preghiera per una persona detenuta, o per la sua famiglia, scritta sulla vostra situazione. Con i testi della tradizione, integrali.",
    h1: "Una preghiera per chi è in carcere",
    lede: "Per chi conta i giorni dentro, e per chi li conta fuori.",
    when:
      "Dopo una condanna. Prima di un colloquio. A Natale. Nei mesi in cui i figli chiedono dov'è.",
    difficulty:
      "Attorno al carcere c'è un silenzio sociale che rende tutto più pesante: le famiglie dei detenuti non lo dicono, non ricevono solidarietà e spesso si vergognano. Pregare per una persona detenuta significa quindi quasi sempre farlo di nascosto, senza poterne parlare con nessuno. Si aggiunge la contraddizione di chi ama qualcuno che ha fatto del male davvero, e non deve scegliere fra le due cose.",
    archiveSlugs: ["de-profundis", "atto-di-dolore", "salmo-23", "padre-nostro"],
    tagSlug: "perdono",
    prayerTypeId: "perdono",
    related: ["chi-mi-ha-fatto-del-male", "chi-lotta-con-una-dipendenza", "tutta-la-mia-famiglia", "chi-e-solo"],
    faq: [
      {
        q: "Posso farla arrivare in carcere?",
        a: "La preghiera arriva a te, in email, con testo e audio. Se vuoi mandarla dentro serve la posta ordinaria e le regole dell'istituto: il testo si può stampare.",
      },
    ],
  },
  {
    slug: "chi-ha-perso-il-lavoro",
    group: "fatiche",
    title: "Preghiera per chi ha perso il lavoro",
    description:
      "Una preghiera per una persona rimasta senza lavoro, scritta sulla sua situazione. Con i testi della tradizione per il lavoro e la fiducia.",
    h1: "Una preghiera per chi ha perso il lavoro",
    lede: "Per chi ha perso, insieme allo stipendio, anche il modo in cui si presentava agli altri.",
    when:
      "Il giorno del licenziamento. Il terzo mese di ricerca. Quando finisce la disoccupazione. La domenica sera, che diventa il momento peggiore della settimana.",
    difficulty:
      "Perdere il lavoro non è solo un problema economico, ed è l'errore che fanno quasi tutti quelli che stanno intorno: si perde il ruolo, l'orario, la risposta alla domanda «tu cosa fai». Chi lo vive fatica ad ammettere che la parte peggiore è la vergogna e non i soldi, perché detta così sembra un lusso. Una preghiera che nomina la vergogna invece della fattura è quasi sempre quella che serviva.",
    archiveSlugs: ["vieni-santo-spirito", "salmo-23", "preghiera-semplice", "gloria-al-padre"],
    tagSlug: "lavoro",
    prayerTypeId: "lavoro",
    related: ["chi-e-solo", "un-figlio-che-soffre", "tutta-la-mia-famiglia", "chi-soffre-di-ansia"],
    faq: [
      {
        q: "Quale santo si prega per il lavoro?",
        a: "In Italia soprattutto san Giuseppe lavoratore, che si festeggia il primo maggio, e sant'Antonio per le cose perdute — categoria in cui la devozione popolare ha sempre fatto rientrare anche il lavoro. Puoi indicare una devozione e il testo la seguirà.",
      },
    ],
  },
  {
    slug: "chi-ha-perso-qualcuno",
    group: "fatiche",
    title: "Preghiera per chi ha perso qualcuno",
    description:
      "Una preghiera per una persona in lutto — non per il defunto, per chi resta. Con i testi della tradizione per il lutto, integrali.",
    h1: "Una preghiera per chi è in lutto",
    lede: "Non per chi è morto: per chi è rimasto, che è quello che ha bisogno di qualcosa.",
    when:
      "I giorni del funerale. Il mese dopo, quando tutti smettono di telefonare. Il primo compleanno. Il primo Natale.",
    difficulty:
      "Quasi tutte le preghiere per la morte sono rivolte al defunto: suffragio, riposo, memoria. Per chi resta c'è molto meno, e il momento in cui serve di più non è il funerale — è il mese dopo, quando i parenti sono ripartiti, i messaggi si sono fermati e la vita di tutti è ricominciata tranne la sua. È il vuoto che questa pagina prova a coprire, e per cui la tradizione non ha quasi formule.",
    archiveSlugs: ["salmo-23", "salve-regina", "de-profundis", "preghiera-semplice"],
    tagSlug: "lutto",
    prayerTypeId: "richiesta",
    related: ["mia-madre-defunta", "un-figlio-che-non-ce-piu", "chi-e-solo", "una-persona-cara"],
    faq: [
      {
        q: "Cosa si scrive a chi ha perso qualcuno?",
        a: "Meno di quanto si pensa, e mai spiegazioni sul perché sia successo. I testi che consolano davvero non giustificano la morte: dicono soltanto che chi legge non è solo. È il criterio con cui vengono scritti qui.",
      },
      {
        q: "Posso mandargliela?",
        a: "Sì, e funziona meglio a distanza di qualche settimana dal funerale, quando gli altri hanno smesso di farsi sentire.",
      },
    ],
  },
  {
    slug: "chi-affronta-un-esame",
    group: "fatiche",
    title: "Preghiera per chi affronta un esame",
    description:
      "Una preghiera per uno studente prima di un esame o di un concorso, scritta sulla sua prova. Con i testi della tradizione per la lucidità.",
    h1: "Una preghiera per chi affronta un esame",
    lede: "Per la maturità, l'università, il concorso, la patente: le prove con una data e un voto.",
    when:
      "La notte prima. La mattina, davanti all'aula. L'attesa dei risultati, che per molti è peggio della prova.",
    difficulty:
      "Su un esame la preghiera scivola facilmente nella superstizione — il rito portafortuna, la formula da ripetere tre volte — e chi la fa lo sa, il che la rende un po' imbarazzante. La versione che regge chiede lucidità e calma, non un voto: cioè qualcosa che dipende davvero da chi sta per entrare, e che una preghiera può plausibilmente accompagnare.",
    archiveSlugs: ["vieni-santo-spirito", "preghiera-di-gesu", "angelo-di-dio"],
    tagSlug: "lavoro",
    prayerTypeId: "esame",
    related: ["mia-figlia", "mio-figlio", "chi-soffre-di-ansia", "chi-ha-perso-il-lavoro"],
    faq: [
      {
        q: "Quale preghiera si dice prima di un esame?",
        a: "Il Veni Sancte Spiritus — «Vieni, Santo Spirito» — che nella tradizione si invoca prima di ogni atto che richiede intelligenza, ed è la ragione per cui si dice all'inizio dell'anno scolastico. Testo integrale nell'archivio.",
      },
      {
        q: "Posso farla arrivare all'ora dell'esame?",
        a: "Sì: indica data e ora e il testo terrà conto del momento.",
      },
    ],
  },
];

/** Etichette dei gruppi, per la hub. */
export const PERSON_GROUP_LABELS: Record<PersonLanding["group"], string> = {
  genitori: "Per i genitori",
  figli: "Per i figli",
  coppia: "Per chi si ama",
  famiglia: "Per la famiglia",
  vicini: "Per amici e vicini",
  malattia: "Per chi sta male",
  fatiche: "Per chi attraversa un momento difficile",
};

/** L'ordine in cui i gruppi compaiono nella hub. */
const GROUP_ORDER: PersonLanding["group"][] = [
  "genitori",
  "figli",
  "coppia",
  "famiglia",
  "vicini",
  "malattia",
  "fatiche",
];

export function getPersonLanding(slug: string): PersonLanding | undefined {
  return PERSON_LANDINGS.find((l) => l.slug === slug);
}

/** Le pagine raggruppate, nell'ordine della hub. */
export function personGroups(): { group: PersonLanding["group"]; label: string; items: PersonLanding[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    label: PERSON_GROUP_LABELS[group],
    items: PERSON_LANDINGS.filter((l) => l.group === group),
  })).filter((g) => g.items.length > 0);
}
