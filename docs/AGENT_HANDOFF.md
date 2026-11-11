# Agent handoff — ORVANE (vizam-06-automotive)

_Last updated: 2026-11-11 America/Toronto, after step 2 (assets), by the step-2 build agent_

## Objective
VIZAM portfolio concept: premium site for ORVANE, a fictional electric performance car brand. 12 page types, a working
image-based configurator, validated demo forms, tests, docs, portfolio screenshots. Plan in
[PROJECT_PLAN.md](PROJECT_PLAN.md); design in [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md).

## Repository
- Path: `C:\Users\SteevenWemin\Documents\Projects\vizam-06-automotive`. No remote. Never push, merge or deploy without Steeven.
- Branch: `feat/initial-build`. Commit: see `git log --oneline -1` (step 1 setup commit).
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

## Next step
Step 3 (Slice A): home page and shared sections using the real images. Before any PR: run `image-audit.mjs validate`
(accept the 7 variant FAILs or extend the tool) then `register`; run vizam-quality-gate and vizam-content-qa.

## Waiting for approval
- None for step 2. Pending from step 0: `media.env` (Pixabay/Unsplash keys) missing.
