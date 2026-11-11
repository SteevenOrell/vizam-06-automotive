"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsap";

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
 * Fades and lifts content into view once, on scroll (GSAP + ScrollTrigger, 800ms power3.out).
 * Content is fully visible without JavaScript and under prefers-reduced-motion.
 */
export function Reveal({ children, as: Tag = "div", className, y = 24, delay = 0, stagger, variant = "fade" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then((gsap) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const targets = stagger ? Array.from(el.children) : el;
        const trigger = { trigger: el, start: "top 85%", once: true };
        if (variant === "mask") {
          gsap.from(targets, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.1,
            ease: "power3.inOut",
            delay,
            stagger,
            scrollTrigger: trigger,
            clearProps: "clipPath",
          });
        } else {
          gsap.from(targets, { y, autoAlpha: 0, duration: 0.8, ease: "power3.out", delay, stagger, scrollTrigger: trigger });
        }
      }, el);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [y, delay, stagger, variant]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
