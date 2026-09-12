"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { Link } from "@/i18n/navigation";
import { getLikedSlugs } from "@/components/ui/like-button";
import { listArtworks } from "@/lib/catalog/data";
import type { Artwork } from "@/lib/catalog/types";
import { ArtworkCard } from "@/components/catalog/artwork-card";

export function AccountView() {
  const { user, openAuthModal, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "saved" | "artworks">("profile");

  // Profile Edit Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [studioName, setStudioName] = useState(user?.studioName || "");
  const [discipline, setDiscipline] = useState(user?.discipline || "קרמיקה");
  const [isSaved, setIsSaved] = useState(false);

  // Saved / Liked Artworks State
  const [likedArtworks, setLikedArtworks] = useState<Artwork[]>([]);
  const [customArtworks, setCustomArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setStudioName(user.studioName || "");
      setDiscipline(user.discipline || "קרמיקה");
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      const all = await listArtworks();
      const likedSlugs = getLikedSlugs();
      setLikedArtworks(all.filter((a) => likedSlugs.includes(a.slug)));

      try {
        const storedCustom: Artwork[] = JSON.parse(localStorage.getItem("boby_custom_artworks") || "[]");
        setCustomArtworks(storedCustom);
      } catch {
        setCustomArtworks([]);
      }
    }
    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl rounded-panel border border-border bg-sand/30 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-deep text-xl text-surface mx-auto mb-4">
          🔒
        </span>
        <h1 className="text-h2 font-medium text-text">אזור אישי — התחברות לחשבון</h1>
        <p className="mt-2 text-small text-text-muted">
          כדי לצפות בפרופיל האישי, היצירות השמורות והגדרות החשבון, נא להתחבר למערכת.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal(null, "login")}
            className="rounded-control bg-btn-primary px-5 py-2.5 text-small font-medium text-surface hover:bg-deep/90 transition-colors"
          >
            התחברות לחשבון
          </button>
          <button
            type="button"
            onClick={() => openAuthModal(null, "signup")}
            className="rounded-control border border-border bg-surface px-5 py-2.5 text-small font-medium text-text hover:bg-stone/50 transition-colors"
          >
            הרשמת לקוח / אמן
          </button>
        </div>
      </div>
    );
  }

  const isArtist = user.role === "artist";

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      ...user,
      name: name.trim(),
      phone: phone.trim(),
      studioName: isArtist ? studioName.trim() : undefined,
      discipline: isArtist ? discipline : undefined,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8">
      {/* User Header Profile Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-panel border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-h2 font-bold text-surface ${
              isArtist ? "bg-accent" : "bg-deep"
            }`}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h2 font-medium text-text">
                <bdi>{user.name}</bdi>
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${
                  isArtist ? "bg-sand text-accent-strong" : "bg-stone/50 text-text-muted"
                }`}
              >
                {isArtist ? "🎨 אמן/ית רשום/ה" : "🛍️ לקוח/ה"}
              </span>
            </div>
            <p className="text-small text-text-muted" dir="ltr">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isArtist && (
            <Link
              href="/he/upload"
              className="flex items-center gap-1.5 rounded-control bg-accent px-4 py-2 text-small font-medium text-surface hover:bg-accent-strong transition-colors"
            >
              <span>✨</span>
              <span>להעלות יצירה חדשה</span>
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="rounded-control border border-border bg-sand/50 px-3.5 py-2 text-small font-medium text-error hover:bg-error/10 transition-colors"
          >
            התנתקות
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 text-small font-medium transition-colors border-b-2 ${
            activeTab === "profile"
              ? "border-accent-strong text-accent-strong font-semibold"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          👤 פרטים אישיים והגדרות
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={`pb-3 px-4 text-small font-medium transition-colors border-b-2 ${
            activeTab === "saved"
              ? "border-accent-strong text-accent-strong font-semibold"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          ❤️ יצירות שמורות ({likedArtworks.length})
        </button>

        {isArtist && (
          <button
            type="button"
            onClick={() => setActiveTab("artworks")}
            className={`pb-3 px-4 text-small font-medium transition-colors border-b-2 ${
              activeTab === "artworks"
                ? "border-accent-strong text-accent-strong font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            🎨 היצירות שלי בגלריה ({customArtworks.length})
          </button>
        )}
      </div>

      {/* TAB 1: Profile Details */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="rounded-panel border border-border bg-surface p-6 flex flex-col gap-6 shadow-sm">
          <h2 className="text-h3 font-medium text-text border-b border-border pb-3">
            עדכון פרטי פרופיל
          </h2>

          {isSaved && (
            <div role="status" className="rounded-card bg-success/10 border border-success/30 p-3 text-small text-success font-medium">
              ✓ הפרטים עודכנו בהצלחה!
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="acc-name" className="block mb-1 text-small font-medium text-text">
                שם מלא
              </label>
              <input
                id="acc-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="acc-email" className="block mb-1 text-small font-medium text-text">
                כתובת דוא״ל (קריאה בלבד)
              </label>
              <input
                id="acc-email"
                type="email"
                disabled
                dir="ltr"
                value={user.email}
                className="min-h-11 w-full rounded-control border border-border bg-sand/50 px-3.5 text-body text-text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="acc-phone" className="block mb-1 text-small font-medium text-text">
                מספר טלפון לתיאום
              </label>
              <input
                id="acc-phone"
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>

            {isArtist && (
              <>
                <div>
                  <label htmlFor="acc-studio" className="block mb-1 text-small font-medium text-text">
                    שם הסטודיו / המותג
                  </label>
                  <input
                    id="acc-studio"
                    type="text"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="acc-discipline" className="block mb-1 text-small font-medium text-text">
                    תחום יצירה עיקרי
                  </label>
                  <select
                    id="acc-discipline"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
                  >
                    <option value="קרמיקה">קרמיקה וקדרות</option>
                    <option value="הדפס ואיור">הדפס, איור וציור</option>
                    <option value="עץ וטקסטיל">עיבוד עץ וטקסטיל</option>
                    <option value="צורפות ותכשיטים">צורפות ותכשיטים</option>
                    <option value="זכוכית ומתכת">זכוכית ומתכת</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-control bg-btn-primary px-6 py-2.5 text-small font-medium text-surface hover:bg-deep/90 transition-colors"
            >
              שמירת שינויים
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Saved / Liked Artworks */}
      {activeTab === "saved" && (
        <div className="flex flex-col gap-4">
          {likedArtworks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {likedArtworks.map((art) => (
                <ArtworkCard key={art.slug} artwork={art} />
              ))}
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-sand/30 p-8 text-center">
              <p className="text-h3 font-medium text-text">עדיין לא שמרת יצירות במועדפים</p>
              <p className="mt-1 text-small text-text-muted">
                לחץ על האייקון ❤️ שעל גבי היצירות בגלריה כדי לשמור אותן לצפייה מהירה כאן.
              </p>
              <Link
                href="/works"
                className="mt-4 inline-block rounded-control bg-btn-primary px-5 py-2 text-small font-medium text-surface hover:bg-deep/90 transition-colors"
              >
                עבור לגלריית היצירות ←
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Artist Uploaded Artworks */}
      {isArtist && activeTab === "artworks" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-small font-medium text-text-muted">
              יצירות שהעלת לגלריה בשימוש אחסון מקומי
            </p>
            <Link
              href="/he/upload"
              className="rounded-control bg-accent px-4 py-2 text-small font-medium text-surface hover:bg-accent-strong transition-colors"
            >
              + להעלות יצירה חדשה
            </Link>
          </div>

          {customArtworks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {customArtworks.map((art) => (
                <ArtworkCard key={art.slug} artwork={art} />
              ))}
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-sand/30 p-8 text-center">
              <p className="text-h3 font-medium text-text">עדיין לא העלת יצירות לגלריה</p>
              <p className="mt-1 text-small text-text-muted">
                כאמן/ית רשום/ה ב-BOBY, תוכל להעלות יצירות מקוריות עם תמונות וסיפור הסטודיו.
              </p>
              <Link
                href="/he/upload"
                className="mt-4 inline-block rounded-control bg-accent px-5 py-2 text-small font-medium text-surface hover:bg-accent-strong transition-colors"
              >
                להעלות יצירה ראשונה ✨
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
