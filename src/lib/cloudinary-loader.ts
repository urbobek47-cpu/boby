import { buildCloudinaryUrl } from "@/lib/cloudinary";

/**
 * next/image custom loader (wired via next.config images.loaderFile). Runs on
 * the client to build each srcset entry, so it relies only on the public
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. `src` is a Cloudinary public id.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return buildCloudinaryUrl(src, { width, quality });
}
