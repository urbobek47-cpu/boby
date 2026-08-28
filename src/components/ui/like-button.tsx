"use client";

import React, { useState, useEffect } from "react";

const STORAGE_KEY = "boby_liked_artworks";

export function getLikedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isSlugLiked(slug: string): boolean {
  return getLikedSlugs().includes(slug);
}

export function toggleSlugLiked(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getLikedSlugs();
    const exists = current.includes(slug);
    const updated = exists ? current.filter((s) => s !== slug) : [...current, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("boby-like-change", { detail: { slug, liked: !exists } }));
    return !exists;
  } catch {
    return false;
  }
}

interface LikeButtonProps {
  slug: string;
  title?: string;
  className?: string;
  variant?: "floating" | "inline";
}

export function LikeButton({ slug, title, className = "", variant = "floating" }: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  useEffect(() => {
    setLiked(isSlugLiked(slug));

    const handleSync = (e: Event) => {
      const customEvt = e as CustomEvent<{ slug: string; liked: boolean }>;
      if (customEvt.detail?.slug === slug) {
        setLiked(customEvt.detail.liked);
      } else {
        setLiked(isSlugLiked(slug));
      }
    };

    window.addEventListener("boby-like-change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("boby-like-change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [slug]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    const newLikedState = toggleSlugLiked(slug);
    setLiked(newLikedState);
    setTimeout(() => setAnimating(false), 300);
  };

  const label = liked
    ? `הסרת ${title || "היצירה"} ממועדפים`
    : `הוספת ${title || "היצירה"} למועדפים`;

  const isFloating = variant === "floating";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      aria-pressed={liked}
      className={`group/like flex ${
        isFloating ? "h-8 w-8 sm:h-9 sm:w-9" : "px-3 py-1.5 h-auto w-auto gap-1.5"
      } items-center justify-center rounded-full bg-surface/95 text-text shadow-md border border-stone/60 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong z-30 ${
        liked ? "border-accent-strong bg-surface" : "hover:border-accent-strong"
      } ${animating ? "scale-125" : ""} ${className}`}
    >
      <svg
        className={`h-4 w-4 transition-all duration-200 ${
          liked
            ? "fill-[#C17F59] stroke-[#8A5335] scale-110"
            : "fill-none stroke-[#111827] group-hover/like:stroke-[#8A5335]"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {!isFloating && (
        <span className="text-caption font-medium text-text">
          {liked ? "אהבתי" : "ללייק"}
        </span>
      )}
    </button>
  );
}
