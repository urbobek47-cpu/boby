import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { seoAlternates } from "@/lib/site";
import { listArtworks } from "@/lib/catalog/data";
import type { Artist, Artwork } from "@/lib/catalog/types";
import { buttonClasses } from "@/components/ui/button";
import { ArtworkCard } from "@/components/catalog/artwork-card";
import { Price } from "@/components/catalog/price";
import { ArtImage } from "@/components/media/art-image";

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

import { StoriesBar } from "@/components/catalog/stories-bar";
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
  const newArrivals = all.filter((a) => a.availability !== "sold").slice(0, 3);
  const featuredArtist = featured.artist;

  return (
    <Home featured={featured} newArrivals={newArrivals} artist={featuredArtist} allArtworks={all} />
  );
}

function Home({
  featured,
  newArrivals,
  artist,
  allArtworks,
}: {
  featured: Artwork;
  newArrivals: Artwork[];
  artist: Artist;
  allArtworks: Artwork[];
}) {
  return (
    <>
      <Hero featured={featured} />

      {/* Stories Bar */}
      <section className="mx-auto max-w-[var(--container-content)] px-4 pt-6 md:px-8">
        <StoriesBar />
      </section>

      <TrustRow />
      <IntentNav />

      {/* Pinterest-Style Social Network Feed for Artist Showcase */}
      <section className="mx-auto mt-12 md:mt-16 max-w-[var(--container-content)] px-3 md:px-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-caption font-bold text-accent-strong uppercase tracking-wider">
              פיד יוצרים וסטודיו מקומי
            </span>
            <h2 className="text-h2 font-medium text-text md:text-[2rem]">
              גלה עבודות יד וסיפורי אמנים
            </h2>
          </div>
          <p className="text-small text-text-muted">
            לחץ על כל כרטיס לגילוי הסטודיו והקולקציה המלאה של היוצר/ת
          </p>
        </div>

        <PinterestMasonryGrid artworks={allArtworks} />
      </section>

      <FeaturedArtist artist={artist} />
      <CorporatePanel />
      <Newsletter />
    </>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero({ featured }: { featured: Artwork }) {
  const t = useTranslations("Home.hero");
  const locale = useLocale() as Locale;
  const primary = featured.images[0];

  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 pt-10 md:px-12 md:pt-16 lg:px-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex flex-col items-start gap-6 md:w-[45%]">
          <p className="text-small font-medium tracking-wide text-accent-strong">{t("eyebrow")}</p>
          <h1 className="text-[length:var(--text-display)] font-medium leading-[1.05] md:text-[4rem] lg:text-[4.5rem]">
            {t("title")}
          </h1>
          <p className="max-w-[46ch] text-[length:var(--text-h3)] text-text-muted">
            {t("subtitle")}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/works" className={buttonClasses("primary")}>
              {t("ctaPrimary")}
            </Link>
            <Link href="/business" className={buttonClasses("secondary")}>
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <Link href={`/works/${featured.slug}`} className="group md:w-[55%]">
          {/* Mobile keeps the natural 4:5; desktop caps height to a square,
              cropping only the empty plaster top (object-bottom keeps the bowl). */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-artwork bg-sand md:aspect-square">
            {primary?.publicId && (
              <Image
                src={primary.publicId}
                alt={`${featured.title[locale]} — ${featured.artist.displayName[locale]}`}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                priority
                unoptimized={primary.publicId.startsWith("/")}
                className="object-cover object-bottom"
              />
            )}
          </div>
          <p className="mt-3 flex items-baseline gap-2 text-small">
            <span className="text-text-muted">{t("featuredCaption")}:</span>
            <span className="font-medium group-hover:text-accent-strong">
              {featured.title[locale]}
            </span>
            <Price agorot={featured.priceAgorot} className="text-text-muted" />
          </p>
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- trust row */

function TrustRow() {
  const t = useTranslations("Home.trust");
  const items = [t("madeInIsrael"), t("securePayment"), t("localShipping")];
  return (
    <section className="mx-auto mt-16 max-w-[var(--container-content)] px-6 md:px-12 lg:px-16">
      <ul
        role="list"
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-border py-4 text-small text-text-muted"
      >
        {items.map((item, i) => (
          <li key={item} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="me-6 inline-block h-1 w-1 rounded-full bg-accent" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------- intent nav */

function IntentNav() {
  const t = useTranslations("Home.intent");
  // Curatorial entry points. Occasion collections become editorial (Sanity)
  // later; for now they open the catalogue, and the price intent sorts by price.
  const items: Array<{ label: string; href: React.ComponentProps<typeof Link>["href"] }> = [
    { label: t("wedding"), href: "/works" },
    { label: t("newHome"), href: "/works" },
    { label: t("under500"), href: { pathname: "/works", query: { sort: "price-asc" } } },
    { label: t("original"), href: "/works" },
  ];

  return (
    <section aria-label={t("title")} className="mx-auto mt-16 max-w-[var(--container-content)] px-6 md:px-12 lg:px-16">
      {/* Editorial strip: a warm band with thin rules and a terracotta marker —
          not four boxed app cards. */}
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-panel border border-border bg-sand sm:flex-row sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex flex-1 items-center gap-3 px-6 py-5 transition-colors hover:bg-stone/40"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-h3 font-medium group-hover:text-accent-strong">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- new arrivals */

function NewArrivals({ artworks }: { artworks: Artwork[] }) {
  const t = useTranslations("Home.newArrivals");
  return (
    <section className="mx-auto mt-24 max-w-[var(--container-content)] px-6 md:px-12 lg:px-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-h2 font-medium">{t("title")}</h2>
        <Link href="/works" className="text-small font-medium text-accent-strong underline-offset-4 hover:underline">
          {t("cta")}
        </Link>
      </div>
      <ul role="list" className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((a) => (
          <li key={a.slug}>
            <ArtworkCard artwork={a} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------- featured artist */

function FeaturedArtist({ artist }: { artist: Artist }) {
  const t = useTranslations("Home.featuredArtist");
  const locale = useLocale() as Locale;
  const name = artist.displayName[locale];

  return (
    <section className="mx-auto mt-24 max-w-[var(--container-content)] px-6 md:px-12 lg:px-16">
      <div className="grid overflow-hidden rounded-panel bg-sand md:grid-cols-2 md:items-stretch">
        {/* Studio image (artist on its right); copy sits beside the negative space. */}
        <ArtImage
          publicId={artist.portraitPublicId}
          alt={`${name} — ${artist.location[locale]}`}
          aspectRatio={3 / 2}
          sizes="(min-width: 768px) 50vw, 100vw"
          rounded="rounded-none"
          coverParent
          className="aspect-[3/2] bg-stone md:aspect-auto md:h-full"
        />
        <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
          <p className="text-small font-medium text-accent-strong">{t("title")}</p>
          <p className="text-h2 font-medium">
            <bdi>{name}</bdi>
          </p>
          <p className="border-s-2 border-accent ps-4 text-[length:var(--text-h3)] leading-relaxed text-text">
            “{t("quote")}”
          </p>
          <p className="max-w-[52ch] text-text-muted">{artist.bio[locale]}</p>
          <Link
            href={`/artists/${artist.slug}`}
            className="mt-1 self-start text-small font-medium text-accent-strong underline-offset-4 hover:underline"
          >
            {t("cta", { name })}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- corporate */

function CorporatePanel() {
  const t = useTranslations("Home.corporate");
  return (
    <section
      id="corporate"
      className="mx-auto mt-24 max-w-[var(--container-content)] scroll-mt-24 px-6 md:px-12 lg:px-16"
    >
      <div className="grid overflow-hidden rounded-panel bg-deep md:grid-cols-2 md:items-stretch">
        <ArtImage
          publicId="/mock/gift-set.jpg"
          alt="מארז מתנה עם כלי קרמיקה, טקסטיל ופריט עץ בעבודת יד"
          aspectRatio={3 / 2}
          sizes="(min-width: 768px) 50vw, 100vw"
          rounded="rounded-none"
          coverParent
          className="aspect-[3/2] bg-stone md:aspect-auto md:h-full"
        />
        <div className="flex flex-col items-start justify-center gap-5 p-10 text-surface md:p-14">
          <p className="text-small font-medium text-accent">{t("eyebrow")}</p>
          <h2 className="max-w-[20ch] text-[length:var(--text-h1)] font-medium leading-tight md:text-[2.25rem]">
            {t("title")}
          </h2>
          <p className="max-w-[46ch] text-surface/80">{t("body")}</p>
          <Link
            href="/business"
            className="mt-2 rounded-control bg-surface px-5 py-3 text-body font-medium text-text transition-colors hover:bg-sand"
          >
            {t("cta")}
          </Link>
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
      className="mx-auto mt-24 max-w-[var(--container-content)] scroll-mt-24 px-6 md:px-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h2 className="text-h2 font-medium">{t("title")}</h2>
        <p className="text-text-muted">{t("body")}</p>
        {/* Not yet wired to a provider (Phase 5) — button is inert, note is honest. */}
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
        <p className="text-caption text-text-muted">{t("note")}</p>
      </div>
    </section>
  );
}
