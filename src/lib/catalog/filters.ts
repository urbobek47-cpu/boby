/**
 * Catalogue filtering — pure functions over the artwork list, driven entirely
 * by URL query params so every filtered view is shareable and indexable
 * (BUILD-PLAN Phase 1 task 5). No client state.
 */
import type { Artwork, Discipline } from "./types";

export type SortKey = "newest" | "price-asc" | "price-desc";

export type FilterParams = {
  category?: Discipline;
  price?: string; // a PRICE_BANDS key
  artist?: string; // artist slug
  sort: SortKey;
};

/** Price bands in agorot. `max` null = open-ended. Keys match the messages. */
export const PRICE_BANDS: Array<{ key: string; min: number; max: number | null }> = [
  { key: "under-150", min: 0, max: 15000 },
  { key: "150-350", min: 15000, max: 35000 },
  { key: "350-600", min: 35000, max: 60000 },
  { key: "600-1500", min: 60000, max: 150000 },
  { key: "1500-plus", min: 150000, max: null },
];

const DISCIPLINES: Discipline[] = [
  "ceramics",
  "jewelry",
  "painting",
  "sculpture",
  "wood",
  "textile",
  "judaica",
];

const SORTS: SortKey[] = ["newest", "price-asc", "price-desc"];

/** Read one query value that may arrive as string | string[] | undefined. */
function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): FilterParams {
  const category = one(searchParams.category);
  const price = one(searchParams.price);
  const artist = one(searchParams.artist);
  const sort = one(searchParams.sort);

  return {
    category: DISCIPLINES.includes(category as Discipline)
      ? (category as Discipline)
      : undefined,
    price: PRICE_BANDS.some((b) => b.key === price) ? price : undefined,
    artist: artist || undefined,
    sort: SORTS.includes(sort as SortKey) ? (sort as SortKey) : "newest",
  };
}

/** Count of active facet filters (sort is not a filter). */
export function activeFilterCount(f: FilterParams): number {
  return [f.category, f.price, f.artist].filter(Boolean).length;
}

export function applyFilters(list: Artwork[], f: FilterParams): Artwork[] {
  let out = list;

  if (f.category) out = out.filter((a) => a.discipline === f.category);
  if (f.artist) out = out.filter((a) => a.artist.slug === f.artist);
  if (f.price) {
    const band = PRICE_BANDS.find((b) => b.key === f.price)!;
    out = out.filter(
      (a) =>
        a.priceAgorot >= band.min &&
        (band.max === null || a.priceAgorot < band.max),
    );
  }

  // A stable copy before sorting so "newest" preserves source order.
  out = [...out];
  if (f.sort === "price-asc") out.sort((a, b) => a.priceAgorot - b.priceAgorot);
  else if (f.sort === "price-desc") out.sort((a, b) => b.priceAgorot - a.priceAgorot);

  return out;
}

/** Facet options actually present in the data, in canonical order. */
export function categoryOptions(list: Artwork[]): Discipline[] {
  const present = new Set(list.map((a) => a.discipline));
  return DISCIPLINES.filter((d) => present.has(d));
}

export function artistOptions(
  list: Artwork[],
): Array<{ slug: string; name: { he: string; en: string } }> {
  const seen = new Map<string, { slug: string; name: { he: string; en: string } }>();
  for (const a of list) {
    if (!seen.has(a.artist.slug)) {
      seen.set(a.artist.slug, { slug: a.artist.slug, name: a.artist.displayName });
    }
  }
  return [...seen.values()];
}
