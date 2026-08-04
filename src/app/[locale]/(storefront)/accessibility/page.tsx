import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { seoAlternates } from "@/lib/site";

type Params = { locale: string };

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? (rawLocale as Locale)
    : routing.defaultLocale;

  return {
    title: "הצהרת נגישות · BOBY",
    description:
      "הצהרת נגישות והתאמות נגישות בפלטפורמת BOBY בהתאם לתקן ת״י 5568 ברמה AA.",
    alternates: seoAlternates(locale, "/accessibility"),
  };
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? (rawLocale as Locale)
    : routing.defaultLocale;

  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-[var(--container-prose)] px-6 py-12 md:px-12 md:py-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="נתיב ניווט" className="mb-8">
        <ol className="flex items-center gap-2 text-caption text-text-muted">
          <li>
            <Link href="/" className="hover:text-accent-strong transition-colors">
              בית
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li aria-current="page" className="text-text font-medium">
            הצהרת נגישות
          </li>
        </ol>
      </nav>

      {/* Header Badge & Title */}
      <header className="border-b border-border pb-8 mb-10">
        <span className="inline-block rounded-full bg-sand px-3.5 py-1 text-caption font-semibold text-accent-strong">
          מחויבות לנגישות ושיוויון
        </span>
        <h1 className="mt-3 text-h1 font-medium tracking-tight text-[#111827] md:text-[2.25rem] leading-tight">
          הצהרת נגישות – BOBY
        </h1>
        <p className="mt-4 text-[length:var(--text-h3)] leading-relaxed text-text font-serif">
          פלטפורמת <bdi>BOBY</bdi> רואה חשיבות עליונה במתן שירות שוויוני, נגיש ומכבד לכלל המשתמשים, לרבות אנשים עם מוגבלויות.
        </p>
      </header>

      {/* Main Content Sections */}
      <article className="flex flex-col gap-10 text-body text-[#111827] leading-relaxed">
        {/* Section 1 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            1. התאמות הנגישות באתר
          </h2>
          <p className="text-body text-[#111827]">
            האתר מותאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע&quot;ג-<span dir="ltr">2013</span>, ולתקן הישראלי ת&quot;י <span dir="ltr">5568</span> ברמה <span dir="ltr">AA</span>.
          </p>
          <p className="font-medium text-text mt-1">ההתאמות כוללות:</p>
          <ul className="flex flex-col gap-2 ps-6 list-disc text-body text-[#111827]">
            <li>מבנה אתר נגיש המאפשר ניווט באמצעות מקלדת.</li>
            <li>התאמת האתר לקוראי מסך ותמיכה בתגיות ARIA.</li>
            <li>ניגודיות צבעים מותאמת ואפשרות להגדלת פונטים באמצעות רכיב הנגישות באתר.</li>
            <li>תמיכה מלאה בכיווניות מימין לשמאל (RTL) והיררכיית כותרות ברורה.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            2. סייגים לנגישות
          </h2>
          <p className="text-body text-[#111827]">
            על אף מאמצינו להנגיש את כלל הדפים והרכיבים באתר, ייתכן שחלק מהתכנים המועלים על ידי אמנים עצמאיים (כגון תמונות מוצרים או תיאורים חופשיים) טרם הונגשו במלואם. אנחנו פועלים באופן שוטף לשפר את נגישות הפלטפורמה.
          </p>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-3 rounded-panel border border-border bg-sand/40 p-6">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            3. רכז נגישות ופניות בנושא
          </h2>
          <p className="text-body text-[#111827]">
            אם נתקלתם בבעיית נגישות או שיש לכם הצעה לשיפור, נשמח לעמוד לרשותכם:
          </p>
          <ul className="flex flex-col gap-2 ps-4 text-body text-[#111827]">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-text">דוא&quot;ל לפניות נגישות:</span>
              <a
                href="mailto:accessibility@boby.co.il"
                dir="ltr"
                className="font-medium text-accent-strong hover:underline focus-visible:outline-none"
              >
                accessibility@boby.co.il
              </a>
            </li>
            <li>
              <span className="font-semibold text-text">זמני מענה:</span> מענה לפניות יינתן תוך <span dir="ltr">2</span> ימי עסקים.
            </li>
          </ul>
        </section>
      </article>

      {/* Footer Back Link */}
      <footer className="mt-12 border-t border-border pt-6 text-start">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-small font-medium text-accent-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong rounded-control px-1"
        >
          <span>← חזרה לדף הבית</span>
        </Link>
      </footer>
    </main>
  );
}
