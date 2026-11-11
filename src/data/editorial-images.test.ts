import { describe, expect, it } from "vitest";
import { EDITORIAL_FALLBACKS, editorialImage } from "./editorial-images";

describe("editorialImage", () => {
  it("uses the scene itself when its file exists", () => {
    const lookup = (k: string) => (k === "ed-platform" ? { src: "/x.webp", alt: "own" } : undefined);
    expect(editorialImage("ed-platform", lookup)).toEqual({ slot: "ed-platform", alt: "own", fallback: false });
  });
  it("falls back to the vehicle image while the file is missing", () => {
    const lookup = (k: string) => ({ src: k === "ed-platform" ? null : "/y.webp", alt: k });
    expect(editorialImage("ed-platform", lookup)).toEqual({ slot: EDITORIAL_FALLBACKS["ed-platform"], alt: EDITORIAL_FALLBACKS["ed-platform"], fallback: true });
  });
  it("throws when nothing can be shown", () => {
    expect(() => editorialImage("ed-nope", () => undefined)).toThrow();
  });
});

import { resolveImage } from "./editorial-images";

describe("resolveImage", () => {
  const lookup = (k: string) => ({ src: "/a.webp", alt: `alt ${k}` });
  it("passes vehicle keys through and honours an explicit alt", () => {
    expect(resolveImage("aren-view-side", undefined, lookup)).toEqual({ slot: "aren-view-side", alt: "alt aren-view-side", fallback: false });
    expect(resolveImage("aren-view-side", "mine", lookup).alt).toBe("mine");
  });
  it("throws for a vehicle key without a file", () => {
    expect(() => resolveImage("x", undefined, () => ({ src: null, alt: "" }))).toThrow();
  });
});
