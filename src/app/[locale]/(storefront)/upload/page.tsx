import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { UploadArtworkForm } from "@/components/artwork/upload-artwork-form";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "העלאת יצירה חדשה לגלריה · BOBY",
  description: "אזור אמן — העלאת יצירה מקורית וסיפור הסטודיו לגלריית BOBY",
};

import { hasLocale } from "next-intl";

export default async function UploadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  setRequestLocale(activeLocale);

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-4 py-8 md:py-16">
      <UploadArtworkForm />
    </main>
  );
}
