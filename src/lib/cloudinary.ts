/**
 * Cloudinary delivery (BUILD-PLAN §3 locked choice; §5.4 image rules).
 *
 * Images are referenced by Cloudinary **public id** in the data; this builds the
 * delivery URL with the transformations §5.4 requires. Vercel's built-in
 * optimiser is deliberately not used — it gets expensive on an image-heavy
 * catalogue.
 *
 * CLOUD NAME comes from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. It defaults to the
 * public `demo` cloud so the storefront renders real photos out of the box for
 * review — set it to BOBY's real cloud and the same public ids resolve there.
 */
export const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";

/** Long-edge resolution cap — §5.4 anti-theft: enough for zoom, useless for print forgery. */
export const MAX_EDGE = 2400;

type BuildOpts = { width: number; quality?: number };

/**
 * §5.4 format policy encoded via the requested quality:
 *  - quality >= 80  → detail/zoom view: high-quality WebP (NOT blanket AVIF,
 *    which bands subtle pigment gradients), and keep IPTC copyright metadata
 *    on this derivative.
 *  - otherwise       → thumbnails/grids: f_auto (AVIF where supported).
 * c_limit never upscales and caps both edges at MAX_EDGE.
 */
export function buildCloudinaryUrl(publicId: string, { width, quality }: BuildOpts): string {
  // Pass through absolute URLs and local static assets (e.g. /mock/*.jpg used
  // as preview placeholders in development) unchanged. Real photos are
  // Cloudinary public ids and take the transform path below.
  if (/^(https?:\/\/|\/)/.test(publicId)) return publicId;

  const w = Math.min(width, MAX_EDGE);
  const isDetail = (quality ?? 0) >= 80;

  const transforms = [
    `c_limit,w_${w},h_${MAX_EDGE}`, // cap long edge at 2400, never upscale
    `q_${quality ?? "auto:good"}`,
    isDetail ? "f_webp" : "f_auto",
    "dpr_auto",
    ...(isDetail ? ["fl_keep_iptc"] : []), // preserve copyright metadata on the detail derivative
  ].join(",");

  const id = publicId.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${id}`;
}
