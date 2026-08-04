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
    title: "תקנון ותנאי שימוש · BOBY",
    description:
      "תקנון ותנאי שימוש בפלטפורמת BOBY — גלריה ושוק לאמנות ומלאכת יד ישראלית מקורית.",
    alternates: seoAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({
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
            תקנון ותנאי שימוש
          </li>
        </ol>
      </nav>

      {/* Header Badge & Title */}
      <header className="border-b border-border pb-8 mb-10">
        <span className="inline-block rounded-full bg-sand px-3.5 py-1 text-caption font-semibold text-accent-strong">
          מסמך משפטי מחייב
        </span>
        <h1 className="mt-3 text-h1 font-medium tracking-tight text-[#111827] md:text-[2.25rem] leading-tight">
          תקנון ותנאי שימוש – פלטפורמת BOBY
        </h1>
        <p className="mt-3 text-small text-text-muted">
          עודכן לאחרונה: <span dir="ltr">2026</span> · כניסה לתוקף מיידית
        </p>
      </header>

      {/* Main Content Body */}
      <article className="flex flex-col gap-10 text-body text-[#111827] leading-relaxed">
        {/* Section 1 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            1. מבוא
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>1.1.</strong> ברוכים הבאים לאתר <bdi>BOBY</bdi> (להלן: &quot;האתר&quot; או &quot;הפלטפורמה&quot;). האתר משמש כזירת מסחר אלקטרונית (Marketplace) המקשרת בין אמנים ויוצרים עצמאיים (להלן: &quot;האמנים&quot;) לבין לקוחות המעוניינים לרכוש עבודות יד ואמנות מקורית (להלן: &quot;הלקוחות&quot;).
            </li>
            <li>
              <strong>1.2.</strong> השימוש באתר מהווה הסכמה מלאה ובלתי חוזרת לתנאי תקנון זה.
            </li>
            <li>
              <strong>1.3.</strong> האמור בתקנון זה מנוסח בלשון זכר מטעמי נוחות בלבד.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            2. מהות השירות (פלטפורמת תיווך בלבד)
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>2.1.</strong> <bdi>BOBY</bdi> מספקת פלטפורמה טכנולוגית בלבד. <bdi>BOBY</bdi> אינה היצרנית, היבואנית, הבעלים או המוכרת בפועל של הפריטים המוצגים.
            </li>
            <li>
              <strong>2.2.</strong> כל עסקת רכישה מבוצעת באופן ישיר ובלעדי בין הלקוח לבין האמן.
            </li>
            <li>
              <strong>2.3.</strong> הנהלת האתר אינה נושאת באחריות לטיב המוצרים, איכותם, בטיחותם, זמני האספקה שלהם, או להתאמתם לתיאור.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            3. חובות האמן, קניין רוחני והעלאת תכנים
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>3.1.</strong> האמן מצהיר כי כל היצירות, התמונות והטקסטים שהוא מעלה לאתר (להלן: &quot;התוכן&quot;) הם מקוריים ושייכים לו, ואינם מפרים זכויות יוצרים, סימני מסחר או כל זכות קניין רוחני של צד שלישי.
            </li>
            <li>
              <strong>3.2.</strong> האמן מתחייב לספק תיאור מדויק, אמיתי ומלא של היצירה, לרבות מידות, חומרים ומצב הפריט.
            </li>
            <li>
              <strong>3.3.</strong> בעצם העלאת התמונות לאתר, האמן מקנה להנהלת האתר רישיון חינם להשתמש בתמונות לצורכי קידום ושיווק הפלטפורמה.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            4. סעיף שיפוי (Indemnification)
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>4.1.</strong> האמן מתחייב לשפות ולפצות את הנהלת האתר, עובדיה או מי מטעמה, בגין כל נזק, הפסד, אובדן רווח, תשלום או הוצאה (לרבות שכר טרחת עורך דין) שייגרמו להם עקב תביעה או דרישה של צד שלישי הנובעת מהפרת התקנון על ידי האמן, ממוצר פגום שמכר, או מהפרת זכויות קניין רוחני.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            5. פטור מאחריות לנזקי גוף, רכוש וסייבר
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>5.1.</strong> רכישת המוצרים והשימוש בהם הינם באחריות הלקוח בלבד. <bdi>BOBY</bdi> לא תהיה אחראית לנזק ישיר או עקיף, פיזי או רכושי, שייגרם ללקוח כתוצאה משימוש במוצרים.
            </li>
            <li>
              <strong>5.2.</strong> האתר מוגן ומאובטח, אך הנהלת האתר לא תישא באחריות לכל נזק שייגרם כתוצאה מפריצת סייבר, דליפת מידע, או תקלות במערכות הסליקה של צדדים שלישיים.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            6. מדיניות תשלומים, אספקה וביטולים
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>6.1.</strong> מדיניות הביטולים וההחזרות כפופה לחוק הגנת הצרכן, תשמ&quot;א-<span dir="ltr">1981</span>.
            </li>
            <li>
              <strong>6.2.</strong> האחריות לביצוע המשלוח, אריזת המוצר בצורה בטוחה, ועמידה בזמני האספקה חלה על האמן בלבד. עיכובים או נזקים שנגרמו במהלך המשלוח יטופלו ישירות מול האמן.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            7. זכויות הנהלת האתר (חסימת משתמשים)
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>7.1.</strong> הנהלת האתר שומרת לעצמה את הזכות המלאה להסיר כל יצירה, למחוק תוכן, או לחסום משתמש (אמן או לקוח) באופן מיידי וללא התראה מוקדמת, במקרה של חשד להפרת תקנון, הונאה, או פגיעה באתר.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-[#111827] border-s-4 border-accent-strong ps-3 py-0.5">
            8. סמכות שיפוט
          </h2>
          <ul className="flex flex-col gap-2.5 ps-4 text-body text-[#111827]">
            <li>
              <strong>8.1.</strong> על תקנון זה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
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
