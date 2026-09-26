import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateArtworkDb, getArtworkBySlugDb } from "@/lib/supabase";
import { updateCustomArtwork } from "@/lib/catalog/data";
import type { Artwork } from "@/lib/catalog/types";

export async function POST(request: Request) {
  try {
    const { artwork, userEmail } = await request.json();

    if (!artwork || !artwork.slug || !userEmail) {
      return NextResponse.json(
        { success: false, reason: "חסרים פרטי מזהה היצירה או משתמש" },
        { status: 400 }
      );
    }

    const decodedSlug = decodeURIComponent(artwork.slug);
    const existing = await getArtworkBySlugDb(decodedSlug) || await getArtworkBySlugDb(artwork.slug);

    if (!existing) {
      return NextResponse.json(
        { success: false, reason: "היצירה המבוקשת לעדכון לא נמצאה" },
        { status: 404 }
      );
    }

    // SERVER-SIDE OWNERSHIP VALIDATION
    const existingArtistSlug = existing.artist?.slug || "";
    const userPrefix = userEmail.split("@")[0].toLowerCase();
    const cleanUserEmail = userEmail.toLowerCase();

    const isOwner =
      existingArtistSlug.toLowerCase() === cleanUserEmail ||
      existingArtistSlug.toLowerCase() === userPrefix;

    if (!isOwner) {
      console.warn(`[Update Denied] User ${userEmail} attempted to update artwork ${artwork.slug} owned by ${existingArtistSlug}`);
      return NextResponse.json(
        { success: false, reason: "אינך מורשה לערוך יצירה זו" },
        { status: 403 }
      );
    }

    // Preserve original owner artist info
    const updatedArtwork: Artwork = {
      ...artwork,
      artist: existing.artist,
    };

    // Update in Supabase PostgreSQL
    const dbSuccess = await updateArtworkDb(updatedArtwork, userEmail);

    // Update in memory & server store
    updateCustomArtwork(updatedArtwork);

    // Update in cookie fallback if exists
    try {
      const cookieStore = await cookies();
      const existingRaw = cookieStore.get("boby_custom_artworks")?.value;
      if (existingRaw) {
        let existingList: Artwork[] = JSON.parse(existingRaw);
        const updatedList = [updatedArtwork, ...existingList.filter((a) => a.slug !== artwork.slug)];
        const response = NextResponse.json({ success: true, artwork: updatedArtwork }, { status: 200 });
        response.cookies.set("boby_custom_artworks", JSON.stringify(updatedList), {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
        });
        return response;
      }
    } catch {
      // Ignore cookie error
    }

    return NextResponse.json({ success: true, dbSuccess, artwork: updatedArtwork }, { status: 200 });
  } catch (error) {
    console.error("[API Update Error]", error);
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בעדכון היצירה" },
      { status: 500 }
    );
  }
}
