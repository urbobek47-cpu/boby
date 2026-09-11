import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/fonts";
import { SITE_URL, seoAlternates } from "@/lib/site";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AccessibilityWidget } from "@/components/ui/accessibility-widget";
import { SupportChatWidget } from "@/components/ui/support-chat-widget";
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
  const activeLocale: Locale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale: activeLocale, namespace: "Meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(activeLocale, "/"),
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

  // Fallback to defaultLocale (he) if locale param is unprefixed route (e.g. /upload, /account),
  // preventing false 404s while preserving full Hebrew and English locale support.
  const activeLocale: Locale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  // Enable static rendering for this request (next-intl requirement).
  setRequestLocale(activeLocale);

  const dir = localeDirection[activeLocale];

  return (
    <html lang={activeLocale} dir={dir}>
      <body className={fontVariables}>
        <NextIntlClientProvider locale={activeLocale}>
          <AuthProvider>
            <CartProvider>
              <div>{children}</div>
              <AuthModal />
              <CartDrawer />
              <AccessibilityWidget />
              <SupportChatWidget />
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
