# BOBY — developer setup & handoff

Everything a new developer (or AI agent) needs to get this project running and
continue it. If you read nothing else, read this file, then `CLAUDE.md`.

## What this is

A Hebrew-first, bilingual (he/en) online gallery + marketplace for Israeli
handmade art, built with **Next.js 16 + next-intl + Tailwind v4**. The
storefront lives in **`apps/storefront/`**. Phase 1 (the read-only, browsable
catalogue) is complete and deployed; commerce is Phase 2.

**Read in this order:**
1. `SETUP.md` (this file) — get it running
2. `CLAUDE.md` — the enforced engineering rules (RTL, accessibility, money, images). **Non-negotiable.**
3. `BUILD-PLAN.md` — the full build spec, data model, phases
4. `DECISIONS.md` — locked business/product decisions (wins every conflict)
5. `docs/phase-1-status.md` — what's built, what's demo vs real, what's next

## Prerequisites

- **Node.js 20 or newer** (22 recommended)
- **pnpm** — the project's package manager (`corepack enable`, or `npm i -g pnpm`)
- **git**
- *Optional, Phase 2 only:* **Docker** (for the Medusa/Mercur commerce stack) and **Bun** (only used by the throwaway spike in `spikes/`). Not needed for the Phase 1 storefront.

## Get the code

```bash
git clone https://github.com/amirbaram/boby.git
cd boby
```

(The repo is private — you need to be added as a collaborator first. See the owner.)

## Run it locally

```bash
cd apps/storefront
pnpm install
pnpm dev          # http://localhost:3000
```

No database or external service is required for Phase 1 — the catalogue is
served from typed fixtures in `src/lib/catalog/data.ts`, and images are local
placeholders in `public/mock/`. It runs out of the box.

## Environment variables (optional for local dev)

Copy the template and adjust if needed:

```bash
cp .env.example .env.local
```

| Variable | What it does | Default |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud for real photos (mocks don't need it) | `demo` |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for SEO/sitemap/canonicals | `https://boby.co.il` |

Both have safe defaults, so the app runs with no `.env.local` at all. Set
`NEXT_PUBLIC_SITE_URL` to the deploy URL on hosted environments.

## The quality gate — run after every change

```bash
pnpm run check    # typecheck + lint + logical-CSS-property check (enforces RTL)
pnpm run build    # full production build
```

`pnpm run check` must pass before committing. The logical-property check fails
the build if physical CSS (`left`/`right`/`ml-`/`pr-`…) sneaks in — RTL
correctness is a hard requirement (`CLAUDE.md` §5.2).

## Deploy

Hosted on **Vercel** (monorepo → set **Root Directory = `apps/storefront`**).
Full steps, including the two env vars, are in `docs/phase-1-status.md` §6.
`vercel.json` (framework + security headers) is already in `apps/storefront/`.

## Repo map

```
apps/storefront/     the Next.js storefront (all the site code)
  src/app/[locale]/(storefront)/   pages: home, works, works/[slug], artists/[slug], business
  src/components/    ui/, layout/, catalog/, artwork/, media/, seo/
  src/lib/catalog/   the data layer (fixtures today; swap for Medusa/Sanity later)
  src/i18n/          next-intl routing/config
  messages/          he.json / en.json (all copy)
  public/mock/       placeholder artwork images (replace before launch)
spikes/              throwaway integration proofs (order split, reservation race)
docs/                status, stage plan, design brief, token diff
CLAUDE.md BUILD-PLAN.md DECISIONS.md   the source-of-truth docs
```

## Working with an AI coding agent

The docs are written so any capable agent can continue the work:

- **Claude Code** auto-reads `CLAUDE.md` each session. Just say which phase/task you're on.
- **Other agents** (Gemini CLI, Cursor, Aider, …): start each session with *"Read CLAUDE.md and BUILD-PLAN.md before doing anything."* (Gemini CLI reads `GEMINI.md` by default, so either copy `CLAUDE.md` → `GEMINI.md` or point it at the file.)
- Work **one phase at a time**; each phase has an acceptance test in `BUILD-PLAN.md` §5. Don't let it revisit the locked decisions in `CLAUDE.md` §2 / `DECISIONS.md`.

## What's next

See `docs/phase-1-status.md` — the current state, the demo-vs-real swap list,
and the Phase 2 (cart → checkout → PayPlus → invoicing) plan.
```
