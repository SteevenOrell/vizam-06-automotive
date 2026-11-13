import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { headlineStats, specRows } from "./vehicle-stats";

describe("vehicle stats helpers", () => {
  it("builds four labelled headline stats", () => {
    const stats = headlineStats(vehicles[0].specs);
    expect(stats.map((s) => s.label)).toEqual(["Power", "0-100 km/h", "Range", "Top speed"]);
    expect(stats[1].value).toBe("3.9");
  });

  it("lists every spec with units", () => {
    const rows = specRows(vehicles[2].specs);
    expect(rows).toHaveLength(6);
    expect(rows.find((r) => r.key === "batteryKwh")?.value).toBe("88 kWh");
    expect(rows.find((r) => r.key === "drive")?.value).toBe("RWD");
  });
});

describe("model content", () => {
  it("has hotspots matching the exterior feature list, inside the image box", () => {
    for (const v of vehicles) {
      expect(v.content.hotspots.map((h) => h.title).sort()).toEqual([...v.features.exterior].sort());
      for (const h of v.content.hotspots) {
        expect(h.x).toBeGreaterThan(0);
        expect(h.x).toBeLessThan(100);
        expect(h.y).toBeGreaterThan(0);
        expect(h.y).toBeLessThan(100);
      }
    }
  });

  it("has a note for every interior, technology and safety feature", () => {
    for (const v of vehicles) {
      expect(v.content.interiorNotes.map((n) => n.title)).toEqual(v.features.interior);
      expect(v.content.technologyNotes.map((n) => n.title)).toEqual(v.features.technology);
      expect(v.content.safetyNotes.map((n) => n.title)).toEqual(v.features.safety);
    }
  });
});

describe("getAdjacentVehicles", () => {
  it("wraps around the lineup", async () => {
    const { getAdjacentVehicles } = await import("@/data/vehicles");
    expect(getAdjacentVehicles("aren")).toMatchObject({ prev: { slug: "vire" }, next: { slug: "sola" } });
    expect(getAdjacentVehicles("vire")).toMatchObject({ prev: { slug: "sola" }, next: { slug: "aren" } });
    expect(getAdjacentVehicles("nope")).toBeUndefined();
  });
});
