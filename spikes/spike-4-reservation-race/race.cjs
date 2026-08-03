/*
 * Spike 4 — qty=1 reservation race (CLAUDE.md §5.3).
 *
 * Proves the concurrency mechanism behind the reservation rule: two SIMULTANEOUS
 * add-to-cart attempts on a UNIQUE (qty=1) artwork must resolve to exactly one
 * winner; the second is blocked. Must hold 5/5 under genuinely concurrent
 * requests.
 *
 * It runs two mechanisms head to head so the choice justifies itself:
 *   NAIVE  — check-then-insert (SELECT, then INSERT). The bug we must avoid.
 *   ATOMIC — a partial unique index `reservation(artwork_id) WHERE released_at
 *            IS NULL` + `INSERT ... ON CONFLICT DO NOTHING`. Race-safe in the DB.
 *
 * Plus two supporting guarantees from §5.3:
 *   - idempotent capture (stock decrement) survives a webhook replay.
 *   - an expired reservation (TTL) is released and frees the item.
 *
 * Genuine concurrency: each attempt uses its own pooled connection, and both are
 * fired with Promise.all. The naive path holds a real gap between check and
 * insert so the race is not accidentally serialized.
 *
 * Run:  node race.cjs   (PG_MODULE + DATABASE_URL provided via env)
 */
const { Pool } = require(process.env.PG_MODULE);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

const RUNS = 5;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let artworkSeq = 0;

async function q(sql, params) {
  const c = await pool.connect();
  try {
    return await c.query(sql, params);
  } finally {
    c.release();
  }
}

async function setup() {
  await q(`DROP SCHEMA IF EXISTS spike4 CASCADE`);
  await q(`CREATE SCHEMA spike4`);
  await q(`
    CREATE TABLE spike4.artwork (
      id            text PRIMARY KEY,
      inventory_kind text NOT NULL,
      quantity      int  NOT NULL
    )`);
  // Two reservation tables so the naive path has no DB safety net to lean on.
  await q(`
    CREATE TABLE spike4.reservation_naive (
      id         bigserial PRIMARY KEY,
      artwork_id text NOT NULL,
      cart_id    text NOT NULL,
      expires_at timestamptz NOT NULL,
      released_at timestamptz
    )`);
  await q(`
    CREATE TABLE spike4.reservation_safe (
      id         bigserial PRIMARY KEY,
      artwork_id text NOT NULL,
      cart_id    text NOT NULL,
      expires_at timestamptz NOT NULL,
      released_at timestamptz
    )`);
  // THE mechanism: at most one ACTIVE (unreleased) reservation per artwork.
  await q(`
    CREATE UNIQUE INDEX one_active_res_per_artwork
    ON spike4.reservation_safe (artwork_id)
    WHERE released_at IS NULL`);
}

async function freshArtwork() {
  const id = `art_${++artworkSeq}_${Date.now()}`;
  await q(
    `INSERT INTO spike4.artwork (id, inventory_kind, quantity) VALUES ($1,'UNIQUE',1)`,
    [id],
  );
  return id;
}

/* NAIVE reserve — check, gap, then insert. No atomicity. */
async function reserveNaive(artworkId, cartId) {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const { rows } = await c.query(
      `SELECT 1 FROM spike4.reservation_naive
        WHERE artwork_id=$1 AND released_at IS NULL`,
      [artworkId],
    );
    // Real gap: both concurrent callers pass the check before either inserts.
    await sleep(25);
    if (rows.length > 0) {
      await c.query("ROLLBACK");
      return "blocked";
    }
    await c.query(
      `INSERT INTO spike4.reservation_naive (artwork_id, cart_id, expires_at)
       VALUES ($1,$2, now() + interval '15 minutes')`,
      [artworkId, cartId],
    );
    await c.query("COMMIT");
    return "reserved";
  } catch (e) {
    await c.query("ROLLBACK").catch(() => {});
    return "error:" + e.code;
  } finally {
    c.release();
  }
}

/* ATOMIC reserve — single statement, DB arbitrates the winner. */
async function reserveSafe(artworkId, cartId) {
  try {
    const res = await q(
      `INSERT INTO spike4.reservation_safe (artwork_id, cart_id, expires_at)
       SELECT $1, $2, now() + interval '15 minutes'
       WHERE EXISTS (
         SELECT 1 FROM spike4.artwork
          WHERE id=$1 AND inventory_kind='UNIQUE' AND quantity=1
       )
       ON CONFLICT (artwork_id) WHERE released_at IS NULL DO NOTHING
       RETURNING id`,
      [artworkId, cartId],
    );
    return res.rowCount === 1 ? "reserved" : "blocked";
  } catch (e) {
    return "error:" + e.code;
  }
}

async function activeCount(table, artworkId) {
  const { rows } = await q(
    `SELECT count(*)::int AS n FROM spike4.${table}
      WHERE artwork_id=$1 AND released_at IS NULL`,
    [artworkId],
  );
  return rows[0].n;
}

async function raceOnce(reserveFn, table) {
  const artworkId = await freshArtwork();
  // Two simultaneous add-to-cart calls from different carts.
  const [a, b] = await Promise.all([
    reserveFn(artworkId, "cart_A"),
    reserveFn(artworkId, "cart_B"),
  ]);
  const active = await activeCount(table, artworkId);
  const winners = [a, b].filter((r) => r === "reserved").length;
  return { a, b, winners, active };
}

async function idempotentCapture() {
  // Capture = decrement qty to 0, conditional + single-statement. A replayed
  // webhook must not double-decrement.
  const id = await freshArtwork();
  const cap = () =>
    q(`UPDATE spike4.artwork SET quantity=0 WHERE id=$1 AND quantity=1`, [id]);
  const first = (await cap()).rowCount; // 1 = decremented
  const replay = (await cap()).rowCount; // 0 = no-op (already captured)
  const { rows } = await q(`SELECT quantity FROM spike4.artwork WHERE id=$1`, [id]);
  return { first, replay, finalQuantity: rows[0].quantity };
}

async function ttlExpiryReleasesItem() {
  const id = await freshArtwork();
  // cart_A reserves, but the reservation is already expired.
  await q(
    `INSERT INTO spike4.reservation_safe (artwork_id, cart_id, expires_at)
     VALUES ($1,'cart_A', now() - interval '1 minute')`,
    [id],
  );
  // Lazy release on read: mark expired active reservations released.
  await q(
    `UPDATE spike4.reservation_safe SET released_at = now()
      WHERE artwork_id=$1 AND released_at IS NULL AND expires_at < now()`,
    [id],
  );
  // Now cart_B can reserve the freed item.
  const second = await reserveSafe(id, "cart_B");
  return { secondReserveAfterExpiry: second };
}

(async () => {
  await setup();
  const summary = { naive: [], safe: [], naiveDoubleBooked: 0, safeExactlyOne: 0 };

  console.log(`\n=== NAIVE check-then-insert (${RUNS} runs) ===`);
  for (let i = 0; i < RUNS; i++) {
    const r = await raceOnce(reserveNaive, "reservation_naive");
    const doubled = r.active > 1;
    if (doubled) summary.naiveDoubleBooked++;
    summary.naive.push(r);
    console.log(
      `  run ${i + 1}: A=${r.a} B=${r.b} winners=${r.winners} active=${r.active} ${
        doubled ? "❌ DOUBLE-BOOKED" : "ok"
      }`,
    );
  }

  console.log(`\n=== ATOMIC partial-unique-index + ON CONFLICT (${RUNS} runs) ===`);
  for (let i = 0; i < RUNS; i++) {
    const r = await raceOnce(reserveSafe, "reservation_safe");
    const ok = r.winners === 1 && r.active === 1;
    if (ok) summary.safeExactlyOne++;
    summary.safe.push(r);
    console.log(
      `  run ${i + 1}: A=${r.a} B=${r.b} winners=${r.winners} active=${r.active} ${
        ok ? "✅ exactly one" : "❌ FAIL"
      }`,
    );
  }

  console.log(`\n=== idempotent capture (webhook replay) ===`);
  const cap = await idempotentCapture();
  const capOk = cap.first === 1 && cap.replay === 0 && cap.finalQuantity === 0;
  console.log(
    `  first=${cap.first} replay=${cap.replay} finalQty=${cap.finalQuantity} ${
      capOk ? "✅ idempotent" : "❌ FAIL"
    }`,
  );

  console.log(`\n=== TTL expiry releases the item ===`);
  const ttl = await ttlExpiryReleasesItem();
  const ttlOk = ttl.secondReserveAfterExpiry === "reserved";
  console.log(
    `  reserve after expiry = ${ttl.secondReserveAfterExpiry} ${
      ttlOk ? "✅ freed" : "❌ FAIL"
    }`,
  );

  console.log(`\n=== VERDICT ===`);
  const safePass = summary.safeExactlyOne === RUNS;
  const naiveShowsBug = summary.naiveDoubleBooked > 0;
  console.log(`  ATOMIC: ${summary.safeExactlyOne}/${RUNS} exactly-one-winner  ${safePass ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  NAIVE : ${summary.naiveDoubleBooked}/${RUNS} double-booked      ${naiveShowsBug ? "(demonstrates the bug the atomic path prevents)" : "(no race observed this run)"}`);
  console.log(`  idempotent capture: ${capOk ? "✅" : "❌"}   TTL release: ${ttlOk ? "✅" : "❌"}`);

  await pool.end();
  const overall = safePass && capOk && ttlOk;
  console.log(`\nSPIKE4_RESULT=${overall ? "PASS" : "FAIL"}\n`);
  process.exit(overall ? 0 : 1);
})().catch((e) => {
  console.error("spike4 crashed:", e);
  process.exit(2);
});
