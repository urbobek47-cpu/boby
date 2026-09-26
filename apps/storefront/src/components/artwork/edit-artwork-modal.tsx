"use client";

import React, { useState, useEffect } from "react";
import type { Artwork, ArtworkAvailability, InventoryKind } from "@/lib/catalog/types";

interface EditArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Artwork) => Promise<void>;
  userEmail: string;
}

export function EditArtworkModal({ artwork, isOpen, onClose, onSave, userEmail }: EditArtworkModalProps) {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [priceAgorot, setPriceAgorot] = useState("450");
  const [availability, setAvailability] = useState<ArtworkAvailability>("available");
  const [inventoryKind, setInventoryKind] = useState<InventoryKind>("UNIQUE");
  const [materials, setMaterials] = useState("");
  const [heightCm, setHeightCm] = useState("18");
  const [widthCm, setWidthCm] = useState("24");
  const [depthCm, setDepthCm] = useState("24");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (artwork) {
      setTitle(artwork.title?.he || artwork.title?.en || "");
      setStory(artwork.story?.he || artwork.story?.en || "");
      setPriceAgorot(((artwork.priceAgorot || 45000) / 100).toString());
      setAvailability(artwork.availability || "available");
      setInventoryKind(artwork.inventoryKind || "UNIQUE");
      setMaterials(Array.isArray(artwork.materials?.he) ? artwork.materials.he.join(", ") : "");
      setHeightCm(artwork.dimensions?.heightCm?.toString() || "15");
      setWidthCm(artwork.dimensions?.widthCm?.toString() || "20");
      setDepthCm(artwork.dimensions?.depthCm?.toString() || "20");
      setError(null);
    }
  }, [artwork]);

  if (!isOpen || !artwork) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("נא להזין את שם היצירה");
      return;
    }

    setIsSaving(true);

    try {
      const numPrice = Math.round(parseFloat(priceAgorot) * 100) || 45000;
      const materialsList = materials.split(",").map((m) => m.trim()).filter(Boolean);

      const updatedArtwork: Artwork = {
        ...artwork,
        title: { he: title.trim(), en: title.trim() },
        story: { he: story.trim(), en: story.trim() },
        priceAgorot: numPrice,
        availability,
        inventoryKind,
        materials: {
          he: materialsList.length > 0 ? materialsList : ["חומרים מקומיים בעבודת יד"],
          en: materialsList.length > 0 ? materialsList : ["Handmade local materials"],
        },
        dimensions: {
          heightCm: parseFloat(heightCm) || 15,
          widthCm: parseFloat(widthCm) || 20,
          depthCm: parseFloat(depthCm) || 20,
          weightGrams: artwork.dimensions?.weightGrams || 1000,
        },
      };

      await onSave(updatedArtwork);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setIsSaving(false);
      setError(err?.message || "אירעה שגיאה בשמירת השינויים");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-panel border border-border bg-surface p-6 shadow-xl my-8">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 className="text-h3 font-medium text-text">
            עריכת יצירה: <bdi>{artwork.title?.he || artwork.slug}</bdi>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-text-muted hover:bg-sand transition-colors text-small font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-card border border-error/30 bg-error/10 p-3 text-small text-error font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="edit-title" className="block mb-1 text-small font-medium text-text">
              שם היצירה *
            </label>
            <input
              id="edit-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="edit-story" className="block mb-1 text-small font-medium text-text">
              סיפור היצירה והסטודיו
            </label>
            <textarea
              id="edit-story"
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full rounded-control border border-border bg-surface p-3 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-price" className="block mb-1 text-small font-medium text-text">
                מחיר (₪ כולל מע״מ 18%) *
              </label>
              <input
                id="edit-price"
                type="number"
                dir="ltr"
                required
                min="10"
                value={priceAgorot}
                onChange={(e) => setPriceAgorot(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-availability" className="block mb-1 text-small font-medium text-text">
                סטטוס זמינות *
              </label>
              <select
                id="edit-availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as ArtworkAvailability)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3 text-body focus:border-accent-strong focus:outline-none"
              >
                <option value="available">זמין למכירה (Available)</option>
                <option value="reserved">נשמר ללקוח (Reserved)</option>
                <option value="sold">נמכר (Sold Out)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-materials" className="block mb-1 text-small font-medium text-text">
              חומרים (מופרדים בפסיקים)
            </label>
            <input
              id="edit-materials"
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="edit-h" className="block mb-1 text-caption font-medium text-text">
                גובה (ס״מ)
              </label>
              <input
                id="edit-h"
                type="number"
                dir="ltr"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="min-h-10 w-full rounded-control border border-border bg-surface px-2.5 text-small focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-w" className="block mb-1 text-caption font-medium text-text">
                רוחב (ס״מ)
              </label>
              <input
                id="edit-w"
                type="number"
                dir="ltr"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
                className="min-h-10 w-full rounded-control border border-border bg-surface px-2.5 text-small focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-d" className="block mb-1 text-caption font-medium text-text">
                עומק (ס״מ)
              </label>
              <input
                id="edit-d"
                type="number"
                dir="ltr"
                value={depthCm}
                onChange={(e) => setDepthCm(e.target.value)}
                className="min-h-10 w-full rounded-control border border-border bg-surface px-2.5 text-small focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-control px-4 py-2 text-small font-medium text-text hover:bg-sand transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-control bg-btn-primary px-5 py-2 text-small font-medium text-surface hover:bg-deep/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? "שומר שינויים..." : "שמירת שינויים ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
