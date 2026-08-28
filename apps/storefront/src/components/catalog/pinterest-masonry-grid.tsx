"use client";

import React from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/catalog/types";
import { Price } from "@/components/catalog/price";
import { LikeButton } from "@/components/ui/like-button";

interface PinterestMasonryGridProps {
  artworks: Artwork[];
}

function getOptimizedImageUrl(publicId: string | null | undefined, targetWidth = 400, quality = 75): string | null {
  if (!publicId) return null;
  if (publicId.includes("images.unsplash.com")) {
    return publicId
      .replace(/w=\d+/, `w=${targetWidth}`)
      .replace(/q=\d+/, `q=${quality}`);
  }
  return publicId;
}

export function PinterestMasonryGrid({ artworks }: PinterestMasonryGridProps) {
  const locale = useLocale() as Locale;

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2.5 md:gap-4 space-y-2.5 md:space-y-4">
      {artworks.map((artwork, index) => {
        const primaryImage = artwork.images[0];
        const artist = artwork.artist;
        const artistName = artist.displayName[locale] || artist.displayName.he;
        const artworkTitle = artwork.title[locale] || artwork.title.he;

        const isEager = index < 8;
        const cardImgSrc = getOptimizedImageUrl(primaryImage?.publicId, 400, 75);
        const avatarImgSrc = getOptimizedImageUrl(artist.portraitPublicId, 100, 75);

        return (
          <div
            key={artwork.slug}
            className="break-inside-avoid group relative overflow-hidden rounded-artwork bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40"
          >
            <Link
              href={`/works/${artwork.slug}`}
              className="block w-full focus-visible:outline-none"
            >
                {/* Floating Like Button */}
                <div className="absolute top-2.5 end-2.5 z-20">
                  <LikeButton slug={artwork.slug} title={artworkTitle} />
                </div>

                {cardImgSrc ? (
                  <img
                    src={cardImgSrc}
                    alt={`${artworkTitle} — ${artistName}`}
                    className="w-full h-auto object-cover transition-transform duration-300 ease-out transform-gpu group-hover:scale-105"
                    loading={isEager ? "eager" : "lazy"}
                    decoding={isEager ? "sync" : "async"}
                    {...(isEager ? { fetchPriority: "high" } : { fetchPriority: "low" })}
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-stone/30 text-text-muted text-small">
                    🎨 {artwork.category[locale] || artwork.category.he}
                  </div>
                )}

                {/* Mobile Bottom Overlay (Always visible on mobile) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-2.5 text-surface md:hidden">
                  <div className="flex items-center gap-2">
                    {avatarImgSrc && (
                      <img
                        src={avatarImgSrc}
                        alt={artistName}
                        className="h-6 w-6 rounded-full object-cover border border-surface/90 shrink-0"
                        loading={isEager ? "eager" : "lazy"}
                        decoding="async"
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
                <div className="absolute inset-x-0 bottom-0 hidden md:flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent pt-12 pb-3.5 px-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-surface pointer-events-none z-10">
                  <div className="flex items-center justify-between gap-2 pointer-events-auto">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {avatarImgSrc ? (
                        <img
                          src={avatarImgSrc}
                          alt={artistName}
                          className="h-7 w-7 rounded-full object-cover border border-surface/90 shadow-sm shrink-0"
                          loading={isEager ? "eager" : "lazy"}
                          decoding="async"
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

                    <Link
                      href={`/artists/${artist.slug}`}
                      className="text-caption font-medium text-text bg-surface border border-stone/40 px-2.5 py-1 rounded-control shadow-sm shrink-0 hover:bg-sand transition-colors"
                    >
                      צפה בסטודיו ←
                    </Link>
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
