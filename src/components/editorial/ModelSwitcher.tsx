"use client";

import Image from "next/image";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/Typography";
import { StatRow } from "@/components/ui/StatRow";
import { headlineStats } from "@/lib/vehicle-stats";
import { cn } from "@/lib/cn";
import type { VehicleSpecs } from "@/types";

export interface SwitcherModel {
  slug: string;
  name: string;
  category: string;
  image: { src: string; width: number; height: number; alt: string };
  trims: { id: string; name: string; description: string; specs: VehicleSpecs }[];
}

const pill =
  "min-h-11 rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-300";

/** Model and trim switcher: real buttons with aria-pressed; the figures below come straight from the vehicle data. */
export function ModelSwitcher({ models }: { models: SwitcherModel[] }) {
  const [modelIndex, setModelIndex] = useState(0);
  const [trimIndex, setTrimIndex] = useState(0);
  const model = models[modelIndex];
  const trim = model.trims[trimIndex];

  const pick = (i: number) => {
    setModelIndex(i);
    setTrimIndex(0);
  };

  return (
    <div>
      <div role="group" aria-label="Model" className="flex flex-wrap gap-3">
        {models.map((m, i) => (
          <button
            key={m.slug}
            type="button"
            aria-pressed={i === modelIndex}
            onClick={() => pick(i)}
            className={cn(pill, i === modelIndex ? "border-amber bg-amber text-ink" : "border-paper/40 text-paper hover:border-paper")}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Image
            key={model.slug}
            src={model.image.src}
            alt={model.image.alt}
            width={model.image.width}
            height={model.image.height}
            sizes="(min-width: 1440px) 742px, (min-width: 1024px) 52vw, 100vw"
            className="panel-in aspect-[16/9] w-full rounded-sharp object-cover"
          />
        </div>
        <div className="lg:col-span-5">
          <Eyebrow accent="dark">{model.category}</Eyebrow>
          <div role="group" aria-label={`${model.name} trim`} className="mt-5 flex flex-wrap gap-2">
            {model.trims.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={i === trimIndex}
                onClick={() => setTrimIndex(i)}
                className={cn(pill, "px-4", i === trimIndex ? "border-paper bg-paper text-ink" : "border-graphite text-paper hover:border-paper")}
              >
                {t.name}
              </button>
            ))}
          </div>
          <p className="mt-5 max-w-md text-base leading-relaxed text-paper/80">{trim.description}</p>
          <p className="mt-3 text-sm text-paper/70">
            {trim.specs.drive} &middot; {trim.specs.batteryKwh} kWh battery
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-graphite pt-10" data-testid="switcher-figures">
        <p aria-live="polite" className="mb-8 text-sm font-medium uppercase tracking-[0.18em] text-paper/80">
          {trim.name}
        </p>
        <StatRow size="lg" stats={headlineStats(trim.specs)} />
      </div>
    </div>
  );
}
