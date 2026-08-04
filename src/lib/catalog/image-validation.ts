/**
 * Mock AI Image Quality Validation Engine for BOBY (§5.4).
 *
 * Ensures all uploaded artwork images meet gallery standards:
 * - High resolution & sharpness
 * - Balanced studio lighting without harsh glare/reflections
 * - Flattering & undistorted angle
 * - Minimalist / neutral background (white, sand, earth tone)
 */

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  metrics?: {
    lightingScore: number; // 0-100
    backgroundScore: number; // 0-100
    sharpnessScore: number; // 0-100
  };
}

export async function validateArtworkImage(
  imageSource: File | string
): Promise<ValidationResult> {
  // Simulate AI model inference delay (300ms)
  await new Promise((resolve) => setTimeout(resolve, 350));

  const fileName = typeof imageSource === "string" ? imageSource : imageSource.name;
  const lowerName = fileName.toLowerCase();

  // Test triggers for mock rejection
  const triggersRejection =
    lowerName.includes("dark") ||
    lowerName.includes("blur") ||
    lowerName.includes("bad") ||
    lowerName.includes("glare") ||
    lowerName.includes("cluttered") ||
    lowerName.includes("fail");

  if (triggersRejection) {
    return {
      valid: false,
      reason:
        "התמונה לא עומדת בסטנדרט. אנא העלה תמונה איכותית, עם תאורה טובה ורקע ניטרלי.",
      metrics: {
        lightingScore: 42,
        backgroundScore: 38,
        sharpnessScore: 55,
      },
    };
  }

  return {
    valid: true,
    metrics: {
      lightingScore: 94,
      backgroundScore: 98,
      sharpnessScore: 92,
    },
  };
}
