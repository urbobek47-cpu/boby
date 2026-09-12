/**
 * BOBY Real Artwork Submission Test Suite
 *
 * Verifies:
 * 1. Creation of a full custom Artwork object with real images (Data URL base64).
 * 2. Registration in catalog data layer (getArtworkBySlug, listArtworks).
 * 3. Inventory registration in reservation engine.
 * 4. Ability to reserve and purchase the newly published artwork.
 */
import { addCustomArtwork, getArtworkBySlug, listArtworks } from "../src/lib/catalog/data.ts";
import { reserveArtworkAtomic, createOrderAtomic, resetEngineStore, registerArtworkInventory } from "../src/lib/orders/reservation-engine.ts";

async function runTest() {
  console.log("\n🧪 Starting Real Artwork Submission Test Suite...\n");

  resetEngineStore();

  const testSlug = `custom-ceramic-vase-${Date.now()}`;
  const sampleDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  const newArtwork = {
    slug: testSlug,
    title: { he: "אגרטל קרמיקה גלילי", en: "Galilee Ceramic Vase" },
    story: {
      he: "אגרטל פיסולי שנשרף בשריפת עץ מסורתית בסטודיו בפרדס חנה. הראקו היפני והגלזורה המקומית מעניקים לו גוונים ייחודיים.",
      en: "Sculptural vase wood-fired in traditional studio.",
    },
    materials: {
      he: ["חימר אדום מקומי", "גלזורת ראקו"],
      en: ["Local red clay", "Raku glaze"],
    },
    discipline: "ceramics",
    category: { he: "קרמיקה וקדרות", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    dimensions: {
      heightCm: 25,
      widthCm: 16,
      depthCm: 16,
      weightGrams: 1400,
    },
    priceAgorot: 52000, // ₪520.00
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      {
        publicId: sampleDataUrl,
        aspectRatio: 0.8,
        role: "primary",
        caption: { he: "מבט פרופיל", en: "Profile view" },
      },
      {
        publicId: sampleDataUrl,
        aspectRatio: 0.8,
        role: "detail",
        caption: { he: "תקריב מרקם", en: "Texture detail" },
      },
    ],
    artist: {
      slug: "studio-gallilee",
      displayName: { he: "סטודיו גליל", en: "Galilee Studio" },
      location: { he: "פרדס חנה", en: "Pardes Hanna" },
      bio: { he: "אמן קרמיקה יוצר", en: "Ceramic artist" },
      portraitPublicId: null,
    },
  };

  // Step 1: Add artwork to catalog
  console.log("▶ Step 1: Publishing custom artwork to catalog");
  addCustomArtwork(newArtwork);
  registerArtworkInventory(newArtwork.slug, newArtwork.inventoryKind, 1);

  // Step 2: Retrieve artwork by slug
  console.log("▶ Step 2: Retrieving published artwork by slug");
  const retrieved = await getArtworkBySlug(testSlug);

  if (retrieved && retrieved.title.he === "אגרטל קרמיקה גלילי") {
    console.log(`  ✅ Successfully retrieved artwork by slug: "${retrieved.title.he}"`);
    console.log(`  ✅ Image count: ${retrieved.images.length}, Price: ₪${retrieved.priceAgorot / 100}`);
  } else {
    console.error("  ❌ Step 2 Failed: Artwork not found in catalog", retrieved);
    process.exit(1);
  }

  // Step 3: Verify artwork in full catalogue list
  console.log("\n▶ Step 3: Verifying presence in full catalogue list");
  const allWorks = await listArtworks();
  const existsInList = allWorks.some((a) => a.slug === testSlug);

  if (existsInList) {
    console.log(`  ✅ Artwork present in catalogue listing (Total artworks: ${allWorks.length})`);
  } else {
    console.error("  ❌ Step 3 Failed: Artwork missing from listArtworks()");
    process.exit(1);
  }

  // Step 4: Test Reservation & Order Creation on newly submitted artwork
  console.log("\n▶ Step 4: Testing reservation & order creation on published artwork");
  const reserveRes = reserveArtworkAtomic(testSlug, "cart_test_artist", "UNIQUE");

  if (reserveRes.success && reserveRes.status === "reserved") {
    console.log("  ✅ Successfully reserved newly published artwork");
  } else {
    console.error("  ❌ Step 4 Failed to reserve:", reserveRes);
    process.exit(1);
  }

  const orderRes = createOrderAtomic({
    cartId: "cart_test_artist",
    buyer: {
      name: "דניאלה כהן",
      email: "daniela@example.com",
      phone: "054-9876543",
      shippingAddress: { street: "רוטשילד 45", city: "תל אביב" },
    },
    lines: [
      {
        artworkId: testSlug,
        artworkTitle: retrieved.title.he,
        artistId: retrieved.artist.slug,
        artistName: retrieved.artist.displayName.he,
        artistLocation: retrieved.artist.location.he,
        quantity: 1,
        inventoryKind: "UNIQUE",
        priceAgorot: retrieved.priceAgorot,
        lineTotalAgorot: retrieved.priceAgorot,
        imagePublicId: sampleDataUrl,
      },
    ],
    totals: {
      subtotalAgorot: 52000,
      shippingAgorot: 3500,
      totalAgorot: 55500,
      vatAgorot: 7932,
    },
  });

  if (orderRes.success && orderRes.order) {
    console.log(`  ✅ Order created successfully: ID=${orderRes.order.id}, Number=${orderRes.order.humanReadableNumber}`);
  } else {
    console.error("  ❌ Step 4 Failed order creation:", orderRes);
    process.exit(1);
  }

  console.log("\n🎉 ALL REAL ARTWORK SUBMISSION TESTS PASSED PERFECTLY!\n");
}

runTest().catch((err) => {
  console.error("Test execution crash:", err);
  process.exit(1);
});
