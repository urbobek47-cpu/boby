import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/catalog/types";
import { Price } from "@/components/catalog/price";
import { artworkStatus } from "@/components/catalog/availability-badge";
import { ArtImage } from "@/components/media/art-image";
import { LikeButton } from "@/components/ui/like-button";

/**
 * Artwork card for the catalogue grid: artwork, artist, price, and one quiet
 * status — no dense metadata, no dominant pill (the status is calm text). The
 * whole card is a single link; its text provides the accessible name. The image
 * preserves the artwork's true aspect ratio (§3.4 — never crop to a square).
 */
export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Artwork.status");
  const primary = artwork.images[0];
  const status = artworkStatus(artwork);
  const statusMuted = artwork.availability === "sold" || artwork.availability === "reserved";
  const artworkTitle = artwork.title[locale] || artwork.title.he;

  const isMobileHidden = artwork.slug === "art-painting-desert-horizon";
  const isDesktopHidden = artwork.slug === "art-ceramics-terracotta-salad-bowl" || artwork.slug === "art-wood-oak-sculpture";
  const visibilityClass = isMobileHidden
    ? "hidden md:flex md:flex-col"
    : isDesktopHidden
      ? "flex flex-col md:hidden"
      : "flex flex-col";

  return (
    <div className={`group relative rounded-[14px] overflow-hidden border border-stone/40 bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md ${visibilityClass}`}>
      <div className="absolute top-3 left-3 z-30 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* logical-ok */}
        <LikeButton slug={artwork.slug} title={artworkTitle} />
      </div>

      <Link
        href={`/works/${artwork.slug}`}
        className="block focus-visible:outline-none flex-1 flex flex-col"
      >
        <div className="overflow-hidden bg-sand/40 shrink-0">
          <ArtImage
            publicId={primary?.publicId ?? null}
            alt={`${artworkTitle} — ${artwork.artist.displayName[locale] || artwork.artist.displayName.he}`}
            aspectRatio={primary?.aspectRatio ?? (4 / 5)}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 50vw"
            placeholderLabel={artwork.category[locale] || artwork.category.he}
            className="transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>

        <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 bg-[#E5D8C8] border-t border-[#D5C4B1] shrink-0 w-full mt-auto">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-small md:text-body font-medium text-[#2A211E] group-hover:text-accent-strong truncate">
              {artworkTitle}
            </h3>
            <Price agorot={artwork.priceAgorot} className="text-small md:text-body font-semibold text-[#2A211E] shrink-0" />
          </div>

          <div className="flex items-center justify-between gap-2 text-caption text-[#5C483A]">
            <div className="flex items-center gap-1.5 min-w-0">
              {artwork.artist?.portraitPublicId && (
                <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-[#D5C4B1] bg-sand/60">
                  <ArtImage
                    publicId={artwork.artist.portraitPublicId}
                    alt=""
                    aspectRatio={1}
                    sizes="20px"
                    rounded="rounded-full"
                    className="h-full w-full object-cover"
                  />
                </span>
              )}
              <p className="truncate font-medium text-[#5C483A]">
                <bdi>{artwork.artist.displayName[locale] || artwork.artist.displayName.he}</bdi>
              </p>
            </div>
            <span className={statusMuted ? "text-caption text-[#5C483A]/70 shrink-0" : "text-caption text-accent-strong font-medium shrink-0"}>
              {t(status.key, status.values)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
