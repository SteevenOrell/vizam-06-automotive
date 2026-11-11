"use client";

import { useEffect, useRef, type ElementType } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsap";

interface RevealLinesProps {
  /** One entry per visual line. Each line slides up out of its own mask, one after another. */
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Fire on mount instead of on scroll (for above-the-fold headlines). */
  immediate?: boolean;
}

/**
 * Headline reveal: lines rise out of overflow masks with a stagger. The text is plain, readable markup
 * without JavaScript and under prefers-reduced-motion.
 */
export function RevealLines({ lines, as: Tag = "span", className, delay = 0, immediate = false }: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then((gsap) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.from(el.querySelectorAll("[data-line]"), {
          yPercent: 110,
          duration: 1,
          ease: "power3.out",
          delay,
          stagger: 0.12,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
        });
      }, el);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [delay, immediate]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={`${i}-${line}`} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span data-line className="block">
            {line}{" "}
          </span>
        </span>
      ))}
    </Tag>
  );
}
