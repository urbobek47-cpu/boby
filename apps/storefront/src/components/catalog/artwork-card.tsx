import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/catalog/types";
import { Price } from "@/components/catalog/price";
import { artworkStatus } from "@/components/catalog/availability-badge";
import { ArtImage } from "@/components/media/art-image";

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

  return (
    <Link
      href={`/works/${artwork.slug}`}
      className="group flex flex-col gap-3 rounded-card focus-visible:outline-none"
    >
      <ArtImage
        publicId={primary?.publicId ?? null}
        alt={`${artwork.title[locale]} — ${artwork.artist.displayName[locale]}, ${artwork.category[locale]}`}
        aspectRatio={primary?.aspectRatio ?? 1}
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw"
        placeholderLabel={artwork.category[locale]}
        className="transition-transform duration-[var(--duration-hover)] ease-[var(--ease-out)] group-hover:scale-[1.01]"
      />

      <div className="flex flex-col gap-1">
        <h3 className="text-h3 font-medium underline-offset-4 group-hover:text-accent-strong group-hover:underline">
          {artwork.title[locale]}
        </h3>
        <p className="text-small text-text-muted">
          <bdi>{artwork.artist.displayName[locale]}</bdi>
        </p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <Price agorot={artwork.priceAgorot} className="text-body font-semibold" />
          <span className={statusMuted ? "text-caption text-text-muted" : "text-caption text-accent-strong"}>
            {t(status.key, status.values)}
          </span>
        </div>
      </div>
    </Link>
  );
}
