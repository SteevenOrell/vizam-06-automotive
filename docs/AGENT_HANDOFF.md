# Agent handoff — ORVANE (vizam-06-automotive)

_Last updated: 2026-11-12 America/Toronto, after step 8 (QA, dependency audit, security review)_

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

## Slice C (step 5, done): /technology, /innovation, /performance, /design, /story
Components: src/components/editorial/ (EdImage, SectionIntro, PlatformExplorer [client tabs], InnovationSequence [client, sticky media],
ModelSwitcher [client], CompareChart). Data: src/data/editorial.ts (all copy; numbers derived from vehicles.ts via src/lib/editorial.ts:
specRange, driveLayouts, compareBars), src/data/editorial-images.ts (editorialImage / resolveImage / imageProps; EDITORIAL_FALLBACKS is a safety net, unused now).
Images: 12 ed-* scenes accepted (none rejected), WebP 1672x941 in public/images/editorial/, wired in image-assets.ts + images.ts (editorialSlots),
image-manifest.json and ASSET_LICENSES.md. No fallbacks in use. Soft notes: ed-brake-detail shows 12 spokes (brief said ten); ed-track-vire is an Ember coupe close to but not identical to vire-ext-ember; ed-lab-light engineer is a large soft back-of-head at left.
- technology: stats header, platform explorer (tabs Battery / Motors / Thermal [SVG loop diagram] / Software), drive layouts, charging steps, cockpit (ed-cockpit-night), assistance, CTA.
- innovation: concept-direction note, numbered sequence with pinned media (CSS sticky, active item from scroll position; stacked under lg), method, CTA.
- performance: full-height ed-track-vire opener (the only scrubbed effect, ScrollMedia), model + trim switcher (aria-pressed buttons, StatRow from data), chassis and braking, CSS bar comparison plus data table, drive modes, CTA (vire).
- design: paper header, principles, process (ed-sketch-desk, ed-clay-studio), light blade triptych, swatches from vehicle data, silhouette strip (Gallery), CTA.
- story: visible concept-narrative note, origin, five-chapter timeline (chapters, not dates), values, atelier, closing coast-road band with Models / Test drive.
Small shared edits: StatRow value is nowrap; globals.css has .panel-in keyframes; smoke.spec h1 regexes updated for the new titles.
Tests: e2e/slice-c.spec.ts, src/lib/editorial.test.ts, src/data/editorial-images.test.ts. Checkpoints: docs/checkpoints/slice-c/ (git-ignored; shoot.mjs and frames.mjs re-shoot against a server on 3006).

## Slice D (step 6, done): /gallery, /test-drive, /contact
**Gallery**: src/data/gallery.ts (30 curated entries: all views, interiors, details, heroes, 7 ed-* scenes; max one extra paint per model, order interleaves models and subjects; per-entry caption + meta "model · colour · view"; film strip = the other 5 ed-* scenes, not repeated), src/lib/gallery.ts (filters all/aren/sola/vire/interior/detail/scene, countByFilter, wrapIndex, swipeDirection; tested), src/components/gallery/GalleryExplorer.tsx (chips = buttons with aria-pressed + counts, live count, CSS-columns masonry that keeps each image ratio, first 3 eager rest lazy, sizes set) and Lightbox.tsx (native dialog showModal, Esc via cancel, arrows/Home/End wrap, swipe, caption, scroll lock on html, data-fixed; focus returns to the tile of the image showing when closed). Film strip reuses vehicle/Gallery.
**Forms architecture**: primitives in src/components/forms/ (Field render-prop with ids/aria-describedby/aria-invalid and "(required)/(optional)" text, TextInput, Textarea, Select, Checkbox, Honeypot, ErrorSummary, FormStatus + DEMO_NOTICE strings, DemoSuccess, useDemoForm). Logic in src/lib/demo-forms.ts (validateTestDrive/validateContact shared by client and server, processTestDrive/processContact, readFormValues, FormResult = idle | error{fieldErrors,values} | success{summary}); schemas extended in src/lib/schemas.ts (max date 183 days, control-character rejection, optional attachedConfig, contact topics now vehicle/configurator/press/partnership/other + optional model + consent). Server Actions: src/app/test-drive/actions.ts, src/app/contact/actions.ts (thin wrappers, "use server"). Forms use useActionState with action={formAction}, so they work without JavaScript (tested with JS off); client validation runs on blur (adds messages only), live on change (removes fixed ones) and on submit (summary focused). The summary only changes on submit so layout does not jump under the pointer. Server date check uses now minus 24h for time-zone slack. /test-drive is fully static; ?model= is read client-side (useSearchParams in Suspense; the fallback is the same form, so no-JS works).
**Demonstration workflow**: the action validates, returns a summary, and does nothing else: no email, storage, logging or external call (e2e asserts no cross-origin request). Honeypot (field "website") returns the same success with no summary. Saved configuration (opt-in) is read client-side from CONFIG_STORAGE_KEY, sent as hidden JSON only when ticked, and re-validated server-side with isValidConfig.
**Real deployment would need**: an email or CRM provider and its key (env var names to define, never committed), rate limiting and bot protection (the honeypot is only a first layer), reviewed consent/privacy wording and retention policy for the target country, real locations/dealer data if wanted, a confirmation email, error monitoring without logging personal data, and an independent security/privacy review.
Deviations: /contact h1 is "Request information." (smoke test regex updated); playwright.config.ts has workers 3 locally (2 on CI).
Tests: e2e/slice-d.spec.ts (29), src/lib/{demo-forms,gallery}.test.ts, schemas.test.ts extended. Checkpoints docs/checkpoints/slice-d/ (git-ignored; shoot.mjs re-shoots against a server on 3006).

## Last verified checks (step 6)
| Check | Result |
|---|---|
| lint / typecheck | pass |
| unit | pass, 10 files / 88 tests |
| build | pass (/test-drive and /contact and /gallery static) |
| e2e (full, workers 3) | pass, 123/123 (smoke 19, slice-a 23, configurator 25, slice-c, slice-d 29) |
| content-qa (gallery, contact, test-drive) | 0 FAIL, 24 WARN kept: no Open Graph tags (step 7); tiles 1.05x soft-on-retina is the srcset-normalisation artefact noted in step 3 (sources 1672px); one registry alt over 140 chars (ed-platform, film strip) |
| quality-gate script | not run as a whole (its parts lint/typecheck/test/build/e2e/layout were run separately; audit and secret scan not rerun in step 6) |
| browser | 240/390/768/1440 viewed for gallery, lightbox, test-drive (errors, success), contact; 240 locks at 500, no h-scroll 300+ |

## Polish (step 7, done)
**Consistency**: eyebrow label unified (tracking 0.24em everywhere, Eyebrow gained `as`; story chapters, design subheads, innovation, form status, model switcher now use it); TwoTone muted is opacity-60; --amber-ink darkened to #9a4a14 (4.5:1 on bone); text-wrap balance on h1-h3, pretty on p; scroll-padding-top 5.5rem (header), scroll-padding-bottom with the configurator bar; scrollbar-gutter stable (e2e overflow checks now use <= 0).
**Nav**: header pill active state incl. nested (/models/aren -> Models), Test drive link active, wordmark aria-current on home, non-pill routes show an amber dot + sr-only "current page" on the Menu button; hide on scroll down / show on scroll up (off under reduced motion, never while focus is inside or menu open); menu links stagger in (CSS, --i); page fade on route change via html[data-nav] (set in SiteHeader layout effect on pathname change; React ViewTransition was not used because it would snapshot the whole page element).
**Motion**: Reveal/RevealLines hide via CSS only under html.js-motion (head script in layout.tsx, skipped for reduced motion), GSAP uses fromTo + clearProps, data-revealed hands over, 4s failsafe adds motion-failed. will-change removed from ScrollMedia. Tested: reduced motion, no JS, scripts blocked (e2e/security.spec.ts).
**Metadata**: src/lib/metadata.ts pageMetadata (title/description/canonical/OG/Twitter) used by every route; metadataBase from NEXT_PUBLIC_SITE_URL (default http://localhost:3006; name in .env.example); opengraph-image.png and twitter-image.png (1200x630 PNG, made by scripts/make-brand-assets.mjs, in image-manifest), icon.svg/icon.png/apple-icon.png/favicon.ico, manifest.ts, robots.ts (disallow all; comment says how to flip), noindex kept.
**Headers** (next.config.ts, all routes): CSP, nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo/payment/usb off), X-Frame-Options DENY + frame-ancestors none, HSTS, COOP. CSP compromises: script-src and style-src keep 'unsafe-inline' (static prerendered pages cannot carry a nonce; Next bootstrap + RSC payload scripts and the motion guard are inline; next/font, next/image and style props need inline styles). Dev adds unsafe-eval and ws.
**404**: designed, with link grid. **a11y**: e2e/a11y.spec.ts (axe on 15 routes x 390/1440 fail on serious/critical, heading order, one h1, skip link). **Perf**: docs/PERFORMANCE_REVIEW.md (Lighthouse unavailable here; Playwright vitals instead); gallery preloads 1 image.
Scripts/tools in docs/checkpoints/polish (git-ignored): frames.mjs, axe.mjs, vitals-pw.mjs, sizes.mjs, net.mjs.

## QA / security (step 8, done)
Independent review by an Opus agent (interrupted once by Steeven; the WIP save 9cc6859 was re-verified before continuing).
**Fixed:** lint warnings (eslint ignores `docs/checkpoints/**` and `docs/image-requests/returned/**`); dev-only audit via
scoped override `@typescript-eslint/typescript-estree > minimatch ^11.0.1` (remove when typescript-eslint depends on
minimatch >=11.0.1); redundant `src/app/twitter-image.png` removed (twitter:image = /opengraph-image.png); `/configure`
fallback paints the default stage image (LCP 4264 -> 1268 ms, CLS 0.016 -> 0); Reveal hides with opacity only (was
visibility: hidden = content missing from the accessibility tree); Zod `jitless` (its `new Function` probe raised a CSP
violation); `data-scroll-behavior="smooth"` on <html> (route changes no longer animate from the old offset, Back
restores position); summary "Edit" buttons aligned. e2e: `npm run e2e` = chromium only, `npm run e2e:all` adds Firefox
and WebKit; option cards are picked by clicking their label (WebKit ignores forced clicks on sr-only inputs); CSP test
also collects `securitypolicyviolation` events.
**Docs:** `docs/SECURITY_REVIEW.md` (new), `docs/PERFORMANCE_REVIEW.md` (step-8 section with Lighthouse scores),
`docs/ASSET_LICENSES.md` (accepted image-audit FAILs). Images registered in the shared VIZAM registry (59).
QA scripts (git-ignored): `docs/checkpoints/qa8/` (review.mjs real-browser frames, lcp-el, headings, csp, radio probes).

## Last verified checks (2026-11-12, final tree, step 8)
| Check | Result |
|---|---|
| `npm run lint` | pass, 0 problems |
| `npm run typecheck` | pass |
| `npm test` | pass, 10 files / 88 tests |
| `npm run build` | pass |
| `npm run e2e` (chromium, full, final tree) | pass, 162/162 |
| WebKit (`--project=webkit`) | full run 150/162 before fixes; all 12 were test-harness issues (forced clicks on sr-only inputs, clipboard permission, Tab-to-links, timeout); after fixes the changed specs (configurator, a11y, security) pass in WebKit: 62 passed + 1 skipped (clipboard), skip link 2/2. The full 162 were not rerun in WebKit after the fix |
| Firefox | not run: Playwright Firefox 159 fails to start here (Windows "side-by-side configuration is incorrect") |
| `npm audit` / `--omit=dev` | 0 / 0 |
| quality gate (audit, secrets tree + history, layout 240-1440, links, images, cards; 15 routes) | all PASS except the deliberate 404 route's HTTP 404 |
| content-qa (14 routes) | 0 FAIL, 104 WARN (kept: retina 1.0-1.1x srcset normalisation of 1672px sources; shared spec/notes paragraphs on model pages; same vehicle images across model/design/gallery pages for a 3-car brand; one gallery alt > 140 chars) |
| image-audit validate / register | only the 7 accepted paint-variant FAILs / 59 registered |
| Lighthouse 13.6 (mobile, simulated) | see PERFORMANCE_REVIEW.md: a11y 100 (/ and /configure after fixes), BP 100, SEO 69 by design |

## Open risks
- Firefox not verified (Playwright Firefox fails to start here: Windows side-by-side configuration error). Real Safari,
  real phones and screen readers not tested.
- CSP keeps 'unsafe-inline' (static prerender); forms are demonstrations (no rate limit / bot protection needed until
  they send anything). See SECURITY_REVIEW.md section 10.
- Deep link `/configure?model=sola|vire` shows the Aren stage image until hydration (trade-off of the LCP fix).
- Lighthouse Performance 44-65 (simulated mobile) is hydration TBT; SEO 69 by design (noindex).

## Next step
Step 9 delivery (Sonnet): README, architecture, design-system doc, deployment notes (set NEXT_PUBLIC_SITE_URL),
portfolio screenshots (`vizam-case-study`), final handoff, `vizam-project-retro`. No push/merge/deploy without Steeven.
