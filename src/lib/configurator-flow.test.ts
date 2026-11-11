import { describe, expect, it } from "vitest";
import { getImageSlot } from "@/data/images";
import { getVehicle, vehicles } from "@/data/vehicles";
import {
  adjacentStep,
  buildSearch,
  formatDelta,
  getDefaultConfig,
  getPackageState,
  getPriceBreakdown,
  getStageLabel,
  getStageSlot,
  getSummaryText,
  getTotalPrice,
  formatPrice,
  isCustomised,
  parseSaved,
  parseUrlParams,
  repairConfig,
  serializeConfig,
  serializeSaved,
  setOption,
  stageForStep,
  switchModel,
  togglePackage,
} from "./configurator";

describe("package rules", () => {
  it("blocks a package whose requirement is missing and cascades removal", () => {
    const base = getDefaultConfig("aren");
    expect(getPackageState(base, "aren-rear-lounge")).toMatchObject({ disabled: true, reason: "Requires Acoustic Comfort" });
    expect(togglePackage(base, "aren-rear-lounge")).toBe(base);
    const both = togglePackage(togglePackage(base, "aren-acoustic"), "aren-rear-lounge");
    expect(both.packages).toEqual(["aren-acoustic", "aren-rear-lounge"]);
    expect(togglePackage(both, "aren-acoustic").packages).toEqual([]);
  });

  it("blocks conflicting packages in both directions", () => {
    const track = togglePackage(getDefaultConfig("vire"), "vire-track-pack");
    expect(getPackageState(track, "vire-grand-tour")).toMatchObject({ disabled: true, reason: "Not available with Track" });
    expect(togglePackage(track, "vire-grand-tour")).toBe(track);
    const tour = togglePackage(getDefaultConfig("vire"), "vire-grand-tour");
    expect(getPackageState(tour, "vire-track-pack").disabled).toBe(true);
  });

  it("includes packages with a trim at no cost and drops duplicates from the selection", () => {
    const v = getVehicle("vire")!;
    const track = setOption(togglePackage(getDefaultConfig("vire"), "vire-carbon"), "trim", "vire-track");
    expect(track.packages).toEqual([]);
    expect(getPackageState(track, "vire-carbon")).toMatchObject({ included: true, selected: true, disabled: true });
    expect(togglePackage(track, "vire-carbon")).toBe(track);
    const b = getPriceBreakdown(track);
    expect(b.lines.find((l) => l.label.includes("Carbon Aero"))!.amount).toBe(0);
    expect(b.total).toBe(v.basePrice + v.trims[2].priceDelta);
  });

  it("re-applies rules when the trim changes", () => {
    const terrain = setOption(getDefaultConfig("sola"), "trim", "sola-terrain");
    expect(getPackageState(terrain, "sola-winter").included).toBe(true);
    const withWinter = togglePackage(getDefaultConfig("sola"), "sola-winter");
    expect(setOption(withWinter, "trim", "sola-terrain").packages).toEqual([]);
    const conflict = togglePackage(getDefaultConfig("sola"), "sola-third-row");
    expect(getPackageState(conflict, "sola-utility").disabled).toBe(true);
  });

  it("repairs a stored config that breaks the rules", () => {
    expect(repairConfig({ ...getDefaultConfig("aren"), packages: ["aren-rear-lounge"] })?.packages).toEqual([]);
    expect(repairConfig({ ...getDefaultConfig("vire"), packages: ["vire-grand-tour", "vire-track-pack"] })?.packages).toEqual([
      "vire-track-pack",
    ]);
  });
});

describe("setOption / switchModel / isCustomised", () => {
  it("changes one option, ignores unknown ids", () => {
    const base = getDefaultConfig("aren");
    expect(setOption(base, "colour", "tide-blue").colour).toBe("tide-blue");
    expect(setOption(base, "wheels", "nope")).toBe(base);
    expect(setOption(base, "trim", "sola-terrain")).toBe(base);
  });

  it("prices every option type for every model", () => {
    for (const v of vehicles) {
      const base = getDefaultConfig(v.slug);
      for (const t of v.trims) expect(getTotalPrice(setOption(base, "trim", t.id))).toBe(v.basePrice + t.priceDelta);
      for (const c of v.colours) expect(getTotalPrice(setOption(base, "colour", c.id))).toBe(v.basePrice + c.priceDelta);
      for (const w of v.wheels) expect(getTotalPrice(setOption(base, "wheels", w.id))).toBe(v.basePrice + w.priceDelta);
      for (const i of v.interiors) expect(getTotalPrice(setOption(base, "interior", i.id))).toBe(v.basePrice + i.priceDelta);
    }
  });

  it("switching model gives the new model defaults; customised detection", () => {
    expect(isCustomised(getDefaultConfig("aren"))).toBe(false);
    expect(isCustomised(setOption(getDefaultConfig("aren"), "colour", "ember"))).toBe(true);
    expect(switchModel("vire")).toEqual(getDefaultConfig("vire"));
  });

  it("itemised lines sum to the total; deltas format", () => {
    const c = togglePackage(setOption(getDefaultConfig("sola"), "interior", "ember"), "sola-assist-plus");
    const b = getPriceBreakdown(c);
    expect(b.lines.reduce((s, l) => s + l.amount, 0)).toBe(b.total);
    expect(formatDelta(0)).toBe("Included");
    expect(formatDelta(3200)).toMatch(/^\+.*3,200/);
  });
});

describe("saved configuration", () => {
  const config = setOption(getDefaultConfig("sola"), "colour", "tide-blue");
  const at = new Date("2026-11-11T15:30:00Z");

  it("round-trips the versioned wrapper", () => {
    expect(parseSaved(serializeSaved(config, at))).toEqual({ config, savedAt: at.toISOString(), repaired: false });
  });

  it("returns null for empty, corrupt, non-object or unknown-model data", () => {
    for (const bad of [null, "", "{oops", "42", "null", '{"config":{"model":"zzz"}}', '{"version":1}']) {
      expect(parseSaved(bad)).toBeNull();
    }
  });

  it("repairs wrong version, unknown ids and the bare legacy shape", () => {
    expect(parseSaved(JSON.stringify({ version: 0, savedAt: at.toISOString(), config }))).toMatchObject({ config, repaired: true });
    const unknown = parseSaved(JSON.stringify({ version: 1, savedAt: at.toISOString(), config: { ...config, colour: "gone" } }));
    expect(unknown?.config.colour).toBe(getDefaultConfig("sola").colour);
    expect(unknown?.repaired).toBe(true);
    expect(parseSaved(serializeConfig(config))).toEqual({ config, savedAt: null, repaired: true });
  });

  it("ignores an invalid timestamp", () => {
    expect(parseSaved(JSON.stringify({ version: 1, savedAt: "yesterday", config }))).toMatchObject({ savedAt: null, repaired: true });
  });
});

describe("steps and URL params", () => {
  it("parses model and step, ignoring invalid values", () => {
    expect(parseUrlParams(new URLSearchParams("model=sola&step=wheels"))).toEqual({ model: "sola", step: "wheels" });
    expect(parseUrlParams(new URLSearchParams("model=tesla&step=nope"))).toEqual({ model: null, step: null });
    expect(parseUrlParams(new URLSearchParams(""))).toEqual({ model: null, step: null });
    expect(parseUrlParams(null)).toEqual({ model: null, step: null });
    expect(buildSearch("vire", "summary")).toBe("?model=vire&step=summary");
  });

  it("walks the steps", () => {
    expect(adjacentStep("model", -1)).toBeNull();
    expect(adjacentStep("model", 1)).toBe("trim");
    expect(adjacentStep("packages", 1)).toBe("summary");
    expect(adjacentStep("summary", 1)).toBeNull();
  });
});

describe("stage", () => {
  it("picks slots per view and limits angles to Lunar Silver", () => {
    const silver = getDefaultConfig("aren");
    expect(getStageSlot(silver, "exterior")).toBe("aren-ext-lunar-silver");
    expect(getStageSlot(silver, "exterior", "rear")).toBe("aren-view-rear");
    expect(getStageSlot(silver, "interior")).toBe("aren-int-onyx");
    expect(getStageSlot(silver, "wheel")).toBe("wheel-aero");
    const blue = setOption(silver, "colour", "tide-blue");
    expect(getStageSlot(blue, "exterior", "rear")).toBe("aren-ext-tide-blue");
    expect(getStageLabel(blue, "exterior")).toBe("Exterior: Tide Blue");
    expect(stageForStep("wheels")).toBe("wheel");
  });

  it("every stage slot has an image asset", () => {
    for (const v of vehicles) {
      const c = getDefaultConfig(v.slug);
      for (const col of v.colours) expect(getImageSlot(getStageSlot({ ...c, colour: col.id }, "exterior"))?.src).toBeTruthy();
      for (const i of v.interiors) expect(getImageSlot(getStageSlot({ ...c, interior: i.id }, "interior"))?.src).toBeTruthy();
      for (const w of v.wheels) expect(getImageSlot(getStageSlot({ ...c, wheels: w.id }, "wheel"))?.src).toBeTruthy();
      for (const a of ["rear", "side", "front"] as const) expect(getImageSlot(getStageSlot(c, "exterior", a))?.src).toBeTruthy();
    }
  });

  it("summary text carries the total and the concept note", () => {
    const c = getDefaultConfig("aren");
    const text = getSummaryText(c);
    expect(text).toContain(formatPrice(getTotalPrice(c)));
    expect(text).toMatch(/Concept data/);
  });
});
