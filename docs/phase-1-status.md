# BOBY — Phase 1 status

**Phase 1 (read-only catalogue & gallery) is complete.** This document is the handoff: what was built, what is demo/placeholder vs. real, what is deferred and on whom, how to run and deploy it, and the exact steps to turn it into a launchable store.

Branch: `master`. All work is committed. The app lives in `apps/storefront/` (Next.js 16 + next-intl + Tailwind v4).

---

## 1. What was built

| Area | Delivered |
|---|---|
| **Foundation** (Phase 0) | Next.js 16 App Router, TypeScript, Tailwind v4. `next-intl`: Hebrew default (unprefixed), English at `/en`. Per-locale `<html lang dir>`. Self-hosting Assistant + Frank Ruhl Libre. Design tokens as `@theme`. |
| **Design system** (Phase 0.5) | Warm palette adopted from the approved mockup (Ur's override, `DECISIONS.md` §3). A living **style guide** at `/style-guide` rendering the real reusable components: `Button`, `StatusBadge`, `Field`. |
| **Home** `/` | Split hero, trust row, intent nav (DECISIONS §3), new arrivals, featured artist, the corporate panel on the warm `--deep` surface, newsletter. Shared header + footer chrome. |
| **Catalogue** `/works` | Grid (1/2/3 cols, never 4), **server-side filtering via URL params** (category / price band / artist / sort) — shareable and indexable, no client JS. Empty state. |
| **Artwork** `/works/[slug]` | The flagship page. Sticky purchase panel (status, VAT-inclusive price, dimensions, materials, delivery, returns, colour note), image gallery, story, scale, artist. All availability edge states (unique / edition / made-to-order / reserved / sold). |
| **Artist** `/artists/[slug]` | Portrait, story, their works. Artist names are real links site-wide. |
| **Corporate gifts** `/business` | Flagship revenue surface (DECISIONS §11): operational promise, 3 budget packages (₪300/₪450/₪550), the terms band (40% deposit, lead time, one invoice — stated up front), 4-step process, lead form with sample-box request. |
| **Images** | Cloudinary via a `next/image` custom loader (§3, §5.4): 2400px long-edge cap, WebP for detail + AVIF for grids, `dpr_auto`, IPTC metadata kept on the detail derivative. Graceful placeholder fallback. |
| **SEO** | `metadataBase`, per-page self-canonicals (locale-aware), reciprocal `hreflang` (he-IL / en / x-default → Hebrew), `sitemap.xml`, `robots.txt`, JSON-LD (Organization, VisualArtwork, Offer, BreadcrumbList). Filtered catalogue views canonicalize to `/works`. |

**Data model** (`src/lib/catalog/`) is typed to `BUILD-PLAN.md` §4 (Artist, Artwork, `inventoryKind`, money in integer agorot). The read functions are already `async`, so swapping the fixtures for Medusa/Mercur + Sanity is a drop-in — **the page code does not change**.

**The `npm run check` gate** (`pnpm run check`) runs on every change: typecheck + lint + a physical-CSS-property grep (enforces RTL logical properties, §5.2).

---

## 2. Architecture bets — confirmed by spikes

| Spike | Verdict | Notes |
|---|---|---|
| **3 — multi-artist order split** (Medusa v2 + Mercur) | ✅ **Adopt.** No fallback. | `completeCartWithSplitOrdersWorkflow` → order group + per-seller orders = BOBY's §4.3. Per-seller `CommissionLine` ledger is **decoupled from Stripe** (unusable in Israel) — we take split + commission, skip Mercur's Stripe payout. Live stack stood up (Docker Postgres+Redis, seeded 3-seller marketplace). See `spikes/spike-3-order-split/FINDINGS.md`. |
| **4 — qty=1 reservation race** | ✅ **PASS**, 5/5. | Atomic reservation via a partial unique index + `ON CONFLICT DO NOTHING`. The naive check-then-insert double-books 5/5; the atomic path blocks the second every time. The race harness becomes a permanent Phase 2 regression test (§5.3). See `spikes/spike-4-reservation-race/FINDINGS.md`. |

Spikes 1 (PayPlus) and 2 (Green Invoice) are **not run** — they need merchant/sandbox credentials (see §5).

---

## 3. Demo / placeholder vs. real ⚠️

Everything below is wiring-complete but backed by placeholders. Nothing here is a code gap — it is content and accounts that are Ur's to provide.

| Thing | Currently | Real version |
|---|---|---|
| **Product images** | Cloudinary **`demo`** cloud (food/stock photos, clearly not BOBY's art) | BOBY's Cloudinary account + real artist/artwork photos; set public ids in the data |
| **Catalogue data** | Typed fixtures in `src/lib/catalog/data.ts` (6 works, 3 artists) | Medusa/Mercur (commerce) + Sanity (stories) — drop-in behind the same async functions |
| **Cart button** | Inert, with an honest "cart opens soon" note | Phase 2 (built on Spike 4's reservation) |
| **Newsletter + corporate lead form** | Accessible UI, submit inert, honest note | Needs an endpoint (email/CRM) |
| **Site origin** | Defaults to `https://boby.co.il` (`NEXT_PUBLIC_SITE_URL`) | The real deployed URL (see §6) |

---

## 4. Verification status

Verified in-browser across the session (not a formal audit):

- Hebrew RTL / English LTR on every page; correct `lang`/`dir`.
- **Zero horizontal overflow at 375px and 1280px** on every page.
- Bidi: prices, dimensions and Latin names render correctly (dimensions confirmed LTR by computed direction).
- Single `<h1>` per page; labelled form controls; visible focus; alt text; contrast pairings pass AA (computed).
- All routes prerender (home/artwork/artist/business/style-guide static; catalogue dynamic for filtering); no console errors; check gate clean.

**Not yet done** (Phase 4 — Compliance, deliberately):
- A formal **axe DevTools** run and the `מורשה נגישות` accessibility audit.
- The "show it to three strangers — do they get it in 5 seconds?" human test.
- Screen-reader and keyboard-only walkthroughs.

---

## 5. Deferred / blocked — and on whom

| Item | Owner | Notes |
|---|---|---|
| PayPlus merchant account + sandbox (Spike 1) | **Ur** | 2–3 weeks calendar time — start early |
| Green Invoice sandbox (Spike 2) | **Ur** | Allocation-number flow |
| Four VAT questions to the accountant | **Ur** | `DECISIONS.md` §4 — pricing model depends on the answers |
| Cloudinary account + real photos | **Ur** | Also set an upload preset that converts to sRGB (§5.4) |
| Domain `boby.co.il` + `.com` + trademark | **Ur** | `DECISIONS.md` §6 |
| Lead-form / newsletter endpoint | Dev (Phase later) | Where the form posts |
| Cart + checkout, PayPlus, invoicing | Dev (Phase 2) | Built on Spikes 3 & 4 |

**Business gates still apply.** The stage plan (`docs/stage-plan-he.md`) scheduled dev for October, *after* Gate 0 (15 signed artists) and Gate 1 (real concierge sales). This build is ahead of those gates — it is the dev artifact; the business milestones are unchanged.

---

## 6. How to run and deploy

### Run locally

```bash
cd apps/storefront
pnpm install
pnpm dev          # http://localhost:3000 (or the port you pass)
pnpm run check    # the quality gate: typecheck + lint + logical-props
pnpm run build    # production build
```

No database is required for Phase 1 — the catalogue is fixture-backed.

### Put it online (Vercel — the §3 host)

The app has **no backend dependency yet**, so it deploys as a plain Next.js app. Two paths:

**A. Vercel CLI — fastest, no GitHub needed**

```bash
cd apps/storefront
npx vercel            # first run: log in, link a project; gives a preview URL
npx vercel --prod     # promote to production
```

**B. Git + Vercel dashboard**

1. Push this repo to GitHub/GitLab (it is local-only right now).
2. In Vercel → **Import Project**, and set **Root Directory = `apps/storefront`** (this is a monorepo; Vercel must build that subfolder). Framework auto-detects as Next.js.
3. Deploy.

**Environment variables to set in Vercel** (Project → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | the deploy URL (e.g. the Vercel preview URL, later `https://boby.co.il`) — keeps canonicals/sitemap pointing at the right origin |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `demo` for now, or BOBY's cloud name once created |

That is all Phase 1 needs. Both are documented in `apps/storefront/.env.example`.

---

## 7. Swap-in checklist — from demo to real store

1. **Cloudinary**: create BOBY's account → set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` → upload photos → replace the demo public ids in `src/lib/catalog/data.ts`. (Add an sRGB upload preset, §5.4.)
2. **Domain**: buy `boby.co.il`, point it at Vercel, set `NEXT_PUBLIC_SITE_URL=https://boby.co.il`.
3. **Real catalogue**: stand up Medusa/Mercur + Sanity and replace the functions in `src/lib/catalog/data.ts` with real fetches — same return types, no page changes. (The Spike 3 stack is a starting point.)
4. **Lead/newsletter**: wire the two forms to an endpoint.

---

## 8. What's next

Phase 2 — Commerce: cart with the qty=1 reservation (Spike 4), checkout, PayPlus (read the real sandbox docs in-session — never from memory), Green Invoice, order emails. Then Phase 3 Operations, Phase 4 Compliance (the accessibility audit lives here), Phase 5 Launch. See `BUILD-PLAN.md` §5 and `docs/stage-plan-he.md`.

## 9. Local infra note

The Spike 3 stack is still running: Docker `boby-spike-pg` + `boby-spike-redis`, and the generated Medusa app under `spikes/spike-3-order-split/marketplace/` (gitignored). Tear it down with `docker compose down -v` in `spikes/spike-3-order-split/` when not needed.
