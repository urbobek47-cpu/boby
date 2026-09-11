import { NextResponse } from "next/server";
import { reserveArtworkAtomic } from "@/lib/orders/reservation-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artworkSlug, cartId, inventoryKind } = body;

    if (!artworkSlug || !cartId) {
      return NextResponse.json(
        { success: false, reason: "חסרים פרטי יצירה או מזהה סל" },
        { status: 400 }
      );
    }

    const result = reserveArtworkAtomic(
      artworkSlug,
      cartId,
      inventoryKind || "UNIQUE"
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בביצוע ההזמנה במלאי" },
      { status: 500 }
    );
  }
}
