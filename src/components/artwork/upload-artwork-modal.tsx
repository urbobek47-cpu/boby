"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { addCustomArtwork } from "@/lib/catalog/data";
import { validateArtworkImage } from "@/lib/catalog/image-validation";
import type { Artwork } from "@/lib/catalog/types";

interface UploadArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadArtworkModal({ isOpen, onClose }: UploadArtworkModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Form Fields
  const [artistName, setArtistName] = useState(user?.name || "נועה ברק");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [price, setPrice] = useState("350");
  const [category, setCategory] = useState("קרמיקה");
  const [discipline, setDiscipline] = useState<Artwork["discipline"]>("ceramics");
  const [materials, setMaterials] = useState("חימר מקומי, גלזורה מינרלית");
  const [heightCm, setHeightCm] = useState("14");
  const [widthCm, setWidthCm] = useState("22");
  const [depthCm, setDepthCm] = useState("22");

  // Images state (minimum 2 required)
  const [selectedImages, setSelectedImages] = useState<
    Array<{ id: string; url: string; file?: File; caption: string; isValidated?: boolean; error?: string }>
  >([
    {
      id: "img-1",
      url: "/mock/earth-bowl.jpg",
      caption: "מבט מקיף מזווית עליונה בתאורת רכה",
    },
    {
      id: "img-2",
      url: "/mock/evening-bowl.jpg",
      caption: "תקריב של מרקם הגלזורה ושפת הכלי",
    },
  ]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Add mock / custom uploaded image
  const handleAddSampleImage = (type: "valid" | "invalid") => {
    setValidationError(null);
    if (type === "valid") {
      const newImg = {
        id: `img-${Date.now()}`,
        url: selectedImages.length % 2 === 0 ? "/mock/landscape-plate.jpg" : "/mock/olive-goblet.jpg",
        caption: `תמונה איכותית נוספת (${selectedImages.length + 1})`,
      };
      setSelectedImages((prev) => [...prev, newImg]);
    } else {
      // Intentionally invalid sample to test AI filter failure
      const invalidImg = {
        id: `img-${Date.now()}`,
        url: "/mock/dark-bad-lighting.jpg",
        caption: "תמונה כהה ולא ממוקדת",
        error: "התמונה לא עומדת בסטנדרט. אנא העלה תמונה איכותית, עם תאורה טובה ורקע ניטרלי.",
      };
      setSelectedImages((prev) => [...prev, invalidImg]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
    setValidationError(null);
  };

  // Submit and Validate Artwork
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Rule 1: Minimum 2 images check
    if (selectedImages.length < 2) {
      setValidationError("יש להעלות לפחות 2 תמונות איכותיות של היצירה.");
      return;
    }

    if (!title.trim()) {
      setValidationError("נא להזין את שם היצירה.");
      return;
    }

    if (!story.trim() || story.trim().length < 20) {
      setValidationError("נא לכתוב את סיפור היצירה והתהליך (לפחות 20 תווים).");
      return;
    }

    setIsValidating(true);

    // Rule 2: Run AI Image Quality Validation Engine for each image
    let hasFailedImage = false;
    const updatedImages = [...selectedImages];

    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      const result = await validateArtworkImage(img.file || img.url);

      if (!result.valid) {
        hasFailedImage = true;
        updatedImages[i] = {
          ...img,
          isValidated: false,
          error: result.reason || "התמונה לא עומדת בסטנדרט. אנא העלה תמונה איכותית, עם תאורה טובה ורקע ניטרלי.",
        };
      } else {
        updatedImages[i] = {
          ...img,
          isValidated: true,
          error: undefined,
        };
      }
    }

    setSelectedImages(updatedImages);
    setIsValidating(false);

    if (hasFailedImage) {
      setValidationError("אחת או יותר מהתמונות נדחו על ידי מסנן האיכות. אנא החלף אותן בתמונות איכותיות ברקע ניטרלי.");
      return;
    }

    // Build new artwork object
    setIsSubmitting(true);

    const slug = `${title.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`;
    const numericPriceAgorot = Math.round(parseFloat(price) * 100) || 35000;

    const newArtwork: Artwork = {
      slug,
      title: { he: title.trim(), en: title.trim() },
      story: { he: story.trim(), en: story.trim() },
      materials: {
        he: materials.split(",").map((m) => m.trim()),
        en: materials.split(",").map((m) => m.trim()),
      },
      discipline,
      category: { he: category, en: category },
      inventoryKind: "UNIQUE",
      availability: "available",
      dimensions: {
        heightCm: parseInt(heightCm) || 15,
        widthCm: parseInt(widthCm) || 20,
        depthCm: parseInt(depthCm) || 20,
      },
      priceAgorot: numericPriceAgorot,
      shippingSizeBand: "SMALL",
      isFragile: true,
      images: selectedImages.map((img, i) => ({
        publicId: img.url,
        aspectRatio: 4 / 5,
        role: i === 0 ? "primary" : "detail",
        caption: { he: img.caption, en: img.caption },
      })),
      artist: {
        slug: user?.email.split("@")[0] || "artist-studio",
        displayName: { he: artistName.trim(), en: artistName.trim() },
        location: { he: "ישראל", en: "Israel" },
        bio: {
          he: `אמן/ית יוצר/ת ב-BOBY. שותף/ה בקהילת האמנות הישראלית.`,
          en: `Israeli artist creating handmade original art pieces.`,
        },
        portraitPublicId: null,
      },
    };

    // Save to dynamic catalog store
    addCustomArtwork(newArtwork);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      // Redirect to newly created product page to showcase images & story immediately
      router.push(`/works/${slug}`);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-panel border border-border bg-surface p-6 shadow-2xl md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="rounded-full bg-sand px-3 py-1 text-caption font-semibold text-accent-strong">
              🎨 אזור אמן — העלאת יצירה
            </span>
            <h2 id="upload-modal-title" className="mt-1 text-h2 font-medium text-text">
              להעלות יצירה חדשה לגלריה
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירת חלון"
            className="rounded-control p-2 text-text-muted hover:bg-sand hover:text-text"
          >
            ✕
          </button>
        </div>

        {/* Validation Global Error Alert */}
        {validationError && (
          <div
            role="alert"
            className="mt-4 rounded-card border border-error/30 bg-error/10 p-3.5 text-small text-error font-medium"
          >
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {/* Section 1: Artist & Basic Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="up-artist-name" className="block mb-1 text-small font-medium text-text">
                שם האמן / הסטודיו
              </label>
              <input
                id="up-artist-name"
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="up-title" className="block mb-1 text-small font-medium text-text">
                שם היצירה
              </label>
              <input
                id="up-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="לדוגמה: קערת קרמיקה פיסולית"
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: The Artist's Story (Required Textarea) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="up-story" className="text-small font-semibold text-text">
                סיפור היצירה והתהליך (The Story) *
              </label>
              <span className="text-caption text-text-muted">יוצג בהבלטה בעמוד המוצר</span>
            </div>
            <textarea
              id="up-story"
              rows={4}
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="שתף את הקונים בסיפור מאחורי היצירה: מקור ההשראה, החומרים המקומיים, טכניקת העבודה בסטודיו והמשמעות של החפץ..."
              className="w-full rounded-control border border-border bg-surface p-3.5 text-body placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none"
            />
          </div>

          {/* Section 3: Image Upload & Minimum 2 Requirement */}
          <div className="rounded-panel border border-border bg-sand/30 p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-small font-semibold text-text">
                  תמונות היצירה (חובה לפחות 2 תמונות) *
                </h3>
                <p className="text-caption text-text-muted">
                  סינון איכות אוטומטי: תאורה טובה, זווית מחמיאה ורקע ניטרלי.
                </p>
              </div>
              <span className="rounded-full bg-surface px-2.5 py-1 text-caption font-medium border border-border">
                {selectedImages.length} תמונות נבחרו
              </span>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`relative flex flex-col justify-between rounded-card border bg-surface p-2 transition-all ${
                    img.error ? "border-error bg-error/5" : "border-border hover:border-accent-strong"
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-artwork bg-stone/30 relative">
                    {/* Image Preview */}
                    <img
                      src={img.url}
                      alt={`תצוגה מקדימה ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute start-2 top-2 rounded-full bg-deep/80 px-2 py-0.5 text-caption text-surface">
                      #{index + 1}
                    </span>
                  </div>

                  {img.error && (
                    <p className="mt-2 text-caption font-medium text-error leading-snug">
                      ⚠️ {img.error}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-caption text-text-muted truncate max-w-[120px]">
                      {img.caption}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="text-caption font-medium text-error hover:underline"
                    >
                      הסר
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons to upload or test sample images */}
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => handleAddSampleImage("valid")}
                className="rounded-control border border-border bg-surface px-3 py-1.5 text-small font-medium text-text hover:bg-sand"
              >
                + הוסף תמונה איכותית
              </button>

              <button
                type="button"
                onClick={() => handleAddSampleImage("invalid")}
                className="rounded-control border border-border/80 bg-stone/20 px-3 py-1.5 text-caption font-medium text-text-muted hover:bg-stone/40"
              >
                🧪 בדיקת סינון תמונה שאינה עומדת בסטנדרט
              </button>
            </div>
          </div>

          {/* Section 4: Price, Category, Dimensions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="up-price" className="block mb-1 text-small font-medium text-text">
                מחיר (₪ כולל מע״מ)
              </label>
              <input
                id="up-price"
                type="number"
                dir="ltr"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="up-category" className="block mb-1 text-small font-medium text-text">
                קטגוריה
              </label>
              <select
                id="up-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === "קרמיקה") setDiscipline("ceramics");
                  if (e.target.value === "הדפס") setDiscipline("painting");
                  if (e.target.value === "עץ") setDiscipline("wood");
                }}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              >
                <option value="קרמיקה">קרמיקה וקדרות</option>
                <option value="הדפס">הדפס ואיור</option>
                <option value="עץ">עיבוד עץ</option>
                <option value="תכשיט">תכשיט בעבודת יד</option>
              </select>
            </div>

            <div>
              <label htmlFor="up-materials" className="block mb-1 text-small font-medium text-text">
                חומרים
              </label>
              <input
                id="up-materials"
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="חימר, גלזורה..."
                className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-control px-4 py-2.5 text-small font-medium text-text hover:bg-sand"
            >
              ביטול
            </button>

            <button
              type="submit"
              disabled={isValidating || isSubmitting}
              className="rounded-control bg-btn-primary px-6 py-2.5 text-body font-medium text-surface transition-colors hover:bg-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50"
            >
              {isValidating
                ? "🔍 מריץ סינון איכות תמונות..."
                : isSubmitting
                ? "מפרסם יצירה..."
                : "אימות תמונות ופרסום היצירה ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
