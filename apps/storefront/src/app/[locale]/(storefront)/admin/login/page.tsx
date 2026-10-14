"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@boby.co.il");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.reason || "פרטי ההתחברות אינם תקינים");
      }

      // Redirect to main admin dashboard page upon success
      router.push("/admin");
    } catch (err: any) {
      console.error("[Admin Login Submit Error]", err);
      setErrorMsg(err.message || "אירעה שגיאה בהתחברות למערכת הניהול");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-panel border border-border bg-surface p-8 shadow-md flex flex-col gap-6">
        <div className="text-center flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-deep text-surface text-2xl mb-3 shadow-xs">
            🛡️
          </span>
          <h1 className="text-h2 font-medium text-text">כניסה לפאנל הניהול — BOBY Admin</h1>
          <p className="mt-1 text-small text-text-muted">
            כניסה מוגנת ומאובטחת למנהלי המערכת בלבד.
          </p>
        </div>

        {errorMsg && (
          <div role="alert" className="rounded-card bg-error/10 border border-error/30 p-3.5 text-small text-error font-medium text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block mb-1 text-small font-medium text-text">
              כתובת דוא״ל של המנהל
            </label>
            <input
              id="admin-email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@boby.co.il"
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block mb-1 text-small font-medium text-text">
              סיסמת ניהול / מפתח אבטחה
            </label>
            <input
              id="admin-password"
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 min-h-11 w-full rounded-control bg-btn-primary px-5 text-small font-medium text-surface hover:bg-deep/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "מתחבר למערכת..." : "התחברות כמנהל ראשי ←"}
          </button>
        </form>
      </div>
    </main>
  );
}
