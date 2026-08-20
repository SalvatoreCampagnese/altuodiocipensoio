import { z } from "zod";
import { getPrayerType, getReligion, LANGUAGES, TONES } from "./religions";

export const prayerDraftSchema = z
  .object({
    religion: z.string().min(1, "Scegli una religione"),
    tradition: z.string().optional().nullable(),
    prayer_type: z.string().min(1, "Scegli il tipo di preghiera"),
    intention: z
      .string()
      .trim()
      .min(10, "Scrivi almeno una frase: è il cuore della preghiera")
      .max(1500, "Massimo 1500 caratteri"),
    recipient_name: z.string().trim().max(80).optional().nullable(),
    language: z.enum(LANGUAGES.map((l) => l.id) as [string, ...string[]]).default("it"),
    tone: z.enum(TONES.map((t) => t.id) as [string, ...string[]]).default("solenne"),
    scheduled_for: z.string().datetime().optional().nullable(),
    email: z.string().email("Email non valida"),
  })
  .superRefine((val, ctx) => {
    const religion = getReligion(val.religion);
    if (!religion) {
      ctx.addIssue({ code: "custom", path: ["religion"], message: "Religione sconosciuta" });
      return;
    }
    if (!getPrayerType(val.religion, val.prayer_type)) {
      ctx.addIssue({
        code: "custom",
        path: ["prayer_type"],
        message: "Tipo di preghiera non valido per questa tradizione",
      });
    }
    if (val.tradition && !religion.traditions?.some((t) => t.id === val.tradition)) {
      ctx.addIssue({ code: "custom", path: ["tradition"], message: "Ramo non valido" });
    }
  });

export type PrayerDraftInput = z.infer<typeof prayerDraftSchema>;

export const lucernarioSchema = z.object({
  slot: z.number().int().positive("Scegli una candela"),
  amountCents: z.number().int().positive("Indica quanto vuoi spendere"),
  donorName: z.string().trim().max(60).optional().nullable(),
  intention: z.string().trim().max(280).optional().nullable(),
  religion: z.string().trim().max(60).optional().nullable(),
  email: z.string().email("Email non valida"),
});

/**
 * Consensi raccolti al momento dell'acquisto.
 *
 * `literal(true)` e non `boolean()`: un consenso che può valere false non è un
 * consenso, è un campo. Se manca, la richiesta va rifiutata dal server e non
 * solo nascosta dall'interfaccia — la spunta lato client la si aggira con due
 * clic negli strumenti per sviluppatori.
 */
/**
 * `refine` e non `z.literal(true, {...})`: su questa versione di zod il
 * messaggio personalizzato di `literal` viene ignorato, e l'utente si
 * ritroverebbe un "Invalid literal value, expected true" in inglese.
 */
const mustAgree = (message: string) =>
  z.boolean({ required_error: message, invalid_type_error: message }).refine((v) => v === true, {
    message,
  });

export const consentSchema = z.object(
  {
    specialData: mustAgree(
      "Serve il tuo consenso esplicito per trattare i dati religiosi e di salute"
    ),
    terms: mustAgree("Devi accettare i termini e l'informativa privacy"),
    thirdParty: mustAgree(
      "Devi dichiarare di avere titolo per i dati di altre persone che inserisci"
    ),
    immediate: mustAgree(
      "Serve la tua richiesta di esecuzione immediata per consegnarti subito la preghiera"
    ),
  },
  { required_error: "Mancano le dichiarazioni obbligatorie per procedere" }
);

export type ConsentInput = z.infer<typeof consentSchema>;

export const checkoutSchema = z.object({
  // Validato contro il catalogo in `pricing.ts`, che è pilotato dalle env.
  productId: z.string().min(1, "Prodotto mancante"),
  draft: prayerDraftSchema.optional(),
  email: z.string().email().optional(),
  consent: consentSchema,
});

/** Messaggio d'errore leggibile a partire da un ZodError. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dati non validi";
}

/**
 * Consensi per l'abbonamento alla Preghiera del Giorno.
 *
 * Tre spunte e non quattro: qui l'utente non inserisce dati di altre persone
 * — non c'è un malato da nominare né un defunto — quindi la dichiarazione sui
 * dati di terzi non ha oggetto e chiederla sarebbe una spunta finta.
 *
 * `specialData` resta invece necessaria, e per un motivo che non è ovvio:
 * anche senza scrivere una riga, abbonarsi a una preghiera quotidiana di una
 * tradizione precisa rivela una convinzione religiosa. È il dato dell'art. 9
 * per eccellenza, e lo raccogliamo dal solo fatto dell'iscrizione.
 */
export const subscriptionConsentSchema = z.object(
  {
    specialData: mustAgree(
      "Serve il tuo consenso esplicito: l'abbonamento rivela una convinzione religiosa"
    ),
    terms: mustAgree("Devi accettare i termini e l'informativa privacy"),
    immediate: mustAgree(
      "Serve la tua richiesta di esecuzione immediata per farti cominciare subito"
    ),
  },
  { required_error: "Mancano le dichiarazioni obbligatorie per procedere" }
);

export type SubscriptionConsentInput = z.infer<typeof subscriptionConsentSchema>;

export const subscribeSchema = z.object({
  email: z.string().email("Email non valida"),
  consent: subscriptionConsentSchema,
  /** Da quale pagina è partita l'iscrizione, per l'attribuzione. */
  from: z.string().trim().max(80).optional(),
});
