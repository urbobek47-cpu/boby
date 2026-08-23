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
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 md:gap-3 space-y-2 md:space-y-3">
      {artworks.map((artwork) => {
        const primaryImage = artwork.images[0];
        const artist = artwork.artist;
        const artistName = artist.displayName[locale] || artist.displayName.he;
        const artworkTitle = artwork.title[locale] || artwork.title.he;
        const artistLocation = artist.location[locale] || artist.location.he;

        return (
          <div
            key={artwork.slug}
            className="break-inside-avoid group relative overflow-hidden rounded-card bg-surface shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <Link
              href={`/artists/${artist.slug}`}
              className="block w-full focus-visible:outline-none"
            >
              {/* Image Container with Dynamic Aspect Ratio */}
              <div className="relative w-full overflow-hidden bg-sand/40">
                {primaryImage?.publicId ? (
                  <img
                    src={primaryImage.publicId}
                    alt={`${artworkTitle} — ${artistName}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-stone/30 text-text-muted">
                    🎨 {artwork.category[locale] || artwork.category.he}
                  </div>
                )}

                {/* Mobile Bottom Badge (Always visible on mobile) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/80 via-deep/40 to-transparent p-2.5 text-surface md:hidden">
                  <div className="flex items-center gap-2">
                    {artist.portraitPublicId && (
                      <img
                        src={artist.portraitPublicId}
                        alt={artistName}
                        className="h-6 w-6 rounded-full object-cover border border-surface/80 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-semibold text-surface truncate">
                        <bdi>{artistName}</bdi>
                      </p>
                      <p className="text-[10px] text-surface/80 truncate">
                        {artworkTitle} · <span dir="ltr"><Price agorot={artwork.priceAgorot} /></span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Hover Overlay (Pinterest-Style Social Network Feed) */}
                <div className="absolute inset-0 hidden md:flex flex-col justify-between bg-gradient-to-t from-deep/90 via-deep/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-surface">
                  {/* Top Bar on Hover */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent-strong/90 px-2.5 py-1 text-[11px] font-semibold text-surface shadow-sm">
                      גלריית אמן/ית
                    </span>
                    <span className="rounded-full bg-surface/20 px-2 py-0.5 text-caption font-medium text-surface backdrop-blur-sm">
                      {artistLocation}
                    </span>
                  </div>

                  {/* Bottom Info on Hover */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      {artist.portraitPublicId ? (
                        <img
                          src={artist.portraitPublicId}
                          alt={artistName}
                          className="h-9 w-9 rounded-full object-cover border-2 border-surface shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-surface text-small font-bold">
                          {artistName.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-small font-bold text-surface truncate">
                          <bdi>{artistName}</bdi>
                        </h4>
                        <p className="text-caption text-surface/80 truncate">
                          {artworkTitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-caption line-clamp-2 text-surface/80 font-serif italic">
                      &quot;{artist.bio[locale] || artist.bio.he}&quot;
                    </p>

                    <div className="mt-1 flex items-center justify-between pt-1 border-t border-surface/20">
                      <span className="text-small font-bold text-surface">
                        <Price agorot={artwork.priceAgorot} />
                      </span>
                      <span className="text-caption font-semibold text-accent-strong bg-surface px-2.5 py-1 rounded-control shadow-sm group-hover:bg-sand transition-colors">
                        צפה בסטודיו ←
                      </span>
                    </div>
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
