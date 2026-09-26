"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { listArtworksByArtist } from "@/lib/catalog/data";
import type { Artwork } from "@/lib/catalog/types";
import { ArtworkGallery, type GalleryImage } from "@/components/artwork/artwork-gallery";
import { PurchasePanel } from "@/components/artwork/purchase-panel";
import { ArtistCard } from "@/components/artwork/artist-card";
import { ArtworkCard } from "@/components/catalog/artwork-card";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { buildCloudinaryUrl } from "@/lib/cloudinary";
import { localePath } from "@/lib/site";

interface ArtworkPageContainerProps {
  slug: string;
  initialArtwork: Artwork | null;
}

export function ArtworkPageContainer({ slug, initialArtwork }: ArtworkPageContainerProps) {
  const [artwork, setArtwork] = useState<Artwork | null>(initialArtwork);
  const [otherArtworks, setOtherArtworks] = useState<Artwork[]>([]);
  const [isLoaded, setIsLoaded] = useState(Boolean(initialArtwork));
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let activeArtwork = initialArtwork;

    if (!activeArtwork && typeof window !== "undefined") {
      try {
        const decodedSlug = decodeURIComponent(slug);
        const storedRaw = localStorage.getItem("boby_custom_artworks");
        if (storedRaw) {
          const customList: Artwork[] = JSON.parse(storedRaw);
          const found = customList.find(
            (a) => a.slug === slug || a.slug === decodedSlug
          );
          if (found) {
            activeArtwork = found;
            setArtwork(found);
          }
        }
      } catch (err) {
        console.error("Error reading artwork from localStorage:", err);
      }
    }

    if (!activeArtwork) {
      setIsNotFound(true);
    } else {
      setIsLoaded(true);
      if (activeArtwork.artist?.slug) {
        listArtworksByArtist(activeArtwork.artist.slug).then((all) => {
          setOtherArtworks(all.filter((a) => a.slug !== activeArtwork!.slug));
        });
      }
    }
  }, [slug, initialArtwork]);

  if (isNotFound) {
    return <ArtworkNotFoundUI slug={slug} />;
  }

  if (!isLoaded || !artwork) {
    return (
      <main className="mx-auto max-w-[var(--container-content)] px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="animate-spin text-2xl">🎨</span>
          <p className="text-body font-medium text-text">טוען את היצירה...</p>
        </div>
      </main>
    );
  }

  return <ArtworkDetail artwork={artwork} otherArtworks={otherArtworks} />;
}

function ArtworkNotFoundUI({ slug }: { slug: string }) {
  return (
    <main className="mx-auto max-w-[var(--container-content)] px-6 py-20 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-panel bg-sand/40 p-8 border border-border">
        <span className="text-5xl">🎨</span>
        <h1 className="text-h2 font-medium text-text">היצירה לא נמצאה</h1>
        <p className="text-text-muted text-small leading-relaxed">
          היצירה שחיפשתם (<b><bdi>{decodeURIComponent(slug)}</bdi></b>) אינה קיימת במערכת או שהוסרה. מוזמנים לעיין בקטלוג היצירות המקוריות או להעלות יצירה חדשה.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/works">
            <button type="button" className="rounded-control bg-btn-primary px-5 py-2.5 text-small font-medium text-surface hover:bg-deep/90">
              לגלריית היצירות ←
            </button>
          </Link>
          <Link href="/upload">
            <button type="button" className="rounded-control bg-surface border border-border px-5 py-2.5 text-small font-medium text-text hover:bg-sand">
              העלאת יצירה חדשה ✨
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

function ArtworkDetail({ artwork, otherArtworks }: { artwork: Artwork; otherArtworks: Artwork[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Artwork");
  const bc = useTranslations("Breadcrumb");

  const titleText = artwork.title?.[locale] || artwork.title?.he || artwork.title?.en || "יצירה";
  const artistName = artwork.artist?.displayName?.[locale] || artwork.artist?.displayName?.he || artwork.artist?.displayName?.en || "אמן סטודיו BOBY";
  const medium = artwork.category?.[locale] || artwork.category?.he || artwork.category?.en || "אמנות בעבודת יד";
  const storyText = artwork.story?.[locale] || artwork.story?.he || artwork.story?.en || "";

  const galleryImages: GalleryImage[] = (artwork.images || []).map((img, i) => {
    const captionText = img.caption?.[locale] || img.caption?.he || img.caption?.en || "תמונת יצירה";
    return {
      publicId: img.publicId || "/mock/earth-bowl.jpg",
      aspectRatio: img.aspectRatio || 0.8,
      caption: captionText,
      alt: `${titleText} — ${artistName}, ${medium}. ${captionText}`,
      thumbLabel: t("gallery.thumbLabel", { n: i + 1 }),
    };
  });

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-6 py-8 pb-28 md:px-12 md:py-12 md:pb-12 lg:px-16">
      <Breadcrumb category={medium} title={titleText} bc={bc} />

      <div className="mt-6 flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-12">
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

      <div className="mt-16 flex flex-col gap-16 md:mt-24">
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

        {artwork.artist && (
          <section className="max-w-[var(--container-prose)]">
            <h2 className="text-h2 font-medium">{t("sections.artist")}</h2>
            <div className="mt-6">
              <ArtistCard artist={artwork.artist} />
            </div>
          </section>
        )}

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
          { name: titleText, path: localePath(locale, `/works/${artwork.slug}`) },
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

function ArtworkJsonLd({ artwork, locale }: { artwork: Artwork; locale: Locale }) {
  const availability =
    artwork.availability === "sold"
      ? "https://schema.org/SoldOut"
      : artwork.availability === "reserved"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  const primary = artwork.images?.[0];
  const image = primary?.publicId
    ? buildCloudinaryUrl(primary.publicId, { width: 1200, quality: 85 })
    : undefined;

  const titleText = artwork.title?.[locale] || artwork.title?.he || artwork.title?.en || "יצירה";
  const artistName = artwork.artist?.displayName?.[locale] || artwork.artist?.displayName?.he || artwork.artist?.displayName?.en || "אמן סטודיו BOBY";
  const medium = artwork.category?.[locale] || artwork.category?.he || artwork.category?.en || "אמנות בעבודת יד";

  const json = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: titleText,
    ...(image ? { image } : {}),
    creator: { "@type": "Person", name: artistName },
    artMedium: medium,
    width: `${artwork.dimensions?.widthCm || 20} cm`,
    height: `${artwork.dimensions?.heightCm || 20} cm`,
    offers: {
      "@type": "Offer",
      price: ((artwork.priceAgorot || 45000) / 100).toFixed(0),
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
