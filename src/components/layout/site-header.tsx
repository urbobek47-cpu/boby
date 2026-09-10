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
          <div className="flex items-center sm:flex-1 sm:max-w-xl mx-0.5 sm:mx-2 md:mx-6 min-w-0">
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
              aria-label="יצירות אהובות"
              title="יצירות אהובות (מועדפים)"
              className="flex items-center justify-center h-9 w-9 rounded-full bg-sand hover:bg-stone/60 text-[#8A5335] transition-colors shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#8A5335]"
                aria-hidden="true"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
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
