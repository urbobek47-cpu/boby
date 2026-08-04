"use client";

import React, { useState, useEffect, useRef } from "react";

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [contrast, setContrast] = useState<"normal" | "high" | "grayscale">("normal");
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Load accessibility settings on mount
  useEffect(() => {
    try {
      const savedTextSize = localStorage.getItem("boby_a11y_text_size");
      const savedContrast = localStorage.getItem("boby_a11y_contrast");
      const savedLinks = localStorage.getItem("boby_a11y_links") === "true";
      const savedFont = localStorage.getItem("boby_a11y_font") === "true";

      if (savedTextSize) setTextSize(savedTextSize as any);
      if (savedContrast) setContrast(savedContrast as any);
      if (savedLinks) setHighlightLinks(savedLinks);
      if (savedFont) setReadableFont(savedFont);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Apply DOM classes and attributes
  useEffect(() => {
    const root = document.documentElement;

    // Text size
    root.classList.remove("a11y-text-large", "a11y-text-xlarge");
    if (textSize === "large") root.classList.add("a11y-text-large");
    if (textSize === "xlarge") root.classList.add("a11y-text-xlarge");

    // Contrast
    root.classList.remove("a11y-high-contrast", "a11y-grayscale");
    if (contrast === "high") root.classList.add("a11y-high-contrast");
    if (contrast === "grayscale") root.classList.add("a11y-grayscale");

    // Links
    if (highlightLinks) {
      root.classList.add("a11y-highlight-links");
    } else {
      root.classList.remove("a11y-highlight-links");
    }

    // Readable Font
    if (readableFont) {
      root.classList.add("a11y-readable-font");
    } else {
      root.classList.remove("a11y-readable-font");
    }

    // Save settings
    try {
      localStorage.setItem("boby_a11y_text_size", textSize);
      localStorage.setItem("boby_a11y_contrast", contrast);
      localStorage.setItem("boby_a11y_links", String(highlightLinks));
      localStorage.setItem("boby_a11y_font", String(readableFont));
    } catch {
      // Ignore storage errors
    }
  }, [textSize, contrast, highlightLinks, readableFont]);

  // Click outside & ESC listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleReset = () => {
    setTextSize("normal");
    setContrast("normal");
    setHighlightLinks(false);
    setReadableFont(false);
  };

  return (
    <div className="fixed bottom-6 start-6 z-50" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="תפריט נגישות והתאמות קריאה"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-deep text-surface shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-strong"
      >
        <span className="text-xl" aria-hidden="true">
          ♿
        </span>
      </button>

      {/* Accessibility Control Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="התאמות נגישות"
          className="absolute bottom-16 start-0 w-80 max-w-[calc(100vw-3rem)] rounded-panel border border-border bg-surface p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">♿</span>
              <h2 className="text-small font-bold text-text">התאמות נגישות באתר</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="סגירת תפריט נגישות"
              className="rounded-control p-1 text-text-muted hover:bg-sand hover:text-text"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-4 text-small">
            {/* Control 1: Text Size */}
            <div>
              <span className="block mb-1.5 font-medium text-text">גודל טקסט</span>
              <div className="grid grid-cols-3 gap-1.5 rounded-control bg-sand/50 p-1">
                <button
                  type="button"
                  onClick={() => setTextSize("normal")}
                  className={`rounded-card py-1.5 text-caption font-medium transition-all ${
                    textSize === "normal"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  רגיל
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize("large")}
                  className={`rounded-card py-1.5 text-caption font-medium transition-all ${
                    textSize === "large"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  מוגדל
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize("xlarge")}
                  className={`rounded-card py-1.5 text-caption font-medium transition-all ${
                    textSize === "xlarge"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  גדול מאוד
                </button>
              </div>
            </div>

            {/* Control 2: Contrast */}
            <div>
              <span className="block mb-1.5 font-medium text-text">ניגודיות צבעים</span>
              <div className="grid grid-cols-3 gap-1.5 rounded-control bg-sand/50 p-1">
                <button
                  type="button"
                  onClick={() => setContrast("normal")}
                  className={`rounded-card py-1.5 text-caption font-medium transition-all ${
                    contrast === "normal"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  רגיל
                </button>
                <button
                  type="button"
                  onClick={() => setContrast("high")}
                  className={`rounded-card py-1.5 text-caption font-medium transition-all ${
                    contrast === "high"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  גבוהה
                </button>
                <button
                  type="button"
                  onClick={() => setContrast("grayscale")}
                  className={`rounded-card py-1.5 text-caption font-medium transition-all ${
                    contrast === "grayscale"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  גווני אפור
                </button>
              </div>
            </div>

            {/* Control 3: Highlight Links */}
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-text">הדגשת קישורים</span>
              <button
                type="button"
                role="switch"
                aria-checked={highlightLinks}
                onClick={() => setHighlightLinks(!highlightLinks)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highlightLinks ? "bg-accent-strong" : "bg-stone"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-surface transition-transform ${
                    highlightLinks ? "translate-x-1.5" : "-translate-x-5"
                  }`}
                />
              </button>
            </div>

            {/* Control 4: Readable Font */}
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-text">פונט קריא ופשוט</span>
              <button
                type="button"
                role="switch"
                aria-checked={readableFont}
                onClick={() => setReadableFont(!readableFont)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  readableFont ? "bg-accent-strong" : "bg-stone"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-surface transition-transform ${
                    readableFont ? "translate-x-1.5" : "-translate-x-5"
                  }`}
                />
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 w-full rounded-control border border-border px-3 py-2 text-caption font-medium text-text-muted transition-colors hover:bg-sand hover:text-text"
            >
              🔄 איפוס כל ההגדרות
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
