"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { popoverSide } from "@/lib/carousel";
import { cn } from "@/lib/cn";
import type { Hotspot } from "@/types";

/**
 * Numbered feature hotspots over an image stage (reference 05). Real buttons with aria-expanded and a popover; Esc or
 * the close button dismisses and returns focus. Hidden below 768px, where the numbered list under the image carries the same content.
 */
export function FeatureHotspots({ hotspots, label }: { hotspots: Hotspot[]; label: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = buttons.current.get(openId);
      setOpenId(null);
      trigger?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openId]);

  return (
    <div ref={rootRef} role="group" aria-label={label} className="pointer-events-none absolute inset-0 hidden md:block">
      {hotspots.map((h, i) => {
        const open = openId === h.id;
        const side = popoverSide(h.x);
        const above = h.y > 58;
        const popoverId = `hotspot-${h.id}`;
        return (
          <div key={h.id} className={cn("absolute", open ? "z-30" : "z-10")} style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <button
              type="button"
              ref={(el) => {
                if (el) buttons.current.set(h.id, el);
                else buttons.current.delete(h.id);
              }}
              aria-expanded={open}
              aria-controls={popoverId}
              aria-label={`Feature ${i + 1}: ${h.title}`}
              onClick={() => setOpenId(open ? null : h.id)}
              className="pointer-events-auto group absolute left-0 top-0 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            >
              <span aria-hidden="true" className="absolute size-7 animate-ping rounded-full bg-amber/40 [animation-duration:2.6s]" />
              <span
                aria-hidden="true"
                className={cn(
                  "relative grid size-7 place-items-center rounded-full border text-xs font-semibold transition-colors duration-300",
                  open ? "border-paper bg-paper text-ink" : "border-amber bg-amber text-ink group-hover:bg-amber-soft",
                )}
              >
                {i + 1}
              </span>
            </button>
            <div
              id={popoverId}
              role="group"
              aria-label={h.title}
              hidden={!open}
              className={cn(
                "pointer-events-auto absolute w-64 rounded-sharp border border-graphite bg-ink/95 p-4 text-left text-paper shadow-[0_20px_60px_rgb(0_0_0/0.5)] backdrop-blur-sm",
                above ? "bottom-7" : "top-7",
                side === "center" && "left-1/2 -translate-x-1/2",
                side === "left" && "-left-5",
                side === "right" && "-right-5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-base font-semibold leading-snug [font-stretch:112%]">{h.title}</p>
                <button
                  type="button"
                  aria-label={`Close ${h.title}`}
                  onClick={() => {
                    setOpenId(null);
                    buttons.current.get(h.id)?.focus();
                  }}
                  className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-paper/80 hover:text-paper"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>
              <p className="-mt-2 text-sm leading-relaxed text-paper/80">{h.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
