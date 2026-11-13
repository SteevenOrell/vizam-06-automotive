"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import type { ExplorerTabData } from "@/data/editorial";
import { cn } from "@/lib/cn";

export interface ExplorerTab extends ExplorerTabData {
  /** Resolved image (null for the thermal diagram). */
  image: { src: string; width: number; height: number; alt: string } | null;
}

/** Loop diagram for the thermal tab: one coolant circuit linking pack, motors, heat pump and cabin. */
function ThermalDiagram() {
  const node = "fill-carbon stroke-graphite";
  return (
    <svg viewBox="0 0 640 360" role="img" aria-label="Diagram of one coolant loop linking the battery pack, the motors, a heat pump and the cabin" className="size-full bg-ink">
      <rect x="8" y="8" width="624" height="344" fill="none" className="stroke-graphite" strokeDasharray="4 6" />
      <path d="M170 110H470M170 250H470M170 110V250M470 110V250" fill="none" className="stroke-amber" strokeWidth="2" />
      <path d="M320 110V250" fill="none" className="stroke-mist/50" strokeWidth="1.5" strokeDasharray="3 5" />
      {[
        { x: 110, y: 78, w: 120, label: "Battery pack" },
        { x: 410, y: 78, w: 120, label: "Motors" },
        { x: 110, y: 218, w: 120, label: "Cabin" },
        { x: 410, y: 218, w: 120, label: "Heat pump" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width={n.w} height="64" rx="2" className={node} strokeWidth="1.5" />
          <text x={n.x + n.w / 2} y={n.y + 38} textAnchor="middle" className="fill-paper" fontSize="15" fontFamily="var(--font-text)">
            {n.label}
          </text>
        </g>
      ))}
      <rect x="262" y="160" width="116" height="40" rx="2" className="fill-ink stroke-amber" strokeWidth="1.5" />
      <text x="320" y="185" textAnchor="middle" className="fill-amber" fontSize="13" fontFamily="var(--font-text)">
        Valve manifold
      </text>
      <text x="320" y="334" textAnchor="middle" className="fill-mist" fontSize="12" fontFamily="var(--font-text)">
        Concept schematic
      </text>
    </svg>
  );
}

/**
 * Tabbed platform explorer. Roving tabindex, arrow keys / Home / End move and activate (automatic activation),
 * and the panel swaps image and copy. All panels stay in the DOM so aria-controls always resolves.
 */
export function PlatformExplorer({ tabs }: { tabs: ExplorerTab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (to: number) => {
    const i = (to + tabs.length) % tabs.length;
    setActive(i);
    refs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") move(active + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(active - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div role="tablist" aria-label="Platform systems" onKeyDown={onKeyDown} className="grid grid-cols-2 gap-px overflow-hidden rounded-sharp border border-graphite bg-graphite sm:grid-cols-4">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`explorer-tab-${t.id}`}
            type="button"
            aria-selected={i === active}
            aria-controls={`explorer-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "flex min-h-14 items-center gap-3 px-4 py-3 text-left text-sm font-medium tracking-wide transition-colors duration-300 sm:px-5",
              i === active ? "bg-paper text-ink" : "bg-carbon text-paper hover:bg-graphite",
            )}
          >
            <span className={cn("font-display text-xs tracking-[0.18em]", i === active ? "text-amber-ink" : "text-amber")}>{String(i + 1).padStart(2, "0")}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`explorer-panel-${t.id}`}
          aria-labelledby={`explorer-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="panel-in mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-start lg:gap-14"
        >
          <div className="aspect-[16/9] overflow-hidden rounded-sharp bg-ink lg:col-span-7">
            {t.image ? (
              <Image
                src={t.image.src}
                alt={t.image.alt}
                width={t.image.width}
                height={t.image.height}
                sizes="(min-width: 1440px) 740px, (min-width: 1024px) 55vw, 100vw"
                className="size-full object-cover"
              />
            ) : (
              <ThermalDiagram />
            )}
          </div>
          <div className="lg:col-span-5">
            <h3 className="font-display text-2xl font-semibold leading-tight [font-stretch:112%] md:text-3xl">{t.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-paper/80 md:text-lg">{t.text}</p>
            <ul className="mt-6 space-y-3 border-t border-graphite pt-6 text-base leading-relaxed text-paper/90">
              {t.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 block h-px w-4 shrink-0 bg-amber" />
                  {p}
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-sharp border border-graphite bg-graphite sm:grid-cols-3">
              {t.facts.map((f) => (
                <div key={f.label} className="bg-carbon p-4">
                  <dt className="text-xs uppercase tracking-[0.18em] text-paper/70">{f.label}</dt>
                  <dd className="mt-2 font-display text-base font-semibold [font-stretch:112%]">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-paper/70">Concept data</p>
          </div>
        </div>
      ))}
    </div>
  );
}
