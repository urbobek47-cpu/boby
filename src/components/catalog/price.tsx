import { useLocale } from "next-intl";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Price — VAT-inclusive shekel amount from integer agorot (§5.5, §7.7).
 * Always rendered inside dir="ltr" so the ₪ and digits don't reorder (§5.2).
 */
export function Price({
  agorot,
  className,
}: {
  agorot: number;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  return (
    <span dir="ltr" className={cn("tabular-nums", className)}>
      {formatPrice(agorot, locale)}
    </span>
  );
}
