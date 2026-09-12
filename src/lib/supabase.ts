import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Artwork } from "./catalog/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export function mapRowToArtwork(row: Record<string, any>): Artwork {
  return {
    slug: row.slug,
    title: row.title,
    story: row.story,
    materials: row.materials,
    discipline: row.discipline,
    category: row.category,
    inventoryKind: row.inventory_kind,
    availability: row.availability,
    dimensions: row.dimensions,
    priceAgorot: Number(row.price_agorot),
    shippingSizeBand: row.shipping_size_band,
    isFragile: Boolean(row.is_fragile),
    images: row.images,
    artist: row.artist,
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
    edition_size: artwork.editionSize ?? null,
    edition_number: artwork.editionNumber ?? null,
    lead_time_days: artwork.leadTimeDays ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function insertArtworkDb(artwork: Artwork): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapArtworkToRow(artwork);
    const { error } = await supabase.from("artworks").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error("[Supabase Error] Failed to upsert artwork:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Supabase Crash] Error in insertArtworkDb:", err);
    return false;
  }
}

export async function getArtworkBySlugDb(slug: string): Promise<Artwork | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return mapRowToArtwork(data);
  } catch (err) {
    console.error("[Supabase Crash] Error in getArtworkBySlugDb:", err);
    return null;
  }
}

export async function listArtworksDb(): Promise<Artwork[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }
    return data.map(mapRowToArtwork);
  } catch (err) {
    console.error("[Supabase Crash] Error in listArtworksDb:", err);
    return [];
  }
}
