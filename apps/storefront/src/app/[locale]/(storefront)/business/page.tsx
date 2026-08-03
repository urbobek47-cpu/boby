import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { seoAlternates } from "@/lib/site";
import { buttonClasses } from "@/components/ui/button";
import { Price } from "@/components/catalog/price";
import { ArtImage } from "@/components/media/art-image";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Business.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale as Locale, "/business"),
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Business />;
}

function Business() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Packages />
      <Terms />
      <HowItWorks />
      <LeadForm />
    </>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero() {
  const t = useTranslations("Business.hero");
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 pt-10 md:px-12 md:pt-16 lg:px-16">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <ArtImage
          publicId="/mock/gift-set.jpg"
          alt="מארז מתנה עם כלי קרמיקה, טקסטיל ופריט עץ בעבודת יד"
          aspectRatio={3 / 2}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="order-last md:order-none"
        />
        <div className="flex flex-col items-start gap-6">
          <p className="text-small font-medium tracking-wide text-accent-strong">{t("eyebrow")}</p>
          <h1 className="max-w-[18ch] text-[length:var(--text-display)] font-medium leading-[1.1] md:text-[3.25rem]">
            {t("title")}
          </h1>
          <p className="max-w-[46ch] text-[length:var(--text-h3)] text-text-muted">
            {t("subtitle")}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="#lead" className={buttonClasses("primary")}>
              {t("ctaSample")}
            </Link>
            <Link href="#lead" className={buttonClasses("secondary")}>
              {t("ctaCall")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- value props */

function ValueProps() {
  const t = useTranslations("Business.value");
  const items = [
    { title: t("madeTitle"), body: t("madeBody") },
    { title: t("logisticsTitle"), body: t("logisticsBody") },
    { title: t("invoiceTitle"), body: t("invoiceBody") },
  ];
  return (
    <section className="mx-auto mt-20 max-w-[var(--container-content)] px-6">
      <ul role="list" className="grid gap-8 border-y border-border py-10 md:grid-cols-3 md:gap-12">
        {items.map((item, i) => (
          <li key={item.title} className="flex flex-col gap-2">
            <span className="text-caption text-text-muted" dir="ltr">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="text-h3 font-semibold">{item.title}</h2>
            <p className="text-small text-text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------------- packages */

const PACKAGES = [
  { agorot: 30000, nameKey: "localName", contentsKey: "localContents", publicId: "/mock/earth-bowl.jpg" },
  { agorot: 45000, nameKey: "homeName", contentsKey: "homeContents", publicId: "/mock/olive-goblet.jpg" },
  { agorot: 55000, nameKey: "galleryName", contentsKey: "galleryContents", publicId: "/mock/full-moon.jpg" },
] as const;

function Packages() {
  const t = useTranslations("Business.packages");
  return (
    <section className="mx-auto mt-24 max-w-[var(--container-content)] px-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-h2 font-medium">{t("title")}</h2>
        <p className="max-w-[var(--container-prose)] text-text-muted">{t("subtitle")}</p>
      </div>
      <ul role="list" className="mt-10 grid gap-6 md:grid-cols-3">
        {PACKAGES.map((p) => (
          <li
            key={p.nameKey}
            className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-6"
          >
            <ArtImage
              publicId={p.publicId}
              alt={t(p.nameKey)}
              aspectRatio={4 / 5}
              sizes="(min-width: 768px) 380px, 90vw"
            />
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-h3 font-semibold">{t(p.nameKey)}</h3>
              <span className="flex items-baseline gap-1">
                <Price agorot={p.agorot} className="text-h3 font-semibold" />
                <span className="text-caption text-text-muted">{t("perUnit")}</span>
              </span>
            </div>
            <p className="text-small text-text-muted">{t(p.contentsKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------- terms */

function Terms() {
  const t = useTranslations("Business.terms");
  const rows = [
    { label: t("minOrderLabel"), value: t("minOrderValue") },
    { label: t("leadLabel"), value: t("leadValue") },
    { label: t("depositLabel"), value: t("depositValue") },
    { label: t("invoiceLabel"), value: t("invoiceValue") },
    { label: t("deliveryLabel"), value: t("deliveryValue") },
  ];
  return (
    <section className="mx-auto mt-24 max-w-[var(--container-content)] px-6">
      <div className="rounded-panel bg-deep p-8 text-surface md:p-12">
        <h2 className="text-h2 font-medium">{t("title")}</h2>
        <dl className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col gap-1 border-t border-surface/20 pt-3">
              <dt className="text-caption text-surface/60">{r.label}</dt>
              <dd className="text-body font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- how it works */

function HowItWorks() {
  const t = useTranslations("Business.how");
  const steps = [
    { title: t("s1Title"), body: t("s1Body") },
    { title: t("s2Title"), body: t("s2Body") },
    { title: t("s3Title"), body: t("s3Body") },
    { title: t("s4Title"), body: t("s4Body") },
  ];
  return (
    <section className="mx-auto mt-24 max-w-[var(--container-content)] px-6">
      <h2 className="text-h2 font-medium">{t("title")}</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-sand text-small font-semibold"
              dir="ltr"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-h3 font-semibold">{s.title}</h3>
            <p className="text-small text-text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------------- lead form */

function LeadForm() {
  const t = useTranslations("Business.lead");
  return (
    <section id="lead" className="mx-auto mt-24 max-w-[var(--container-content)] scroll-mt-24 px-6">
      <div className="rounded-panel bg-sand p-8 md:p-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-h2 font-medium">{t("title")}</h2>
          <p className="max-w-[var(--container-prose)] text-text-muted">{t("subtitle")}</p>
        </div>

        {/* Not yet wired to email/CRM (lead-flow backend is a follow-up) — the
            submit is inert and the note is honest. Fields are fully accessible. */}
        <form className="mt-8 grid gap-5 md:grid-cols-2">
          <TextField id="lead-name" label={t("fullName")} autoComplete="name" />
          <TextField id="lead-company" label={t("company")} autoComplete="organization" />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-emp" className="text-small font-medium">
              {t("employees")}
            </label>
            <select
              id="lead-emp"
              defaultValue=""
              className="min-h-11 rounded-control border border-border bg-surface px-3.5 text-body text-text"
            >
              <option value="" disabled>
                {t("chooseEmployees")}
              </option>
              <option>{t("emp1")}</option>
              <option>{t("emp2")}</option>
              <option>{t("emp3")}</option>
              <option>{t("emp4")}</option>
            </select>
          </div>

          <TextField id="lead-email" label={t("email")} type="email" dir="ltr" autoComplete="email" />

          <label className="flex items-center gap-2.5 text-small md:col-span-2">
            <input type="checkbox" className="size-4 accent-[var(--color-text)]" />
            {t("sample")}
          </label>

          <div className="flex flex-col gap-2 md:col-span-2">
            <button type="button" className={buttonClasses("primary", "md", "self-start")}>
              {t("submit")}
            </button>
            <p className="text-caption text-text-muted">{t("note")}</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function TextField({
  id,
  label,
  type = "text",
  dir,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  dir?: "ltr";
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        dir={dir}
        autoComplete={autoComplete}
        className="min-h-11 rounded-control border border-border bg-surface px-3.5 text-body text-text"
      />
    </div>
  );
}
