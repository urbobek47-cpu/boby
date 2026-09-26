import type { Artwork } from "./types";

declare global {
  var __BOBY_CUSTOM_ARTWORKS__: Artwork[] | undefined;
}

export function getCustomArtworksServer(): Artwork[] {
  if (typeof window !== "undefined") return [];

  if (!globalThis.__BOBY_CUSTOM_ARTWORKS__) {
    globalThis.__BOBY_CUSTOM_ARTWORKS__ = [];
  }

  return globalThis.__BOBY_CUSTOM_ARTWORKS__;
}

export function saveCustomArtworkServer(artwork: Artwork): void {
  if (typeof window !== "undefined") return;

  const current = getCustomArtworksServer();
  const filtered = current.filter((a) => a.slug !== artwork.slug);
  const updated = [artwork, ...filtered];
  globalThis.__BOBY_CUSTOM_ARTWORKS__ = updated;
}

export function removeCustomArtworkServer(slug: string): void {
  if (typeof window !== "undefined") return;

  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch {}

  const current = getCustomArtworksServer();
  const filtered = current.filter((a) => a.slug !== slug && a.slug !== decoded);
  globalThis.__BOBY_CUSTOM_ARTWORKS__ = filtered;
}

