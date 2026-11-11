import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Heroes use quality 85 so the 1672px sources stay crisp; everything else uses the default 75.
  images: {
    qualities: [75, 85],
    // The sources are at most 1672px wide (details 1448px), so never advertise larger candidates: browsers would otherwise
    // assume a 1920-3840px file and mis-size the srcset choice.
    deviceSizes: [640, 750, 828, 1080, 1200, 1448, 1672],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
