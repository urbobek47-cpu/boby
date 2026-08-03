# BOBY — Project Constitution

**This file is loaded automatically at the start of every session. It is the enforced rule set.**

Source of truth order — when two documents conflict, the higher one wins:

1. `DECISIONS.md` — locked business/product decisions (owner: Ur)
2. `CLAUDE.md` — this file (engineering constitution, extracted from BUILD-PLAN §2, §3, §6, §7)
3. `BUILD-PLAN.md` — full build spec v1.2
4. `docs/stage-plan-he.md` — timeline and go/no-go gates
5. `docs/design-brief-he.md` — design brief v1.1

If a proposal contradicts §2 (Locked decisions) or §5 (Non-negotiable rules) below, **refuse it and point back at this file.** Those sections exist because the alternatives were researched and rejected.

**Three things never done unsupervised by an agent:**

- **Payment integration** — verify every call against the real PayPlus sandbox; never write payment code from memory.
- **Tax invoice / allocation-number logic** — a legal problem, not a bug. The accountant reviews real generated invoices before launch.
- **Anything that moves money to artists** — build it, but the first three months of payouts are done by hand while we watch what the system *would* have done.

---

## 1. What we are building

A curated Hebrew-first online gallery and marketplace for Israeli handmade art and craft. BOBY is the **merchant of record**: buyers pay BOBY, BOBY issues the tax invoice, artists are paid as suppliers on a fixed schedule.

**v1 scope:** Hebrew-only storefront, ILS only, Israel-only shipping, ceramics + jewelry + small works, originals as a secondary tier. English is a thin marketing layer — **no English checkout**.

**Out of scope for v1 — do not let scope creep pull these in:**

English/USD checkout · international shipping · artist self-service dashboard (Phase 7, May–June 2027) · automated payouts · reviews and ratings · wishlists, loyalty, discount codes, gift cards · AR "view in a room" · mobile app · Algolia/search-as-you-type (Postgres full-text over a few hundred items is fine).

### 1.1 Core values

- **Premium & calm.** No countdown timers, no fake scarcity, no popups, no discount wheels, no flashing banners.
- **Gallery-first presentation, commerce-competent structure.** The work is the visual focus — but filtering, facets, clear price/shipping/lead-time display, trust signals and a visible cart are **required**. "No clutter" means no sales pressure, not no e-commerce affordances.
- **Authenticity & trust.** The artist's story is surfaced on every product page.
- **Respect for artists.** Creators are presented as artists, not vendors.
- **Artists get paid, on schedule, without exception.** Money owed to artists is held separately from operating funds and is never used to cover BOBY's costs. Structural rule, not sentiment (§5.5).
- **Accessible to everyone.** IS 5568 / WCAG 2.0 AA is a launch requirement, not later cleanup (§5.1).

---

## 2. Locked architectural decisions

**Do not revisit. The alternatives fail for Israel-specific reasons.**

| Decision | Choice | Why locked |
|---|---|---|
| Frontend | **Next.js 15/16, App Router, TypeScript** | Best RTL/i18n story, best agent support, Vercel deploy |
| Commerce engine | **Medusa v2 + Mercur** | Already implements vendors, commission ledgers, order splitting |
| Content/editorial | **Sanity** (Payload acceptable if self-hosting is preferred) | Artist stories and journal live outside the commerce DB |
| Images | **Cloudinary** + `next/image` custom loader | Vercel's optimiser gets expensive fast on an image-heavy catalogue |
| Payments | **PayPlus** (Grow/Meshulam as backup) | **Stripe does not support Israel as a merchant country** |
| Invoicing | **Green Invoice (חשבונית ירוקה) API** | Allocation numbers (מספר הקצאה) required in real time ≥ ₪5,000 pre-VAT B2B |
| i18n | **next-intl** | App-Router-native. `next-i18next` is Pages-Router-era — do not use |
| Styling | **Tailwind v4** with logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) | Correct RTL for free |
| Money flow | **BOBY is merchant of record** | Most artists are עוסק פטור and cannot issue a tax invoice |
| URLs | **Subdirectories on one domain** — `boby.co.il/` (Hebrew, default) and `boby.co.il/en/` | Google's recommended structure |
| `hreflang x-default` | **Hebrew**, until an English store with checkout exists (2029) | Unmatched traffic must land on the working store |

**Rejected — refuse if proposed:** Shopify (no Shopify Payments in Israel) · Wix (RTL setting applies to all languages) · Sharetribe (Stripe-locked) · Stripe / Stripe Connect (unavailable to Israeli merchants) · **any accessibility overlay widget** (not compliance under Israeli law).

### 2.1 Locked business decisions (from `DECISIONS.md` §2)

| # | Decision | Value |
|---|---|---|
| 1 | Legal entity | עוסק מורשה; convert to Ltd on trigger (annual GMV ₪500K / single deal >₪100K / first employee) |
| 2 | Sales model | Merchant of record |
| 3 | Fulfilment | Dropship for B2C · consolidation at Ur for B2B |
| 6 | International | **Launch 2029.** Infrastructure prep late 2028 |
| 7 | Artist dashboard | **Not in v1.** Phase 7 (May–June 2027) |
| 8 | Design vs build | ChatGPT produces visual reference (HTML only) · **development is Claude Code only** |
| 9 | Business anchor | Passover 2027; Rosh Hashana 2026 = concierge pilot |
| 11 | Positioning | A curated gifts-and-art business with a marketplace underneath it |

---

## 3. Design system

### 3.1 Colour tokens

```css
--color-bg:            #ECEAE6;   /* warm-grey gallery background (Ur override) */
--color-surface:       #FFFFFF;   /* cards, panels — the "white cube" surface */
--color-sand:          #EFE6DC;   /* warm panel / image bed */
--color-stone:         #D7D2CB;   /* warm mid neutral — soft borders, pills */
--color-deep:          #2A211E;   /* warm near-black — corporate hero, footer */
--color-text:          #111827;   /* body */
--color-text-muted:    #4B5563;   /* verify 4.5:1 on the background in use */
--color-border:        #E5E7EB;
--color-accent:        #C17F59;   /* DECORATIVE + display text ≥24px ONLY */
--color-accent-strong: #8A5335;   /* links, secondary actions, editorial emphasis */
--color-accent-hover:  #6F4229;
--color-btn-primary:   #111827;   /* primary purchase buttons are near-black */
--color-success:       #2F6B4F;
--color-error:         #9B2C2C;
```

**WARM system** — Ur's explicit override (30.7.26, `DECISIONS.md` §3), adopting the approved mockup's "Material Warmth" in place of the build-plan's cool `#FAFAFA`. Core tokens (text, borders, accents, clay) are unchanged.

`#C17F59` on the light background measures ~3:1 — legal for large display type and decoration, **illegal for buttons, links and body text**. `#8A5335` clears 4.5:1. **Verify every final pairing with a contrast tool — never by eye.** Warm surfaces change the background under text: re-check muted text on `sand`, and use `surface`/near-white text on `deep`.

Terracotta is **editorial, not transactional**. Purchase buttons are near-black.

### 3.2 Typography

```
Display / headings:  Frank Ruhl Libre  (Hebrew serif — the gallery voice)
Body / UI:           Assistant         (fallback: Heebo, Noto Sans Hebrew, system-ui)
Latin numerals/SKUs: same stack, wrapped dir="ltr"

Scale (mobile → desktop):
  display   32 → 56px   Frank Ruhl Libre   line-height 1.2
  h1        26 → 40px   Frank Ruhl Libre   1.3
  h2        21 → 28px   Frank Ruhl Libre   1.35
  h3        18 → 22px   Assistant 600      1.4
  body      16 → 17px   Assistant 400      1.7
  small     14px        Assistant 400      1.6
  caption   13px        Assistant 400      1.5
```

Hebrew typography rules — not stylistic preferences:

- **Hebrew has no uppercase.** Any hierarchy built on `text-transform: uppercase` collapses. Use weight, size, letter-spacing.
- **Hebrew has no true italics.** Faux-italic looks broken. Use weight or colour.
- **Hebrew is shorter in characters but taller on the line.** Body `line-height` 1.6–1.8. Never pin button or nav widths.

### 3.3 Spacing, radii, motion

```
Spacing scale: 4 8 12 16 24 32 48 64 96 128

Radius — DIFFERENTIATED, never uniform (uniform rounding reads as a
lifestyle app, not a gallery):
  artwork images        0–4px      (the work is the object, not a card)
  editorial cards       8px
  forms & controls      10–12px
  pills / compact tags  fully rounded
  large panels          16px

Shadow: one soft elevation only —
  0 1px 3px rgb(17 24 39 / 0.06), 0 8px 24px rgb(17 24 39 / 0.04)

Motion: 200ms ease-out on hover/focus; 300ms on page transitions.
  ALWAYS wrapped in @media (prefers-reduced-motion: reduce)
```

### 3.4 Layout

- Content max-width 1280px; editorial text max-width 68ch.
- Artwork grid: 1 column mobile / 2 tablet / 3 desktop. **Never 4** — density kills the gallery feel.
- Minimum 64px between page sections on desktop.
- **Preserve each artwork's true aspect ratio.** Never crop artworks to squares — it misrepresents the work.

### 3.5 Design reference

`design-reference/` holds approved visual mockups. **They are reference, never source.**

1. **Never copy mockup CSS or HTML into the app.** Look at it, render it, re-implement natively with our tokens and Tailwind logical utilities.
2. **Tokens are extracted once, into the theme.** Diff any mockup value against §3 and flag mismatches to Ur before building. §3 wins unless Ur explicitly overrides.
3. **Every rebuilt screen passes the §5 gates** — logical-properties grep, axe scan, contrast check, `<bdi>` / `dir="ltr"` wrapping. A beautiful mockup that fails AA gets corrected in the rebuild, and the correction is listed.
4. **Visual parity is checked screen by screen** at 390px and 1440px. Differences are either intentional (a11y/RTL fixes — document them) or bugs (fix them).

---

## 4. Data model rules

Full field lists in `BUILD-PLAN.md` §4. The rules that must not be violated:

- **`inventoryKind` drives everything**: `UNIQUE` (qty fixed at 1, reservation-protected) · `LIMITED_EDITION` (numbered) · `MADE_TO_ORDER` (no stock, requires `leadTimeDays`).
- **`isMadeToCustomerSpec` is a legal field, not a marketing one.** A ceramic bowl the artist already made is **not** made to customer spec, even though it's handmade. Only work produced to this buyer's measurements or requirements qualifies. Defaults to `false`; requires an explicit override with a reason.
- **Dimensions are mandatory and structured** — `heightCm`, `widthCm`, `depthCm`, `weightGrams`. Never a free-text string.
- **Prices are stored and displayed VAT-inclusive (18%)**, as integer agorot.
- **One order → many artists → many shipments → one buyer invoice → many payout lines.** Fulfilment is modelled per artist, never per order.
- **Snapshot price and commission rate onto the order line** at purchase time. Changing a rate later must never alter historical orders.
- Gift-business fields are part of the model, not an afterthought: artist `productionCapacityPerMonth` / `blackoutDates` / `pickupAddress`, artwork `giftWrap*` / `photoStatus` / `contributionFloorIls`, order `giftMessage` / `deliveryMode` / `corporateDepositIls` / `damageReports`.

---

## 5. Non-negotiable engineering rules

Breaking these costs money or creates legal exposure.

### 5.1 Accessibility — WCAG 2.0 AA from line one

IS 5568 requires level AA for public-facing services. Statutory damages reach **₪50,000 without proof of damage**, with an active plaintiff industry.

- Meaningful `alt` on every image. Artworks: title + artist + medium. Decorative: `alt=""`.
- Every interactive element keyboard-reachable with a visible focus ring.
- Contrast verified with a tool, on the final colours.
- Semantic HTML, correct heading order. No `<div>` acting as a button.
- Forms: real `<label>`, errors associated via `aria-describedby`.
- No hover-only interactions. Respect `prefers-reduced-motion`.
- **No accessibility overlay widget.** It is not compliance.

### 5.2 RTL and bidirectional text

- **Never write `left`/`right` in CSS.** Logical properties only, or Tailwind `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`.
- **Wrap every unknown-direction string in `<bdi>`** — artist names, artwork titles, city names. Highest-value single fix.
- **Wrap in `dir="ltr"`:** prices, dimensions (`120 × 90 ס"מ`), phone numbers, emails, URLs, SKUs, order numbers. Neutral characters resolve direction from context and reorder wrongly otherwise — `(Untitled)` renders as `)Untitled(`.
- In attributes that can't hold markup (`title`, `aria-label`, `alt`, meta) use Unicode isolates: `U+2066` LRI, `U+2067` RLI, `U+2069` PDI.
- Money via `Intl.NumberFormat('he-IL', {style:'currency', currency:'ILS'})`; dates via `Intl.DateTimeFormat('he-IL')`.
- **Mirror:** chevrons, back arrows, progress direction. **Do not mirror:** logos, phone numbers, media transport controls, code blocks.

### 5.3 Quantity = 1 — the reservation rule

Two buyers charged for the same painting is unrecoverable.

1. Adding a `UNIQUE` artwork to a cart creates a **reservation row with a 15-minute TTL**. No other cart may hold a reservation for that artwork.
2. The reservation is extended when checkout begins.
3. The stock decrement at payment capture is **idempotent and inside a database transaction** — a webhook replay must not double-decrement.
4. Expired reservations are released by a background job **and** lazily checked on read.
5. Honest UI state: *"בסל של מישהו אחר — נסו שוב בעוד כמה דקות"*. **Not "sold."**
6. **Automated tests for the race condition are mandatory** — two concurrent add-to-cart calls, two concurrent captures.

### 5.4 Images

- Cap delivered resolution at **2,400px** on the long edge. This is the anti-theft measure.
- **No watermarks by default. No right-click blocking.** Both cost more than they protect. Individual artists may opt in to a watermark.
- Preserve or deliberately convert ICC colour profiles — a stripped Adobe RGB file rendered as sRGB looks desaturated, which is a returns problem on an art site.
- AVIF for thumbnails and grids; high-quality WebP (q80–85) or JPEG for detail/zoom. Do not blanket-enable low-quality AVIF — it destroys pigment gradients.
- Embed IPTC/XMP copyright and creator metadata and preserve it on at least one delivered derivative.
- Display a "colours may vary between displays" note near the price.

### 5.5 Money handling

- **Artist funds are segregated** — real ledger, separate bank account. (The Paddle8 lesson: it went bankrupt using consignors' proceeds for operating costs; unsecured creditors recovered 7%.)
- **Never store card data.** Redirect or iframe via PayPlus only. Never in PCI scope.
- Store all money as **integer agorot**, never floats.
- Every money-moving operation is idempotent and logged with an audit trail.
- **Snapshot commission rate and price on the order line** at purchase time.

### 5.6 Pricing architecture ⚠️ open — see `DECISIONS.md` §4

BOBY owes output VAT on the full sale price, but עוסק פטור artists provide no input VAT to reclaim. A commission taken *out of* the artist's retail price can go **negative** after VAT and processing.

**Until the accountant rules otherwise, build it this way:**

- Price is composed as **artist supplier (net) price + BOBY markup + VAT** — never "commission off the artist's retail price".
- Every artwork carries `contributionFloorIls` — **≥ ₪35** after processing, packaging and expected breakage. Publishing below the floor is blocked.
- A **minimum platform fee** applies below ₪150.
- **Free-shipping threshold is ₪500**, not ₪400. (BUILD-PLAN §8 still says ₪400 — DECISIONS wins; keep it a config value.)

### 5.7 Withholding tax (ניכוי מס במקור)

Without a valid, **currently in-date** exemption certificate, BOBY must withhold at the maximum rate (typically 30%). Fail to withhold and BOBY owes the tax itself, plus interest and penalties.

**Build:** certificate storage with `validUntil`, automatic re-verification before every payout run, and a **hard block** on marking an artist payable when the certificate is expired — unless a 30% withholding entry is explicitly recorded.

### 5.8 Consumer law

- **14-day cancellation right** from receipt of goods or the disclosure document, whichever is later. Extended to **4 months** for buyers 65+, with a disability, or new immigrants where a conversation with a representative took place — handled manually in admin, never auto-detected.
- **The disclosure document (מסמך גילוי)** is sent no later than delivery, in Hebrew, containing business name and number, address, product details, price, payment terms, delivery timeline, warranty, and **the cancellation rights and how to exercise them**. Record `disclosureDocumentSentAt` — it starts the clock.
- **Cancellation fee capped at 5% or ₪100, whichever is lower.** Refund within 14 days of notice.
- **`isMadeToCustomerSpec` gates the cancellation exemption.** Ready-made handmade stock is **not** exempt.
- **All returns are centralised.** One cancellation flow, one refund from BOBY, artist clawback behind the scenes. **Never route a buyer to an artist.**
- **Prices display including 18% VAT, in shekels, as one number** — including for business buyers.

---

## 6. How we work

- **One phase at a time, in order.** Each phase has an acceptance test; the next phase does not start until it passes. Phases are in `BUILD-PLAN.md` §5; dates and go/no-go gates are in `docs/stage-plan-he.md`.
- **Session opener:** *"Read CLAUDE.md and BUILD-PLAN.md. We are working on Phase N, task N.x. Do not touch anything outside that task."*
- **Discuss before implementing.** Propose logic, schema and algorithm changes for approval before editing.
- **`npm run check` is the gate.** Physical-property grep, axe scan, contrast check, typecheck. It runs after every change, and every bug fixed adds a permanent regression test.
- **Spikes are throwaway.** Code in `spikes/` is ugly by design, never imported by the app, and deleted once its finding is written into `BUILD-PLAN.md`.
- **Read the actual API docs in-session** for PayPlus and Green Invoice, and cite the endpoint being called. Never write integration code from memory.
