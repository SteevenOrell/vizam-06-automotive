import Image from "next/image";
import { getImageSlot } from "@/data/images";
import { vehicles } from "@/data/vehicles";
import {
  availableAngles,
  formatDelta,
  formatPrice,
  getIncludedPackageIds,
  getPackageState,
  STAGE_ANGLES,
  type OptionGroup,
  type StageAngle,
} from "@/lib/configurator";
import type { ConfigState, Vehicle, VehicleSlug } from "@/types";
import { Button } from "@/components/ui/Button";
import { OptionCard } from "./OptionCard";
import { preloadSlot, WHEEL_STAGE_SIZES } from "./preload";

const delta = (n: number) => <span className="shrink-0 text-sm tabular-nums text-paper/85">{formatDelta(n)}</span>;

function Thumb({ slot, sizes, className }: { slot: string; sizes: string; className?: string }) {
  const s = getImageSlot(slot);
  if (!s?.src) return null;
  return <Image src={s.src} alt="" width={s.width} height={s.height} sizes={sizes} className={className} />;
}

interface PanelProps {
  config: ConfigState;
  vehicle: Vehicle;
  onOption: (group: OptionGroup, id: string) => void;
}

export function ModelStep({
  config,
  pending,
  onSelect,
  onConfirm,
  onCancel,
}: {
  config: ConfigState;
  pending: VehicleSlug | null;
  onSelect: (slug: VehicleSlug) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const target = vehicles.find((v) => v.slug === pending);
  const current = vehicles.find((v) => v.slug === config.model);
  return (
    <div>
      <div role="radiogroup" aria-labelledby="step-heading" className="grid gap-3">
        {vehicles.map((v) => (
          <OptionCard
            key={v.slug}
            type="radio"
            name="model"
            value={v.slug}
            checked={config.model === v.slug}
            onChange={() => onSelect(v.slug)}
            onPreview={() => preloadSlot(`${v.slug}-ext-${v.colours[0].id}`)}
          >
            <span className="grid grid-cols-[7.5rem_1fr] items-center gap-4 pr-7">
              <Thumb slot={`${v.slug}-ext-lunar-silver`} sizes="120px" className="aspect-video w-full rounded-sharp object-cover" />
              <span className="block">
                <span className="block text-xs uppercase tracking-[0.18em] text-mist">{v.category}</span>
                <span className="mt-1 block font-display text-xl font-semibold">{v.name}</span>
                <span className="mt-1 block text-sm text-paper/85">From {formatPrice(v.basePrice)}</span>
                <span className="block text-xs text-mist">Concept base price</span>
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
      {target && current ? (
        <div role="group" aria-label="Confirm model change" className="mt-4 rounded-sharp border border-amber bg-amber/10 p-4">
          <p className="text-sm leading-relaxed">
            Switch to the {target.name}? Your changes to the {current.name} will be reset to {target.name} defaults, because options differ per
            model.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button id="model-confirm" variant="primary" onClick={onConfirm}>
              Switch to {target.name}
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Keep {current.name}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TrimStep({ config, vehicle, onOption }: PanelProps) {
  return (
    <div>
      <div role="radiogroup" aria-labelledby="step-heading" className="grid gap-3">
        {vehicle.trims.map((t) => (
          <OptionCard key={t.id} type="radio" name="trim" value={t.id} checked={config.trim === t.id} onChange={() => onOption("trim", t.id)}>
            <span className="block pr-7">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg font-semibold">{t.name}</span>
                {delta(t.priceDelta)}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-paper/85">{t.description}</span>
              <span className="mt-3 flex flex-wrap gap-1.5 text-xs">
                {[`${t.specs.powerKw} kW`, `0-100 km/h ${t.specs.zeroToHundredS} s`, `${t.specs.rangeKm} km range`, t.specs.drive].map((chip) => (
                  <span key={chip} className="rounded-full border border-graphite px-2.5 py-1 text-paper/85">
                    {chip}
                  </span>
                ))}
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
      <p className="mt-3 text-xs text-mist">Concept figures. Not a real vehicle.</p>
    </div>
  );
}

export function ColourStep({
  config,
  vehicle,
  onOption,
  angle,
  onAngle,
}: PanelProps & { angle: StageAngle; onAngle: (a: StageAngle) => void }) {
  const angles = availableAngles(config);
  return (
    <div>
      <div role="radiogroup" aria-labelledby="step-heading" className="grid gap-2">
        {vehicle.colours.map((c) => (
          <OptionCard
            key={c.id}
            type="radio"
            name="colour"
            value={c.id}
            checked={config.colour === c.id}
            onChange={() => onOption("colour", c.id)}
            onPreview={() => preloadSlot(`${vehicle.slug}-ext-${c.id}`)}
          >
            <span className="flex items-center gap-3 pr-7">
              <span aria-hidden="true" className="size-9 shrink-0 rounded-full ring-2 ring-paper/25" style={{ backgroundColor: c.hex }} />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{c.name}</span>
                <span className="block text-xs text-mist">{c.finish[0].toUpperCase() + c.finish.slice(1)} finish</span>
              </span>
              {delta(c.priceDelta)}
            </span>
          </OptionCard>
        ))}
      </div>

      <fieldset className="mt-6 min-w-0 border-0 p-0">
        <legend className="text-xs uppercase tracking-[0.2em] text-mist">Views</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {STAGE_ANGLES.map((a) => {
            const enabled = angles.includes(a.id);
            return (
              <label key={a.id} className={enabled ? "relative cursor-pointer" : "relative cursor-not-allowed"}>
                <input
                  type="radio"
                  name="angle"
                  value={a.id}
                  checked={angle === a.id && enabled}
                  disabled={!enabled}
                  onChange={() => onAngle(a.id)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-11 items-center rounded-full border border-graphite px-4 text-sm transition-colors duration-300 hover:border-mist peer-checked:border-amber peer-checked:bg-amber/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber peer-disabled:text-paper/60 peer-disabled:hover:border-graphite">
                  {a.label}
                </span>
              </label>
            );
          })}
        </div>
        {angles.length === 1 ? <p className="mt-2 text-xs text-mist">Additional views shown in Lunar Silver.</p> : null}
      </fieldset>
    </div>
  );
}

export function WheelStep({ config, vehicle, onOption }: PanelProps) {
  return (
    <div>
      <p className="mb-4 rounded-sharp border border-graphite bg-ink/40 p-3 text-sm leading-relaxed text-paper/85">
        Vehicle preview shown with Blade 21 wheels. Select the Wheel view on the stage to see the design you choose.
      </p>
      <div role="radiogroup" aria-labelledby="step-heading" className="grid gap-3">
        {vehicle.wheels.map((w) => (
          <OptionCard
            key={w.id}
            type="radio"
            name="wheels"
            value={w.id}
            checked={config.wheels === w.id}
            onChange={() => onOption("wheels", w.id)}
            onPreview={() => preloadSlot(`wheel-${w.id}`, WHEEL_STAGE_SIZES)}
          >
            <span className="grid grid-cols-[4.5rem_1fr] items-center gap-4 pr-7">
              <Thumb slot={`wheel-${w.id}`} sizes="72px" className="aspect-square w-full rounded-full object-cover" />
              <span className="block">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-semibold">
                    {w.name} <span className="text-sm font-normal text-mist">{w.sizeIn} in</span>
                  </span>
                  {delta(w.priceDelta)}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-paper/85">{w.description}</span>
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

export function InteriorStep({ config, vehicle, onOption }: PanelProps) {
  return (
    <div role="radiogroup" aria-labelledby="step-heading" className="grid gap-3">
      {vehicle.interiors.map((i) => (
        <OptionCard
          key={i.id}
          type="radio"
          name="interior"
          value={i.id}
          checked={config.interior === i.id}
          onChange={() => onOption("interior", i.id)}
          onPreview={() => preloadSlot(`${vehicle.slug}-int-${i.id}`)}
        >
          <span className="flex items-center gap-3 pr-7">
            <span aria-hidden="true" className="size-9 shrink-0 rounded-full ring-2 ring-paper/25" style={{ backgroundColor: i.swatch }} />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold">{i.name}</span>
              <span className="block text-sm text-paper/85">{i.material}</span>
            </span>
            {delta(i.priceDelta)}
          </span>
        </OptionCard>
      ))}
    </div>
  );
}

export function PackagesStep({ config, vehicle, onToggle }: Omit<PanelProps, "onOption"> & { onToggle: (id: string) => void }) {
  const includedIds = getIncludedPackageIds(config);
  return (
    <div role="group" aria-labelledby="step-heading" className="grid gap-3">
      {vehicle.packages.map((p) => {
        const state = getPackageState(config, p.id);
        return (
          <OptionCard
            key={p.id}
            type="checkbox"
            name="packages"
            value={p.id}
            checked={state.selected}
            disabled={state.disabled}
            onChange={() => onToggle(p.id)}
          >
            <span className="block pr-7">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg font-semibold">{p.name}</span>
                {delta(includedIds.includes(p.id) ? 0 : p.priceDelta)}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-paper/85">{p.description}</span>
              <span className="mt-2 block text-sm text-paper/85">Includes: {p.includes.join(", ")}.</span>
              {state.reason ? <span className="mt-2 block text-sm font-medium text-amber">{state.reason}</span> : null}
            </span>
          </OptionCard>
        );
      })}
    </div>
  );
}
