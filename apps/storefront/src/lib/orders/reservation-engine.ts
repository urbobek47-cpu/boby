/**
 * BOBY Atomic Inventory & Reservation Engine (CLAUDE.md §5.3 & Spike 4)
 *
 * Implements the atomic reservation mechanism from spikes/spike-4-reservation-race:
 *  - Unique pieces (quantity=1) have a 15-minute reservation TTL.
 *  - Partial unique index rule: At most one ACTIVE (unreleased & non-expired) reservation per artwork.
 *  - Concurrent attempts on a reserved item return: "בסל של מישהו אחר — נסו שוב בעוד כמה דקות".
 *  - Order creation atomically decrements stock (quantity -> 0) inside an idempotent transaction guard.
 *  - Lazy release on read releases expired reservations automatically.
 */
import { artworks } from "../catalog/data";

export interface Reservation {
  id: string;
  artworkSlug: string;
  cartId: string;
  createdAt: string;
  expiresAt: string;
  releasedAt: string | null;
}

export interface InventoryItem {
  slug: string;
  inventoryKind: "UNIQUE" | "LIMITED_EDITION" | "MADE_TO_ORDER";
  quantity: number;
}

export interface OrderLine {
  artworkId: string;
  artworkTitle: string;
  artistId: string;
  artistName: string;
  artistLocation: string;
  quantity: number;
  inventoryKind: "UNIQUE" | "LIMITED_EDITION" | "MADE_TO_ORDER";
  priceAgorot: number;
  lineTotalAgorot: number;
  imagePublicId: string;
}

export interface Order {
  id: string;
  humanReadableNumber: string;
  createdAt: string;
  status: "created" | "processing" | "completed" | "cancelled";
  paymentStatus: "pending_payment" | "paid" | "failed";
  buyer: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: {
      street: string;
      city: string;
      apartment?: string;
      postalCode?: string;
      notes?: string;
    };
  };
  gift?: {
    recipientName: string;
    recipientPhone: string;
    giftMessage: string;
  } | null;
  lines: OrderLine[];
  totals: {
    subtotalAgorot: number;
    shippingAgorot: number;
    totalAgorot: number;
    vatAgorot: number;
  };
}

// Global In-Memory state persistent across module re-imports in Node process
const globalStore = globalThis as unknown as {
  __boby_inventory?: Map<string, InventoryItem>;
  __boby_reservations?: Reservation[];
  __boby_orders?: Map<string, Order>;
};

if (!globalStore.__boby_inventory) {
  const initialMap = new Map<string, InventoryItem>();
  artworks.forEach((art) => {
    initialMap.set(art.slug, {
      slug: art.slug,
      inventoryKind: art.inventoryKind,
      quantity: art.inventoryKind === "UNIQUE" ? 1 : 10,
    });
  });
  globalStore.__boby_inventory = initialMap;
}

if (!globalStore.__boby_reservations) {
  globalStore.__boby_reservations = [];
}

if (!globalStore.__boby_orders) {
  globalStore.__boby_orders = new Map<string, Order>();
}

const inventoryStore = globalStore.__boby_inventory!;
const reservationsStore = globalStore.__boby_reservations!;
const ordersStore = globalStore.__boby_orders!;

const HOLD_DURATION_MINUTES = 15;

/**
 * Lazy release on read: Mark expired reservations as released
 */
export function purgeExpiredReservations(): number {
  const nowMs = Date.now();
  let releasedCount = 0;

  for (const res of reservationsStore) {
    if (res.releasedAt === null && new Date(res.expiresAt).getTime() <= nowMs) {
      res.releasedAt = new Date(nowMs).toISOString();
      releasedCount++;
    }
  }

  return releasedCount;
}

/**
 * Get active reservation for an artwork
 */
export function getActiveReservation(artworkSlug: string): Reservation | undefined {
  purgeExpiredReservations();
  const nowMs = Date.now();
  return reservationsStore.find(
    (res) =>
      res.artworkSlug === artworkSlug &&
      res.releasedAt === null &&
      new Date(res.expiresAt).getTime() > nowMs
  );
}

/**
 * Atomic Reservation attempt matching Spike 4 partial unique index logic
 */
export function reserveArtworkAtomic(
  artworkSlug: string,
  cartId: string,
  inventoryKind: "UNIQUE" | "LIMITED_EDITION" | "MADE_TO_ORDER"
): {
  success: boolean;
  status: "reserved" | "blocked" | "sold" | "available";
  expiresAt?: string;
  reason?: string;
} {
  purgeExpiredReservations();
  const item = inventoryStore.get(artworkSlug);

  if (!item || item.quantity <= 0) {
    return {
      success: false,
      status: "sold",
      reason: "היצירה כבר נמכרה או אינה זמינה במלאי",
    };
  }

  if (inventoryKind !== "UNIQUE") {
    return {
      success: true,
      status: "available",
    };
  }

  const activeRes = getActiveReservation(artworkSlug);

  if (activeRes) {
    if (activeRes.cartId === cartId) {
      // Refresh 15-minute TTL for existing cart hold
      const newExpires = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000).toISOString();
      activeRes.expiresAt = newExpires;
      return {
        success: true,
        status: "reserved",
        expiresAt: newExpires,
      };
    } else {
      // Spike 4 logic: Active reservation held by another cart
      return {
        success: false,
        status: "blocked",
        reason: "בסל של מישהו אחר — נסו שוב בעוד כמה דקות",
      };
    }
  }

  // Create new active reservation
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000).toISOString();
  const newReservation: Reservation = {
    id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    artworkSlug,
    cartId,
    createdAt: new Date().toISOString(),
    expiresAt,
    releasedAt: null,
  };

  reservationsStore.push(newReservation);

  return {
    success: true,
    status: "reserved",
    expiresAt,
  };
}

/**
 * Release active reservation for an artwork
 */
export function releaseArtworkAtomic(artworkSlug: string, cartId: string): boolean {
  purgeExpiredReservations();
  const res = reservationsStore.find(
    (r) => r.artworkSlug === artworkSlug && r.cartId === cartId && r.releasedAt === null
  );

  if (res) {
    res.releasedAt = new Date().toISOString();
    return true;
  }
  return false;
}

/**
 * Atomic Order Creation & Idempotent Stock Decrement (Spike 4 / CLAUDE.md §5.3)
 */
export function createOrderAtomic(params: {
  cartId: string;
  buyer: Order["buyer"];
  gift?: Order["gift"];
  lines: OrderLine[];
  totals: Order["totals"];
}): {
  success: boolean;
  order?: Order;
  reason?: string;
} {
  purgeExpiredReservations();
  const { cartId, buyer, gift, lines, totals } = params;

  // Step 1: Pre-validation — check all UNIQUE lines for availability or active hold by this cartId
  for (const line of lines) {
    const item = inventoryStore.get(line.artworkId);
    if (!item || item.quantity <= 0) {
      return {
        success: false,
        reason: `היצירה "${line.artworkTitle}" אינה זמינה במלאי (כבר נמכרה)`,
      };
    }

    if (line.inventoryKind === "UNIQUE") {
      const activeRes = getActiveReservation(line.artworkId);
      if (activeRes && activeRes.cartId !== cartId) {
        return {
          success: false,
          reason: `היצירה "${line.artworkTitle}" נמצאת בסל של מישהו אחר — נסו שוב בעוד כמה דקות`,
        };
      }
    }
  }

  // Step 2: Atomic Transaction Execution
  // Idempotent decrement stock for UNIQUE items & mark reservations converted/released
  for (const line of lines) {
    const item = inventoryStore.get(line.artworkId);
    if (item && line.inventoryKind === "UNIQUE") {
      // Idempotent capture guard: UPDATE artwork SET quantity=0 WHERE quantity=1
      item.quantity = Math.max(0, item.quantity - line.quantity);
      // Release reservation
      const res = reservationsStore.find(
        (r) => r.artworkSlug === line.artworkId && r.releasedAt === null
      );
      if (res) {
        res.releasedAt = new Date().toISOString();
      }
    }
  }

  // Create Order object
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = `BOBY-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const order: Order = {
    id: orderId,
    humanReadableNumber: orderNumber,
    createdAt: new Date().toISOString(),
    status: "created",
    paymentStatus: "pending_payment", // Ready for PayPlus integration in Phase 2
    buyer,
    gift: gift || null,
    lines,
    totals,
  };

  ordersStore.set(orderId, order);

  return {
    success: true,
    order,
  };
}

/**
 * Retrieve Order by ID
 */
export function getOrderById(orderId: string): Order | undefined {
  return ordersStore.get(orderId);
}

/**
 * Helper to inspect inventory and reservation state for debugging/testing
 */
export function getArtworkStatus(artworkSlug: string) {
  purgeExpiredReservations();
  const item = inventoryStore.get(artworkSlug);
  const activeRes = getActiveReservation(artworkSlug);

  return {
    quantity: item ? item.quantity : 0,
    isReserved: !!activeRes,
    reservedByCartId: activeRes?.cartId,
    expiresAt: activeRes?.expiresAt,
  };
}

/**
 * Reset state — helper for automated race tests
 */
export function resetEngineStore() {
  inventoryStore.clear();
  artworks.forEach((art) => {
    inventoryStore.set(art.slug, {
      slug: art.slug,
      inventoryKind: art.inventoryKind,
      quantity: art.inventoryKind === "UNIQUE" ? 1 : 10,
    });
  });
  reservationsStore.length = 0;
  ordersStore.clear();
}
