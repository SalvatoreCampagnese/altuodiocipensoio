import { ARCHIVE } from "./texts";
import { TAGS, getTag } from "./tags";
import type { ArchivePrayer, ArchiveTag } from "./types";

export type { ArchivePrayer, ArchiveTag } from "./types";
export { TAGS, getTag } from "./tags";

export const ARCHIVE_BASE = "/preghiere-tradizionali";

export function archivePath(slug: string): string {
  return `${ARCHIVE_BASE}/${slug}`;
}

export function archiveTagPath(slug: string): string {
  return `${ARCHIVE_BASE}/per/${slug}`;
}

/**
 * Il solo accesso al corpus in tutta l'applicazione.
 *
 * Filtra le voci non verificate: è il punto unico in cui si decide che cosa
 * il mondo può leggere, e per questo nessuna pagina deve mai importare
 * `ARCHIVE` direttamente. Una voce senza testo controllato non esiste.
 */
export function listArchive(): ArchivePrayer[] {
  return ARCHIVE.filter((p) => p.status === "verificata" && p.text.trim().length > 0);
}

export function getArchivePrayer(slug: string): ArchivePrayer | undefined {
  return listArchive().find((p) => p.slug === slug);
}

export function archiveByTag(tagSlug: string): ArchivePrayer[] {
  return listArchive().filter((p) => p.tags.includes(tagSlug));
}

export function archiveByReligion(religionId: string): ArchivePrayer[] {
  return listArchive().filter((p) => p.religionId === religionId);
}

/** I soli tag che hanno almeno un testo: gli altri sarebbero pagine vuote. */
export function listTagsWithContent(): (ArchiveTag & { count: number })[] {
  return TAGS.map((t) => ({ ...t, count: archiveByTag(t.slug).length })).filter(
    (t) => t.count > 0
  );
}

/** I tag di un testo, risolti in oggetti e senza gli slug orfani. */
export function tagsOf(prayer: ArchivePrayer): ArchiveTag[] {
  return prayer.tags.map(getTag).filter((t): t is ArchiveTag => Boolean(t));
}

/**
 * Altre preghiere da leggere dopo questa.
 *
 * Prima quelle che condividono un tag — è il legame che il lettore capisce —
 * poi le altre della stessa tradizione, per non lasciare mai la pagina senza
 * un'uscita interna.
 */
export function relatedArchive(prayer: ArchivePrayer, limit = 4): ArchivePrayer[] {
  const others = listArchive().filter((p) => p.slug !== prayer.slug);
  const sameTag = others.filter((p) => p.tags.some((t) => prayer.tags.includes(t)));
  const sameReligion = others.filter(
    (p) => p.religionId === prayer.religionId && !sameTag.includes(p)
  );
  return [...sameTag, ...sameReligion].slice(0, limit);
}

/** Tutti gli URL dell'archivio, per la sitemap. */
export function allArchivePaths(): string[] {
  return [
    ARCHIVE_BASE,
    ...listArchive().map((p) => archivePath(p.slug)),
    ...listTagsWithContent().map((t) => archiveTagPath(t.slug)),
  ];
}

/**
 * Quanto lavoro di revisione resta.
 *
 * Serve al README e a chi tiene il progetto: senza un conteggio esplicito,
 * le voci `da-rivedere` diventano invisibili e non le rivede più nessuno.
 */
export function pendingReview(): ArchivePrayer[] {
  return ARCHIVE.filter((p) => p.status !== "verificata" || p.text.trim().length === 0);
}
