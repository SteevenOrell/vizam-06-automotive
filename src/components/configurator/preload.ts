import { getImageProps } from "next/image";
import { getImageSlot } from "@/data/images";

/** `sizes` used by the stage image; preloading uses the same value so the browser warms the exact file it will show. */
export const STAGE_SIZES = "(min-width: 1024px) calc(100vw - 440px), 100vw";
export const WHEEL_STAGE_SIZES = "(min-width: 1024px) 45vw, 70vw";

const warmed = new Set<string>();

/** Fetch an image slot into the browser cache ahead of use. Safe to call repeatedly and during SSR (no-op). */
export function preloadSlot(key: string, sizes: string = STAGE_SIZES): void {
  if (typeof window === "undefined") return;
  const id = `${key}|${sizes}`;
  if (warmed.has(id)) return;
  const slot = getImageSlot(key);
  if (!slot?.src) return;
  warmed.add(id);
  const { props } = getImageProps({ src: slot.src, alt: "", width: slot.width, height: slot.height, sizes });
  const img = new window.Image();
  if (props.sizes) img.sizes = props.sizes;
  if (props.srcSet) img.srcset = props.srcSet;
  img.src = props.src;
}

/** Warm a list of slots when the browser is idle. Returns a cancel function. */
export function preloadWhenIdle(keys: string[], sizes: string = STAGE_SIZES): () => void {
  if (typeof window === "undefined") return () => {};
  const run = () => keys.forEach((k) => preloadSlot(k, sizes));
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const t = window.setTimeout(run, 1200);
  return () => window.clearTimeout(t);
}
