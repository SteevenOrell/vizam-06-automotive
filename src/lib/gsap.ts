"use client";

import type { gsap as GsapType } from "gsap";

type Gsap = typeof GsapType;

let loader: Promise<Gsap> | null = null;

declare global {
  interface Window {
    /** Set once GSAP has loaded; the head script in layout.tsx uses it to decide whether to give up on motion. */
    __motionReady?: boolean;
  }
}

/**
 * Load GSAP and ScrollTrigger on demand and register the plugin once.
 * Keeps GSAP out of the initial bundle for pages that never animate.
 */
export function loadGsap(): Promise<Gsap> {
  if (!loader) {
    loader = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      window.__motionReady = true;
      return g.gsap;
    });
  }
  return loader;
}

/**
 * Reveals are hidden by CSS only while the head script has set `js-motion` on <html> and has not given up
 * (`motion-failed`, set 4s after load if GSAP never arrived). Marking an element revealed hands it over to GSAP's
 * inline styles, or simply shows it when motion is skipped.
 */
export function motionDisabled(): boolean {
  return document.documentElement.classList.contains("motion-failed");
}

export function markRevealed(el: HTMLElement) {
  el.setAttribute("data-revealed", "");
}
