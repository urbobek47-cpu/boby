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
    const { data: artistsData, error } = await supabase
      .from("artists")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, users: artistsData || [] });
  } catch (err: any) {
    console.error("[Admin GET Users Error]", err);
    return NextResponse.json({ success: false, reason: err.message || "Failed to fetch users" }, { status: 500 });
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
    const { user } = body;
    if (!user || !user.slug) {
      return NextResponse.json({ success: false, reason: "Missing user payload" }, { status: 400 });
    }

    const { error } = await supabase.from("artists").upsert(
      {
        slug: user.slug,
        display_name: user.display_name,
        bio: user.bio,
        location: user.location,
        portrait_public_id: user.portrait_public_id,
        is_admin: Boolean(user.is_admin),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("[Admin Update User Error]", err);
    return NextResponse.json({ success: false, reason: err.message || "Failed to update user" }, { status: 500 });
  }
}
