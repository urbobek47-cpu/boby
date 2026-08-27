import React from "react";
import { Link } from "@/i18n/navigation";
import type { Artist } from "@/lib/catalog/types";

interface ArtistSpotlightCardProps {
  artist: Artist;
}

export function ArtistSpotlightCard({ artist }: ArtistSpotlightCardProps) {
  const name = artist.displayName.he;
  const location = artist.location.he;
  const bioQuote = artist.bio.he;

  return (
    <div className="col-span-2 md:col-span-3 my-4 md:my-6 overflow-hidden rounded-panel border border-stone/60 bg-sand/40 p-6 md:p-8 shadow-[var(--shadow-soft)] transition-all hover:bg-sand/60">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Studio / Portrait Image Bed */}
        <div className="h-48 w-full md:h-56 md:w-72 shrink-0 overflow-hidden rounded-card bg-stone/30 relative">
          {artist.portraitPublicId ? (
            <img
              src={artist.portraitPublicId}
              alt={`הסטודיו של ${name}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-deep text-surface text-3xl">
              🎨
            </div>
          )}
          <span className="absolute start-3 top-3 rounded-full bg-deep/85 px-3 py-1 text-caption font-medium text-surface backdrop-blur-sm">
            סיפור אמן
          </span>
        </div>

        {/* Narrative & Editorial Quote */}
        <div className="flex flex-col gap-3.5 flex-1 text-start">
          <div className="flex items-baseline gap-2">
            <h4 className="text-h3 md:text-h2 font-medium text-text">
              <bdi>{name}</bdi>
            </h4>
            <span className="text-caption text-text-muted">· {location}</span>
          </div>

          <blockquote className="text-body md:text-h3 font-serif leading-relaxed text-text italic border-s-2 border-accent-strong ps-4 py-0.5">
            &quot;{bioQuote}&quot;
          </blockquote>

          <div className="mt-1">
            <Link
              href={`/artists/${artist.slug}`}
              className="inline-flex items-center gap-1.5 text-small font-medium text-accent-strong hover:text-accent-hover transition-colors focus-visible:outline-none rounded-control py-1"
            >
              <span>לגילוי כל היצירות של <bdi>{name}</bdi> ←</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
