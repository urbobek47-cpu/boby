import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/catalog/types";
import { formatDimensions, formatWeight } from "@/lib/format";
import { Price } from "@/components/catalog/price";
import { AvailabilityBadge } from "@/components/catalog/availability-badge";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/ui/like-button";

/**
 * The purchase panel (design brief screen 3). On desktop it sticks and shows,
 * without scrolling: title, artist, VAT-inclusive price, status, dimensions,
 * materials, delivery estimate, a returns summary, the primary action, and the
 * honest colour-variance note. Edge states (reserved / sold / made-to-order)
 * change the action block, never hide the information.
 *
 * Phase 1 is read-only — the cart lands in Phase 2, so the primary action is
 * present (design-complete) with an honest "view-only" note beneath it.
 */
export function PurchasePanel({ artwork }: { artwork: Artwork }) {
  const t = useTranslations("Artwork.panel");
  const locale = useLocale() as Locale;

  const dims = formatDimensions(artwork.dimensions, locale);
  const weight = artwork.dimensions.weightGrams
    ? formatWeight(artwork.dimensions.weightGrams, locale)
    : null;
  const materials = artwork.materials[locale].join(" · ");

  const delivery =
    artwork.inventoryKind === "MADE_TO_ORDER" && artwork.leadTimeDays
      ? t("deliveryWeeks", { weeks: Math.ceil(artwork.leadTimeDays / 6) })
      : t("deliveryInStock");

  return (
    <div className="flex flex-col gap-5">
      <AvailabilityBadge artwork={artwork} />

      <div className="flex flex-col gap-1">
        <h1 className="text-[length:var(--text-h1)] font-medium md:text-[2.25rem]">
          {artwork.title[locale]}
        </h1>
        <p className="text-text-muted">
          {t("by")}{" "}
          <Link
            href={`/artists/${artwork.artist.slug}`}
            className="text-accent-strong underline-offset-4 hover:underline"
          >
            <bdi>{artwork.artist.displayName[locale]}</bdi>
          </Link>
          {" · "}
          <bdi>{artwork.artist.location[locale]}</bdi>
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Price agorot={artwork.priceAgorot} className="text-[1.75rem] font-semibold md:text-[2rem]" />
          <span className="text-caption text-text-muted">{t("vatIncluded")}</span>
        </div>
        <LikeButton slug={artwork.slug} title={artwork.title[locale]} variant="inline" />
      </div>

      <dl className="flex flex-col divide-y divide-border border-y border-border">
        <SpecRow term={t("dimensions")}>
          {/* One LTR run so the neutral " · " and Hebrew units don't reorder (§5.2). */}
          <span dir="ltr">{weight ? `${dims} · ${weight}` : dims}</span>
        </SpecRow>
        <SpecRow term={t("materials")}>{materials}</SpecRow>
        <SpecRow term={t("delivery")}>{delivery}</SpecRow>
        <SpecRow term={t("shippingBand")}>{t(`shipping_${artwork.shippingSizeBand}`)}</SpecRow>
      </dl>

      {artwork.isFragile && (
        <p className="text-caption text-text-muted">{t("fragile")}</p>
      )}

      <ActionBlock artwork={artwork} />

      <p className="text-caption text-text-muted">{t("returns")} · {t("colorNote")}</p>

      {/* Mobile Sticky Bottom Purchase Bar (Screen width < 768px) */}
      <div className="fixed bottom-16 start-0 end-0 z-30 flex items-center justify-between gap-4 border-t border-border bg-surface/95 px-5 py-3 shadow-lg backdrop-blur-md md:hidden">
        <div className="flex flex-col">
          <span className="text-caption text-text-muted">מחיר כולל מע״מ</span>
          <Price agorot={artwork.priceAgorot} className="text-body font-bold text-text" />
        </div>
        <Button variant="primary" className="px-5 py-2 text-small">
          {artwork.inventoryKind === "MADE_TO_ORDER" ? "להזמנה לפי מידה" : "הוספה לסל"}
        </Button>
      </div>
    </div>
  );
}

function SpecRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-small text-text-muted">{term}</dt>
      <dd className="text-start text-small">{children}</dd>
    </div>
  );
}

function ActionBlock({ artwork }: { artwork: Artwork }) {
  const t = useTranslations("Artwork.panel");

  if (artwork.availability === "reserved") {
    return (
      <div className="flex flex-col gap-2 rounded-card bg-sand p-4">
        <p className="font-semibold">{t("reservedTitle")}</p>
        <p className="text-small text-text-muted">{t("reservedBody")}</p>
        <div className="mt-1">
          <Button variant="secondary">{t("reservedCta")}</Button>
        </div>
      </div>
    );
  }

  if (artwork.availability === "sold") {
    return (
      <div className="flex flex-col gap-2 rounded-card bg-sand p-4">
        <p className="font-semibold">{t("soldTitle")}</p>
        <p className="text-small text-text-muted">{t("soldBody")}</p>
        <div className="mt-1">
          <Button variant="secondary">{t("soldCta")}</Button>
        </div>
      </div>
    );
  }

  const cta =
    artwork.inventoryKind === "MADE_TO_ORDER" ? t("madeToOrderCta") : t("addToCart");

  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary" className="w-full">
        {cta}
      </Button>
      <p className="text-caption text-text-muted">{t("phase1Note")}</p>
    </div>
  );
}
