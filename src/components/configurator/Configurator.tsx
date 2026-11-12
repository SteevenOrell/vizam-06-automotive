"use client";

import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { getVehicle } from "@/data/vehicles";
import {
  adjacentStep,
  availableAngles,
  buildSearch,
  CONFIG_STEPS,
  formatPrice,
  formatSavedAt,
  getDefaultConfig,
  getStageLabel,
  getTotalPrice,
  isCustomised,
  parseUrlParams,
  setOption,
  stageForStep,
  stepIndex,
  switchModel,
  togglePackage,
  type OptionGroup,
  type StageAngle,
  type StageView,
  type StepId,
} from "@/lib/configurator";
import type { ConfigState, VehicleSlug } from "@/types";
import { preloadWhenIdle, WHEEL_STAGE_SIZES } from "./preload";
import { useSavedConfig } from "./savedStore";
import { StepNav } from "./StepNav";
import { ColourStep, InteriorStep, ModelStep, PackagesStep, TrimStep, WheelStep } from "./StepPanels";
import { SummaryPanel } from "./SummaryPanel";
import { VehicleStage } from "./VehicleStage";

const HEADINGS: Record<StepId, { title: string; intro: string }> = {
  model: { title: "Choose your model", intro: "Three ORVANE concepts. Each starts from its own base concept price." },
  trim: { title: "Choose a variant", intro: "Variants change the concept figures and price." },
  colour: { title: "Exterior colour", intro: "Five paints. The stage updates as you choose." },
  wheels: { title: "Wheels", intro: "Three designs, 20 to 22 inch." },
  interior: { title: "Interior", intro: "Three cabin trims. The stage switches to the interior view." },
  packages: { title: "Packages", intro: "Optional. Where packages cannot be combined, the reason is shown." },
  summary: { title: "Your configuration", intro: "Review the build, save it on this device, or book a test drive." },
};

/** Concept price changes are announced after a pause, so quick clicks do not flood screen readers. */
function useSettledValue<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return settled;
}

export function Configurator() {
  const params = useSearchParams();
  const [initial] = useState(() => parseUrlParams(params));

  const [config, setConfig] = useState<ConfigState>(() => getDefaultConfig(initial.model ?? "aren"));
  const [step, setStep] = useState<StepId>(initial.step ?? "model");
  const [view, setView] = useState<StageView>(() => stageForStep(initial.step ?? "model"));
  const [angle, setAngle] = useState<StageAngle>("front34");
  const [visited, setVisited] = useState<ReadonlySet<StepId>>(() => new Set());
  const [pendingModel, setPendingModel] = useState<VehicleSlug | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [banner, setBanner] = useState("");

  const { saved, corrupt, save, remove } = useSavedConfig();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);
  const firstRender = useRef(true);

  const vehicle = getVehicle(config.model)!;
  const total = getTotalPrice(config);
  const settledTotal = useSettledValue(total, 700);
  const effectiveAngle = availableAngles(config).includes(angle) ? angle : "front34";
  const stageLabel = getStageLabel(config, view, effectiveAngle);

  // Corrupt stored data is discarded rather than trusted.
  useEffect(() => {
    if (corrupt) remove();
  }, [corrupt, remove]);

  // Keep the address bar describing the build (model and step) once the visitor starts interacting.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.history.replaceState(null, "", buildSearch(config.model, step));
  }, [config.model, step]);

  // Move focus to the new step's heading when the visitor changed step.
  useEffect(() => {
    if (focusHeading.current) {
      focusHeading.current = false;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  useEffect(() => {
    if (pendingModel) document.getElementById("model-confirm")?.focus();
  }, [pendingModel]);

  // Preload: the model's five paints when idle; the cabin and wheel sets when those steps open.
  useEffect(() => {
    const keys = vehicle.colours.map((c) => `${vehicle.slug}-ext-${c.id}`);
    if (step === "interior" || step === "summary") keys.push(...vehicle.interiors.map((i) => `${vehicle.slug}-int-${i.id}`));
    keys.push(`${vehicle.slug}-int-${config.interior}`);
    const cancelStage = preloadWhenIdle(keys);
    const cancelWheels = preloadWhenIdle(vehicle.wheels.map((w) => `wheel-${w.id}`), WHEEL_STAGE_SIZES);
    return () => {
      cancelStage();
      cancelWheels();
    };
  }, [vehicle, step, config.interior]);

  const goStep = (next: StepId) => {
    if (next === step) return;
    setVisited((v) => new Set(v).add(step));
    setStep(next);
    setView(stageForStep(next));
    setAngle("front34");
    focusHeading.current = true;
    railRef.current?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 1023px)").matches) window.scrollTo({ top: 0, behavior: "auto" });
  };

  const onOption = (group: OptionGroup, id: string) => setConfig((c) => setOption(c, group, id));

  const selectModel = (slug: VehicleSlug) => {
    if (slug === config.model) {
      setPendingModel(null);
      return;
    }
    if (isCustomised(config)) setPendingModel(slug);
    else setConfig(switchModel(slug));
  };

  const confirmModel = () => {
    if (pendingModel) setConfig(switchModel(pendingModel));
    setPendingModel(null);
  };

  const resume = () => {
    if (!saved) return;
    setConfig(saved.config);
    setPendingModel(null);
    const target = initial.step ?? "summary";
    setVisited(new Set(CONFIG_STEPS.slice(0, stepIndex(target)).map((s) => s.id)));
    setStep(target);
    setView(stageForStep(target));
    setBannerDismissed(true);
    setBanner("Resumed your saved configuration.");
  };

  const restart = () => {
    setConfig(getDefaultConfig(config.model));
    setPendingModel(null);
    setVisited(new Set());
    setStep("model");
    setView("exterior");
    setAngle("front34");
    focusHeading.current = true;
  };

  const saveNow = () => {
    const { ok } = save(config);
    if (ok) setBannerDismissed(true);
    return ok;
  };

  const next = adjacentStep(step, 1);
  const prev = adjacentStep(step, -1);
  const nextLabel = next === "summary" ? "View summary" : "Next";
  const heading = HEADINGS[step];
  const title = step === "summary" ? `Your ${vehicle.name}` : heading.title;

  const savedModelName = saved ? getVehicle(saved.config.model)?.name : undefined;
  const savedWhen = saved?.savedAt ? formatSavedAt(saved.savedAt) : "earlier";
  const showBanner = saved !== null && !bannerDismissed;
  const linkModel = initial.model ? getVehicle(initial.model)?.name : undefined;

  const price = (
    <div className="shrink-0">
      <p className="whitespace-nowrap text-xs uppercase tracking-[0.1em] text-mist lg:tracking-[0.16em]">Concept price</p>
      <p data-testid="concept-price" className="whitespace-nowrap font-display text-xl font-semibold tabular-nums leading-tight lg:text-2xl">
        {formatPrice(total)} <span className="text-xs font-normal text-mist">CAD</span>
      </p>
    </div>
  );

  const nav = (
    <>
      {prev ? (
        <Button variant="ghost" onClick={() => goStep(prev)} className="px-3 sm:px-5">
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span className="sr-only sm:not-sr-only">Back</span>
        </Button>
      ) : null}
      {next ? (
        <Button variant="primary" onClick={() => goStep(next)}>
          {nextLabel}
        </Button>
      ) : (
        <LinkButton href={`/test-drive?model=${config.model}`} variant="primary" className="whitespace-nowrap px-4">
          Book a test drive
        </LinkButton>
      )}
    </>
  );

  return (
    <div className="lg:flex lg:h-[max(100dvh,640px)] lg:flex-col lg:pt-[4.75rem]">
      <div className="hidden border-b border-graphite px-6 py-1 lg:block">
        <StepNav step={step} visited={visited} onStep={goStep} />
      </div>

      <div className="lg:flex lg:min-h-0 lg:flex-1">
        <div className="sticky top-0 z-30 bg-ink pt-[3.75rem] [@media(max-height:500px)]:static lg:static lg:flex-1 lg:pt-0">
          <VehicleStage
            config={config}
            view={view}
            angle={effectiveAngle}
            onView={setView}
            className="h-[min(56.25vw,45vh)] lg:h-full"
          />
        </div>

        <div className="flex flex-col bg-carbon lg:w-[440px] lg:shrink-0 lg:border-l lg:border-graphite">
          <div className="border-b border-graphite px-3 pt-2 lg:hidden">
            <StepNav step={step} visited={visited} onStep={goStep} />
          </div>

          <div ref={railRef} className="min-h-[60vh] flex-1 px-4 pb-28 pt-5 lg:min-h-0 lg:overflow-y-auto lg:px-6 lg:pb-6">
            {showBanner && saved ? (
              <div role="region" aria-label="Saved configuration" className="mb-5 rounded-sharp border border-graphite bg-ink p-4">
                <p className="text-sm leading-relaxed">
                  {initial.model && initial.model !== saved.config.model
                    ? `Loading a new ${linkModel} from your link. A saved ${savedModelName} configuration (${savedWhen}) is also on this device.`
                    : initial.model
                      ? `You opened a link for the ${linkModel}. A saved ${savedModelName} configuration (${savedWhen}) is also on this device.`
                      : `A saved ${savedModelName} configuration (${savedWhen}) is on this device.`}
                  {saved.repaired ? " Some options were no longer available and were reset to defaults." : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="primary" onClick={resume}>
                    Resume saved configuration
                  </Button>
                  <Button variant="ghost" onClick={() => setBannerDismissed(true)}>
                    Start new
                  </Button>
                </div>
              </div>
            ) : null}

            <h1 className="text-xs uppercase tracking-[0.24em] text-mist">
              Configure your ORVANE <span aria-hidden="true">·</span> Step {stepIndex(step) + 1} of {CONFIG_STEPS.length}
            </h1>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-2xl font-semibold outline-none [font-stretch:112%]">
              {title}
            </h2>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-paper/85">{heading.intro}</p>

            {step === "model" ? (
              <ModelStep config={config} pending={pendingModel} onSelect={selectModel} onConfirm={confirmModel} onCancel={() => setPendingModel(null)} />
            ) : null}
            {step === "trim" ? <TrimStep config={config} vehicle={vehicle} onOption={onOption} /> : null}
            {step === "colour" ? (
              <ColourStep config={config} vehicle={vehicle} onOption={onOption} angle={effectiveAngle} onAngle={setAngle} />
            ) : null}
            {step === "wheels" ? <WheelStep config={config} vehicle={vehicle} onOption={onOption} /> : null}
            {step === "interior" ? <InteriorStep config={config} vehicle={vehicle} onOption={onOption} /> : null}
            {step === "packages" ? (
              <PackagesStep config={config} vehicle={vehicle} onToggle={(id) => setConfig((c) => togglePackage(c, id))} />
            ) : null}
            {step === "summary" ? (
              <SummaryPanel
                config={config}
                saved={saved}
                onEdit={goStep}
                onSave={saveNow}
                onDeleteSaved={remove}
                onRestart={restart}
              />
            ) : null}
          </div>

          <div className="hidden items-center justify-between gap-3 border-t border-graphite bg-carbon px-6 py-4 lg:flex">
            {price}
            <div className="flex items-center gap-2">{nav}</div>
          </div>
        </div>
      </div>

      <div
        data-fixed
        data-config-bar
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 border-t border-graphite bg-ink/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden"
      >
        {price}
        <div className="flex items-center gap-2">{nav}</div>
      </div>

      <div className="sr-only">
        <p aria-live="polite" aria-atomic="true" data-testid="stage-live">
          {stageLabel}
        </p>
        <p aria-live="polite" aria-atomic="true" data-testid="price-live">
          Concept price {formatPrice(settledTotal)}
        </p>
        <p aria-live="polite" aria-atomic="true">
          {banner}
        </p>
      </div>
    </div>
  );
}
