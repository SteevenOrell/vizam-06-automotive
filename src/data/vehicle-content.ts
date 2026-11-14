import type { GalleryItem, VehicleContent, VehicleSlug } from "@/types";

/**
 * Editorial copy for the model pages. ORVANE is fictional: nothing here describes a real vehicle, test result,
 * award or customer. Hotspot x/y are percentages of the exterior image box (the `<model>-ext-<paint>` images share one pose).
 */

const gallery = (slug: VehicleSlug, extras: GalleryItem[]): GalleryItem[] => [
  { slot: `${slug}-view-front`, caption: "Front view" },
  { slot: `${slug}-view-side`, caption: "Side profile" },
  { slot: `${slug}-view-rear`, caption: "Rear three-quarter" },
  ...extras,
  { slot: `${slug}-detail-light`, caption: "Light signature" },
  { slot: `${slug}-int-dune`, caption: "Dune interior" },
];

export const vehicleContent: Record<VehicleSlug, VehicleContent> = {
  aren: {
    character: "Quiet, long-legged and unhurried.",
    story: [
      "Aren is built around one idea: arriving as fresh as you left. The cabin is quiet, the seats are generous and the suspension spends its effort removing the road rather than describing it.",
      "A long wheelbase and a low roofline keep the silhouette calm. The light signature is a single unbroken line, so the car reads as one piece from every distance.",
    ],
    heroTone: "paper",
    hotspots: [
      { id: "light", title: "Full-width light signature", text: "One continuous blade replaces separate headlamps. It doubles as the welcome and charging indicator.", x: 29, y: 52 },
      { id: "roof", title: "Panoramic glass roof", text: "A single pane with a tuned coating keeps the cabin bright without the heat of a full-glass roof.", x: 70, y: 25 },
      { id: "handles", title: "Flush door handles", text: "Handles sit level with the body and present when you approach with the phone key.", x: 72, y: 44 },
      { id: "spoiler", title: "Active rear spoiler", text: "Rises above motorway speeds to trim drag and settle the rear axle, then retracts to keep the line clean.", x: 91, y: 40 },
    ],
    interiorNotes: [
      { title: "Five seats", text: "Real room for three adults in the rear, with a flat floor and a wide, low tunnel." },
      { title: "Floating centre console", text: "A brushed bridge that leaves open storage below for bags, a tablet or a cooling box." },
      { title: "Ambient light rail", text: "A thin warm line across the dashboard and doors. Brightness follows the time of day." },
      { title: "Ventilated front seats", text: "Quiet, multi-zone airflow through perforated upholstery for long summer drives." },
    ],
    technologyNotes: [
      { title: "Curved 34-inch driver display", text: "One continuous screen for instruments, media and navigation, with glare-controlled glass." },
      { title: "Over-the-air updates", text: "Drive, comfort and interface improvements arrive while the car is parked and plugged in." },
      { title: "Phone-as-key", text: "Unlock, start and share access with family members without a physical key." },
      { title: "Route planner with charge stops", text: "Plans the whole trip, including where and for how long to charge, and updates as conditions change." },
    ],
    safetyNotes: [
      { title: "Eight airbags", text: "Front, side, curtain and knee protection around the full cabin." },
      { title: "Automatic emergency braking", text: "Detects vehicles, cyclists and pedestrians ahead and brakes when the driver does not." },
      { title: "Blind-spot monitoring", text: "Light cues in the mirrors and an audible warning if you signal into an occupied lane." },
      { title: "Driver attention monitor", text: "Notices drifting focus on long journeys and suggests a break." },
    ],
    gallery: gallery("aren", [{ slot: "aren-ext-tide-blue", caption: "Tide Blue" }]),
  },
  sola: {
    character: "Raised where it helps, low where it counts.",
    story: [
      "Sola is the answer for people who want an SUV that still drives like a performance car. The hip point is high enough for easy entry, but the centre of gravity stays low thanks to a floor-mounted battery.",
      "Air suspension lets the car change character. Lowered on the motorway for efficiency and stability, raised on gravel and snow for clearance.",
    ],
    heroTone: "dark",
    hotspots: [
      { id: "suspension", title: "Adaptive air suspension", text: "Ride height changes by up to 60 mm between access, normal and terrain modes.", x: 52, y: 64 },
      { id: "light", title: "Light-bar front signature", text: "A slim light bar with a wide beam pattern replaces conventional lamp clusters.", x: 28, y: 47 },
      { id: "rails", title: "Flush roof rails", text: "Rails sit flat against the roof and carry cross bars when needed. No wind noise when bare.", x: 60, y: 19 },
      { id: "tailgate", title: "Powered tailgate", text: "Opens with a foot gesture, the phone key or a button on the door.", x: 91, y: 37 },
    ],
    interiorNotes: [
      { title: "Five seats", text: "Wide, upright seating with real headroom for adults in every position." },
      { title: "Sliding second row", text: "Trade rear legroom for luggage depth with a single lever." },
      { title: "Wide-view glass roof", text: "Extends over the second row so rear passengers get light and sky too." },
      { title: "Washable floor liners", text: "Moulded liners that lift out and rinse clean after muddy weekends." },
    ],
    technologyNotes: [
      { title: "Dual 15-inch displays", text: "A driver display and a centre display, each with dedicated controls so nothing hides in menus." },
      { title: "Over-the-air updates", text: "Software updates arrive overnight and are installed while the car is parked." },
      { title: "Terrain modes", text: "Gravel, snow and sand calibrations adjust power delivery, ride height and traction." },
      { title: "Vehicle-to-load power outlet", text: "Power tools, a campsite kitchen or a laptop from a standard outlet in the load area." },
    ],
    safetyNotes: [
      { title: "Ten airbags", text: "Front, side, curtain and knee protection, extended to the second row." },
      { title: "Automatic emergency braking", text: "Detects vehicles, cyclists and pedestrians ahead and brakes when the driver does not." },
      { title: "Hill descent control", text: "Holds a steady, slow speed on steep descents so you can focus on steering." },
      { title: "Rear occupant alert", text: "Reminds the driver to check the back seats when the car is switched off." },
    ],
    gallery: gallery("sola", [{ slot: "sola-ext-tide-blue", caption: "Tide Blue" }]),
  },
  vire: {
    character: "Short overhangs, immediate answers.",
    story: [
      "Vire is the smallest and lightest ORVANE. Everything about it is shaped around the person in the left seat: the position, the pedals, the sound inside, the steering that answers before you finish the thought.",
      "The cabin is deliberately simple. A physical drive-mode dial, a flat-bottom wheel and a low-slung seat remove the distance between intent and result.",
    ],
    heroTone: "dark",
    hotspots: [
      { id: "overhangs", title: "Short overhangs", text: "Wheels are pushed to the corners so the car rotates quickly and fits tight roads comfortably.", x: 11, y: 60 },
      { id: "aero", title: "Active aero flaps", text: "Flaps in the front intake open for cooling and close for drag, controlled by drive mode and speed.", x: 34, y: 68 },
      { id: "doors", title: "Frameless doors", text: "Glass drops a few millimetres as the door opens, so the roofline stays clean and the seal is tight.", x: 72, y: 38 },
      { id: "blade", title: "Full-width rear light blade", text: "A single red line spans the tail and brightens under braking.", x: 93, y: 36 },
    ],
    interiorNotes: [
      { title: "Two seats plus occasional bench", text: "Two bucket seats and a small rear bench for bags, or a short trip with children." },
      { title: "Low-mounted bucket seats", text: "Seats mounted close to the floor for a lower centre of gravity and a better view of the road." },
      { title: "Flat-bottom wheel", text: "A compact wheel with clear grip points and an unobstructed view of the display." },
      { title: "Physical drive-mode dial", text: "A machined dial on the centre console. Reach for it without looking." },
    ],
    technologyNotes: [
      { title: "Compact 12-inch driver display", text: "Focused instruments with a track layout that shows only what matters at pace." },
      { title: "Over-the-air updates", text: "Drive calibrations and interface improvements arrive without a visit to a service centre." },
      { title: "Lap timer and telemetry", text: "Record laps, sector times and motor temperatures, and review them on your phone." },
      { title: "Phone-as-key", text: "Unlock and start with the phone, and share temporary access with a friend." },
    ],
    safetyNotes: [
      { title: "Six airbags", text: "Front, side and head protection tuned for a low, two-door body." },
      { title: "Automatic emergency braking", text: "Detects vehicles, cyclists and pedestrians ahead and brakes when the driver does not." },
      { title: "Stability control with track mode", text: "Two calibrations: full intervention on the road, a wider margin on a closed circuit." },
      { title: "Rear cross-traffic alert", text: "Warns of approaching vehicles when reversing out of a space." },
    ],
    gallery: gallery("vire", [{ slot: "vire-ext-ember", caption: "Ember" }]),
  },
  tarn: {
    character: "Carries the load, keeps the calm.",
    story: [
      "Tarn is the ORVANE for people who need a bed, a hitch and a long day of range, and still want the cabin to feel like the rest of the lineup. The battery sits low between the axles, so a loaded bed or a trailer behind it does not change how the truck feels from the driver's seat.",
      "The nose carries the family light blade edge to edge. At the back, a light bar runs along the top of the bed, so the truck is read the same way at night as it is by day.",
    ],
    heroTone: "dark",
    hotspots: [
      { id: "light", title: "Full-width front light blade", text: "One slim blade across the nose replaces separate headlamps, and doubles as the welcome and charging indicator.", x: 27, y: 47 },
      { id: "mirrors", title: "Camera-based side mirrors", text: "Slim camera pods feed small displays inside the doors, with a clear view even when a wide trailer is hitched.", x: 55, y: 37 },
      { id: "handles", title: "Flush door handles", text: "Handles sit level with the doors and present as you approach with the phone key.", x: 63, y: 43 },
      { id: "bed", title: "Bed with rear light bar", text: "A long bed with a light bar along the rear corner, so the tail stays visible from behind a load.", x: 85, y: 41 },
    ],
    interiorNotes: [
      { title: "Five seats", text: "A crew cab with real room for three adults in the rear and a flat floor to stow gear." },
      { title: "Wide curved display", text: "A driver display and a centre screen under one curved glass, with a dedicated controls strip below." },
      { title: "Ambient light rail", text: "A thin warm line across the dashboard and doors. Brightness follows the time of day." },
      { title: "Large centre console", text: "A deep, lidded console between the front seats with a wireless charging pad and cup holders." },
    ],
    technologyNotes: [
      { title: "Over-the-air updates", text: "Drive, comfort and interface improvements arrive while the truck is parked and plugged in." },
      { title: "Phone-as-key", text: "Unlock, start and share access with the crew without a physical key." },
      { title: "Trailer and load planner", text: "Plans the route and the charge stops for the towed weight, and updates as conditions change." },
      { title: "Vehicle-to-load power outlet", text: "Power tools, a compressor or a campsite kitchen from standard outlets in the bed." },
    ],
    safetyNotes: [
      { title: "Ten airbags", text: "Front, side, curtain and knee protection, extended to the second row." },
      { title: "Automatic emergency braking", text: "Detects vehicles, cyclists and pedestrians ahead and brakes when the driver does not." },
      { title: "Trailer sway control", text: "Brakes individual wheels and trims motor torque to settle a swaying trailer." },
      { title: "Surround camera view", text: "A bird's-eye picture around the truck for tight yards, ramps and trailer coupling." },
    ],
    gallery: [
      { slot: "tarn-view-side", caption: "Side profile" },
      { slot: "tarn-view-rear", caption: "Rear three-quarter" },
      { slot: "tarn-int-onyx", caption: "Onyx interior" },
    ],
  },
  vanta: {
    character: "Shaped by airflow, built for the circuit.",
    story: [
      "Vanta starts from the air. The nose is low and wide, the sides are cut to feed the cooling, and a large rear wing sets the balance at speed. Every carbon panel is there because it does a job.",
      "Inside, there are two carbon-shell seats, a flat-bottom wheel and a display that wraps around the driver. The rest stays out of the way, so the road and the lap are what you see.",
    ],
    heroTone: "dark",
    hotspots: [
      { id: "wing", title: "Large rear wing", text: "A wide carbon wing on tall stays adds downforce at speed. Its angle follows the drive mode.", x: 81, y: 20 },
      { id: "lights", title: "Slim split front lights", text: "Two thin light lines sit low in the nose, above the carbon splitter, and glow amber when the car wakes.", x: 30, y: 64 },
      { id: "vents", title: "Bonnet vents", text: "Openings in the bonnet let air from the front cooling stack escape, reducing lift over the nose.", x: 24, y: 45 },
      { id: "skirts", title: "Carbon side skirts", text: "Textured carbon sills guide air along the sides and away from the rear wheels.", x: 66, y: 68 },
    ],
    interiorNotes: [
      { title: "Two seats", text: "Two fixed-back seats set low in the floor, with a harness-ready design and a clear view of the road." },
      { title: "Carbon-shell bucket seats", text: "Carbon shells with suede-like inserts hold the driver in place through long, fast corners." },
      { title: "Flat-bottom wheel", text: "A compact wheel with clear grip points and an unobstructed view of the display." },
      { title: "Physical drive-mode dial", text: "A machined dial on the centre console. Reach for it without looking." },
    ],
    technologyNotes: [
      { title: "Wraparound driver display", text: "Instruments curve around the driver, with a track layout that shows only what matters at pace." },
      { title: "Camera-based side mirrors", text: "Slim cameras and door-mounted screens reduce drag and widen the view to the rear." },
      { title: "Lap timer and telemetry", text: "Record laps, sector times and motor temperatures, and review them on your phone." },
      { title: "Over-the-air updates", text: "Drive calibrations and interface improvements arrive without a visit to a service centre." },
    ],
    safetyNotes: [
      { title: "Six airbags", text: "Front, side and head protection tuned for a low, two-seat body." },
      { title: "Automatic emergency braking", text: "Detects vehicles, cyclists and pedestrians ahead and brakes when the driver does not." },
      { title: "Stability control with track mode", text: "Two calibrations: full intervention on the road, a wider margin on a closed circuit." },
      { title: "Rear cross-traffic alert", text: "Warns of approaching vehicles when reversing out of a space." },
    ],
    gallery: [
      { slot: "vanta-view-front", caption: "Front view" },
      { slot: "vanta-view-side", caption: "Side profile" },
      { slot: "vanta-view-rear", caption: "Rear view" },
      { slot: "vanta-int-onyx", caption: "Onyx interior" },
    ],
  },
};
