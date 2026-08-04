import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Aspect-preserving image slot. Renders a Cloudinary next/image (via the custom
 * loader) when a publicId is present, otherwise an in-palette placeholder — so
 * every surface degrades gracefully before/while photos are onboarded.
 *
 * The container keeps the artwork's true aspect ratio (§3.4 — never crop to a
 * square). `quality` >= 80 signals the detail/zoom variant (high-q WebP, kept
 * metadata) to the loader; leave it default for grids/thumbs (AVIF).
 */
export function ArtImage({
  publicId,
  alt,
  aspectRatio,
  sizes,
  quality,
  priority = false,
  placeholderLabel,
  rounded = "rounded-artwork",
  className,
  coverParent = false,
}: {
  publicId: string | null;
  alt: string;
  aspectRatio: number;
  sizes: string;
  quality?: number;
  priority?: boolean;
  placeholderLabel?: string;
  rounded?: string;
  className?: string;
  /**
   * Fill the parent's height (object-cover) instead of setting an aspect-ratio.
   * For equal-height grid cells where a fixed ratio would otherwise force the
   * image wider than its column. The caller supplies the sizing via className
   * (e.g. `aspect-[3/2] md:aspect-auto md:h-full`).
   */
  coverParent?: boolean;
}) {
  // Local static assets (the /mock/ concept placeholders) bypass Cloudinary
  // optimisation. They are concept images, not real works by the named artists,
  // and must be replaced with approved photography before a real launch.
  const isLocal = !!publicId && publicId.startsWith("/");

  return (
    <div
      className={cn("relative overflow-hidden bg-sand", rounded, className)}
      style={coverParent ? undefined : { aspectRatio: String(aspectRatio) }}
    >
      {publicId ? (
        <Image
          src={publicId}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          unoptimized={isLocal}
          className="object-cover"
        />
      ) : (
        placeholderLabel && (
          <div className="flex h-full w-full items-center justify-center p-2 text-center">
            <span className="text-caption text-text-muted/70">{placeholderLabel}</span>
          </div>
        )
      )}
    </div>
  );
}
