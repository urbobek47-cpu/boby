"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestoration() {
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isFeedPage = pathname === "/" || pathname?.endsWith("/works");
    if (!isFeedPage) return;

    // Debounce sessionStorage writes (150ms) so they execute only when scrolling pauses,
    // saving 99.9% of synchronous main-thread I/O calls during active 60/120Hz scrolling.
    const saveScrollPosition = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("boby_feed_scroll_" + pathname, window.scrollY.toString());
      }
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(saveScrollPosition, 150);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveScrollPosition();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      saveScrollPosition();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  useEffect(() => {
    const isFeedPage = pathname === "/" || pathname?.endsWith("/works");
    if (isFeedPage && typeof window !== "undefined") {
      const saved = sessionStorage.getItem("boby_feed_scroll_" + pathname);
      if (saved) {
        const y = parseInt(saved, 10);
        if (!isNaN(y) && y > 0) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
          });
        }
      }
    }
  }, [pathname]);

  return null;
}
