"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { getLikedSlugs } from "@/components/ui/like-button";

export function CategoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const { user, openAuthModal } = useAuth();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  useEffect(() => {
    setMounted(true);
    setLikedCount(getLikedSlugs().length);

    function handleLikeChange() {
      setLikedCount(getLikedSlugs().length);
    }

    window.addEventListener("boby-like-change", handleLikeChange);
    window.addEventListener("storage", handleLikeChange);
    return () => {
      window.removeEventListener("boby-like-change", handleLikeChange);
      window.removeEventListener("storage", handleLikeChange);
    };
  }, []);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const categories = [
    { title: "כל היצירות", href: "/works", icon: "✨", count: "54 יצירות" },
    { title: "קרמיקה וקדרות", href: { pathname: "/works", query: { category: "ceramics" } }, icon: "🏺", count: "כלים פיסוליים וגלזורות" },
    { title: "הדפס, איור וציור", href: { pathname: "/works", query: { category: "prints" } }, icon: "🖼️", count: "מהדורות ממוספרות" },
    { title: "עיבוד עץ וטקסטיל", href: { pathname: "/works", query: { category: "wood" } }, icon: "🪵", count: "אגוז, זית ואריגה" },
    { title: "צורפות ותכשיטים", href: { pathname: "/works", query: { category: "jewelry" } }, icon: "💍", count: "כסף טהור וזהב" },
    { title: "מתנות לעסקים וארגונים", href: "/business", icon: "🎁", count: "מארזים ואוצרות" },
  ];

  const drawerContent = isOpen && (
    <>
      {/* Full Overlay Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Fixed, full-height sliding sidebar */}
      <div
        className="fixed top-0 bottom-0 start-0 z-[9999] h-screen h-dvh w-[360px] max-w-[85vw] flex flex-col bg-surface shadow-[-4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out animate-in slide-in-from-start border-e border-border"
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט וקטגוריות"
      >
        {/* Header: pinned at top */}
        <div className="flex items-center justify-between border-b border-border p-6 shrink-0 bg-surface">
          <div>
            <span className="text-caption font-bold text-accent-strong uppercase tracking-wide">
              תפריט BOBY
            </span>
            <h2 className="text-h3 font-medium text-text">ניווט וקטגוריות</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="סגירת תפריט"
            className="rounded-control p-2 text-text-muted transition-colors hover:bg-sand hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: vertical scroll with quick navigation & categories */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Quick Navigation Section (גלה, חשבון/משתמש, תמיכה) */}
          <div className="flex flex-col gap-2">
            <span className="text-caption font-bold text-accent-strong uppercase tracking-wide px-1">
              ניווט ראשי
            </span>

            {/* 1. Discover / Home (גלה) */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 transition-all hover:border-accent-strong hover:bg-sand"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-lg">
                  🏡
                </span>
                <div>
                  <p className="text-small font-semibold text-text">גלה (עמוד הבית)</p>
                  <p className="text-caption text-text-muted">חזרה לגלריה הראשית</p>
                </div>
              </div>
              <span className="text-caption font-semibold text-accent-strong">←</span>
            </Link>

            {/* 2. Shopping Cart (עגלת קניות / סל) */}
            <div
              className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 transition-all hover:border-accent-strong hover:bg-sand cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-lg">
                  🛒
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-small font-semibold text-text">
                    עגלת קניות
                    <span dir="ltr" className="text-caption font-bold text-accent-strong bg-sand px-2 py-0.5 rounded-full border border-stone/30">
                      (0)
                    </span>
                  </p>
                  <p className="text-caption text-text-muted">סל הקניות שלך (0 פריטים)</p>
                </div>
              </div>
              <span className="text-caption font-semibold text-accent-strong">←</span>
            </div>

            {/* 3. Liked Artworks (יצירות אהובות ❤️) */}
            <Link
              href={{ pathname: "/account", query: { tab: "saved" } }}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 transition-all hover:border-accent-strong hover:bg-sand"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-lg">
                  ❤️
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-small font-semibold text-text">
                    יצירות אהובות
                    {likedCount > 0 && (
                      <span dir="ltr" className="text-caption font-bold text-accent-strong bg-sand px-2 py-0.5 rounded-full border border-stone/30">
                        ({likedCount})
                      </span>
                    )}
                  </p>
                  <p className="text-caption text-text-muted">כל היצירות שסימנת בלייק</p>
                </div>
              </div>
              <span className="text-caption font-semibold text-accent-strong">←</span>
            </Link>

            {/* 2. User Account (שם משתמש / חשבון) */}
            {user ? (
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 transition-all hover:border-accent-strong hover:bg-sand"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-surface text-caption font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-small font-semibold text-text truncate">
                      <bdi>{user.name}</bdi>
                    </p>
                    <p className="text-caption text-text-muted">אזור אישי והגדרות</p>
                  </div>
                </div>
                <span className="text-caption font-semibold text-accent-strong">←</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal(null, "login");
                }}
                className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 text-start transition-all hover:border-accent-strong hover:bg-sand"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-lg">
                    🔑
                  </span>
                  <div>
                    <p className="text-small font-semibold text-text">התחברות / הרשמה</p>
                    <p className="text-caption text-text-muted">גישה לחשבון המשתמש</p>
                  </div>
                </div>
                <span className="text-caption font-semibold text-accent-strong">←</span>
              </button>
            )}

            {/* 3. Customer Support (תמיכה) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent("boby-open-support-chat"));
              }}
              className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 text-start transition-all hover:border-accent-strong hover:bg-sand"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-lg">
                  💬
                </span>
                <div>
                  <p className="text-small font-semibold text-text">תמיכה ושירות לקוחות</p>
                  <p className="text-caption text-text-muted">צ&apos;אט ישיר וסיוע</p>
                </div>
              </div>
              <span className="text-caption font-semibold text-accent-strong">←</span>
            </button>
          </div>

          {/* Art Categories Section */}
          <div className="border-t border-border pt-4 flex flex-col gap-2">
            <span className="text-caption font-bold text-accent-strong uppercase tracking-wide px-1">
              קטגוריות אמנות
            </span>

            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href as any}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between rounded-panel border border-border/80 bg-sand/30 p-3.5 transition-all hover:border-accent-strong hover:bg-sand shrink-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-lg shadow-sm">
                    {cat.icon}
                  </span>
                  <div>
                    <p className="text-small font-semibold text-text group-hover:text-accent-strong">
                      {cat.title}
                    </p>
                    <p className="text-caption text-text-muted">{cat.count}</p>
                  </div>
                </div>
                <span className="text-caption font-semibold text-accent-strong transition-transform group-hover:translate-x-[-3px]">
                  ←
                </span>
              </Link>
            ))}
          </div>

          {/* Newsletter Subscription Section inside CategoryDrawer */}
          <div className="border-t border-border pt-4 flex flex-col gap-2.5">
            <span className="text-caption font-bold text-accent-strong uppercase tracking-wide px-1">
              עדכונים והשראות
            </span>

            <div className="rounded-panel border border-border/80 bg-sand/60 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-base shadow-sm shrink-0">
                  ✉️
                </span>
                <div>
                  <p className="text-small font-semibold text-text">רוצים להישאר בקשר ולקבל עדכונים?</p>
                  <p className="text-caption text-text-muted">חדשות סטודיו, יצירות חדשות ואמנים</p>
                </div>
              </div>

              {subscribed ? (
                <div className="rounded-control bg-success/15 border border-success/30 p-2.5 text-center text-caption font-medium text-success animate-in fade-in">
                  ✨ תודה שנרשמתם! נמשיך לעדכן אתכם ביצירות חדשות.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input
                    type="email"
                    dir="ltr"
                    required
                    placeholder="your.email@example.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full rounded-control border border-stone/40 bg-surface px-3 py-2 text-small placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-control bg-deep px-3 py-2 text-small font-medium text-surface transition-colors hover:bg-accent-hover"
                  >
                    הרשמה לעדכונים
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer pinned at bottom */}
        <div className="border-t border-border p-4 text-center shrink-0 bg-surface">
          <p className="text-caption text-text-muted">
            BOBY · אמנות ומלאכת יד ישראלית מקורית
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="פתיחת תפריט ניווט וקטגוריות"
        className="flex items-center gap-1.5 rounded-control p-2 text-text transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong shrink-0"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline text-small font-medium">קטגוריות</span>
      </button>

      {/* Portal to document.body */}
      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
