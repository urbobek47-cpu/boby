# BOBY — Build Plan for Claude Code

**Version 1.2 | July 2026 | Written for Ur, building solo with Claude Code**

> **v1.1:** Added Phase 0.5 — importing the ChatGPT-produced design. Workflow confirmed: **all development happens in Claude Code**; ChatGPT is used only to produce visual design references (see the separate Hebrew design brief document).
> **v1.2 (external review):** Added Phase 0.75 integration risk spikes; gift-business data model fields (§4.4); corporate-gifts page moved into Phase 1 scope; differentiated corner radii and near-black primary buttons (§6); pricing architecture warning (§7.5); `x-default` now points to Hebrew until the English store launches. Where this file conflicts with `BOBY-DECISIONS.md`, DECISIONS wins.

---

## 0. How to use this document

This is not a document to read once. It is the **source of truth you hand to Claude Code at the start of every session.**

**Setup, before you write anything:**

1. Create the project folder and put this file in it as `BUILD-PLAN.md`.
2. Create a second file called `CLAUDE.md` containing **Sections 2, 3, 6 and 7 of this document** (constitution, locked decisions, engineering rules, design system). Claude Code reads `CLAUDE.md` automatically at the start of every session — this is how the rules stay enforced without you repeating them.
3. Work **one phase at a time, in order.** Do not skip ahead. Each phase has an acceptance test; do not start the next phase until the current one passes.
4. At the start of each session, tell Claude: *"Read CLAUDE.md and BUILD-PLAN.md. We are working on Phase N, task N.x. Do not touch anything outside that task."*

**The most important instruction in this whole document:** when Claude proposes something that contradicts Section 3 (Locked Decisions) or Section 7 (Non-Negotiable Rules), say no and point it back at the file. Those sections exist because the alternatives were researched and rejected, not because they were arbitrary.

**Three things you must not let an AI agent do alone**, no matter how confident it sounds:

- **Payment integration.** It will produce plausible code against an API it has not read. Verify every call against PayPlus's real sandbox.
- **Tax invoice / allocation number logic.** Getting this wrong is a legal problem, not a bug. Have your accountant review the actual invoices the system produces before launch.
- **Anything that moves money to artists.** Build it, but do the first three months of payouts manually, by hand, with a spreadsheet, while you watch what the system *would* have done.

---

## 1. What we are building

A curated Hebrew-first online gallery and marketplace for Israeli handmade art and craft. BOBY is the **merchant of record**: buyers pay BOBY, BOBY issues the tax invoice, artists are paid as suppliers on a fixed schedule.

**Phase 1 scope (this build):** Hebrew-only storefront, ILS only, Israel-only shipping, ceramics + jewelry + small works, with originals as a secondary tier. English exists as a thin marketing layer — no English checkout.

**Explicitly out of scope for v1** — do not let scope creep pull these in:

- English/USD checkout, international shipping, customs
- Artist self-service dashboard (Phase 2 — you onboard artists manually at first)
- Automated payouts (manual for the first 3 months)
- Reviews and ratings (you have no volume; they'll look empty)
- Wishlists, loyalty, discount codes, gift cards
- AR "view in a room" (a static room-scale overlay is enough for v1)
- Mobile app
- Search-as-you-type / Algolia (a Postgres full-text search over a few hundred items is fine)

---

## 2. Project Constitution v2

*This replaces the original draft. Sections marked ✚ are new.*

### 2.1 Product vision

BOBY is a curated Israeli marketplace connecting independent artisans with direct buyers. It presents work with gallery-grade care **in service of actually selling it**. The aesthetic is the packaging; the product is a working sales channel for artists who currently have none.

### 2.2 Core values

- **Premium & calm.** The interface feels considered, sophisticated and quiet — like a modern Tel Aviv gallery. No aggressive sales tactics: no countdown timers, no fake scarcity, no popups, no discount wheels, no flashing banners.
- **Gallery-first presentation, commerce-competent structure.** The work is the visual focus. But filtering, faceted browsing, clear price/shipping/lead-time display, trust signals and a visible cart are **required** — they are how a stranger decides to spend ₪1,800. "No clutter" means no sales pressure, not no e-commerce affordances.
- **Authenticity & trust.** The human, the craft, and the artist's story are surfaced on every product page.
- **Respect for artists.** Creators are presented as artists, not vendors.
- ✚ **Artists get paid, on schedule, without exception.** Money owed to artists is held separately from operating funds and is never used to cover BOBY's costs. This is a structural rule, not a sentiment. (See §7.5.)
- ✚ **Accessible to everyone.** IS 5568 / WCAG 2.0 level AA is a launch requirement, not a later cleanup. (See §7.1.)

### 2.3 Design philosophy

- **Whitespace** frames the work and creates a sense of luxury. Empty space is active, not blank.
- **Minimalism.** Minimal borders, soft shadows only where strictly necessary, consistent 16px rounded corners.
- **Colour palette** *(revised — see §6.1 for the reason)*:
  - Gallery background: `#FAFAFA`
  - Typography: `#111827`
  - Accent, decorative & large display only: `#C17F59`
  - ✚ Accent for text, links, buttons, and anything under 24px: `#8A5335` *(the original terracotta fails AA contrast on the off-white background)*
- **Typography:** `Assistant` or `Heebo` for body and UI. ✚ `Frank Ruhl Libre` for display headings — it carries the gallery voice.
- **Layout direction:** Hebrew is RTL. ✚ But the CSS must be **direction-agnostic**, never hard-coded RTL — see §7.2. `dir` is set per-locale on `<html>`, and the layout mirrors automatically.

### 2.4 Non-negotiable rules

- Never adopt aggressive marketplace sales patterns (Amazon/Etsy pressure tactics). Do adopt marketplace *navigation* patterns — filtering, facets, clear pricing.
- All placeholder data must be realistic: valid Hebrew, logical ₪ pricing that matches the real bands in §5.2, and images that plausibly look like physical craft.
- Pristine mobile-first responsiveness. No unexpected horizontal scrolling. Over 80% of Israeli search traffic is mobile.
- ✚ **No watermarking and no right-click blocking.** Protection is delivered by capping image resolution at 2,000–3,000px on the long edge, plus embedded copyright metadata. (See §7.4.)
- ✚ **Every price displayed includes VAT (18%), in shekels, as a single number** — legally required, including for business buyers.
- ✚ **Quantity=1 items must be reservation-protected.** Charging two buyers for the same piece is a brand-ending event. (See §7.3.)

---

## 3. Locked architectural decisions

**Do not revisit these. They were researched; the alternatives fail for Israel-specific reasons.**

| Decision | Choice | Why it's locked |
|---|---|---|
| Frontend | **Next.js 15/16, App Router, TypeScript** | Best RTL/i18n story, best agent support, Vercel deploy |
| Commerce engine | **Medusa v2 + Mercur** | Already implements vendors, commission ledgers, order splitting — the two hardest things to hand-build |
| Content/editorial | **Sanity** (or Payload if you prefer self-hosting) | Artist stories, journal, curated collections live outside the commerce DB |
| Images | **Cloudinary** + `next/image` custom loader | Vercel's built-in optimiser gets expensive fast on an image-heavy catalogue |
| Payments | **PayPlus** | **Stripe does not support Israel as a merchant country** — Stripe Connect is unavailable. PayPlus has the most modern API and an open sandbox. Cardcom is the fallback |
| Invoicing | **Green Invoice (חשבונית ירוקה) API** | Allocation numbers (מספר הקצאה) required in real time above ₪5,000 |
| i18n | **next-intl** | App-Router-native. `next-i18next` is Pages-Router-era; do not use it |
| Styling | **Tailwind v4** with logical-property utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) | Gives correct RTL for free |
| Money flow | **BOBY is merchant of record** | Most artists are עוסק פטור and cannot issue a tax invoice; avoids Payment Services Law licensing exposure |
| URL structure | **Subdirectories on one domain**: `boby.co.il/` (Hebrew, default) and `boby.co.il/en/` | Google's recommended structure; consolidates authority |

**Rejected, with reasons — if Claude suggests any of these, refuse:**

- **Shopify** — no Shopify Payments in Israel, so no true dual-currency checkout, plus a 0.6–2% third-party gateway surcharge on top of Israeli gateway fees.
- **Wix** — the Stores RTL setting applies to *all* languages, which breaks bilingual.
- **Sharetribe** — Stripe-locked, therefore unusable in Israel.
- **Stripe / Stripe Connect** — not available to Israeli merchants.
- **Any accessibility overlay widget** — not compliance under Israeli law.

---

## 4. Data model

Model this in Medusa where commerce-native, in Sanity where editorial. Get this right before building UI.

### 4.1 Artist (vendor)

```
Artist
  id, slug
  displayName_he, displayName_en
  bio_he, bio_en                    // required for the story-first product page
  portraitImage, studioImages[]
  location_he, location_en          // city, for "made in" signals
  instagramUrl, websiteUrl          // ✱ required at application — evidence of audience
  disciplines[]                     // ceramics | jewelry | painting | sculpture | wood | textile | judaica
  status                            // applied | approved | active | paused | removed
  commissionRateOverride?           // null = use category default
  ---- finance (never exposed publicly) ----
  legalName, businessType           // osek_patur | osek_murshe | company
  taxId
  bankDetails                       // encrypted at rest
  withholdingCertificate            // file + validFrom + validUntil  ← see §7.6
  ---- audit ----
  joinedAt, approvedBy, notes
```

### 4.2 Artwork (product)

The critical piece. **Three inventory kinds, modelled explicitly:**

```
Artwork
  id, slug
  artistId
  title_he, title_en
  story_he, story_en                // the making-of narrative — this sells the piece
  materials_he[], materials_en[]
  category, subcategory
  ---- inventory kind: THIS DRIVES EVERYTHING ----
  inventoryKind                     // UNIQUE | LIMITED_EDITION | MADE_TO_ORDER
    UNIQUE          → quantity fixed at 1, reservation-protected (§7.3)
    LIMITED_EDITION → editionSize, editionNumbersSold[], each piece numbered
    MADE_TO_ORDER   → no stock, requires leadTimeDays
  quantity                          // derived, not directly editable for UNIQUE
  leadTimeDays?                     // required for MADE_TO_ORDER
  ---- dimensions: MANDATORY, structured, in cm ----
  heightCm, widthCm, depthCm, weightGrams
  ---- pricing ----
  priceIls                          // INCLUDING VAT — this is the displayed number
  ---- shipping ----
  shippingSizeBand                  // SMALL (≤50cm) | MEDIUM | LARGE | OVERSIZE_QUOTE
  isFragile                         // affects courier selection
  ---- images ----
  primaryImage                      // must be cropped to the artwork only
  supportingImages[]                // detail, signature, edge, verso, scale, framed
  ---- consumer law ----
  isMadeToCustomerSpec              // ← true ONLY for bespoke/commissioned work.
                                    //   Determines cancellation-right exemption. §7.7
  ---- status ----
  status                            // draft | in_review | published | sold | archived
```

> ⚠️ `isMadeToCustomerSpec` is a **legal** field, not a marketing one. A ceramic bowl the artist already made and photographed is **not** made to customer spec, even though it's handmade. Only a piece produced to this specific buyer's measurements or requirements qualifies. Default it to `false` and make it require an explicit override.

### 4.3 Order

```
Order
  id, humanReadableNumber           // e.g. BOBY-2027-0142
  buyer {name, email, phone, shippingAddress, billingAddress}
  lines[] {artworkId, artistId, titleSnapshot, priceIlsSnapshot,
           commissionRateSnapshot, commissionAmount, artistPayoutAmount}
  ---- money ----
  subtotalIls, shippingIls, totalIls    // all VAT-inclusive
  vatAmountIls                          // computed for the invoice, 18%
  ---- payment ----
  paymentStatus, payplusTransactionId, paymentMethod
  ---- invoice ----
  greenInvoiceDocId, allocationNumber?, invoiceIssuedAt
  ---- fulfilment: PER ARTIST, not per order ----
  shipments[] {artistId, courier, trackingNumber, status, shippedAt, deliveredAt}
  ---- consumer law ----
  disclosureDocumentSentAt              // starts the 14-day clock — §7.7
  cancellationRequestedAt?, cancellationReason?, refundedAt?
  ---- artist settlement ----
  payoutStatus per artist, payoutBatchId?
```

**Note the shape:** one order can contain work from three artists and produce three separate shipments, one invoice to the buyer, and three payout lines. Mercur handles the splitting; you handle the invoice and the settlement.

### 4.4 v1.2 additions — the gift-business fields

The original model described an art catalogue; the business is also a gift operation. Add:

```
Artist (additions)
  productionCapacityPerMonth      // units they can realistically make — gates corporate deals
  blackoutDates[]                 // reserve duty, travel, kiln schedules
  pickupAddress                   // for B2B consolidation runs
  packagingResponsibility         // standard-kit | artist-own (affects breakage liability per the agreement)

Artwork (additions)
  giftWrapAvailable, giftWrapFeeIls
  corporateMinQty?, corporateLeadTimeDays?   // only for corporate-eligible items
  photoStatus                     // pending | approved | rejected (nothing publishes unapproved)
  contributionFloorIls            // minimum acceptable contribution — see §7.5; blocks publishing below floor
  batchNumber?                    // lot tracking for handmade production runs

Order (additions)
  giftMessage?, recipientName?    // gift orders ship to someone who didn't pay
  deliveryMode                    // single-address | multi-address (corporate)
  corporateDepositIls?, corporateBalanceDueAt?   // 40% deposit model
  damageReports[] {artworkId, photos[], reportedAt, resolution, liableParty}
```

---

## 5. Phased build

Each phase: goal → tasks → acceptance test. **Do not advance until the acceptance test passes.**

### Phase 0 — Foundation (2–3 days)

**Goal:** an empty but correctly-structured bilingual RTL app that deploys.

**Tasks:**

1. `create-next-app` with TypeScript, Tailwind v4, App Router.
2. Install and configure `next-intl` with `[locale]` routing: `he` (default, unprefixed) and `en` (at `/en`).
3. Root layout sets `<html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>`.
4. Self-host Assistant, Heebo and Frank Ruhl Libre via `next/font/local`, **subset per locale** so Hebrew glyphs only load on Hebrew pages.
5. Build the design token layer (§6) as Tailwind theme config — colours, spacing, radii, type scale.
6. Deploy to Vercel. Buy `boby.co.il`.

**Acceptance test:**
- `/` renders in Hebrew, RTL, correct fonts. `/en` renders in English, LTR.
- Grep the entire codebase for `margin-left`, `margin-right`, `padding-left`, `padding-right`, `text-align: left|right`, `left:`, `right:` — **zero results.** If any exist, fix them now; it gets exponentially harder later.
- Lighthouse accessibility score 100 on an empty page.

**Prompt to use:**
> "Set up a Next.js App Router project with TypeScript and Tailwind v4. Configure next-intl for locales `he` (default, no prefix) and `en` (prefixed). The root layout must set `lang` and `dir` per locale. Use ONLY CSS logical properties and Tailwind logical utilities (ms-, me-, ps-, pe-, start-, end-) — never left/right. Self-host Assistant, Heebo and Frank Ruhl Libre with next/font/local, subset per locale. Implement the design tokens from BUILD-PLAN.md §6."

---

### Phase 0.5 — Design import (runs alongside Phase 0/1)

**Goal:** turn the approved ChatGPT design mockups into project assets Claude Code builds from — without ever treating mockup code as production code.

**Inputs:** the approved HTML files from the ChatGPT design process (style guide + one file per screen), saved in a `design-reference/` folder at the project root.

**The four rules of design import:**

1. **Mockups are reference, not source.** Claude Code looks at them (renders them, screenshots them, reads their structure) and re-implements every component natively in Next.js + Tailwind. **Never copy mockup CSS or HTML into the app.** ChatGPT mockup code will almost certainly contain physical properties (`margin-left`), inaccessible markup, and inline styles — porting it literally would smuggle in exactly the defects §7 forbids.
2. **Tokens are extracted once, into the theme.** First task of the import: read the style-guide HTML, extract every colour, font size, spacing and radius value, diff it against §6 of this document, and flag any mismatch to Ur before building. §6 wins conflicts unless Ur explicitly overrides.
3. **Every imported design passes the same gates.** After rebuilding a screen from its mockup, run the §7 checks on the *rebuilt* version: logical-properties grep, axe scan, contrast check, `<bdi>`/`dir="ltr"` wrapping on prices and Latin names. A beautiful mockup that fails AA gets corrected in the rebuild — and the correction is noted so Ur can update the ChatGPT thread.
4. **Visual parity is checked screen by screen.** For each screen: open the mockup and the built page side by side at 390px and 1440px. Differences are either intentional (a11y/RTL fixes — document them) or bugs (fix them).

**Prompt to use when starting each screen:**
> "Open `design-reference/<screen>.html` and study it visually. Re-implement it as Next.js components using our design tokens and Tailwind logical utilities. Do not copy its CSS. Where the mockup violates CLAUDE.md rules (contrast, physical properties, semantics), follow CLAUDE.md and list every deviation you made."

**Acceptance test:** the built screen matches the mockup's look and feel at both breakpoints, passes all §7 checks, and the deviations list is empty or justified.

---

### Phase 0.75 — Integration risk spikes (3–5 days, before any catalogue UI)

**Goal:** prove the four flows that determine whether this architecture is viable at all. Each spike is a **throwaway prototype** — ugly code, no design, deleted afterwards. The gallery UI is the easy part; these are not.

| Spike | Prove | Pass criteria |
|---|---|---|
| **1. PayPlus round-trip** | Sandbox payment → server webhook → refund | Webhook confirms payment (not the redirect); replayed webhook is idempotent; refund lands |
| **2. Green Invoice** | Invoice creation + allocation-number request | Invoice issued via API; allocation number obtained for a ≥₪5,000 pre-VAT B2B case; failure path alerts loudly |
| **3. Multi-artist order split** | One cart, two vendors, in Medusa/Mercur | Order splits into two shipments with correct per-vendor commission ledger entries |
| **4. Unique-item race** | Two simultaneous reservations on qty=1 | Second reservation blocked, under genuinely concurrent requests, 5/5 runs |

**Acceptance test:** all four pass, and any surprises (API quirks, missing capabilities) are written into this file *before* Phase 1 begins. If spike 3 fails badly, the fallback (hand-built commerce core on Postgres/Prisma) is decided **now**, not after the catalogue is built on Medusa.

---

### Phase 1 — Catalogue & gallery (1–2 weeks)

**Goal:** a beautiful, browsable, read-only catalogue with realistic Hebrew content, **plus the corporate-gifts page** — it is a flagship product, not a later feature. **No cart yet.**

> Phase 1 scope addition — **Corporate gifts page** (`/business`): the operational promise ("מתנה ישראלית מקורית. חשבונית אחת. אפס כאב ראש לוגיסטי."), three packages by budget (₪300/₪450/₪550), minimum quantities and lead times, centralized vs. home delivery, branding and gift-note options, deposit and payment terms stated up front, and two CTAs — **request a physical sample** (primary) and a short consultation form. The complex order-builder stays out of v1; the page and lead workflow do not.
>
> Phase 1 also builds the **edge-state components** used everywhere later: reserved-by-another-shopper, sold, made-to-order lead time, oversize-quote, empty filter results, image-awaiting-moderation.

**Tasks:**

1. Set up Medusa v2 + Mercur locally, connect Postgres.
2. Implement the Artist and Artwork models from §4, including all three `inventoryKind` variants.
3. Set up Sanity for artist stories and editorial content.
4. Cloudinary account + `next/image` loader. **Cap delivered resolution at 2,400px on the long edge.**
5. Build the pages:
   - **Home** — hero, curated collection, featured artists, new arrivals. Whitespace-led.
   - **Catalogue** (`/works`) — grid, filter by category / price band / artist / size. Server-side filtering via URL params so filters are shareable and indexable.
   - **Artwork page** — image gallery with zoom, story, artist card, dimensions (in cm, displayed `dir="ltr"`), materials, price, shipping band, lead time. **This is the most important page on the site; spend the most time here.**
   - **Artist page** — portrait, story, their works, studio images.
   - **Editorial** — a simple journal for the story-led SEO play.
6. Seed with **realistic** placeholder data: 6 artists, 40 artworks, prices in the real bands (ceramics ₪49–399, jewelry ₪110–550, originals ₪1,000–5,000), genuine Hebrew copy.
7. SEO: per-locale metadata, reciprocal `hreflang` (`he-IL`, `en`, **`x-default` → Hebrew** — the English layer has no checkout yet, so unmatched traffic must land on the working store; switch `x-default` to English only at the 2029 international launch), self-canonicals, sitemap, JSON-LD (`VisualArtwork`, `Product`, `Offer`, `BreadcrumbList`, `Organization`).

**Acceptance test:**
- Browse the whole catalogue on a phone in Hebrew. No horizontal scroll anywhere.
- A price, a dimension string (`120 × 90 ס"מ`), and a Latin artist name inside a Hebrew sentence all render correctly with no character reordering.
- Switch to `/en`. Layout mirrors correctly with no broken spacing.
- Run axe DevTools on the artwork page: zero violations.
- Show it to three people who don't know the project. If none of them can tell you what the site sells in five seconds, the design has failed.

---

### Phase 2 — Commerce (2–3 weeks)

**Goal:** a real, working purchase, end to end, with a real invoice.

**Tasks:**

1. **Cart** with the quantity=1 reservation mechanism (§7.3). Build this *first*, before checkout — it is the highest-risk logic in the project.
2. **Checkout:** address, shipping selection, order summary. Minimal steps, no account required (guest checkout converts far better).
3. **PayPlus integration.**
   - Get sandbox credentials on day one of this phase — do not wait.
   - Support card, **bit**, Apple Pay, Google Pay.
   - Implement the webhook for payment confirmation. **Never** treat a client-side redirect as proof of payment.
   - Idempotency keys on every capture.
4. **Shipping:** flat-rate bands by `shippingSizeBand`. `OVERSIZE_QUOTE` routes to a quote-request flow, not a rate table. Free shipping threshold (suggest ₪400) as a config value.
5. **Green Invoice integration.** On payment confirmation: issue the tax invoice, request an allocation number when the pre-VAT amount is ≥ ₪5,000 **and** the buyer is a business. Handle failure with retries and an alert — never silently skip.
6. **Order emails** in Hebrew: confirmation, the **disclosure document** (מסמך גילוי — legally required, see §7.7), shipping notification, delivery confirmation.
7. **Admin order view** for you: order list, status, per-artist shipment tracking, refund action.

**Acceptance test:**
- Complete a real ₪5 purchase with a real card on the live gateway. Refund it.
- Open two browser windows on the same quantity=1 artwork. Add to cart in both. **The second must be blocked.** Test this five times.
- Verify the generated tax invoice with your accountant. Not "looks right" — actually verified.
- Kill the network mid-payment. The order must not end up in a half-paid state.
- Confirm the disclosure document email contains everything §7.7 requires.

---

### Phase 3 — Operations (1 week)

**Goal:** you can actually run this without touching the database.

**Tasks:**

1. **Artist onboarding admin** — create artist, upload work, set commission, store the withholding certificate with its expiry date.
2. **Image upload pre-flight validation:** reject under 2,000px long edge, wrong colour space, or missing dimensions. Queue for your manual approval.
3. **Payout ledger** — a read-only report of what each artist is owed, by order, by period. **Do not automate the actual transfer in v1.** You export it and pay manually while you learn the edge cases.
4. **Withholding certificate check** — the payout report must flag any artist whose certificate is expired or expiring within 30 days, and must refuse to mark them payable without either a valid certificate or an explicit 30% withholding entry.
5. **Returns flow** — one-click cancellation from admin: refund via PayPlus, mark the order, record the artist clawback.
6. **Corporate order mode** — a way to build a multi-item, multi-recipient order with one invoice. Can be crude in v1; it will be your best revenue line.

**Acceptance test:**
- Onboard a real artist with 5 real works without touching code or a database.
- Generate a payout report for a month with 20 orders across 6 artists. Check the arithmetic by hand.
- Process a full cancellation and refund from admin.

---

### Phase 4 — Compliance (1 week — do not compress this)

**Goal:** legally launchable.

**Tasks:**

1. **Accessibility pass to WCAG 2.0 AA.** Full keyboard navigation, visible focus states, alt text on every artwork image, correct heading hierarchy, ARIA where genuinely needed, contrast verified with a tool (not by eye), no hover-only interactions, no motion without a reduced-motion alternative.
2. **Accessibility statement page** (הצהרת נגישות) with your name and contact details as accessibility coordinator.
3. **Book a מורשה נגישות audit.** Budget ~₪8,000. This is the cheapest insurance you will ever buy against ₪50,000-per-claim exposure.
4. **Legal pages, in Hebrew:** terms (תקנון), privacy policy, returns and cancellation policy, shipping policy, contact with full business details. Have a lawyer review the terms and the artist agreement.
5. **Privacy compliance:** cookie consent, data-subject request handling (access/correction/deletion), data-processing agreements with PayPlus, Cloudinary, Vercel, your email provider and courier.
6. **Cancellation flow surfaced to the buyer** — a clear, findable way to cancel within 14 days.

**Acceptance test:**
- Navigate the entire purchase flow using only a keyboard.
- Navigate the artwork page with a screen reader (VoiceOver is built into your Mac).
- The accessibility auditor signs off.
- Your lawyer signs off on the terms and the artist agreement.

---

### Phase 5 — Launch (1 week)

1. Analytics (Plausible or GA4 — Plausible is simpler and privacy-cleaner).
2. Error monitoring (Sentry).
3. Transactional email deliverability — SPF, DKIM, DMARC on `boby.co.il`. Test that Hebrew emails don't land in spam.
4. Email list signup, connected to your newsletter tool.
5. Backups: automated Postgres backups, verified by actually restoring one.
6. Load the real catalogue — 25 artists, 150+ works.
7. **Soft launch** to the first 200 email subscribers. Fix what breaks. Then public.

---

## 6. Design system spec

### 6.1 Colour tokens

```css
--color-bg:            #FAFAFA;   /* gallery background */
--color-surface:       #FFFFFF;   /* cards, panels */
--color-text:          #111827;   /* body */
--color-text-muted:    #4B5563;   /* secondary — verify 4.5:1 on #FAFAFA */
--color-border:        #E5E7EB;
--color-accent:        #C17F59;   /* DECORATIVE + display text ≥24px ONLY */
--color-accent-strong: #8A5335;   /* links, secondary actions, editorial emphasis */
--color-accent-hover:  #6F4229;
--color-btn-primary:   #111827;   /* v1.2: primary purchase buttons are near-black —
                                     terracotta is editorial, not transactional */
--color-success:       #2F6B4F;
--color-error:         #9B2C2C;
```

> **Why two accents.** `#C17F59` on `#FAFAFA` measures roughly **3:1** contrast. WCAG AA requires **4.5:1** for normal text and 3:1 for large text (≥24px, or ≥18.66px bold). So the original terracotta is legal for big display type and decoration, and illegal for buttons, links and body text. `#8A5335` clears 4.5:1 while staying in the same family. **Verify every final pairing with a contrast checker — do not trust these values by eye.**

### 6.2 Typography

```
Display / headings:  Frank Ruhl Libre  (Hebrew serif — the gallery voice)
Body / UI:           Assistant         (fallback: Heebo, Noto Sans Hebrew, system-ui)
Latin numerals/SKUs: same stack, wrapped dir="ltr"

Scale (mobile → desktop):
  display   32 → 56px   Frank Ruhl Libre   line-height 1.2
  h1        26 → 40px   Frank Ruhl Libre   1.3
  h2        21 → 28px   Frank Ruhl Libre   1.35
  h3        18 → 22px   Assistant 600      1.4
  body      16 → 17px   Assistant 400      1.7   ← Hebrew needs the extra leading
  small     14px        Assistant 400      1.6
  caption   13px        Assistant 400      1.5
```

**Hebrew typography rules — these are not stylistic preferences:**

- **Hebrew has no uppercase.** Any hierarchy built on `text-transform: uppercase` collapses. Use weight, size and letter-spacing.
- **Hebrew has no true italics.** Faux-italic Hebrew looks broken. Use weight or colour for emphasis.
- **Hebrew is ~20–30% shorter than English in characters but taller on the line.** Use `line-height` 1.6–1.8 for body, and never pin button or nav widths — they must grow.

### 6.3 Spacing, radii, motion

```
Spacing scale: 4 8 12 16 24 32 48 64 96 128
Radius (v1.2 — differentiated, replaces uniform 16px; uniform rounding
reads as a lifestyle app, not a gallery):
               artwork images: 0–4px (the work is the object, not a card)
               editorial cards: 8px
               forms & controls: 10–12px
               pills/compact tags: fully rounded
               large promotional panels: 16px
Shadow:        one soft elevation only —
               0 1px 3px rgb(17 24 39 / 0.06), 0 8px 24px rgb(17 24 39 / 0.04)
Motion:        200ms ease-out on hover/focus; 300ms on page transitions
               ALWAYS wrap in @media (prefers-reduced-motion: reduce)
```

### 6.4 Layout

- Content max-width 1280px; editorial text max-width 68ch.
- Artwork grid: 1 column mobile / 2 tablet / 3 desktop. **Never 4** — density kills the gallery feel.
- Generous vertical rhythm: minimum 64px between page sections on desktop.
- Images: preserve the artwork's true aspect ratio in the grid (a masonry or aspect-aware grid). Do not crop artworks to squares — it misrepresents the work.

---

## 7. Non-negotiable engineering rules

These go in `CLAUDE.md`. They are the rules that, if broken, cost money or create legal exposure.

### 7.1 Accessibility — WCAG 2.0 AA, from line one

Israeli standard IS 5568 requires level AA for public-facing services. Statutory damages reach **₪50,000 without proof of damage**, and there is an active plaintiff industry in 2026.

- Every image needs meaningful `alt`. For artworks: title + artist + medium. Decorative images get `alt=""`.
- Every interactive element must be keyboard-reachable with a visible focus ring.
- Contrast verified with a tool, on the actual final colours.
- Semantic HTML and correct heading order. No `<div>` acting as a button.
- Forms: real `<label>` elements, error messages associated via `aria-describedby`.
- No hover-only interactions — everything must work on touch and keyboard.
- Respect `prefers-reduced-motion`.
- **An accessibility overlay widget is not compliance.** Do not install one.

### 7.2 RTL and bidirectional text

- **Never** write `left`/`right` in CSS. Only logical properties, or Tailwind's `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`.
- **Wrap every unknown-direction string in `<bdi>`** — artist names, artwork titles, review text, city names. Highest-value single fix.
- **Wrap in `dir="ltr"`:** prices, dimensions (`120 × 90 ס"מ`), phone numbers, emails, URLs, SKUs, order numbers. Neutral characters (spaces, `×`, `/`, parentheses, currency symbols) resolve their direction from context and will reorder wrongly otherwise — `(Untitled)` renders as `)Untitled(`.
- In attributes that can't contain markup (`title`, `aria-label`, `alt`, meta tags) use Unicode isolates: `U+2066` LRI, `U+2067` RLI, `U+2069` PDI.
- Format money via `Intl.NumberFormat('he-IL', {style:'currency', currency:'ILS'})`; dates via `Intl.DateTimeFormat('he-IL')` (DD/MM/YYYY).
- **Mirror:** chevrons, back arrows, progress direction. **Do not mirror:** logos, phone numbers, media transport controls, code blocks.

### 7.3 Quantity = 1 — the reservation rule

Most artworks are unique. Two buyers charged for the same painting is unrecoverable.

**Required implementation:**

1. Adding a `UNIQUE` artwork to a cart creates a **reservation row** with a 15-minute TTL. No other cart can hold a reservation for that artwork.
2. The reservation is extended when checkout begins.
3. The stock decrement at payment capture is **idempotent and inside a database transaction** — a webhook replay must not double-decrement.
4. Expired reservations are released by a background job **and** lazily checked on read.
5. The UI shows honest state: "בסל של מישהו אחר — נסו שוב בעוד כמה דקות" (in someone's cart — try again in a few minutes). Not "sold."
6. **Write automated tests for the race condition.** Two concurrent add-to-cart calls, two concurrent captures. This is not optional.

### 7.4 Images

- Cap delivered resolution at **2,400px** on the long edge. This is the anti-theft measure — enough for zoom, useless for a print forgery.
- **No watermarks by default.** No right-click blocking. Both cost more (in reduced sharing and in credibility) than they protect. Allow individual artists to opt in to a watermark if they insist.
- Preserve or deliberately convert ICC colour profiles. A stripped Adobe RGB file rendered as sRGB looks visibly desaturated — that's a returns problem on an art site.
- AVIF for thumbnails and grids; high-quality WebP (q80–85) or JPEG for the detail/zoom view. Don't blanket-enable low-quality AVIF — it degrades subtle gradients and pigment tones.
- Embed IPTC/XMP copyright and creator metadata on originals and preserve it on at least one delivered derivative. This is what actually supports a takedown claim.
- Display a "colours may vary between displays" note near the price.

### 7.5 Money handling

- **Artist funds are segregated.** The payout ledger is a real accounting record, and the money sits in a separate bank account. This is the Paddle8 lesson: it went bankrupt using consignors' proceeds for operating costs, and unsecured creditors recovered 7% of their claims.
- **Never store card data.** All card handling is redirect or iframe via PayPlus. You must never be in PCI scope.
- Store all money as **integer agorot**, never floats.
- Every money-moving operation is idempotent and logged with an audit trail.
- **Snapshot the commission rate and price on the order line** at purchase time. Changing an artist's rate later must never alter historical orders.
- ⚠️ **Pricing architecture (v1.2 — pending accountant confirmation).** BOBY owes output VAT on the full sale price, but עוסק פטור artists provide no input VAT to reclaim — a commission taken "out of" the artist's retail price can go **negative** after VAT and processing. Until the accountant rules otherwise: prices are built as **artist supplier (net) price + BOBY markup + VAT**, every artwork carries a `contributionFloorIls` (≥₪35 after processing, packaging and expected breakage), a minimum platform fee applies below ₪150, and the free-shipping threshold is **₪500**, not ₪400. See `BOBY-DECISIONS.md` §4 for the worked numbers.

### 7.6 Withholding tax (ניכוי מס במקור)

As a company paying artists, BOBY is an obligated payer. Without a valid, **currently in-date** exemption certificate, you must withhold at the maximum rate (typically 30%). If you fail to withhold, **you owe the tax yourself**, plus interest and penalties.

**Build:** certificate storage with `validUntil`, automatic re-verification before every payout run, and a hard block on marking an artist payable when the certificate is expired unless a 30% withholding entry is explicitly recorded.

### 7.7 Consumer law implementation

- **14-day cancellation right** from receipt of goods or of the disclosure document, whichever is later. Extended to **4 months** for buyers who are 65+, have a disability, or are new immigrants, where a direct conversation with a representative took place. (Handle the extended case manually in admin; don't try to detect it automatically.)
- **The disclosure document (מסמך גילוי)** must be sent no later than delivery, in Hebrew, containing: business name and number, address, product details, price, payment terms, delivery timeline, warranty details, and **the cancellation rights and how to exercise them.** Record `disclosureDocumentSentAt` — it starts the clock.
- **Cancellation fee capped at 5% or ₪100, whichever is lower.** Refund within **14 days** of the cancellation notice.
- **`isMadeToCustomerSpec` gates the cancellation exemption.** Only bespoke work made to the buyer's measurements or requirements is exempt. Ready-made handmade stock is **not**. Default `false`; require an explicit reason to set it `true`.
- **All returns are centralised.** One cancellation flow, one refund from BOBY, and the artist clawback happens behind the scenes. Never route a buyer to an artist.
- **Prices display including 18% VAT, in shekels, as one number** — even for business buyers.

---

## 8. Israeli integration notes

### PayPlus

- Register and get **sandbox credentials before you start Phase 2**. Merchant account approval takes **2–3 weeks of calendar time** and is paperwork-bound — start it in Phase 0.
- Support: card, **bit** (effectively mandatory for Israeli consumers), Apple Pay, Google Pay.
- Payment confirmation comes from the **server-side webhook**, never the browser redirect.
- Test: successful payment, declined card, 3DS challenge, user abandons mid-flow, webhook arrives twice, webhook arrives before the redirect.
- Docs are Hebrew-first. **Read the actual API docs yourself.** Do not let Claude write payment code from memory — have it read the docs in-session and cite the endpoint it's calling.

### Green Invoice (חשבונית ירוקה)

- Issue the tax invoice on payment confirmation.
- **Allocation number (מספר הקצאה)** is required for B2B invoices at or above **₪5,000 pre-VAT** (threshold dropped from ₪10,000 on 1 June 2026). This affects most original-art sales to businesses.
- The request is a real-time call to the Tax Authority. Implement retries with backoff, and **alert loudly on failure** — never silently issue an invoice without a required allocation number.
- Have your accountant verify actual generated invoices before launch. Not samples — real ones.

### Shipping

- Start with **flat-rate size bands**, configured as data:
  - `SMALL` (≤50cm, ≤2kg) — courier ~₪35
  - `MEDIUM` — ~₪55
  - `LARGE` — ~₪90
  - `OVERSIZE_QUOTE` — manual quote flow, no automatic rate
- Free shipping threshold as a config value (suggest ₪400 — free shipping is a major purchase driver in Israel).
- **HFD** is the most e-commerce-oriented courier (door-to-door, lockers, pickup points, national). Cheetah and Baldar are alternatives. Israel Post is cheapest and wrong for fragile work.
- **Fragile items go door-to-door with signature. Never to a locker.**
- Don't build API integration with a courier in v1 — generate labels manually. Automate once you have volume.

---

## 9. Testing checklist

**Before every deploy:**

- [ ] Full purchase flow on a real phone, in Hebrew
- [ ] axe DevTools: zero violations on home, catalogue, artwork, cart, checkout
- [ ] Keyboard-only navigation through the entire purchase
- [ ] Two concurrent add-to-cart on the same unique artwork → second is blocked
- [ ] Prices, dimensions and Latin names inside Hebrew sentences render correctly
- [ ] `/en` mirrors correctly with no broken layout
- [ ] Lighthouse: performance ≥85 mobile, accessibility 100
- [ ] Transactional emails render correctly in Hebrew in Gmail and Apple Mail
- [ ] Webhook replay does not double-decrement stock or double-refund

**Before launch, additionally:**

- [ ] Accessibility auditor (מורשה נגישות) sign-off
- [ ] Lawyer sign-off on terms and artist agreement
- [ ] Accountant verification of a real generated tax invoice
- [ ] Restore a database backup successfully
- [ ] Real ₪5 purchase on production, then refunded
- [ ] Allocation number requested and received on a ≥₪5,000 B2B test invoice

---

## 10. Realistic timeline

| Phase | Duration | Notes |
|---|---|---|
| 0 — Foundation | 2–3 days | |
| 1 — Catalogue | 1–2 weeks | Most of the design effort lives here |
| 2 — Commerce | 2–3 weeks | PayPlus is the long pole |
| 3 — Operations | 1 week | |
| 4 — Compliance | 1 week | **Do not compress this** |
| 5 — Launch | 1 week | |
| **Total build** | **6–9 weeks** | |
| Merchant account approval | 2–3 weeks | **Runs in parallel — start in Phase 0** |
| Accessibility audit | 1–2 weeks | Runs in parallel with Phase 4 |

**Honest expectation:** Claude Code compresses the *building* dramatically — what would be a four-month agency project becomes six to nine weeks. It does **not** compress the integration and compliance tail: merchant approval, accessibility audit, legal review, accountant verification. Those are calendar time, not effort, and they are why you start the paperwork in week one.

---

## 11. First session prompt

Copy this to start:

> I'm building BOBY, a curated Hebrew-first marketplace for Israeli handmade art. Read `CLAUDE.md` and `BUILD-PLAN.md` in full before doing anything. Design mockups from ChatGPT live in `design-reference/` — they are visual reference only, never production code (see Phase 0.5).
>
> We are starting **Phase 0 — Foundation**. Do only the tasks listed under Phase 0. Do not scaffold commerce, products, or anything from later phases.
>
> Critical constraints you must follow:
> - CSS logical properties only — never `left`/`right`. Tailwind logical utilities only.
> - Hebrew is the default locale, unprefixed. English lives at `/en`.
> - WCAG 2.0 AA from the first line of markup — this is a legal requirement in Israel, not a nice-to-have.
> - Use the design tokens exactly as specified in §6, including the two-accent colour system.
>
> When you're done, tell me exactly how to run the Phase 0 acceptance test.

---

## 12. Sources

[Stripe global availability — Israel not supported](https://stripe.com/global) · [Shopify Israel payment gateways](https://www.shopify.com/il/payment-gateways) · [Wix — RTL multilingual limitation](https://support.wix.com/en/article/wix-multilingual-creating-a-multilingual-site-with-right-to-left-content) · [Sharetribe — Stripe country support](https://www.sharetribe.com/help/en/articles/8418388-countries-and-currencies-supported-by-stripe) · [Mercur — open-source Medusa marketplace](https://www.mercurjs.com/) · [Medusa v2](https://medusajs.com/pricing/) · [next-intl routing](https://next-intl.dev/docs/routing/setup) · [W3C — inline bidi markup](https://www.w3.org/International/articles/inline-bidi-markup/) · [MDN — CSS logical properties](https://developer.mozilla.org/docs/Web/CSS/margin-inline) · [Google — multi-regional site structure](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) · [Cloudinary pricing](https://cloudinary.com/pricing) · [Saatchi Art — artist photo standards](https://support.saatchiart.com/hc/en-us/articles/14779569956507-Artist-Best-Practices) · [ForegroundWeb — watermarking pros and cons](https://www.foregroundweb.com/watermarking-pros-cons/) · [IS 5568 part 1 — full text](https://www.isoc.org.il/files/docs/5568.pdf) · [Kol Zchut — website accessibility exemptions](https://www.kolzchut.org.il/he/%D7%A4%D7%98%D7%95%D7%A8_%D7%9E%D7%97%D7%95%D7%91%D7%AA_%D7%94%D7%A0%D7%92%D7%A9%D7%94_%D7%9C%D7%90%D7%AA%D7%A8%D7%99_%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98_%D7%95%D7%90%D7%A4%D7%9C%D7%99%D7%A7%D7%A6%D7%99%D7%95%D7%AA) · [Kol Zchut — distance selling cancellation](https://www.kolzchut.org.il/he/%D7%91%D7%99%D7%98%D7%95%D7%9C_%D7%A2%D7%A1%D7%A7%D7%AA_%D7%9E%D7%9B%D7%A8_%D7%9E%D7%A8%D7%97%D7%95%D7%A7) · [Kol Zchut — non-cancellable transactions](https://www.kolzchut.org.il/he/%D7%A2%D7%A1%D7%A7%D7%94_%D7%A6%D7%A8%D7%9B%D7%A0%D7%99%D7%AA_%D7%A9%D7%9C%D7%90_%D7%A0%D7%99%D7%AA%D7%9F_%D7%9C%D7%91%D7%98%D7%9C) · [Allocation number thresholds 2026](https://vuz.co.il/knowledge-center/allocation-number-thresholds-2026/) · [Green Invoice API docs](https://www.greeninvoice.co.il/api-docs/) · [Grant Thornton — withholding tax](https://www.grantthornton.co.il/insights1/blog/withholding_tax_guide/) · [Barnea — Payment Services Law](https://barlaw.co.il/practice_areas/regulation/capital-markets-regulation/client_updates/israel-regulation-of-payment-services-law-comes-into-effect/) · [Center for Art Law — Paddle8 bankruptcy](https://itsartlaw.org/art-law/a-melting-ice-cube-the-bankruptcy-of-paddle8/) · [HFD e-commerce shipping](https://www.hfd.co.il/en/ecommerce/)
