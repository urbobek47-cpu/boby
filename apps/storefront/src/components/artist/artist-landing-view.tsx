"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-context";

export function ArtistLandingView() {
  const { user, openAuthModal } = useAuth();
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-panel border border-border bg-surface p-6 shadow-sm md:p-14">
        {/* Subtle background decoration */}
        <div className="absolute end-0 top-0 h-64 w-64 rounded-full bg-sand/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-start gap-4 md:gap-6 text-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3.5 py-1 text-caption font-semibold text-accent-strong border border-stone/30">
            ✨ אזור אמנים ב-BOBY · פלטפורמת אוצרות ומלאכת יד
          </span>

          <h1 className="font-heading text-h1 font-medium text-text text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] leading-[1.15]">
            הבית לאמנות ומלאכת יד ישראלית מקורית
          </h1>

          <p className="text-body-lg text-text-muted md:text-[1.2rem] leading-relaxed">
            גלריית אוצרות מקוונת המפגישה בין אמנים ויוצרים מקומיים לבין אספנים, חובבי עיצוב, מעצבי פנים ורוכשים בארץ ובעולם. BOBY דואגת לתמונות ברמה מוזיאלית, לחשיפה ממוקדת ולמעטפת מכירה הוגנת.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            {user ? (
              <Link
                href="/upload/new"
                className="inline-flex items-center gap-2 rounded-control bg-accent-strong px-6 py-3.5 text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong shadow-md"
              >
                <span>העלאת יצירה חדשה</span>
                <span>✨</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("artist", "login")}
                className="inline-flex items-center gap-2 rounded-control bg-accent-strong px-6 py-3.5 text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong shadow-md"
              >
                <span>התחברות / הרשמה כאמן</span>
                <span>✨</span>
              </button>
            )}

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1 rounded-control border border-border bg-sand/40 px-5 py-3 text-small font-medium text-text transition-colors hover:bg-sand"
            >
              <span>איך התהליך עובד?</span>
              <span className="text-accent-strong">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Value Propositions Grid (3 Cards) */}
      <section className="flex flex-col gap-6">
        <div className="text-start">
          <span className="text-caption font-bold uppercase tracking-wider text-accent-strong">
            מה BOBY מציעה לאמנים?
          </span>
          <h2 className="mt-1 font-heading text-h2 font-medium text-text text-[1.8rem] md:text-[2.2rem]">
            חשיפה גבוהה, אוצרות מוקפדת ומודל הוגן
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col justify-between rounded-card border border-border bg-surface p-6 shadow-sm transition-all hover:border-accent-strong/40">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-panel bg-sand text-2xl mb-4 text-accent-strong">
                🎨
              </div>
              <h3 className="font-heading text-h3 font-medium text-text text-[1.35rem] mb-2">
                הצגה מוזיאלית וסיפור הסטודיו
              </h3>
              <p className="text-body text-text-muted leading-relaxed">
                כל יצירה מקבלת במה מכובדת המבליטה את חומרי הגלם המקומיים, הטכניקה הסטודיונית והסיפור האישי מאחורי היצירה שלך.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-caption font-medium text-accent-strong">
              ✨ דגש על איכות וטקסטורות מקוריות
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col justify-between rounded-card border border-border bg-surface p-6 shadow-sm transition-all hover:border-accent-strong/40">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-panel bg-sand text-2xl mb-4 text-accent-strong">
                🏛️
              </div>
              <h3 className="font-heading text-h3 font-medium text-text text-[1.35rem] mb-2">
                חיבור ישיר לקונים ומעצבים
              </h3>
              <p className="text-body text-text-muted leading-relaxed">
                חשיפה ממוקדת לרוכשים פרטיים, מעצבי פנים, משרדי אדריכלים ולקוחות עסקיים המחפשים מתנות ומארזים מקוריים בעבודת יד.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-caption font-medium text-accent-strong">
              🤝 חיבור לקהילת עיצוב ואמנות
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col justify-between rounded-card border border-border bg-surface p-6 shadow-sm transition-all hover:border-accent-strong/40">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-panel bg-sand text-2xl mb-4 text-accent-strong">
                ⚖️
              </div>
              <h3 className="font-heading text-h3 font-medium text-text text-[1.35rem] mb-2">
                מודל הוגן ושקוף (Net Price)
              </h3>
              <p className="text-body text-text-muted leading-relaxed">
                האמן קובע את מחיר הנטו שלו. אין עמלות נסתרות שיורדות מהמחיר שסיכמת. BOBY פועלת כ-Merchant of Record ומטפלת בניהול המכירה.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-caption font-medium text-accent-strong">
              💎 תמחור הוגן ללא הפתעות
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="rounded-panel border border-border bg-sand/40 p-6 md:p-12">
        <div className="text-start mb-8">
          <span className="text-caption font-bold uppercase tracking-wider text-accent-strong">
            תהליך פשוט ומהיר
          </span>
          <h2 className="mt-1 font-heading text-h2 font-medium text-text text-[1.8rem] md:text-[2.2rem]">
            איך מציגים יצירה ב-BOBY?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="flex flex-col items-start rounded-panel border border-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-strong text-surface font-bold text-body mb-4">
              1
            </span>
            <h3 className="font-semibold text-text text-body-lg mb-2">
              העלאת היצירה והסיפור
            </h3>
            <p className="text-small text-text-muted leading-relaxed">
              מעלים תמונות איכותיות מהסטודיו, מפרטים מידות, חומרים וסיפור קצר על תהליך היצירה.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start rounded-panel border border-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-strong text-surface font-bold text-body mb-4">
              2
            </span>
            <h3 className="font-semibold text-text text-body-lg mb-2">
              אימות ואוצרות איכות
            </h3>
            <p className="text-small text-text-muted leading-relaxed">
              היצירה עוברת בדיקה קצרה לוודא שהיא עומדת בסטנדרטים של תאורה, רקע ניטרלי ואיכות צילום.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start rounded-panel border border-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-strong text-surface font-bold text-body mb-4">
              3
            </span>
            <h3 className="font-semibold text-text text-body-lg mb-2">
              פרסום בגלריה ומכירה
            </h3>
            <p className="text-small text-text-muted leading-relaxed">
              היצירה מופיעה בקטלוג הגלריה וזמינה לרכישה ישירה, תוך שמירה על זכויות היוצרים והייחוד של העבודה.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="flex flex-col items-center justify-between gap-6 rounded-panel border border-accent-strong/30 bg-surface p-8 text-center shadow-md md:flex-row md:text-start md:p-12">
        <div className="max-w-xl">
          <h2 className="font-heading text-h2 font-medium text-text text-[1.6rem] md:text-[2rem]">
            מוכנים לשתף את היצירה שלכם בגלריה?
          </h2>
          <p className="mt-2 text-body text-text-muted">
            תהליך ההעלאה פתוח לכל אמן/ית ויוצר/ת. אין צורך בהגדרות מורכבות — פשוט מעלים את היצירה והיא מצטרפת לקטלוג.
          </p>
        </div>

        {user ? (
          <Link
            href="/upload/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-control bg-accent-strong px-7 py-3.5 text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong shadow-sm"
          >
            <span>להעלות יצירה חדשה כעת</span>
            <span>✨</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("artist", "login")}
            className="inline-flex shrink-0 items-center gap-2 rounded-control bg-accent-strong px-7 py-3.5 text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong shadow-sm"
          >
            <span>התחברות / הרשמה כאמן</span>
            <span>✨</span>
          </button>
        )}
      </section>
    </div>
  );
}
