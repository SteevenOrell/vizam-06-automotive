/**
 * Shared types for the ORVANE concept site.
 * All vehicle figures are fictional concept data.
 */

export type VehicleSlug = "aren" | "sola" | "vire";

export type DriveLayout = "RWD" | "Dual-motor AWD" | "Tri-motor AWD";

export interface VehicleSpecs {
  /** Peak system output in kilowatts. */
  powerKw: number;
  /** 0-100 km/h in seconds. */
  zeroToHundredS: number;
  /** Concept range in kilometres. */
  rangeKm: number;
  /** Top speed in km/h. */
  topSpeedKmh: number;
  /** Usable battery capacity in kWh. */
  batteryKwh: number;
  drive: DriveLayout;
}

export interface TrimVariant {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
  specs: VehicleSpecs;
  /** Package ids that come with this trim at no extra cost. */
  includesPackages?: string[];
}

export type PaintFinish = "solid" | "metallic" | "pearl" | "matte";

export interface ColourOption {
  id: string;
  name: string;
  hex: string;
  finish: PaintFinish;
  priceDelta: number;
}

export interface WheelOption {
  id: string;
  name: string;
  /** Rim diameter in inches. */
  sizeIn: number;
  description: string;
  priceDelta: number;
}

export interface InteriorOption {
  id: string;
  name: string;
  material: string;
  /** Swatch colour for the option chip. */
  swatch: string;
  priceDelta: number;
}

export interface PackageOption {
  id: string;
  name: string;
  description: string;
  includes: string[];
  priceDelta: number;
  /** Package ids that must also be selected (or included by the trim). */
  requires?: string[];
  /** Package ids this one cannot be combined with (applies in both directions). */
  conflictsWith?: string[];
}

export type VehicleImageRole = "hero" | "profile" | "front" | "rear" | "interior" | "detail";

export interface VehicleFeatures {
  exterior: string[];
  interior: string[];
  technology: string[];
  safety: string[];
}

/** A named feature with a short explanation. */
export interface FeatureNote {
  title: string;
  text: string;
}

/** A feature pinned to a point on the exterior image. x and y are percentages of the image box. */
export interface Hotspot extends FeatureNote {
  id: string;
  x: number;
  y: number;
}

export interface GalleryItem {
  /** Slot key from src/data/images.ts. */
  slot: string;
  caption: string;
}

/** Editorial copy and presentation data for a model page. All figures elsewhere are concept data. */
export interface VehicleContent {
  /** One-line character used on cards. */
  character: string;
  /** Narrative paragraphs for the model page intro. */
  story: string[];
  /** The model page hero: light paper tone with the name behind the car, or dark cinematic with the name overlaid. */
  heroTone: "paper" | "dark";
  hotspots: Hotspot[];
  interiorNotes: FeatureNote[];
  technologyNotes: FeatureNote[];
  safetyNotes: FeatureNote[];
  gallery: GalleryItem[];
}

export interface Vehicle {
  slug: VehicleSlug;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  /** Specs of the entry trim (first item in `trims`). */
  specs: VehicleSpecs;
  /** Base concept price in CAD, before trim and option deltas. */
  basePrice: number;
  trims: TrimVariant[];
  colours: ColourOption[];
  wheels: WheelOption[];
  interiors: InteriorOption[];
  packages: PackageOption[];
  features: VehicleFeatures;
  content: VehicleContent;
  /** Image slot keys, resolved by `src/data/images.ts`. */
  images: Record<VehicleImageRole, string>;
}

/** Configurator state as stored in localStorage. */
export interface ConfigState {
  version: 1;
  model: VehicleSlug;
  trim: string;
  colour: string;
  wheels: string;
  interior: string;
  packages: string[];
}

export interface PriceLine {
  key: "base" | "trim" | "colour" | "wheels" | "interior" | "package";
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  lines: PriceLine[];
  total: number;
}

export interface ImageSlot {
  /** Path under /public, or null while the asset is pending. */
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Short label shown on the placeholder. */
  label: string;
  model?: VehicleSlug;
}

export type RouteGroup = "models" | "explore" | "brand" | "connect";

export interface SiteRoute {
  href: string;
  label: string;
  description: string;
  group: RouteGroup;
}
