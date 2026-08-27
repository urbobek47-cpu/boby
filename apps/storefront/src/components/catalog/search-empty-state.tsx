"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import type { Artwork, Discipline } from "@/lib/catalog/types";
import { ArtworkCard } from "@/components/catalog/artwork-card";

interface SearchEmptyStateProps {
  query: string;
  hasFilters: boolean;
  categories: Array<{ key: Discipline; label: string }>;
  artists: Array<{ slug: string; name: string }>;
  recommendedArtworks: Artwork[];
}

export function SearchEmptyState({
  query,
  hasFilters,
  categories,
  artists,
  recommendedArtworks,
}: SearchEmptyStateProps) {
  return (
    <div className="mt-8 flex flex-col gap-8 rounded-panel bg-sand/60 p-6 md:p-10 border border-border/60">
      {/* Header Message */}
      <div className="flex flex-col gap-2">
        <h2 className="text-h2 font-medium text-text">
          לא נמצאו תוצאות עבור &quot;{query}&quot;
        </h2>
        <p className="text-small text-text-muted">
          נסה לבדוק את שגיאות הכתיב, לנסות מילות חיפוש כלליות יותר, או לחקור לפי קטגוריה ואמנים.
        </p>
        {hasFilters && (
          <div className="mt-2">
            <Link
              href="/works"
              className="inline-flex items-center gap-1.5 rounded-control bg-surface border border-border px-3.5 py-1.5 text-small font-medium text-accent-strong hover:bg-sand transition-colors"
            >
              🔄 איפוס כל הניקוי והפילטרים
            </Link>
          </div>
        )}
      </div>

      {/* Suggested Categories */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
          <h3 className="text-small font-semibold text-text">חפש לפי קטגוריה:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={{ pathname: "/works", query: { category: cat.key } }}
                className="rounded-full bg-surface px-4 py-1.5 text-small font-medium text-text border border-stone/60 hover:border-accent-strong hover:text-accent-strong transition-colors"
              >
                🎨 {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Artists */}
      {artists.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-small font-semibold text-text">אמנים מומלצים:</h3>
          <div className="flex flex-wrap gap-2">
            {artists.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="rounded-full bg-surface px-4 py-1.5 text-small font-medium text-text border border-stone/60 hover:border-accent-strong hover:text-accent-strong transition-colors"
              >
                ✨ <bdi>{artist.name}</bdi>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Artworks Fallback Grid */}
      {recommendedArtworks.length > 0 && (
        <div className="flex flex-col gap-4 pt-6 border-t border-border/50">
          <h3 className="text-h3 font-medium text-text">יצירות שאולי תאהב:</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recommendedArtworks.map((artwork) => (
              <ArtworkCard key={artwork.slug} artwork={artwork} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
