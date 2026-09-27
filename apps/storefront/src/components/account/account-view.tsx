"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { Link, useRouter } from "@/i18n/navigation";
import { getLikedSlugs } from "@/components/ui/like-button";
import { listArtworks, removeCustomArtwork, updateCustomArtwork } from "@/lib/catalog/data";
import type { Artwork } from "@/lib/catalog/types";
import { ArtworkCard } from "@/components/catalog/artwork-card";
import { EditArtworkModal } from "@/components/artwork/edit-artwork-modal";
import { buildCloudinaryUrl } from "@/lib/cloudinary";
import { isValidIsraeliPhone, normalizeIsraeliPhone } from "@/lib/phone";

export function AccountView() {
  const { user, openAuthModal, login, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "saved" | "artworks">("profile");

  // Profile Edit Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [studioName, setStudioName] = useState(user?.studioName || "");
  const [discipline, setDiscipline] = useState(user?.discipline || "קרמיקה");
  const [isSaved, setIsSaved] = useState(false);

  // Saved / Liked Artworks State
  const [likedArtworks, setLikedArtworks] = useState<Artwork[]>([]);
  
  // Artist Owned Artworks State
  const [myArtworks, setMyArtworks] = useState<Artwork[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setStudioName(user.studioName || "");
      setDiscipline(user.discipline || "קרמיקה");
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const all = await listArtworks();

    // 1. Liked artworks
    const likedSlugs = getLikedSlugs();
    setLikedArtworks(all.filter((a) => likedSlugs.includes(a.slug)));

    // 2. User owned artworks (Strict ownership filter: artist.slug matching user email or email prefix)
    const userEmailClean = user.email.toLowerCase();
    const userPrefix = user.email.split("@")[0].toLowerCase();

    const owned = all.filter((art) => {
      const artArtistSlug = (art.artist?.slug || "").toLowerCase();
      // Only include user-created custom artworks matching logged-in user identifier
      return artArtistSlug === userEmailClean || artArtistSlug === userPrefix;
    });

    setMyArtworks(owned);
  };

  useEffect(() => {
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
    setActionError(null);

    let formattedPhone = phone.trim();
    if (formattedPhone) {
      if (!isValidIsraeliPhone(formattedPhone)) {
        setActionError("מספר טלפון אינו תקין. נא להזין מספר טלפון ישראלי תקין (למשל: 050-1234567)");
        return;
      }
      formattedPhone = normalizeIsraeliPhone(formattedPhone);
      setPhone(formattedPhone);
    }

    login({
      ...user,
      name: name.trim(),
      phone: formattedPhone || undefined,
      studioName: isArtist ? studioName.trim() : undefined,
      discipline: isArtist ? discipline : undefined,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Delete Artwork Handler
  const handleDeleteArtwork = async (slug: string) => {
    setActionError(null);
    setActionSuccess(null);

    let decodedSlug = slug;
    try { decodedSlug = decodeURIComponent(slug); } catch {}

    const target = myArtworks.find(
      (a) => a.slug === slug || a.slug === decodedSlug || decodeURIComponent(a.slug) === decodedSlug
    );
    const titleText = target?.title?.he || target?.title?.en || slug;

    const confirmed = window.confirm(`האם למחוק לצמיתות את היצירה "${titleText}"? הפעולה אינה ניתנת לבטול.`);
    if (!confirmed) return;

    setDeletingSlug(slug);

    try {
      const res = await fetch("/api/artworks/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, userEmail: user.email }),
      });

      const data = await res.json();

      if (res.status === 403) {
        throw new Error(data.reason || "אינך מורשה למחוק יצירה זו");
      }

      const isSuccessfulDelete = res.ok || data.success || data.alreadyDeleted || res.status === 404;

      if (!isSuccessfulDelete) {
        throw new Error(data.reason || "נכשלה מחיקת היצירה");
      }

      // Immediately remove item from client state using URL-decoded robust matching
      setMyArtworks((prev) =>
        prev.filter((a) => {
          let aDecoded = a.slug;
          try { aDecoded = decodeURIComponent(a.slug); } catch {}
          return (
            a.slug !== slug &&
            a.slug !== decodedSlug &&
            aDecoded !== slug &&
            aDecoded !== decodedSlug
          );
        })
      );

      // Purge from client memory and localStorage
      removeCustomArtwork(slug);
      removeCustomArtwork(decodedSlug);

      // Refresh router cache
      router.refresh();

      setActionSuccess(`היצירה "${titleText}" נמחקה בהצלחה מהמערכת.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setActionError(err?.message || "אירעה שגיאה בביצוע המחיקה");
    } finally {
      setDeletingSlug(null);
    }
  };


  // Save Edit Handler
  const handleSaveEdit = async (updated: Artwork) => {
    setActionError(null);
    setActionSuccess(null);

    const res = await fetch("/api/artworks/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artwork: updated, userEmail: user.email }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.reason || "נכשל עדכון היצירה");
    }

    // Update state & store
    setMyArtworks((prev) => prev.map((a) => (a.slug === updated.slug ? updated : a)));
    updateCustomArtwork(updated);

    setActionSuccess(`היצירה "${updated.title?.he || updated.slug}" עודכנה בהצלחה!`);
    setTimeout(() => setActionSuccess(null), 4000);
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
              href="/upload/new"
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

      {/* Action Messages */}
      {actionSuccess && (
        <div role="status" className="rounded-card bg-success/10 border border-success/30 p-4 text-small text-success font-medium">
          ✓ {actionSuccess}
        </div>
      )}

      {actionError && (
        <div role="alert" className="rounded-card bg-error/10 border border-error/30 p-4 text-small text-error font-medium">
          ⚠️ {actionError}
        </div>
      )}

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
            🎨 היצירות שלי בגלריה ({myArtworks.length})
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
                מספר טלפון
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
              <p className="mt-1 text-caption text-text-muted">
                נשתמש במספר רק לצורך אימות החשבון, תיאום משלוח ויצירת קשר בנוגע להזמנה.
              </p>
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

      {/* TAB 3: Artist Uploaded Artworks Management */}
      {isArtist && activeTab === "artworks" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-medium text-text">היצירות שלי בגלריה</h2>
              <p className="text-caption text-text-muted">
                ניהול היצירות המקוריות שהעלית: צפייה, עריכת פרטים ומחיקה מורשית.
              </p>
            </div>
            <Link
              href="/upload/new"
              className="rounded-control bg-accent px-4 py-2 text-small font-medium text-surface hover:bg-accent-strong transition-colors"
            >
              + להעלות יצירה חדשה
            </Link>
          </div>

          {myArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myArtworks.map((art) => {
                const titleText = art.title?.he || art.title?.en || "יצירה";
                const priceFormatted = `₪${((art.priceAgorot || 45000) / 100).toLocaleString()}`;
                const primaryImg = art.images?.[0]?.publicId || "/mock/earth-bowl.jpg";
                const imgUrl = primaryImg.startsWith("/")
                  ? primaryImg
                  : buildCloudinaryUrl(primaryImg, { width: 400, quality: 80 });

                const availabilityLabel =
                  art.availability === "sold"
                    ? "נמכר (Sold Out)"
                    : art.availability === "reserved"
                    ? "נשמר (Reserved)"
                    : "זמין למכירה (Available)";

                const badgeBg =
                  art.availability === "sold"
                    ? "bg-stone/60 text-text-muted"
                    : art.availability === "reserved"
                    ? "bg-sand text-accent-strong"
                    : "bg-success/15 text-success font-medium";

                return (
                  <div
                    key={art.slug}
                    className="flex gap-4 rounded-panel border border-border bg-surface p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-artwork bg-sand/40">
                      <img
                        src={imgUrl}
                        alt={titleText}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-heading text-body font-medium text-text truncate">
                            <Link href={`/works/${art.slug}`} className="hover:underline">
                              {titleText}
                            </Link>
                          </h3>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${badgeBg}`}>
                            {availabilityLabel}
                          </span>
                        </div>
                        <p className="text-small font-semibold text-accent-strong mt-0.5" dir="ltr">
                          {priceFormatted}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                        <Link
                          href={`/works/${art.slug}`}
                          className="text-caption font-medium text-text-muted hover:text-text transition-colors"
                        >
                          👁️ צפייה בגלריה
                        </Link>

                        <button
                          type="button"
                          onClick={() => setEditingArtwork(art)}
                          className="rounded-control bg-sand/60 px-3 py-1 text-caption font-medium text-text hover:bg-stone/60 transition-colors"
                        >
                          ✏️ עריכה
                        </button>

                        <button
                          type="button"
                          disabled={deletingSlug === art.slug}
                          onClick={() => handleDeleteArtwork(art.slug)}
                          className="rounded-control bg-error/10 px-3 py-1 text-caption font-medium text-error hover:bg-error/20 transition-colors disabled:opacity-50"
                        >
                          {deletingSlug === art.slug ? "מוחק..." : "🗑️ מחיקה"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-sand/30 p-8 text-center">
              <p className="text-h3 font-medium text-text">עדיין לא העלת יצירות לגלריה</p>
              <p className="mt-1 text-small text-text-muted">
                כאמן/ית רשום/ה ב-BOBY, תוכל להעלות יצירות מקוריות עם תמונות וסיפור הסטודיו.
              </p>
              <Link
                href="/upload/new"
                className="mt-4 inline-block rounded-control bg-accent px-5 py-2 text-small font-medium text-surface hover:bg-accent-strong transition-colors"
              >
                להעלות יצירה ראשונה ✨
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Artwork Modal */}
      <EditArtworkModal
        artwork={editingArtwork}
        isOpen={Boolean(editingArtwork)}
        onClose={() => setEditingArtwork(null)}
        onSave={handleSaveEdit}
        userEmail={user.email}
      />
    </div>
  );
}

