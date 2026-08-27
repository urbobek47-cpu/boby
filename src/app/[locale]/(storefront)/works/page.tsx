import React from "react";
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
import { searchCatalog, type SearchResult } from "@/lib/catalog/search";
import { ArtworkCard } from "@/components/catalog/artwork-card";
import { FilterBar } from "@/components/catalog/filter-bar";
import { FilterPanel } from "@/components/catalog/filter-panel";
import { ArtistSpotlightCard } from "@/components/catalog/artist-spotlight-card";
import { StoriesBar } from "@/components/catalog/stories-bar";
import { SearchEmptyState } from "@/components/catalog/search-empty-state";

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

  let searchInfo: SearchResult | undefined = undefined;
  if (filters.search) {
    searchInfo = searchCatalog(list, filters.search);
  }

  return (
    <CatalogueView
      allArtworks={list}
      filtered={filtered}
      filters={filters}
      searchInfo={searchInfo}
      categories={categoryOptions(list)}
      artists={artistOptions(list)}
    />
  );
}

function CatalogueView({
  allArtworks,
  filtered,
  filters,
  searchInfo,
  categories,
  artists,
}: {
  allArtworks: Artwork[];
  filtered: Artwork[];
  filters: FilterParams;
  searchInfo?: SearchResult;
  categories: Discipline[];
  artists: Array<{ slug: string; name: Record<Locale, string> }>;
}) {
  const t = useTranslations("Catalog");

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-3 py-6 md:px-12 md:py-16 lg:px-16">
      <header className="flex flex-col gap-3 px-2 md:px-0">
        <h1 className="text-[length:var(--text-h1)] font-medium md:text-[2.5rem]">
          {t("title")}
        </h1>
        <p className="max-w-[var(--container-prose)] text-text-muted">{t("intro")}</p>
      </header>

      {/* Instagram Stories Bar */}
      <div className="mt-4 border-b border-border/60 pb-2">
        <StoriesBar />
      </div>

      {/* Search Intent Badges & Artist Feature Highlights */}
      {searchInfo && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Price Intent Banner */}
          {searchInfo.priceIntent && (
            <div className="flex items-center gap-2 rounded-control bg-accent/15 px-4 py-2.5 text-small font-medium text-accent-strong border border-accent/30">
              <span>🏷️</span>
              <span>
                זיהינו כוונת מחיר בחיפוש: <strong>{searchInfo.priceIntent.label}</strong>
              </span>
            </div>
          )}

          {/* Artist Intent Match Banner */}
          {searchInfo.matchedArtist && (
            <div className="flex items-center justify-between rounded-panel bg-deep p-4 text-surface shadow-md">
              <div className="flex items-center gap-3">
                {searchInfo.matchedArtist.portraitPublicId ? (
                  <img
                    src={searchInfo.matchedArtist.portraitPublicId}
                    alt={searchInfo.matchedArtist.displayName.he}
                    className="h-12 w-12 rounded-full object-cover border-2 border-accent shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-surface font-bold text-h3">
                    {searchInfo.matchedArtist.displayName.he.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-small font-bold text-surface">
                    <bdi>{searchInfo.matchedArtist.displayName.he}</bdi>
                  </h3>
                  <p className="text-caption text-surface/80">
                    {searchInfo.matchedArtist.location.he} · {searchInfo.matchedArtist.bio.he.slice(0, 80)}...
                  </p>
                </div>
              </div>

              <Link
                href={`/artists/${searchInfo.matchedArtist.slug}`}
                className="hidden sm:inline-flex rounded-control bg-surface px-3.5 py-2 text-caption font-semibold text-text hover:bg-sand transition-colors shrink-0"
              >
                עבור לפרופיל האמן/ית ←
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 rounded-panel bg-sand p-4 md:p-6">
        <FilterPanel activeCount={activeFilterCount(filters)}>
          <FilterBar filters={filters} categories={categories} artists={artists} />
        </FilterPanel>
      </div>

      <p className="mt-6 px-2 md:px-0 text-small text-text-muted" aria-live="polite">
        {t("results", { count: filtered.length })}
      </p>

      {filtered.length > 0 ? (
        <ul
          role="list"
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-10"
        >
          {filtered.map((artwork, index) => (
            <React.Fragment key={artwork.slug}>
              <li>
                <ArtworkCard artwork={artwork} />
              </li>
              {/* Interspersed Story Card every 5 items */}
              {(index + 1) % 5 === 0 && artwork.artist && (
                <li className="col-span-2 md:col-span-3">
                  <ArtistSpotlightCard artist={artwork.artist} />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      ) : filters.search ? (
        <SearchEmptyState
          query={filters.search}
          hasFilters={activeFilterCount(filters) > 0}
          categories={searchInfo?.suggestions.categories || []}
          artists={searchInfo?.suggestions.artists || []}
          recommendedArtworks={allArtworks.slice(0, 6)}
        />
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
