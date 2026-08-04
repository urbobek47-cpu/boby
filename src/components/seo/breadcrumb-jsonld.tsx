import { SITE_URL } from "@/lib/site";
import { JsonLd } from "./json-ld";

/**
 * BreadcrumbList structured data (BUILD-PLAN §5 task 7). Items carry
 * locale-prefixed paths (built by the page, which knows the locale).
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; path: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${SITE_URL}${it.path}`,
        })),
      }}
    />
  );
}
