# Image request 01 — ORVANE vehicle sets (Aren, Sola, Vire)

Why Codex: ORVANE is a fictional brand. Stock car photos show real manufacturers and cannot give three consistent
models with colour and interior variants. Return originals (PNG/JPG) to `docs/image-requests/returned/` using the
exact filenames below (extension may differ).

## Shared style (applies to every image in this file)

Photorealistic automotive studio CGI, the look of a manufacturer's online configurator. An original, fictional
electric car that does not resemble any production model. ORVANE design language: clean monolithic surfacing with one
strong shoulder line, no grille (smooth closed nose), a thin full-width light blade at the front and at the rear,
flush door handles, slim camera mirrors, panoramic dark glass roof, short overhangs.
Setting: seamless dark studio, near-black charcoal floor (#0B0C0E to #15171A) with a soft reflection under the car,
large overhead softbox, gentle rim light, no props. Car fully in frame with clear margin on all sides, centred,
camera at hip height, 50 mm lens feel, sharp focus across the whole car.

Avoid in every image: any logo, badge, emblem, wordmark, text, number plate text (plate area blank and body-coloured),
watermark, people, real manufacturer design cues, cropped or cut-off car, motion blur, lens flare, distorted wheels.

## Models

| Model | Body | Character |
|---|---|---|
| **aren** | Low, long four-door grand touring sedan, fastback roofline, about 5.0 m | Elegant, long wheelbase, calm |
| **sola** | Performance SUV with coupé-like roof, raised stance, strong rear haunches, about 4.9 m | Muscular but clean |
| **vire** | Compact two-door 2+2 coupé, wide and low, cab-rearward, about 4.5 m | Taut, athletic |

## A. Exterior colour set — 5 images per model (15 total), 16:9, 2400 px wide

Fixed view: **front three-quarter from the driver-side front corner**, car facing left-of-camera. First generate
`<model>-ext-lunar-silver`, then create the other four by **editing that same image and changing only the paint
colour**, so body, wheels, angle, framing and lighting stay pixel-identical. Wheels in every image: ten thin spokes,
machined silver with dark inner barrel.

| Filename | Paint |
|---|---|
| `<model>-ext-lunar-silver` | Lunar Silver, fine metallic, #A9ADB3 |
| `<model>-ext-glacier-white` | Glacier White, warm pearl, #E9E7E2 |
| `<model>-ext-basalt-black` | Basalt Black, deep gloss with visible highlights, #141517 |
| `<model>-ext-tide-blue` | Tide Blue, dark metallic petrol blue, #1F3A4D |
| `<model>-ext-ember` | Ember, burnt copper-amber metallic, #B8611F |

## B. Extra views — 3 images per model (9 total), 16:9, 2400 px wide, paint Lunar Silver, same car and studio

| Filename | View |
|---|---|
| `<model>-view-rear` | Rear three-quarter, showing the full-width rear light blade lit soft amber-red |
| `<model>-view-side` | Exact side profile, car facing left |
| `<model>-view-front` | Straight-on front, symmetrical, front light blade lit warm white |

## C. Interior set — 3 images per model (9 total), 16:9, 2400 px wide

Fixed view: from the rear seat centre looking forward over the centre console to the dashboard: slim horizontal
dashboard, one wide low-profile display, small two-spoke steering wheel, floating centre console, ambient light line,
daylight through the glass roof. Generate `<model>-int-onyx` first, then edit it changing only materials and colours.
No text or icons readable on screens (abstract soft glow only).

| Filename | Trim |
|---|---|
| `<model>-int-onyx` | Onyx: black technical textile, dark brushed aluminium, charcoal headliner |
| `<model>-int-dune` | Dune: warm bone-white upholstery (#E7E2DA), pale open-pore oak, light headliner |
| `<model>-int-ember` | Ember: cognac tan upholstery, dark ash wood, charcoal headliner, amber stitching |

## D. Detail shots — 2 images per model (6 total), 4:3, 1600 px wide, Lunar Silver

| Filename | Subject |
|---|---|
| `<model>-detail-light` | Close-up of the front light blade and nose surfacing, shallow depth of field |
| `<model>-detail-cabin` | Close-up of the centre console and display edge with ambient light, Onyx trim |

Total: 39 images. Priority if generation is limited: A, then C, then B, then D; Aren first.
