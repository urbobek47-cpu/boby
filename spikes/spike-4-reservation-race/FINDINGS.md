# Spike 4 — qty=1 reservation race

**Goal (BUILD-PLAN Phase 0.75):** two simultaneous reservations on a qty=1 item → the second is blocked, under genuinely concurrent requests, **5/5**. Implements CLAUDE.md §5.3.

**Verdict: PASS.** Run `node race.cjs` (env: `PG_MODULE`, `DATABASE_URL`).

## Result

```
NAIVE  check-then-insert : 5/5 DOUBLE-BOOKED   (the bug — unique piece sold twice)
ATOMIC index + ON CONFLICT: 5/5 exactly-one-winner (second blocked; winner alternates A/B)
idempotent capture (replay): first=1 replay=0 finalQty=0  ✅
TTL expiry releases item   : reserve after expiry = reserved  ✅
SPIKE4_RESULT=PASS
```

The concurrency is **genuine**: both attempts fire together (`Promise.all`), each on its own pooled connection, and the naive path holds a real check→insert gap. The proof that they truly overlap is that the naive path double-books 5/5 — if the calls were serialized, it couldn't. The atomic path is exposed to the *same* overlap and still blocks the second every time.

## The mechanism (carry into Phase 2)

A reservation row per active hold, with a **partial unique index** that permits at most one *unreleased* reservation per artwork, and an atomic insert that lets the database pick the winner:

```sql
CREATE UNIQUE INDEX one_active_res_per_artwork
  ON reservation (artwork_id)
  WHERE released_at IS NULL;

-- reserve: exactly one of two concurrent callers gets rowCount = 1
INSERT INTO reservation (artwork_id, cart_id, expires_at)
SELECT $artwork, $cart, now() + interval '15 minutes'
WHERE EXISTS (SELECT 1 FROM artwork
               WHERE id=$artwork AND inventory_kind='UNIQUE' AND quantity=1)
ON CONFLICT (artwork_id) WHERE released_at IS NULL DO NOTHING
RETURNING id;          -- rowCount 1 = reserved, 0 = blocked (or ineligible)
```

Why not the alternatives:
- **check-then-insert** (SELECT then INSERT): demonstrated to double-book 5/5. Never use it.
- `SELECT … FOR UPDATE` on the artwork row also works (pessimistic) but serializes and needs a held transaction; the partial-unique-index approach is a single statement, no held lock, and models the "reservation row + TTL" of §5.3 directly.

## §5.3 guarantees demonstrated

| §5.3 requirement | Shown |
|---|---|
| No two carts hold a reservation for the same UNIQUE artwork | ✅ partial unique index, 5/5 |
| Stock decrement at capture is idempotent | ✅ conditional `UPDATE … WHERE quantity=1`; replay = 0 rows |
| Expired reservations are released (TTL) | ✅ lazy release on read frees the item |
| Honest "blocked" outcome (not an error) | ✅ blocked returns cleanly, no exception |

## Phase 2 implementation notes

- The reservation lives in **our** schema (Postgres/Prisma or a Medusa module), not in Mercur — it gates *add-to-cart* for `inventoryKind = UNIQUE` before the cart/checkout that spike 3 covers.
- TTL = 15 min (§5.3), extended when checkout begins. Release path is **both** a background sweeper **and** lazy release on read (as tested).
- Capture-time decrement must be inside the payment-capture transaction and idempotent against webhook replay (spike 3's PayPlus webhook path). The conditional `UPDATE … WHERE quantity=1` pattern here is that guard.
- UI copy on block: "בסל של מישהו אחר — נסו שוב בעוד כמה דקות" (never "sold").
- The race test itself becomes a **permanent regression test** in Phase 2 (§5.3 mandates automated race tests).

## Cleanup

Isolated in a `spike4` schema in the `boby_mercur` DB (the script `DROP`s + recreates it each run). Nothing in Mercur's schema is touched. `race.cjs` is kept as the reference pattern (tiny, no committed deps; it borrows `pg` from the spike-3 install via `PG_MODULE`).
