import type { Metadata } from "next";
import { SITE } from "@/data/site";

const OG_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "ORVANE: a fictional electric performance car brand, a VIZAM concept project." };

/**
 * Per-route metadata with matching Open Graph and Twitter tags. Pages that set their own openGraph object replace the
 * layout's one (Next merges shallowly), so every route builds its tags here. The share image comes from the
 * opengraph-image / twitter-image file conventions in src/app.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE.name, locale: "en_CA", title: fullTitle, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}
