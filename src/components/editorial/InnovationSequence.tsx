"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Typography";
import type { ResearchTheme } from "@/data/editorial";
import { cn } from "@/lib/cn";

export interface SequenceItem extends ResearchTheme {
  img: { src: string; width: number; height: number; alt: string };
}

/**
 * Numbered research sequence. From lg up the media column is pinned (CSS sticky) and crossfades to the item being read;
 * below lg, and with JavaScript off, every item simply shows its own image in the flow.
 */
export function InnovationSequence({ items }: { items: SequenceItem[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.55;
        let next = 0;
        refs.current.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top <= line) next = i;
        });
        setActive(next);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[5/4] overflow-hidden rounded-sharp bg-ink">
            {items.map((it, i) => (
              <Image
                key={it.id}
                src={it.img.src}
                alt={i === active ? it.img.alt : ""}
                aria-hidden={i === active ? undefined : true}
                width={it.img.width}
                height={it.img.height}
                sizes="(min-width: 1440px) 520px, 40vw"
                className={cn("absolute inset-0 size-full object-cover transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")}
              />
            ))}
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-5 pb-4 pt-12 text-xs uppercase tracking-[0.18em] text-paper">
              {items[active].n} / {items[active].title}
            </p>
          </div>
        </div>
      </div>

      <ol className="space-y-20 lg:col-span-7 lg:space-y-[28vh]">
        {items.map((it, i) => (
          <li
            key={it.id}
            data-index={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-labelledby={`theme-${it.id}`}
            className="lg:min-h-[50vh]"
          >
            <p aria-hidden="true" data-n={it.n} className="font-display text-[clamp(5rem,14vw,11rem)] font-semibold leading-[0.8] tracking-[-0.03em] text-ink/15 before:content-[attr(data-n)] [font-stretch:125%]"></p>
            <Image
              src={it.img.src}
              alt={it.img.alt}
              width={it.img.width}
              height={it.img.height}
              sizes="(min-width: 1024px) 1px, 100vw"
              className="mt-6 aspect-[16/10] w-full rounded-sharp object-cover lg:hidden"
            />
            <Eyebrow accent="light" className="mt-8">Concept direction</Eyebrow>
            <h3 id={`theme-${it.id}`} className="mt-3 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.08] [font-stretch:112%]">
              {it.title}
            </h3>
            <p className="mt-4 max-w-xl text-xl leading-snug text-ink">{it.lead}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate md:text-lg">{it.text}</p>
            <ul className="mt-6 max-w-xl space-y-3 border-t border-ink/15 pt-6 text-base leading-relaxed text-ink/90">
              {it.directions.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 block h-px w-4 shrink-0 bg-amber-ink" />
                  {d}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
