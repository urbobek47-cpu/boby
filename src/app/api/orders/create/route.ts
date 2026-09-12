import { NextResponse } from "next/server";
import { createOrderAtomic } from "@/lib/orders/reservation-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, buyer, gift, lines, totals } = body;

    if (!cartId || !buyer || !lines || lines.length === 0 || !totals) {
      return NextResponse.json(
        { success: false, reason: "פרטי ההזמנה אינם מלאים" },
        { status: 400 }
      );
    }

    const result = createOrderAtomic({
      cartId,
      buyer,
      gift,
      lines,
      totals,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה יצירת ההזמנה" },
      { status: 500 }
    );
  }
}
