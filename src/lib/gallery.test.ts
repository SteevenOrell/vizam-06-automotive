import { describe, expect, it } from "vitest";
import { filmStripSlots, galleryEntries } from "@/data/gallery";
import { getImageSlot } from "@/data/images";
import { countByFilter, filterGallery, GALLERY_FILTERS, matchesFilter, swipeDirection, wrapIndex } from "./gallery";

describe("gallery filters", () => {
  it("all keeps everything; model chips match the pictured model; kind chips match the type", () => {
    expect(filterGallery(galleryEntries, "all")).toHaveLength(galleryEntries.length);
    expect(filterGallery(galleryEntries, "sola").every((t) => t.model === "sola")).toBe(true);
    expect(filterGallery(galleryEntries, "interior").every((t) => t.kind === "interior")).toBe(true);
    expect(matchesFilter({ kind: "scene" }, "scene")).toBe(true);
    expect(matchesFilter({ kind: "scene", model: "vire" }, "aren")).toBe(false);
  });

  it("every chip has images and the model counts add up", () => {
    const counts = countByFilter(galleryEntries);
    for (const f of GALLERY_FILTERS) expect(counts[f.id], f.id).toBeGreaterThan(0);
    expect(counts.aren + counts.sola + counts.vire + counts.tarn + counts.vanta).toBe(galleryEntries.filter((t) => t.model).length);
  });
});

describe("gallery data", () => {
  it("only uses delivered images, each once, and never repeats the film strip", () => {
    const slots = [...galleryEntries.map((e) => e.slot), ...filmStripSlots.map((e) => e.slot)];
    expect(new Set(slots).size).toBe(slots.length);
    for (const slot of slots) expect(getImageSlot(slot)?.src, slot).toBeTruthy();
  });

  it("uses at most two paints per model and keeps neighbouring tiles different", () => {
    for (const model of ["aren", "sola", "vire", "tarn", "vanta"]) {
      expect(galleryEntries.filter((e) => e.slot.startsWith(`${model}-ext-`)).length).toBeLessThanOrEqual(2);
    }
    for (let i = 1; i < galleryEntries.length; i++) {
      const a = galleryEntries[i - 1];
      const b = galleryEntries[i];
      expect(a.kind === b.kind && a.model === b.model, `${a.slot} / ${b.slot}`).toBe(false);
    }
  });
});

describe("lightbox helpers", () => {
  it("wraps the index at both ends", () => {
    expect(wrapIndex(0, -1, 5)).toBe(4);
    expect(wrapIndex(4, 1, 5)).toBe(0);
    expect(wrapIndex(2, 1, 5)).toBe(3);
    expect(wrapIndex(0, 1, 0)).toBe(0);
  });

  it("reads only clearly horizontal swipes", () => {
    expect(swipeDirection(-80, 5)).toBe(1);
    expect(swipeDirection(80, 5)).toBe(-1);
    expect(swipeDirection(20, 0)).toBe(0);
    expect(swipeDirection(60, 80)).toBe(0);
  });
});
