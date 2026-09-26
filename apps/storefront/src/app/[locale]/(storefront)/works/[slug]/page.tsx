import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getArtworkBySlug, listArtworkSlugs } from "@/lib/catalog/data";
import { buildCloudinaryUrl } from "@/lib/cloudinary";
import { seoAlternates } from "@/lib/site";
import { ArtworkPageContainer } from "@/components/artwork/artwork-page-container";
import { hasLocale } from "next-intl";

type Params = { locale: string; slug: string };

export const dynamic = "force-dynamic";
export const dynamicParams = true;


export async function generateStaticParams() {
  const slugs = await listArtworkSlugs();
  return ["he", "en"].flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug: rawSlug } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? (rawLocale as Locale) : routing.defaultLocale;
  const slug = decodeURIComponent(rawSlug);
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return {};
  const l = locale as Locale;

  const titleText = artwork.title?.[l] || artwork.title?.he || artwork.title?.en || "יצירה";
  const artistName = artwork.artist?.displayName?.[l] || artwork.artist?.displayName?.he || artwork.artist?.displayName?.en || "אמן סטודיו BOBY";
  const storyText = artwork.story?.[l] || artwork.story?.he || artwork.story?.en || "";

  const primary = artwork.images?.[0];
  const ogImage = primary?.publicId
    ? buildCloudinaryUrl(primary.publicId, { width: 1200, quality: 85 })
    : undefined;

  return {
    title: `${titleText} — ${artistName} · BOBY`,
    description: storyText ? storyText.slice(0, 155) : "יצירת אמנות מקורית בעבודת יד בגלריית BOBY",
    alternates: seoAlternates(l, `/works/${slug}`),
    openGraph: {
      title: `${titleText} · ${artistName}`,
      type: "website",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

import { notFound } from "next/navigation";

export default async function ArtworkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale, slug: rawSlug } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? (rawLocale as Locale) : routing.defaultLocale;
  setRequestLocale(locale);
  const slug = decodeURIComponent(rawSlug);
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return <ArtworkPageContainer slug={slug} initialArtwork={artwork} />;
}

