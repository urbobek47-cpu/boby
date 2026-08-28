"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HeaderSearchBarInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const paramValue = searchParams?.get("search") || "";
  const [value, setValue] = useState(paramValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(paramValue);
  }, [paramValue]);

  return (
    <form
      action="/works"
      method="GET"
      className="relative w-full"
    >
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
        className={`w-full rounded-full border bg-sand/60 ps-8 pe-8 py-1.5 text-[16px] leading-normal text-text placeholder:text-text-muted/70 transition-all sm:ps-10 sm:pe-4 sm:py-2 sm:text-small ${
          isFocused
            ? "border-accent-strong bg-surface outline-none ring-2 ring-accent-strong/20 shadow-sm"
            : "border-stone/60 hover:border-stone"
        } caret-accent-strong`}
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="נקה חיפוש"
          className="absolute end-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-stone/50 text-[11px] text-text-muted hover:bg-stone hover:text-text focus-visible:outline-none z-10"
        >
          ✕
        </button>
      ) : null}
    </form>
  );
}

export function HeaderSearchBar(props: { placeholder: string }) {
  return (
    <Suspense
      fallback={
        <form action="/works" method="GET" className="relative w-full">
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted text-small pointer-events-none z-10">🔍</span>
          <input type="text" name="search" placeholder={props.placeholder} className="w-full rounded-full border border-stone/60 bg-sand/60 ps-8 pe-8 py-1.5 text-[16px] text-text sm:ps-10 sm:pe-4 sm:py-2 sm:text-small" />
        </form>
      }
    >
      <HeaderSearchBarInput {...props} />
    </Suspense>
  );
}
