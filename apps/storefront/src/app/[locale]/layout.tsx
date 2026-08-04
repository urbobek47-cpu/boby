import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/fonts";
import { SITE_URL, seoAlternates } from "@/lib/site";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import "../globals.css";

type LayoutParams = { locale: string };

/** Pre-render both locales at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LayoutParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  // metadataBase turns every page's relative canonical/hreflang into absolute
  // URLs. Default alternates are the home page's; each page overrides via
  // seoAlternates (x-default -> Hebrew, DECISIONS §2 #10).
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale as Locale, "/"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  const { locale } = await params;

  // Reject any locale not in the configured set.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this request (next-intl requirement).
  setRequestLocale(locale);

  const dir = localeDirection[locale as Locale];

  return (
    <html lang={locale} dir={dir}>
      <body className={fontVariables}>
        <NextIntlClientProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
