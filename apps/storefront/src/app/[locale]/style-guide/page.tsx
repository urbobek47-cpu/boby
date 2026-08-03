import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";

/*
 * Living style guide — the design system rendered from the real token layer
 * and the real reusable components (Button, Field, StatusBadge). Every screen
 * built later is checked against this page.
 *
 * Scope note: this is an INTERNAL design reference, deliberately Hebrew-first
 * and not localized to English — translating design-system labels would be
 * busywork for a non-customer page. It still lives under [locale] so the route
 * resolves, and it is RTL-correct.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "BOBY — מערכת עיצוב",
  robots: { index: false, follow: false }, // internal reference, keep out of SERPs
};

export default async function StyleGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    // Force RTL: the guide's content is Hebrew regardless of the URL locale.
    <div dir="rtl" className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-16 md:py-24">
        <Header />
        <div className="mt-16 flex flex-col gap-20">
          <Palette />
          <Typography />
          <Buttons />
          <Forms />
          <Badges />
          <Radii />
          <Elevation />
          <EdgeStates />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ layout */

function Header() {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-12">
      <p className="text-small font-medium tracking-wide text-accent-strong">
        <bdi>BOBY</bdi> · מערכת עיצוב
      </p>
      <h1 className="text-[2rem] font-medium md:text-[3.25rem] md:leading-[1.1]">
        גלריה שקטה. מסחר ברור.
      </h1>
      <p className="max-w-[var(--container-prose)] text-h3 text-text-muted">
        מבנה של White Cube, חום חומרי בצילום, ובהירות מסחרית בקנייה. הדף הזה מציג
        את הטוקנים והרכיבים האמיתיים — כל מסך נבנה ונבדק מולו.
      </p>
    </header>
  );
}

function Section({
  n,
  title,
  note,
  children,
}: {
  n: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-caption font-medium text-text-muted">
          <span dir="ltr">{n}</span>
        </p>
        <h2 className="text-h2 font-medium">{title}</h2>
        {note && (
          <p className="max-w-[var(--container-prose)] text-small text-text-muted">
            {note}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ palette */

type Swatch = {
  name: string;
  varName: string;
  hex: string;
  use: string;
  onDark?: boolean;
};

const surfaces: Swatch[] = [
  { name: "bg", varName: "--color-bg", hex: "#ECEAE6", use: "רקע העמוד" },
  { name: "surface", varName: "--color-surface", hex: "#FFFFFF", use: "כרטיסים ופאנלים" },
  { name: "sand", varName: "--color-sand", hex: "#EFE6DC", use: "בֶּד תמונה, פאנל חם" },
  { name: "stone", varName: "--color-stone", hex: "#D7D2CB", use: "ניטרלי חם, גבול רך" },
  { name: "deep", varName: "--color-deep", hex: "#2A211E", use: "עמוד ארגוני, פוטר", onDark: true },
];

const inkAndLines: Swatch[] = [
  { name: "text", varName: "--color-text", hex: "#111827", use: "טקסט גוף" },
  { name: "text-muted", varName: "--color-text-muted", hex: "#4B5563", use: "טקסט משני · 6.3:1" },
  { name: "border", varName: "--color-border", hex: "#E5E7EB", use: "קווים וגבולות" },
];

const accents: Swatch[] = [
  { name: "accent", varName: "--color-accent", hex: "#C17F59", use: "עיטור + כותרות ≥24px בלבד" },
  { name: "accent-strong", varName: "--color-accent-strong", hex: "#8A5335", use: "קישורים, פעולות משניות · 5.2:1" },
  { name: "accent-hover", varName: "--color-accent-hover", hex: "#6F4229", use: "מצב ריחוף" },
];

const states: Swatch[] = [
  { name: "btn-primary", varName: "--color-btn-primary", hex: "#111827", use: "כפתור רכישה", onDark: true },
  { name: "success", varName: "--color-success", hex: "#2F6B4F", use: "הצלחה" },
  { name: "error", varName: "--color-error", hex: "#9B2C2C", use: "שגיאה" },
];

function SwatchCard({ s }: { s: Swatch }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div
        className="h-20 w-full"
        style={{ background: `var(${s.varName})` }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1 p-3">
        <p className="text-small font-medium">
          <span dir="ltr">{s.name}</span>
        </p>
        <p className="text-caption text-text-muted">
          <span dir="ltr">{s.hex}</span>
        </p>
        <p className="text-caption text-text-muted">{s.use}</p>
      </div>
    </div>
  );
}

function SwatchGroup({ title, items }: { title: string; items: Swatch[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-h3 font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((s) => (
          <SwatchCard key={s.name} s={s} />
        ))}
      </div>
    </div>
  );
}

function Palette() {
  return (
    <Section
      n="01"
      title="פלטת צבעים"
      note="המערכת החמה. טרקוטה היא עריכתית — לעולם לא כפתור רכישה מלא. כל צמד טקסט-רקע נבדק לתקן AA."
    >
      <div className="flex flex-col gap-8">
        <SwatchGroup title="משטחים" items={surfaces} />
        <SwatchGroup title="טקסט וקווים" items={inkAndLines} />
        <SwatchGroup title="הדגשה (טרקוטה)" items={accents} />
        <SwatchGroup title="מצבים" items={states} />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- typography */

const typeSpecimens: Array<{
  label: string;
  cls: string;
  font: string;
  sample: string;
}> = [
  { label: "display · 32→56", cls: "text-[2rem] md:text-[3.5rem] leading-[1.15]", font: "Frank Ruhl Libre", sample: "יצירה ישראלית, שנבחרה אחת-אחת" },
  { label: "h1 · 26→40", cls: "text-[1.625rem] md:text-[2.5rem] leading-tight", font: "Frank Ruhl Libre", sample: "קערת אדמה" },
  { label: "h2 · 21→28", cls: "text-h2 md:text-[1.75rem]", font: "Frank Ruhl Libre", sample: "איך זה עובד" },
  { label: "h3 · 18→22", cls: "text-h3 md:text-[1.375rem] font-semibold", font: "Assistant 600", sample: "מתנות לעסקים" },
  { label: "body · 16→17", cls: "text-body", font: "Assistant 400", sample: "קערה שנבנתה ביד מחומר מקומי, עם שכבות דקות של גלזורה מינרלית." },
  { label: "small · 14", cls: "text-small", font: "Assistant 400", sample: "משלוח חינם בקנייה מעל ₪500" },
  { label: "caption · 13", cls: "text-caption", font: "Assistant 400", sample: "הצבעים עשויים להשתנות בין מסכים" },
];

function Typography() {
  return (
    <Section
      n="02"
      title="טיפוגרפיה"
      note="כותרות ב-Frank Ruhl Libre (סריף עברי), גוף ב-Assistant. בעברית אין אותיות גדולות ואין נטוי — היררכיה במשקל, גודל וריווח."
    >
      <div className="flex flex-col divide-y divide-border rounded-panel border border-border bg-surface">
        {typeSpecimens.map((t) => (
          <div
            key={t.label}
            className="flex flex-col gap-2 p-5 md:flex-row md:items-baseline md:justify-between"
          >
            <span className={t.cls}>{t.sample}</span>
            <span className="shrink-0 text-caption text-text-muted md:ms-6">
              <span dir="ltr">{t.label}</span> · {t.font}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ buttons */

function Buttons() {
  return (
    <Section
      n="03"
      title="כפתורים"
      note="ראשי = כמעט-שחור לרכישה. משני = מתאר. קישור = טרקוטה עריכתי. רחפו/מקדו כדי לראות את המצבים החיים."
    >
      <div className="flex flex-col gap-6 rounded-panel border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">הוספה לסל</Button>
          <Button variant="secondary">לפרטי היצירה</Button>
          <Button variant="link">איך זה עובד</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" disabled>
            אזל מהמלאי
          </Button>
          <Button variant="secondary" disabled>
            לא זמין
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm">
            קטן
          </Button>
          <Button variant="secondary" size="sm">
            קטן
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------- forms */

function Forms() {
  return (
    <Section
      n="04"
      title="שדות טופס"
      note="לייבל אמיתי מקושר, שגיאות מוכרזות דרך aria-describedby — לא צבע בלבד."
    >
      <div className="grid gap-6 rounded-panel border border-border bg-surface p-6 md:grid-cols-3">
        <Field label="שם מלא" placeholder="ישראלה ישראלי" hint="כפי שיופיע במשלוח" />
        <Field label="דוא״ל" type="email" placeholder="name@example.com" required />
        <Field
          label="מספר עובדים"
          defaultValue="abc"
          error="יש להזין מספר תקין"
        />
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- badges */

function Badges() {
  return (
    <Section
      n="05"
      title="תגיות סטטוס"
      note="שפת הזמינות מוגדרת פעם אחת. הסטטוס אף פעם לא בצבע בלבד, ופריט שמור מוצג בכנות — 'בסל של מישהו אחר', לא 'נמכר'."
    >
      <div className="flex flex-wrap gap-3 rounded-panel border border-border bg-surface p-6">
        <StatusBadge tone="warm">יצירה יחידה</StatusBadge>
        <StatusBadge tone="neutral">מהדורה מוגבלת · 3/25</StatusBadge>
        <StatusBadge tone="neutral">בהזמנה מראש · 3–4 שבועות</StatusBadge>
        <StatusBadge tone="warm">בסל של מישהו אחר</StatusBadge>
        <StatusBadge tone="muted">נמכרה</StatusBadge>
        <StatusBadge tone="neutral">משלוח בהצעת מחיר</StatusBadge>
        <StatusBadge tone="positive">שולם</StatusBadge>
        <StatusBadge tone="critical">התשלום נכשל</StatusBadge>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ radii */

const radii: Array<{ name: string; cls: string; note: string }> = [
  { name: "artwork · 2px", cls: "rounded-artwork", note: "תמונות יצירה" },
  { name: "card · 8px", cls: "rounded-card", note: "כרטיסים עריכתיים" },
  { name: "control · 10px", cls: "rounded-control", note: "טפסים ופקדים" },
  { name: "panel · 16px", cls: "rounded-panel", note: "פאנלים גדולים" },
  { name: "pill", cls: "rounded-pill", note: "תגיות" },
];

function Radii() {
  return (
    <Section
      n="06"
      title="עיגול פינות"
      note="מדורג, לא אחיד. עיגול אחיד נראה כמו אפליקציית לייפסטייל — לא גלריה."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {radii.map((r) => (
          <div key={r.name} className="flex flex-col items-center gap-2">
            <div
              className={`h-24 w-full border border-stone bg-sand ${r.cls}`}
              aria-hidden="true"
            />
            <p className="text-small font-medium">
              <span dir="ltr">{r.name}</span>
            </p>
            <p className="text-caption text-text-muted">{r.note}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- elevation */

function Elevation() {
  return (
    <Section
      n="07"
      title="הבלטה"
      note="צל אחד עדין בלבד. אין ערימת צללים, אין גבולות מיותרים."
    >
      <div className="rounded-panel bg-bg p-10">
        <div
          className="max-w-sm rounded-card bg-surface p-6"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <p className="text-h3 font-semibold">כרטיס מוגבה</p>
          <p className="mt-2 text-small text-text-muted">
            <span dir="ltr">shadow-soft</span> — 0 1px 3px, 0 8px 24px. ההבלטה
            היחידה במערכת.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- edge states */

function EdgeStateCard({
  title,
  body,
  badge,
  action,
}: {
  title: string;
  body: string;
  badge: React.ReactNode;
  action?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
      <div className="aspect-4/3 w-full rounded-artwork bg-sand" aria-hidden="true" />
      <div className="flex items-center justify-between gap-2">
        <p className="text-h3 font-semibold">{title}</p>
        {badge}
      </div>
      <p className="text-small text-text-muted">{body}</p>
      {action && (
        <div className="mt-1">
          <Button variant="secondary" size="sm">
            {action}
          </Button>
        </div>
      )}
    </div>
  );
}

function EdgeStates() {
  return (
    <Section
      n="08"
      title="מצבי קצה"
      note="האמון נבנה כאן יותר מאשר בדף הבית. אלה דוגמאות ויזואליות — הלוגיקה המלאה (שריון, החזרים) נבנית בשלב המסחר."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EdgeStateCard
          title="קערת אדמה"
          badge={<StatusBadge tone="warm">בסל של מישהו אחר</StatusBadge>}
          body="היצירה שמורה כרגע בסל של קונה אחר. נסו שוב בעוד כמה דקות — לא בטוח שההזמנה תושלם."
          action="הודיעו לי כשמתפנה"
        />
        <EdgeStateCard
          title="צלחת נוף"
          badge={<StatusBadge tone="muted">נמכרה</StatusBadge>}
          body="היצירה נמכרה. זו עבודה יחידה במינה, ולכן לא תחזור — אבל יש עבודות נוספות מאותה אמנית."
          action="עבודות דומות"
        />
        <EdgeStateCard
          title="ספל מוזג"
          badge={<StatusBadge tone="neutral">בהזמנה · 3–4 שבועות</StatusBadge>}
          body="נעשה במיוחד עבורכם לאחר ההזמנה. זמן ההכנה המשוער מוצג בבירור לפני הקנייה."
          action="להזמנה מראש"
        />
        <EdgeStateCard
          title="אין תוצאות"
          badge={<StatusBadge tone="neutral">סינון ריק</StatusBadge>}
          body="לא נמצאו יצירות בסינון הזה. נסו להרחיב את טווח המחיר, או הסירו מסנן אחד."
          action="ניקוי הסינון"
        />
      </div>
    </Section>
  );
}
