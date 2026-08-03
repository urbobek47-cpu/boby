import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { seoAlternates } from "@/lib/site";
import { listArtworks } from "@/lib/catalog/data";
import type { Artwork, Discipline } from "@/lib/catalog/types";
import {
  applyFilters,
  parseFilters,
  categoryOptions,
  artistOptions,
  activeFilterCount,
  type FilterParams,
} from "@/lib/catalog/filters";
import { ArtworkCard } from "@/components/catalog/artwork-card";
import { FilterBar } from "@/components/catalog/filter-bar";
import { FilterPanel } from "@/components/catalog/filter-panel";

type Params = { locale: string };
type Search = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catalog" });
  return {
    title: `${t("title")} · BOBY`,
    description: t("intro"),
    // Filtered views (?category=…) are the same catalogue — canonical + hreflang
    // point at the base /works, so query variants don't fragment indexing.
    alternates: seoAlternates(locale as Locale, "/works"),
  };
}

export default async function CataloguePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const list = await listArtworks();
  const filters = parseFilters(await searchParams);
  const filtered = applyFilters(list, filters);

  return (
    <CatalogueView
      filtered={filtered}
      filters={filters}
      categories={categoryOptions(list)}
      artists={artistOptions(list)}
    />
  );
}

function CatalogueView({
  filtered,
  filters,
  categories,
  artists,
}: {
  filtered: Artwork[];
  filters: FilterParams;
  categories: Discipline[];
  artists: Array<{ slug: string; name: Record<Locale, string> }>;
}) {
  const t = useTranslations("Catalog");

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-6 py-10 md:px-12 md:py-16 lg:px-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-[length:var(--text-h1)] font-medium md:text-[2.5rem]">
          {t("title")}
        </h1>
        <p className="max-w-[var(--container-prose)] text-text-muted">{t("intro")}</p>
      </header>

      <div className="mt-8 rounded-panel bg-sand p-5 md:p-6">
        <FilterPanel activeCount={activeFilterCount(filters)}>
          <FilterBar filters={filters} categories={categories} artists={artists} />
        </FilterPanel>
      </div>

      <p className="mt-8 text-small text-text-muted" aria-live="polite">
        {t("results", { count: filtered.length })}
      </p>

      {filtered.length > 0 ? (
        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((artwork) => (
            <li key={artwork.slug}>
              <ArtworkCard artwork={artwork} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState hasFilters={activeFilterCount(filters) > 0} sort={filters.sort} />
      )}
    </main>
  );
}

function EmptyState({
  hasFilters,
  sort,
}: {
  hasFilters: boolean;
  sort: FilterParams["sort"];
}) {
  const t = useTranslations("Catalog");
  return (
    <div className="mt-10 flex flex-col items-start gap-3 rounded-panel bg-sand p-8">
      <p className="text-h3 font-semibold">{t("empty.title")}</p>
      <p className="text-text-muted">{t("empty.body")}</p>
      {hasFilters && (
        <Link
          href={{
            pathname: "/works",
            query: sort !== "newest" ? { sort } : {},
          }}
          className="mt-1 text-accent-strong underline-offset-4 hover:underline"
        >
          {t("empty.cta")}
        </Link>
      )}
    </div>
  );
}
