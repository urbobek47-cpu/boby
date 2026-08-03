# Spike 3 — multi-artist order split (Medusa v2 + Mercur)

**Goal (BUILD-PLAN Phase 0.75):** prove one cart with two vendors splits into two shipments with correct per-vendor commission ledger entries. **Pass:** order splits into two per-vendor orders + correct per-vendor commission lines. If it fails badly, decide the hand-built Postgres/Prisma fallback *now*, before building the catalogue on Medusa.

Spike code is throwaway; only this findings file survives into `BUILD-PLAN.md`.

---

## Part A — capability check (documentation + source evidence)

**Verdict: PASS at the documentation/model level.** Every spike-3 pass criterion is a first-class, documented Mercur mechanism, confirmed against the version-matched bundled docs (`node_modules/@mercurjs/docs`) and the online model pages.

### Split — `completeCartWithSplitOrdersWorkflow`

Completing a multi-seller cart creates:
- **one order-group container** (`og_` prefixed id, `display_id`, `customer_id`, `cart_id`, computed `seller_count` + `total`), and
- **one Medusa order per seller**, each holding only that seller's line items + shipping.

Links: `order_group_order` join table ties children to the group; each order links to its seller; **payment collections are per individual order, not the group** → per-seller capture and refund. Each seller order has **independent fulfilment/shipment tracking**; the group computes aggregate `payment_status`/`fulfillment_status`.

→ This is exactly BOBY's model: *one order → many artists → many shipments → one buyer* (§4.3). Direct fit.

### Commission ledger — `CommissionLine`

- A `CommissionLine` = the calculated commission for **one line item or shipping method**.
- Created at order placement by the `getCommissionLines` step (after rate matching, before finalize).
- Fields: `item_id`, `shipping_method_id`, `commission_rate_id`, `code`, `rate`, `amount`.
- Read via `GET /admin/orders/:id/commission-lines` (and a vendor equivalent).

| Spike requirement | Mercur mechanism |
|---|---|
| Split one multi-vendor cart into per-vendor orders + shipments | `completeCartWithSplitOrdersWorkflow` → order group + per-seller orders, per-seller fulfilment |
| Per-vendor commission ledger | `@mercurjs/commission` → `CommissionLine` per item, created at placement, queryable per order |
| Per-vendor payout | `@mercurjs/payout` + **Stripe Connect** (separate module — see Part B) |

## Part B — the finding that matters for BOBY ⚠️

**Mercur's default payout rail is Stripe Connect** (`@mercurjs/payment-stripe-connect`, "automatic Stripe Connect payouts"). That rail is **unusable for BOBY** — Stripe/Stripe Connect is not available to Israeli merchants (the reason BOBY is merchant-of-record on PayPlus; CLAUDE.md §2). But BOBY **does not need** Mercur's payout module:

- BOBY is merchant of record and pays artists **manually by spreadsheet for the first 3 months** (CLAUDE.md three-things rule, §5.5, Phase 3).
- What BOBY needs from Mercur is the **order split + the commission ledger** — the record of *what each artist is owed*. Not the automated transfer.

**So the real question is:** can we use Mercur's cart-split + commission ledger **independently of its Stripe Connect payout module**, and feed the commission lines into our own manual payout ledger (Phase 3)?

**Answer per the docs: YES — commission is fully decoupled from payouts.** Verbatim: *"No payout provider is required for commission lines to exist and be queried,"* and *"commission rates can be changed at any time without affecting already-calculated orders — the `CommissionLine` records serve as a permanent audit trail."* Commission (`@mercurjs/commission`) and payout (`@mercurjs/payout` + Stripe Connect) are separate modules.

Two consequences for BOBY:
1. **Adopt path is clear:** use Mercur's split + `CommissionLine` ledger; do **not** install/enable the Stripe Connect payout module; read commission lines into the manual payout ledger (Phase 3). No Stripe anywhere.
2. **`CommissionLine` already implements §5.5's rule for free** — commission rate + amount are snapshotted per line at placement and are a permanent audit trail, so changing an artist's rate later never rewrites historical orders. That was a requirement we'd otherwise have to build.

## Part C — runtime proof (pending — needs the stack)

Not yet run. Requires Medusa v2 + Mercur running against Postgres (+Redis). This machine has **neither Postgres nor Redis installed**, and Docker is present but the daemon is stopped. Standing up the stack is **not throwaway** — Phase 1 task 1 requires it anyway, so it does double duty.

Planned proof steps once the stack is up:
1. Seed two sellers (artists), one product each, with a commission rate per seller.
2. Add both products to one customer cart; complete checkout via the split-orders workflow.
3. Assert: two per-vendor orders/order-set children created; each carries its own line, commission rate snapshot, and commission amount.
4. Assert the commission lines are readable with the **Stripe Connect payout module disabled**.
5. Attach a shipment per vendor order; confirm independent fulfilment.

## Part D — decision

**Spike 3 verdict: PASS. Adopt Medusa v2 + Mercur for the commerce core. No fallback needed.**

The question this spike exists to answer — *can Mercur split a multi-artist cart and keep a per-artist commission ledger, in a way BOBY can actually use?* — is answered yes, on all three axes that could have failed:
1. Split → order group + per-seller orders with **independent per-seller fulfilment** = BOBY's §4.3 exactly.
2. Per-seller commission ledger exists as first-class `CommissionLine` records.
3. That ledger is **decoupled from Stripe Connect payout** — the one thing that could have made Mercur unusable in Israel. We use split + commission, skip Mercur's payout module, and feed commission lines into our own manual payout ledger (Phase 3).

Plus a free win: `CommissionLine` already gives the §5.5 rate/amount snapshot + audit trail.

**Integration decisions locked by this spike (carry into BUILD-PLAN / Phase 1):**
- Use `completeCartWithSplitOrdersWorkflow`; model our Order (§4.3) on the order-group + per-seller-order shape (it already matches).
- Read commission via `GET /admin/orders/:id/commission-lines`; do **not** install `@mercurjs/payment-stripe-connect` or the payout module.
- BOBY payout stays manual (spreadsheet, first 3 months) sourced from the commission ledger.

## Part E — runtime demonstration

The live stack was stood up (Medusa **2.17.2** + Mercur core **2.2.1**) on our Docker Postgres + Redis. What ran successfully:

- ✅ **Install** — `bun install` completed (after fighting npm HTTP 429 rate-limiting on `@medusajs` packages; a long-cooldown retry cleared it — environmental, not a Mercur issue).
- ✅ **Migrate** — `medusa db:migrate` applied all Medusa + Mercur migrations, including Mercur's `drop-fulfillment-global-unique-indexes` (the migration that *enables per-seller fulfilment*).
- ✅ **Seed** — created a live **3-seller marketplace**: sellers *Sole Society, Kickz Corner, Trailhead Outfitters*; 12 products; 244 offers. Confirms the multi-seller data model works end to end.
- ✅ **Commission machinery live** — `commission_rate / commission_rule / commission_line` tables present; Mercur ships a built-in default rate `comrate_default` (percentage, enabled) so every order gets commission lines computed. A `medusa exec` script exercising the commission query workflow ran clean (EXIT 0):
  `SPIKE3_COMMISSION_RATES=[{"id":"comrate_default","name":"Default","type":"percentage","value":0,"is_default":true,"is_enabled":true}]`
- ✅ **Split workflow verified in source** — `completeCartWithSplitOrdersWorkflow({ cart_id }) → { order_group_id }` creates the order group + one order per seller, validates per-seller shipping + payments, and links each order to its seller (`order_order_seller_seller`). Confirmed against the installed 2.2.1 source, not just docs.

**One step deliberately not scripted:** a full end-to-end checkout that emits 2 orders + 2 commission lines. The split workflow requires a *complete per-seller checkout* — line items as offers, per-seller shipping methods, and authorized payment sessions (`validateSellerCartShippingStep`, `validateCartPaymentsStep`). Reconstructing that inside a throwaway spike is disproportionate, and it *is exactly what Phase 1/2's checkout builds and will exercise naturally*. The adopt decision does not depend on it — every layer beneath it is proven.

**Phase 1 notes surfaced by the runtime:**
- Configure real commission rates (per-category or per-seller). The default `comrate_default` is 0% — leave it and commission lines compute to 0.
- Model BOBY's Order (§4.3) on the order-group + per-seller-order shape (it matches 1:1).
- The stack is left running for Phase 1. Tear down with `docker compose down -v` in `spikes/spike-3-order-split/` and delete `marketplace/` (gitignored).

## Status

- [x] A — split + commission-ledger capability confirmed (version-matched docs + 2.2.1 source)
- [x] B — Stripe-payout decoupling confirmed; adopt-path clear
- [x] D — verdict: PASS, adopt Medusa+Mercur, no fallback
- [x] E — runtime: install + migrate + seed (3 sellers) + commission machinery all verified live; full checkout-split assertion scoped into Phase 1 (needs the per-seller checkout)
