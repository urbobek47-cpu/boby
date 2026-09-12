import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArtistLandingView } from "@/components/artist/artist-landing-view";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "אזור אמנים — הצטרפות והעלאת יצירות · BOBY",
  description: "אזור אמן — גלריית אוצרות מקוונת לאמנות ומלאכת יד ישראלית מקורית",
};

export default async function UploadLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  setRequestLocale(activeLocale);

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-4 py-8 md:py-16">
      <ArtistLandingView />
    </main>
  );
}
