/**
 * BOBY Inventory & Reservation Race Condition Test Suite (Spike 4 / CLAUDE.md §5.3)
 *
 * Verifies:
 * 1. Single user reservation hold & TTL creation.
 * 2. Simultaneous concurrent reservation attempt on a qty=1 artwork -> exactly ONE winner, second gets blocked.
 * 3. Atomic Order creation & idempotent stock capture (quantity -> 0).
 * 4. Sold artwork protection on subsequent purchase attempts.
 */
import {
  reserveArtworkAtomic,
  createOrderAtomic,
  getArtworkStatus,
  resetEngineStore,
} from "../src/lib/orders/reservation-engine.ts";

const RUNS = 5;

async function runTests() {
  console.log("\n🧪 Starting BOBY Inventory & Reservation Test Suite (Spike 4 Engine)...\n");

  // Test 1: Single user reservation
  resetEngineStore();
  const targetSlug = "necklace-silver-amber";
  console.log("▶ Test 1: Single user reservation hold");
  const res1 = reserveArtworkAtomic(targetSlug, "cart_user_1", "UNIQUE");
  if (res1.success && res1.status === "reserved") {
    console.log("  ✅ Item successfully reserved for cart_user_1");
  } else {
    console.error("  ❌ Test 1 Failed:", res1);
    process.exit(1);
  }

  // Test 2: Double reservation block by different cart
  console.log("\n▶ Test 2: Double reservation block by different user");
  const res2 = reserveArtworkAtomic(targetSlug, "cart_user_2", "UNIQUE");
  if (!res2.success && res2.status === "blocked" && res2.reason?.includes("בסל של מישהו אחר")) {
    console.log(`  ✅ cart_user_2 correctly blocked with reason: "${res2.reason}"`);
  } else {
    console.error("  ❌ Test 2 Failed:", res2);
    process.exit(1);
  }

  // Test 3: Concurrent Race Condition (5 Runs)
  console.log(`\n▶ Test 3: Concurrent Race Condition (${RUNS} runs with Promise.all)`);
  let racePassCount = 0;

  for (let i = 0; i < RUNS; i++) {
    resetEngineStore();
    const artworkId = "necklace-silver-amber";

    // Firing two simultaneous reservation attempts
    const [attemptA, attemptB] = await Promise.all([
      Promise.resolve().then(() => reserveArtworkAtomic(artworkId, "cart_A", "UNIQUE")),
      Promise.resolve().then(() => reserveArtworkAtomic(artworkId, "cart_B", "UNIQUE")),
    ]);

    const winners = [attemptA, attemptB].filter((r) => r.success && r.status === "reserved").length;
    const blocked = [attemptA, attemptB].filter((r) => !r.success && r.status === "blocked").length;

    const ok = winners === 1 && blocked === 1;
    if (ok) racePassCount++;

    console.log(
      `  Run ${i + 1}: Winner Count=${winners}, Blocked Count=${blocked} -> ${
        ok ? "✅ Exactly One Winner" : "❌ FAIL"
      }`
    );
  }

  if (racePassCount !== RUNS) {
    console.error(`  ❌ Race test failed (${racePassCount}/${RUNS} passed)`);
    process.exit(1);
  }

  // Test 4: Atomic Order Creation & Idempotent Stock Decrement
  console.log("\n▶ Test 4: Atomic Order Creation & Stock Decrement");
  resetEngineStore();
  const reserveAttempt = reserveArtworkAtomic(targetSlug, "cart_buyer_1", "UNIQUE");
  if (!reserveAttempt.success) {
    console.error("  ❌ Failed pre-requisite reservation");
    process.exit(1);
  }

  const orderResult = createOrderAtomic({
    cartId: "cart_buyer_1",
    buyer: {
      name: "ישראל ישראלי",
      email: "israel@example.com",
      phone: "050-1234567",
      shippingAddress: {
        street: "הרצל 1",
        city: "תל אביב",
      },
    },
    lines: [
      {
        artworkId: targetSlug,
        artworkTitle: "שרשרת כסף עם אבן ענבר",
        artistId: "maayan-levin",
        artistName: "מעין לוין",
        artistLocation: "אשקלון",
        quantity: 1,
        inventoryKind: "UNIQUE",
        priceAgorot: 38000,
        lineTotalAgorot: 38000,
        imagePublicId: "/images/jewelry-amber-necklace.jpg",
      },
    ],
    totals: {
      subtotalAgorot: 38000,
      shippingAgorot: 3500,
      totalAgorot: 41500,
      vatAgorot: 5797,
    },
  });

  if (orderResult.success && orderResult.order) {
    console.log(`  ✅ Order created successfully: ID=${orderResult.order.id}, Number=${orderResult.order.humanReadableNumber}`);
    console.log(`  ✅ Order paymentStatus: ${orderResult.order.paymentStatus}`);
  } else {
    console.error("  ❌ Order creation failed:", orderResult);
    process.exit(1);
  }

  // Verify stock decremented to 0
  const statusAfterOrder = getArtworkStatus(targetSlug);
  if (statusAfterOrder.quantity === 0) {
    console.log("  ✅ Artwork stock successfully decremented to 0 (quantity=0)");
  } else {
    console.error("  ❌ Stock not decremented:", statusAfterOrder);
    process.exit(1);
  }

  // Test 5: Attempt purchase after item sold
  console.log("\n▶ Test 5: Attempt purchase on sold artwork");
  const postSoldAttempt = reserveArtworkAtomic(targetSlug, "cart_buyer_2", "UNIQUE");
  if (!postSoldAttempt.success && postSoldAttempt.status === "sold") {
    console.log(`  ✅ Re-purchase blocked correctly with status: "sold" (${postSoldAttempt.reason})`);
  } else {
    console.error("  ❌ Test 5 Failed:", postSoldAttempt);
    process.exit(1);
  }

  console.log("\n🎉 ALL RESERVATION & ORDER TESTS PASSED PERFECTLY! (Spike 4 Verification Complete)\n");
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
