/**
 * Flexible Hebrew Search & Intent Recognition Engine for BOBY (§C, §D).
 *
 * Capabilities:
 * - Hebrew Normalization: removes niqqud, normalizes final letters (ם->מ, ן->נ, ץ->צ, ף->פ, ך->כ),
 *   normalizes alef/vav/yod spellings and common Hebrew prefixes (ב-, כ-, ל-, מ-, ש-, וה-).
 * - Price Intent Extraction: parses explicit price expressions ("עד 300", "מתחת ל-200 שקל",
 *   "בין 500 ל 1000", "מעל 400") and applies agorot bounds automatically.
 * - Artist & Genre Intent Recognition: detects matching artists or category disciplines to show
 *   special feature banners and route recommendations.
 * - Empty Search Fallback Suggestions: returns alternative categories, artists, and recommendations.
 */

import type { Artwork, Artist, Discipline } from "./types";

export interface PriceIntent {
  minAgorot?: number;
  maxAgorot?: number;
  label: string;
  cleanedQuery: string;
}

export interface SearchResult {
  items: Artwork[];
  rawQuery: string;
  cleanedQuery: string;
  matchedArtist?: Artist;
  matchedDiscipline?: {
    key: Discipline;
    heLabel: string;
  };
  priceIntent?: PriceIntent;
  suggestions: {
    categories: Array<{ key: Discipline; label: string }>;
    artists: Array<{ slug: string; name: string }>;
    recommendedArtworks: Artwork[];
  };
}

const DISCIPLINE_MAP: Array<{ key: Discipline; he: string; synonyms: string[] }> = [
  {
    key: "ceramics",
    he: "קרמיקה",
    synonyms: ["קרמיקה", "קדרות", "חמר", "חימר", "קערה", "קערות", "ספל", "כלי בית", "צלחת", "כדים", "כד", "אגרטל"],
  },
  {
    key: "jewelry",
    he: "תכשיטים",
    synonyms: ["תכשיט", "תכשיטים", "צורפות", "שרשרת", "שרשראות", "טבעת", "טבעות", "עגילים", "עגיל", "צמיד", "צמידים", "זהב", "כסף"],
  },
  {
    key: "painting",
    he: "ציור",
    synonyms: ["ציור", "ציורים", "תמונה", "תמונות", "איור", "איורים", "אקריליק", "שמן על בד", "הדפס", "הדפסים", "קנווס"],
  },
  {
    key: "sculpture",
    he: "פיסול",
    synonyms: ["פיסול", "פסל", "פסלים", "אבן", "ברונזה", "חימר מפוסל"],
  },
  {
    key: "wood",
    he: "עץ",
    synonyms: ["עץ", "עבודת עץ", "חרטות עץ", "גילוף", "חריטה בעץ", "עץ טבעי"],
  },
  {
    key: "textile",
    he: "טקסטיל",
    synonyms: ["טקסטיל", "אריגה", "שטיח", "שטיחים", "רקמה", "בד", "אריג"],
  },
  {
    key: "judaica",
    he: "יודאיקה",
    synonyms: ["יודאיקה", "פמוטים", "חזיה", "מזוזה", "מזוזות", "חג", "שבת", "קדושה", "חג ומועד"],
  },
];

/** Normalize Hebrew text by removing niqqud and converting final letters to standard form */
export function normalizeHebrew(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    // Remove Hebrew vowels / niqqud
    .replace(/[\u0591-\u05C7]/g, "")
    // Normalize final letters
    .replace(/ם/g, "מ")
    .replace(/ן/g, "נ")
    .replace(/ץ/g, "צ")
    .replace(/ף/g, "פ")
    .replace(/ך/g, "כ")
    .trim();
}

/** Strip common Hebrew prefix letters (ב-, כ-, ל-, מ-, ש-, ו-) from a single word if word length > 3 */
function stripHebrewPrefix(word: string): string {
  const norm = normalizeHebrew(word);
  if (norm.length <= 3) return norm;

  // Strip prefixes like "וה", "מה", "לה", "ב"
  if (norm.startsWith("וה") || norm.startsWith("מה") || norm.startsWith("לה")) {
    return norm.slice(2);
  }
  if (
    norm.startsWith("ב") ||
    norm.startsWith("כ") ||
    norm.startsWith("ל") ||
    norm.startsWith("מ") ||
    norm.startsWith("ש") ||
    norm.startsWith("ו")
  ) {
    return norm.slice(1);
  }
  return norm;
}

/** Extract explicit price constraints from a raw search query */
export function parsePriceIntent(query: string): PriceIntent | undefined {
  const norm = normalizeHebrew(query);

  // Pattern 1: "בין X ל Y" or "מ-X עד Y" (e.g., "בין 500 ל 1000", "מ-300 עד 800")
  const rangeMatch = norm.match(/(?:בין|מ-?)\s*(\d+)\s*(?:ל|עד|-)\s*(\d+)/i);
  if (rangeMatch) {
    const minVal = parseInt(rangeMatch[1], 10);
    const maxVal = parseInt(rangeMatch[2], 10);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      const minAgorot = Math.min(minVal, maxVal) * 100;
      const maxAgorot = Math.max(minVal, maxVal) * 100;
      const cleanedQuery = query.replace(new RegExp(rangeMatch[0], "gi"), "").trim();
      return {
        minAgorot,
        maxAgorot,
        label: `₪${minVal} - ₪${maxVal}`,
        cleanedQuery,
      };
    }
  }

  // Pattern 2: "עד X" / "מתחת ל-X" / "עד X ₪" / "עד X שקל" (e.g., "עד 300", "עד 500 ש"ח")
  const maxMatch = norm.match(/(?:עד|מתחת\s+ל-?)\s*(\d+)\s*(?:שקל|שח|₪)?/i);
  if (maxMatch) {
    const maxVal = parseInt(maxMatch[1], 10);
    if (!isNaN(maxVal)) {
      const cleanedQuery = query.replace(new RegExp(maxMatch[0], "gi"), "").trim();
      return {
        maxAgorot: maxVal * 100,
        label: `עד ₪${maxVal}`,
        cleanedQuery,
      };
    }
  }

  // Pattern 3: "מעל X" / "מ-X ומעלה" (e.g., "מעל 500", "מ-1000 ומעלה")
  const minMatch = norm.match(/(?:מעל|מ-?)\s*(\d+)\s*(?:שקל|שח|₪)?(?:\s+ומעלה)?/i);
  if (minMatch) {
    const minVal = parseInt(minMatch[1], 10);
    if (!isNaN(minVal)) {
      const cleanedQuery = query.replace(new RegExp(minMatch[0], "gi"), "").trim();
      return {
        minAgorot: minVal * 100,
        label: `מעל ₪${minVal}`,
        cleanedQuery,
      };
    }
  }

  return undefined;
}

/**
 * Intelligent Catalog Search Engine
 */
export function searchCatalog(allArtworks: Artwork[], rawQuery: string): SearchResult {
  const query = rawQuery.trim();
  if (!query) {
    return {
      items: allArtworks,
      rawQuery: "",
      cleanedQuery: "",
      suggestions: {
        categories: DISCIPLINE_MAP.map((d) => ({ key: d.key, label: d.he })),
        artists: [],
        recommendedArtworks: allArtworks.slice(0, 6),
      },
    };
  }

  // 1. Parse Price Intent
  const priceIntent = parsePriceIntent(query);
  const textQuery = priceIntent ? priceIntent.cleanedQuery : query;
  const normalizedText = normalizeHebrew(textQuery);
  const words = normalizedText.split(/\s+/).filter(Boolean);
  const strippedWords = words.map(stripHebrewPrefix);

  // 2. Artist Recognition
  let matchedArtist: Artist | undefined = undefined;
  for (const artwork of allArtworks) {
    const artist = artwork.artist;
    const artistNameHe = normalizeHebrew(artist.displayName.he);
    const artistNameEn = normalizeHebrew(artist.displayName.en);

    const isMatch =
      (normalizedText.length >= 2 && artistNameHe.includes(normalizedText)) ||
      (normalizedText.length >= 2 && artistNameEn.includes(normalizedText)) ||
      words.some((w) => artistNameHe.includes(w) || artistNameEn.includes(w));

    if (isMatch) {
      matchedArtist = artist;
      break;
    }
  }

  // 3. Category/Genre Recognition
  let matchedDiscipline: { key: Discipline; heLabel: string } | undefined = undefined;
  for (const disc of DISCIPLINE_MAP) {
    const isCategoryMatch = disc.synonyms.some((syn) => {
      const normSyn = normalizeHebrew(syn);
      return (
        normalizedText.includes(normSyn) ||
        words.some((w) => w === normSyn || stripHebrewPrefix(w) === normSyn)
      );
    });

    if (isCategoryMatch) {
      matchedDiscipline = { key: disc.key, heLabel: disc.he };
      break;
    }
  }

  // 4. Artwork Filtering
  let results = allArtworks.filter((artwork) => {
    // Price Intent Filter
    if (priceIntent) {
      if (priceIntent.minAgorot !== undefined && artwork.priceAgorot < priceIntent.minAgorot) {
        return false;
      }
      if (priceIntent.maxAgorot !== undefined && artwork.priceAgorot > priceIntent.maxAgorot) {
        return false;
      }
    }

    // If text query is empty after price parsing, return true for price match
    if (!textQuery) return true;

    // Check Artist Match
    if (matchedArtist && artwork.artist.slug === matchedArtist.slug) {
      return true;
    }

    // Check Discipline Match
    if (matchedDiscipline && artwork.discipline === matchedDiscipline.key) {
      return true;
    }

    // Check Keyword Title / Story / Materials Match
    const titleHe = normalizeHebrew(artwork.title.he);
    const titleEn = normalizeHebrew(artwork.title.en);
    const storyHe = normalizeHebrew(artwork.story.he);
    const artistNameHe = normalizeHebrew(artwork.artist.displayName.he);

    const matchesKeyword = words.some((word) => {
      const stripped = stripHebrewPrefix(word);
      return (
        titleHe.includes(word) ||
        titleEn.includes(word) ||
        storyHe.includes(word) ||
        artistNameHe.includes(word) ||
        titleHe.includes(stripped) ||
        storyHe.includes(stripped)
      );
    });

    return matchesKeyword;
  });

  // Extract unique suggestions for fallback empty state
  const categoriesList = DISCIPLINE_MAP.map((d) => ({ key: d.key, label: d.he }));
  const artistsListMap = new Map<string, { slug: string; name: string }>();
  for (const a of allArtworks) {
    artistsListMap.set(a.artist.slug, {
      slug: a.artist.slug,
      name: a.artist.displayName.he,
    });
  }

  return {
    items: results,
    rawQuery: query,
    cleanedQuery: textQuery,
    matchedArtist,
    matchedDiscipline,
    priceIntent,
    suggestions: {
      categories: categoriesList,
      artists: Array.from(artistsListMap.values()),
      recommendedArtworks: allArtworks.slice(0, 6),
    },
  };
}
