"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/**
 * Mobile disclosure for the catalogue filters (design brief §Catalogue). Below
 * the tablet breakpoint the filters collapse behind a "סינון ומיון" button that
 * reports the active-filter count; from md up they are always shown and the
 * button is hidden. No layout shift on desktop, no JS needed there.
 */
export function FilterPanel({
  activeCount,
  children,
}: {
  activeCount: number;
  children: React.ReactNode;
}) {
  const t = useTranslations("Catalog");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between rounded-control border border-border bg-surface px-4 text-small font-medium md:hidden"
      >
        <span>
          {t("filtersAndSort")}
          {activeCount > 0 && <span className="text-accent-strong"> ({activeCount})</span>}
        </span>
        <span aria-hidden="true" className="text-text-muted">
          {open ? "–" : "+"}
        </span>
      </button>

      <div className={cn("mt-4 md:mt-0 md:block", open ? "block" : "hidden")}>{children}</div>
    </div>
  );
}
