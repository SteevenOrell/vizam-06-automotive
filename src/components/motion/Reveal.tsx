"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap, markRevealed, motionDisabled } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Vertical travel in px. */
  y?: number;
  delay?: number;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: number;
  /** "fade" lifts and fades in; "mask" wipes an image open from the top (clip-path). */
  variant?: "fade" | "mask";
}

/**
 * Fades and lifts content into view once, on scroll (GSAP + ScrollTrigger, 800ms power3.out; mask wipe 1100ms).
 * Only transform, opacity and clip-path are animated. Content is hidden by CSS only while the `js-motion` class is on
 * <html> (see globals.css), so it is fully visible without JavaScript, under prefers-reduced-motion, and if GSAP fails
 * to load (`motion-failed`).
 */
export function Reveal({ children, as: Tag = "div", className, y = 24, delay = 0, stagger, variant = "fade" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap()
      .then((gsap) => {
        if (cancelled) return;
        if (motionDisabled()) {
          markRevealed(el);
          return;
        }
        const ctx = gsap.context(() => {
          const targets = stagger ? Array.from(el.children) : el;
          const trigger = { trigger: el, start: "top 85%", once: true };
          if (variant === "mask") {
            gsap.fromTo(
              targets,
              { clipPath: "inset(0 0 100% 0)" },
              { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power3.inOut", delay, stagger, scrollTrigger: trigger, clearProps: "clipPath" },
            );
          } else {
            gsap.fromTo(
              targets,
              // opacity, not autoAlpha: autoAlpha sets visibility: hidden, which removes the content from the
              // accessibility tree until it is scrolled into view.
              { y, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay, stagger, scrollTrigger: trigger, clearProps: "transform,opacity" },
            );
          }
        }, el);
        // The tweens above have already written their start state inline, so the CSS hiding can step aside.
        markRevealed(el);
        revert = () => ctx.revert();
      })
      .catch(() => markRevealed(el));

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [y, delay, stagger, variant]);

  return (
    <Tag ref={ref} className={className} data-reveal={stagger ? "stagger" : variant}>
      {children}
    </Tag>
  );
}
