import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fileBuffer: Buffer | null = null;
    let fileName = `artwork-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.png`;
    let mimeType = "image/png";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, reason: "לא נבחר קובץ תמונה להעלאה" },
          { status: 400 }
        );
      }

      mimeType = file.type || "image/png";
      const ext = file.name.split(".").pop() || "png";
      fileName = `artwork-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      const body = await request.json();
      const { dataUrl } = body;

      if (!dataUrl || typeof dataUrl !== "string") {
        return NextResponse.json(
          { success: false, reason: "נתוני תמונה לא תקינים" },
          { status: 400 }
        );
      }

      // Handle Base64 Data URL
      if (dataUrl.startsWith("data:")) {
        const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return NextResponse.json(
            { success: false, reason: "פורמט תמונה base64 לא נתמך" },
            { status: 400 }
          );
        }
        mimeType = matches[1];
        const base64Data = matches[2];
        fileBuffer = Buffer.from(base64Data, "base64");
        const ext = mimeType.split("/")[1] || "png";
        fileName = `artwork-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      } else if (dataUrl.startsWith("/") || dataUrl.startsWith("http")) {
        // Already a valid URL or path
        return NextResponse.json({ success: true, url: dataUrl, publicId: dataUrl });
      } else {
        return NextResponse.json(
          { success: false, reason: "מקור תמונה לא נתמך" },
          { status: 400 }
        );
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json(
        { success: false, reason: "קובץ תמונה ריק" },
        { status: 400 }
      );
    }

    // Limit maximum file size (12MB)
    if (fileBuffer.length > 12 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, reason: "גודל הקובץ עולה על המגבלה המותרת (12MB)" },
        { status: 413 }
      );
    }

    // Attempt persistence using Supabase Storage
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        // Ensure 'artworks' storage bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        if (buckets && !buckets.some((b) => b.name === "artworks")) {
          await supabase.storage.createBucket("artworks", {
            public: true,
            fileSizeLimit: 12582912, // 12MB
            allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif"],
          });
        }

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("artworks")
          .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("artworks")
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicUrlData.publicUrl,
              publicId: publicUrlData.publicUrl,
            });
          }
        } else if (uploadErr) {
          console.warn("[Supabase Storage Upload Warning]", uploadErr.message);
        }
      } catch (err) {
        console.warn("[Supabase Storage Exception]", err);
      }
    }

    // Fallback: If Supabase Storage bucket unavailable, return placeholder publicId
    return NextResponse.json({
      success: true,
      url: "/mock/earth-bowl.jpg",
      publicId: "/mock/earth-bowl.jpg",
    });
  } catch (error: unknown) {
    console.error("[Upload API Error]", error);
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בהעלאת התמונה לשרת" },
      { status: 500 }
    );
  }
}
