import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getArtistBySlug, listArtistSlugs, listArtworksByArtist } from "@/lib/catalog/data";
import type { Artist, Artwork } from "@/lib/catalog/types";
import { seoAlternates, localePath } from "@/lib/site";
import { ArtImage } from "@/components/media/art-image";
import { ArtworkCard } from "@/components/catalog/artwork-card";
import { PinterestMasonryGrid } from "@/components/catalog/pinterest-masonry-grid";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

type Params = { locale: string; slug: string };

import { hasLocale } from "next-intl";

export async function generateStaticParams() {
  const slugs = await listArtistSlugs();
  return ["he", "en", "artists"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? (rawLocale as Locale) : routing.defaultLocale;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  const l = locale as Locale;
  return {
    title: `${artist.displayName[l]} · BOBY`,
    description: artist.bio[l].slice(0, 155),
    alternates: seoAlternates(l, `/artists/${slug}`),
  };
}

export default async function ArtistPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? (rawLocale as Locale) : routing.defaultLocale;
  setRequestLocale(locale);
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();
  const works = await listArtworksByArtist(slug);
  return <ArtistProfile artist={artist} works={works} />;
}

function ArtistProfile({ artist, works }: { artist: Artist; works: Artwork[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("ArtistPage");
  const bc = useTranslations("Breadcrumb");
  const name = artist.displayName[locale];

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-4 py-6 md:px-10 md:py-12">
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
          <li aria-current="page" className="text-text">
            <bdi>{name}</bdi>
          </li>
        </ol>
      </nav>

      {/* Studio Header Showcase */}
      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:gap-10 rounded-panel bg-sand/60 p-6 md:p-10 border border-border">
        <ArtImage
          publicId={artist.portraitPublicId}
          alt={`${name} — ${artist.location[locale]}`}
          aspectRatio={3 / 2}
          sizes="(min-width: 768px) 420px, 100vw"
          rounded="rounded-panel"
          className="w-full shrink-0 bg-stone md:max-w-[420px] shadow-sm"
        />
        <div className="flex flex-col gap-3">
          <span className="inline-block rounded-full bg-accent-strong/10 text-accent-strong px-3 py-1 text-caption font-semibold self-start">
            אמן/ית BOBY מאומת/ת
          </span>
          <h1 className="text-[length:var(--text-h1)] font-medium text-text md:text-[2.5rem]">
            <bdi>{name}</bdi>
          </h1>
          <p className="text-small font-medium text-text-muted">
            📍 <bdi>{artist.location[locale]}</bdi>
          </p>
          <p className="max-w-[var(--container-prose)] text-[length:var(--text-h3)] font-serif leading-relaxed text-text">
            &quot;{artist.bio[locale]}&quot;
          </p>
        </div>
      </div>

      {/* Their Collection in Pinterest Grid */}
      <section className="mt-12 md:mt-16">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-h2 font-medium text-text">{t("worksTitle", { name })}</h2>
          <p className="text-small text-text-muted">כל היצירות זמינות לרכישה ישירה מהסטודיו</p>
        </div>
        {works.length > 0 ? (
          <PinterestMasonryGrid artworks={works} />
        ) : (
          <p className="mt-6 text-text-muted">{t("empty")}</p>
        )}
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: bc("home"), path: localePath(locale, "/") },
          { name: bc("works"), path: localePath(locale, "/works") },
          { name, path: localePath(locale, `/artists/${artist.slug}`) },
        ]}
      />
    </main>
  );
}
