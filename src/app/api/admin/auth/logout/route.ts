import { NextResponse } from "next/server";
import { createClearAdminCookieHeader } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.append("Set-Cookie", createClearAdminCookieHeader());
  return response;
}
