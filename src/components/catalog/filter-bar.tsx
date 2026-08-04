import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Discipline } from "@/lib/catalog/types";
import {
  PRICE_BANDS,
  activeFilterCount,
  type FilterParams,
  type SortKey,
} from "@/lib/catalog/filters";
import { cn } from "@/lib/cn";

type Query = Record<string, string>;

/** Build the query object for a filtered view, dropping empties (clean URLs). */
function toQuery(f: Partial<FilterParams>): Query {
  const q: Query = {};
  if (f.category) q.category = f.category;
  if (f.price) q.price = f.price;
  if (f.artist) q.artist = f.artist;
  if (f.sort && f.sort !== "newest") q.sort = f.sort;
  return q;
}

/** Toggle a facet value against the current filters (click active = clear). */
function toggle<K extends "category" | "price" | "artist">(
  current: FilterParams,
  key: K,
  value: string,
): Query {
  const next: FilterParams = { ...current };
  next[key] = current[key] === value ? undefined : (value as never);
  return toQuery(next);
}

export function FilterBar({
  filters,
  categories,
  artists,
}: {
  filters: FilterParams;
  categories: Discipline[];
  artists: Array<{ slug: string; name: Record<Locale, string> }>;
}) {
  const t = useTranslations("Catalog");
  const locale = useLocale() as Locale;
  const activeCount = activeFilterCount(filters);
  const sorts: SortKey[] = ["newest", "price-asc", "price-desc"];

  return (
    <section aria-label={t("filters")} className="flex flex-col gap-5">
      {/* Sort — keeps current filters, changes order. */}
      <FacetGroup label={t("sort.label")}>
        {sorts.map((s) => (
          <Chip
            key={s}
            active={filters.sort === s}
            query={toQuery({ ...filters, sort: s })}
          >
            {t(`sort.${s}`)}
          </Chip>
        ))}
      </FacetGroup>

      {categories.length > 0 && (
        <FacetGroup label={t("facet.category")}>
          {categories.map((c) => (
            <Chip key={c} active={filters.category === c} query={toggle(filters, "category", c)}>
              {t(`discipline.${c}`)}
            </Chip>
          ))}
        </FacetGroup>
      )}

      <FacetGroup label={t("facet.price")}>
        {PRICE_BANDS.map((b) => (
          <Chip key={b.key} active={filters.price === b.key} query={toggle(filters, "price", b.key)} ltr>
            {t(`price.${b.key}`)}
          </Chip>
        ))}
      </FacetGroup>

      {artists.length > 1 && (
        <FacetGroup label={t("facet.artist")}>
          {artists.map((a) => (
            <Chip key={a.slug} active={filters.artist === a.slug} query={toggle(filters, "artist", a.slug)}>
              <bdi>{a.name[locale]}</bdi>
            </Chip>
          ))}
        </FacetGroup>
      )}

      {activeCount > 0 && (
        <div className="flex items-center gap-3 text-small">
          <span className="text-text-muted">{t("activeFilters", { count: activeCount })}</span>
          <Link
            href={{ pathname: "/works", query: toQuery({ sort: filters.sort }) }}
            className="text-accent-strong underline-offset-4 hover:underline"
          >
            {t("clearAll")}
          </Link>
        </div>
      )}
    </section>
  );
}

function FacetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="shrink-0 text-small font-medium text-text-muted sm:w-24">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  query,
  children,
  ltr = false,
}: {
  active: boolean;
  query: Query;
  children: React.ReactNode;
  /** Isolate the label as LTR — for price ranges, so "₪150–350" doesn't reorder. */
  ltr?: boolean;
}) {
  return (
    <Link
      href={{ pathname: "/works", query }}
      aria-current={active ? "true" : undefined}
      dir={ltr ? "ltr" : undefined}
      className={cn(
        "inline-flex min-h-10 items-center rounded-pill border px-4 text-small transition-colors",
        active
          ? "border-text bg-text text-surface"
          : "border-border bg-surface text-text hover:border-text",
      )}
    >
      {children}
    </Link>
  );
}
