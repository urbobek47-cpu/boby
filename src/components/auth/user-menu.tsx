"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./auth-context";
import { UploadArtworkModal } from "@/components/artwork/upload-artwork-modal";

export function UserMenu() {
  const { user, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={() => openAuthModal(null, "login")}
          className="rounded-control px-2 py-1 text-small font-medium text-text transition-colors hover:text-accent-strong focus-visible:outline-none"
        >
          התחברות
        </button>
        <span className="hidden sm:inline text-text-muted/40" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          onClick={() => openAuthModal(null, "signup")}
          className="hidden sm:inline-block rounded-control px-2 py-1 text-small font-medium text-accent-strong transition-colors hover:underline focus-visible:outline-none"
        >
          הרשמה
        </button>
      </div>
    );
  }

  const isArtist = user.role === "artist";

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Prominent Upload Artwork button for artists */}
        {isArtist && (
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 rounded-control bg-accent px-3 py-1.5 text-small font-medium text-surface shadow-sm transition-colors hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <span>✨</span>
            <span>להעלות יצירה</span>
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label={`תפריט משתמש — ${user.name}`}
            className="flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-1.5 text-small font-medium text-text transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-caption font-semibold ${
                isArtist ? "bg-accent text-surface" : "bg-deep text-surface"
              }`}
              aria-hidden="true"
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="max-w-[120px] truncate">
              <bdi>{user.name}</bdi>
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-caption font-medium ${
                isArtist ? "bg-sand text-accent-strong" : "bg-stone/50 text-text-muted"
              }`}
            >
              {isArtist ? "אמן" : "לקוח"}
            </span>
            <svg
              className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute end-0 mt-2 w-56 rounded-panel border border-border bg-surface p-2 shadow-md z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="border-b border-border px-3 py-2 text-start">
                <p className="text-caption text-text-muted font-medium">מחובר כ{isArtist ? "אמן/ית" : "לקוח/ה"}</p>
                <p className="text-small font-semibold text-text truncate">
                  <bdi>{user.name}</bdi>
                </p>
                <p className="text-caption text-text-muted truncate" dir="ltr">
                  {user.email}
                </p>
              </div>

              <div className="py-1">
                {isArtist ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-card px-3 py-2 text-start text-caption text-accent-strong font-semibold bg-sand/80 hover:bg-sand transition-colors my-1"
                  >
                    <span>✨</span>
                    <span>להעלות יצירה חדשה</span>
                  </button>
                ) : (
                  <div className="px-3 py-2 text-caption text-text-muted font-medium bg-sand/40 rounded-card my-1">
                    🛍️ אזור לקוח — ההזמנות והפריטים שלי
                  </div>
                )}
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-card px-3 py-2 text-start text-small text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                התנתקות
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Artwork Modal */}
      <UploadArtworkModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
