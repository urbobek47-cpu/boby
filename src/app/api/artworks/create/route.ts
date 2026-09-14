import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addCustomArtwork } from "@/lib/catalog/data";
import { registerArtworkInventory } from "@/lib/orders/reservation-engine";
import { insertArtworkDb } from "@/lib/supabase";
import type { Artwork } from "@/lib/catalog/types";

export async function POST(request: Request) {
  try {
    const artwork = await request.json();

    if (!artwork || !artwork.slug || !artwork.title?.he) {
      return NextResponse.json(
        { success: false, reason: "פרטי היצירה אינם מלאים" },
        { status: 400 }
      );
    }

    // Register artwork in catalog store & memory
    addCustomArtwork(artwork);

    // Persist artwork directly in Supabase PostgreSQL database
    await insertArtworkDb(artwork);

    // Register artwork inventory in reservation engine
    registerArtworkInventory(artwork.slug, artwork.inventoryKind, artwork.inventoryKind === "UNIQUE" ? 1 : 10);

    const response = NextResponse.json({ success: true, artwork }, { status: 201 });

    // Set fallback cookie containing custom artworks for serverless lambda cross-instance reading
    try {
      const cookieStore = await cookies();
      const existingRaw = cookieStore.get("boby_custom_artworks")?.value;
      let existing: Artwork[] = [];
      if (existingRaw) {
        try { existing = JSON.parse(existingRaw); } catch {}
      }
      const updated = [artwork, ...existing.filter((a) => a.slug !== artwork.slug)].slice(0, 20);
      response.cookies.set("boby_custom_artworks", JSON.stringify(updated), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });
    } catch {
      // Ignore cookie set errors
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בפרסום היצירה במערכת" },
      { status: 500 }
    );
  }
}


