import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // If path starts with /en or /he, serve as-is
  if (pathname.startsWith("/en") || pathname.startsWith("/he")) {
    return NextResponse.next();
  }

  // For default Hebrew routes without locale prefix (e.g. /upload, /account, /works),
  // rewrite internally to /he/... preserving query parameters
  const target = pathname === "/" ? `/he${search}` : `/he${pathname}${search}`;
  return NextResponse.rewrite(new URL(target, request.url));
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
