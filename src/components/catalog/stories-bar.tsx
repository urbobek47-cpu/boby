"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";

interface StorySlide {
  id: number;
  eyebrow: string;
  title: string;
  text: string;
  bgGradient: string;
  icon: string;
}

const STORY_SLIDES: StorySlide[] = [
  {
    id: 1,
    eyebrow: "החזון שלנו · BOBY",
    title: "מאחורי כל יצירה יש ידיים, נשמה וסיפור.",
    text: "BOBY נולדה מתוך רצון לתת מקום אמיתי לאמנים, מעצבים ויוצרים עצמאיים בישראל. אנחנו מאמינים שאמנות מקורית מביאה חום ונשמה לבית.",
    bgGradient: "from-[#2A211E] via-[#3D2F2B] to-[#111827]",
    icon: "✨",
  },
  {
    id: 2,
    eyebrow: "מלאכת יד מקורית",
    title: "אחד מתוך אחד. בדיוק כמו שזה צריך להיות.",
    text: "אצלנו לא תמצאו מוצרים מפס ייצור תעשייתי. כל פריט ב-BOBY הוא יחיד במינו ונעשה בעבודת יד מוקפדת בסטודיו של היוצר.",
    bgGradient: "from-[#8A5335] via-[#A0623D] to-[#2A211E]",
    icon: "🏺",
  },
  {
    id: 3,
    eyebrow: "קהילה ישראלית יוצרת",
    title: "פלטפורמה ששמה את היוצר במרכז.",
    text: "כשאתם קונים ב-BOBY, אתם תומכים ישירות ביצירה מקומית ויודעים בדיוק ממי קניתם ומה הסיפור שלו.",
    bgGradient: "from-[#C17F59] via-[#8A5335] to-[#2A211E]",
    icon: "🎨",
  },
  {
    id: 4,
    eyebrow: "הצטרפו למסע",
    title: "מוכנים לגלות את היצירה הבאה שלכם?",
    text: "העיפו מבט בגלריה שלנו או הצטרפו אלינו כיוצרים עצמאיים בקהילת האמנים של BOBY.",
    bgGradient: "from-[#2A211E] via-[#111827] to-[#0A0D14]",
    icon: "🌟",
  },
];

export function StoriesBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { openAuthModal } = useAuth();

  const activeSlide = STORY_SLIDES[activeSlideIndex];

  // Auto-advance timer (5 seconds per slide)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => {
        if (prev < STORY_SLIDES.length - 1) {
          return prev + 1;
        } else {
          setIsOpen(false);
          return 0;
        }
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isOpen, activeSlideIndex]);

  // Keyboard navigation & ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowLeft") {
        // RTL: Left is forward
        handleNext();
      } else if (e.key === "ArrowRight") {
        // RTL: Right is back
        handlePrev();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeSlideIndex]);

  const handleNext = () => {
    if (activeSlideIndex < STORY_SLIDES.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      {/* Top Stories Row (Instagram-style) */}
      <div className="flex items-center gap-4 overflow-x-auto py-3 px-1 no-scrollbar">
        {/* Story Avatar Trigger: Our Story */}
        <button
          type="button"
          onClick={() => {
            setActiveSlideIndex(0);
            setIsOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 shrink-0 focus-visible:outline-none"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#C17F59] via-[#8A5335] to-[#2A211E] p-0.5 shadow-md transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-surface border-2 border-surface">
              <span className="text-2xl">🎨</span>
            </div>
          </div>
          <span className="text-caption font-semibold text-text group-hover:text-accent-strong">
            הסיפור שלנו
          </span>
        </button>

        {/* Story Avatar Trigger 2: Noa Barak */}
        <button
          type="button"
          onClick={() => {
            setActiveSlideIndex(1);
            setIsOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 shrink-0 focus-visible:outline-none"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#C17F59] to-[#D7D2CB] p-0.5 shadow-sm transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-sand border-2 border-surface text-caption font-bold text-text">
              נועה
            </div>
          </div>
          <span className="text-caption text-text-muted group-hover:text-text">
            <bdi>נועה ברק</bdi>
          </span>
        </button>

        {/* Story Avatar Trigger 3: Yael Druk */}
        <button
          type="button"
          onClick={() => {
            setActiveSlideIndex(2);
            setIsOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 shrink-0 focus-visible:outline-none"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#8A5335] to-[#D7D2CB] p-0.5 shadow-sm transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-sand border-2 border-surface text-caption font-bold text-text">
              יעל
            </div>
          </div>
          <span className="text-caption text-text-muted group-hover:text-text">
            <bdi>יעל דרוק</bdi>
          </span>
        </button>

        {/* Story Avatar Trigger 4: Dan Avidan */}
        <button
          type="button"
          onClick={() => {
            setActiveSlideIndex(3);
            setIsOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 shrink-0 focus-visible:outline-none"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#2A211E] to-[#D7D2CB] p-0.5 shadow-sm transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-sand border-2 border-surface text-caption font-bold text-text">
              דן
            </div>
          </div>
          <span className="text-caption text-text-muted group-hover:text-text">
            <bdi>דן אבידן</bdi>
          </span>
        </button>
      </div>

      {/* Full-Screen Instagram Story Viewer Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="הסיפור של BOBY"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          {/* Story Card Container */}
          <div
            className={`relative flex h-[85vh] w-full max-w-md flex-col justify-between overflow-hidden rounded-panel bg-gradient-to-b ${activeSlide.bgGradient} p-6 text-surface shadow-2xl animate-in zoom-in-95 duration-200`}
          >
            {/* Top Progress Bars */}
            <div className="flex gap-1.5 z-20">
              {STORY_SLIDES.map((slide, idx) => (
                <div key={slide.id} className="h-1 flex-1 overflow-hidden rounded-full bg-surface/30">
                  <div
                    className={`h-full bg-surface transition-all duration-300 ${
                      idx < activeSlideIndex
                        ? "w-full"
                        : idx === activeSlideIndex
                        ? "w-full animate-pulse"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Header Info & Close */}
            <div className="mt-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/20 text-small">
                  {activeSlide.icon}
                </span>
                <span className="text-small font-semibold text-surface">
                  <bdi>BOBY</bdi>
                </span>
                <span className="text-caption text-surface/70">· הסיפור שלנו</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="סגירת סטורי"
                className="rounded-full bg-surface/20 p-1.5 text-surface transition-colors hover:bg-surface/30"
              >
                ✕
              </button>
            </div>

            {/* Tap Navigation Zones (Left / Right) */}
            <div className="absolute inset-0 z-10 flex">
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={handlePrev}
                title="הקודם"
              />
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={handleNext}
                title="הבא"
              />
            </div>

            {/* Main Content Body */}
            <div className="relative z-20 my-auto flex flex-col items-start gap-4 pt-12 text-start">
              <span className="rounded-full bg-accent/30 border border-accent/40 px-3 py-1 text-caption font-semibold tracking-wide text-surface">
                {activeSlide.eyebrow}
              </span>
              <h2 className="text-[length:var(--text-h1)] font-medium leading-tight font-serif text-surface md:text-[2.25rem]">
                {activeSlide.title}
              </h2>
              <p className="text-body leading-relaxed text-surface/90">
                {activeSlide.text}
              </p>
            </div>

            {/* Action Buttons on Final Slide */}
            <div className="relative z-20 mt-auto flex flex-col gap-2.5 pt-4">
              {activeSlideIndex === STORY_SLIDES.length - 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-control bg-surface px-4 py-3 text-body font-medium text-[#111827] shadow-lg transition-colors hover:bg-sand"
                  >
                    להתחלת גלילה בחנות ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal("artist", "signup");
                    }}
                    className="w-full rounded-control border border-surface/40 bg-surface/10 px-4 py-2.5 text-small font-medium text-surface backdrop-blur-sm transition-colors hover:bg-surface/20"
                  >
                    יוצרים בעצמכם? הצטרפו כאמנים 🎨
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between text-caption text-surface/70 px-1">
                  <span>לחץ בצדדים להעברה בין השקופיות</span>
                  <span>{activeSlideIndex + 1} / {STORY_SLIDES.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
