import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders/reservation-engine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, reason: "ההזמנה לא נמצאה" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה באחזור ההזמנה" },
      { status: 500 }
    );
  }
}
