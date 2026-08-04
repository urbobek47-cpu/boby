/**
 * Fixture catalog data. Realistic Hebrew, real price bands (§5.2:
 * ceramics ₪49–399, jewelry ₪110–550, originals ₪1,000–5,000). Money in
 * integer agorot (§5.5).
 *
 * This is the ONLY place the storefront reads catalog data today. The functions
 * are async on purpose so swapping in Medusa/Mercur + Sanity later is a drop-in
 * — the page code does not change.
 */
import type { Artist, Artwork } from "./types";

const noaBarak: Artist = {
  slug: "noa-barak",
  displayName: { he: "נועה ברק", en: "Noa Barak" },
  location: { he: "פרדס חנה", en: "Pardes Hanna" },
  bio: {
    he: "נועה עובדת מהסטודיו שלה בפרדס חנה, עם חימר מקומי ושכבות דקות של גלזורה מינרלית. כל כלי נבנה ביד ונשרף פעמיים — הצבע הסופי מתגלה רק אחרי השרפה השנייה, ולכן אין שתי יצירות זהות.",
    en: "Noa works from her studio in Pardes Hanna with local clay and thin layers of mineral glaze. Each piece is hand-built and twice-fired — the final colour only reveals itself after the second firing, so no two pieces are alike.",
  },
  // DEMO public ids from Cloudinary's public `demo` cloud — placeholders that
  // prove the pipeline. Replace with BOBY's real photo public ids at onboarding.
  // Preview mock: Noa in her studio (3:2 editorial). Replace with real photo at launch.
  portraitPublicId: "/mock/studio-noa.jpg",

};

const yaelStudio: Artist = {
  slug: "yael-druk",
  displayName: { he: "יעל דרוק", en: "Yael Druk" },
  location: { he: "תל אביב", en: "Tel Aviv" },
  bio: {
    he: "יעל מדפיסה בהדפס רשת ידני במהדורות קטנות וממוספרות, על נייר כותנה כבד. כל הדפס נחתם וממוספר בעיפרון.",
    en: "Yael screen-prints by hand in small numbered editions on heavy cotton paper. Each print is signed and numbered in pencil.",
  },
  portraitPublicId: null, // no approved photo yet — placeholder
};

const danWood: Artist = {
  slug: "dan-avidan",
  displayName: { he: "דן אבידן", en: "Dan Avidan" },
  location: { he: "רמת השרון", en: "Ramat HaSharon" },
  bio: {
    he: "דן עובד בעץ אגוז וזית ממקור מקומי, ומייצר כל פריט לפי הזמנה — כך שאפשר להתאים את המידות למרחב שלכם.",
    en: "Dan works in locally sourced walnut and olive wood, making each piece to order so the dimensions can be matched to your space.",
  },
  portraitPublicId: null, // no approved photo yet — placeholder
};

const artworks: Artwork[] = [
  {
    slug: "kaarat-adama",
    title: { he: "קערת אדמה", en: "Earth Bowl" },
    story: {
      he: "קערה שנבנתה ביד מחומר מקומי, עם שכבות דקות של גלזורה מינרלית שנשרפו פעמיים. סימני השרפה משתנים מכלי לכלי והופכים כל אחת ליחידה — הגוונים החמים בשוליים הם תוצאה של האש, לא של צבע שנוסף.",
      en: "A hand-built bowl in local clay, with thin layers of mineral glaze fired twice. The firing marks differ from piece to piece and make each one unique — the warm tones at the rim come from the fire, not from added colour.",
    },
    materials: {
      he: ["חימר מקומי", "גלזורה מינרלית"],
      en: ["Local clay", "Mineral glaze"],
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    dimensions: { heightCm: 11, widthCm: 24, depthCm: 24, weightGrams: 820 },
    priceAgorot: 34000, // ₪340
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "/mock/earth-bowl.jpg", aspectRatio: 4 / 5, role: "primary", caption: { he: "קערת קרמיקה רחבה בגוון חול עם שפה בגוון טרקוטה", en: "Broad sand-toned ceramic bowl with a terracotta rim" } },
    ],
    artist: noaBarak,
  },
  {
    slug: "yareach-print",
    title: { he: "ירח מלא", en: "Full Moon" },
    story: {
      he: "הדפס רשת ידני על נייר כותנה כבד, במהדורה מוגבלת של 25 עותקים ממוספרים. כל עותק נחתם בעיפרון.",
      en: "A hand-pulled screen print on heavy cotton paper, in a limited edition of 25 numbered copies. Each is signed in pencil.",
    },
    materials: { he: ["דיו על בסיס מים", "נייר כותנה 300 גרם"], en: ["Water-based ink", "300gsm cotton paper"] },
    discipline: "painting",
    category: { he: "הדפס", en: "Print" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 25,
    editionNumber: 8,
    dimensions: { heightCm: 50, widthCm: 40 },
    priceAgorot: 42000, // ₪420
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "/mock/full-moon.jpg", aspectRatio: 4 / 5, role: "primary", caption: { he: "הדפס מונוטייפ כהה עם עיגול ירח בהיר על נייר בעבודת יד", en: "Dark monotype with a pale moon circle on handmade paper" } },
    ],
    artist: yaelStudio,
  },
  {
    slug: "gavia-etz",
    title: { he: "גביע עץ", en: "Wooden Goblet" },
    story: {
      he: "גביע מחוטב מעץ אגוז בגוש אחד, מיוצר לפי הזמנה. אפשר להתאים את הגובה ואת גימור השמן לבחירתכם.",
      en: "A goblet turned from a single block of walnut, made to order. Height and oil finish can be matched to your preference.",
    },
    materials: { he: ["עץ אגוז", "שמן מזון טבעי"], en: ["Walnut", "Natural food-safe oil"] },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    leadTimeDays: 24,
    dimensions: { heightCm: 18, widthCm: 9, depthCm: 9, weightGrams: 260 },
    priceAgorot: 29000, // ₪290
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "/mock/olive-goblet.jpg", aspectRatio: 4 / 5, role: "primary", caption: { he: "גביע פיסולי מעץ זית עם טקסטורת סיבים טבעית", en: "Sculptural olive-wood goblet with natural grain" } },
    ],
    artist: danWood,
  },
  {
    slug: "kaarat-erev",
    title: { he: "קערת ערב", en: "Evening Bowl" },
    story: {
      he: "קערה בגוון כחול־אפור עמוק, נבנתה ביד ונשרפה פעמיים. יצירה יחידה — כרגע שמורה בסל של קונה אחר.",
      en: "A deep blue-grey hand-built bowl, twice-fired. One of a kind — currently held in another shopper's cart.",
    },
    materials: { he: ["חימר מקומי", "גלזורה כחולה"], en: ["Local clay", "Blue glaze"] },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    dimensions: { heightCm: 10, widthCm: 22, depthCm: 22, weightGrams: 760 },
    priceAgorot: 32000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "/mock/evening-bowl.jpg", aspectRatio: 1, role: "primary", caption: { he: "קערת קרמיקה שחורה בגימור מינרלי ושפה לא אחידה", en: "Black mineral-glazed ceramic bowl with an uneven rim" } },
    ],
    artist: noaBarak,
  },
  {
    slug: "tzalachat-nof",
    title: { he: "צלחת נוף", en: "Landscape Plate" },
    story: {
      he: "צלחת הגשה שטוחה עם גלזורה בגוון חול. יצירה יחידה שנמכרה — אך יש עבודות נוספות מאותה סדרה.",
      en: "A flat serving plate with a sand-toned glaze. A unique piece that has sold — but there are more works from the same series.",
    },
    materials: { he: ["חימר לבן", "גלזורה מט"], en: ["White clay", "Matte glaze"] },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "sold",
    dimensions: { heightCm: 3, widthCm: 28, depthCm: 28, weightGrams: 900 },
    priceAgorot: 26000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "/mock/landscape-plate.jpg", aspectRatio: 1, role: "primary", caption: { he: "צלחת קרמיקה עם נוף מופשט בגוני חול, מרווה וטרקוטה", en: "Ceramic plate with an abstract landscape in sand, sage and terracotta" } },
    ],
    artist: noaBarak,
  },
];

const dynamicArtworksStore: Artwork[] = [];

export function addCustomArtwork(newArtwork: Artwork): void {
  // Prevent duplicate insertion
  if (!dynamicArtworksStore.some((a) => a.slug === newArtwork.slug)) {
    dynamicArtworksStore.unshift(newArtwork);
  }
  try {
    if (typeof window !== "undefined") {
      const existing: Artwork[] = JSON.parse(localStorage.getItem("boby_custom_artworks") || "[]");
      if (!existing.some((a) => a.slug === newArtwork.slug)) {
        localStorage.setItem("boby_custom_artworks", JSON.stringify([newArtwork, ...existing]));
      }
    }
  } catch {
    // Ignore storage error
  }
}

function getAllArtworks(): Artwork[] {
  let custom: Artwork[] = [];
  try {
    if (typeof window !== "undefined") {
      custom = JSON.parse(localStorage.getItem("boby_custom_artworks") || "[]");
    }
  } catch {
    custom = [];
  }
  // Combine memory store, localStorage, and static fixture data
  const combined = [...dynamicArtworksStore, ...custom, ...artworks];
  const uniqueMap = new Map<string, Artwork>();
  for (const item of combined) {
    if (!uniqueMap.has(item.slug)) {
      uniqueMap.set(item.slug, item);
    }
  }
  return Array.from(uniqueMap.values());
}

/** Simulate async I/O so the Medusa/Sanity swap is a drop-in. */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const all = getAllArtworks();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function listArtworkSlugs(): Promise<string[]> {
  const all = getAllArtworks();
  return all.map((a) => a.slug);
}

export async function listArtworks(): Promise<Artwork[]> {
  return getAllArtworks();
}

export async function listArtistSlugs(): Promise<string[]> {
  const all = getAllArtworks();
  return [...new Set(all.map((a) => a.artist.slug))];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const all = getAllArtworks();
  return all.find((a) => a.artist.slug === slug)?.artist ?? null;
}

export async function listArtworksByArtist(slug: string): Promise<Artwork[]> {
  const all = getAllArtworks();
  return all.filter((a) => a.artist.slug === slug);
}
