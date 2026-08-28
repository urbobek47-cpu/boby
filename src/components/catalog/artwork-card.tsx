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

  return (
    <div className="group relative flex flex-col gap-2 md:gap-3 rounded-card">
      <div className="absolute top-2.5 end-2.5 z-30 pointer-events-auto"> {/* logical-ok */}
        <LikeButton slug={artwork.slug} title={artworkTitle} />
      </div>

      <Link
        href={`/works/${artwork.slug}`}
        className="block focus-visible:outline-none"
      >
        <div className="overflow-hidden rounded-artwork bg-sand/30 shadow-sm transition-shadow group-hover:shadow-md">
          <ArtImage
            publicId={primary?.publicId ?? null}
            alt={`${artworkTitle} — ${artwork.artist.displayName[locale] || artwork.artist.displayName.he}`}
            aspectRatio={primary?.aspectRatio ?? (4 / 5)}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 50vw"
            placeholderLabel={artwork.category[locale] || artwork.category.he}
            className="transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-0.5 md:gap-1 px-0.5 mt-2 md:mt-3">
          <h3 className="text-small md:text-h3 font-medium text-text underline-offset-4 group-hover:text-accent-strong truncate">
            {artworkTitle}
          </h3>
          <p className="text-caption md:text-small text-text-muted truncate">
            <bdi>{artwork.artist.displayName[locale] || artwork.artist.displayName.he}</bdi>
          </p>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <Price agorot={artwork.priceAgorot} className="text-small md:text-body font-semibold text-text" />
            <span className={statusMuted ? "text-caption text-text-muted/70" : "text-caption text-accent-strong font-medium"}>
              {t(status.key, status.values)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
