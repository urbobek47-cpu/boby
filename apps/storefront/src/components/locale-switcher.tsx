"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Minimal locale switcher — keeps the current pathname and swaps the locale.
 * Real header/nav lands in Phase 1; this exists so Phase 0 can demonstrate the
 * he <-> en round-trip. Semantic <nav> + real <button>s (§5.1).
 */
export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const active = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className="mt-4 flex items-center gap-2">
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-current={isActive ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale })}
            className="rounded-[var(--radius-control)] border px-3 py-1.5 text-small transition-colors aria-[current=true]:border-[color:var(--color-text)] aria-[current=true]:bg-[color:var(--color-text)] aria-[current=true]:text-[color:var(--color-surface)]"
          >
            {t(locale as Locale)}
          </button>
        );
      })}
    </nav>
  );
}
