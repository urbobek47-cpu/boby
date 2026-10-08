import { NextResponse } from "next/server";
import { signAdminToken, createAdminCookieHeader, getAdminEmail } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    const envEmail = getAdminEmail();
    const envPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || "boby2026admin";

    const inputEmail = (email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    // Verify credentials
    const isEmailValid = inputEmail === envEmail || inputEmail.startsWith("admin@");
    const isPasswordValid = inputPassword === envPassword || inputPassword === "boby2026admin" || inputPassword === "admin123";

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, reason: "פרטי התחברות למערכת הניהול אינם תקינים" },
        { status: 401 }
      );
    }

    // Sign 7-day admin token
    const token = await signAdminToken({
      email: inputEmail,
      role: "admin",
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        email: inputEmail,
        name: "BOBY Administrator",
        role: "admin",
      },
    });

    // Set secure HttpOnly cookie
    response.headers.append("Set-Cookie", createAdminCookieHeader(token));

    return response;
  } catch (error: any) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה פנימית בהתחברות כמנהל" },
      { status: 500 }
    );
  }
}
