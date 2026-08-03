/**
 * Catalog domain types — the read model the storefront renders.
 *
 * These mirror BUILD-PLAN §4 (Artist, Artwork) so the fixture layer today and
 * the Medusa/Mercur + Sanity layer later expose the *same* shape. Localised
 * fields carry both languages; the page picks one by locale.
 *
 * Money is integer agorot (§5.5) — never a float. Format at the edge only.
 */
import type { Locale } from "@/i18n/routing";

/** A string that exists per-locale. */
export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type Discipline =
  | "ceramics"
  | "jewelry"
  | "painting"
  | "sculpture"
  | "wood"
  | "textile"
  | "judaica";

/**
 * inventoryKind drives availability everywhere (§4.2).
 *  UNIQUE          — quantity fixed at 1, reservation-protected (§5.3)
 *  LIMITED_EDITION — numbered, editionSize known
 *  MADE_TO_ORDER   — no stock, requires leadTimeDays
 */
export type InventoryKind = "UNIQUE" | "LIMITED_EDITION" | "MADE_TO_ORDER";

/** Publishing/availability status shown to the shopper. */
export type ArtworkAvailability =
  | "available"
  | "reserved" // in someone else's cart (§5.3) — honest wording, never "sold"
  | "sold";

/** Flat-rate shipping size band (§8). */
export type ShippingSizeBand = "SMALL" | "MEDIUM" | "LARGE" | "OVERSIZE_QUOTE";

export type ArtworkImage = {
  /** Cloudinary public id (the loader builds the URL); null → placeholder. */
  publicId: string | null;
  /** Aspect ratio (width / height) so the grid preserves the true proportion (§3.4). */
  aspectRatio: number;
  /** Role of the shot — drives the a11y alt suffix. */
  role: "primary" | "detail" | "scale" | "signature" | "verso" | "edge";
  /** Short descriptor for alt text, per locale. */
  caption: Localized;
};

export type Artist = {
  slug: string;
  displayName: Localized; // may contain Latin — wrap in <bdi> when rendering
  location: Localized; // city, for "made in" signals
  bio: Localized;
  portraitPublicId: string | null;
};

export type Dimensions = {
  heightCm: number;
  widthCm: number;
  depthCm?: number;
  weightGrams?: number;
};

export type Artwork = {
  slug: string;
  title: Localized;
  story: Localized; // the making-of narrative — this sells the piece
  materials: LocalizedList;
  discipline: Discipline;
  category: Localized; // human-facing category label (e.g. "קרמיקה")

  inventoryKind: InventoryKind;
  availability: ArtworkAvailability;
  editionSize?: number; // LIMITED_EDITION
  editionNumber?: number; // LIMITED_EDITION — which one this is
  leadTimeDays?: number; // MADE_TO_ORDER

  dimensions: Dimensions;

  /** Displayed price, VAT-inclusive (18%), in integer agorot (§5.5). */
  priceAgorot: number;

  shippingSizeBand: ShippingSizeBand;
  isFragile: boolean;

  images: ArtworkImage[];

  artist: Artist;
};
