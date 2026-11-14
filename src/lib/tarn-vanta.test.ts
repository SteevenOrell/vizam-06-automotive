import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getImageSlot } from "@/data/images";
import { getVehicle, vehicles } from "@/data/vehicles";
import {
  availableAngles,
  getDefaultConfig,
  getPriceBreakdown,
  getPackageState,
  getStageSlot,
  getTotalPrice,
  repairConfig,
  setOption,
  togglePackage,
} from "./configurator";

describe("every model's images", () => {
  it.each(vehicles.map((v) => [v.slug, v] as const))("%s: each paint, interior and view role resolves to a file on disk", (_, v) => {
    const slots = [
      ...v.colours.map((c) => `${v.slug}-ext-${c.id}`),
      ...v.interiors.map((i) => `${v.slug}-int-${i.id}`),
      ...Object.values(v.images),
      ...v.content.gallery.map((g) => g.slot),
    ];
    for (const key of slots) {
      const slot = getImageSlot(key);
      expect(slot?.src, key).toBeTruthy();
      expect(existsSync(join(process.cwd(), "public", slot!.src!)), `${key} file`).toBe(true);
      expect(slot!.alt.length, `${key} alt`).toBeGreaterThan(10);
    }
  });
});

describe("Tarn", () => {
  const tarn = getVehicle("tarn")!;
  it("starts at the concept base price and offers the five shared paints and three cabins", () => {
    expect(tarn.category).toBe("Electric pickup");
    expect(getTotalPrice(getDefaultConfig("tarn"))).toBe(98000);
    expect(tarn.colours.map((c) => c.id)).toEqual(["lunar-silver", "glacier-white", "basalt-black", "tide-blue", "ember"]);
    expect(tarn.interiors.map((i) => i.id)).toEqual(["onyx", "dune", "ember"]);
  });

  it("adds trim, wheel and package deltas", () => {
    let c = setOption(getDefaultConfig("tarn"), "trim", "tarn-summit");
    c = setOption(c, "wheels", "forge");
    c = togglePackage(c, "tarn-winter");
    expect(getPriceBreakdown(c).total).toBe(98000 + 30000 + 5200 + 2000);
  });

  it("includes the Tow package in the Haul trim at no cost", () => {
    const c = setOption(getDefaultConfig("tarn"), "trim", "tarn-haul");
    expect(getPackageState(c, "tarn-tow").selected).toBe(true);
    expect(getTotalPrice(togglePackage(c, "tarn-tow"))).toBe(98000 + 14000);
  });

  it("requires Bed Utility for Worksite Power", () => {
    const base = getDefaultConfig("tarn");
    expect(getPackageState(base, "tarn-power").disabled).toBe(true);
    const c = togglePackage(togglePackage(base, "tarn-utility"), "tarn-power");
    expect(c.packages).toEqual(["tarn-utility", "tarn-power"]);
    // removing the requirement drops the dependent package
    expect(togglePackage(c, "tarn-utility").packages).toEqual([]);
  });

  it("has no straight-front image, so the Front view is unavailable in the configurator", () => {
    expect(availableAngles(getDefaultConfig("tarn"))).toEqual(["front34", "rear", "side"]);
    expect(getStageSlot(getDefaultConfig("tarn"), "exterior")).toBe("tarn-ext-lunar-silver");
  });

  it("repairs a saved config that names a paint Tarn does not offer", () => {
    const repaired = repairConfig({ ...getDefaultConfig("tarn"), colour: "neon-pink", interior: "velvet" });
    expect(repaired?.colour).toBe("lunar-silver");
    expect(repaired?.interior).toBe("onyx");
  });
});

describe("Vanta", () => {
  const vanta = getVehicle("vanta")!;
  it("starts at the concept base price and offers the five shared paints and three cabins", () => {
    expect(vanta.category).toBe("Track coupé");
    expect(getTotalPrice(getDefaultConfig("vanta"))).toBe(235000);
    expect(vanta.colours).toHaveLength(5);
    expect(vanta.interiors).toHaveLength(3);
    expect(getTotalPrice(setOption(getDefaultConfig("vanta"), "colour", "ember"))).toBe(235000 + 7200);
  });

  it("includes Carbon Aero in Circuit, and Carbon Aero plus Track in Apex", () => {
    const circuit = setOption(getDefaultConfig("vanta"), "trim", "vanta-circuit");
    expect(getTotalPrice(circuit)).toBe(235000 + 38000);
    const apex = setOption(getDefaultConfig("vanta"), "trim", "vanta-apex");
    expect(getPackageState(apex, "vanta-carbon").selected).toBe(true);
    expect(getPackageState(apex, "vanta-track").selected).toBe(true);
    expect(getTotalPrice(apex)).toBe(235000 + 72000);
  });

  it("blocks Road Comfort when Track is chosen, in both directions", () => {
    const track = togglePackage(getDefaultConfig("vanta"), "vanta-track");
    expect(getPackageState(track, "vanta-road").disabled).toBe(true);
    const road = togglePackage(getDefaultConfig("vanta"), "vanta-road");
    expect(getPackageState(road, "vanta-track").disabled).toBe(true);
  });

  it("requires Carbon Aero for Max Downforce and prices the stack", () => {
    const base = getDefaultConfig("vanta");
    expect(getPackageState(base, "vanta-downforce").disabled).toBe(true);
    const c = togglePackage(togglePackage(base, "vanta-carbon"), "vanta-downforce");
    expect(getTotalPrice(c)).toBe(235000 + 9400 + 6800);
  });

  it("offers all four views", () => {
    expect(availableAngles(getDefaultConfig("vanta"))).toEqual(["front34", "rear", "side", "front"]);
  });
});
