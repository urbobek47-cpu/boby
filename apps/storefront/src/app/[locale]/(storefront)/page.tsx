import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { seoAlternates } from "@/lib/site";
import { listArtworks } from "@/lib/catalog/data";
import type { Artist, Artwork } from "@/lib/catalog/types";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale as Locale, "/"),
  };
}

import { PinterestMasonryGrid } from "@/components/catalog/pinterest-masonry-grid";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const all = await listArtworks();
  const featured = all.find((a) => a.slug === "kaarat-adama") ?? all[0];
  const featuredArtist = featured.artist;

  return (
    <Home artist={featuredArtist} allArtworks={all} />
  );
}

import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/button";

function Home({
  artist,
  allArtworks,
}: {
  artist: Artist;
  allArtworks: Artwork[];
}) {
  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-[var(--container-content)] px-3 pt-3 sm:px-4 md:px-8 md:pt-4">
        {/* Integrated Clean Hero Banner */}
        <div className="relative aspect-[1024/280] max-h-[160px] sm:max-h-[230px] md:max-h-[300px] w-full overflow-hidden rounded-panel shadow-[var(--shadow-soft)] group">
          <img
            src="/images/boby-hero-wood-clean.png"
            alt="BOBY — לוגו עץ מגולף בעבודת יד"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
      </section>

      {/* Hebrew Text Separator Banner */}
      <HebrewSeparatorBanner />

      {/* Immediately Artwork Gallery */}
      <section id="gallery" className="mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-24 max-w-[var(--container-content)] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        <PinterestMasonryGrid
          artworks={allArtworks}
          featuredArtist={artist}
          showCorporateTile={true}
        />
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}

/* -------------------------------------------------------------- HebrewSeparatorBanner */

function HebrewSeparatorBanner() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-3 pt-3 sm:px-4 md:px-8 sm:pt-3 md:pt-4">
      <div className="relative w-full overflow-hidden rounded-panel bg-[#8A5335] border border-[#6F4229]/30 shadow-[var(--shadow-soft)]">
        {/* Centered Hebrew Text */}
        <div className="flex items-center justify-center px-4 py-3.5 sm:py-4 md:py-5 text-center">
          <h2 className="font-serif font-medium tracking-wide text-[#FAF7F2] text-[clamp(1rem,2.2vw,1.4rem)] leading-snug">
            כל פריט עם סיפור מאחוריו
          </h2>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- newsletter */

function Newsletter() {
  const t = useTranslations("Home.newsletter");
  return (
    <section
      id="newsletter"
      className="mx-auto mt-20 max-w-[var(--container-content)] scroll-mt-24 px-6 md:px-12 lg:px-16 pb-16"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h2 className="text-h2 font-medium">רוצים להישאר בקשר ולקבל עדכונים?</h2>
        <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <label htmlFor="nl-email" className="sr-only">
            {t("emailLabel")}
          </label>
          <input
            id="nl-email"
            type="email"
            dir="ltr"
            placeholder={t("emailPlaceholder")}
            className="min-h-11 flex-1 rounded-control border border-border bg-surface px-3.5 text-body placeholder:text-text-muted"
          />
          <button type="button" className={buttonClasses("primary")}>
            {t("submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
