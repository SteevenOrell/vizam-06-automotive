"use client";

import type { gsap as GsapType } from "gsap";

type Gsap = typeof GsapType;

let loader: Promise<Gsap> | null = null;

/**
 * Load GSAP and ScrollTrigger on demand and register the plugin once.
 * Keeps GSAP out of the initial bundle for pages that never animate.
 */
export function loadGsap(): Promise<Gsap> {
  if (!loader) {
    loader = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      return g.gsap;
    });
  }
  return loader;
}
