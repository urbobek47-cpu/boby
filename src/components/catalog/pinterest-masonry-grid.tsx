"use client";

import React from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artist, Artwork } from "@/lib/catalog/types";
import { Price } from "@/components/catalog/price";
import { LikeButton } from "@/components/ui/like-button";

interface PinterestMasonryGridProps {
  artworks: Artwork[];
  featuredArtist?: Artist;
  showCorporateTile?: boolean;
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

export function PinterestMasonryGrid({
  artworks,
  featuredArtist,
  showCorporateTile = false,
}: PinterestMasonryGridProps) {
  const locale = useLocale() as Locale;

  return (
    <div className="columns-2 md:columns-3 gap-3 md:gap-6 space-y-3 md:space-y-6">
      {artworks.map((artwork, index) => {
        const primaryImage = artwork.images[0];
        const artist = artwork.artist;
        const artistName = artist.displayName[locale] || artist.displayName.he;
        const artworkTitle = artwork.title[locale] || artwork.title.he;

        const isEager = index < 4;
        const aspectRatio = primaryImage?.aspectRatio || 4 / 5;
        const cardImgSrc = getOptimizedImageUrl(primaryImage?.publicId, 400, 75);
        const avatarImgSrc = getOptimizedImageUrl(artist.portraitPublicId, 100, 75);

        // Viewport-specific artwork visibility per user request:
        // Hide "אור מכתש פנורמי" on mobile; hide "קערת סלט טרקוטה" & "פסל עץ אלון ממוחזר" on desktop
        const isMobileHidden = artwork.slug === "art-painting-desert-horizon";
        const isDesktopHidden = artwork.slug === "art-ceramics-terracotta-salad-bowl" || artwork.slug === "art-wood-oak-sculpture";
        const visibilityClass = isMobileHidden
          ? "hidden md:flex md:flex-col"
          : isDesktopHidden
            ? "flex flex-col md:hidden"
            : "flex flex-col";

        return (
          <React.Fragment key={artwork.slug}>
            <div
              className={`break-inside-avoid group relative overflow-hidden rounded-[14px] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40 ${visibilityClass}`}
            >
              {/* Top-Left Corner Heart Button: Hidden by default, visible on hover */}
              <div className="absolute top-3 left-3 z-30 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* logical-ok */}
                <LikeButton slug={artwork.slug} title={artworkTitle} />
              </div>

              <Link
                href={`/works/${artwork.slug}`}
                className="block w-full focus-visible:outline-none flex-1 flex flex-col"
              >
                {/* Image Container with Natural Aspect Ratio Bed */}
                <div
                  className="relative w-full overflow-hidden bg-sand/40 shrink-0"
                  style={{ aspectRatio: `${aspectRatio}` }}
                >
                  {cardImgSrc ? (
                    <img
                      src={cardImgSrc}
                      alt={`${artworkTitle} — ${artistName}`}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out transform-gpu group-hover:scale-105"
                      loading={isEager ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-stone/30 text-text-muted text-small">
                      🎨 {artwork.category[locale] || artwork.category.he}
                    </div>
                  )}
                </div>

                {/* Permanent Text Info Container directly beneath image in earthy brown tone (#E5D8C8) */}
                <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-small sm:text-body font-medium text-[#2A211E] group-hover:text-accent-strong truncate">
                      {artworkTitle}
                    </h3>
                    <Price agorot={artwork.priceAgorot} className="text-small sm:text-body font-semibold text-[#2A211E] shrink-0" />
                  </div>

                  <div className="flex items-center justify-between gap-2 text-caption text-[#5C483A]">
                    <div className="flex items-center gap-2 min-w-0">
                      {avatarImgSrc ? (
                        <img
                          src={avatarImgSrc}
                          alt={artistName}
                          className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover border border-[#C8B8A6] shrink-0"
                          loading={isEager ? "eager" : "lazy"}
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent-strong text-surface text-[10px] font-bold shrink-0">
                          {artistName.slice(0, 1)}
                        </div>
                      )}
                      <span className="truncate font-medium text-[#5C483A]">
                        <bdi>{artistName}</bdi>
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-accent-strong group-hover:translate-x-[-2px] transition-transform shrink-0">
                      ←
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Artist Spotlight Editorial Tile (Position 4) */}
            {featuredArtist && index === 3 && (
              <div
                key="artist-spotlight-tile"
                className="break-inside-avoid group relative overflow-hidden rounded-[14px] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40 flex flex-col"
              >
                <Link
                  href={`/artists/${featuredArtist.slug}`}
                  className="block w-full focus-visible:outline-none flex-1 flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/40 shrink-0">
                    <img
                      src={getOptimizedImageUrl(featuredArtist.portraitPublicId, 400, 75) || ""}
                      alt={featuredArtist.displayName[locale] || featuredArtist.displayName.he}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 start-3 z-10">
                      <span className="text-[11px] font-bold text-surface bg-accent-strong/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-surface/30 shadow-sm">
                        ✨ פוקוס אמנית
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-small sm:text-body font-medium text-[#2A211E] group-hover:text-accent-strong truncate">
                        <bdi>{featuredArtist.displayName[locale] || featuredArtist.displayName.he}</bdi>
                      </h3>
                      <span className="text-caption font-semibold text-[#8A5335] shrink-0">
                        סיפור סטודיו
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-caption text-[#5C483A]">
                      <p className="truncate font-medium text-[#5C483A]">
                        קולקציה ויצירות מקוריות
                      </p>
                      <span className="text-[11px] font-medium text-accent-strong group-hover:translate-x-[-2px] transition-transform shrink-0">
                        לסיפור ←
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Corporate Gifts Service Tile (Position 9) */}
            {showCorporateTile && index === 8 && (
              <div
                key="corporate-gifts-tile"
                className="break-inside-avoid group relative overflow-hidden rounded-[14px] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40 flex flex-col"
              >
                <Link
                  href="/business"
                  className="block w-full focus-visible:outline-none flex-1 flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/40 shrink-0">
                    <img
                      src="/mock/gift-set.jpg"
                      alt="מארז מתנה עם כלי קרמיקה, טקסטיל ופריט עץ בעבודת יד"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 start-3 z-10">
                      <span className="text-[11px] font-bold text-surface bg-deep/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-surface/30 shadow-sm">
                        🎁 מתנות לעסקים
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-small sm:text-body font-medium text-[#2A211E] group-hover:text-accent-strong truncate">
                        מתנות מקוריות בעבודת יד
                      </h3>
                      <span className="text-caption font-semibold text-[#8A5335] shrink-0">
                        מארזים ואוצרות
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-caption text-[#5C483A]">
                      <p className="truncate font-medium text-[#5C483A]">
                        לחברות ואירועים עסקיים
                      </p>
                      <span className="text-[11px] font-medium text-accent-strong group-hover:translate-x-[-2px] transition-transform shrink-0">
                        לפרטים ←
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
