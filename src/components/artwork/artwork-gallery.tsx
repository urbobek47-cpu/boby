"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ArtImage } from "@/components/media/art-image";

export type GalleryImage = {
  publicId: string | null;
  aspectRatio: number;
  alt: string;
  caption: string;
  /** Precomputed on the server — functions can't cross the RSC boundary. */
  thumbLabel: string;
};

/**
 * Artwork image gallery. Main image + thumbnails; selecting a thumbnail swaps
 * the main view. Keyboard-operable (real <button>s, visible focus), and the
 * main image carries a meaningful alt (title + artist + medium, §5.1).
 *
 * Real photos are delivered through Cloudinary (ArtImage). The main view asks
 * for the detail-quality variant (high-q WebP, §5.4); thumbnails use the grid
 * variant (AVIF). Missing photos fall back to an in-palette placeholder.
 */
export function ArtworkGallery({
  images,
  labels,
}: {
  images: GalleryImage[];
  labels: { region: string; placeholder: string };
}) {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <section aria-label={labels.region} className="flex flex-col gap-3">
      <ArtImage
        publicId={main.publicId}
        alt={main.alt}
        aspectRatio={main.aspectRatio}
        sizes="(min-width: 1024px) 55vw, 100vw"
        quality={85}
        priority
        placeholderLabel={main.caption || labels.placeholder}
      />

      {images.length > 1 && (
        <ul className="flex flex-wrap gap-3" role="list">
          {images.map((img, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={img.thumbLabel}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "block w-20 rounded-artwork outline outline-2 outline-offset-2 transition-[outline] sm:w-24",
                  i === active ? "outline-[color:var(--color-text)]" : "outline-transparent",
                )}
              >
                <ArtImage
                  publicId={img.publicId}
                  alt=""
                  aspectRatio={img.aspectRatio}
                  sizes="96px"
                  placeholderLabel={img.caption}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
