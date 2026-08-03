import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

/**
 * Canonical production origin. DECISIONS §2 locks the domain as boby.co.il;
 * override per-environment with NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview).
 *
 * Normalised so it is always a valid absolute origin: a bare host like
 * "boby-seven.vercel.app" (how Vercel env vars are often pasted) gets https://
 * prepended, and any trailing slash is stripped. `new URL(SITE_URL)` (the
 * layout's metadataBase) then never throws.
 */
function normalizeOrigin(raw: string | undefined): string {
  const value = (raw ?? "").trim().replace(/\/+$/, "");
  if (!value) return "https://boby.co.il";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export const SITE_URL = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

/** Locale-prefixed path: Hebrew is unprefixed, English lives under /en. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "he") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/**
 * Self-canonical + reciprocal hreflang for a page, from its unprefixed path
 * (e.g. "/works/kaarat-adama"). Every language version points at the same
 * alternates set; `x-default` → Hebrew until an English store with checkout
 * launches (DECISIONS §2 #10). metadataBase (set in the root layout) turns
 * these relative URLs absolute.
 */
export function seoAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const he = localePath("he", path);
  const en = localePath("en", path);
  return {
    canonical: localePath(locale, path),
    languages: { "he-IL": he, en, "x-default": he },
  };
}
