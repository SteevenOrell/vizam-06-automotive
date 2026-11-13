import type { ImageSlot, VehicleImageRole } from "@/types";
import { imageAssets } from "./image-assets";
import { vehicles } from "./vehicles";

/**
 * Image slot registry. Keys match the filenames in docs/image-requests/ (01-vehicle-sets.md and
 * 02-heroes-and-wheels.md). Real files and sizes come from ./image-assets (compressed WebP under /public/images, listed in
 * docs/image-manifest.json). `src: null` means a slot has no asset and `VehicleImage` renders a labelled
 * placeholder at the final aspect ratio.
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

const ED = { width: 1672, height: 941 } as const;

/** Editorial scenes (docs/image-requests/03-editorial.md). `src` arrives through ./image-assets; see ./editorial-images for fallbacks. */
const editorialSlots: Record<string, ImageSlot> = {
  "ed-platform": { src: null, alt: "Bare ORVANE electric platform seen from above: flat battery pack between the axles, motors, suspension and wheels, with an amber glow along the battery edge", ...ED, label: "Platform" },
  "ed-battery-module": { src: null, alt: "Macro view of a machined aluminium battery module with cooling channels on a dark workbench", ...ED, label: "Battery module" },
  "ed-cockpit-night": { src: null, alt: "Driver's view of the ORVANE Aren cabin at night: slim dashboard, one wide display with a soft amber light wave and a dark road ahead", ...ED, label: "Cockpit at night" },
  "ed-wind-tunnel": { src: null, alt: "ORVANE Aren in a wind tunnel with thin white smoke streamlines flowing over the roofline", ...ED, label: "Wind tunnel" },
  "ed-lab-light": { src: null, alt: "Light-engineering lab with a full-width light blade unit glowing warm white on a test rig", ...ED, label: "Light lab" },
  "ed-track-vire": { src: null, alt: "ORVANE Vire in Ember cornering on an empty circuit at golden hour", ...ED, label: "Vire on track" },
  "ed-brake-detail": { src: null, alt: "Brake disc and plain dark caliper seen through thin silver wheel spokes", ...ED, label: "Brake detail" },
  "ed-clay-studio": { src: null, alt: "Full-size clay model of the Aren in a design studio, half clay and half silver film, with a designer seen from behind", ...ED, label: "Clay studio" },
  "ed-sketch-desk": { src: null, alt: "Designer's desk seen from above with pencil sketches of a low sedan and material swatches", ...ED, label: "Sketch desk" },
  "ed-atelier": { src: null, alt: "Calm assembly atelier with polished concrete floor, skylights and one Aren in Glacier White on a low platform", ...ED, label: "Atelier" },
  "ed-founding-garage": { src: null, alt: "Small workshop at dusk with a car under a grey dust sheet, a workbench, one warm lamp and the door open to a coastal road", ...ED, label: "Founding garage" },
  "ed-coast-road": { src: null, alt: "Aerial view of an empty coastal road at blue hour with one small silver sedan and a thin line of headlight", ...ED, label: "Coast road" },
};

const allSlots: Record<string, ImageSlot> = { ...Object.fromEntries(entries), ...siteSlots, ...editorialSlots };

/** Slots with a delivered file get its path and real pixel size; the rest stay placeholders (src: null). */
export const imageSlots: Record<string, ImageSlot> = Object.fromEntries(
  Object.entries(allSlots).map(([key, slot]) => [key, imageAssets[key] ? { ...slot, ...imageAssets[key] } : slot]),
);

export function getImageSlot(key: string): ImageSlot | undefined {
  return imageSlots[key];
}

/** Slot key for the configurator stage image of a model in a given paint. */
export const exteriorSlot = (slug: string, colourId: string) => `${slug}-ext-${colourId}`;
/** Slot key for the configurator cabin image of a model in a given interior. */
export const interiorSlot = (slug: string, interiorId: string) => `${slug}-int-${interiorId}`;
