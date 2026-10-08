import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseClient } from "@/lib/supabase";

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
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error && error.code !== "PGRST116" && !error.message.includes("does not exist")) {
      console.warn("[Admin GET Orders Supabase Warning]", error.message);
    }

    return NextResponse.json({ success: true, orders: ordersData || [] });
  } catch (err: any) {
    console.error("[Admin GET Orders Error]", err);
    return NextResponse.json({ success: true, orders: [] });
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
    const { orderId, status, trackingNumber } = body;
    if (!orderId) {
      return NextResponse.json({ success: false, reason: "Missing order ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        tracking_number: trackingNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ success: true, orderId, status });
  } catch (err: any) {
    console.error("[Admin Update Order Error]", err);
    return NextResponse.json({ success: false, reason: err.message || "Failed to update order" }, { status: 500 });
  }
}
