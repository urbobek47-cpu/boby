import type { Locale } from "@/i18n/routing";
import type { Dimensions } from "@/lib/catalog/types";

/**
 * Formatting helpers with the bidi rules baked in (§5.2, §7.2).
 *
 * Money is stored as integer agorot (§5.5); format only at the edge. Art prices
 * are whole shekels, so we drop the agorot decimals for display. The returned
 * string is a bidi-neutral unit — always render it inside `dir="ltr"`.
 */
export function formatPrice(agorot: number, locale: Locale = "he"): string {
  const shekels = agorot / 100;
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(shekels);
}

/**
 * Dimensions as a single LTR unit, e.g. "120 × 90 ס״מ" / "120 × 90 cm".
 * Neutral characters (×, spaces) reorder wrongly in RTL context unless the
 * whole string is isolated as LTR (§5.2) — callers must wrap in dir="ltr".
 */
export function formatDimensions(d: Dimensions, locale: Locale = "he"): string {
  const unit = locale === "he" ? "ס״מ" : "cm";
  const parts = [d.heightCm, d.widthCm];
  if (typeof d.depthCm === "number") parts.push(d.depthCm);
  return `${parts.join(" × ")} ${unit}`;
}

/** Weight as an LTR unit, e.g. "1.2 ק״ג" / "1.2 kg". */
export function formatWeight(grams: number, locale: Locale = "he"): string {
  if (grams >= 1000) {
    const kg = (grams / 1000).toLocaleString(locale === "he" ? "he-IL" : "en-IL", {
      maximumFractionDigits: 1,
    });
    return `${kg} ${locale === "he" ? "ק״ג" : "kg"}`;
  }
  return `${grams} ${locale === "he" ? "גרם" : "g"}`;
}
