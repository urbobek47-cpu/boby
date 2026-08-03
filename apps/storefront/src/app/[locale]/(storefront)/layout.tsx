import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";

/**
 * Storefront chrome. Wraps the customer-facing pages (home, catalogue, artwork)
 * with the shared header and footer. The internal style guide sits outside this
 * group, so it stays chrome-free.
 *
 * setRequestLocale here is required for STATIC rendering: the header/footer use
 * useTranslations, and without it next-intl forces the whole subtree dynamic.
 */
export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <OrganizationJsonLd />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
