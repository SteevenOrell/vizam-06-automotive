"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type TouchEvent } from "react";
import { swipeDirection, wrapIndex, type GalleryTile } from "@/lib/gallery";

interface LightboxProps {
  tiles: readonly GalleryTile[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const btn =
  "grid size-11 place-items-center rounded-full border border-graphite text-paper transition-colors duration-300 hover:border-paper";

/**
 * Modal image viewer on the native <dialog>: showModal() makes the page behind inert and traps focus, Esc closes,
 * arrow keys and swipe move between images, and the page does not scroll while it is open.
 * The parent returns focus to the tile when `onClose` runs.
 */
export function Lightbox({ tiles, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const tile = tiles[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
      if (dialog.open) dialog.close();
    };
  }, []);

  const step = (delta: number) => onIndexChange(wrapIndex(index, delta, tiles.length));

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "Home") onIndexChange(0);
    else if (event.key === "End") onIndexChange(tiles.length - 1);
    else return;
    event.preventDefault();
  };

  const onTouchStart = (event: TouchEvent) => {
    const t = event.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    const direction = swipeDirection(t.clientX - start.x, t.clientY - start.y);
    if (direction !== 0) step(direction);
  };

  if (!tile) return null;

  return (
    <dialog
      ref={dialogRef}
      data-fixed
      aria-label="Image viewer"
      aria-describedby="lightbox-caption"
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-dvw max-w-none flex-col bg-ink p-0 text-paper open:flex backdrop:bg-ink"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <p aria-live="polite" className="text-sm tabular-nums text-mist">
          <span className="text-paper">{String(index + 1).padStart(2, "0")}</span> / {String(tiles.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex min-h-11 items-center gap-2 rounded-full px-5 text-sm ring-1 ring-paper/25 transition-colors duration-300 hover:bg-paper/10"
        >
          <X aria-hidden="true" className="size-4" />
          <span>Close</span>
        </button>
      </div>

      <div className="relative min-h-0 flex-1 touch-pan-y px-2 sm:px-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="relative h-full w-full">
          <Image key={tile.id} src={tile.src} alt={tile.alt} fill sizes="100vw" quality={85} className="object-contain" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 px-4 py-4 sm:px-8 sm:py-6">
        <div id="lightbox-caption" className="min-w-0">
          <p className="font-display text-lg font-semibold [font-stretch:112%] sm:text-xl">{tile.caption}</p>
          <p className="mt-1 text-sm text-mist">{tile.meta}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Previous image" onClick={() => step(-1)} className={btn}>
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button type="button" aria-label="Next image" onClick={() => step(1)} className={btn}>
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
