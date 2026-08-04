import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Pin the workspace root to this app. Without it Next walks up and picks
  // /Users/amirbaram/package-lock.json, which can misresolve fonts/assets.
  turbopack: { root: import.meta.dirname },

  // Cloudinary delivery (§3, §5.4). A custom loader builds every srcset URL,
  // so Vercel's built-in optimiser is bypassed entirely. Widths are capped at
  // 2400 (the §5.4 long-edge limit) — the loader also enforces it defensively.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2400],
    imageSizes: [64, 96, 128, 256, 384],
  },
};

export default withNextIntl(nextConfig);
