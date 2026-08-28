"use client";

import React from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/catalog/types";
import { Price } from "@/components/catalog/price";

interface PinterestMasonryGridProps {
  artworks: Artwork[];
}

export function PinterestMasonryGrid({ artworks }: PinterestMasonryGridProps) {
  const locale = useLocale() as Locale;

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2.5 md:gap-4 space-y-2.5 md:space-y-4">
      {artworks.map((artwork) => {
        const primaryImage = artwork.images[0];
        const artist = artwork.artist;
        const artistName = artist.displayName[locale] || artist.displayName.he;
        const artworkTitle = artwork.title[locale] || artwork.title.he;

        return (
          <div
            key={artwork.slug}
            className="break-inside-avoid group relative overflow-hidden rounded-artwork bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40"
          >
            <Link
              href={`/artists/${artist.slug}`}
              className="block w-full focus-visible:outline-none"
            >
              {/* Image Container with Natural Aspect Ratio Bed */}
              <div className="relative w-full overflow-hidden bg-sand/40">
                {primaryImage?.publicId ? (
                  <img
                    src={primaryImage.publicId}
                    alt={`${artworkTitle} — ${artistName}`}
                    className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-stone/30 text-text-muted text-small">
                    🎨 {artwork.category[locale] || artwork.category.he}
                  </div>
                )}

                {/* Mobile Bottom Overlay (Always visible on mobile) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-2.5 text-surface md:hidden">
                  <div className="flex items-center gap-2">
                    {artist.portraitPublicId && (
                      <img
                        src={artist.portraitPublicId}
                        alt={artistName}
                        className="h-6 w-6 rounded-full object-cover border border-surface/90 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-semibold text-surface truncate">
                        <bdi>{artistName}</bdi>
                      </p>
                      <p className="text-[11px] text-surface/85 truncate">
                        {artworkTitle} · <span dir="ltr"><Price agorot={artwork.priceAgorot} /></span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Hover Info Overlay - Bottom-only gradient, artwork remains 100% visible */}
                <div className="absolute inset-x-0 bottom-0 hidden md:flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-12 pb-3.5 px-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-surface pointer-events-none">
                  <div className="flex items-center justify-between gap-2 pointer-events-auto">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {artist.portraitPublicId ? (
                        <img
                          src={artist.portraitPublicId}
                          alt={artistName}
                          className="h-7 w-7 rounded-full object-cover border border-surface/90 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-strong text-surface text-caption font-bold shrink-0">
                          {artistName.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-small font-semibold text-surface truncate">
                          <bdi>{artistName}</bdi>
                        </h4>
                        <p className="text-caption text-surface/90 truncate">
                          {artworkTitle} · <span dir="ltr"><Price agorot={artwork.priceAgorot} /></span>
                        </p>
                      </div>
                    </div>

                    <span className="text-caption font-medium text-text bg-surface/95 backdrop-blur-sm px-2.5 py-1 rounded-control shadow-sm shrink-0 hover:bg-surface transition-colors">
                      צפה בסטודיו ←
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
