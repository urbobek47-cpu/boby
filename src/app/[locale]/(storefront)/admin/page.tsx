import type { Metadata } from "next";
import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "פאנל ניהול מאובטח · BOBY Admin",
  description: "מערכת ניהול ראשי לפלטפורמת BOBY — אמנים, יצירות, לקוחות והזמנות",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-Side Guard: Redirect unauthenticated requests strictly to /admin/login
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = token ? await verifyAdminToken(token) : null;

  if (!isValid) {
    redirect({ href: "/admin/login", locale });
  }

  return (
    <main className="min-h-screen bg-sand/30 py-4">
      <AdminDashboardView />
    </main>
  );
}
