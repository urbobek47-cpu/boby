import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

/**
 * Shared site footer. Brand + tagline, a short browse column, the locale
 * switch, and the legal note (BOBY is the merchant of record — §1). Links go
 * only to real destinations; the corporate + newsletter anchors live on the
 * home page, so those footer entries point at the homepage sections.
 */
export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[var(--container-content)] flex-col gap-10 px-6 py-14 md:flex-row md:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <span className="font-display text-[length:var(--text-h3)] tracking-[0.2em]">
            BOBY
          </span>
          <p className="text-small text-text-muted">{t("tagline")}</p>
        </div>

        <nav aria-label={t("browse")} className="flex flex-col gap-3 text-small">
          <span className="text-caption font-medium text-text-muted">{t("browse")}</span>
          <Link href="/works" className="hover:text-accent-strong">
            {t("works")}
          </Link>
          <Link href="/business" className="hover:text-accent-strong">
            {t("business")}
          </Link>
          <Link href="/terms" className="hover:text-accent-strong">
            {t("terms")}
          </Link>
          <Link href="/accessibility" className="hover:text-accent-strong">
            {t("accessibility")}
          </Link>
          <Link href="/#newsletter" className="hover:text-accent-strong">
            {t("newsletter")}
          </Link>
        </nav>

        <LocaleSwitcher />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[var(--container-content)] flex-col gap-1 px-6 py-6 text-caption text-text-muted">
          <span>{t("legalNote")}</span>
          <span>
            © <span dir="ltr">2026</span> BOBY · {t("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
