# Case study: ORVANE

A VIZAM portfolio concept: a website for **ORVANE**, an invented electric performance car brand. The brand, its five
models, every figure and every image are fictional and labelled that way on the site. Status: built and verified locally,
not deployed.

## Problem

Premium car brands sell with long, image-led pages and a configurator, and most concept sites stop at a hero and a grid.
The brief was to show a full brand site that holds up in detail: a working configurator, honest data labelling, accessible
and fast pages, and real tests, without copying any real manufacturer.

## Approach

- **Design direction**: dark cinematic sections alternating with warm paper sections, one amber accent, wide display
  type (Archivo) over a quiet text face (Inter). Five third-party configurator and hero designs were studied for layout,
  hierarchy and interaction principles only; no assets or branding were reused
  ([DESIGN_REFERENCE.md](DESIGN_REFERENCE.md)).
- **Imagery**: since no licensed 3D model of a fictional car exists, 47 vehicle and brand images (three models, five paints,
  three interiors, views, details, heroes, wheels) plus, for the later Tarn pickup and Vanta track coupé, 9 images generated
  with Gemini and 12 paint and cabin variants made by Codex from them and 12 editorial scenes were generated as a matched set, audited for
  sharpness and consistency, converted to WebP and wired through a slot registry. No 3D, no video, no voice.
- **Built in slices**: setup, assets, home and model pages, configurator, editorial pages, gallery and forms, polish,
  independent QA and security review, delivery.

## Highlights

- **12 page types**: home, models, five model pages, configurator, technology, innovation, performance, design, story,
  gallery, test drive, contact, plus a designed 404.
- **Configurator**: seven steps, live price breakdown, package rules held as data (requires, conflicts, included by trim),
  crossfading stage, save and resume on the device with a versioned and self-repairing storage format, deep links, printable
  summary. The pure logic is unit-tested apart from the UI.
- **Model pages**: the model name sits behind the car through an SVG mask traced from the silhouette, real colour switching,
  hotspots on the exterior, interior trims, spec tables per trim.
- **Forms that are honest**: validated in the browser and again in Server Actions, work without JavaScript, and clearly
  state that nothing is sent or stored.
- **Motion that fails safe**: GSAP loaded lazily, off under reduced motion, and content stays visible without JavaScript or
  if the animation library fails to load.
- **Concept-data labelling**: every spec, range or price block says it is concept data.

## Technical decisions

- **Next.js 16 with Cache Components**: every page is prerendered; only interactive islands are client components.
  Trade-off: the configurator route prerenders a fallback and the live UI appears after hydration, so the fallback paints
  the default stage image (this took mobile LCP on `/configure` from 4264 ms to 1268 ms in the lab test).
- **Slot registry for images**: components ask for a key, never a path, so alt text, sizes and ratios live in one place.
  `deviceSizes` is capped at 1672 px because the sources are no wider.
- **Configurator state as pure functions**: `setOption`, `togglePackage`, `normalizeConfig` and the price functions are
  plain TypeScript. Package rules are data, so adding an option needs no UI change.
- **Security headers and CSP** on every route; the one compromise (`'unsafe-inline'` for scripts and styles, because static
  pages cannot carry a nonce) is documented.
- **250 px layout lock** and no horizontal scroll from 300 px up, as a house rule for every VIZAM site.

## Results (real numbers from the final tree, 2026-11-12)

| Measure | Result |
|---|---|
| Lint, typecheck, production build | pass |
| Unit tests | 88 tests in 10 files, pass |
| End-to-end (Playwright, Chromium) | 162 tests, pass |
| End-to-end (WebKit, 2 workers) | 160 passed, 1 skipped, 1 timing flake that passes alone (details in [AGENT_HANDOFF.md](AGENT_HANDOFF.md)) |
| Accessibility | axe: no serious or critical violations on 15 routes at 390 and 1440 px; Lighthouse accessibility 100 on `/` and `/configure` |
| Lighthouse (mobile, simulated, indicative) | Best practices 100; SEO 69 by design (`noindex`); Performance 44-65 |
| Observed mobile vitals (Playwright, 4x CPU, slow 4G) | LCP 1.3-1.7 s, CLS 0 on `/`, `/models/aren`, `/configure` |
| Initial JavaScript | about 185 KB gzip on most pages, 235 KB on `/configure`; GSAP is in none of them |
| Dependencies | `npm audit`: 0 vulnerabilities |
| Images | 59 WebP files, 4.8 MB in total |

## Limitations

- Concept project: no real company, product, price or service. Not deployed; going live needs the owner's approval.
- Lighthouse Performance is low in simulated mobile runs because of main-thread hydration time, not network weight.
- Source images are at most 1672 px wide, so full-bleed heroes on very large or high-density screens are upscaled.
- Exterior renders all show the Blade wheel; other angles exist for Lunar Silver only; no 360 view.
- Not tested: Firefox (does not start on the development machine), real Safari, real phones, screen readers.
- The forms collect nothing. Real use needs an email provider, rate limiting, bot protection and reviewed privacy text
  ([DEPLOYMENT.md](DEPLOYMENT.md)).
- AI-generated imagery has small artefacts that a photographer-led shoot would not (for example wheel detail).

## Screenshots

In `docs/portfolio/`, named `<screen>-1440.webp` and `<screen>-390.webp`:
home-hero, home-models, models-index, model-aren-hero, model-aren-exterior, model-aren-interior, configure-colour,
configure-wheels, configure-summary, technology-explorer, performance, design-swatches, story, gallery-lightbox,
test-drive-form, test-drive-success, contact. No video was made.
