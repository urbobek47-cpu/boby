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
    <div className="col-span-2 md:col-span-3 my-4 overflow-hidden rounded-panel border border-border bg-sand/50 p-6 md:p-8 shadow-sm transition-all hover:bg-sand/70">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Studio / Portrait Image */}
        <div className="h-48 w-full md:h-56 md:w-72 shrink-0 overflow-hidden rounded-card bg-stone/40 relative">
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
          <span className="absolute start-3 top-3 rounded-full bg-deep/80 px-3 py-1 text-caption font-semibold text-surface">
            סיפור אמן
          </span>
        </div>

        {/* Narrative & Quote */}
        <div className="flex flex-col gap-3 flex-1 text-start">
          <div className="flex items-center gap-2">
            <h4 className="text-h3 font-semibold text-text">
              <bdi>{name}</bdi>
            </h4>
            <span className="text-caption text-text-muted">· {location}</span>
          </div>

          <blockquote className="text-body md:text-h3 font-serif leading-relaxed text-text italic border-s-2 border-accent-strong ps-4 py-0.5">
            &quot;{bioQuote}&quot;
          </blockquote>

          <div className="mt-2">
            <Link
              href={`/artists/${artist.slug}`}
              className="inline-flex items-center gap-1 text-small font-medium text-accent-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong rounded-control px-1"
            >
              <span>לגילוי כל היצירות של <bdi>{name}</bdi> ←</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
