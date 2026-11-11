import {
  Activity,
  Baby,
  Eye,
  Gauge,
  KeyRound,
  Monitor,
  MonitorSmartphone,
  Mountain,
  Plug,
  Radar,
  RefreshCw,
  Route,
  ScanEye,
  ShieldCheck,
  Timer,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

const rules: [RegExp, LucideIcon][] = [
  [/dual .*displays/i, MonitorSmartphone],
  [/display/i, Monitor],
  [/over-the-air/i, RefreshCw],
  [/phone-as-key/i, KeyRound],
  [/route planner/i, Route],
  [/terrain/i, Mountain],
  [/power outlet|vehicle-to-load/i, Plug],
  [/lap timer|telemetry/i, Timer],
  [/airbags/i, ShieldCheck],
  [/emergency braking/i, TriangleAlert],
  [/blind-spot/i, Eye],
  [/attention/i, ScanEye],
  [/hill descent/i, Activity],
  [/occupant/i, Baby],
  [/stability/i, Gauge],
  [/cross-traffic/i, Radar],
];

/** Icon for a technology or safety feature title; falls back to a shield. */
export function iconForFeature(title: string): LucideIcon {
  return rules.find(([pattern]) => pattern.test(title))?.[1] ?? ShieldCheck;
}
