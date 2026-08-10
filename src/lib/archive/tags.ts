import type { ArchiveTag } from "./types";

/**
 * I tag sono situazioni della vita, non categorie teologiche.
 *
 * Nessuno cerca "orazioni mariane": si cerca "preghiera per un malato" alle
 * due di notte dal corridoio di un ospedale. Ogni tag è una di quelle notti,
 * e il suo `h1` è scritto con le parole con cui la gente la cerca davvero.
 */
export const TAGS: ArchiveTag[] = [
  {
    slug: "malattia",
    label: "Malattia",
    h1: "Preghiere per un malato",
    description:
      "Le preghiere della tradizione per chi è malato, per chi lo assiste e per chi aspetta fuori da una porta chiusa. Testo integrale e quando si dicono.",
    lede: "Si prega per un malato da quando esiste la preghiera, ed è forse la ragione per cui è stata inventata. Queste sono le formule che la tradizione ha lasciato per quelle ore.",
  },
  {
    slug: "lutto",
    label: "Lutto e defunti",
    h1: "Preghiere per un defunto",
    description:
      "Le preghiere per i morti e per chi resta: suffragio, memoria, accompagnamento. Testo integrale, origine e uso di ciascuna.",
    lede: "Il lutto toglie le parole per primo. La tradizione ne ha conservate alcune proprio per il momento in cui non se ne trovano.",
  },
  {
    slug: "paura",
    label: "Paura e angoscia",
    h1: "Preghiere per l'ansia e la paura",
    description:
      "Preghiere brevi della tradizione per i momenti di angoscia, insonnia e paura. Testi da ripetere, con la loro origine e il modo in cui si usano.",
    lede: "Nell'angoscia le preghiere lunghe non si reggono. Servono formule brevi, ripetibili, che stiano dentro un respiro corto: la tradizione ne è piena.",
  },
  {
    slug: "protezione",
    label: "Protezione",
    h1: "Preghiere di protezione",
    description:
      "Le preghiere con cui la tradizione chiede custodia e riparo per sé e per chi si ama. Testo integrale, origine e uso.",
    lede: "Chiedere protezione per qualcuno che non puoi proteggere tu è una delle forme più antiche della preghiera, e una delle poche cose che si possono fare a distanza.",
  },
  {
    slug: "perdono",
    label: "Perdono",
    h1: "Preghiere per chiedere perdono",
    description:
      "Le preghiere di pentimento e di perdono della tradizione cristiana. Testo integrale, contesto e quando si recitano.",
    lede: "Chiedere perdono è difficile anche quando si sa di doverlo fare. Queste formule esistono per dare una forma a ciò che non si riesce a formulare.",
  },
  {
    slug: "ringraziamento",
    label: "Ringraziamento",
    h1: "Preghiere di ringraziamento",
    description:
      "Le preghiere con cui la tradizione dice grazie: lode, benedizione, rendimento di grazie. Testi integrali e loro uso.",
    lede: "Si prega molto più spesso per chiedere che per ringraziare. La tradizione ha provato a correggere lo squilibrio con formule fatte apposta.",
  },
  {
    slug: "sera",
    label: "Sera e notte",
    h1: "Preghiere della sera",
    description:
      "Le preghiere della sera e della notte: affidamento, compieta, riposo. Testo integrale e quando si dicono.",
    lede: "La sera è l'ora in cui la preghiera torna anche a chi non prega mai. Sono formule brevi, pensate per essere dette da stanchi.",
  },
  {
    slug: "mattino",
    label: "Mattino",
    h1: "Preghiere del mattino",
    description:
      "Le preghiere con cui la tradizione apre la giornata: offerta, invocazione, benedizione del giorno. Testi integrali e uso.",
    lede: "Aprire la giornata con una formula fissa è un'abitudine antica: serve a non doverla inventare ogni mattina, quando si ha meno tempo e meno lucidità.",
  },
  {
    slug: "famiglia",
    label: "Famiglia e figli",
    h1: "Preghiere per la famiglia e per i figli",
    description:
      "Le preghiere della tradizione per i figli, i genitori e la casa. Testo integrale, origine e contesto d'uso.",
    lede: "Per le persone che si amano si prega più che per se stessi, e quasi sempre di nascosto. Queste sono le formule che la tradizione ha lasciato per farlo.",
  },
  {
    slug: "pace",
    label: "Pace e riconciliazione",
    h1: "Preghiere per la pace",
    description:
      "Le preghiere per la pace, la riconciliazione e la fine dei conflitti, personali e non. Testi integrali e loro origine.",
    lede: "Si prega per la pace quando non si ha nessun potere sulla guerra — la propria o quella degli altri. È il caso più frequente.",
  },
  {
    slug: "viaggio",
    label: "Viaggio e lontananza",
    h1: "Preghiere per chi parte e per chi è lontano",
    description:
      "Le preghiere della tradizione per il viaggio, la partenza e la distanza da casa. Testo integrale e uso.",
    lede: "Partire, restare lontani, aspettare che qualcuno arrivi: la preghiera del viaggiatore è antica quanto le strade.",
  },
  {
    slug: "lavoro",
    label: "Lavoro e prove",
    h1: "Preghiere per il lavoro e prima di una prova",
    description:
      "Le preghiere della tradizione prima di un esame, un colloquio, una decisione o un turno difficile. Testi brevi e loro uso.",
    lede: "Prima di un esame, di un colloquio, di un turno che si teme. Sono le preghiere che si dicono in piedi, in pochi secondi, senza farsi vedere.",
  },
];

export function getTag(slug: string): ArchiveTag | undefined {
  return TAGS.find((t) => t.slug === slug);
}
