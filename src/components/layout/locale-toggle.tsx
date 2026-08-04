"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Compact language switch for the header — a single control that flips to the
 * other locale on the current path (shows "עברית" on English pages, "EN" on
 * Hebrew pages). The full two-option switcher still lives in the footer.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const active = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const other = routing.locales.find((l) => l !== active)!;
  const label = other === "he" ? "עברית" : "EN";

  return (
    <button
      type="button"
      lang={other}
      onClick={() => router.replace(pathname, { locale: other })}
      className={cn(
        "rounded-[6px] px-2 py-2 font-medium text-text hover:text-accent-strong",
        className,
      )}
    >
      {label}
    </button>
  );
}
