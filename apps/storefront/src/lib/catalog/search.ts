/**
 * Strict & Flexible Hebrew Search & Intent Recognition Engine for BOBY (§C, §D).
 *
 * Capabilities:
 * - Hebrew Normalization: removes niqqud, normalizes final letters (ם->מ, ן->נ, ץ->צ, ף->פ, ך->כ).
 * - Prefix Stripping: strips common Hebrew prefixes (ב-, כ-, ל-, מ-, ש-, ו-) for token matching.
 * - Price Intent Extraction: parses explicit price bounds ("עד 300", "מתחת ל-200 שקל", "בין 300 ל-1000", "מעל 400").
 * - Artist & Genre Intent Recognition: detects matching artists or category disciplines.
 * - Strict Boolean Filtering: ALL active constraints (Price AND Discipline AND Artist AND Keywords) must be satisfied.
 *   If 0 items match, returns items = [] so SearchEmptyState handles fallback gracefully.
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
    synonyms: ["עץ", "עבודת עץ", "חרטות עץ", "גילוף", "חריטה בעץ", "עץ טבעי", "אגוז", "זית"],
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

const STOP_WORDS = new Set(["של", "על", "עם", "את", "רוצה", "מחפש", "איפה", "איזה", "מה", "למי"]);

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

/** Strip common Hebrew prefix letters (ב-, כ-, ל-, מ-, ש-, ו-) if word length > 3 */
export function stripHebrewPrefix(word: string): string {
  const norm = normalizeHebrew(word);
  if (norm.length <= 3) return norm;

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

  // Pattern 1: "בין X ל-Y" or "בינ X ל Y" or "מ-X עד Y" (e.g., "בין 300 ל 1000", "בין 300 ל-1000")
  const rangeMatch = norm.match(/(?:בין|בינ|מ-?)\s*(\d+)\s*(?:ל-?|עד|-)\s*(\d+)/i);
  if (rangeMatch) {
    const minVal = parseInt(rangeMatch[1], 10);
    const maxVal = parseInt(rangeMatch[2], 10);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      const minAgorot = Math.min(minVal, maxVal) * 100;
      const maxAgorot = Math.max(minVal, maxVal) * 100;
      const cleanedQuery = norm.replace(rangeMatch[0], "").trim();
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
      const cleanedQuery = norm.replace(maxMatch[0], "").trim();
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
      const cleanedQuery = norm.replace(minMatch[0], "").trim();
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
 * Strict Catalog Search Engine
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
  const textQuery = (priceIntent ? priceIntent.cleanedQuery : query).trim();
  const normalizedText = normalizeHebrew(textQuery);

  // 2. Artist Intent Recognition
  let matchedArtist: Artist | undefined = undefined;
  if (normalizedText.length >= 2) {
    for (const artwork of allArtworks) {
      const artist = artwork.artist;
      const artistHe = normalizeHebrew(artist.displayName.he);
      const artistEn = normalizeHebrew(artist.displayName.en);
      if (artistHe.includes(normalizedText) || artistEn.includes(normalizedText) || normalizedText.includes(artistHe)) {
        matchedArtist = artist;
        break;
      }
    }
  }

  // 3. Category / Discipline Intent Recognition
  let matchedDiscipline: { key: Discipline; heLabel: string } | undefined = undefined;
  if (normalizedText.length >= 2) {
    for (const disc of DISCIPLINE_MAP) {
      const isMatch = disc.synonyms.some((syn) => {
        const normSyn = normalizeHebrew(syn);
        return normalizedText === normSyn || normalizedText.includes(normSyn) || normSyn.includes(normalizedText);
      });
      if (isMatch) {
        matchedDiscipline = { key: disc.key, heLabel: disc.he };
        break;
      }
    }
  }

  // Tokenize ONLY remaining text after price/artist/category parsing
  const rawWords = normalizedText.split(/\s+/).filter(Boolean);
  const tokens = rawWords.filter((w) => !STOP_WORDS.has(w) && w.length >= 2);

  // 4. Strict Filtering over catalog
  const filtered = allArtworks.filter((artwork) => {
    // Constraint A: Price Intent Filter
    if (priceIntent) {
      if (priceIntent.minAgorot !== undefined && artwork.priceAgorot < priceIntent.minAgorot) {
        return false;
      }
      if (priceIntent.maxAgorot !== undefined && artwork.priceAgorot > priceIntent.maxAgorot) {
        return false;
      }
    }

    // Constraint B: Matched Discipline Constraint
    if (matchedDiscipline) {
      if (artwork.discipline !== matchedDiscipline.key) {
        return false;
      }
    }

    // Constraint C: Matched Artist Constraint
    if (matchedArtist) {
      if (artwork.artist.slug !== matchedArtist.slug) {
        return false;
      }
    }

    // Constraint D: Keyword Matching Filter
    if (tokens.length > 0) {
      const categoryMatchWord = matchedDiscipline && tokens.some(t => matchedDiscipline.heLabel.includes(t) || t.includes(matchedDiscipline.heLabel));
      const artistMatchWord = matchedArtist && tokens.some(t => normalizeHebrew(matchedArtist.displayName.he).includes(t));

      if (!categoryMatchWord && !artistMatchWord) {
        const titleHe = normalizeHebrew(artwork.title.he);
        const titleEn = normalizeHebrew(artwork.title.en);
        const storyHe = normalizeHebrew(artwork.story.he);
        const categoryHe = normalizeHebrew(artwork.category.he);
        const artistNameHe = normalizeHebrew(artwork.artist.displayName.he);
        const materialsHe = artwork.materials.he.map(normalizeHebrew).join(" ");
        const searchableText = `${titleHe} ${titleEn} ${storyHe} ${categoryHe} ${artistNameHe} ${materialsHe}`;

        const allTokensMatch = tokens.every((token) => {
          const stripped = stripHebrewPrefix(token);
          return searchableText.includes(token) || (stripped.length >= 2 && searchableText.includes(stripped));
        });
        if (!allTokensMatch) return false;
      }
    }

    return true;
  });

  // Extract suggestions for empty fallback UI
  const categoriesList = DISCIPLINE_MAP.map((d) => ({ key: d.key, label: d.he }));
  const artistsListMap = new Map<string, { slug: string; name: string }>();
  for (const a of allArtworks) {
    artistsListMap.set(a.artist.slug, {
      slug: a.artist.slug,
      name: a.artist.displayName.he,
    });
  }

  return {
    items: filtered,
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
