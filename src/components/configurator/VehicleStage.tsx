import Image from "next/image";
import { getImageSlot } from "@/data/images";
import { getSelection, getStageSlot, STAGE_VIEWS, type StageAngle, type StageView } from "@/lib/configurator";
import { cn } from "@/lib/cn";
import type { ConfigState } from "@/types";
import { STAGE_SIZES, WHEEL_STAGE_SIZES } from "./preload";
import { StageImage } from "./StageImage";

interface VehicleStageProps {
  config: ConfigState;
  view: StageView;
  angle: StageAngle;
  onView: (v: StageView) => void;
  className?: string;
}

/** Dark ink stage: crossfading vehicle, cabin or wheel image, a view switcher, a thumbnail of the other view and a caption. */
export function VehicleStage({ config, view, angle, onView, className }: VehicleStageProps) {
  const s = getSelection(config);
  const slot = getStageSlot(config, view, angle);
  const other: StageView = view === "exterior" ? "interior" : "exterior";
  const otherSlot = getImageSlot(getStageSlot(config, other, "front34"));
  const blade = s.vehicle.wheels.find((w) => w.id === "blade");

  return (
    <div
      data-stage={view}
      className={cn("relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_65%,#1d2025_0%,var(--carbon)_45%,var(--ink)_100%)]", className)}
    >
      {view === "wheel" ? (
        <div className="stage-fade-radial absolute inset-y-0 left-1/2 aspect-square -translate-x-1/2">
          <StageImage slot={slot} sizes={WHEEL_STAGE_SIZES} className="object-contain" priority />
        </div>
      ) : (
        <div className="stage-fade-x absolute inset-0">
          <div className="stage-fade-y absolute inset-0">
            <StageImage slot={slot} sizes={STAGE_SIZES} className="object-contain" priority />
          </div>
        </div>
      )}

      <div role="group" aria-label="Stage view" className="absolute left-2 top-2 z-10 flex gap-1 rounded-full bg-ink/80 p-1 ring-1 ring-paper/15 backdrop-blur sm:left-4 sm:top-4">
        {STAGE_VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => onView(v.id)}
            className={cn(
              "min-h-11 rounded-full px-3 text-xs transition-colors duration-300 sm:px-4 sm:text-sm",
              view === v.id ? "bg-paper text-ink" : "text-paper/85 hover:bg-paper/10",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {otherSlot?.src ? (
        <button
          type="button"
          onClick={() => onView(other)}
          aria-label={`Show ${other} view`}
          className="absolute bottom-3 right-3 z-10 hidden overflow-hidden rounded-sharp ring-1 ring-paper/30 transition hover:ring-amber sm:block sm:bottom-4 sm:right-4"
        >
          <Image src={otherSlot.src} alt="" width={otherSlot.width} height={otherSlot.height} sizes="120px" className="aspect-video w-24 object-cover lg:w-32" />
          <span className="absolute inset-x-0 bottom-0 bg-ink/75 px-1 py-0.5 text-[0.6875rem] capitalize text-paper">{other}</span>
        </button>
      ) : null}

      <p className="pointer-events-none absolute bottom-2 left-2 z-10 max-w-[70%] text-xs leading-snug text-paper/90 sm:bottom-4 sm:left-4 sm:max-w-[60%] sm:text-sm">
        {view === "wheel" ? (
          <>
            <span className="block font-display text-base font-semibold sm:text-lg">
              {s.wheels.name} · {s.wheels.sizeIn} in
            </span>
            <span className="hidden sm:block">{s.wheels.description}</span>
          </>
        ) : view === "interior" ? (
          <span className="block font-display text-base font-semibold sm:text-lg">{s.interior.name} interior</span>
        ) : (
          <>
            <span className="block font-display text-base font-semibold sm:text-lg">
              {s.vehicle.name} · {s.colour.name}
            </span>
            {blade ? <span className="hidden text-xs text-paper/80 sm:block">Preview shown with {blade.name} {blade.sizeIn} wheels</span> : null}
          </>
        )}
      </p>
    </div>
  );
}
