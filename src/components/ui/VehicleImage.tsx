import Image from "next/image";
import { getImageSlot } from "@/data/images";
import { getVehicle } from "@/data/vehicles";
import { cn } from "@/lib/cn";

interface VehicleImageProps {
  /** Key from src/data/images.ts, e.g. "aren-hero". */
  slot: string;
  className?: string;
  /** next/image sizes attribute; set it whenever the image is not full width. */
  sizes?: string;
  priority?: boolean;
  /** Override alt text (defaults to the slot's alt). Pass "" for decorative use. */
  alt?: string;
}

/**
 * Renders an image slot at its intrinsic aspect ratio. While the asset is pending (src null) it renders a
 * labelled placeholder with the same proportions, so layouts are final before imagery arrives.
 */
export function VehicleImage({ slot: key, className, sizes = "100vw", priority = false, alt }: VehicleImageProps) {
  const slot = getImageSlot(key);
  const ratio = slot ? `${slot.width} / ${slot.height}` : "16 / 9";

  if (slot?.src) {
    return (
      <Image
        src={slot.src}
        alt={alt ?? slot.alt}
        width={slot.width}
        height={slot.height}
        sizes={sizes}
        priority={priority}
        className={cn("h-auto w-full object-cover", className)}
      />
    );
  }

  const modelName = slot?.model ? getVehicle(slot.model)?.name : undefined;
  const label = alt ?? slot?.alt ?? key;

  return (
    <div
      role="img"
      aria-label={`${label} (image pending)`}
      data-image-pending={key}
      style={{ aspectRatio: ratio }}
      className={cn(
        "@container relative flex w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,var(--graphite)_0%,var(--carbon)_45%,var(--ink)_100%)] text-paper",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute inset-x-[8%] bottom-[22%] h-px bg-gradient-to-r from-transparent via-mist/40 to-transparent" />
      <span aria-hidden="true" className="font-display text-[clamp(1.25rem,5cqi,4rem)] font-semibold uppercase tracking-[0.18em] opacity-80 [font-stretch:125%]">
        {modelName ?? "ORVANE"}
      </span>
      <span aria-hidden="true" className="mt-2 text-[0.6875rem] uppercase tracking-[0.24em] text-mist">
        {slot?.label ?? "Image"} · image pending
      </span>
    </div>
  );
}
