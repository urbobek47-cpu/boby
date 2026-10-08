import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Artwork } from "./catalog/types";

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const urlExists = Boolean(url && url.trim().length > 0);
  const keyExists = Boolean(key && key.trim().length > 0);
  const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? "service_role"
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "anon"
      : "none";

  console.log(`[Supabase Config Check] url_exists: ${urlExists}, key_exists: ${keyExists}, key_type: ${keyType}`);

  if (!urlExists || !keyExists) {
    console.warn("[Supabase Config Warning] Supabase client cannot be initialized due to missing environment variables.");
    return null;
  }

  return createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = getSupabaseClient();

export function mapRowToArtwork(row: Record<string, any>): Artwork {
  return {
    slug: row.slug,
    title: typeof row.title === "object" ? row.title : { he: String(row.title || ""), en: String(row.title || "") },
    story: typeof row.story === "object" ? row.story : { he: String(row.story || ""), en: String(row.story || "") },
    materials: typeof row.materials === "object" ? row.materials : { he: [String(row.materials || "")], en: [String(row.materials || "")] },
    discipline: row.discipline || "ceramics",
    category: typeof row.category === "object" ? row.category : { he: String(row.category || ""), en: String(row.category || "") },
    inventoryKind: row.inventory_kind || row.inventoryKind || "UNIQUE",
    availability: row.availability || "available",
    dimensions: typeof row.dimensions === "object" ? row.dimensions : { heightCm: 15, widthCm: 20, depthCm: 20, weightGrams: 1000 },
    priceAgorot: Number(row.price_agorot || row.priceAgorot || 45000),
    shippingSizeBand: row.shipping_size_band || row.shippingSizeBand || "MEDIUM",
    isFragile: Boolean(row.is_fragile ?? row.isFragile ?? true),
    images: Array.isArray(row.images) ? row.images : [],
    artist: typeof row.artist === "object" ? row.artist : {
      slug: row.artist_slug || "boby-artist",
      displayName: { he: "אמן סטודיו BOBY", en: "BOBY Studio Artist" },
      location: { he: "ישראל", en: "Israel" },
      bio: { he: "אמן/ית יוצר/ת ב-BOBY.", en: "BOBY Artist" },
      portraitPublicId: null,
    },
    ...(row.edition_size != null ? { editionSize: Number(row.edition_size) } : {}),
    ...(row.edition_number != null ? { editionNumber: Number(row.edition_number) } : {}),
    ...(row.lead_time_days != null ? { leadTimeDays: Number(row.lead_time_days) } : {}),
  };
}

export function mapArtworkToRow(artwork: Artwork): Record<string, any> {
  return {
    slug: artwork.slug,
    title: artwork.title,
    story: artwork.story,
    materials: artwork.materials,
    discipline: artwork.discipline,
    category: artwork.category,
    inventory_kind: artwork.inventoryKind,
    availability: artwork.availability,
    dimensions: artwork.dimensions,
    price_agorot: artwork.priceAgorot,
    shipping_size_band: artwork.shippingSizeBand,
    is_fragile: artwork.isFragile,
    images: artwork.images,
    artist: artwork.artist,
    artist_slug: artwork.artist?.slug || null,
    edition_size: artwork.editionSize ?? null,
    edition_number: artwork.editionNumber ?? null,
    lead_time_days: artwork.leadTimeDays ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function insertArtworkDb(artwork: Artwork): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    console.warn("[Supabase Insert Warning] Client unavailable; skipped database write.");
    return false;
  }
  try {
    // 1. Ensure artist parent row exists to satisfy FK constraint if needed
    if (artwork.artist && artwork.artist.slug) {
      const { error: artistErr } = await client.from("artists").upsert({
        slug: artwork.artist.slug,
        display_name: artwork.artist.displayName,
        location: artwork.artist.location,
        bio: artwork.artist.bio,
        portrait_public_id: artwork.artist.portraitPublicId || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "slug" });

      if (artistErr) {
        console.warn("[Supabase Insert Warning] Artist upsert returned warning:", artistErr.message);
      }
    }

    // 2. Upsert artwork row
    const row = mapArtworkToRow(artwork);
    const { error } = await client.from("artworks").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error("[Supabase Insert Error]", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return false;
    }
    console.log(`[Supabase Insert Success] Saved artwork to Supabase: ${artwork.slug}`);
    clearDbArtworksCache();
    return true;
  } catch (err) {
    console.error("[Supabase Insert Crash]", err);
    return false;
  }
}

export async function getArtworkBySlugDb(slug: string): Promise<Artwork | null> {
  const client = getSupabaseClient();
  if (!client) {
    console.warn("[Supabase Query Warning] Client unavailable.");
    return null;
  }

  try {
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch {}

    // 1. Try exact match on decodedSlug
    const { data: exactData } = await client
      .from("artworks")
      .select("*")
      .eq("slug", decodedSlug)
      .maybeSingle();

    if (exactData) {
      console.log(`[Supabase Query Hit] Found artwork in Supabase via eq lookup: ${exactData.slug}`);
      return mapRowToArtwork(exactData);
    }

    // 2. Try exact match on raw slug if different
    if (slug !== decodedSlug) {
      const { data: rawData } = await client
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (rawData) {
        console.log(`[Supabase Query Hit] Found artwork in Supabase via raw eq lookup: ${rawData.slug}`);
        return mapRowToArtwork(rawData);
      }
    }

    console.log(`[Supabase Query Miss] No database record for slug: "${slug}" (decoded: "${decodedSlug}")`);
    return null;
  } catch (err: any) {
    console.error(`[Supabase Query Exception for slug "${slug}"]`, err?.message || err);
    return null;
  }
}

let dbArtworksCache: { data: Artwork[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 15000; // 15 seconds in-memory cache for instant navigation

export function clearDbArtworksCache() {
  dbArtworksCache = null;
}

export async function listArtworksDb(forceFresh = false): Promise<Artwork[]> {
  const now = Date.now();
  if (!forceFresh && dbArtworksCache && now - dbArtworksCache.timestamp < CACHE_TTL_MS) {
    return dbArtworksCache.data;
  }

  const client = getSupabaseClient();
  if (!client) return dbArtworksCache?.data || [];
  try {
    const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: { message: "upstream request timeout" } }), 800)
    );
    const queryPromise = client
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error || !data) {
      if (error?.message) {
        console.warn("[Supabase List Warning]", error.message);
      }
      return dbArtworksCache?.data || [];
    }
    const mapped = data.map(mapRowToArtwork);
    dbArtworksCache = { data: mapped, timestamp: now };
    return mapped;
  } catch (err) {
    console.error("[Supabase List Crash]", err);
    return dbArtworksCache?.data || [];
  }
}

export async function updateArtworkDb(artwork: Artwork, ownerSlug: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const existing = await getArtworkBySlugDb(artwork.slug);
    if (!existing) return false;
    // Ownership check: existing artist slug or user email slug must match ownerSlug
    const existingArtistSlug = existing.artist?.slug || "";
    if (existingArtistSlug !== ownerSlug && existingArtistSlug !== ownerSlug.split("@")[0]) {
      console.warn(`[Supabase Update Denied] Owner mismatch: expected ${ownerSlug}, got ${existingArtistSlug}`);
      return false;
    }
    const row = mapArtworkToRow(artwork);
    const { error } = await client.from("artworks").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error("[Supabase Update Error]", error.message);
      return false;
    }
    console.log(`[Supabase Update Success] Updated artwork: ${artwork.slug}`);
    clearDbArtworksCache();
    return true;
  } catch (err) {
    console.error("[Supabase Update Exception]", err);
    return false;
  }
}

export async function deleteArtworkDb(slug: string, ownerSlug: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const existing = await getArtworkBySlugDb(slug);
    if (!existing) return false;
    const existingArtistSlug = existing.artist?.slug || "";
    const ownerPrefix = ownerSlug.split("@")[0];
    if (existingArtistSlug !== ownerSlug && existingArtistSlug !== ownerPrefix) {
      console.warn(`[Supabase Delete Denied] Owner mismatch for ${slug}: expected ${ownerSlug}, got ${existingArtistSlug}`);
      return false;
    }

    const { error } = await client.from("artworks").delete().eq("slug", slug);
    if (error) {
      console.error(`[Supabase Delete Error for ${slug}]`, error.message);
      return false;
    }

    // Also delete inventory entry if exists
    await client.from("inventory").delete().eq("slug", slug);
    console.log(`[Supabase Delete Success] Deleted artwork: ${slug}`);
    clearDbArtworksCache();
    return true;
  } catch (err) {
    console.error(`[Supabase Delete Exception for ${slug}]`, err);
    return false;
  }
}

export async function updateArtistProfilePhotoDb(
  artistSlug: string,
  portraitPublicId: string | null
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    console.warn("[Supabase Artist Photo Warning] Client unavailable.");
    return false;
  }
  try {
    const { error } = await client.from("artists").upsert(
      {
        slug: artistSlug,
        portrait_public_id: portraitPublicId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error("[Supabase Artist Photo Error]", error.message);
      return false;
    }
    console.log(`[Supabase Artist Photo Success] Updated photo for artist: ${artistSlug}`);
    return true;
  } catch (err) {
    console.error("[Supabase Artist Photo Exception]", err);
    return false;
  }
}

export async function getArtistProfilePhotoDb(artistSlug: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client
      .from("artists")
      .select("portrait_public_id")
      .eq("slug", artistSlug)
      .maybeSingle();

    return data?.portrait_public_id || null;
  } catch (err) {
    console.error("[Supabase Get Artist Photo Exception]", err);
    return null;
  }
}


