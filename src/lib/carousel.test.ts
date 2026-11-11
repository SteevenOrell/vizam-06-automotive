import { describe, expect, it } from "vitest";
import { clampIndex, nearestIndex, popoverSide } from "./carousel";

describe("carousel helpers", () => {
  it("clamps indexes", () => {
    expect(clampIndex(-2, 5)).toBe(0);
    expect(clampIndex(9, 5)).toBe(4);
    expect(clampIndex(2, 5)).toBe(2);
    expect(clampIndex(3, 0)).toBe(0);
  });

  it("finds the nearest item to the scroll position", () => {
    expect(nearestIndex([0, 400, 800], 0)).toBe(0);
    expect(nearestIndex([0, 400, 800], 230)).toBe(1);
    expect(nearestIndex([0, 400, 800], 5000)).toBe(2);
    expect(nearestIndex([], 10)).toBe(0);
  });

  it("aligns popovers away from the nearest edge", () => {
    expect(popoverSide(10)).toBe("left");
    expect(popoverSide(50)).toBe("center");
    expect(popoverSide(90)).toBe("right");
  });
});
