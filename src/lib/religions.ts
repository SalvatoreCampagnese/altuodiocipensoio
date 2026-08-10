/**
 * Catalogo delle tradizioni religiose supportate.
 *
 * `guidance` viene passato al modello: serve a ottenere un testo che suoni
 * autentico dentro quella tradizione (formule, nomi del divino, registro).
 */

export type PrayerType = {
  id: string;
  label: string;
  hint: string;
};

export type Religion = {
  id: string;
  label: string;
  emoji: string;
  traditions?: { id: string; label: string }[];
  prayerTypes: PrayerType[];
  guidance: string;
  /** Preferenza di voce: `male` di default, `arabic` per recitazione in arabo. */
  voice?: "male" | "female" | "arabic";
};

const COMMON_TYPES: PrayerType[] = [
  { id: "ringraziamento", label: "Ringraziamento", hint: "Per qualcosa che è andato bene" },
  { id: "richiesta", label: "Richiesta / Supplica", hint: "Per chiedere aiuto o una grazia" },
  { id: "protezione", label: "Protezione", hint: "Per sé o per una persona cara" },
  { id: "guarigione", label: "Guarigione", hint: "Per la salute di qualcuno" },
  { id: "defunti", label: "Per i defunti", hint: "In memoria di chi non c'è più" },
  { id: "perdono", label: "Perdono", hint: "Per chiedere o concedere perdono" },
  { id: "esame", label: "Esami e prove", hint: "Esami, colloqui, momenti decisivi" },
  { id: "viaggio", label: "Viaggio", hint: "Per chi parte o è lontano" },
  { id: "famiglia", label: "Famiglia e amore", hint: "Nascite, matrimoni, riconciliazioni" },
  { id: "lavoro", label: "Lavoro e prosperità", hint: "Nuovo lavoro, difficoltà economiche" },
  { id: "pace", label: "Pace interiore", hint: "Ansia, insonnia, momenti difficili" },
  { id: "quotidiana", label: "Preghiera quotidiana", hint: "La preghiera di ogni giorno" },
];

export const RELIGIONS: Religion[] = [
  {
    id: "cattolica",
    label: "Cristianesimo — Cattolico",
    emoji: "✝️",
    traditions: [
      { id: "romano", label: "Rito romano" },
      { id: "ambrosiano", label: "Rito ambrosiano" },
      { id: "mariano", label: "Devozione mariana" },
      { id: "francescano", label: "Spiritualità francescana" },
    ],
    prayerTypes: [
      ...COMMON_TYPES,
      { id: "rosario", label: "Intenzione del Rosario", hint: "Una decina offerta per te" },
      { id: "santo", label: "A un santo patrono", hint: "Sant'Antonio, Santa Rita, Padre Pio…" },
      { id: "novena", label: "Novena", hint: "Preghiera insistente per nove giorni" },
    ],
    guidance:
      "Tradizione cattolica romana. Rivolgiti a Dio Padre, a Gesù Cristo, allo Spirito Santo o alla Vergine Maria e ai santi come intercessori. Registro liturgico italiano, del tipo delle orazioni del Messale. Puoi chiudere con \"Nel nome del Padre, del Figlio e dello Spirito Santo. Amen.\"",
  },
  {
    id: "ortodossa",
    label: "Cristianesimo — Ortodosso",
    emoji: "☦️",
    traditions: [
      { id: "greco", label: "Greco-ortodosso" },
      { id: "russo", label: "Russo-ortodosso" },
      { id: "rumeno", label: "Rumeno-ortodosso" },
    ],
    prayerTypes: [
      ...COMMON_TYPES,
      { id: "gesu", label: "Preghiera del cuore", hint: "La preghiera di Gesù, ripetuta" },
      { id: "theotokos", label: "Alla Theotokos", hint: "Alla Madre di Dio" },
    ],
    guidance:
      "Tradizione cristiana ortodossa. Tono innodico e ripetitivo, con invocazioni tipo \"Signore, pietà\" (Kyrie eleison) e riferimento alla Theotokos. Chiudi con una dossologia trinitaria: \"ora e sempre e nei secoli dei secoli. Amen.\"",
  },
  {
    id: "protestante",
    label: "Cristianesimo — Protestante / Evangelico",
    emoji: "✝️",
    traditions: [
      { id: "luterano", label: "Luterano" },
      { id: "riformato", label: "Riformato / Valdese" },
      { id: "evangelico", label: "Evangelico / Pentecostale" },
      { id: "anglicano", label: "Anglicano" },
      { id: "battista", label: "Battista" },
    ],
    prayerTypes: COMMON_TYPES,
    guidance:
      "Tradizione protestante. Preghiera diretta a Dio in nome di Gesù, senza intercessione dei santi, con forte riferimento alla Scrittura e alla grazia. Linguaggio personale e caldo più che liturgico. Chiudi con \"Nel nome di Gesù, amen.\"",
  },
  {
    id: "islam",
    label: "Islam",
    emoji: "☪️",
    traditions: [
      { id: "sunnita", label: "Sunnita" },
      { id: "sciita", label: "Sciita" },
      { id: "sufi", label: "Sufi" },
    ],
    prayerTypes: [
      ...COMMON_TYPES,
      { id: "dua", label: "Duʿāʾ personale", hint: "Invocazione libera ad Allah" },
      { id: "istikhara", label: "Istikhāra", hint: "Per chiedere guida in una scelta" },
      { id: "dhikr", label: "Dhikr", hint: "Ricordo e ripetizione dei nomi di Allah" },
    ],
    guidance:
      "Tradizione islamica. Componi un duʿāʾ (invocazione personale, NON una sura del Corano). Apri con \"Bismillāhi r-raḥmāni r-raḥīm\" e rivolgiti ad Allah usando i Suoi bei nomi (al-Raḥmān, al-Raḥīm, al-Shāfī…). Aggiungi la benedizione sul Profeta (\"la pace e la benedizione siano su di lui\"). Chiudi con \"Āmīn\". Non citare mai versetti coranici inventati né attribuire numeri di sura o versetto.",
    voice: "male",
  },
  {
    id: "ebraismo",
    label: "Ebraismo",
    emoji: "✡️",
    traditions: [
      { id: "ortodosso", label: "Ortodosso" },
      { id: "conservative", label: "Conservative / Masorti" },
      { id: "riformato", label: "Riformato" },
      { id: "chassidico", label: "Chassidico" },
    ],
    prayerTypes: [
      ...COMMON_TYPES,
      { id: "refuah", label: "Mi Sheberach", hint: "Preghiera per la guarigione" },
      { id: "kaddish", label: "Intenzione di Kaddish", hint: "In memoria di un defunto" },
      { id: "shabbat", label: "Per lo Shabbat", hint: "Benedizione del settimo giorno" },
    ],
    guidance:
      "Tradizione ebraica. Usa la forma della berakhah (\"Benedetto sei Tu, Signore nostro Dio, Re dell'universo…\"). Riferisciti al Santo Benedetto Egli sia, e ai patriarchi e matriarche quando è pertinente. Non pronunciare il Tetragramma: usa \"HaShem\" o \"il Signore\". Chiudi con \"Amen\".",
  },
  {
    id: "induismo",
    label: "Induismo",
    emoji: "🕉️",
    traditions: [
      { id: "vaishnava", label: "Vaishnava (Vishnu, Krishna, Rama)" },
      { id: "shaiva", label: "Shaiva (Shiva)" },
      { id: "shakta", label: "Shakta (Devi, Durga, Kali)" },
      { id: "smarta", label: "Smarta / generale" },
    ],
    prayerTypes: [
      ...COMMON_TYPES,
      { id: "puja", label: "Intenzione di pūjā", hint: "Offerta rituale" },
      { id: "mantra", label: "Mantra e invocazione", hint: "Con japa ripetuto" },
      { id: "ganesha", label: "A Ganesha", hint: "Per rimuovere gli ostacoli" },
    ],
    guidance:
      "Tradizione induista. Invoca la divinità adatta all'intenzione (Ganesha per gli ostacoli, Lakshmi per la prosperità, Dhanvantari per la salute…). Puoi aprire con \"Oṃ\" e includere un mantra semplice e diffuso. Chiudi con \"Oṃ śāntiḥ śāntiḥ śāntiḥ\".",
  },
  {
    id: "buddhismo",
    label: "Buddhismo",
    emoji: "☸️",
    traditions: [
      { id: "theravada", label: "Theravāda" },
      { id: "mahayana", label: "Mahāyāna" },
      { id: "vajrayana", label: "Vajrayāna / Tibetano" },
      { id: "zen", label: "Zen" },
    ],
    prayerTypes: [
      ...COMMON_TYPES,
      { id: "metta", label: "Mettā — gentilezza amorevole", hint: "Augurio di bene a tutti gli esseri" },
      { id: "dedica", label: "Dedica dei meriti", hint: "Offrire il bene compiuto ad altri" },
    ],
    guidance:
      "Tradizione buddhista. Non si supplica un dio creatore: si formula un'aspirazione e si dedicano i meriti. Usa il registro della mettā (\"che tu sia libero dalla sofferenza…\") e il riferimento ai Tre Gioielli. Chiudi con una dedica dei meriti a tutti gli esseri senzienti.",
  },
  {
    id: "sikhismo",
    label: "Sikhismo",
    emoji: "🪯",
    prayerTypes: [...COMMON_TYPES, { id: "ardas", label: "Ardās", hint: "La supplica comunitaria sikh" }],
    guidance:
      "Tradizione sikh. Apri con \"Ik Onkar\" e rivolgiti a Waheguru, l'Unico senza forma. Registro della Ardās: gratitudine, ricordo dei Guru, richiesta umile. Chiudi con \"Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh\".",
  },
  {
    id: "bahai",
    label: "Fede Bahá'í",
    emoji: "⭐",
    prayerTypes: COMMON_TYPES,
    guidance:
      "Tradizione bahá'í. Registro elevato e poetico, rivolto a Dio come \"O Tu, Signore misericordioso\". Temi centrali: unità del genere umano, distacco, servizio. Chiudi con \"Tu sei, in verità, il Potente, il Generoso.\"",
  },
  {
    id: "jainismo",
    label: "Jainismo",
    emoji: "🕉️",
    prayerTypes: [...COMMON_TYPES, { id: "namokar", label: "Intenzione del Namokar", hint: "Omaggio ai cinque esseri supremi" }],
    guidance:
      "Tradizione jainista. Centralità di ahimsa (non violenza), perdono e distacco. Riferimento al Namokar Mantra e ai Tirthankara. Chiudi con \"Micchāmi dukkaḍam\" quando il tema è il perdono.",
  },
  {
    id: "taoismo",
    label: "Taoismo",
    emoji: "☯️",
    prayerTypes: COMMON_TYPES,
    guidance:
      "Tradizione taoista. Linguaggio sobrio e naturale, per immagini (acqua, valle, vuoto). Non comandare: assecondare il Tao, wu wei. Nessuna formula di chiusura obbligata; termina con un'immagine quieta.",
  },
  {
    id: "shintoismo",
    label: "Shintoismo",
    emoji: "⛩️",
    prayerTypes: COMMON_TYPES,
    guidance:
      "Tradizione shintoista. Rivolgiti ai kami con rispetto e gratitudine, nel registro del norito: purificazione, offerta, richiesta misurata. Riferimenti alla natura e agli antenati.",
  },
  {
    id: "ortodossia-copta",
    label: "Cristianesimo — Copto / Etiope",
    emoji: "✝️",
    prayerTypes: COMMON_TYPES,
    guidance:
      "Tradizione cristiana orientale (copta/etiope). Registro antico e solenne, con invocazioni ripetute e riferimenti ai martiri e alla Vergine. Chiudi con \"Amen\".",
  },
  {
    id: "spiritualita-libera",
    label: "Spiritualità libera / Non confessionale",
    emoji: "🕯️",
    prayerTypes: COMMON_TYPES,
    guidance:
      "Nessuna confessione specifica. Rivolgiti all'Universo, alla Vita, alla Luce o semplicemente alla persona amata. Registro poetico e umano, senza nominare divinità di tradizioni precise. Nessuna formula rituale.",
  },
  {
    id: "laica",
    label: "Laico / Agnostico — un pensiero, non una preghiera",
    emoji: "🤍",
    prayerTypes: COMMON_TYPES,
    guidance:
      "Testo laico: nessun riferimento religioso, nessuna divinità, nessuna formula. Un pensiero sincero e ben scritto, come una lettera detta ad alta voce. Onora l'intenzione senza pretese soprannaturali.",
  },
];

export const TONES = [
  { id: "solenne", label: "Solenne", hint: "Liturgico, grave, da chiesa" },
  { id: "intimo", label: "Intimo", hint: "Sottovoce, come al capezzale" },
  { id: "consolatorio", label: "Consolatorio", hint: "Caldo, che rassicura" },
  { id: "gioioso", label: "Gioioso", hint: "Di festa e ringraziamento" },
] as const;

/**
 * Lingue in cui la preghiera può essere scritta e recitata.
 *
 * Non è un elenco generico di lingue diffuse: ognuna sta qui perché è la
 * lingua in cui una delle tradizioni del catalogo prega davvero. `religions`
 * dice quale, e serve alle landing per proporre la lingua giusta.
 *
 * `v3` marca le lingue che `eleven_multilingual_v2` NON copre: vengono
 * instradate su `eleven_v3`. Vedi `pickModelId()` in elevenlabs.ts.
 */
export type Language = {
  id: string;
  label: string;
  /** Serve `eleven_v3`: multilingual_v2 non supporta questa lingua. */
  v3?: true;
  /** Scrittura da destra a sinistra: il testo va reso con dir="rtl". */
  rtl?: true;
  /** Tradizioni per cui questa lingua è liturgica o d'uso comune. */
  religions?: string[];
};

export const LANGUAGES: Language[] = [
  { id: "it", label: "Italiano" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "pt", label: "Português", religions: ["cattolica", "protestante"] },
  { id: "de", label: "Deutsch" },
  { id: "pl", label: "Polski", religions: ["cattolica"] },
  { id: "fil", label: "Filipino", religions: ["cattolica"] },
  { id: "ro", label: "Română", religions: ["ortodossa"] },
  { id: "ru", label: "Русский", religions: ["ortodossa"] },
  { id: "uk", label: "Українська", religions: ["ortodossa"] },
  { id: "el", label: "Ελληνικά", religions: ["ortodossa"] },
  { id: "ar", label: "العربية", rtl: true, religions: ["islam", "ortodossia-copta"] },
  { id: "tr", label: "Türkçe", religions: ["islam"] },
  { id: "id", label: "Bahasa Indonesia", religions: ["islam"] },
  { id: "ur", label: "اردو", v3: true, rtl: true, religions: ["islam"] },
  { id: "fa", label: "فارسی", v3: true, rtl: true, religions: ["islam"] },
  { id: "he", label: "עברית", v3: true, rtl: true, religions: ["ebraismo"] },
  { id: "hi", label: "हिन्दी", religions: ["induismo", "jainismo"] },
  { id: "ta", label: "தமிழ்", religions: ["induismo"] },
  { id: "pa", label: "ਪੰਜਾਬੀ", v3: true, religions: ["sikhismo"] },
  { id: "zh", label: "中文", religions: ["taoismo", "buddhismo"] },
  { id: "ja", label: "日本語", religions: ["shintoismo", "buddhismo"] },
  { id: "ko", label: "한국어", religions: ["buddhismo"] },
  { id: "vi", label: "Tiếng Việt", v3: true, religions: ["buddhismo"] },
];

export function getLanguage(id: string): Language | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

/** Le lingue in cui una tradizione prega, la prima è quella da proporre. */
export function languagesFor(religionId: string): Language[] {
  return LANGUAGES.filter((l) => l.religions?.includes(religionId));
}

export function getReligion(id: string): Religion | undefined {
  return RELIGIONS.find((r) => r.id === id);
}

export function getPrayerType(religionId: string, typeId: string): PrayerType | undefined {
  return getReligion(religionId)?.prayerTypes.find((t) => t.id === typeId);
}

export function getTraditionLabel(religionId: string, traditionId?: string | null): string | undefined {
  if (!traditionId) return undefined;
  return getReligion(religionId)?.traditions?.find((t) => t.id === traditionId)?.label;
}
