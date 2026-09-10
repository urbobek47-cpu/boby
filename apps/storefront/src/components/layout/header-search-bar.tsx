"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HeaderSearchBarInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const paramValue = searchParams?.get("search") || "";
  const [value, setValue] = useState(paramValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(paramValue);
  }, [paramValue]);

  useEffect(() => {
    if (isMobileOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile-Only: Magnifying Glass Icon Button (No background pill) */}
      <div className="sm:hidden flex items-center">
        {!isMobileOpen ? (
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="פתח חיפוש"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-sand transition-colors shrink-0"
          >
            <span className="text-base" aria-hidden="true">🔍</span>
          </button>
        ) : (
          /* Mobile Search Bar Overlay when user taps 🔍 */
          <div className="fixed inset-x-0 top-0 z-50 flex items-center gap-2 bg-surface p-3 shadow-md border-b border-border">
            <form action="/works" method="GET" className="relative flex-1">
              <span
                className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted text-small pointer-events-none z-10"
                aria-hidden="true"
              >
                🔍
              </span>
              <input
                ref={inputRef}
                type="text"
                name="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full rounded-full border border-accent-strong bg-surface ps-9 pe-8 py-2 text-[16px] text-text focus:outline-none ring-2 ring-accent-strong/20"
              />
              {value ? (
                <button
                  type="button"
                  onClick={() => setValue("")}
                  aria-label="נקה חיפוש"
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-stone/50 text-[11px] text-text-muted z-10"
                >
                  ✕
                </button>
              ) : null}
            </form>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="סגור חיפוש"
              className="px-2 py-1 text-small font-medium text-text-muted hover:text-text shrink-0"
            >
              ביטול
            </button>
          </div>
        )}
      </div>

      {/* Desktop (sm:) Search Input Pill */}
      <form action="/works" method="GET" className="hidden sm:relative sm:block sm:w-full">
        <span
          className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted text-small pointer-events-none z-10"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          type="text"
          name="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          className={`w-full rounded-full border ps-10 pe-8 py-2 text-small text-text placeholder:text-text-muted/70 transition-all ${
            isFocused
              ? "border-accent-strong bg-surface outline-none ring-2 ring-accent-strong/20 shadow-sm"
              : "border-stone/60 bg-sand/80 hover:border-stone"
          } caret-accent-strong`}
        />
        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="נקה חיפוש"
            className="absolute end-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-stone/50 text-[11px] text-text-muted hover:bg-stone hover:text-text focus-visible:outline-none z-10"
          >
            ✕
          </button>
        ) : null}
      </form>
    </>
  );
}

export function HeaderSearchBar(props: { placeholder: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-9 w-9 sm:w-full items-center justify-center">
          <span className="text-base sm:hidden">🔍</span>
          <form action="/works" method="GET" className="hidden sm:relative sm:block sm:w-full">
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted text-small pointer-events-none z-10">🔍</span>
            <input type="text" name="search" placeholder={props.placeholder} className="w-full rounded-full border border-stone/60 bg-sand/60 ps-10 pe-8 py-2 text-small text-text" />
          </form>
        </div>
      }
    >
      <HeaderSearchBarInput {...props} />
    </Suspense>
  );
}
