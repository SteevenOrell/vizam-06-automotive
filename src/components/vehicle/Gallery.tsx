"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { clampIndex, nearestIndex } from "@/lib/carousel";

/** Scroll position at which a slide sits at the start edge, minus the track scroll-padding. */
function slideOffset(track: HTMLElement, slide: HTMLElement): number {
  const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
  return slide.offsetLeft - track.offsetLeft - pad;
}

export interface GallerySlide {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

/**
 * Horizontal scroll-snap gallery. It scrolls inside its own region (never the page); prev/next buttons, arrow keys,
 * Home/End and touch swipe all work. The counter is announced politely.
 */
export function Gallery({ slides, label }: { slides: GallerySlide[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      const i = clampIndex(next, slides.length);
      const item = track.children[i] as HTMLElement | undefined;
      if (item) track.scrollTo({ left: slideOffset(track, item), behavior: "smooth" });
    },
    [slides.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offsets = Array.from(track.children).map((c) => slideOffset(track, c as HTMLElement));
        // At the far end the last slide may never reach the start edge: treat the end of the track as the last index.
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        setIndex(atEnd ? offsets.length - 1 : nearestIndex(offsets, track.scrollLeft));
      });
    };
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      track.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") goTo(index + 1);
    else if (e.key === "ArrowLeft") goTo(index - 1);
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(slides.length - 1);
    else return;
    e.preventDefault();
  };

  const btn =
    "grid size-11 place-items-center rounded-full border border-graphite text-paper transition-colors duration-300 hover:border-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-graphite";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm tabular-nums text-mist">
          <span className="text-paper">{String(index + 1).padStart(2, "0")}</span> / {String(slides.length).padStart(2, "0")}
          <span className="ml-3 hidden text-paper/80 sm:inline">{slides[index]?.caption}</span>
        </p>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous image" disabled={index === 0} onClick={() => goTo(index - 1)} className={btn}>
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button type="button" aria-label="Next image" disabled={index === slides.length - 1} onClick={() => goTo(index + 1)} className={btn}>
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12 xl:-mx-16 xl:scroll-px-16 xl:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div role="group"
            key={s.src}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.caption}`}
            className="w-[86%] shrink-0 snap-start sm:w-[70%] lg:w-[58%]"
          >
            <Image
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(min-width: 1024px) 58vw, (min-width: 640px) 70vw, 86vw"
              loading="lazy"
              className="aspect-[16/10] h-auto w-full rounded-sharp object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
