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

export const checkoutSchema = z.object({
  // Validato contro il catalogo in `pricing.ts`, che è pilotato dalle env.
  productId: z.string().min(1, "Prodotto mancante"),
  draft: prayerDraftSchema.optional(),
  email: z.string().email().optional(),
});

/** Messaggio d'errore leggibile a partire da un ZodError. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dati non validi";
}
