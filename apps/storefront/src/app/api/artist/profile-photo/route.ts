import { NextResponse } from "next/server";
import { getSupabaseClient, updateArtistProfilePhotoDb, getArtistProfilePhotoDb } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistSlug = searchParams.get("artistSlug");
    if (!artistSlug) {
      return NextResponse.json({ success: false, reason: "חסר זיהוי משתמש" }, { status: 400 });
    }
    const avatarUrl = await getArtistProfilePhotoDb(artistSlug);
    return NextResponse.json({ success: true, avatarUrl });
  } catch (error: unknown) {
    console.error("[Profile Photo GET API Error]", error);
    return NextResponse.json({ success: false, avatarUrl: null });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fileBuffer: Buffer | null = null;
    let fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.png`;
    let mimeType = "image/png";
    let artistSlug = "boby-artist";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const slugInput = formData.get("artistSlug") as string | null;
      if (slugInput) artistSlug = slugInput;

      if (!file) {
        return NextResponse.json(
          { success: false, reason: "לא נבחר קובץ תמונה להעלאה" },
          { status: 400 }
        );
      }

      mimeType = file.type || "image/png";
      if (!allowedTypes.includes(mimeType.toLowerCase())) {
        return NextResponse.json(
          { success: false, reason: "פורמט תמונה לא נתמך. יתקבלו קבצי JPG, PNG, WebP או AVIF בלבד" },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop() || "png";
      fileName = `avatar-${artistSlug.split("@")[0]}-${Date.now()}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      const body = await request.json();
      const { dataUrl, artistSlug: slugInput } = body;
      if (slugInput) artistSlug = slugInput;

      if (!dataUrl || typeof dataUrl !== "string") {
        return NextResponse.json(
          { success: false, reason: "נתוני תמונה לא תקינים" },
          { status: 400 }
        );
      }

      if (dataUrl.startsWith("data:")) {
        const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return NextResponse.json(
            { success: false, reason: "פורמט תמונה base64 לא נתמך" },
            { status: 400 }
          );
        }
        mimeType = matches[1];
        if (!allowedTypes.includes(mimeType.toLowerCase())) {
          return NextResponse.json(
            { success: false, reason: "פורמט תמונה לא נתמך. יתקבלו קבצי JPG, PNG, WebP או AVIF בלבד" },
            { status: 400 }
          );
        }
        const base64Data = matches[2];
        fileBuffer = Buffer.from(base64Data, "base64");
        const ext = mimeType.split("/")[1] || "png";
        fileName = `avatar-${artistSlug.split("@")[0]}-${Date.now()}.${ext}`;
      } else if (dataUrl.startsWith("http") || dataUrl.startsWith("/")) {
        // Direct URL passed
        await updateArtistProfilePhotoDb(artistSlug, dataUrl);
        return NextResponse.json({ success: true, avatarUrl: dataUrl });
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

    // Limit maximum file size to 5MB for profile photos
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fileBuffer.length > MAX_SIZE) {
      return NextResponse.json(
        { success: false, reason: "גודל תמונת הפרופיל עולה על המגבלה המותרת (5MB)" },
        { status: 413 }
      );
    }

    // Attempt persistence using Supabase Storage
    const supabase = getSupabaseClient();
    let publicUrl: string | null = null;

    if (supabase) {
      try {
        // Ensure bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketName = "avatars";
        if (buckets && !buckets.some((b) => b.name === bucketName)) {
          await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: MAX_SIZE,
            allowedMimeTypes: allowedTypes,
          });
        }

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            publicUrl = publicUrlData.publicUrl;
          }
        } else if (uploadErr) {
          console.warn("[Supabase Avatar Storage Upload Warning]", uploadErr.message);
          // Fallback to storing base64 if storage write fails
          publicUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
        }
      } catch (err) {
        console.warn("[Supabase Avatar Storage Exception]", err);
        publicUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
      }
    } else {
      // Storage unavailable fallback
      publicUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
    }

    if (publicUrl) {
      await updateArtistProfilePhotoDb(artistSlug, publicUrl);
      return NextResponse.json({
        success: true,
        avatarUrl: publicUrl,
      });
    }

    return NextResponse.json(
      { success: false, reason: "שגיאה בשמירת תמונת הפרופיל" },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error("[Profile Photo Upload API Error]", error);
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בהעלאת תמונת הפרופיל" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const artistSlug = body.artistSlug || "boby-artist";

    await updateArtistProfilePhotoDb(artistSlug, null);

    return NextResponse.json({
      success: true,
      avatarUrl: null,
    });
  } catch (error: unknown) {
    console.error("[Profile Photo Delete API Error]", error);
    return NextResponse.json(
      { success: false, reason: "אירעה שגיאה בהסרת תמונת הפרופיל" },
      { status: 500 }
    );
  }
}
