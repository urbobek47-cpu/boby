import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleToggle } from "@/components/layout/locale-toggle";

/**
 * Shared site header. A slim shipping-note bar (~30px), then a three-part row:
 * nav (start) · wordmark (centre) · cart (end). Nav links only to pages that
 * exist. On mobile only "יצירות" + cart show beside the wordmark (which is the
 * home link); secondary links appear from the tablet breakpoint up.
 *
 * The cart pill is a non-functional placeholder in Phase 1 (read-only).
 */
export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header>
      <div className="flex min-h-[30px] items-center justify-center bg-deep px-6 py-1.5 text-center text-caption text-surface/90">
        {t("shipping")}
      </div>

      <div className="border-b border-border bg-surface">
        <nav
          aria-label={t("menu")}
          className="mx-auto grid max-w-[var(--container-content)] grid-cols-3 items-center px-6 py-4 md:px-12 md:py-5 lg:px-16"
        >
          <ul role="list" className="flex items-center gap-1 justify-self-start text-small font-medium">
            <li className="hidden sm:block">
              <Link href="/" className="rounded-[6px] px-2 py-2 text-text hover:text-accent-strong">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/works" className="rounded-[6px] px-2 py-2 text-text hover:text-accent-strong">
                {t("works")}
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/business" className="rounded-[6px] px-2 py-2 text-text hover:text-accent-strong">
                {t("business")}
              </Link>
            </li>
          </ul>

          <Link
            href="/"
            aria-label={t("brand")}
            className="justify-self-center font-display text-[1.5rem] font-normal tracking-[0.3em] text-text md:text-[1.75rem]"
          >
            BOBY
          </Link>

          <div className="flex items-center gap-1 justify-self-end text-small">
            <LocaleToggle />
            <span className="rounded-[6px] px-2 py-2 font-medium text-text">
              {t("cart")} <span dir="ltr">(0)</span>
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
