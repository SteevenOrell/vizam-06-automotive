import { vehicles } from "./vehicles";
import { driveLayouts, specRange } from "@/lib/editorial";

/*
 * Copy and structure for the five editorial pages (technology, innovation, performance, design, story).
 * ORVANE is fictional: everything here describes the concept, not a real product, test or company history.
 * Every number is derived from ./vehicles.
 */

const [batteryMin, batteryMax] = specRange(vehicles, "batteryKwh");
const [powerMin, powerMax] = specRange(vehicles, "powerKw");
const [rangeMin, rangeMax] = specRange(vehicles, "rangeKm");
const [, topSpeedMax] = specRange(vehicles, "topSpeedKmh");

export interface Fact {
  label: string;
  value: string;
}

/* ------------------------------------------------------------------ Technology */

export const technologyStats = [
  { value: `${batteryMin}-${batteryMax}`, unit: "kWh", label: "Battery capacity" },
  { value: `${powerMin}-${powerMax}`, unit: "kW", label: "Peak power" },
  { value: `${rangeMin}-${rangeMax}`, unit: "km", label: "Concept range" },
  { value: "1", unit: "platform", label: "Under three models" },
];

export interface ExplorerTabData {
  id: string;
  label: string;
  title: string;
  text: string;
  points: string[];
  facts: Fact[];
  /** Editorial image key, a vehicle slot key, or "thermal" for the diagram. */
  visual: string;
  /** Alt text for a vehicle image used instead of an editorial one. */
  alt?: string;
}

export const platformTabs: ExplorerTabData[] = [
  {
    id: "battery",
    label: "Battery",
    title: "A flat pack that is part of the structure.",
    text: "The battery sits low between the axles and doubles as a stiff floor for the cabin. Small machined modules are easier to cool evenly, and in the concept service plan a single module can be swapped without lifting the whole pack.",
    points: [
      "Machined aluminium modules with cooling channels built into the casting",
      "Mass kept low and central, which is what makes a tall car feel settled",
      "One pack architecture, sized per model rather than redesigned per model",
    ],
    facts: [
      { label: "Capacity", value: `${batteryMin}-${batteryMax} kWh` },
      { label: "Smallest pack", value: `Vire, ${batteryMin} kWh` },
      { label: "Largest pack", value: `Aren Grand Range, ${batteryMax} kWh` },
    ],
    visual: "ed-battery-module",
  },
  {
    id: "motors",
    label: "Motors",
    title: "One, two or three motors, one calibration.",
    text: "Every model shares the same motor family and the same torque logic. The base Vire drives the rear axle alone; the dual-motor cars add a front motor; the Performance and Track trims add a second rear motor so torque can be shaped corner by corner.",
    points: [
      "Single-rear, dual AWD and tri-motor AWD built from one motor family",
      "Torque is split in software, many times a second, rather than by mechanical differentials",
      "Gentle application at low speed, full response one pedal travel later",
    ],
    facts: [
      { label: "Layouts", value: "RWD, dual, tri-motor" },
      { label: "Peak power", value: `${powerMin}-${powerMax} kW` },
      { label: "Top speed", value: `up to ${topSpeedMax} km/h (Vire Track)` },
    ],
    visual: "ed-platform",
  },
  {
    id: "thermal",
    label: "Thermal",
    title: "One loop that decides where heat goes.",
    text: "Battery, motors and cabin share a single coolant circuit managed by a heat pump. The concept idea is to treat heat as an asset: borrow it from the motors on a cold morning, send it to the radiator on a fast climb.",
    points: [
      "Battery pre-conditioning when a charge stop is planned on the route",
      "Heat pump boost mode for cold climates, part of the Winter packages",
      "Cabin comfort drawn from the same loop, so a warm cabin costs less range",
    ],
    facts: [
      { label: "Circuits", value: "1 shared loop" },
      { label: "Heat source", value: "Heat pump" },
      { label: "Cold-weather option", value: "Winter package" },
    ],
    visual: "thermal",
  },
  {
    id: "software",
    label: "Software",
    title: "A car that keeps learning after delivery.",
    text: "One software stack runs the drivetrain, the cabin and the assistance features. Updates arrive over the air, are explained in plain language and can be scheduled for overnight.",
    points: [
      "Over-the-air updates for drive, display and assistance",
      "Phone-as-key and a route planner that includes charge stops",
      "Physical controls for what you change while driving, screens for the rest",
    ],
    facts: [
      { label: "Updates", value: "Over the air" },
      { label: "Key", value: "Phone-as-key" },
      { label: "Planner", value: "Route with charge stops" },
    ],
    visual: "vire-detail-cabin",
    alt: "Vire driver area with the machined drive-mode dial on the centre console",
  },
];

const LAYOUT_COPY: Record<string, { title: string; text: string }> = {
  RWD: { title: "Rear drive", text: "One motor on the rear axle. The lightest layout, and the one that feels most like a conversation between driver and road." },
  "Dual-motor AWD": { title: "Dual-motor all-wheel drive", text: "A motor on each axle. Traction in any weather, and the strongest range figures in the lineup." },
  "Tri-motor AWD": { title: "Tri-motor all-wheel drive", text: "One front motor, two at the rear. Torque vectoring across the rear axle makes the car rotate where you point it." },
};

export const driveCards = driveLayouts(vehicles).map((g) => ({ ...g, ...LAYOUT_COPY[g.layout] }));

export const chargingSteps = [
  { n: "01", title: "Plan", text: "Enter a destination and the planner proposes where, and for how long, you will need to stop. It prefers fewer, longer, quieter stops over many short ones." },
  { n: "02", title: "Prepare", text: "Ahead of a planned stop the pack is brought to its preferred temperature, so the charger meets a battery that is ready to accept power." },
  { n: "03", title: "Charge", text: "Plug in and the car handles the handshake. A line of light on the front shows state of charge from across a car park." },
  { n: "04", title: "Go", text: "The display shows the range you now have and the next stop on the route, then gets out of the way." },
];

export const cockpitPoints = [
  { title: "One wide display", text: "The Aren carries a curved 34-inch driver display. Information sits low and wide, so the road stays in view." },
  { title: "An ambient line", text: "A thin line of light follows the dashboard and shifts with the time of day. It is the only decoration." },
  { title: "Controls you can find", text: "A machined dial for drive modes and physical controls for climate and volume, usable without looking down." },
];

export const assistPoints = [
  { title: "Lane-centring assist", text: "Holds the car in its lane on marked roads. Hands on the wheel, always." },
  { title: "Hands-on traffic jam assist", text: "Handles the stop-start of congested motorways at low speed." },
  { title: "Automatic emergency braking", text: "Watches the road ahead and can brake when the driver does not." },
  { title: "Blind-spot and attention monitoring", text: "Warns about traffic alongside and notices when the driver's attention drifts." },
];

/* ------------------------------------------------------------------ Innovation */

export interface ResearchTheme {
  n: string;
  id: string;
  title: string;
  lead: string;
  text: string;
  directions: string[];
  image: string;
  /** Alt text, used when the image is a vehicle image rather than an editorial one. */
  alt?: string;
}

export const researchThemes: ResearchTheme[] = [
  {
    n: "01",
    id: "aerodynamics",
    title: "Aerodynamics",
    lead: "Air is the biggest load on an electric car at speed.",
    text: "The concept treats the whole car as one surface. Flush handles, a smooth underbody and an active rear spoiler are drawn together with the cooling inlets, so every opening has to earn its place.",
    directions: ["Wind-tunnel studies of roofline and tail", "Wheel designs tuned for airflow, such as the near-closed Aero 20", "Active elements that retract when they are not needed"],
    image: "ed-wind-tunnel",
  },
  {
    n: "02",
    id: "light",
    title: "Light engineering",
    lead: "One continuous line of light, front and rear.",
    text: "Replacing separate lamps with a single blade saves space and gives ORVANE its signature. The research question is how much a single line can do: show charge state, greet the driver and shape a beam for the road ahead.",
    directions: ["Full-width light blades tested on a rig before they meet a body", "Adaptive beam patterns that follow the road", "A rear blade that reads clearly in rain and fog"],
    image: "ed-lab-light",
  },
  {
    n: "03",
    id: "materials",
    title: "Materials and circularity",
    lead: "Fewer materials, chosen to be recovered.",
    text: "The three interior trims, Onyx, Dune and Ember, are a starting point for a simpler material list: technical textile, open-pore wood, aluminium. The concept asks what each part becomes at the end of the car's life.",
    directions: ["Mono-material parts that can be separated without tools", "Recycled aluminium for structure and trim", "Textiles and upholstery chosen for repair as much as for looks"],
    image: "aren-int-dune",
    alt: "ORVANE Aren cabin in Dune trim with bone-white upholstery and pale open-pore oak",
  },
  {
    n: "04",
    id: "ota",
    title: "Evolution over the air",
    lead: "The car on day one should not be the car in year five.",
    text: "A shared software stack lets the same update improve efficiency, refine the controls and add features across the lineup. Over-the-air evolution is a design principle, not a feature: hardware is specified to leave room for what comes later.",
    directions: ["Update notes written for drivers, not engineers", "Scheduled, overnight installs with a clear rollback", "Hardware margin reserved for future assistance features"],
    image: "aren-detail-cabin",
    alt: "Aren centre console and the lower edge of the curved display, lit by a thin ambient line",
  },
];

export const researchStages = [
  { n: "A", title: "Explore", text: "Sketches, simulations and rig tests turn a question into a direction. Many directions end here, and that is the point." },
  { n: "B", title: "Prototype", text: "A promising direction is built at full size on a rig or a test body, so it can be judged by the people who will live with it." },
  { n: "C", title: "Prove", text: "Only after long cycles of testing would a direction be proposed for a production car. In this concept, nothing has reached that stage." },
];

/* ------------------------------------------------------------------ Performance */

export const chassisItems = [
  { title: "Adaptive damping", text: "Each wheel's damper adjusts continuously, so the car stays flat in corners and compliant over broken tarmac." },
  { title: "Blended braking", text: "Regenerative and friction braking blend into one pedal feel. The discs are large and plain because they rarely need to work hard." },
  { title: "Torque vectoring", text: "On the tri-motor cars the two rear motors share torque to rotate the car on corner entry and steady it on exit." },
];

export interface DriveMode {
  id: string;
  name: string;
  text: string;
  /** Intensity 1-4. */
  levels: { throttle: number; damping: number; steering: number };
}

export const driveModes: DriveMode[] = [
  { id: "calm", name: "Calm", text: "Soft throttle, supple damping and maximum regeneration for one-pedal city driving.", levels: { throttle: 1, damping: 1, steering: 1 } },
  { id: "balanced", name: "Balanced", text: "The default. Natural response and a steady ride for most roads.", levels: { throttle: 2, damping: 2, steering: 2 } },
  { id: "sport", name: "Sport", text: "Sharper throttle, firmer damping and a more direct steering ratio.", levels: { throttle: 3, damping: 3, steering: 3 } },
  { id: "track", name: "Track", text: "Full response, stiffest damping and the most active torque vectoring. For closed circuits, with the Vire Track package.", levels: { throttle: 4, damping: 4, steering: 4 } },
];

/* ------------------------------------------------------------------ Design */

export const designPrinciples = [
  {
    n: "01",
    title: "Composed",
    text: "A composed car does not need to shout. We draw long, uninterrupted surfaces and keep the overhangs short, so the car looks settled even when it is standing still.",
    inCar: "In the car: a single shoulder line from headlight to tail.",
  },
  {
    n: "02",
    title: "Honest",
    text: "Nothing is there to impress. Surfaces are what they are, controls do what their shape suggests, and materials are named plainly rather than renamed for effect.",
    inCar: "In the car: flush handles, one display, and a dial you can find by feel.",
  },
  {
    n: "03",
    title: "Precise",
    text: "Small gaps and consistent radii make a calm shape look calm. We would rather revise a line ten times than accept an approximation of it.",
    inCar: "In the car: one radius family from the light blade to the wheel arch.",
  },
];

export const designProcess = [
  { n: "01", title: "Sketch", text: "Side profiles first, drawn quickly and in volume. A good proportion survives being drawn badly." },
  { n: "02", title: "Clay", text: "Full-size clay and film let the team judge light as it moves across a surface, which a screen cannot show." },
  { n: "03", title: "Material", text: "Textile, wood and metal samples are held against paint under daylight before any of them is named." },
  { n: "04", title: "Light", text: "The light blade is fitted last and tuned longest, because it is what you remember after dark." },
];

export const lightBladeNotes = [
  { slot: "aren-detail-light", model: "Aren", text: "Full width, continuous, softly amber. The calmest expression of the line." },
  { slot: "sola-detail-light", model: "Sola", text: "Taller stance, same line. It wraps the corners to stay recognisable from the side." },
  { slot: "vire-detail-light", model: "Vire", text: "Sharper and lower. At the rear it becomes a single red blade across the tail." },
];

/* ------------------------------------------------------------------ Story */

export const storyNotice =
  "Concept narrative. ORVANE is a fictional brand. The story below is a design exercise by VIZAM, not a company history: its people, places and chapters are imagined.";

export const storyChapters = [
  { n: "I", title: "A workshop by the sea", text: "The concept imagines a small workshop on a coast road where a handful of engineers argue about what an electric car should feel like. Quiet, they decide, is the thing nobody has finished yet." },
  { n: "II", title: "One platform, three ideas", text: "Rather than one car, the concept imagines a single platform with room for three characters: a sedan for distance, an SUV for room, a coupé for immediacy." },
  { n: "III", title: "The line of light", text: "A single blade of light becomes the signature. It replaces lamps, badges and ornament, and gives every model the same face after dark." },
  { n: "IV", title: "The atelier", text: "Assembly is imagined as a calm room with daylight, not a noisy hall. Fewer stations, more time per car, and every unit finished by hand." },
  { n: "V", title: "Cars that keep improving", text: "The concept ends where it started: with the idea that software lets a car get better after it leaves the atelier." },
];

export const storyValues = [
  { title: "Calm over noise", text: "We measure a car by how it feels at the end of a long day, not only by how it feels in the first ten seconds." },
  { title: "Fewer, better parts", text: "Each part has to justify itself. What remains is easier to build, to repair and to recover." },
  { title: "Honest language", text: "We write what a car does, in plain words, and label concept figures as concept." },
  { title: "Made to last", text: "Hardware with margin and software that evolves, so ownership gets better rather than older." },
];
