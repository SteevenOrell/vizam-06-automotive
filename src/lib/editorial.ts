import type { DriveLayout, Vehicle, VehicleSpecs } from "@/types";

/** All trims of all vehicles, with the owning model's name. */
export function allTrims(vehicles: readonly Vehicle[]) {
  return vehicles.flatMap((v) => v.trims.map((t) => ({ model: v.name, slug: v.slug, trim: t.name, specs: t.specs })));
}

/** Lowest and highest value of one numeric spec across every trim. */
export function specRange(vehicles: readonly Vehicle[], key: "powerKw" | "zeroToHundredS" | "rangeKm" | "topSpeedKmh" | "batteryKwh"): [number, number] {
  const values = allTrims(vehicles).map((t) => t.specs[key]);
  return [Math.min(...values), Math.max(...values)];
}

export interface LayoutGroup {
  layout: DriveLayout;
  trims: { model: string; trim: string; powerKw: number }[];
}

const LAYOUT_ORDER: DriveLayout[] = ["RWD", "Dual-motor AWD", "Tri-motor AWD"];

/** Trims grouped by drive layout, in RWD, dual, tri order; layouts nobody uses are left out. */
export function driveLayouts(vehicles: readonly Vehicle[]): LayoutGroup[] {
  return LAYOUT_ORDER.map((layout) => ({
    layout,
    trims: allTrims(vehicles)
      .filter((t) => t.specs.drive === layout)
      .map((t) => ({ model: t.model, trim: t.trim, powerKw: t.specs.powerKw })),
  })).filter((g) => g.trims.length > 0);
}

export interface CompareBar {
  slug: string;
  name: string;
  rangeKm: number;
  zeroToHundredS: number;
  /** 0-100: range relative to the longest-range model. */
  rangePct: number;
  /** 0-100: quickness relative to the quickest model (shorter time = longer bar). */
  accelPct: number;
}

/** Bar lengths for the range / acceleration comparison, from each model's entry-trim specs. */
export function compareBars(items: readonly { slug: string; name: string; specs: Pick<VehicleSpecs, "rangeKm" | "zeroToHundredS"> }[]): CompareBar[] {
  const maxRange = Math.max(...items.map((i) => i.specs.rangeKm));
  const minTime = Math.min(...items.map((i) => i.specs.zeroToHundredS));
  return items.map((i) => ({
    slug: i.slug,
    name: i.name,
    rangeKm: i.specs.rangeKm,
    zeroToHundredS: i.specs.zeroToHundredS,
    rangePct: Math.round((i.specs.rangeKm / maxRange) * 1000) / 10,
    accelPct: Math.round((minTime / i.specs.zeroToHundredS) * 1000) / 10,
  }));
}
