"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { countByFilter, filterGallery, GALLERY_FILTERS, type GalleryFilterId, type GalleryTile } from "@/lib/gallery";
import { Lightbox } from "./Lightbox";

const SIZES = "(min-width: 1440px) 450px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/** Filter chips, a masonry-style grid that keeps every image's own aspect ratio, and the lightbox. */
export function GalleryExplorer({ tiles }: { tiles: readonly GalleryTile[] }) {
  const [filter, setFilter] = useState<GalleryFilterId>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const counts = useMemo(() => countByFilter(tiles), [tiles]);
  const visible = useMemo(() => filterGallery(tiles, filter), [tiles, filter]);
  const openIndex = openId ? visible.findIndex((t) => t.id === openId) : -1;

  const close = () => {
    const returnId = openId;
    setOpenId(null);
    // Back to the tile of the image that was showing (the one that opened it unless the arrows moved on).
    requestAnimationFrame(() => {
      const tile = returnId ? document.querySelector<HTMLElement>(`[data-tile="${returnId}"]`) : null;
      (tile ?? triggerRef.current)?.focus();
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter images" className="flex flex-wrap gap-2">
          {GALLERY_FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300",
                  active ? "border-amber bg-amber text-ink" : "border-graphite text-paper hover:border-paper",
                )}
              >
                {f.label}
                <span className={cn("text-xs tabular-nums", active ? "text-ink/70" : "text-mist")}>{counts[f.id]}</span>
              </button>
            );
          })}
        </div>
        <p role="status" aria-live="polite" data-testid="gallery-count" className="text-sm tabular-nums text-mist">
          Showing {visible.length} of {tiles.length} images
        </p>
      </div>

      <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {visible.map((tile, i) => (
          <li key={tile.id} className="break-inside-avoid">
            <button
              type="button"
              data-tile={tile.id}
              aria-haspopup="dialog"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setOpenId(tile.id);
              }}
              className="group relative block w-full overflow-hidden rounded-sharp bg-carbon text-left"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                width={tile.width}
                height={tile.height}
                sizes={SIZES}
                loading={i < 3 ? "eager" : "lazy"}
                className="h-auto w-full transition-[filter] duration-500 group-hover:brightness-110"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-4 pb-3 pt-10 text-paper"
              >
                <span className="block text-sm font-medium">{tile.caption}</span>
                <span className="block text-xs text-paper/70">{tile.meta}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex >= 0 ? (
        <Lightbox tiles={visible} index={openIndex} onIndexChange={(i) => setOpenId(visible[i].id)} onClose={close} />
      ) : null}
    </div>
  );
}
