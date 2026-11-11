import type { ColourOption, InteriorOption, Vehicle, VehicleSlug, WheelOption } from "@/types";

/**
 * ORVANE concept lineup. ORVANE is a fictional brand; every name, specification, range and price
 * below is invented for a VIZAM portfolio concept and must be labelled as concept data wherever shown.
 */
export const CONCEPT_DATA_NOTE =
  "Concept data. ORVANE is a fictional brand created by VIZAM for a portfolio project. All specifications, ranges and prices are illustrative and do not describe a real vehicle or offer.";

export const CURRENCY = "CAD";

/*
 * Paint, wheel and interior names are shared across the lineup and match the image briefs in
 * docs/image-requests/ (01-vehicle-sets.md, 02-heroes-and-wheels.md), so each option maps to a rendered asset.
 * Only the price deltas differ per model. The first entry of each list is the default.
 */
const PAINTS: Omit<ColourOption, "priceDelta">[] = [
  { id: "lunar-silver", name: "Lunar Silver", hex: "#A9ADB3", finish: "metallic" },
  { id: "glacier-white", name: "Glacier White", hex: "#E9E7E2", finish: "pearl" },
  { id: "basalt-black", name: "Basalt Black", hex: "#141517", finish: "solid" },
  { id: "tide-blue", name: "Tide Blue", hex: "#1F3A4D", finish: "metallic" },
  { id: "ember", name: "Ember", hex: "#B8611F", finish: "metallic" },
];

const WHEELS: Omit<WheelOption, "priceDelta">[] = [
  { id: "aero", name: "Aero", sizeIn: 20, description: "Near-closed turbine face with curved vanes, satin silver. Best range." },
  { id: "blade", name: "Blade", sizeIn: 21, description: "Ten thin spokes, machined silver face with a dark inner barrel." },
  { id: "forge", name: "Forge", sizeIn: 22, description: "Five split spokes, satin black with a thin amber accent ring." },
];

const INTERIORS: Omit<InteriorOption, "priceDelta">[] = [
  { id: "onyx", name: "Onyx", material: "Black technical textile with dark brushed aluminium", swatch: "#1B1C1F" },
  { id: "dune", name: "Dune", material: "Bone-white upholstery with pale open-pore oak", swatch: "#E7E2DA" },
  { id: "ember", name: "Ember", material: "Cognac upholstery, dark ash and amber stitching", swatch: "#8A4E2C" },
];

function withPrices<T>(items: T[], deltas: number[]): (T & { priceDelta: number })[] {
  if (deltas.length !== items.length) throw new Error("Price delta count must match option count");
  return items.map((item, i) => ({ ...item, priceDelta: deltas[i] }));
}

const colours = (deltas: number[]): ColourOption[] => withPrices(PAINTS, deltas);
const wheels = (deltas: number[]): WheelOption[] => withPrices(WHEELS, deltas);
const interiors = (deltas: number[]): InteriorOption[] => withPrices(INTERIORS, deltas);

function imageKeys(slug: VehicleSlug): Vehicle["images"] {
  return {
    hero: `hero-${slug}`,
    profile: `${slug}-view-side`,
    front: `${slug}-view-front`,
    rear: `${slug}-view-rear`,
    interior: `${slug}-int-onyx`,
    detail: `${slug}-detail-light`,
  };
}

const aren: Vehicle = {
  slug: "aren",
  name: "Aren",
  category: "Grand touring sedan",
  tagline: "Distance, composed.",
  summary:
    "A long, low four-door built for covering ground quietly. Calm at speed, unhurried in the city, and comfortable for a full day behind the wheel.",
  specs: {
    powerKw: 420,
    zeroToHundredS: 3.9,
    rangeKm: 720,
    topSpeedKmh: 240,
    batteryKwh: 108,
    drive: "Dual-motor AWD",
  },
  basePrice: 118000,
  trims: [
    {
      id: "aren-touring",
      name: "Aren Touring",
      description: "Balanced output and the longest range in the lineup.",
      priceDelta: 0,
      specs: { powerKw: 420, zeroToHundredS: 3.9, rangeKm: 720, topSpeedKmh: 240, batteryKwh: 108, drive: "Dual-motor AWD" },
    },
    {
      id: "aren-grand-range",
      name: "Aren Grand Range",
      description: "Larger pack and aero-optimised calibration for long journeys.",
      priceDelta: 12000,
      specs: { powerKw: 440, zeroToHundredS: 3.8, rangeKm: 810, topSpeedKmh: 240, batteryKwh: 122, drive: "Dual-motor AWD" },
    },
    {
      id: "aren-performance",
      name: "Aren Performance",
      description: "Tri-motor drive with adaptive damping tuned for pace.",
      priceDelta: 26000,
      specs: { powerKw: 610, zeroToHundredS: 2.9, rangeKm: 640, topSpeedKmh: 270, batteryKwh: 122, drive: "Tri-motor AWD" },
    },
  ],
  colours: colours([0, 0, 2400, 3200, 4800]),
  wheels: wheels([0, 2900, 5400]),
  interiors: interiors([0, 2200, 4600]),
  packages: [
    {
      id: "aren-assist-plus",
      name: "Assist Plus",
      description: "Extended driver assistance for long motorway stretches.",
      includes: ["Lane-centring assist", "Hands-on traffic jam assist", "Rear cross-traffic braking"],
      priceDelta: 4200,
    },
    {
      id: "aren-acoustic",
      name: "Acoustic Comfort",
      description: "Quieter cabin and an upgraded sound system.",
      includes: ["Laminated side glass", "Road-noise cancellation", "21-speaker audio"],
      priceDelta: 3600,
    },
    {
      id: "aren-winter",
      name: "Winter",
      description: "Warmth and grip for cold climates.",
      includes: ["Heated rear seats", "Heated steering wheel", "Heat pump boost mode"],
      priceDelta: 1800,
    },
    {
      id: "aren-rear-lounge",
      name: "Rear Lounge",
      description: "A more generous second row.",
      includes: ["Reclining rear seats", "Rear climate zone", "Rear control tablet"],
      priceDelta: 5200,
    },
  ],
  features: {
    exterior: ["Flush door handles", "Full-width light signature", "Active rear spoiler", "Panoramic glass roof"],
    interior: ["Five seats", "Floating centre console", "Ambient light rail", "Ventilated front seats"],
    technology: ["Curved 34-inch driver display", "Over-the-air updates", "Phone-as-key", "Route planner with charge stops"],
    safety: ["Eight airbags", "Automatic emergency braking", "Blind-spot monitoring", "Driver attention monitor"],
  },
  images: imageKeys("aren"),
};

const sola: Vehicle = {
  slug: "sola",
  name: "Sola",
  category: "Performance SUV",
  tagline: "Room to roam, built to move.",
  summary:
    "A five-seat SUV with the posture of a performance car. Raised where it helps, low where it counts, and quick on any surface.",
  specs: {
    powerKw: 460,
    zeroToHundredS: 3.8,
    rangeKm: 610,
    topSpeedKmh: 230,
    batteryKwh: 116,
    drive: "Dual-motor AWD",
  },
  basePrice: 132000,
  trims: [
    {
      id: "sola-touring",
      name: "Sola Touring",
      description: "Everyday capability with a quiet, measured ride.",
      priceDelta: 0,
      specs: { powerKw: 460, zeroToHundredS: 3.8, rangeKm: 610, topSpeedKmh: 230, batteryKwh: 116, drive: "Dual-motor AWD" },
    },
    {
      id: "sola-terrain",
      name: "Sola Terrain",
      description: "Raised air suspension and terrain modes for unpaved roads.",
      priceDelta: 9000,
      specs: { powerKw: 460, zeroToHundredS: 4.0, rangeKm: 580, topSpeedKmh: 210, batteryKwh: 116, drive: "Dual-motor AWD" },
    },
    {
      id: "sola-performance",
      name: "Sola Performance",
      description: "Tri-motor drive, torque vectoring and lowered ride height.",
      priceDelta: 24000,
      specs: { powerKw: 640, zeroToHundredS: 3.1, rangeKm: 560, topSpeedKmh: 260, batteryKwh: 116, drive: "Tri-motor AWD" },
    },
  ],
  colours: colours([0, 0, 2800, 3200, 3600]),
  wheels: wheels([0, 3100, 5900]),
  interiors: interiors([0, 2000, 4400]),
  packages: [
    {
      id: "sola-assist-plus",
      name: "Assist Plus",
      description: "Extended driver assistance and a surround camera view.",
      includes: ["Lane-centring assist", "360-degree camera", "Trailer assist"],
      priceDelta: 4400,
    },
    {
      id: "sola-utility",
      name: "Utility",
      description: "Practical additions for gear-heavy weekends.",
      includes: ["Electric tow bar", "Roof rail cross bars", "Load floor rails"],
      priceDelta: 2600,
    },
    {
      id: "sola-winter",
      name: "Winter",
      description: "Warmth and grip for cold climates.",
      includes: ["Heated all seats", "Heated windscreen", "Heat pump boost mode"],
      priceDelta: 2100,
    },
    {
      id: "sola-third-row",
      name: "Occasional Third Row",
      description: "Two fold-flat seats for short trips.",
      includes: ["Two rear-facing seats", "Third-row air vents", "Powered fold"],
      priceDelta: 3800,
    },
  ],
  features: {
    exterior: ["Adaptive air suspension", "Light-bar front signature", "Flush roof rails", "Powered tailgate"],
    interior: ["Five seats", "Sliding second row", "Wide-view glass roof", "Washable floor liners"],
    technology: ["Dual 15-inch displays", "Over-the-air updates", "Terrain modes", "Vehicle-to-load power outlet"],
    safety: ["Ten airbags", "Automatic emergency braking", "Hill descent control", "Rear occupant alert"],
  },
  images: imageKeys("sola"),
};

const vire: Vehicle = {
  slug: "vire",
  name: "Vire",
  category: "Two-door coupé",
  tagline: "Low, light, immediate.",
  summary:
    "A compact two-door with a driver-first cabin. Short overhangs, a low seat and steering that answers before you finish asking.",
  specs: {
    powerKw: 390,
    zeroToHundredS: 3.4,
    rangeKm: 520,
    topSpeedKmh: 260,
    batteryKwh: 88,
    drive: "RWD",
  },
  basePrice: 149000,
  trims: [
    {
      id: "vire-rwd",
      name: "Vire",
      description: "Rear-wheel drive and the lightest kerb weight in the lineup.",
      priceDelta: 0,
      specs: { powerKw: 390, zeroToHundredS: 3.4, rangeKm: 520, topSpeedKmh: 260, batteryKwh: 88, drive: "RWD" },
    },
    {
      id: "vire-awd",
      name: "Vire AWD",
      description: "Dual-motor traction for all seasons.",
      priceDelta: 14000,
      specs: { powerKw: 520, zeroToHundredS: 2.8, rangeKm: 490, topSpeedKmh: 280, batteryKwh: 88, drive: "Dual-motor AWD" },
    },
    {
      id: "vire-track",
      name: "Vire Track",
      description: "Tri-motor drive, carbon aero and track-ready cooling.",
      priceDelta: 46000,
      specs: { powerKw: 720, zeroToHundredS: 2.3, rangeKm: 430, topSpeedKmh: 305, batteryKwh: 92, drive: "Tri-motor AWD" },
    },
  ],
  colours: colours([0, 0, 3400, 5400, 6200]),
  wheels: wheels([0, 4200, 7800]),
  interiors: interiors([0, 1900, 4200]),
  packages: [
    {
      id: "vire-track-pack",
      name: "Track",
      description: "Hardware for regular circuit days.",
      includes: ["Carbon-ceramic brakes", "Track telemetry app", "Battery pre-conditioning for laps"],
      priceDelta: 9800,
    },
    {
      id: "vire-carbon",
      name: "Carbon Aero",
      description: "Exposed carbon aero elements.",
      includes: ["Carbon front splitter", "Carbon mirror caps", "Fixed rear wing"],
      priceDelta: 7200,
    },
    {
      id: "vire-assist",
      name: "Assist",
      description: "Driver assistance for daily use.",
      includes: ["Adaptive cruise control", "Lane-keep assist", "Front and rear parking sensors"],
      priceDelta: 2600,
    },
    {
      id: "vire-grand-tour",
      name: "Grand Tour",
      description: "Comfort for longer drives.",
      includes: ["Ventilated seats", "Fitted luggage set", "Acoustic glass"],
      priceDelta: 3400,
    },
  ],
  features: {
    exterior: ["Short overhangs", "Active aero flaps", "Frameless doors", "Full-width rear light blade"],
    interior: ["Two seats plus occasional bench", "Low-mounted bucket seats", "Flat-bottom wheel", "Physical drive-mode dial"],
    technology: ["Compact 12-inch driver display", "Over-the-air updates", "Lap timer and telemetry", "Phone-as-key"],
    safety: ["Six airbags", "Automatic emergency braking", "Stability control with track mode", "Rear cross-traffic alert"],
  },
  images: imageKeys("vire"),
};

export const vehicles: readonly Vehicle[] = [aren, sola, vire];

export const VEHICLE_SLUGS = ["aren", "sola", "vire"] as const satisfies readonly VehicleSlug[];

export function isVehicleSlug(value: unknown): value is VehicleSlug {
  return typeof value === "string" && (VEHICLE_SLUGS as readonly string[]).includes(value);
}

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}
