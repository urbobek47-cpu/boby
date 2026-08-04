"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-context";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();

  const isExploreActive = pathname === "/";
  const isCategoriesActive = pathname.startsWith("/works");

  return (
    <div className="fixed bottom-0 start-0 end-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
      <nav aria-label="ניווט נייד" className="grid h-16 grid-cols-4 items-center px-2">
        {/* 1. Explore (Home) */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isExploreActive ? "text-accent-strong font-semibold" : "text-text-muted hover:text-text"
          }`}
        >
          <span className="text-xl" aria-hidden="true">
            {isExploreActive ? "🏠" : "🏡"}
          </span>
          <span className="text-[11px]">גלה</span>
        </Link>

        {/* 2. Categories (Works) */}
        <Link
          href="/works"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isCategoriesActive ? "text-accent-strong font-semibold" : "text-text-muted hover:text-text"
          }`}
        >
          <span className="text-xl" aria-hidden="true">
            🎨
          </span>
          <span className="text-[11px]">קטגוריות</span>
        </Link>

        {/* 3. Account */}
        <button
          type="button"
          onClick={() => {
            if (!user) {
              openAuthModal(null, "login");
            } else {
              // Open user settings or trigger click
              const menuBtn = document.querySelector<HTMLButtonElement>(
                'button[aria-label^="תפריט משתמש"]'
              );
              menuBtn?.click();
            }
          }}
          className="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-text transition-colors"
        >
          <span className="text-xl" aria-hidden="true">
            {user ? "👤" : "🔑"}
          </span>
          <span className="text-[11px] truncate max-w-[64px]">
            {user ? user.name.split(" ")[0] : "חשבון"}
          </span>
        </button>

        {/* 4. Support Chat */}
        <button
          type="button"
          onClick={() => {
            const chatTrigger = document.querySelector<HTMLButtonElement>(
              'button[aria-label="צ\'אט תמיכה ושירות לקוחות"]'
            );
            chatTrigger?.click();
          }}
          className="flex flex-col items-center justify-center gap-1 text-text-muted hover:text-text transition-colors"
        >
          <span className="text-xl" aria-hidden="true">
            💬
          </span>
          <span className="text-[11px]">תמיכה</span>
        </button>
      </nav>
    </div>
  );
}
