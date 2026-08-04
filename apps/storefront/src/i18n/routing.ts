import { defineRouting } from "next-intl/routing";

/**
 * Locale routing for BOBY.
 *
 * CLAUDE.md §2 (locked): Hebrew is the default locale, served unprefixed at
 * `/`. English lives at `/en`. `localePrefix: "as-needed"` gives the default
 * locale no prefix and prefixes every other locale.
 *
 * DECISIONS.md §2 #10 + BUILD-PLAN §1: English is a thin marketing layer with
 * no checkout in v1. `x-default` points to Hebrew until an English store
 * launches (2029) — implemented in the layout's alternates, not here.
 */
export const routing = defineRouting({
  locales: ["he", "en"],
  defaultLocale: "he",
  localePrefix: "never",
  // Hebrew-first: `/` always serves Hebrew and `/en` is an explicit opt-in.
  // We deliberately do NOT auto-redirect by the browser's Accept-Language —
  // that would send Israeli visitors with an English browser to the checkout-
  // less English layer. Matches DECISIONS §2 #10 (x-default -> Hebrew).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/** Text direction per locale. Hebrew is RTL; English is LTR. */
export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  he: "rtl",
  en: "ltr",
};
