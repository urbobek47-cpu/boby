import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // If path starts with /en, serve as English locale
  if (pathname.startsWith("/en")) {
    return NextResponse.next();
  }

  // For all default Hebrew routes, rewrite internally to /he/...
  // preserving query parameters (e.g., ?search=..., ?category=...)
  if (!pathname.startsWith("/he")) {
    const target = pathname === "/" ? `/he${search}` : `/he${pathname}${search}`;
    return NextResponse.rewrite(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
