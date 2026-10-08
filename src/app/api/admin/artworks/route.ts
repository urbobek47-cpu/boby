import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseClient, mapRowToArtwork, mapArtworkToRow, clearDbArtworksCache } from "@/lib/supabase";

export async function GET(request: Request) {
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ success: false, reason: "Unauthorized admin access" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, reason: "Database client unavailable" }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const artworks = (data || []).map(mapRowToArtwork);
    return NextResponse.json({ success: true, artworks });
  } catch (err: any) {
    console.error("[Admin GET Artworks Error]", err);
    return NextResponse.json({ success: false, reason: err.message || "Failed to fetch artworks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ success: false, reason: "Unauthorized admin access" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, reason: "Database client unavailable" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { artwork } = body;
    if (!artwork || !artwork.slug) {
      return NextResponse.json({ success: false, reason: "Missing artwork payload" }, { status: 400 });
    }

    const row = mapArtworkToRow(artwork);
    const { error } = await supabase.from("artworks").upsert(row, { onConflict: "slug" });

    if (error) throw error;

    clearDbArtworksCache();
    return NextResponse.json({ success: true, artwork });
  } catch (err: any) {
    console.error("[Admin Update Artwork Error]", err);
    return NextResponse.json({ success: false, reason: err.message || "Failed to update artwork" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ success: false, reason: "Unauthorized admin access" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, reason: "Database client unavailable" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { slug } = body;
    if (!slug) {
      return NextResponse.json({ success: false, reason: "Missing artwork slug" }, { status: 400 });
    }

    const { error } = await supabase.from("artworks").delete().eq("slug", slug);
    if (error) throw error;

    try {
      await supabase.from("inventory").delete().eq("slug", slug);
    } catch {}

    clearDbArtworksCache();
    return NextResponse.json({ success: true, slug });
  } catch (err: any) {
    console.error("[Admin Delete Artwork Error]", err);
    return NextResponse.json({ success: false, reason: err.message || "Failed to delete artwork" }, { status: 500 });
  }
}
