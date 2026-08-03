# BOBY — agent brief (Gemini)

You are continuing an existing, well-documented project. This file is loaded
automatically by Gemini CLI. It is a condensed brief; the full rules live in
`CLAUDE.md` — treat that as authoritative.

## Step 1 — read these before writing any code

1. `SETUP.md` — how to install and run the project
2. `CLAUDE.md` — the enforced engineering rules (**authoritative, non-negotiable**)
3. `BUILD-PLAN.md` — the full build spec, data model, phased plan + acceptance tests
4. `DECISIONS.md` — locked business/product decisions (**wins every conflict**)
5. `docs/phase-1-status.md` — what's built, what's demo vs. real, what's next

## Step 2 — run it

Requires **Node 20+** and **pnpm**. No Docker/database needed for the current
site (Phase 1 is fixtures + local images). Docker is only for Phase 2 commerce.

```bash
cd apps/storefront
pnpm install
pnpm dev          # http://localhost:3000
pnpm run check    # typecheck + lint + RTL logical-property check — run after EVERY change
pnpm run build
```

`pnpm run check` must pass before you commit.

## What this is

A **Hebrew-first, bilingual (he/en), RTL** online gallery + marketplace for
Israeli handmade art. **Next.js 16 (App Router) + next-intl + Tailwind v4**, in
`apps/storefront/`. Phase 1 (read-only catalogue) is done and deployed; Phase 2
is commerce (cart → checkout → payments → invoicing).

## Non-negotiable rules (condensed — full text in CLAUDE.md §5)

- **RTL / logical CSS only.** Never `left`/`right`/`ml-`/`mr-`/`pl-`/`pr-`; use
  logical properties / Tailwind `ms- me- ps- pe- start- end-`. The build's
  `check:logical` step fails if physical properties appear. Hebrew is default
  (unprefixed); English lives under `/en`.
- **Bidi text.** Wrap prices, dimensions (`120 × 90 ס"מ`), phone/emails/SKUs in
  `dir="ltr"`; wrap unknown-direction/Latin strings (artist names) in `<bdi>`.
  Format money via `Intl.NumberFormat('he-IL', {style:'currency',currency:'ILS'})`.
- **Accessibility = WCAG 2.0 AA from line one** (legal requirement in Israel).
  Semantic HTML, real `<label>`s, visible focus, meaningful `alt`, verified
  contrast, no hover-only interactions. No accessibility-overlay widgets.
- **Money** is stored as **integer agorot**, never floats. Prices display
  **VAT-inclusive (18%)**, one number, including for business buyers.
- **Pricing model** (DECISIONS §4, pending accountant): price = artist net +
  BOBY markup + VAT — never "commission out of the artist's retail price".
- **Unique (qty=1) items are reservation-protected** — see CLAUDE.md §5.3; the
  atomic mechanism is proven in `spikes/spike-4-reservation-race/`.
- **Images** (CLAUDE.md §5.4): cap delivered resolution at 2400px long edge; no
  watermarks / no right-click blocking; AVIF for grids, high-q WebP for detail.
  Real photos go through Cloudinary; the current `public/mock/` images are
  concept placeholders to be replaced before a real launch.
- **No aggressive sales patterns** (no countdown timers, fake scarcity, popups,
  discount wheels). Calm, gallery-first.

## Locked decisions — do NOT revisit or swap (CLAUDE.md §2, DECISIONS.md)

Next.js + TypeScript · **Medusa v2 + Mercur** (commerce) · **Sanity** (editorial)
· **Cloudinary** (images) · **PayPlus** (payments — Stripe is unavailable in
Israel) · **Green Invoice** (tax invoices/allocation numbers) · **next-intl** ·
Tailwind v4 · BOBY is **merchant of record**. Rejected (refuse if suggested):
Shopify, Wix, Sharetribe, Stripe/Stripe Connect, accessibility-overlay widgets.

## Design system (CLAUDE.md §3)

Warm palette: bg `#ECEAE6`, surface `#FFFFFF`, sand `#EFE6DC`, deep `#2A211E`,
text `#111827`, muted `#4B5563`, terracotta accent `#C17F59` (decoration/large
only) / `#8A5335` (links, small text). Headings **Frank Ruhl Libre**, body
**Assistant**. Purchase buttons are near-black, not terracotta. Differentiated
corner radii (artwork 0–4px, cards 8, controls 10–12, panels 16, pills full).

## How to work

- **One phase at a time**, in order; each phase has an acceptance test in
  `BUILD-PLAN.md` §5. Don't start the next until the current passes.
- **Run `pnpm run check` after every change**; fix before committing.
- **Discuss non-trivial logic/schema/algorithm changes before implementing.**
- Do **not** revisit the locked decisions above — they were researched and the
  alternatives fail for Israel-specific reasons.
- For payments/tax code: read the real PayPlus / Green Invoice API docs
  in-session — never write integration code from memory.

## Repo map

```
apps/storefront/src/app/[locale]/(storefront)/   pages (home, works, works/[slug], artists/[slug], business)
apps/storefront/src/components/                  ui/ layout/ catalog/ artwork/ media/ seo/
apps/storefront/src/lib/catalog/                 data layer (fixtures now; Medusa/Sanity later)
apps/storefront/messages/                        he.json / en.json (all copy)
apps/storefront/public/mock/                     placeholder artwork images
spikes/                                          throwaway integration proofs
CLAUDE.md BUILD-PLAN.md DECISIONS.md SETUP.md     source-of-truth docs
```

## What's next

See `docs/phase-1-status.md`. In short: Phase 2 is cart + qty=1 reservation
(buildable now), then PayPlus + Green Invoice (need the owner's merchant
credentials). Real content (Cloudinary photos, real catalogue) and the domain
are the owner's to provide.
