import { NextResponse } from "next/server";
import { releaseArtworkAtomic } from "@/lib/orders/reservation-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artworkSlug, cartId } = body;

    if (!artworkSlug || !cartId) {
      return NextResponse.json(
        { success: false, reason: "חסרים פרטי יצירה או מזהה סל" },
        { status: 400 }
      );
    }

    const released = releaseArtworkAtomic(artworkSlug, cartId);
    return NextResponse.json({ success: released }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בשחרור היצירה" },
      { status: 500 }
    );
  }
}
