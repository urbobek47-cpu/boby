# design-reference — READ ONLY

**Nothing in this folder is production code. Nothing in it is ever imported, copied or ported line-by-line.**

| Folder | What it is |
|---|---|
| `samples-source/` | The approved design samples as a standalone Next.js app — style guide, home, artwork page, corporate gifts. Run it, look at it, screenshot it |
| `static-preview/` | Static export of the same samples. Open `index.html` in a browser — no build needed |

## The four rules of design import (BUILD-PLAN §5, Phase 0.5)

1. **Mockups are reference, not source.** Render them, study them, then re-implement every component natively in Next.js + Tailwind with our tokens. Never copy their CSS or markup — mockup code carries physical properties, inline styles and non-semantic markup that CLAUDE.md §5 forbids.
2. **Tokens are extracted once, into the theme.** Read the style guide, extract every colour, size, spacing and radius, diff against `CLAUDE.md` §3, and flag mismatches to Ur before building. §3 wins unless Ur overrides explicitly.
3. **Every rebuilt screen passes the same gates** — logical-property grep, axe scan, contrast check, `<bdi>` / `dir="ltr"` wrapping. A beautiful mockup that fails AA gets corrected in the rebuild, and every deviation is listed so Ur can update the design thread.
4. **Visual parity is checked screen by screen**, at 390px and 1440px. Differences are either intentional (a11y/RTL fixes — documented) or bugs (fixed).

## Known gaps in these samples

They are a design demo, not an architecture reference:

- One `"use client"` page with all four screens behind a view switcher — not the real routing
- No i18n; all strings hardcoded Hebrew
- No `next-intl`, no `[locale]` segment, no `dir` switching
- Hand-written CSS in `globals.css` rather than the token/theme layer
- Placeholder grey rectangles instead of artwork images

Look at them for **layout, typography, hierarchy, commerce clarity and mobile behaviour.** Nothing else.

## Running them

```bash
cd design-reference/samples-source && npm install && npm run dev
```

Or just open `static-preview/index.html`.
