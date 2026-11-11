import { describe, expect, it } from "vitest";
import { getVehicle, vehicles } from "@/data/vehicles";
import {
  CONFIG_VERSION,
  formatPrice,
  getDefaultConfig,
  getPriceBreakdown,
  getTotalPrice,
  isValidConfig,
  parseConfig,
  repairConfig,
  serializeConfig,
  togglePackage,
} from "./configurator";

describe("vehicle data", () => {
  it.each(vehicles.map((v) => [v.slug, v] as const))("%s has the required option counts and unique ids", (_, v) => {
    expect(v.colours).toHaveLength(5);
    expect(v.wheels).toHaveLength(3);
    expect(v.interiors).toHaveLength(3);
    expect(v.packages).toHaveLength(4);
    expect(v.trims.length).toBeGreaterThanOrEqual(2);
    expect(v.trims.length).toBeLessThanOrEqual(3);
    for (const list of [v.trims, v.colours, v.wheels, v.interiors, v.packages]) {
      const ids = list.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
    expect(v.trims[0].priceDelta).toBe(0);
    expect(v.specs).toEqual(v.trims[0].specs);
    for (const c of v.colours) expect(c.hex).toMatch(/^#[0-9A-F]{6}$/i);
  });
});

describe("getDefaultConfig", () => {
  it("picks the first option of each group and no packages", () => {
    const v = getVehicle("sola")!;
    expect(getDefaultConfig("sola")).toEqual({
      version: CONFIG_VERSION,
      model: "sola",
      trim: v.trims[0].id,
      colour: v.colours[0].id,
      wheels: v.wheels[0].id,
      interior: v.interiors[0].id,
      packages: [],
    });
  });

  it("defaults to the first model", () => {
    expect(getDefaultConfig().model).toBe(vehicles[0].slug);
  });
});

describe("pricing", () => {
  it("default config costs the base price", () => {
    for (const v of vehicles) expect(getTotalPrice(getDefaultConfig(v.slug))).toBe(v.basePrice);
  });

  it("adds trim, colour, wheels, interior and package deltas", () => {
    const v = getVehicle("aren")!;
    const config = {
      ...getDefaultConfig("aren"),
      trim: v.trims[2].id,
      colour: v.colours[4].id,
      wheels: v.wheels[2].id,
      interior: v.interiors[2].id,
      packages: [v.packages[0].id, v.packages[3].id],
    };
    const expected =
      v.basePrice +
      v.trims[2].priceDelta +
      v.colours[4].priceDelta +
      v.wheels[2].priceDelta +
      v.interiors[2].priceDelta +
      v.packages[0].priceDelta +
      v.packages[3].priceDelta;
    const breakdown = getPriceBreakdown(config);
    expect(breakdown.total).toBe(expected);
    expect(breakdown.lines.filter((l) => l.key === "package")).toHaveLength(2);
    expect(breakdown.lines[0]).toMatchObject({ key: "base", amount: v.basePrice });
  });

  it("throws on unknown options", () => {
    expect(() => getPriceBreakdown({ ...getDefaultConfig("vire"), colour: "not-a-paint" })).toThrow(/colour/);
  });

  it("formats CAD without cents", () => {
    expect(formatPrice(118000)).toMatch(/118,000/);
    expect(formatPrice(118000)).not.toMatch(/\.00/);
  });
});

describe("togglePackage", () => {
  it("adds then removes a package without mutating the input", () => {
    const base = getDefaultConfig("vire");
    const added = togglePackage(base, "vire-track-pack");
    expect(added.packages).toEqual(["vire-track-pack"]);
    expect(base.packages).toEqual([]);
    expect(togglePackage(added, "vire-track-pack").packages).toEqual([]);
  });
});

describe("repairConfig / isValidConfig", () => {
  it("keeps a valid config unchanged", () => {
    const config = togglePackage(getDefaultConfig("aren"), "aren-winter");
    expect(repairConfig(config)).toEqual(config);
    expect(isValidConfig(config)).toBe(true);
  });

  it("replaces unknown options with defaults and drops bad or duplicate packages", () => {
    const repaired = repairConfig({
      model: "sola",
      trim: "nope",
      colour: "tide-blue",
      wheels: 42,
      packages: ["sola-winter", "sola-winter", "aren-winter", 7],
    });
    expect(repaired).toEqual({
      ...getDefaultConfig("sola"),
      colour: "tide-blue",
      packages: ["sola-winter"],
    });
  });

  it("returns null when the model is unknown or the input is not an object", () => {
    expect(repairConfig({ model: "unknown-model" })).toBeNull();
    expect(repairConfig(null)).toBeNull();
    expect(repairConfig("aren")).toBeNull();
  });

  it("flags configs that need repair as invalid", () => {
    expect(isValidConfig({ ...getDefaultConfig("aren"), wheels: "not-a-wheel" })).toBe(false);
    expect(isValidConfig({ model: "aren" })).toBe(false);
  });
});

describe("serialize / parse", () => {
  it("round-trips a config", () => {
    const config = togglePackage(getDefaultConfig("vire"), "vire-carbon");
    expect(parseConfig(serializeConfig(config))).toEqual(config);
  });

  it("returns null for empty or corrupt storage", () => {
    expect(parseConfig(null)).toBeNull();
    expect(parseConfig("")).toBeNull();
    expect(parseConfig("{not json")).toBeNull();
    expect(parseConfig('{"model":"unknown"}')).toBeNull();
  });

  it("repairs a stale stored value", () => {
    expect(parseConfig('{"version":0,"model":"aren","colour":"gone"}')).toEqual(getDefaultConfig("aren"));
  });
});
