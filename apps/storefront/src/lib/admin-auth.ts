import { NextResponse } from "next/server";

// Fallback secret if env variable is not set yet in dev
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "boby-secure-admin-secret-2026-key";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@boby.co.il").toLowerCase();

export const ADMIN_COOKIE_NAME = "boby_admin_session";

// Web Crypto HMAC SHA-256 for Edge and Node compatibility
async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(ADMIN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminToken(payload: { email: string; role: "admin"; exp: number }): Promise<string> {
  const key = await getHmacKey();
  const enc = new TextEncoder();
  const dataStr = JSON.stringify(payload);
  const dataBytes = enc.encode(dataStr);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, dataBytes);

  const base64Data = Buffer.from(dataStr).toString("base64url");
  const base64Sig = Buffer.from(signatureBuffer).toString("base64url");
  return `${base64Data}.${base64Sig}`;
}

export async function verifyAdminToken(token: string): Promise<{ email: string; role: "admin"; exp: number } | null> {
  try {
    if (!token || !token.includes(".")) return null;
    const [base64Data, base64Sig] = token.split(".");
    if (!base64Data || !base64Sig) return null;

    const dataStr = Buffer.from(base64Data, "base64url").toString("utf-8");
    const payload = JSON.parse(dataStr);

    if (payload.role !== "admin" || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    const key = await getHmacKey();
    const enc = new TextEncoder();
    const dataBytes = enc.encode(dataStr);
    const signatureBytes = Buffer.from(base64Sig, "base64url");

    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, dataBytes);
    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function verifyAdminSession(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parseCookies(cookieHeader);
  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) return false;

  const valid = await verifyAdminToken(token);
  return Boolean(valid);
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts.shift()?.trim();
    const value = parts.join("=").trim();
    if (name) {
      list[name] = decodeURIComponent(value);
    }
  });

  return list;
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

export function createAdminCookieHeader(token: string): string {
  // Max-age: 7 days
  const maxAge = 60 * 60 * 24 * 7;
  const isProd = process.env.NODE_ENV === "production";
  return `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`;
}

export function createClearAdminCookieHeader(): string {
  return `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
