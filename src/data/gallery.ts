import type { GalleryKind } from "@/lib/gallery";
import type { VehicleSlug } from "@/types";

/**
 * Curated gallery: one or two paints per model, every view, interior and detail once. The order interleaves models and
 * subjects so neighbouring tiles differ. Images are AI-generated for this concept (see docs/ASSET_LICENSES.md).
 * `meta` names model, colour and view as the lightbox shows them. Paint is stated only where the registry knows it.
 */
export interface GalleryEntry {
  slot: string;
  caption: string;
  meta: string;
  kind: GalleryKind;
  model?: VehicleSlug;
  /** Overrides the slot's alt text where the registry's generic text would be wrong. */
  alt?: string;
}

export const galleryEntries: readonly GalleryEntry[] = [
  { slot: "hero-sola", caption: "Sola at dusk", meta: "Sola · Rear three-quarter · Mountain pass", kind: "exterior", model: "sola", alt: "ORVANE Sola performance SUV seen from the rear on a wet mountain road at dusk, with a continuous red light line" },
  { slot: "ed-cockpit-night", caption: "Cockpit at night", meta: "Aren · Cabin · Driver's view", kind: "interior", model: "aren" },
  { slot: "vire-detail-light", caption: "Light blade", meta: "Vire · Light signature · Detail", kind: "detail", model: "vire" },
  { slot: "tarn-ext-lunar-silver", caption: "Tarn, head on", meta: "Tarn · Lunar Silver · Front three-quarter", kind: "exterior", model: "tarn" },
  { slot: "aren-view-side", caption: "Aren in profile", meta: "Aren · Lunar Silver · Side profile", kind: "exterior", model: "aren" },
  { slot: "sola-int-dune", caption: "Dune cabin", meta: "Sola · Dune interior", kind: "interior", model: "sola" },
  { slot: "hero-vire", caption: "Vire at dusk", meta: "Vire · Ember · Side profile · Concrete courtyard", kind: "exterior", model: "vire", alt: "ORVANE Vire two-door coupe in Ember paint, side profile, parked in a concrete courtyard at dusk" },
  { slot: "aren-detail-cabin", caption: "Centre console", meta: "Aren · Cabin · Detail", kind: "detail", model: "aren" },
  { slot: "ed-atelier", caption: "The atelier", meta: "Aren · Glacier White · Assembly atelier", kind: "scene", model: "aren" },
  { slot: "vanta-view-side", caption: "Vanta in profile", meta: "Vanta · Lunar Silver · Side profile", kind: "exterior", model: "vanta" },
  { slot: "vire-view-front", caption: "Vire head on", meta: "Vire · Lunar Silver · Front three-quarter", kind: "exterior", model: "vire" },
  { slot: "sola-detail-light", caption: "Light signature", meta: "Sola · Light signature · Detail", kind: "detail", model: "sola" },
  { slot: "aren-int-onyx", caption: "Onyx cabin", meta: "Aren · Onyx interior", kind: "interior", model: "aren" },
  { slot: "sola-view-front", caption: "Sola head on", meta: "Sola · Lunar Silver · Front three-quarter", kind: "exterior", model: "sola" },
  { slot: "ed-battery-module", caption: "Battery module", meta: "Platform · Machined aluminium · Detail", kind: "detail" },
  { slot: "vanta-int-onyx", caption: "Vanta cockpit", meta: "Vanta · Onyx interior", kind: "interior", model: "vanta" },
  { slot: "vire-int-ember", caption: "Ember cabin", meta: "Vire · Ember interior", kind: "interior", model: "vire" },
  { slot: "hero-aren", caption: "Aren, head on", meta: "Aren · Front view · Studio", kind: "exterior", model: "aren", alt: "ORVANE Aren grand touring sedan seen head on in a pale studio, with one continuous light blade across the nose" },
  { slot: "sola-detail-cabin", caption: "Cabin detail", meta: "Sola · Centre console · Detail", kind: "detail", model: "sola" },
  { slot: "ed-track-vire", caption: "Vire on track", meta: "Vire · Ember · Circuit at golden hour", kind: "scene", model: "vire" },
  { slot: "aren-ext-tide-blue", caption: "Aren in Tide Blue", meta: "Aren · Tide Blue · Front three-quarter", kind: "exterior", model: "aren" },
  { slot: "tarn-view-rear", caption: "Tarn from behind", meta: "Tarn · Lunar Silver · Rear three-quarter", kind: "exterior", model: "tarn" },
  { slot: "vire-detail-cabin", caption: "Coupe cabin", meta: "Vire · Centre console · Detail", kind: "detail", model: "vire" },
  { slot: "sola-view-side", caption: "Sola in profile", meta: "Sola · Lunar Silver · Side profile", kind: "exterior", model: "sola" },
  { slot: "hero-home-mobile", caption: "Coastal road", meta: "Aren · Lunar Silver · Wet road at blue hour", kind: "scene", model: "aren" },
  { slot: "vire-view-rear", caption: "Vire from behind", meta: "Vire · Lunar Silver · Rear three-quarter", kind: "exterior", model: "vire" },
  { slot: "aren-detail-light", caption: "Light blade", meta: "Aren · Light signature · Detail", kind: "detail", model: "aren" },
  { slot: "vanta-ext-lunar-silver", caption: "Vanta, head on", meta: "Vanta · Lunar Silver · Front three-quarter", kind: "exterior", model: "vanta" },
  { slot: "sola-ext-ember", caption: "Sola in Ember", meta: "Sola · Ember · Front three-quarter", kind: "exterior", model: "sola" },
  { slot: "ed-founding-garage", caption: "The founding garage", meta: "Workshop at dusk · Concept story", kind: "scene" },
  { slot: "aren-view-rear", caption: "Aren from behind", meta: "Aren · Lunar Silver · Rear three-quarter", kind: "exterior", model: "aren" },
  { slot: "wheel-forge", caption: "Forge 22 wheel", meta: "Wheels · Forge 22 · Detail", kind: "detail" },
  { slot: "vire-ext-glacier-white", caption: "Vire in Glacier White", meta: "Vire · Glacier White · Front three-quarter", kind: "exterior", model: "vire" },
  { slot: "tarn-int-onyx", caption: "Tarn cabin", meta: "Tarn · Onyx interior", kind: "interior", model: "tarn" },
  { slot: "ed-coast-road", caption: "Coast road", meta: "Aren · Aerial · Blue hour", kind: "scene", model: "aren" },
  { slot: "ed-brake-detail", caption: "Brake detail", meta: "Wheels · Brake and spokes · Detail", kind: "detail" },
  { slot: "tarn-ext-tide-blue", caption: "Tarn in Tide Blue", meta: "Tarn · Tide Blue · Front three-quarter", kind: "exterior", model: "tarn" },
  { slot: "vanta-ext-ember", caption: "Vanta in Ember", meta: "Vanta · Ember · Front three-quarter", kind: "exterior", model: "vanta" },];

/** Film strip: the making of the car, from the sketch to the platform. Not repeated in the grid. */
export const filmStripSlots: readonly { slot: string; caption: string }[] = [
  { slot: "ed-sketch-desk", caption: "Sketches and swatches" },
  { slot: "ed-clay-studio", caption: "Clay model" },
  { slot: "ed-wind-tunnel", caption: "Wind tunnel" },
  { slot: "ed-lab-light", caption: "Light lab" },
  { slot: "ed-platform", caption: "The platform" },
];
