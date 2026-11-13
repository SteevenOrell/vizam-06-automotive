"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SwitchOption {
  id: string;
  /** Visible name (paint or trim). */
  label: string;
  /** Extra text for the screen-reader name, e.g. the finish. */
  detail?: string;
  /** Colour chip, if the option has one. */
  swatch?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface SwitchableImageProps {
  options: SwitchOption[];
  defaultId: string;
  /** Names the button group, e.g. "Exterior paint". */
  groupLabel: string;
  sizes: string;
  /** Rendered over the stage (hotspots). */
  children?: ReactNode;
  className?: string;
}

/**
 * Image stage with a small switcher beneath it. Options are real buttons (aria-pressed). Only the visible image is
 * loaded up front; the others are fetched when their button is hovered, focused or pressed, then crossfade in.
 */
export function SwitchableImage({ options, defaultId, groupLabel, sizes, children, className }: SwitchableImageProps) {
  const [activeId, setActiveId] = useState(defaultId);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [mounted, setMounted] = useState<ReadonlySet<string>>(() => new Set([defaultId]));
  const [ready, setReady] = useState<ReadonlySet<string>>(() => new Set([defaultId]));
  const clearPrev = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const preload = useCallback((id: string) => {
    setMounted((s) => (s.has(id) ? s : new Set(s).add(id)));
  }, []);

  const select = (id: string) => {
    if (id === activeId) return;
    preload(id);
    setPrevId(activeId);
    setActiveId(id);
    clearTimeout(clearPrev.current);
    clearPrev.current = setTimeout(() => setPrevId(null), 700);
    // Safety net: show the new image even if its load event was missed.
    setTimeout(() => setReady((s) => (s.has(id) ? s : new Set(s).add(id))), 2500);
  };

  useEffect(() => () => clearTimeout(clearPrev.current), []);

  const active = options.find((o) => o.id === activeId) ?? options[0];

  return (
    <div className={className}>
      <div className="relative" style={{ aspectRatio: `${active.width} / ${active.height}` }}>
        <div className="absolute inset-0 overflow-hidden rounded-sharp bg-carbon">
        {options
          .filter((o) => mounted.has(o.id))
          .map((o) => {
            const isActive = o.id === activeId;
            const visible = (isActive && ready.has(o.id)) || o.id === prevId;
            return (
              <Image
                key={o.id}
                src={o.src}
                alt={isActive ? o.alt : ""}
                width={o.width}
                height={o.height}
                sizes={sizes}
                loading={o.id === defaultId ? "lazy" : "eager"}
                onLoad={() => setReady((s) => (s.has(o.id) ? s : new Set(s).add(o.id)))}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
                style={{ opacity: visible ? 1 : 0, zIndex: isActive ? 2 : o.id === prevId ? 1 : 0 }}
              />
            );
          })}
        </div>
        {children}
      </div>

      <div role="group" aria-label={groupLabel} className="mt-4 flex flex-wrap items-center gap-2">
        {options.map((o) => {
          const pressed = o.id === activeId;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={pressed}
              aria-label={o.detail ? `${o.label}, ${o.detail}` : o.label}
              onClick={() => select(o.id)}
              onPointerEnter={() => preload(o.id)}
              onFocus={() => preload(o.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-300",
                pressed ? "border-amber bg-amber/10 text-paper" : "border-graphite text-paper/80 hover:border-mist hover:text-paper",
              )}
            >
              {o.swatch ? <span aria-hidden="true" className="size-5 rounded-full ring-1 ring-paper/30" style={{ backgroundColor: o.swatch }} /> : null}
              <span aria-hidden="true">{o.label}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-mist">
        <span className="text-paper">{active.label}</span>
        {active.detail ? ` · ${active.detail}` : ""}
      </p>
    </div>
  );
}
