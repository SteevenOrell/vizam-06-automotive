import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy. The site is statically prerendered (Cache Components), and a nonce-based policy needs a fresh
 * render per request, so these two compromises are kept and documented:
 *  - script-src 'unsafe-inline': Next's own inline bootstrap / RSC payload scripts and the small motion-guard script in
 *    layout.tsx are inline; static HTML cannot carry a per-request nonce.
 *  - style-src 'unsafe-inline': next/font, next/image and React style props emit inline styles.
 * Everything else is locked to same-origin: no third-party scripts, styles, fonts, images or connections. Dev adds
 * 'unsafe-eval' and ws: for React refresh only.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
