import localFont from "next/font/local";

/**
 * Fonts for BOBY (CLAUDE.md §3.2).
 *
 * Local .woff2 font binaries for Assistant and Frank Ruhl Libre stored in
 * public/fonts/ under version control (BUILD-PLAN Phase 0 task 4).
 * Eliminates build-time external Google Fonts fetch dependencies.
 */

export const assistant = localFont({
  src: [
    {
      path: "../public/fonts/assistant-1.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../public/fonts/assistant-2.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../public/fonts/assistant-3.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-assistant",
  display: "swap",
});

export const frankRuhlLibre = localFont({
  src: [
    {
      path: "../public/fonts/frank-ruhl-libre-1.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "../public/fonts/frank-ruhl-libre-2.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "../public/fonts/frank-ruhl-libre-3.woff2",
      weight: "400 600",
      style: "normal",
    },
  ],
  variable: "--font-frank",
  display: "swap",
});

/** Combined className for the two font CSS variables, applied on <body>. */
export const fontVariables = `${assistant.variable} ${frankRuhlLibre.variable}`;
