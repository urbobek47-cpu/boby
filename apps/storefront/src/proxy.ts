// Next 16 renamed the `middleware` file convention to `proxy`. next-intl still
// ships its handler under the `next-intl/middleware` import path; the handler
// itself is convention-agnostic and runs correctly as a proxy default export.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  //  - API routes
  //  - Next internals (_next, _vercel)
  //  - files with an extension (favicon.ico, images, fonts, …)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
