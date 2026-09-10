import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { HeaderSearchBar } from "@/components/layout/header-search-bar";

/**
 * Shared site header. A slim shipping-note bar (~30px), then a three-part row:
 * nav (start) · wordmark (centre) · cart & auth (end). Nav links only to pages that
 * exist. On mobile only "יצירות" + cart show beside the wordmark (which is the
 * home link); secondary links appear from the tablet breakpoint up.
 *
 * The cart pill is a non-functional placeholder in Phase 1 (read-only).
 */
import { CategoryDrawer } from "@/components/layout/category-drawer";

export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header className="relative z-40 bg-surface/95 backdrop-blur-md">
      <div className="border-b border-border bg-surface/90">
        <nav
          aria-label={t("menu")}
          className="mx-auto flex max-w-[var(--container-content)] items-center justify-between gap-1.5 sm:gap-4 px-2.5 py-2.5 sm:px-4 md:px-8 md:py-4"
        >
          {/* Logo & Category Hamburger Drawer */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <CategoryDrawer />
            <Link
              href="/"
              aria-label={t("brand")}
              className="font-display text-[1.2rem] sm:text-[1.4rem] font-medium tracking-[0.2em] text-text shrink-0 md:text-[1.65rem]"
            >
              BOBY
            </Link>
          </div>

          {/* Pinterest-Style Rounded Search Bar */}
          <div className="flex flex-1 items-center max-w-xl mx-1 sm:mx-2 md:mx-6 min-w-0">
            <HeaderSearchBar placeholder="חפש אמנים או יצירות..." />
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 text-small shrink-0">
            <Link
              href="/upload"
              className="hidden lg:inline-flex items-center gap-1 rounded-full bg-accent-strong px-3 py-1.5 text-small font-medium text-surface hover:bg-accent-hover transition-colors shadow-sm"
            >
              ✨ להעלות יצירה
            </Link>
            <Link
              href={{ pathname: "/account", query: { tab: "saved" } }}
              title="יצירות אהובות (מועדפים)"
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-sand px-2.5 sm:px-3 py-1.5 text-caption sm:text-small font-medium text-text hover:bg-stone/60 transition-colors"
            >
              ❤️ <span className="hidden lg:inline">אהובות</span>
            </Link>
            <UserMenu />
            <LocaleToggle />
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 sm:px-3 py-1.5 text-caption sm:text-small font-medium text-text">
              🛒 <span className="hidden xs:inline">{t("cart")}</span> <span dir="ltr">(0)</span>
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
