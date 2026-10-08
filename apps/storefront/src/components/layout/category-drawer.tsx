"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useRouter } from "@/i18n/navigation";
import { useCart } from "@/components/cart/cart-context";
import { useAuth } from "@/components/auth/auth-context";
import { getLikedSlugs } from "@/components/ui/like-button";

export function CategoryDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const { user, openAuthModal } = useAuth();
  const { itemCount, openCart } = useCart();

  const handleGoHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    router.push("/");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


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
    {
      title: "כל היצירות",
      href: "/works",
      count: "54 יצירות",
      icon: (
        <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      title: "קרמיקה וקדרות",
      href: { pathname: "/works", query: { category: "ceramics" } },
      count: "כלים פיסוליים וגלזורות",
      icon: (
        <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.244c0 .892-.506 1.7-1.306 2.091l-1.07.535A4.453 4.453 0 005 10.957v3.293a6.75 6.75 0 0014 0v-3.293a4.453 4.453 0 00-2.374-3.983l-1.07-.535a2.333 2.333 0 01-1.306-2.091V3.104M8.25 3h7.5M12 21v-3" />
        </svg>
      ),
    },
    {
      title: "הדפס, איור וציור",
      href: { pathname: "/works", query: { category: "prints" } },
      count: "מהדורות ממוספרות",
      icon: (
        <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      title: "עיבוד עץ וטקסטיל",
      href: { pathname: "/works", query: { category: "wood" } },
      count: "אגוז, זית ואריגה",
      icon: (
        <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 7.5l5.571 2.25M6.429 14.25L12 17.25l5.571-3m0 0L21.75 12l-4.179-2.25" />
        </svg>
      ),
    },
    {
      title: "צורפות ותכשיטים",
      href: { pathname: "/works", query: { category: "jewelry" } },
      count: "כסף טהור וזהב",
      icon: (
        <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l7.5 7.5-7.5 12-7.5-12 7.5-7.5zM4.5 9.75h15" />
        </svg>
      ),
    },
    {
      title: "מתנות לעסקים וארגונים",
      href: "/business",
      count: "מארזים ואוצרות",
      icon: (
        <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0v13.5m-7.5-13.5h15a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75z" />
        </svg>
      ),
    },
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
          <Link
            href="/"
            onClick={handleGoHome}
            className="text-start group focus-visible:outline-none"
          >
            <span className="text-caption font-bold text-accent-strong uppercase tracking-wide group-hover:underline">
              תפריט BOBY
            </span>
            <h2 className="text-h3 font-medium text-text">ניווט וקטגוריות</h2>
          </Link>
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
              onClick={handleGoHome}
              className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 transition-all hover:border-accent-strong hover:bg-sand cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-text">
                  <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </span>
                <div>
                  <p className="text-small font-semibold text-text">גלה (עמוד הבית)</p>
                  <p className="text-caption text-text-muted">חזרה לגלריה הראשית</p>
                </div>
              </div>
              <span className="text-caption font-semibold text-accent-strong">←</span>
            </Link>

            {/* 2. Upload Artwork / העלאת יצירה */}
            {user ? (
              <Link
                href="/upload/new"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-panel border border-accent-strong/40 bg-sand/80 p-3.5 transition-all hover:border-accent-strong hover:bg-sand"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-strong text-surface shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-small font-semibold text-text">
                      העלאת יצירה חדשה
                      <span className="text-[10px] font-bold text-surface bg-accent-strong px-2 py-0.5 rounded-full">
                        אזור אמן
                      </span>
                    </p>
                    <p className="text-caption text-text-muted">העלאת עבודה חדשה לגלריית BOBY</p>
                  </div>
                </div>
                <span className="text-caption font-semibold text-accent-strong">←</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal("artist", "login");
                }}
                className="flex items-center justify-between w-full text-start rounded-panel border border-accent-strong/40 bg-sand/80 p-3.5 transition-all hover:border-accent-strong hover:bg-sand"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-strong text-surface shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-small font-semibold text-text">
                      העלאת יצירה חדשה
                      <span className="text-[10px] font-bold text-surface bg-accent-strong px-2 py-0.5 rounded-full">
                        אזור אמן
                      </span>
                    </p>
                    <p className="text-caption text-text-muted">התחברות או הרשמת אמן להעלאת יצירות</p>
                  </div>
                </div>
                <span className="text-caption font-semibold text-accent-strong">←</span>
              </button>
            )}

            {/* 2. Shopping Cart (עגלת קניות / סל) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openCart();
              }}
              className="flex w-full items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 text-start transition-all hover:border-accent-strong hover:bg-sand cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-text">
                  <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-small font-semibold text-text">
                    עגלת קניות
                    <span dir="ltr" className="text-caption font-bold text-accent-strong bg-sand px-2 py-0.5 rounded-full border border-stone/30">
                      ({itemCount})
                    </span>
                  </p>
                  <p className="text-caption text-text-muted">סל הקניות שלך ({itemCount} פריטים)</p>
                </div>
              </div>
              <span className="text-caption font-semibold text-accent-strong">←</span>
            </button>

            {/* 3. Liked Artworks (יצירות אהובות) */}
            <Link
              href={{ pathname: "/account", query: { tab: "saved" } }}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-panel border border-border/80 bg-surface p-3.5 transition-all hover:border-accent-strong hover:bg-sand"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-text">
                  <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-text">
                    <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
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
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-text">
                  <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.008v.008h.008V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.008v.008h.008V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.008v.008h.008V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 2.25c-5.385 0-9.75 3.582-9.75 8 0 2.455 1.34 4.654 3.447 6.136-.2.87-.665 2.158-1.573 3.328a.375.375 0 00.37.587 9.87 9.87 0 004.887-1.393A10.835 10.835 0 0012 18.25c5.385 0 9.75-3.582 9.75-8s-4.365-8-9.75-8z" />
                  </svg>
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text shadow-sm border border-stone/20">
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
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text shadow-sm border border-stone/20 shrink-0">
                  <svg className="h-4 w-4 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
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
