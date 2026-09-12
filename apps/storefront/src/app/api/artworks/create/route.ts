import { NextResponse } from "next/server";
import { addCustomArtwork } from "@/lib/catalog/data";
import { registerArtworkInventory } from "@/lib/orders/reservation-engine";

export async function POST(request: Request) {
  try {
    const artwork = await request.json();

    if (!artwork || !artwork.slug || !artwork.title?.he) {
      return NextResponse.json(
        { success: false, reason: "פרטי היצירה אינם מלאים" },
        { status: 400 }
      );
    }

    // Register artwork in catalog store
    addCustomArtwork(artwork);

    // Register artwork inventory in reservation engine
    registerArtworkInventory(artwork.slug, artwork.inventoryKind, artwork.inventoryKind === "UNIQUE" ? 1 : 10);

    return NextResponse.json({ success: true, artwork }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בפרסום היצירה במערכת" },
      { status: 500 }
    );
  }
}
