import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "./lib/admin-auth";

const handleIntl = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname targets admin dashboard (e.g. /admin, /he/admin, /en/admin)
  const isAdminPath =
    pathname.includes("/admin") &&
    !pathname.includes("/admin/login") &&
    !pathname.includes("/api/admin");

  if (isAdminPath) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = token ? await verifyAdminToken(token) : null;

    if (!isValid) {
      // Extract locale prefix if present (e.g., /he/admin -> /he/admin/login)
      const segments = pathname.split("/").filter(Boolean);
      const firstSegment = segments[0];
      const hasLocale = routing.locales.includes(firstSegment as any);
      const loginPath = hasLocale ? `/${firstSegment}/admin/login` : "/admin/login";

      const loginUrl = new URL(loginPath, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return handleIntl(request);
}

export const config = {
  // Match all pathnames except for API, _next, static files, etc.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
