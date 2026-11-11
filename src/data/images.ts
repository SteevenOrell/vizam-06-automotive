import type { ImageSlot, VehicleImageRole } from "@/types";
import { vehicles } from "./vehicles";

/**
 * Image slot registry. Keys match the filenames in docs/image-requests/ (01-vehicle-sets.md and
 * 02-heroes-and-wheels.md). `src: null` means the asset is pending and `VehicleImage` renders a labelled
 * placeholder at the final aspect ratio. Step 2 (assets) sets `src` to compressed WebP files under
 * /public/images and records each one in docs/image-manifest.json.
 */
const ROLE_SIZES: Record<VehicleImageRole, { width: number; height: number; label: string }> = {
  hero: { width: 2800, height: 1575, label: "Cinematic hero" },
  profile: { width: 2400, height: 1350, label: "Side profile" },
  front: { width: 2400, height: 1350, label: "Front view" },
  rear: { width: 2400, height: 1350, label: "Rear three-quarter" },
  interior: { width: 2400, height: 1350, label: "Interior" },
  detail: { width: 1600, height: 1200, label: "Light blade detail" },
};

const STUDIO = { width: 2400, height: 1350 } as const;

const entries: [string, ImageSlot][] = [];

for (const v of vehicles) {
  const name = `ORVANE ${v.name} ${v.category.toLowerCase()}`;
  for (const role of Object.keys(v.images) as VehicleImageRole[]) {
    const size = ROLE_SIZES[role];
    entries.push([
      v.images[role],
      { src: null, alt: `${name}, ${size.label.toLowerCase()}`, width: size.width, height: size.height, label: size.label, model: v.slug },
    ]);
  }
  // Configurator stage: one front three-quarter per paint, one cabin view per interior.
  for (const c of v.colours) {
    entries.push([
      `${v.slug}-ext-${c.id}`,
      { src: null, alt: `${name} in ${c.name}, front three-quarter view`, ...STUDIO, label: `${c.name} exterior`, model: v.slug },
    ]);
  }
  for (const i of v.interiors) {
    entries.push([
      `${v.slug}-int-${i.id}`,
      { src: null, alt: `${name} cabin in ${i.name} trim`, ...STUDIO, label: `${i.name} interior`, model: v.slug },
    ]);
  }
  entries.push([
    `${v.slug}-detail-cabin`,
    { src: null, alt: `${name}, centre console detail`, width: 1600, height: 1200, label: "Cabin detail", model: v.slug },
  ]);
}

const siteSlots: Record<string, ImageSlot> = {
  "hero-home-desktop": { src: null, alt: "ORVANE Aren in Lunar Silver on a wet coastal road at blue hour", width: 2800, height: 1575, label: "Home hero" },
  "hero-home-mobile": { src: null, alt: "ORVANE Aren in Lunar Silver on a wet coastal road at blue hour", width: 1400, height: 1750, label: "Home hero (phone)" },
  "wheel-aero": { src: null, alt: "Aero 20-inch wheel with near-closed turbine face", width: 1400, height: 1400, label: "Aero wheel" },
  "wheel-blade": { src: null, alt: "Blade 21-inch wheel with ten thin spokes", width: 1400, height: 1400, label: "Blade wheel" },
  "wheel-forge": { src: null, alt: "Forge 22-inch wheel with five split spokes and amber ring", width: 1400, height: 1400, label: "Forge wheel" },
};

export const imageSlots: Record<string, ImageSlot> = { ...Object.fromEntries(entries), ...siteSlots };

export function getImageSlot(key: string): ImageSlot | undefined {
  return imageSlots[key];
}

/** Slot key for the configurator stage image of a model in a given paint. */
export const exteriorSlot = (slug: string, colourId: string) => `${slug}-ext-${colourId}`;
/** Slot key for the configurator cabin image of a model in a given interior. */
export const interiorSlot = (slug: string, interiorId: string) => `${slug}-int-${interiorId}`;
