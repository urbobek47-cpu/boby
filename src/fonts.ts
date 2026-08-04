import { Assistant, Frank_Ruhl_Libre } from "next/font/google";

/**
 * Fonts for BOBY (CLAUDE.md §3.2).
 *
 * DEVIATION from BUILD-PLAN Phase 0 task 4, flagged to Ur:
 * The plan says `next/font/local`. We use `next/font/google`, which already
 * self-hosts — Next downloads the files at build time and serves them from our
 * own origin, with zero runtime requests to Google (the privacy + performance
 * intent behind "self-host"). It also handles per-subset loading. If Ur wants
 * true local .woff2 files under version control, swap to `next/font/local`;
 * the CSS-variable contract below does not change.
 *
 * Heebo / Noto Sans Hebrew are named as *fallbacks* in §3.2, not primaries.
 * We do not load them as separate webfonts — if Assistant loads, a fallback
 * webfont would never render, so loading one is pure weight. They live in the
 * CSS fallback stack in globals.css instead.
 *
 * Latin + Hebrew subsets are both loaded because the storefront is bilingual
 * (Hebrew default, English at /en) and Latin glyphs appear inside Hebrew pages
 * (artist names, prices, SKUs).
 */

export const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

export const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-frank",
  display: "swap",
});

/** Combined className for the two font CSS variables, applied on <body>. */
export const fontVariables = `${assistant.variable} ${frankRuhlLibre.variable}`;
