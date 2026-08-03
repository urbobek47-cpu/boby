# BOBY — agent instructions

For any AI coding agent (Antigravity, Cursor, Aider, Copilot, etc.) working on
this repo.

**Before doing anything, read these in order:**

1. `SETUP.md` — install & run (Node 20+, pnpm; `cd apps/storefront && pnpm install && pnpm dev`)
2. `CLAUDE.md` — the enforced engineering rules (**authoritative, non-negotiable**)
3. `GEMINI.md` — a condensed agent brief of those rules + how to work
4. `BUILD-PLAN.md` — the full spec and phased plan (each phase has an acceptance test)
5. `DECISIONS.md` — locked business decisions (wins every conflict)
6. `docs/phase-1-status.md` — current state, demo-vs-real, what's next

**The rules that must never be broken** (full text in `CLAUDE.md` §5, summarised
in `GEMINI.md`): Hebrew-first RTL with logical CSS only (no `left`/`right`);
bidi-safe prices/dimensions/Latin names; WCAG 2.0 AA; money in integer agorot,
VAT-inclusive display; qty=1 reservation protection; the image and pricing
rules; and the locked tech/business decisions (Medusa+Mercur, Cloudinary,
PayPlus, Green Invoice, next-intl, merchant-of-record — Stripe/Shopify/Wix are
rejected).

**Workflow:** one phase at a time; run `pnpm run check` after every change (it
must pass before committing); discuss non-trivial changes before implementing;
don't revisit the locked decisions.
