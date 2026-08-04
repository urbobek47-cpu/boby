"use client";

import React, { useState, useEffect } from "react";
import { useAuth, UserRole, AuthMode } from "./auth-context";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    activeRole,
    setActiveRole,
    activeMode,
    setActiveMode,
    login,
  } = useAuth();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studioName, setStudioName] = useState("");
  const [discipline, setDiscipline] = useState("קרמיקה");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form when modal opens/closes or role changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(false);
    if (!isAuthModalOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setStudioName("");
    }
  }, [isAuthModalOpen, activeRole, activeMode]);

  // Handle ESC key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !email.includes("@")) {
      setError("נא להזין כתובת דוא״ל תקינה");
      return;
    }
    if (!password || password.length < 6) {
      setError("סיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    if (activeMode === "signup") {
      if (!fullName.trim()) {
        setError("נא להזין שם מלא");
        return;
      }
      if (password !== confirmPassword) {
        setError("הסיסמאות אינן תואמות");
        return;
      }
    }

    setIsLoading(true);

    // Simulate network authentication request
    setTimeout(() => {
      setIsLoading(false);
      const role = activeRole || "customer";
      const userName = fullName.trim() || email.split("@")[0];

      login({
        name: userName,
        email: email.trim(),
        role: role,
        studioName: role === "artist" ? studioName || userName : undefined,
        discipline: role === "artist" ? discipline : undefined,
      });

      setSuccessMessage(
        activeMode === "login"
          ? `התחברת בהצלחה כ${role === "artist" ? "אמן/ית" : "לקוח/ה"}!`
          : `הרשמתך כ${role === "artist" ? "אמן/ית" : "לקוח/ה"} הושלמה בהצלחה!`
      );
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop click listener */}
      <div
        className="absolute inset-0"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md rounded-panel border border-border bg-surface p-6 shadow-xl md:p-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="סגירת חלון"
          className="absolute start-4 top-4 rounded-control p-1.5 text-text-muted transition-colors hover:bg-sand hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* STEP 1: Role Selection Screen */}
        {activeRole === null ? (
          <div className="flex flex-col gap-6 pt-2 text-center">
            <div>
              <p className="text-caption font-semibold tracking-wide text-accent-strong uppercase">
                גלריה ושוק לאמנות ישראלית
              </p>
              <h2 id="auth-modal-title" className="mt-1 text-h2 font-medium text-text">
                התחברות ל-BOBY
              </h2>
              <p className="mt-1 text-small text-text-muted">
                בחר את סוג החשבון המבוקש להמשך
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Customer Role Card */}
              <div className="group flex flex-col justify-between rounded-panel border border-border bg-sand/40 p-5 text-start transition-all hover:border-accent-strong hover:bg-sand">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep text-lg text-surface">
                    🛍️
                  </span>
                  <div>
                    <h3 className="text-h3 font-semibold text-text">כניסת לקוח</h3>
                    <p className="mt-1 text-small text-text-muted">
                      לקניית אמנות מקורית, מעקב אחר הזמנות ושמירת פריטים בסל.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole("customer");
                      setActiveMode("login");
                    }}
                    className="flex-1 rounded-control bg-btn-primary px-4 py-2 text-small font-medium text-surface transition-colors hover:bg-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    התחברות לקוח
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole("customer");
                      setActiveMode("signup");
                    }}
                    className="flex-1 rounded-control border border-border bg-surface px-4 py-2 text-small font-medium text-text transition-colors hover:bg-stone/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    הרשמת לקוח
                  </button>
                </div>
              </div>

              {/* Artist Role Card */}
              <div className="group flex flex-col justify-between rounded-panel border border-border bg-sand/40 p-5 text-start transition-all hover:border-accent-strong hover:bg-sand">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-surface">
                    🎨
                  </span>
                  <div>
                    <h3 className="text-h3 font-semibold text-text">כניסת אמן</h3>
                    <p className="mt-1 text-small text-text-muted">
                      לאמנים/ות ישראליים — ניהול גלריה אישית, מוצרים ומכירות.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole("artist");
                      setActiveMode("login");
                    }}
                    className="flex-1 rounded-control bg-btn-primary px-4 py-2 text-small font-medium text-surface transition-colors hover:bg-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    התחברות אמן
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole("artist");
                      setActiveMode("signup");
                    }}
                    className="flex-1 rounded-control border border-border bg-surface px-4 py-2 text-small font-medium text-text transition-colors hover:bg-stone/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    הרשמת אמן
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: Interactive Form Screen */
          <div className="flex flex-col gap-5 pt-1">
            {/* Navigation & Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <button
                type="button"
                onClick={() => setActiveRole(null)}
                className="flex items-center gap-1 text-small font-medium text-accent-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong rounded-control px-1"
              >
                <span>← חזרה לבחירה</span>
              </button>

              <span
                className={`rounded-full px-3 py-1 text-caption font-semibold ${
                  activeRole === "artist"
                    ? "bg-sand text-accent-strong"
                    : "bg-stone/50 text-text"
                }`}
              >
                {activeRole === "artist" ? "🎨 כניסת אמן" : "🛍️ כניסת לקוח"}
              </span>
            </div>

            {/* Title & Mode Switcher */}
            <div>
              <h2 id="auth-modal-title" className="text-h2 font-medium text-text">
                {activeMode === "login"
                  ? activeRole === "artist"
                    ? "התחברות לסטודיו אמן"
                    : "התחברות לחשבון"
                  : activeRole === "artist"
                  ? "הרשמת אמן/ית חדש/ה"
                  : "הרשמת לקוח/ה חדש/ה"}
              </h2>

              {/* Mode Toggle Tabs */}
              <div className="mt-3 flex rounded-control bg-stone/30 p-1">
                <button
                  type="button"
                  onClick={() => setActiveMode("login")}
                  className={`flex-1 rounded-card py-1.5 text-small font-medium transition-all ${
                    activeMode === "login"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  התחברות
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("signup")}
                  className={`flex-1 rounded-card py-1.5 text-small font-medium transition-all ${
                    activeMode === "signup"
                      ? "bg-surface text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  הרשמה
                </button>
              </div>
            </div>

            {/* Error & Success Feedback */}
            {error && (
              <div
                role="alert"
                className="rounded-card border border-error/30 bg-error/10 p-3 text-small text-error"
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="rounded-card border border-success/30 bg-success/10 p-3 text-small text-success font-medium"
              >
                {successMessage}
              </div>
            )}

            {/* Form Component */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name (on Signup) */}
              {activeMode === "signup" && (
                <div>
                  <label
                    htmlFor="auth-fullname"
                    className="block mb-1 text-small font-medium text-text"
                  >
                    {activeRole === "artist" ? "שם מלא / שם הסטודיו" : "שם מלא"}
                  </label>
                  <input
                    id="auth-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      activeRole === "artist"
                        ? "לדוגמה: נועה ברק — קרמיקה"
                        : "לדוגמה: ישראל ישראלי"
                    }
                    className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none focus:ring-1 focus:ring-accent-strong"
                  />
                </div>
              )}

              {/* Artist Medium/Discipline (on Artist Signup) */}
              {activeMode === "signup" && activeRole === "artist" && (
                <div>
                  <label
                    htmlFor="auth-discipline"
                    className="block mb-1 text-small font-medium text-text"
                  >
                    תחום יצירה עיקרי
                  </label>
                  <select
                    id="auth-discipline"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none focus:ring-1 focus:ring-accent-strong"
                  >
                    <option value="קרמיקה">קרמיקה וקדרות</option>
                    <option value="הדפס ואיור">הדפס, איור וציור</option>
                    <option value="עץ וטקסטיל">עיבוד עץ וטקסטיל</option>
                    <option value="צורפות ותכשיטים">צורפות ותכשיטים</option>
                    <option value="זכוכית ומתכת">זכוכית ומתכת</option>
                  </select>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label
                  htmlFor="auth-email"
                  className="block mb-1 text-small font-medium text-text"
                >
                  כתובת דוא״ל
                </label>
                <input
                  id="auth-email"
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none focus:ring-1 focus:ring-accent-strong"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="auth-password"
                  className="block mb-1 text-small font-medium text-text"
                >
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 pe-10 text-body placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none focus:ring-1 focus:ring-accent-strong"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "הסתרת סיסמה" : "הצגת סיסמה"}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              {/* Confirm Password (on Signup) */}
              {activeMode === "signup" && (
                <div>
                  <label
                    htmlFor="auth-confirm-password"
                    className="block mb-1 text-small font-medium text-text"
                  >
                    אימות סיסמה
                  </label>
                  <input
                    id="auth-confirm-password"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none focus:ring-1 focus:ring-accent-strong"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 min-h-11 w-full rounded-control bg-btn-primary px-4 py-2.5 text-body font-medium text-surface transition-colors hover:bg-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50"
              >
                {isLoading
                  ? "מתחבר..."
                  : activeMode === "login"
                  ? `התחברות כ${activeRole === "artist" ? "אמן" : "לקוח"}`
                  : `הרשמה כ${activeRole === "artist" ? "אמן" : "לקוח"}`}
              </button>
            </form>

            {/* Modal Footer Link */}
            <div className="mt-2 text-center text-small text-text-muted">
              {activeMode === "login" ? (
                <p>
                  עוד לא רשום?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveMode("signup")}
                    className="font-medium text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none"
                  >
                    הירשם כאן
                  </button>
                </p>
              ) : (
                <p>
                  כבר יש לך חשבון?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveMode("login")}
                    className="font-medium text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none"
                  >
                    התחבר כאן
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
