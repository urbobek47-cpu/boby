import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { UserMenu } from "@/components/auth/user-menu";

/**
 * Shared site header. A slim shipping-note bar (~30px), then a three-part row:
 * nav (start) · wordmark (centre) · cart & auth (end). Nav links only to pages that
 * exist. On mobile only "יצירות" + cart show beside the wordmark (which is the
 * home link); secondary links appear from the tablet breakpoint up.
 *
 * The cart pill is a non-functional placeholder in Phase 1 (read-only).
 */
export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header className="relative z-40 bg-surface/95 backdrop-blur-md">
      <div className="flex min-h-[30px] items-center justify-center bg-deep px-6 py-1.5 text-center text-caption text-surface/90">
        {t("shipping")}
      </div>

      <div className="border-b border-border bg-surface/90">
        <nav
          aria-label={t("menu")}
          className="mx-auto flex max-w-[var(--container-content)] items-center justify-between gap-1.5 sm:gap-4 px-2.5 py-2.5 sm:px-4 md:px-8 md:py-4"
        >
          {/* Logo Brand */}
          <Link
            href="/"
            aria-label={t("brand")}
            className="font-display text-[1.2rem] sm:text-[1.4rem] font-medium tracking-[0.2em] text-text shrink-0 md:text-[1.65rem]"
          >
            BOBY
          </Link>

          {/* Pinterest-Style Rounded Search Bar */}
          <div className="flex flex-1 items-center max-w-xl mx-1 sm:mx-2 md:mx-6">
            <form action="/works" method="GET" className="relative w-full">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted text-small" aria-hidden="true">
                🔍
              </span>
              <input
                type="text"
                name="search"
                placeholder="חפש אמנים או יצירות..."
                className="w-full rounded-full bg-sand/60 ps-8 pe-3 py-1.5 sm:ps-10 sm:pe-4 sm:py-2 text-caption sm:text-small text-text placeholder:text-text-muted/70 border border-stone/60 transition-all focus:border-accent-strong focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-strong/20"
              />
            </form>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 text-small shrink-0">
            <Link
              href="/works"
              className="hidden md:inline-flex rounded-full bg-sand px-3 py-1.5 text-small font-medium text-text hover:bg-stone/60 transition-colors"
            >
              {t("works")}
            </Link>
            <UserMenu />
            <LocaleToggle />
            <span className="hidden sm:inline-flex rounded-full bg-sand px-3 py-1.5 font-medium text-text">
              {t("cart")} <span dir="ltr">(0)</span>
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
