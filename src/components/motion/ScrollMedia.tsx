"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsap";

interface ScrollMediaProps {
  children: ReactNode;
  className?: string;
  scaleFrom?: number;
  scaleTo?: number;
  /** Vertical drift in percent of the element height over the scroll range. */
  yPercent?: number;
  /** "parent": scrub while the parent scrolls out (hero). "self": scrub as the element scrolls into view. */
  range?: "parent" | "self";
}

/**
 * Scroll-linked scale and drift for an image wrapper (GSAP ScrollTrigger, scrubbed).
 * Static under prefers-reduced-motion. Use sparingly: home hero and one vehicle reveal per model page.
 */
export function ScrollMedia({ children, className, scaleFrom = 1, scaleTo = 1.15, yPercent = 0, range = "parent" }: ScrollMediaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then((gsap) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { scale: scaleFrom, yPercent: 0 },
          {
            scale: scaleTo,
            yPercent,
            ease: "none",
            scrollTrigger:
              range === "parent"
                ? { trigger: el.parentElement ?? el, start: "top top", end: "bottom top", scrub: true }
                : { trigger: el, start: "top 95%", end: "top 30%", scrub: true },
          },
        );
      }, el);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [scaleFrom, scaleTo, yPercent, range]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
