import type { MetadataRoute } from "next";

// This is a concept site (VIZAM portfolio), so crawling is disallowed everywhere.
// To allow indexing, replace this with: { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` }
// and remove `robots: { index: false }` in src/app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
