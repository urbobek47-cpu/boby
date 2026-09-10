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
import { ScrollRestoration } from "@/components/layout/scroll-restoration";

import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  setRequestLocale(activeLocale);

  return (
    <div className="flex min-h-screen flex-col">
      <OrganizationJsonLd />
      <ScrollRestoration />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
