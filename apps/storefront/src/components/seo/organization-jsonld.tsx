import { useTranslations } from "next-intl";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "./json-ld";

/**
 * Site-wide Organization structured data (BUILD-PLAN §5 task 7). Rendered once
 * in the storefront layout. Description is locale-aware via the Meta namespace.
 */
export function OrganizationJsonLd() {
  const t = useTranslations("Meta");
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "BOBY",
        url: SITE_URL,
        description: t("description"),
      }}
    />
  );
}
