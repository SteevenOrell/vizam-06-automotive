# Agent handoff — ORVANE (vizam-06-automotive)

_Last updated: 2026-11-11 America/Toronto, after step 4 (Slice B, configurator), by the step-4 build agent_

## Objective
VIZAM portfolio concept: premium site for ORVANE, a fictional electric performance car brand. 12 page types, a working
image-based configurator, validated demo forms, tests, docs, portfolio screenshots. Plan in
[PROJECT_PLAN.md](PROJECT_PLAN.md); design in [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md).

## Repository
- Path: `C:\Users\SteevenWemin\Documents\Projects\vizam-06-automotive`. No remote. Never push, merge or deploy without Steeven.
- Branch: `feat/initial-build`. Commit: see `git log --oneline -1`.
- `docs/design-references/*.jpg` are third-party screenshots with real brand logos: kept local via `.git/info/exclude`,
  never commit them. `docs/image-requests/returned/` is git-ignored (Codex originals).

## Stack (installed versions)
Next 16.4.6 (App Router, Turbopack, `cacheComponents: true`, `partialPrefetching: true`), React 19.3.0, TypeScript 5.9.3
strict, Tailwind 4.3.3 (via `@tailwindcss/turbopack`, no PostCSS config), GSAP 3.15.1, lucide-react 1.72.0, Zod 4.6.7,
Vitest 5.1.0 + Testing Library + jsdom 31, Playwright 1.65.0, ESLint 9 + eslint-config-next 16.4.6. Node 24.
Read `AGENTS.md`: this Next version differs from older docs; check `node_modules/next/dist/docs/` before using APIs.

## Scripts
`npm run dev` (port 3006) · `build` · `start` (3006) · `lint` · `typecheck` (`next typegen && tsc --noEmit`) ·
`test` (vitest run) · `e2e` (Playwright builds + starts the app on 3006 itself; reuses a running server locally).

## What exists (component inventory)
- Tokens: `src/app/globals.css` (CSS variables exactly per DESIGN_REFERENCE + `--amber-soft` hover and `--amber-ink`
  for amber text on light; mapped in `@theme inline` → `bg-ink`, `text-amber-ink`, `rounded-sharp`, `font-display`...).
  Also: skip link, `:focus-visible` amber outline, reduced-motion rule, **250px lock** (`#root` and `[data-fixed]` →
  500px, fixed also `right:auto`; `html{overflow-x:auto}`), `#root{overflow-x:clip}`.
- **Rule for later slices: every `position: fixed` element must carry the `data-fixed` attribute** (that is how the
  250px lock finds it; e.g. the configurator's fixed price bar).
- Fonts: `src/app/layout.tsx` — Archivo (with `wdth` axis, use `[font-stretch:112%|125%]`) as `--font-display-face`,
  Inter as `--font-text`; next/font self-hosts at build time.
- Layout: `src/app/layout.tsx` (`#root` wrapper, skip link to `#main`, header in Suspense, footer). Metadata title
  template `%s | ORVANE`; `robots: noindex` (concept brand; flip in step 9 if Steeven wants indexing).
- Header/menu: `src/components/layout/SiteHeader.tsx` (floating dark pills: wordmark, desktop pill nav Models/Configure/
  Technology/Story, Test drive link, Menu button), `SiteMenu.tsx` (full-screen dialog with every route: focus trap, Esc,
  scroll lock, focus return, aria-expanded/controls), `SiteFooter.tsx` (grouped nav, "Concept project by VIZAM" chip,
  CONCEPT_DATA_NOTE), `Wordmark.tsx` (original arc mark + wide "ORVANE").
- UI primitives `src/components/ui/`: `Button.tsx` (`Button`, `LinkButton`, `buttonClasses`; variant primary|solid|ghost,
  tone dark|light, size md|lg, 44px min height), `Layout.tsx` (`Container` max 1440, `Section` tone ink|carbon|paper|bone
  with data-tone, spacing default|compact|none), `Typography.tsx` (`Eyebrow`, `Heading` level/size incl. `display`,
  `TwoTone`), `StatRow.tsx` (auto "Concept data" caption), `ConceptNote.tsx`, `VehicleImage.tsx` (slot key → next/image,
  or labelled placeholder at the slot's ratio with `data-image-pending`), `PageHeader.tsx` (page h1 block, clears header).
- Motion: `src/components/motion/Reveal.tsx` (GSAP + ScrollTrigger loaded lazily via `src/lib/gsap.ts`, 800ms power3.out,
  once, no-op under reduced motion), `src/hooks/useReducedMotion.ts` (`useSyncExternalStore`).
- Data: `src/data/vehicles.ts` (Aren/Sola/Vire, trims, 4 packages each, features, CONCEPT_DATA_NOTE, CURRENCY CAD;
  paints Lunar Silver (default)/Glacier White/Basalt Black/Tide Blue/Ember, wheels Aero 20/Blade 21/Forge 22, interiors
  Onyx/Dune/Ember — shared names matching `docs/image-requests/01` and `02`, per-model prices),
  `src/data/images.ts` (slot registry keyed by the brief filenames: `hero-<model>`, `<model>-view-side|front|rear`,
  `<model>-ext-<paint>`, `<model>-int-<trim>`, `<model>-detail-light|cabin`, `hero-home-*`, `wheel-*`; all `src: null`
  for now; helpers `exteriorSlot`, `interiorSlot`), `src/data/site.ts` (SITE, routes, primaryNav, navGroups, allRoutePaths).
- Types: `src/types/index.ts`. Logic: `src/lib/configurator.ts` (getDefaultConfig, getPriceBreakdown, getTotalPrice,
  formatPrice, repairConfig, isValidConfig, serialize/parseConfig, togglePackage, CONFIG_STORAGE_KEY),
  `src/lib/schemas.ts` (configStateSchema, createTestDriveSchema(now)/testDriveSchema, contactSchema, honeypot `website`
  field, todayIsoDate), `src/lib/nav.ts`, `src/lib/cn.ts`.
- Routes (stubs: metadata + one h1 + intro): `/`, `/models`, `/models/[slug]` (generateStaticParams,
  `ensureStatic = "navigation"` so unknown slugs return a real 404; hero placeholder + StatRow + ConceptNote),
  `/configure`, `/technology`, `/innovation`, `/performance`, `/design`, `/story`, `/gallery`, `/contact`, `/test-drive`,
  `not-found.tsx`.
- Tests: `src/lib/configurator.test.ts`, `src/lib/schemas.test.ts`, `src/components/ui/VehicleImage.test.tsx`
  (30 tests); `e2e/smoke.spec.ts` (every route h1 + footer label, 404s, menu at 390, no h-scroll at 390, 250px lock).

## Last verified checks (2026-11-11, step 1)
| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | pass, 0 problems |
| Typecheck | `npm run typecheck` | pass |
| Unit | `npm test` | pass, 3 files / 30 tests (step 2: replaced the pending-placeholder test with a real-image test) |
| Build | `npm run build` | pass, 18 static pages, /models/[aren,sola,vire] prerendered |
| E2E | `npm run e2e` | pass, 19/19 (chromium), final run on the committed tree (includes a fresh build) |
| Browser | Playwright screenshots `/` and `/models/aren` at 240/390/768/1440 + menu | no h-scroll at 390/768/1440; 240 locks at 500 |
| Audit | `npm audit` | 7 moderate, all dev-only (minimatch via typescript-eslint ≤8.72.2 from eslint-config-next); `--omit=dev`: 0. `npm audit fix` (no force) did not resolve |

## Known issues and risks
- Dev-only audit findings above: handle in step 8 with `vizam-dependency-audit-fix` (scoped override or wait for
  eslint-config-next update). Never `--force`.
- With Cache Components, `notFound()` after the shell streams returns 200; keep `ensureStatic = "navigation"` (or
  equivalent) on dynamic routes that must 404.
- At 240px the fixed header is 500px wide but fixed elements do not pan with the page on desktop Chromium, so the Menu
  button sits off-screen there (real phones pan the visual viewport). This is how Steeven's rule is specified; not changed.
- Codex returns already exist in `docs/image-requests/returned/` (PNG, uncommitted). Step 2 must convert to WebP, audit,
  set `src` in `src/data/images.ts`, and write `docs/image-manifest.json`. Exterior images all show Blade wheels, so the
  configurator's wheel choice will need a separate wheel visual (the `wheel-*` slots).
- Test-drive "date not in the past" uses the visitor's local date; the server action (step 6) runs in server time.
  Use `createTestDriveSchema(new Date())` on the server and allow one day of slack if needed.

## Setup
- `npm install`, then the scripts above. Env var names: none (see `.env.example`).

## Assets state (step 2, done)
- All 47 Codex images accepted (39 vehicle-set + 5 heroes + 3 wheels); none rejected, none missing. Converted to WebP
  (q0.8, native size, never upscaled) under `public/images/{aren,sola,vire,brand}/`: 3.3 MB total. Originals stay in
  git-ignored `docs/image-requests/returned/`.
- Wiring: `src/data/image-assets.ts` (slot key -> src + real width/height) merged into `src/data/images.ts`; every
  slot now has a file (no `src: null` left). Real sizes: 1672x941 (16:9), 1448x1086 (detail 4:3), 1122x1402 hero-home-mobile,
  1254x1254 wheels. Native hero width is 1672, not 2800: full-bleed hero on large screens is upscaled ~1.7x by the
  browser at 2800 px displays; acceptable for now, regenerate larger if Steeven wants.
- `docs/image-manifest.json` (47 entries, repoVisibility private, source codex-ai) and `docs/ASSET_LICENSES.md` written.
- `image-audit.mjs validate --images public`: 7 FAIL "near-duplicate" between paint variants of the same car
  (hash distance 2-6; e.g. vire-ext-basalt-black ~ vire-ext-tide-blue). Intentional: the configurator needs same-pose images in
  different paints, and the validator has no variant allow-list. Not removed. WARNs: many look-alikes inside sets,
  /configure shares one composition (15 ext, 9 interior). `register` NOT run yet.
- Soft notes: wheel-aero reads slightly like a plastic hubcap turbine; hero-aren is a very low, small car under a large
  empty top area (intended headline space); exterior images all show Blade wheels (configurator wheel choice uses
  `wheel-*` slots); hero-home-desktop has the car in the right two-thirds as briefed.
- Model pages (`/models/aren`) render real images via VehicleImage (checked at 1440 and 390; no h-scroll).

## Slice A (step 3, done): home, /models, /models/[slug]
Components (new):
- src/components/sections/: HomeHero (art-directed picture via getImageProps, GSAP scroll scale), FeaturedModels, BrandPhilosophy,
  PerformanceHighlights, TechShowcase, CtaBand (reusable closing band, optional model query), ModelPanel, ComparisonTable.
- src/components/vehicle/: VehicleHero (paper variant: name behind car via SVG mask traced in src/data/silhouettes.ts;
  dark variant: name overlaid), SwitchableImage (client; aria-pressed switcher, crossfade, mounts other images on hover/focus),
  FeatureHotspots (client; real buttons, popover, Esc, hidden <768px), ExteriorSection, InteriorSection (only scroll-scrubbed
  vehicle effect), SpecsSection, FeatureGroups (+featureIcons.ts), Gallery/GallerySection (scroll-snap, keys, buttons), ModelPager.
- Motion: Reveal gained variant="mask"; new RevealLines (line-by-line headline) and ScrollMedia (scrubbed scale/drift).
- Data: src/data/vehicle-content.ts (story, hotspots in %, notes, gallery) wired as vehicle.content; getAdjacentVehicles.
  Helpers with tests: src/lib/vehicle-stats.ts, src/lib/carousel.ts. StatRow got size="lg". VehicleImage: priority now maps to preload, optional quality.
- next.config.ts: images.qualities [75,85]; deviceSizes capped at 1672 (sources are <=1672px; larger candidates make browsers mis-size srcset).
Patterns to copy: Section tone alternation (ink/carbon/paper/bone) + Reveal; tables inside div role=region tabIndex=0 overflow-x-auto;
accurate sizes per slot; data-fixed for any fixed element; hero layouts switch at lg (not md) because tablet portrait uses the portrait crop.
Notes: Reveal hides content (visibility) until scrolled when JS runs, so tests use includeHidden for off-screen headings.
Hero image max frame 1672px, fades to ink beyond. Tablet portrait >=1024px (e.g. iPad portrait) shows the portrait crop with the desktop text layout: untested edge.
Checkpoint screenshots: docs/checkpoints/slice-a/ (git-ignored): home and models-aren at 390 and 1440. QA output docs/qa/ (git-ignored).

## Last verified checks (step 3)
| Check | Result |
|---|---|
| lint / typecheck | pass |
| unit | pass, 5 files / 38 tests |
| build | pass |
| e2e | pass, 42/42 (smoke + e2e/slice-a.spec.ts, 23 tests) |
| quality gate (5 routes) | all PASS except e2e at that moment (a test selector clash I then fixed; e2e rerun 42/42); audit prod 0, 7 dev-only moderate |
| content-qa (5 routes) | 0 FAIL after fixes; WARNs: no Open Graph tags (step 7), retina '1x' notes are density-normalised naturalWidth artefacts of next/image srcset (real ratios: 1672px sources, hero 1.16x at 1440) |

## Slice B (step 4, done): /configure (configurator)
**State shape** (`ConfigState`, version 1): `{version, model, trim, colour, wheels, interior, packages: string[]}`. UI-only state lives in
`Configurator.tsx`: step, stage view (exterior|interior|wheel), angle, visited steps, pending model switch, banner dismissal.
**Pure logic** (`src/lib/configurator.ts`, tested in `configurator.test.ts` + `configurator-flow.test.ts`): getDefaultConfig, setOption (re-applies
package rules), switchModel (always model defaults), isCustomised, normalizeConfig + getPackageState + togglePackage (package rules), getSelection,
getPriceBreakdown/getTotalPrice, formatPrice/formatDelta, getSummaryText, repairConfig/isValidConfig, serializeSaved/parseSaved, CONFIG_STEPS +
parseUrlParams/buildSearch, getStageSlot/getStageLabel/availableAngles.
**Package rules are data**: `PackageOption.requires` / `conflictsWith` (symmetric) and `TrimVariant.includesPackages` in `src/data/vehicles.ts`.
Current rules: Aren Rear Lounge requires Acoustic Comfort; Sola Terrain includes Winter; Sola Third Row conflicts with Utility; Vire Track conflicts
with Grand Tour; Vire Track trim includes Carbon Aero. Blocked options are disabled with the reason shown; included ones show 0 in the breakdown.
**Storage**: key `orvane.configurator.v1` (CONFIG_STORAGE_KEY). Value `{version:1, savedAt: ISO, config: ConfigState}`. `parseSaved` repairs wrong
version / unknown ids / bare legacy config (flags `repaired`, the banner tells the visitor) and returns null for corrupt data (the key is then removed).
Labelled "Saved on this device" everywhere; nothing is sent anywhere. Read via `useSyncExternalStore` (`savedStore.ts`), so hydration is safe.
**URL**: `?model=<slug>&step=<id>` read once on load (useSearchParams inside Suspense; /configure still prerenders), rewritten with
history.replaceState after the first change. A saved build is never loaded silently: the banner offers Resume / Start new and says whether a deep link is being loaded.
**Component map** (`src/components/configurator/`): Configurator (orchestrator, layout, live regions, price and Next bars), StepNav (numbered stepper, aria-current=step),
StepPanels (Model/Trim/Colour/Wheel/Interior/Packages panels), OptionCard (native radio/checkbox card), VehicleStage (dark stage, view switcher,
other-view thumbnail, caption), StageImage (400ms crossfade, keeps the previous layer until the new one loads), SummaryPanel (spec, breakdown, actions:
copy/print/save/delete/restart), savedStore (localStorage hook), preload (getImageProps-based cache warming: idle for the five paints, cabin and wheels; hover/focus for neighbours).
**Layout**: >=1024 stage left / 440px rail right / stepper on top / price + Back/Next in the rail footer. <1024 sticky stage band (16:9, max 45vh), stepper in flow,
fixed bottom bar (`data-fixed data-config-bar`, price + Back/Next; the footer gets extra bottom padding via CSS `:has`). Print CSS in globals.css prints only #config-summary.
**Wheel honesty**: exterior renders all show Blade; the wheel step shows a dedicated wheel view plus the note "Vehicle preview shown with Blade 21 wheels".
**Views control**: kept. Front 3/4 always; Rear 3/4 / Side / Front enabled only in Lunar Silver with the note "Additional views shown in Lunar Silver." (radios in the Colour step; resets to Front 3/4 on step change). No 360.
**Adding an option**: add it to the lists in `vehicles.ts` (paints/wheels/interiors are shared lists with per-model price deltas; the delta count must match), add the image slot
(`<model>-ext-<id>`, `<model>-int-<id>`, `wheel-<id>`) in image-assets; panels, price, summary, repair and stage pick it up. Packages: add to the model's list, optionally `requires`/`conflictsWith`.
Also changed: exterior hotspots on /models/sola (tailgate) and /models/vire (doors, rear light) re-positioned after viewing at 1440; Aren and the other Sola hotspots were already on target.
Checkpoints: docs/checkpoints/slice-b/ (git-ignored): model/colour/wheels/interior/summary at 240/390/768/1440 plus hotspots-sola/vire. QA output docs/qa/ (git-ignored).

## Last verified checks (step 4)
| Check | Result |
|---|---|
| lint / typecheck | pass |
| unit | pass, 6 files / 56 tests |
| build | pass (/configure prerendered static) |
| e2e | pass, 67/67 (smoke 19 + slice-a 23 + configurator 25) |
| quality gate (configure, models/sola, models/vire; e2e and history skipped in that run, e2e run separately) | 0 FAIL, 0 WARN; audit prod 0, 7 dev-only moderate |
| content-qa (/configure) | 0 FAIL; WARN no Open Graph tags (step 7); WARN stage image shows 1000px at 1x (srcset picks the next device size, retina gets the 1672px source) |
| browser | 240/390/768/1440 on model, colour, wheels, interior, summary viewed; no h-scroll 300+, 240 locks at 500 |

## Known limits (configurator)
- Cache Components: /configure prerenders only the fallback; the configurator itself renders on the client after hydration.
- Stage view switch exterior<->wheel remounts the image (no crossfade across that switch; exterior<->interior and all option changes crossfade).
- No 360; the angle views exist for Lunar Silver only. Not tested in Firefox/WebKit or with a screen reader. Print layout checked with print media emulation, not a real printer.
- Save state is per browser profile; a second tab updates through the storage event.

## Next step
Step 5 (Slice C): Technology, Innovation, Performance, Design Philosophy, Brand Story pages. Before any PR: image-audit validate (accept the 7 variant near-duplicate FAILs) then register; rerun gate and content-qa.
