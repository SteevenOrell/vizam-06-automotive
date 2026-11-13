import { CONCEPT_DATA_NOTE, CURRENCY, getVehicle, isVehicleSlug, vehicles } from "@/data/vehicles";
import type {
  ColourOption,
  ConfigState,
  InteriorOption,
  PackageOption,
  PriceBreakdown,
  PriceLine,
  TrimVariant,
  Vehicle,
  VehicleSlug,
  WheelOption,
} from "@/types";
import { configStateSchema } from "./schemas";

export const CONFIG_STORAGE_KEY = "orvane.configurator.v1";
export const CONFIG_VERSION = 1 as const;
/** Paint that has extra rendered angles (rear, side, front). */
export const SILVER_ID = "lunar-silver";

function requireVehicle(slug: VehicleSlug): Vehicle {
  const vehicle = getVehicle(slug);
  if (!vehicle) throw new Error(`Unknown vehicle: ${slug}`);
  return vehicle;
}

/** Entry configuration for a model: first trim, colour, wheel and interior; no packages. */
export function getDefaultConfig(slug: VehicleSlug = vehicles[0].slug): ConfigState {
  const v = requireVehicle(slug);
  return {
    version: CONFIG_VERSION,
    model: v.slug,
    trim: v.trims[0].id,
    colour: v.colours[0].id,
    wheels: v.wheels[0].id,
    interior: v.interiors[0].id,
    packages: [],
  };
}

/* ---------- Package rules ---------- */

/** Package ids the chosen trim includes at no cost. */
export function getIncludedPackageIds(config: ConfigState): string[] {
  const v = requireVehicle(config.model);
  return v.trims.find((t) => t.id === config.trim)?.includesPackages ?? [];
}

function packagesConflict(a: PackageOption, b: PackageOption): boolean {
  return Boolean(a.conflictsWith?.includes(b.id) || b.conflictsWith?.includes(a.id));
}

/**
 * Enforce package rules on a config whose ids exist: drop packages the trim already includes, duplicates,
 * conflicting packages (the earlier one in the model's list wins) and packages whose requirements are missing.
 * Result is in the model's package order.
 */
export function normalizeConfig(config: ConfigState): ConfigState {
  const v = requireVehicle(config.model);
  const included = new Set(getIncludedPackageIds(config));
  let selected = v.packages.filter((p) => config.packages.includes(p.id) && !included.has(p.id));

  let changed = true;
  while (changed) {
    changed = false;
    const includedOptions = v.packages.filter((p) => included.has(p.id));
    for (const p of selected) {
      const others = [...includedOptions, ...selected.filter((o) => o.id !== p.id && selected.indexOf(o) < selected.indexOf(p))];
      const conflicts = others.some((o) => packagesConflict(p, o));
      const present = new Set([...included, ...selected.map((s) => s.id)]);
      const missing = (p.requires ?? []).some((r) => !present.has(r));
      if (conflicts || missing) {
        selected = selected.filter((s) => s.id !== p.id);
        changed = true;
        break;
      }
    }
  }
  return { ...config, packages: selected.map((p) => p.id) };
}

export interface PackageState {
  selected: boolean;
  included: boolean;
  /** True when the visitor cannot toggle it right now. */
  disabled: boolean;
  /** Why it is disabled, in plain words. */
  reason?: string;
}

export function getPackageState(config: ConfigState, packageId: string): PackageState {
  const v = requireVehicle(config.model);
  const pkg = v.packages.find((p) => p.id === packageId);
  if (!pkg) return { selected: false, included: false, disabled: true, reason: "Not available for this model" };
  const trim = v.trims.find((t) => t.id === config.trim);
  if (getIncludedPackageIds(config).includes(packageId)) {
    return { selected: true, included: true, disabled: true, reason: `Included with ${trim?.name ?? "this variant"}` };
  }
  if (config.packages.includes(packageId)) return { selected: true, included: false, disabled: false };

  const present = new Set([...getIncludedPackageIds(config), ...config.packages]);
  const clash = v.packages.find((o) => present.has(o.id) && packagesConflict(pkg, o));
  if (clash) return { selected: false, included: false, disabled: true, reason: `Not available with ${clash.name}` };
  const missing = (pkg.requires ?? []).map((r) => v.packages.find((o) => o.id === r)).find((o) => o && !present.has(o.id));
  if (missing) return { selected: false, included: false, disabled: true, reason: `Requires ${missing.name}` };
  return { selected: false, included: false, disabled: false };
}

/** Toggle a package. Blocked or included packages leave the config unchanged; removing one removes its dependants. */
export function togglePackage(config: ConfigState, packageId: string): ConfigState {
  const state = getPackageState(config, packageId);
  if (state.included || (!state.selected && state.disabled)) return config;
  const packages = state.selected ? config.packages.filter((p) => p !== packageId) : [...config.packages, packageId];
  return normalizeConfig({ ...config, packages });
}

/* ---------- Option changes ---------- */

export type OptionGroup = "trim" | "colour" | "wheels" | "interior";

const GROUP_LISTS = {
  trim: (v: Vehicle) => v.trims,
  colour: (v: Vehicle) => v.colours,
  wheels: (v: Vehicle) => v.wheels,
  interior: (v: Vehicle) => v.interiors,
} as const;

/** Set one option. Unknown ids leave the config unchanged. A trim change re-applies package rules. */
export function setOption(config: ConfigState, group: OptionGroup, id: string): ConfigState {
  const v = requireVehicle(config.model);
  if (!GROUP_LISTS[group](v).some((o) => o.id === id)) return config;
  return normalizeConfig({ ...config, [group]: id });
}

/** Switching model always lands on that model's defaults (option ids differ per model). */
export function switchModel(slug: VehicleSlug): ConfigState {
  return getDefaultConfig(slug);
}

/** True when the visitor has changed anything from the model's defaults. */
export function isCustomised(config: ConfigState): boolean {
  return JSON.stringify(normalizeConfig(config)) !== JSON.stringify(getDefaultConfig(config.model));
}

/* ---------- Pricing and selection ---------- */

export interface Selection {
  vehicle: Vehicle;
  trim: TrimVariant;
  colour: ColourOption;
  wheels: WheelOption;
  interior: InteriorOption;
  packages: { option: PackageOption; included: boolean }[];
}

/** Resolve ids to option objects. Throws on unknown ids; repair the config first. */
export function getSelection(config: ConfigState): Selection {
  const vehicle = requireVehicle(config.model);
  const find = <T extends { id: string }>(list: T[], id: string, kind: string): T => {
    const item = list.find((o) => o.id === id);
    if (!item) throw new Error(`Unknown ${kind} "${id}" for ${vehicle.name}`);
    return item;
  };
  const included = getIncludedPackageIds(config).filter((id) => !config.packages.includes(id));
  return {
    vehicle,
    trim: find(vehicle.trims, config.trim, "trim"),
    colour: find(vehicle.colours, config.colour, "colour"),
    wheels: find(vehicle.wheels, config.wheels, "wheels"),
    interior: find(vehicle.interiors, config.interior, "interior"),
    packages: [
      ...included.map((id) => ({ option: find(vehicle.packages, id, "package"), included: true })),
      ...config.packages.map((id) => ({ option: find(vehicle.packages, id, "package"), included: false })),
    ],
  };
}

/** Itemised concept price. Throws if the config references unknown options; repair it first. */
export function getPriceBreakdown(config: ConfigState): PriceBreakdown {
  const { vehicle: v, trim, colour, wheels, interior, packages } = getSelection(config);
  const lines: PriceLine[] = [
    { key: "base", label: `${v.name} base concept price`, amount: v.basePrice },
    { key: "trim", label: trim.name, amount: trim.priceDelta },
    { key: "colour", label: `${colour.name} paint`, amount: colour.priceDelta },
    { key: "wheels", label: `${wheels.name} wheels`, amount: wheels.priceDelta },
    { key: "interior", label: `${interior.name} interior`, amount: interior.priceDelta },
    ...packages.map(
      (p): PriceLine => ({
        key: "package",
        label: p.included ? `${p.option.name} package (included with ${trim.name})` : `${p.option.name} package`,
        amount: p.included ? 0 : p.option.priceDelta,
      }),
    ),
  ];
  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0) };
}

export function getTotalPrice(config: ConfigState): number {
  return getPriceBreakdown(config).total;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(amount);
}

/** "+CAD 3,200", "Included" or "-CAD 500". */
export function formatDelta(amount: number): string {
  if (amount === 0) return "Included";
  return `${amount > 0 ? "+" : "-"}${formatPrice(Math.abs(amount))}`;
}

/** Plain-text summary for the clipboard. */
export function getSummaryText(config: ConfigState, savedAt?: string | null): string {
  const s = getSelection(config);
  const b = getPriceBreakdown(config);
  const sp = s.trim.specs;
  const lines = [
    `ORVANE ${s.vehicle.name} (${s.vehicle.category}) - concept configuration`,
    "",
    `Variant: ${s.trim.name}`,
    `Paint: ${s.colour.name} (${s.colour.finish})`,
    `Wheels: ${s.wheels.name}, ${s.wheels.sizeIn} inch`,
    `Interior: ${s.interior.name}, ${s.interior.material}`,
    `Packages: ${s.packages.length ? s.packages.map((p) => p.option.name + (p.included ? " (included)" : "")).join(", ") : "None"}`,
    "",
    `Concept figures: ${sp.powerKw} kW, 0-100 km/h in ${sp.zeroToHundredS} s, ${sp.rangeKm} km range, ${sp.drive}`,
    "",
    "Concept price breakdown",
    ...b.lines.map((l) => `- ${l.label}: ${formatPrice(l.amount)}`),
    `Total concept price: ${formatPrice(b.total)}`,
    "",
    CONCEPT_DATA_NOTE,
  ];
  if (savedAt) lines.push(`Saved on this device: ${savedAt}`);
  return lines.join("\n");
}

/* ---------- Repair and storage ---------- */

/**
 * Turn any input (stale localStorage, a hand-edited value, an old shape) into a valid config, or null when
 * the model itself cannot be recovered. Unknown option ids fall back to the model defaults; unknown or
 * duplicate packages are dropped; package rules are enforced.
 */
export function repairConfig(input: unknown): ConfigState | null {
  if (typeof input !== "object" || input === null) return null;
  const raw = input as Record<string, unknown>;
  if (!isVehicleSlug(raw.model)) return null;

  const v = requireVehicle(raw.model);
  const fallback = getDefaultConfig(v.slug);
  const pick = (list: { id: string }[], value: unknown, def: string) =>
    typeof value === "string" && list.some((o) => o.id === value) ? value : def;

  const packages = Array.isArray(raw.packages)
    ? [...new Set(raw.packages.filter((p): p is string => typeof p === "string" && v.packages.some((o) => o.id === p)))]
    : [];

  const repaired: ConfigState = {
    version: CONFIG_VERSION,
    model: v.slug,
    trim: pick(v.trims, raw.trim, fallback.trim),
    colour: pick(v.colours, raw.colour, fallback.colour),
    wheels: pick(v.wheels, raw.wheels, fallback.wheels),
    interior: pick(v.interiors, raw.interior, fallback.interior),
    packages,
  };
  return configStateSchema.parse(normalizeConfig(repaired));
}

/** True when the config is structurally valid and every option exists for its model. */
export function isValidConfig(input: unknown): input is ConfigState {
  const parsed = configStateSchema.safeParse(input);
  if (!parsed.success) return false;
  const repaired = repairConfig(parsed.data);
  return repaired !== null && JSON.stringify(repaired) === JSON.stringify(parsed.data);
}

export function serializeConfig(config: ConfigState): string {
  return JSON.stringify(config);
}

/** Parse a stored string. Returns a repaired config, or null when nothing usable is stored. */
export function parseConfig(stored: string | null | undefined): ConfigState | null {
  if (!stored) return null;
  try {
    return repairConfig(JSON.parse(stored));
  } catch {
    return null;
  }
}

/** What "Save configuration" writes to localStorage under CONFIG_STORAGE_KEY. */
export interface SavedConfig {
  version: typeof CONFIG_VERSION;
  savedAt: string;
  config: ConfigState;
}

export function serializeSaved(config: ConfigState, now: Date = new Date()): string {
  const saved: SavedConfig = { version: CONFIG_VERSION, savedAt: now.toISOString(), config };
  return JSON.stringify(saved);
}

export interface ParsedSaved {
  config: ConfigState;
  /** ISO timestamp, or null when the stored value had none (older shape). */
  savedAt: string | null;
  /** True when something had to be repaired (wrong version, unknown ids, bare legacy shape). */
  repaired: boolean;
}

/** Parse the stored value. Repairs what it can; null for empty, corrupt or unrecoverable data. */
export function parseSaved(stored: string | null | undefined): ParsedSaved | null {
  if (!stored) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(stored);
  } catch {
    return null;
  }
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const wrapped = "config" in obj;
  const inner = wrapped ? obj.config : raw;
  const config = repairConfig(inner);
  if (!config) return null;
  const at = typeof obj.savedAt === "string" && !Number.isNaN(Date.parse(obj.savedAt)) ? obj.savedAt : null;
  const repaired = !wrapped || obj.version !== CONFIG_VERSION || at === null || !isValidConfig(inner);
  return { config, savedAt: wrapped ? at : null, repaired };
}

export function formatSavedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

/* ---------- Steps and URL ---------- */

export const CONFIG_STEPS = [
  { id: "model", label: "Model" },
  { id: "trim", label: "Variant" },
  { id: "colour", label: "Colour" },
  { id: "wheels", label: "Wheels" },
  { id: "interior", label: "Interior" },
  { id: "packages", label: "Packages" },
  { id: "summary", label: "Summary" },
] as const;

export type StepId = (typeof CONFIG_STEPS)[number]["id"];

export function isStepId(value: unknown): value is StepId {
  return CONFIG_STEPS.some((s) => s.id === value);
}

export function stepIndex(step: StepId): number {
  return CONFIG_STEPS.findIndex((s) => s.id === step);
}

/** Next (+1) or previous (-1) step, or null at the ends. */
export function adjacentStep(step: StepId, direction: 1 | -1): StepId | null {
  return CONFIG_STEPS[stepIndex(step) + direction]?.id ?? null;
}

export interface UrlParams {
  model: VehicleSlug | null;
  step: StepId | null;
}

/** Read `?model=` and `?step=`; invalid or repeated values are ignored. */
export function parseUrlParams(params: { get(name: string): string | null } | null | undefined): UrlParams {
  const model = params?.get("model") ?? null;
  const step = params?.get("step") ?? null;
  return { model: isVehicleSlug(model) ? model : null, step: isStepId(step) ? step : null };
}

export function buildSearch(model: VehicleSlug, step: StepId): string {
  return `?model=${model}&step=${step}`;
}

/* ---------- Stage ---------- */

export type StageView = "exterior" | "interior" | "wheel";
export type StageAngle = "front34" | "rear" | "side" | "front";

export const STAGE_VIEWS: { id: StageView; label: string }[] = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "wheel", label: "Wheel" },
];

export const STAGE_ANGLES: { id: StageAngle; label: string }[] = [
  { id: "front34", label: "Front 3/4" },
  { id: "rear", label: "Rear 3/4" },
  { id: "side", label: "Side" },
  { id: "front", label: "Front" },
];

export function stageForStep(step: StepId): StageView {
  if (step === "wheels") return "wheel";
  if (step === "interior") return "interior";
  return "exterior";
}

/** Front 3/4 is always available; the other angles only exist in Lunar Silver. */
export function availableAngles(config: ConfigState): StageAngle[] {
  return config.colour === SILVER_ID ? ["front34", "rear", "side", "front"] : ["front34"];
}

/** Image slot key shown on the stage. */
export function getStageSlot(config: ConfigState, view: StageView, angle: StageAngle = "front34"): string {
  if (view === "interior") return `${config.model}-int-${config.interior}`;
  if (view === "wheel") return `wheel-${config.wheels}`;
  const a = availableAngles(config).includes(angle) ? angle : "front34";
  if (a === "front34") return `${config.model}-ext-${config.colour}`;
  return `${config.model}-view-${a}`;
}

/** Announcement text for the stage, e.g. "Exterior: Tide Blue". */
export function getStageLabel(config: ConfigState, view: StageView, angle: StageAngle = "front34"): string {
  const s = getSelection(config);
  if (view === "interior") return `Interior: ${s.interior.name}`;
  if (view === "wheel") return `Wheels: ${s.wheels.name}, ${s.wheels.sizeIn} inch`;
  const a = availableAngles(config).includes(angle) ? angle : "front34";
  const angleLabel = STAGE_ANGLES.find((x) => x.id === a)!.label;
  return a === "front34" ? `Exterior: ${s.colour.name}` : `Exterior: ${s.colour.name}, ${angleLabel.toLowerCase()} view`;
}
