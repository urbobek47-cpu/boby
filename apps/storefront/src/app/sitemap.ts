import type { MetadataRoute } from "next";
import { SITE_URL, localePath } from "@/lib/site";
import { listArtworkSlugs, listArtistSlugs } from "@/lib/catalog/data";

/**
 * /sitemap.xml — every indexable page, once, keyed by its Hebrew (default) URL
 * with reciprocal hreflang alternates (he-IL / en / x-default → Hebrew, per
 * DECISIONS §2 #10). The internal style guide is excluded (it is noindex).
 *
 * Served at the app root, so the next-intl middleware doesn't locale-prefix it
 * (the matcher skips paths with a file extension).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [artworkSlugs, artistSlugs] = await Promise.all([
    listArtworkSlugs(),
    listArtistSlugs(),
  ]);

  const paths = [
    "/",
    "/works",
    "/business",
    ...artworkSlugs.map((s) => `/works/${s}`),
    ...artistSlugs.map((s) => `/artists/${s}`),
  ];

  const priorityFor = (path: string) =>
    path === "/" ? 1 : path === "/works" || path === "/business" ? 0.9 : path.startsWith("/works/") ? 0.8 : 0.7;

  return paths.map((path) => {
    const he = `${SITE_URL}${localePath("he", path) === "/" ? "" : localePath("he", path)}`;
    const en = `${SITE_URL}${localePath("en", path)}`;
    return {
      url: he,
      alternates: { languages: { he, en, "x-default": he } },
      changeFrequency: path === "/" || path === "/works" ? "daily" : "weekly",
      priority: priorityFor(path),
    };
  });
}
