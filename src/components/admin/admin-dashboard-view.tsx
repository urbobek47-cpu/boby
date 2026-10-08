"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import type { Artwork } from "@/lib/catalog/types";
import { EditArtworkModal } from "@/components/artwork/edit-artwork-modal";
import { buildCloudinaryUrl } from "@/lib/cloudinary";

interface UserRecord {
  slug: string;
  display_name?: any;
  bio?: any;
  location?: any;
  portrait_public_id?: string | null;
  is_admin?: boolean;
  email?: string;
  phone?: string;
  updated_at?: string;
}

interface OrderRecord {
  id: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  total_agorot?: number;
  status?: string;
  items_count?: number;
  payplus_token?: string;
  green_invoice_number?: string;
  created_at?: string;
}

export function AdminDashboardView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"artworks" | "users" | "orders" | "system">("artworks");
  
  // Data State
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Loading & Action State
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Edit Modals
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      // 1. Fetch Artworks
      const artRes = await fetch("/api/admin/artworks");
      if (artRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      const artData = await artRes.json();
      if (artData.success) setArtworks(artData.artworks || []);

      // 2. Fetch Users & Artists
      const userRes = await fetch("/api/admin/users");
      const userData = await userRes.json();
      if (userData.success) setUsers(userData.users || []);

      // 3. Fetch Orders
      const orderRes = await fetch("/api/admin/orders");
      const orderData = await orderRes.json();
      if (orderData.success) setOrders(orderData.orders || []);
    } catch (err: any) {
      console.error("[Admin Fetch Error]", err);
      setActionError("אירעה שגיאה בטעינת נתוני הניהול מהשרת");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Artwork Handlers
  const handleSaveArtwork = async (updated: Artwork) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/admin/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artwork: updated }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.reason || "נכשל עדכון היצירה");

      setArtworks((prev) => prev.map((a) => (a.slug === updated.slug ? updated : a)));
      setEditingArtwork(null);
      setActionSuccess(`היצירה "${updated.title?.he || updated.slug}" עודכנה בהצלחה!`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.message || "שגיאה בעדכון היצירה");
    }
  };

  const handleDeleteArtwork = async (slug: string) => {
    const confirmed = window.confirm(`האם למחוק לצמיתות כמנהל את היצירה "${slug}"?`);
    if (!confirmed) return;

    setDeletingSlug(slug);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/artworks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.reason || "נכשלה מחיקת היצירה");

      setArtworks((prev) => prev.filter((a) => a.slug !== slug));
      setActionSuccess(`היצירה נמחקה בהצלחה מהמערכת.`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.message || "שגיאה במחיקת היצירה");
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleToggleAvailability = async (art: Artwork, newStatus: "available" | "reserved" | "sold") => {
    const updated = { ...art, availability: newStatus };
    await handleSaveArtwork(updated);
  };

  // Filtered views
  const filteredArtworks = artworks.filter((a) => {
    const q = searchQuery.toLowerCase();
    const title = (a.title?.he || a.title?.en || "").toLowerCase();
    const artist = (a.artist?.displayName?.he || a.artist?.displayName?.en || a.artist?.slug || "").toLowerCase();
    return title.includes(q) || artist.includes(q) || a.slug.includes(q);
  });

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const name = typeof u.display_name === "object" ? (u.display_name?.he || u.display_name?.en || "") : (u.display_name || "");
    const slug = (u.slug || "").toLowerCase();
    return name.toLowerCase().includes(q) || slug.includes(q);
  });

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 py-6 px-4">
      {/* Header Dashboard Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-panel bg-deep text-surface p-6 shadow-md border border-stone/20">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-surface text-2xl font-bold shadow-xs">
            🛡️
          </span>
          <div>
            <h1 className="text-h2 font-medium text-surface flex items-center gap-2">
              פאנל ניהול ראשי — BOBY Admin
              <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-caption font-semibold text-accent-strong border border-accent/40">
                מאובטח Server-Side
              </span>
            </h1>
            <p className="text-small text-surface/80 mt-0.5">
              שליטה מלאה על אמנים, לקוחות, יצירות אמנות, מועדפים, הזמנות והגדרות מערכת.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={isLoading}
            className="rounded-control border border-surface/20 bg-surface/10 px-4 py-2 text-small font-medium text-surface hover:bg-surface/20 transition-colors flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>{isLoading ? "מעדכן..." : "רענון נתונים"}</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-control bg-error/80 px-4 py-2 text-small font-medium text-surface hover:bg-error transition-colors"
          >
            יציאה מהניהול
          </button>
        </div>
      </div>

      {/* Action Toasts */}
      {actionSuccess && (
        <div role="status" className="rounded-card bg-success/15 border border-success/40 p-4 text-small text-success font-medium flex items-center gap-2">
          <span>✓</span>
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div role="alert" className="rounded-card bg-error/15 border border-error/40 p-4 text-small text-error font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>{actionError}</span>
        </div>
      )}

      {/* Admin Stats Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-panel border border-border bg-surface p-4 shadow-2xs">
          <p className="text-caption text-text-muted">🎨 סך הכל יצירות במערכת</p>
          <p className="text-h1 font-bold text-text mt-1">{artworks.length}</p>
        </div>
        <div className="rounded-panel border border-border bg-surface p-4 shadow-2xs">
          <p className="text-caption text-text-muted">👩‍🎨 אמנים ופרופילים רשומים</p>
          <p className="text-h1 font-bold text-accent-strong mt-1">{users.length}</p>
        </div>
        <div className="rounded-panel border border-border bg-surface p-4 shadow-2xs">
          <p className="text-caption text-text-muted">🛍️ הזמנות שבוצעו</p>
          <p className="text-h1 font-bold text-text mt-1">{orders.length}</p>
        </div>
        <div className="rounded-panel border border-border bg-surface p-4 shadow-2xs">
          <p className="text-caption text-text-muted">⚡ סטטוס חיבור Supabase DB</p>
          <p className="text-small font-semibold text-success mt-2 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            מחובר ופעיל (Service Role)
          </p>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 pt-2">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("artworks")}
            className={`rounded-control px-4 py-2 text-small font-medium transition-colors ${
              activeTab === "artworks"
                ? "bg-accent text-surface font-semibold shadow-xs"
                : "bg-surface border border-border text-text hover:bg-stone/40"
            }`}
          >
            🎨 יצירות אמנות ({artworks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`rounded-control px-4 py-2 text-small font-medium transition-colors ${
              activeTab === "users"
                ? "bg-accent text-surface font-semibold shadow-xs"
                : "bg-surface border border-border text-text hover:bg-stone/40"
            }`}
          >
            👩‍🎨 אמנים ולקוחות ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`rounded-control px-4 py-2 text-small font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-accent text-surface font-semibold shadow-xs"
                : "bg-surface border border-border text-text hover:bg-stone/40"
            }`}
          >
            📦 הזמנות ועסקאות ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`rounded-control px-4 py-2 text-small font-medium transition-colors ${
              activeTab === "system"
                ? "bg-accent text-surface font-semibold shadow-xs"
                : "bg-surface border border-border text-text hover:bg-stone/40"
            }`}
          >
            ⚙️ הגדרות מערכת
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="חיפוש חופשי..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-control border border-border bg-surface px-3.5 py-2 text-small text-text focus:border-accent-strong focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute start-3 top-2.5 text-caption text-text-muted hover:text-text"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: Artworks Management */}
      {activeTab === "artworks" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-medium text-text">ניהול כלל היצירות במערכת</h2>
            <Link
              href="/upload/new"
              className="rounded-control bg-accent px-4 py-2 text-small font-medium text-surface hover:bg-accent-strong transition-colors"
            >
              + להעלות יצירה חדשה כמנהל
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-text-muted">טוען יצירות מהשרת...</div>
          ) : filteredArtworks.length > 0 ? (
            <div className="overflow-x-auto rounded-panel border border-border bg-surface shadow-xs">
              <table className="w-full text-right text-small">
                <thead className="bg-sand/60 text-text border-b border-border font-medium">
                  <tr>
                    <th className="p-3.5">תמונה</th>
                    <th className="p-3.5">כותרת היצירה</th>
                    <th className="p-3.5">אמן יוצר</th>
                    <th className="p-3.5">מחיר</th>
                    <th className="p-3.5">זמינות</th>
                    <th className="p-3.5 text-center">פעולות ניהול</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredArtworks.map((art) => {
                    const titleText = art.title?.he || art.title?.en || art.slug;
                    const artistName = art.artist?.displayName?.he || art.artist?.displayName?.en || art.artist?.slug || "אמן BOBY";
                    const priceFormatted = `₪${((art.priceAgorot || 45000) / 100).toLocaleString()}`;
                    const imgPublicId = art.images?.[0]?.publicId || "/mock/earth-bowl.jpg";
                    const imgUrl = imgPublicId.startsWith("/") || imgPublicId.startsWith("http")
                      ? imgPublicId
                      : buildCloudinaryUrl(imgPublicId, { width: 120, quality: 80 });

                    return (
                      <tr key={art.slug} className="hover:bg-sand/20 transition-colors">
                        <td className="p-3">
                          <img
                            src={imgUrl}
                            alt={titleText}
                            className="h-12 w-12 rounded-artwork object-cover bg-sand/40 border border-border/50"
                          />
                        </td>
                        <td className="p-3 font-medium text-text">
                          <Link href={`/works/${art.slug}`} className="hover:underline">
                            {titleText}
                          </Link>
                          <p className="text-caption text-text-muted font-mono" dir="ltr">
                            {art.slug}
                          </p>
                        </td>
                        <td className="p-3 text-text-muted">
                          <bdi>{artistName}</bdi>
                        </td>
                        <td className="p-3 font-semibold text-accent-strong" dir="ltr">
                          {priceFormatted}
                        </td>
                        <td className="p-3">
                          <select
                            value={art.availability || "available"}
                            onChange={(e) => handleToggleAvailability(art, e.target.value as any)}
                            className="rounded-control border border-border bg-surface px-2.5 py-1 text-caption font-medium focus:outline-none"
                          >
                            <option value="available">🟢 זמין למכירה</option>
                            <option value="reserved">🟡 נשמר (Reserved)</option>
                            <option value="sold">🔴 נמכר (Sold Out)</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingArtwork(art)}
                              className="rounded-control bg-sand/60 px-3 py-1.5 text-caption font-medium text-text hover:bg-stone/60 transition-colors"
                            >
                              ✏️ עריכה
                            </button>
                            <button
                              type="button"
                              disabled={deletingSlug === art.slug}
                              onClick={() => handleDeleteArtwork(art.slug)}
                              className="rounded-control bg-error/10 px-3 py-1.5 text-caption font-medium text-error hover:bg-error/20 transition-colors disabled:opacity-50"
                            >
                              {deletingSlug === art.slug ? "מוחק..." : "🗑️ מחיקה"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-sand/30 p-8 text-center text-text-muted">
              לא נמצאו יצירות התואמות את החיפוש.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Users & Artists Management */}
      {activeTab === "users" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-h3 font-medium text-text">ניהול אמנים ומשתתפי פלטפורמה</h2>
          {isLoading ? (
            <div className="py-12 text-center text-text-muted">טוען משתמשים...</div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto rounded-panel border border-border bg-surface shadow-xs">
              <table className="w-full text-right text-small">
                <thead className="bg-sand/60 text-text border-b border-border font-medium">
                  <tr>
                    <th className="p-3.5">תמונה</th>
                    <th className="p-3.5">שם / מותג</th>
                    <th className="p-3.5">מזהה אמן (Slug / Email)</th>
                    <th className="p-3.5">מיקום / סטודיו</th>
                    <th className="p-3.5">הרשאות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.map((usr) => {
                    const name = typeof usr.display_name === "object"
                      ? (usr.display_name?.he || usr.display_name?.en || usr.slug)
                      : (usr.display_name || usr.slug);

                    const location = typeof usr.location === "object"
                      ? (usr.location?.he || usr.location?.en || "ישראל")
                      : (usr.location || "ישראל");

                    const avatar = usr.portrait_public_id;

                    return (
                      <tr key={usr.slug} className="hover:bg-sand/20 transition-colors">
                        <td className="p-3">
                          <div className="h-10 w-10 rounded-full bg-sand/60 border border-border overflow-hidden flex items-center justify-center text-text-muted">
                            {avatar ? (
                              <img src={avatar} alt={name} className="h-full w-full object-cover" />
                            ) : (
                              <span>👤</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-text">
                          <Link href={`/artists/${usr.slug}`} className="hover:underline">
                            <bdi>{name}</bdi>
                          </Link>
                        </td>
                        <td className="p-3 text-text-muted font-mono" dir="ltr">
                          {usr.slug}
                        </td>
                        <td className="p-3 text-text-muted">
                          📍 <bdi>{location}</bdi>
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${
                              usr.is_admin
                                ? "bg-accent/20 text-accent-strong border border-accent/40"
                                : "bg-stone/50 text-text-muted"
                            }`}
                          >
                            {usr.is_admin ? "🛡️ מנהל מערכת" : "🎨 אמן רשום"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-sand/30 p-8 text-center text-text-muted">
              לא נמצאו אמנים/משתמשים במערכת.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-h3 font-medium text-text">ניהול הזמנות ועסקאות</h2>
          {orders.length > 0 ? (
            <div className="overflow-x-auto rounded-panel border border-border bg-surface shadow-xs">
              <table className="w-full text-right text-small">
                <thead className="bg-sand/60 text-text border-b border-border font-medium">
                  <tr>
                    <th className="p-3.5">מספר הזמנה</th>
                    <th className="p-3.5">שם לקוח</th>
                    <th className="p-3.5">אימייל וטלפון</th>
                    <th className="p-3.5">סכום כולל</th>
                    <th className="p-3.5">סטטוס תשלום / חשבונית</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-sand/20 transition-colors">
                      <td className="p-3 font-mono font-medium text-text" dir="ltr">
                        #{ord.id}
                      </td>
                      <td className="p-3 text-text font-medium">{ord.buyer_name || "לקוח BOBY"}</td>
                      <td className="p-3 text-text-muted" dir="ltr">
                        {ord.buyer_email || "—"} {ord.buyer_phone ? `| ${ord.buyer_phone}` : ""}
                      </td>
                      <td className="p-3 font-semibold text-accent-strong" dir="ltr">
                        ₪{((ord.total_agorot || 0) / 100).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-success/15 text-success font-semibold px-2.5 py-0.5 text-caption">
                          {ord.status || "שולם במלאו"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-sand/30 p-8 text-center text-text-muted">
              עדיין לא נרשמו הזמנות במערכת השרת.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: System Settings */}
      {activeTab === "system" && (
        <div className="rounded-panel border border-border bg-surface p-6 flex flex-col gap-6 shadow-sm">
          <h2 className="text-h3 font-medium text-text border-b border-border pb-3">
            הגדרות בסיס נתונים ושרת
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-card border border-border bg-sand/30 p-4">
              <h3 className="font-semibold text-text mb-1">אימות מנהל בשרת (Server Auth)</h3>
              <p className="text-small text-text-muted">
                אימות הניהול מוגן באמצעות Token חתום ב-HMAC SHA-256 המאוחסן ב-Cookie מאובטחת (`boby_admin_session`) מסוג HttpOnly.
              </p>
            </div>
            <div className="rounded-card border border-border bg-sand/30 p-4">
              <h3 className="font-semibold text-text mb-1">אחסון מדיה ותמונות</h3>
              <p className="text-small text-text-muted">
                תמונות היצירות מאוחסנות ב-Cloudinary. תמונות הפרופיל מאוחסנות ב-Supabase Storage (`avatars` bucket).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Artwork Modal */}
      {editingArtwork && (
        <EditArtworkModal
          artwork={editingArtwork}
          isOpen={Boolean(editingArtwork)}
          onClose={() => setEditingArtwork(null)}
          onSave={handleSaveArtwork}
          userEmail="admin@boby.co.il"
        />
      )}
    </div>
  );
}
