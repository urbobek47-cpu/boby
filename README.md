# BOBY

Curated Hebrew-first online gallery and marketplace for Israeli handmade art and craft.
BOBY is the merchant of record: buyers pay BOBY, BOBY issues the tax invoice, artists are paid as suppliers.

## Repository map

| Path | What it is |
|---|---|
| `CLAUDE.md` | Engineering constitution — loaded every session, enforced |
| `DECISIONS.md` | Locked business/product decisions. **Wins every conflict** |
| `BUILD-PLAN.md` | Full build spec v1.2 — phases, data model, integration notes |
| `docs/stage-plan-he.md` | Timeline and go/no-go gates (Hebrew) |
| `docs/design-brief-he.md` | Design brief v1.1 (Hebrew) |
| `design-reference/` | Approved visual mockups. **Reference only — never copied into the app** |
| `apps/storefront/` | Next.js 16 storefront (Phase 0) |
| `apps/medusa/` | Medusa v2 + Mercur commerce backend (Phase 1) |
| `spikes/` | Throwaway integration proofs (Phase 0.75). Never imported by the app |

## Current state

**Phase 1 — read-only catalogue & gallery: complete.** Home, catalogue,
artwork, artist and corporate-gifts pages, bilingual RTL, Cloudinary images,
and the full SEO/sitemap pass. Spikes 3 (order split) and 4 (reservation race)
passed. See **[docs/phase-1-status.md](docs/phase-1-status.md)** for the full
handoff — what's built, what's demo vs. real, how to deploy, and the swap-in
steps to go live.

## Build order

| Phase | What | Blocked by |
|---|---|---|
| 0 | Foundation — Next.js, next-intl, tokens, fonts, deploy | — |
| 0.5 | Design import from `design-reference/` | Phase 0 |
| 0.75 | Four integration spikes | Spikes 1–2 need PayPlus + Green Invoice credentials |
| 1 | Catalogue, gallery, corporate-gifts page | Spike 3 (order split) passing |
| 2 | Commerce — cart, reservations, PayPlus, invoicing | Phase 1 |
| 3 | Operations — admin, payout ledger, returns | Phase 2 |
| 4 | Compliance — accessibility audit, legal pages | Phase 3 |
| 5 | Launch | Phase 4 |

Spike 3 (multi-artist order split in Medusa/Mercur) is the architecture bet: if it fails, the hand-built
Postgres/Prisma fallback is decided **before** a catalogue exists on top of Medusa.

## Long-lead items — calendar time, not effort

These do not compress and must be started early:

- PayPlus merchant account approval — 2–3 weeks (Grow/Meshulam applied for in parallel as backup)
- Green Invoice sandbox account
- Accessibility audit by a מורשה נגישות — 1–2 weeks, ~₪8,000
- Lawyer review of terms and the artist agreement
- Accountant verification of real generated tax invoices, plus the four open VAT questions in `DECISIONS.md` §4
