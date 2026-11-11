"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getImageSlot } from "@/data/images";

interface Layer {
  uid: number;
  slot: string;
  loaded: boolean;
}

interface StageImageProps {
  slot: string;
  sizes: string;
  /** "contain" keeps the whole vehicle visible; edges fade into the stage. */
  className?: string;
  priority?: boolean;
}

/**
 * Crossfades between image slots (400ms). The new image fades in once loaded, on top of the previous one,
 * so the stage never goes blank and nothing moves. Under prefers-reduced-motion the global rule makes it instant.
 */
export function StageImage({ slot, sizes, className, priority }: StageImageProps) {
  const [layers, setLayers] = useState<Layer[]>([{ uid: 0, slot, loaded: true }]);
  const top = layers[layers.length - 1];

  if (top.slot !== slot) {
    const base = layers.filter((l) => l.loaded).slice(-1);
    setLayers([...base, { uid: top.uid + 1, slot, loaded: false }]);
  }

  const markLoaded = useCallback(
    (id: number) => setLayers((ls) => (ls.some((l) => l.uid === id && !l.loaded) ? ls.map((l) => (l.uid === id ? { ...l, loaded: true } : l)) : ls)),
    [],
  );

  // Once the top layer is visible, drop the layer beneath after the fade.
  const topUid = top.uid;
  const topLoaded = top.loaded;
  useEffect(() => {
    if (!topLoaded) {
      const safety = window.setTimeout(() => markLoaded(topUid), 2500);
      return () => window.clearTimeout(safety);
    }
    const t = window.setTimeout(() => setLayers((ls) => (ls.length > 1 ? ls.slice(-1) : ls)), 450);
    return () => window.clearTimeout(t);
  }, [topUid, topLoaded, markLoaded]);

  return (
    <>
      {layers.map((layer, i) => {
        const data = getImageSlot(layer.slot);
        if (!data?.src) return null;
        const isTop = i === layers.length - 1;
        return (
          <Image
            key={layer.uid}
            src={data.src}
            alt={isTop ? data.alt : ""}
            fill
            sizes={sizes}
            preload={priority && layer.uid === 0}
            loading="eager"
            onLoad={() => markLoaded(layer.uid)}
            className={`${className ?? "object-contain"} transition-opacity duration-[400ms] ease-out`}
            style={{ opacity: layer.loaded ? 1 : 0, zIndex: isTop ? 2 : 1 }}
          />
        );
      })}
    </>
  );
}
