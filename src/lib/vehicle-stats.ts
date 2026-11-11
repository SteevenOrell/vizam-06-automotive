import type { Stat } from "@/components/ui/StatRow";
import type { VehicleSpecs } from "@/types";

/** The four headline figures shown as a stat row. Concept data. */
export function headlineStats(specs: VehicleSpecs): Stat[] {
  return [
    { value: String(specs.powerKw), unit: "kW", label: "Power" },
    { value: specs.zeroToHundredS.toFixed(1), unit: "s", label: "0-100 km/h" },
    { value: String(specs.rangeKm), unit: "km", label: "Range" },
    { value: String(specs.topSpeedKmh), unit: "km/h", label: "Top speed" },
  ];
}

export interface SpecRow {
  key: keyof VehicleSpecs;
  label: string;
  value: string;
}

/** Every spec as a labelled, unit-formatted row, in display order. */
export function specRows(specs: VehicleSpecs): SpecRow[] {
  return [
    { key: "powerKw", label: "Peak power", value: `${specs.powerKw} kW` },
    { key: "zeroToHundredS", label: "0-100 km/h", value: `${specs.zeroToHundredS.toFixed(1)} s` },
    { key: "rangeKm", label: "Range", value: `${specs.rangeKm} km` },
    { key: "topSpeedKmh", label: "Top speed", value: `${specs.topSpeedKmh} km/h` },
    { key: "batteryKwh", label: "Battery", value: `${specs.batteryKwh} kWh` },
    { key: "drive", label: "Drive", value: specs.drive },
  ];
}
