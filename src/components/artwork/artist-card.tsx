import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artist } from "@/lib/catalog/types";
import { ArtImage } from "@/components/media/art-image";

/**
 * Artist card for the "about the artist" section (§2.2: the human and the
 * story are surfaced on every product page). Portrait via Cloudinary; Latin
 * names wrapped in <bdi>.
 */
export function ArtistCard({ artist }: { artist: Artist }) {
  const locale = useLocale() as Locale;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
      <ArtImage
        publicId={artist.portraitPublicId}
        alt={artist.displayName[locale]}
        aspectRatio={3 / 2}
        sizes="220px"
        rounded="rounded-card"
        className="w-full shrink-0 bg-stone sm:max-w-[220px]"
      />
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-h3 font-semibold">
            <Link
              href={`/artists/${artist.slug}`}
              className="underline-offset-4 hover:text-accent-strong hover:underline"
            >
              <bdi>{artist.displayName[locale]}</bdi>
            </Link>
          </p>
          <p className="text-small text-text-muted">
            <bdi>{artist.location[locale]}</bdi>
          </p>
        </div>
        <p className="max-w-[var(--container-prose)] text-text-muted">
          {artist.bio[locale]}
        </p>
      </div>
    </div>
  );
}
