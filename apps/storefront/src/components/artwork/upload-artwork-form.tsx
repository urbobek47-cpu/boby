"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { addCustomArtwork } from "@/lib/catalog/data";
import { validateArtworkImage } from "@/lib/catalog/image-validation";
import type { Artwork, Discipline, InventoryKind, ArtworkAvailability, ShippingSizeBand } from "@/lib/catalog/types";

interface SelectedImage {
  id: string;
  url: string;
  file?: File;
  caption: string;
  isValidated?: boolean;
  error?: string;
}

export function UploadArtworkForm() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!user) {
      openAuthModal("artist", "login");
    }
  }, [user, openAuthModal]);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl rounded-panel border border-border bg-sand/30 p-8 text-center my-8 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-surface mx-auto mb-4">
          🎨
        </span>
        <h1 className="text-h2 font-medium text-text">התחברות / הרשמה כאמן</h1>
        <p className="mt-2 text-small text-text-muted">
          כדי להעלות יצירות חדשות לגלריית BOBY, נא להתחבר לחשבון אמן או להירשם כאמן חדש.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal("artist", "login")}
            className="rounded-control bg-accent-strong px-5 py-2.5 text-small font-medium text-surface hover:bg-accent-hover transition-colors"
          >
            התחברות אמן
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("artist", "signup")}
            className="rounded-control border border-border bg-surface px-5 py-2.5 text-small font-medium text-text hover:bg-stone/50 transition-colors"
          >
            הרשמת אמן חדש
          </button>
        </div>
      </div>
    );
  }

  // Form Fields State
  const [artistName, setArtistName] = useState(user?.name || "אמן סטודיו BOBY");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [price, setPrice] = useState("450");
  const [categoryLabel, setCategoryLabel] = useState("קרמיקה וקדרות");
  const [discipline, setDiscipline] = useState<Discipline>("ceramics");
  const [inventoryKind, setInventoryKind] = useState<InventoryKind>("UNIQUE");
  const [availability, setAvailability] = useState<ArtworkAvailability>("available");
  const [materialsInput, setMaterialsInput] = useState("חימר מקומי, גלזורה מינרלית, שריפה כפולה");
  const [heightCm, setHeightCm] = useState("18");
  const [widthCm, setWidthCm] = useState("24");
  const [depthCm, setDepthCm] = useState("24");
  const [weightGrams, setWeightGrams] = useState("1200");
  const [shippingBand, setShippingBand] = useState<ShippingSizeBand>("MEDIUM");
  const [isFragile, setIsFragile] = useState(true);

  // Uploaded Images State
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([
    {
      id: "img-sample-1",
      url: "/mock/earth-bowl.jpg",
      caption: "זווית ראשית של היצירה",
      isValidated: true,
    },
    {
      id: "img-sample-2",
      url: "/mock/evening-bowl.jpg",
      caption: "תקריב מרקם וטקסטורה",
      isValidated: true,
    },
  ]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Real File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
    e.target.value = "";
  };

  // Compress local image file using createImageBitmap and Canvas to max 2400px WebP (<1MB)
  const getCompressedBlob = async (file: File): Promise<Blob> => {
    if (file.size <= 1024 * 1024) return file;
    try {
      const bitmap = await createImageBitmap(file);
      const MAX_DIM = 2400;
      let width = bitmap.width;
      let height = bitmap.height;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        bitmap.close();
        return file;
      }
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.85)
      );
      return blob || file;
    } catch (err) {
      console.warn("[Image Compression Warning]", err);
      return file;
    }
  };

  // Process uploaded image files into Data URLs & preserve File objects
  const processFiles = (files: File[]) => {
    setValidationError(null);
    const validImageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (validImageFiles.length === 0) {
      setValidationError("נא לבחור קבצי תמונה בלבד (JPG, PNG, WebP, AVIF).");
      return;
    }

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setSelectedImages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url: dataUrl,
              file: file,
              caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Remove image from list
  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
    setValidationError(null);
  };

  // Update caption
  const handleUpdateCaption = (id: string, caption: string) => {
    setSelectedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption } : img))
    );
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Verify user authentication (FIX 1)
    if (!user || !user.email) {
      setValidationError("יש להתחבר לחשבון אמן רשום כדי להעלות יצירות לגלריה.");
      return;
    }

    if (selectedImages.length < 2) {
      setValidationError("חובה להעלות לפחות 2 תמונות איכותיות של היצירה.");
      return;
    }

    if (!title.trim()) {
      setValidationError("נא להזין את שם היצירה.");
      return;
    }

    if (!story.trim() || story.trim().length < 20) {
      setValidationError("נא לכתוב את סיפור היצירה ותהליך העבודה בסטודיו (לפחות 20 תווים).");
      return;
    }

    setIsValidating(true);

    // Validate images with AI quality engine
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
          error:
            result.reason ||
            "התמונה לא עומדת בסטנדרט. אנא העלו תמונה איכותית בתאורה טובה וברקע ניטרלי.",
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
      setValidationError(
        "אחת או יותר מהתמונות נדחו על ידי מסנן האיכות. אנא החליפו אותן בתמונות איכותיות ברקע ניטרלי."
      );
      return;
    }

    setIsSubmitting(true);

    // Upload local images to image storage server via FormData (FIX 2)
    const processedImages: Array<{
      publicId: string;
      aspectRatio: number;
      role: "primary" | "detail";
      caption: { he: string; en: string };
    }> = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const img = selectedImages[i];
      let finalPublicId = img.url;

      if (img.file || img.url.startsWith("data:") || img.url.startsWith("blob:")) {
        try {
          const formData = new FormData();
          if (img.file) {
            const compressedBlob = await getCompressedBlob(img.file);
            formData.append("file", compressedBlob, img.file.name || `artwork-${i}.webp`);
          } else {
            const blobRes = await fetch(img.url);
            const rawBlob = await blobRes.blob();
            formData.append("file", rawBlob, `artwork-${i}.png`);
          }

          const uploadRes = await fetch("/api/artworks/upload", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok || !uploadData.success || !uploadData.publicId) {
            throw new Error(uploadData.reason || "נכשלה העלאת התמונה לשרת האחסון");
          }

          finalPublicId = uploadData.publicId;
        } catch (uploadErr: unknown) {
          const errMsg = uploadErr instanceof Error ? uploadErr.message : "נכשלה העלאת הקובץ";
          setValidationError(`שגיאה בהעלאת תמונה #${i + 1}: ${errMsg}`);
          setIsSubmitting(false);
          return;
        }
      }

      if (finalPublicId.startsWith("data:") || finalPublicId.startsWith("blob:")) {
        setValidationError(`שגיאה: התמונה #${i + 1} לא הועלתה לשרת האחסון בהצלחה.`);
        setIsSubmitting(false);
        return;
      }

      processedImages.push({
        publicId: finalPublicId,
        aspectRatio: 4 / 5,
        role: i === 0 ? "primary" : "detail",
        caption: { he: img.caption || title.trim(), en: img.caption || title.trim() },
      });
    }

    // Generate unique slug
    const cleanTitle = title.trim().toLowerCase().replace(/[^\w\u0590-\u05ff]+/g, "-");
    const slug = `${cleanTitle || "artwork"}-${Date.now().toString().slice(-4)}`;
    const numericPriceAgorot = Math.round(parseFloat(price) * 100) || 45000;

    const materialsArray = materialsInput
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const userEmailClean = user.email.trim().toLowerCase();
    const userSlugPrefix = userEmailClean.split("@")[0];

    // Construct full Artwork object matching BUILD-PLAN §4 model
    const newArtwork: Artwork = {
      slug,
      title: { he: title.trim(), en: title.trim() },
      story: { he: story.trim(), en: story.trim() },
      materials: {
        he: materialsArray.length > 0 ? materialsArray : ["חומרים מקומיים בעבודת יד"],
        en: materialsArray.length > 0 ? materialsArray : ["Handmade local materials"],
      },
      discipline,
      category: { he: categoryLabel, en: categoryLabel },
      inventoryKind,
      availability,
      dimensions: {
        heightCm: parseFloat(heightCm) || 15,
        widthCm: parseFloat(widthCm) || 20,
        depthCm: parseFloat(depthCm) || 20,
        weightGrams: parseFloat(weightGrams) || 1000,
      },
      priceAgorot: numericPriceAgorot,
      shippingSizeBand: shippingBand,
      isFragile,
      images: processedImages,
      artist: {
        slug: userSlugPrefix,
        displayName: { he: artistName.trim() || user.name, en: artistName.trim() || user.name },
        location: { he: "ישראל", en: "Israel" },
        bio: {
          he: `${artistName.trim()} — אמן/ית יוצר/ת בגלריית BOBY, יוצר/ת עבודות יד מקוריות בסטודיו.`,
          en: `${artistName.trim()} — Israeli artist creating original handmade works.`,
        },
        portraitPublicId: user.avatarUrl || null,
      },
    };

    // Client-side persistent store (localStorage)
    addCustomArtwork(newArtwork);

    // Server-side API persistence & inventory registration (FIX 3)
    let createRes: Response;
    let createData: { success?: boolean; reason?: string } = {};
    try {
      createRes = await fetch("/api/artworks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtwork),
      });
      createData = await createRes.json().catch(() => ({ success: false, reason: "תשובת שרת לא תקינה" }));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "נכשלה התקשורת עם השרת";
      setValidationError(`אירעה שגיאת תקשורת בפרסום היצירה: ${errMsg}`);
      setIsSubmitting(false);
      return;
    }

    if (!createRes.ok || !createData.success) {
      setValidationError(createData.reason || `שגיאה בפרסום היצירה בשרת (${createRes.status})`);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    // Navigate directly to published artwork page after confirmed success
    const encodedSlug = encodeURIComponent(slug);
    if (typeof window !== "undefined") {
      window.location.href = `${window.location.origin}/he/works/${encodedSlug}`;
    } else {
      router.push(`/works/${encodedSlug}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-panel border border-border bg-surface p-6 shadow-md md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5 mb-6">
        <div>
          <span className="inline-flex items-center rounded-full bg-sand px-3 py-1 text-caption font-semibold text-accent-strong">
            ✨ אזור אמן — העלאה ופרסום יצירה
          </span>
          <h1 className="mt-2 font-heading text-h1 font-medium text-text md:text-[2.2rem]">
            להעלות יצירה חדשה לגלריה
          </h1>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-control bg-sand px-3.5 py-1.5 text-small font-medium text-text hover:bg-stone/60 transition-colors"
        >
          ← חזרה
        </button>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div
          role="alert"
          className="mb-6 rounded-card border border-error/30 bg-error/10 p-4 text-small text-error font-medium"
        >
          ⚠️ {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Meta (Artist & Title) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="up-artist-name" className="block mb-1.5 text-small font-medium text-text">
              שם האמן / הסטודיו *
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
            <label htmlFor="up-title" className="block mb-1.5 text-small font-medium text-text">
              שם היצירה *
            </label>
            <input
              id="up-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="לדוגמה: קערת קרמיקה פיסולית בחול ומלח ים"
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>
        </div>

        {/* Story / Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="up-story" className="text-small font-semibold text-text">
              סיפור היצירה ותהליך הסטודיו (The Story) *
            </label>
            <span className="text-caption text-text-muted">יוצג בהבלטה בעמוד המוצר</span>
          </div>
          <textarea
            id="up-story"
            rows={4}
            required
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="שתפו את הקונים בסיפור מאחורי היצירה: מקור ההשראה, החומרים המקומיים, טכניקת העבודה בסטודיו והייחוד של החפץ..."
            className="w-full rounded-control border border-border bg-surface p-3.5 text-body placeholder:text-text-muted/60 focus:border-accent-strong focus:outline-none"
          />
        </div>

        {/* Real File Upload & Dropzone Area */}
        <div className="rounded-panel border border-border bg-sand/30 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="text-small font-semibold text-text">
                תמונות היצירה (חובה לפחות 2 תמונות) *
              </h3>
              <p className="text-caption text-text-muted">
                העלו תמונות באיכות גבוהה, תאורת סטודיו טובה ורקע ניטרלי.
              </p>
            </div>
            <span className="rounded-full bg-surface px-3 py-1 text-caption font-medium border border-border">
              {selectedImages.length} תמונות נבחרו
            </span>
          </div>

          {/* Hidden HTML File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Drag & Drop File Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-panel border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
              isDragOver
                ? "border-accent-strong bg-sand/80"
                : "border-stone/40 bg-surface hover:border-accent-strong hover:bg-sand/40"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand mb-2 text-2xl">
              📷
            </div>
            <p className="text-small font-semibold text-text">
              לחצו לבחירת תמונות מהמחשב/הטלפון או גררו לכאן קבצים
            </p>
            <p className="text-caption text-text-muted mt-1">
              תומך בפורמטים JPG, PNG, WebP, AVIF
            </p>
          </div>

          {/* Uploaded Images Preview Grid */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-4 pt-4 border-t border-border/60">
              {selectedImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`relative flex flex-col justify-between rounded-card border bg-surface p-2 transition-all ${
                    img.error ? "border-error bg-error/5" : "border-border hover:border-accent-strong"
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-artwork bg-stone/30 relative">
                    <img
                      src={img.url}
                      alt={`תצוגה מקדימה ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute start-2 top-2 rounded-full bg-deep/80 px-2 py-0.5 text-caption text-surface font-mono">
                      #{index + 1}
                    </span>
                    {img.isValidated && !img.error && (
                      <span className="absolute end-2 top-2 rounded-full bg-success text-surface p-1 text-[10px]" title="אושר במבחן איכות">
                        ✓
                      </span>
                    )}
                  </div>

                  {img.error && (
                    <p className="mt-1.5 text-caption font-medium text-error leading-snug">
                      ⚠️ {img.error}
                    </p>
                  )}

                  <div className="mt-2 space-y-1.5">
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                      placeholder="תיאור התמונה..."
                      className="w-full rounded-control border border-border px-2 py-1 text-caption text-text focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="w-full text-caption font-medium text-error hover:underline text-end block"
                    >
                      הסר תמונה
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing, Category, & Discipline */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="up-price" className="block mb-1.5 text-small font-medium text-text">
              מחיר (₪ כולל מע״מ 18%) *
            </label>
            <input
              id="up-price"
              type="number"
              dir="ltr"
              required
              min="10"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="up-category" className="block mb-1.5 text-small font-medium text-text">
              קטגוריית אמנות *
            </label>
            <select
              id="up-category"
              value={categoryLabel}
              onChange={(e) => {
                const val = e.target.value;
                setCategoryLabel(val);
                if (val.includes("קרמיקה")) setDiscipline("ceramics");
                else if (val.includes("תכשיט")) setDiscipline("jewelry");
                else if (val.includes("הדפס") || val.includes("ציור")) setDiscipline("painting");
                else if (val.includes("עץ")) setDiscipline("wood");
                else if (val.includes("טקסטיל")) setDiscipline("textile");
                else if (val.includes("פיסול")) setDiscipline("sculpture");
                else if (val.includes("יודאיקה")) setDiscipline("judaica");
              }}
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            >
              <option value="קרמיקה וקדרות">קרמיקה וקדרות</option>
              <option value="הדפס, איור וציור">הדפס, איור וציור</option>
              <option value="עיבוד עץ וטקסטיל">עיבוד עץ וטקסטיל</option>
              <option value="צורפות ותכשיטים">צורפות ותכשיטים</option>
              <option value="פיסול ואבן">פיסול ואבן</option>
              <option value="יודאיקה עכשווית">יודאיקה עכשווית</option>
            </select>
          </div>

          <div>
            <label htmlFor="up-inventory-kind" className="block mb-1.5 text-small font-medium text-text">
              סוג מלאי (Inventory Kind) *
            </label>
            <select
              id="up-inventory-kind"
              value={inventoryKind}
              onChange={(e) => {
                const kind = e.target.value as InventoryKind;
                setInventoryKind(kind);
                setAvailability("available");
              }}
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            >
              <option value="UNIQUE">UNIQUE (יצירה יחידה מסוגה - qty=1)</option>
              <option value="LIMITED_EDITION">LIMITED EDITION (מהדורה מוגבלת וממוספרת)</option>
              <option value="MADE_TO_ORDER">MADE TO ORDER (ייצור בהזמנה אישית)</option>
            </select>
          </div>
        </div>

        {/* Materials & Dimensions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="up-materials" className="block mb-1.5 text-small font-medium text-text">
              חומרים וטכניקה (מופרדים בפסיקים)
            </label>
            <input
              id="up-materials"
              type="text"
              value={materialsInput}
              onChange={(e) => setMaterialsInput(e.target.value)}
              placeholder="חימר מקומי, גלזורה, עץ אגוז..."
              className="min-h-11 w-full rounded-control border border-border bg-surface px-3.5 text-body focus:border-accent-strong focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="up-h" className="block mb-1 text-caption font-medium text-text">
                גובה (ס&quot;מ)
              </label>
              <input
                id="up-h"
                type="number"
                dir="ltr"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-2.5 text-small focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="up-w" className="block mb-1 text-caption font-medium text-text">
                רוחב (ס&quot;מ)
              </label>
              <input
                id="up-w"
                type="number"
                dir="ltr"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-2.5 text-small focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="up-d" className="block mb-1 text-caption font-medium text-text">
                עומק (ס&quot;מ)
              </label>
              <input
                id="up-d"
                type="number"
                dir="ltr"
                value={depthCm}
                onChange={(e) => setDepthCm(e.target.value)}
                className="min-h-11 w-full rounded-control border border-border bg-surface px-2.5 text-small focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-control px-4 py-2.5 text-small font-medium text-text hover:bg-sand transition-colors"
          >
            ביטול
          </button>

          <button
            type="submit"
            disabled={isValidating || isSubmitting}
            className="rounded-control bg-btn-primary px-6 py-2.5 text-body font-medium text-surface transition-colors hover:bg-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50"
          >
            {isValidating
              ? "🔍 מריץ אימות איכות תמונות..."
              : isSubmitting
              ? "מפרסם יצירה..."
              : "אימות תמונות ופרסום היצירה ✨"}
          </button>
        </div>
      </form>
    </div>
  );
}
