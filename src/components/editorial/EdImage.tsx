import { VehicleImage } from "@/components/ui/VehicleImage";
import { resolveImage } from "@/data/editorial-images";

interface EdImageProps {
  /** Editorial key ("ed-platform") or a vehicle slot key. Falls back to a vehicle image while the editorial file is missing. */
  name: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  alt?: string;
}

/** Image for the editorial pages: always real imagery, never a placeholder. */
export function EdImage({ name, sizes, className, priority, alt }: EdImageProps) {
  const r = resolveImage(name, alt);
  return <VehicleImage slot={r.slot} alt={r.alt} sizes={sizes} className={className} priority={priority} />;
}
