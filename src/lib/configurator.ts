import { CURRENCY, getVehicle, isVehicleSlug, vehicles } from "@/data/vehicles";
import type { ConfigState, PriceBreakdown, PriceLine, Vehicle, VehicleSlug } from "@/types";
import { configStateSchema } from "./schemas";

export const CONFIG_STORAGE_KEY = "orvane.configurator.v1";
export const CONFIG_VERSION = 1 as const;

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

/** Itemised concept price. Throws if the config references unknown options; repair it first. */
export function getPriceBreakdown(config: ConfigState): PriceBreakdown {
  const v = requireVehicle(config.model);
  const find = <T extends { id: string }>(list: T[], id: string, kind: string): T => {
    const item = list.find((o) => o.id === id);
    if (!item) throw new Error(`Unknown ${kind} "${id}" for ${v.name}`);
    return item;
  };

  const trim = find(v.trims, config.trim, "trim");
  const colour = find(v.colours, config.colour, "colour");
  const wheels = find(v.wheels, config.wheels, "wheels");
  const interior = find(v.interiors, config.interior, "interior");
  const packages = config.packages.map((id) => find(v.packages, id, "package"));

  const lines: PriceLine[] = [
    { key: "base", label: `${v.name} base concept price`, amount: v.basePrice },
    { key: "trim", label: trim.name, amount: trim.priceDelta },
    { key: "colour", label: `${colour.name} paint`, amount: colour.priceDelta },
    { key: "wheels", label: `${wheels.name} wheels`, amount: wheels.priceDelta },
    { key: "interior", label: `${interior.name} interior`, amount: interior.priceDelta },
    ...packages.map((p): PriceLine => ({ key: "package", label: `${p.name} package`, amount: p.priceDelta })),
  ];

  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0) };
}

export function getTotalPrice(config: ConfigState): number {
  return getPriceBreakdown(config).total;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(amount);
}

/**
 * Turn any input (stale localStorage, a hand-edited value, an old shape) into a valid config, or null when
 * the model itself cannot be recovered. Unknown option ids fall back to the model defaults; unknown or
 * duplicate packages are dropped.
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
  return configStateSchema.parse(repaired);
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

export function togglePackage(config: ConfigState, packageId: string): ConfigState {
  const has = config.packages.includes(packageId);
  return { ...config, packages: has ? config.packages.filter((p) => p !== packageId) : [...config.packages, packageId] };
}
