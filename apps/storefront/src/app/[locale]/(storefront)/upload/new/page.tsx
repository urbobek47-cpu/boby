import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { UploadArtworkForm } from "@/components/artwork/upload-artwork-form";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "טופס העלאת יצירה חדשה · BOBY",
  description: "אזור אמן — העלאת יצירה מקורית וסיפור הסטודיו לגלריית BOBY",
};

export default async function NewArtworkPage({
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
