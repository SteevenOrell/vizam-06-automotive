import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { compareBars, driveLayouts, specRange } from "./editorial";

describe("editorial helpers", () => {
  it("finds ranges across every trim", () => {
    expect(specRange(vehicles, "batteryKwh")).toEqual([88, 122]);
    expect(specRange(vehicles, "powerKw")).toEqual([390, 720]);
  });
  it("groups trims by drive layout in order and keeps every trim", () => {
    const groups = driveLayouts(vehicles);
    expect(groups.map((g) => g.layout)).toEqual(["RWD", "Dual-motor AWD", "Tri-motor AWD"]);
    expect(groups.reduce((n, g) => n + g.trims.length, 0)).toBe(vehicles.flatMap((v) => v.trims).length);
  });
  it("normalises comparison bars so the best model is 100", () => {
    const bars = compareBars(vehicles.map((v) => ({ slug: v.slug, name: v.name, specs: v.specs })));
    expect(Math.max(...bars.map((b) => b.rangePct))).toBe(100);
    expect(Math.max(...bars.map((b) => b.accelPct))).toBe(100);
    const vire = bars.find((b) => b.slug === "vire")!;
    expect(vire.accelPct).toBe(100);
    expect(vire.rangePct).toBeLessThan(100);
  });
});
