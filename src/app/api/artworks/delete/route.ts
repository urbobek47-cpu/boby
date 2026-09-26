import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteArtworkDb, getArtworkBySlugDb } from "@/lib/supabase";
import { removeCustomArtwork } from "@/lib/catalog/data";
import { getCustomArtworksServer } from "@/lib/catalog/custom-artworks-store";
import type { Artwork } from "@/lib/catalog/types";

export async function POST(request: Request) {
  try {
    const { slug, userEmail } = await request.json();

    if (!slug || !userEmail) {
      return NextResponse.json(
        { success: false, reason: "חסרים פרטי מזהה היצירה או משתמש" },
        { status: 400 }
      );
    }

    const decodedSlug = decodeURIComponent(slug);
    const cleanUserEmail = userEmail.toLowerCase();
    const userPrefix = userEmail.split("@")[0].toLowerCase();

    // 1. Check Supabase DB first
    const dbExisting = await getArtworkBySlugDb(decodedSlug) || await getArtworkBySlugDb(slug);

    // 2. Fallback: check server memory store & cookies if missing from DB
    let memoryExisting: Artwork | undefined;
    if (!dbExisting) {
      const serverCustom = getCustomArtworksServer();
      memoryExisting = serverCustom.find((a) => a.slug === slug || a.slug === decodedSlug);
      
      if (!memoryExisting) {
        try {
          const cookieStore = await cookies();
          const existingRaw = cookieStore.get("boby_custom_artworks")?.value;
          if (existingRaw) {
            const parsed: Artwork[] = JSON.parse(existingRaw);
            memoryExisting = parsed.find((a) => a.slug === slug || a.slug === decodedSlug);
          }
        } catch {
          // Ignore cookie parse error
        }
      }
    }

    const existing = dbExisting || memoryExisting;

    // 3. SERVER-SIDE OWNERSHIP VALIDATION
    if (existing) {
      const existingArtistSlug = (existing.artist?.slug || "").toLowerCase();
      const isOwner =
        existingArtistSlug === cleanUserEmail ||
        existingArtistSlug === userPrefix;

      if (!isOwner) {
        console.warn(`[Delete Denied] User ${userEmail} attempted to delete artwork ${slug} owned by ${existingArtistSlug}`);
        return NextResponse.json(
          { success: false, reason: "אינך מורשה למחוק יצירה זו" },
          { status: 403 }
        );
      }
    }

    // 4. Perform database deletion if it exists in Supabase
    let dbSuccess = false;
    if (dbExisting) {
      dbSuccess = await deleteArtworkDb(decodedSlug, userEmail);
    }

    // 5. Purge from memory & server cache
    removeCustomArtwork(decodedSlug);
    removeCustomArtwork(slug);

    // 6. Remove from cookie fallback
    try {
      const cookieStore = await cookies();
      const existingRaw = cookieStore.get("boby_custom_artworks")?.value;
      if (existingRaw) {
        let existingList: Artwork[] = JSON.parse(existingRaw);
        const filtered = existingList.filter((a) => a.slug !== slug && a.slug !== decodedSlug);
        const response = NextResponse.json(
          { success: true, dbSuccess, alreadyDeleted: !dbExisting, slug },
          { status: 200 }
        );
        response.cookies.set("boby_custom_artworks", JSON.stringify(filtered), {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
        });
        return response;
      }
    } catch {
      // Ignore cookie error
    }

    return NextResponse.json(
      { success: true, dbSuccess, alreadyDeleted: !dbExisting, slug },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Delete Error]", error);
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה במחיקת היצירה" },
      { status: 500 }
    );
  }
}
