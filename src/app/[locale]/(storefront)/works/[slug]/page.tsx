import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getArtworkBySlug, listArtworkSlugs, listArtworksByArtist } from "@/lib/catalog/data";
import type { Artwork } from "@/lib/catalog/types";
import { buildCloudinaryUrl } from "@/lib/cloudinary";
import { seoAlternates, localePath } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { ArtworkGallery, type GalleryImage } from "@/components/artwork/artwork-gallery";
import { PurchasePanel } from "@/components/artwork/purchase-panel";
import { ArtistCard } from "@/components/artwork/artist-card";
import { ArtworkCard } from "@/components/catalog/artwork-card";

import { hasLocale } from "next-intl";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await listArtworkSlugs();
  return ["he", "en", "works"].flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? (rawLocale as Locale) : routing.defaultLocale;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return {};
  const l = locale as Locale;
  const primary = artwork.images[0];
  const ogImage = primary?.publicId
    ? buildCloudinaryUrl(primary.publicId, { width: 1200, quality: 85 })
    : undefined;
  return {
    title: `${artwork.title[l]} — ${artwork.artist.displayName[l]} · BOBY`,
    description: artwork.story[l].slice(0, 155),
    alternates: seoAlternates(l, `/works/${slug}`),
    openGraph: {
      title: `${artwork.title[l]} · ${artwork.artist.displayName[l]}`,
      type: "website",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? (rawLocale as Locale) : routing.defaultLocale;
  setRequestLocale(locale);
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) notFound();

  const allArtistWorks = await listArtworksByArtist(artwork.artist.slug);
  const otherArtworks = allArtistWorks.filter((a) => a.slug !== artwork.slug);

  return <ArtworkDetail artwork={artwork} otherArtworks={otherArtworks} />;
}

function ArtworkDetail({ artwork, otherArtworks }: { artwork: Artwork; otherArtworks: Artwork[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Artwork");
  const bc = useTranslations("Breadcrumb");

  const artistName = artwork.artist.displayName[locale] || artwork.artist.displayName.he;
  const medium = artwork.category[locale] || artwork.category.he;
  const storyText = artwork.story[locale] || artwork.story.he;

  // Meaningful alt per §5.1: title + artist + medium, then the shot's caption.
  const galleryImages: GalleryImage[] = artwork.images.map((img, i) => ({
    publicId: img.publicId,
    aspectRatio: img.aspectRatio,
    caption: img.caption[locale] || img.caption.he || "תמונת יצירה",
    alt: `${artwork.title[locale] || artwork.title.he} — ${artistName}, ${medium}. ${img.caption[locale] || img.caption.he}`,
    thumbLabel: t("gallery.thumbLabel", { n: i + 1 }),
  }));

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-6 py-8 md:px-12 md:py-12 lg:px-16">
      <Breadcrumb category={medium} title={artwork.title[locale] || artwork.title.he} bc={bc} />

      {/* Desktop: image (end/left) + purchase panel (start/right). Mobile: image first. */}
      <div className="mt-6 flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-12">
        {/* min-w-0 lets the flex item shrink below its content width; flex-1
            absorbs the gap so the two columns never exceed the row (no overflow). */}
        <div className="min-w-0 lg:flex-1">
          <ArtworkGallery
            images={galleryImages}
            labels={{
              region: t("gallery.label"),
              placeholder: t("gallery.placeholder"),
            }}
          />
        </div>
        <div className="lg:w-[38%] lg:shrink-0">
          <PurchasePanel artwork={artwork} />
        </div>
      </div>

      {/* Below the fold — story, artist, other works. Editorial prose width. */}
      <div className="mt-16 flex flex-col gap-16 md:mt-24">
        {/* Prominent Artist's Story Highlight Section */}
        <section className="max-w-[var(--container-prose)] rounded-panel border border-border bg-sand/50 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-surface text-small font-semibold">
              🎨
            </span>
            <div>
              <h2 className="text-h2 font-medium text-text">סיפור היצירה והאמן</h2>
              <p className="text-caption text-text-muted">
                מאת <bdi>{artistName}</bdi> · תהליך היצירה וההשראה בסטודיו
              </p>
            </div>
          </div>
          <p className="mt-4 text-[length:var(--text-h3)] leading-relaxed text-text font-serif">
            {storyText}
          </p>
        </section>

        <section className="max-w-[var(--container-prose)]">
          <h2 className="text-h2 font-medium">{t("sections.artist")}</h2>
          <div className="mt-6">
            <ArtistCard artist={artwork.artist} />
          </div>
        </section>

        {otherArtworks.length > 0 && (
          <section className="pt-6 border-t border-border">
            <h2 className="text-h2 font-medium text-text mb-6">
              עוד יצירות מאת <bdi>{artistName}</bdi>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {otherArtworks.map((other) => (
                <ArtworkCard key={other.slug} artwork={other} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ArtworkJsonLd artwork={artwork} locale={locale} />
      <BreadcrumbJsonLd
        items={[
          { name: bc("home"), path: localePath(locale, "/") },
          { name: bc("works"), path: localePath(locale, "/works") },
          { name: artwork.title[locale], path: localePath(locale, `/works/${artwork.slug}`) },
        ]}
      />
    </main>
  );
}

function Breadcrumb({
  category,
  title,
  bc,
}: {
  category: string;
  title: string;
  bc: ReturnType<typeof useTranslations>;
}) {
  return (
    <nav aria-label={bc("label")}>
      <ol className="flex flex-wrap items-center gap-2 text-caption text-text-muted">
        <li>
          <Link href="/" className="hover:text-accent-strong">
            {bc("home")}
          </Link>
        </li>
        <li aria-hidden="true">·</li>
        <li>
          <Link href="/works" className="hover:text-accent-strong">
            {bc("works")}
          </Link>
        </li>
        <li aria-hidden="true">·</li>
        <li>{category}</li>
        <li aria-hidden="true">·</li>
        <li aria-current="page" className="text-text">
          {title}
        </li>
      </ol>
    </nav>
  );
}

/** VisualArtwork + Offer structured data (Phase 1 task 7 SEO). */
function ArtworkJsonLd({ artwork, locale }: { artwork: Artwork; locale: Locale }) {
  const availability =
    artwork.availability === "sold"
      ? "https://schema.org/SoldOut"
      : artwork.availability === "reserved"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  const primary = artwork.images[0];
  const image = primary?.publicId
    ? buildCloudinaryUrl(primary.publicId, { width: 1200, quality: 85 })
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title[locale],
    ...(image ? { image } : {}),
    creator: { "@type": "Person", name: artwork.artist.displayName[locale] },
    artMedium: artwork.category[locale],
    width: `${artwork.dimensions.widthCm} cm`,
    height: `${artwork.dimensions.heightCm} cm`,
    offers: {
      "@type": "Offer",
      price: (artwork.priceAgorot / 100).toFixed(0),
      priceCurrency: "ILS",
      availability,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
