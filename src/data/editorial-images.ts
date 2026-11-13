import { getImageSlot } from "./images";

/**
 * Editorial scenes come from a separate image run (docs/image-requests/03-editorial.md). When a scene has no
 * delivered file yet, the page falls back to a suitable existing vehicle image so no placeholder ever ships.
 * All twelve scenes are delivered and wired, so no page currently uses a fallback; the map is a safety net for re-runs.
 */
export const EDITORIAL_FALLBACKS: Record<string, string> = {
  "ed-platform": "aren-view-side",
  "ed-battery-module": "aren-detail-light",
  "ed-cockpit-night": "aren-int-onyx",
  "ed-wind-tunnel": "aren-view-side",
  "ed-lab-light": "vire-detail-light",
  "ed-track-vire": "hero-vire",
  "ed-brake-detail": "wheel-blade",
  "ed-clay-studio": "aren-view-front",
  "ed-sketch-desk": "aren-view-rear",
  "ed-atelier": "aren-ext-glacier-white",
  "ed-founding-garage": "sola-view-rear",
  "ed-coast-road": "hero-home-desktop",
};

export interface ResolvedImage {
  slot: string;
  alt: string;
  fallback: boolean;
}

type SlotLookup = (key: string) => { src: string | null; alt: string } | undefined;

/** Slot key and alt text to render for an editorial image: the scene itself, or its fallback while the file is missing. */
export function editorialImage(key: string, lookup: SlotLookup = getImageSlot): ResolvedImage {
  const own = lookup(key);
  if (own?.src) return { slot: key, alt: own.alt, fallback: false };
  const fallbackKey = EDITORIAL_FALLBACKS[key];
  const fallback = fallbackKey ? lookup(fallbackKey) : undefined;
  if (fallbackKey && fallback?.src) return { slot: fallbackKey, alt: fallback.alt, fallback: true };
  throw new Error(`No image or fallback for editorial slot "${key}"`);
}

/** Like `editorialImage`, but also accepts a plain vehicle slot key (used as is). An explicit `alt` always wins. */
export function resolveImage(key: string, alt?: string, lookup: SlotLookup = getImageSlot): ResolvedImage {
  if (key.startsWith("ed-")) {
    const r = editorialImage(key, lookup);
    return alt && r.fallback === false ? { ...r, alt } : r;
  }
  const slot = lookup(key);
  if (!slot?.src) throw new Error(`Image slot "${key}" has no file`);
  return { slot: key, alt: alt ?? slot.alt, fallback: false };
}

/** Plain file props for client components that render next/image themselves. */
export function imageProps(key: string, alt?: string): { src: string; width: number; height: number; alt: string } {
  const r = resolveImage(key, alt);
  const slot = getImageSlot(r.slot);
  if (!slot?.src) throw new Error(`Image slot "${r.slot}" has no file`);
  return { src: slot.src, width: slot.width, height: slot.height, alt: r.alt };
}
