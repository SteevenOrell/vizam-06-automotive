import type { VehicleSlug } from "@/types";

export type GalleryKind = "exterior" | "interior" | "detail" | "scene";

/** A gallery image ready to render: the registry slot resolved to file, size and text. */
export interface GalleryTile {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short title, e.g. "Sola at dusk". */
  caption: string;
  /** Model, colour and view, e.g. "Sola · Ember · Front three-quarter". */
  meta: string;
  kind: GalleryKind;
  model?: VehicleSlug;
}

export const GALLERY_FILTERS = [
  { id: "all", label: "All" },
  { id: "aren", label: "Aren" },
  { id: "sola", label: "Sola" },
  { id: "vire", label: "Vire" },
  { id: "tarn", label: "Tarn" },
  { id: "vanta", label: "Vanta" },
  { id: "interior", label: "Interior" },
  { id: "detail", label: "Detail" },
  { id: "scene", label: "Atelier & road" },
] as const;

export type GalleryFilterId = (typeof GALLERY_FILTERS)[number]["id"];

export function isGalleryFilter(value: unknown): value is GalleryFilterId {
  return GALLERY_FILTERS.some((f) => f.id === value);
}

/** Model chips match the pictured model; kind chips match the type of image; "all" keeps everything. */
export function matchesFilter(tile: Pick<GalleryTile, "kind" | "model">, filter: GalleryFilterId): boolean {
  if (filter === "all") return true;
  if (filter === "aren" || filter === "sola" || filter === "vire" || filter === "tarn" || filter === "vanta") return tile.model === filter;
  return tile.kind === filter;
}

export function filterGallery<T extends Pick<GalleryTile, "kind" | "model">>(tiles: readonly T[], filter: GalleryFilterId): T[] {
  return tiles.filter((t) => matchesFilter(t, filter));
}

export function countByFilter(tiles: readonly Pick<GalleryTile, "kind" | "model">[]): Record<GalleryFilterId, number> {
  const counts = {} as Record<GalleryFilterId, number>;
  for (const f of GALLERY_FILTERS) counts[f.id] = filterGallery(tiles, f.id).length;
  return counts;
}

/** Previous/next index that wraps around the ends (lightbox arrows). */
export function wrapIndex(index: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return (((index + delta) % length) + length) % length;
}

/** -1, 1 or 0 for a horizontal swipe: needs a clearly horizontal move of at least `threshold` px. */
export function swipeDirection(dx: number, dy: number, threshold = 50): -1 | 0 | 1 {
  if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.2) return 0;
  return dx < 0 ? 1 : -1;
}
