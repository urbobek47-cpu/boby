import { useTranslations } from "next-intl";
import { StatusBadge, type BadgeTone } from "@/components/ui/status-badge";
import type { Artwork } from "@/lib/catalog/types";

/**
 * Maps an artwork's inventoryKind + availability to the honest status pill
 * (§4.2, §5.3). Availability wins over kind: a reserved/sold UNIQUE shows its
 * state, never "one of a kind". Reserved uses the honest wording, not "sold".
 */
export function artworkStatus(artwork: Artwork): {
  key: string;
  tone: BadgeTone;
  values?: Record<string, string | number>;
} {
  if (artwork.availability === "reserved")
    return { key: "reserved", tone: "warm" };
  if (artwork.availability === "sold") return { key: "sold", tone: "muted" };

  switch (artwork.inventoryKind) {
    case "UNIQUE":
      return { key: "unique", tone: "warm" };
    case "LIMITED_EDITION":
      return {
        key: "edition",
        tone: "neutral",
        values: {
          number: artwork.editionNumber ?? 1,
          size: artwork.editionSize ?? 1,
        },
      };
    case "MADE_TO_ORDER":
      return { key: "madeToOrder", tone: "neutral" };
  }
}

export function AvailabilityBadge({ artwork }: { artwork: Artwork }) {
  const t = useTranslations("Artwork.status");
  const { key, tone, values } = artworkStatus(artwork);
  return <StatusBadge tone={tone}>{t(key, values)}</StatusBadge>;
}
