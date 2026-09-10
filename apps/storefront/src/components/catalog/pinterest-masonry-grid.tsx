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

  // Filter artworks per viewport visibility rules:
  // Mobile hides "אור מכתש פנורמי" (art-painting-desert-horizon)
  const mobileArtworks = artworks.filter((a) => a.slug !== "art-painting-desert-horizon");
  // Desktop hides "קערת סלט טרקוטה" & "פסל עץ אלון ממוחזר"
  const desktopArtworks = artworks.filter(
    (a) => a.slug !== "art-ceramics-terracotta-salad-bowl" && a.slug !== "art-wood-oak-sculpture"
  );

  // Build Mobile 2-Column arrays (<768px)
  const mobileCols: React.ReactNode[][] = [[], []];
  mobileArtworks.forEach((artwork, index) => {
    const targetCol = index % 2;
    mobileCols[targetCol].push(
      <ArtworkMasonryCard key={artwork.slug} artwork={artwork} locale={locale} isEager={index < 4} />
    );

    if (featuredArtist && index === 3) {
      mobileCols[(targetCol + 1) % 2].push(
        <ArtistSpotlightTile key="artist-spotlight-mobile" featuredArtist={featuredArtist} locale={locale} />
      );
    }
    if (showCorporateTile && index === 8) {
      mobileCols[(targetCol + 1) % 2].push(
        <CorporateGiftsTile key="corporate-gifts-mobile" />
      );
    }
  });

  // Build Tablet 2-Column Large Layout (768px - 1024px)
  const tabletCols: React.ReactNode[][] = [[], []];
  desktopArtworks.forEach((artwork, index) => {
    const targetCol = index % 2;
    tabletCols[targetCol].push(
      <ArtworkMasonryCard key={artwork.slug} artwork={artwork} locale={locale} isEager={index < 4} />
    );

    if (featuredArtist && index === 3) {
      tabletCols[(targetCol + 1) % 2].push(
        <ArtistSpotlightTile key="artist-spotlight-tablet" featuredArtist={featuredArtist} locale={locale} />
      );
    }
    if (showCorporateTile && index === 8) {
      tabletCols[(targetCol + 1) % 2].push(
        <CorporateGiftsTile key="corporate-gifts-tablet" />
      );
    }
  });

  // Build Desktop 3-Column Large Layout (>=1024px / Large Screens & Monitors)
  const desktopCols: React.ReactNode[][] = [[], [], []];
  desktopArtworks.forEach((artwork, index) => {
    const targetCol = index % 3;
    desktopCols[targetCol].push(
      <ArtworkMasonryCard key={artwork.slug} artwork={artwork} locale={locale} isEager={index < 4} />
    );

    if (featuredArtist && index === 3) {
      desktopCols[(targetCol + 1) % 3].push(
        <ArtistSpotlightTile key="artist-spotlight-desktop" featuredArtist={featuredArtist} locale={locale} />
      );
    }
    if (showCorporateTile && index === 8) {
      desktopCols[(targetCol + 1) % 3].push(
        <CorporateGiftsTile key="corporate-gifts-desktop" />
      );
    }
  });

  return (
    <>
      {/* Mobile 2-Column Explicit Flex Layout */}
      <div className="flex md:hidden flex-row gap-8 sm:gap-10 w-full items-start">
        <div className="flex flex-col gap-8 sm:gap-10 flex-1 min-w-0">
          {mobileCols[0].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
        <div className="flex flex-col gap-8 sm:gap-10 flex-1 min-w-0">
          {mobileCols[1].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
      </div>

      {/* Tablet 2-Column Large Layout (768px - 1024px) */}
      <div className="hidden md:flex lg:hidden flex-row gap-12 md:gap-14 w-full items-start">
        <div className="flex flex-col gap-12 md:gap-14 flex-1 min-w-0">
          {tabletCols[0].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
        <div className="flex flex-col gap-12 md:gap-14 flex-1 min-w-0">
          {tabletCols[1].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
      </div>

      {/* Widescreen Desktop 3-Column Large Layout (>=1024px) */}
      <div className="hidden lg:flex flex-row gap-14 lg:gap-16 xl:gap-20 2xl:gap-24 w-full items-start">
        <div className="flex flex-col gap-14 lg:gap-16 xl:gap-20 2xl:gap-24 flex-1 min-w-0">
          {desktopCols[0].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
        <div className="flex flex-col gap-14 lg:gap-16 xl:gap-20 2xl:gap-24 flex-1 min-w-0">
          {desktopCols[1].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
        <div className="flex flex-col gap-14 lg:gap-16 xl:gap-20 2xl:gap-24 flex-1 min-w-0">
          {desktopCols[2].map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Card Components */

function ArtworkMasonryCard({
  artwork,
  locale,
  isEager,
}: {
  artwork: Artwork;
  locale: Locale;
  isEager?: boolean;
}) {
  const primaryImage = artwork.images[0];
  const artist = artwork.artist;
  const artistName = artist.displayName[locale] || artist.displayName.he;
  const artworkTitle = artwork.title[locale] || artwork.title.he;

  const aspectRatio = primaryImage?.aspectRatio || 4 / 5;
  const cardImgSrc = getOptimizedImageUrl(primaryImage?.publicId, 800, 80);
  const avatarImgSrc = getOptimizedImageUrl(artist.portraitPublicId, 120, 80);

  return (
    <div className="group relative overflow-hidden rounded-[14px] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-lg border border-stone/40 flex flex-col w-full">
      {/* Top-Start Corner Heart Button: Hidden by default, visible on hover */}
      <div className="absolute top-3 start-3 z-30 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            <div className="flex h-56 w-full items-center justify-center bg-stone/30 text-text-muted text-body">
              🎨 {artwork.category[locale] || artwork.category.he}
            </div>
          )}
        </div>

        {/* Permanent Text Info Container directly beneath image in earthy brown tone (#E5D8C8) */}
        <div className="p-3.5 sm:p-4 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full mt-auto">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-small sm:text-body md:text-[1.1rem] font-medium text-[#2A211E] group-hover:text-accent-strong truncate">
              {artworkTitle}
            </h3>
            <Price agorot={artwork.priceAgorot} className="text-small sm:text-body md:text-[1.1rem] font-semibold text-[#2A211E] shrink-0" />
          </div>

          <div className="flex items-center justify-between gap-2 text-caption sm:text-small text-[#5C483A]">
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
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent-strong text-surface text-[10px] sm:text-caption font-bold shrink-0">
                  {artistName.slice(0, 1)}
                </div>
              )}
              <span className="truncate font-medium text-[#5C483A] text-caption sm:text-small">
                <bdi>{artistName}</bdi>
              </span>
            </div>

            <span className="text-caption font-medium text-accent-strong group-hover:translate-x-[-2px] transition-transform shrink-0">
              ←
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function ArtistSpotlightTile({ featuredArtist, locale }: { featuredArtist: Artist; locale: Locale }) {
  return (
    <div className="group relative overflow-hidden rounded-[14px] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40 flex flex-col w-full">
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

        <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full mt-auto">
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
  );
}

function CorporateGiftsTile() {
  return (
    <div className="group relative overflow-hidden rounded-[14px] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md border border-stone/40 flex flex-col w-full">
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

        <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full mt-auto">
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
  );
}
