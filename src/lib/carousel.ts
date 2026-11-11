/** Clamp an index into 0..length-1 (0 for an empty list). */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

/** Index of the item whose left offset is closest to the current scroll position. */
export function nearestIndex(offsets: readonly number[], scrollLeft: number): number {
  let best = 0;
  let bestDistance = Infinity;
  offsets.forEach((offset, i) => {
    const d = Math.abs(offset - scrollLeft);
    if (d < bestDistance) {
      best = i;
      bestDistance = d;
    }
  });
  return best;
}

/** Position of a hotspot popover so it stays inside the stage: align to the nearer edge. */
export function popoverSide(x: number): "left" | "right" | "center" {
  if (x < 28) return "left";
  if (x > 72) return "right";
  return "center";
}
