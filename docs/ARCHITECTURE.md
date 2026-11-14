# Architecture

ORVANE is a statically prerendered Next.js 16 site (App Router) with no database, no backend service and no third-party
runtime requests. Interactivity is small client islands on top of server-rendered pages. Read `AGENTS.md` first: this Next
version has changed APIs, so check `node_modules/next/dist/docs/` before using framework features.

## 1. Routing and rendering

- **App Router**, one folder per page under `src/app/`: `/`, `/models`, `/models/[slug]`, `/configure`, `/technology`,
  `/innovation`, `/performance`, `/design`, `/story`, `/gallery`, `/test-drive`, `/contact`, and `not-found.tsx`.
- **Cache Components** (`cacheComponents: true`) and `partialPrefetching: true` in `next.config.ts`. All pages are
  prerendered to static HTML at build time; `/models/[slug]` uses `generateStaticParams` for `aren`, `sola` and `vire`.
- Dynamic route 404s: with Cache Components, `notFound()` after the shell has streamed would return HTTP 200, so
  `/models/[slug]` exports `ensureStatic = "navigation"`. Unknown slugs then return a real 404 (covered by e2e).
- **Layout** (`src/app/layout.tsx`): `<html>` (fonts, `data-scroll-behavior="smooth"`), an inline motion-guard script,
  `#root` wrapper (the 250 px lock targets it), skip link, header inside `Suspense`, `<main id="main">`, footer.
  Metadata: title template `%s | ORVANE`, `metadataBase` from `NEXT_PUBLIC_SITE_URL`, `robots: noindex`.
  Per-page metadata comes from `src/lib/metadata.ts` (`pageMetadata`: title, description, canonical, Open Graph, Twitter).
- **What runs on the client, and why** (files with `"use client"`):
  - header and menu (`layout/`): pathname-aware active state, scroll hide/show, focus trap, scroll lock;
  - motion (`motion/`, `lib/gsap.ts`, `hooks/useReducedMotion.ts`): GSAP and scroll observers need the browser;
  - configurator (`configurator/`): state, `localStorage`, URL params. The route prerenders only a fallback (stepper
    skeleton plus the default stage image); the configurator renders after hydration;
  - editorial widgets with tabs, switchers or scroll-linked state: `PlatformExplorer`, `ModelSwitcher`,
    `InnovationSequence`; model page `SwitchableImage`, `FeatureHotspots`, `Gallery` (carousel);
  - gallery grid and `Lightbox`; the form components (`useActionState`, client validation).
  Everything else (page shells, sections, copy, `VehicleImage`, tables) is server-rendered with no client JavaScript of its own.
- `useSearchParams` is only used inside `Suspense` boundaries (`/configure`, `/test-drive`) so those routes still prerender.

## 2. Data layer

- `src/types/index.ts`: shared types (`Vehicle`, `TrimVariant`, `ColourOption`, `WheelOption`, `InteriorOption`,
  `PackageOption`, `ConfigState`, content and gallery types).
- `src/data/vehicles.ts`: the five models (Aren, Sola, Vire, Tarn the electric pickup, Vanta the track coupé) with specs (kW, 0-100, range, top speed, battery, drive), trims with price
  deltas, per-model price lists for the shared paints / wheels / interiors, four packages each, feature lists, and the
  `CONCEPT_DATA_NOTE` string. Currency is CAD. All numbers are fictional.
- `src/data/vehicle-content.ts` (story, hotspots in %, notes, gallery picks), `src/data/editorial.ts` (copy for
  technology, innovation, performance, design, story; numbers are derived from `vehicles.ts` by `src/lib/editorial.ts`),
  `src/data/gallery.ts` (38 curated entries), `src/data/site.ts` (site name, routes, navigation groups),
  `src/data/silhouettes.ts` (SVG paths used to place the model name behind the car).
- Images: see section 6.

**Add a model**: add the slug to `VehicleSlug`, add a `Vehicle` entry in `vehicles.ts` (specs, trims, price lists,
packages), content in `vehicle-content.ts`, the image slots (hero, three views, five paints, three interiors, two details)
in `image-assets.ts` (Tarn and Vanta have no straight-front view for Tarn, no detail close-ups and reuse their front three-quarter / rear / side images for the hero, front and detail roles; `images.ts` skips duplicate keys and `MISSING_ANGLES` in `configurator.ts` hides the Tarn Front view), and a silhouette in `silhouettes.ts`. Pages, configurator and summary pick it up from the data;
`generateStaticParams` reads the vehicle list.

**Add a paint, wheel or interior**: paints, wheels and interiors are shared lists with one price delta per model, so add the
option to the list in `vehicles.ts` and make the number of deltas match for every model. Add the image slot
(`<model>-ext-<id>`, `<model>-int-<id>` or `wheel-<id>`) in `image-assets.ts`. Panels, price, summary, repair and stage
need no further change.

**Add a package**: add it to the model's package list; use `requires` / `conflictsWith` for rules (conflicts apply in both
directions) and `TrimVariant.includesPackages` for packages a trim includes at no cost.

## 3. Configurator

State shape (`ConfigState`, version 1): `{ version, model, trim, colour, wheels, interior, packages: string[] }`.

```
 URL params (?model, ?step)         localStorage "orvane.configurator.v1"
        |                                   |  {version, savedAt, config}
        v                                   v
  parseUrlParams                      useSavedConfig (useSyncExternalStore)
        \                                   /      parseSaved: repair / null if corrupt
         \                                 /       "Resume" or "Start new" banner (never silent)
          v                               v
        Configurator.tsx  (UI state: step, stage view, angle, visited steps, pending model switch)
          |   user action
          v
   pure functions in src/lib/configurator.ts
   setOption / switchModel / togglePackage -> normalizeConfig (re-applies package rules)
          |
          +--> getPriceBreakdown / getTotalPrice / getSummaryText  --> price bar, SummaryPanel
          +--> getStageSlot / availableAngles                      --> VehicleStage -> StageImage -> slot registry
          +--> serializeSaved (Save)                               --> localStorage
          +--> buildSearch (history.replaceState)                  --> URL
```

- **Pure logic** lives in `src/lib/configurator.ts` and is unit-tested (`configurator.test.ts`,
  `configurator-flow.test.ts`). The React layer holds only UI state.
- **Package rules are data**: `requires`, `conflictsWith`, `includesPackages`. Blocked options are disabled with the
  reason shown; included packages show 0 in the breakdown. `normalizeConfig` re-applies the rules after every change.
- **Storage**: key `orvane.configurator.v1`, value `{ version: 1, savedAt: ISO string, config }`. `parseSaved` repairs wrong
  versions, unknown ids and bare legacy configs (flagging `repaired` so the banner tells the visitor) and returns `null`
  for corrupt data (the key is then removed). It is read through `useSyncExternalStore` (`savedStore.ts`) so hydration is
  safe; other tabs update through the `storage` event. Saved data never leaves the device.
- **URL**: `?model=<slug>&step=<id>` is read once on load and rewritten with `history.replaceState` after the first change.
- **Stage and image slots**: exterior renders are keyed `<model>-ext-<paint>`, interiors `<model>-int-<trim>`, wheels
  `wheel-<id>`. The stage crossfades (400 ms) and keeps the previous layer until the new image has loaded. The exterior
  renders all show Blade wheels, so the wheel step shows a dedicated wheel view and the stage says "Preview shown with Blade
  21 wheels". Other angles (rear, side, front) exist for Lunar Silver only, and the UI says so. There is no 360 view.
  `preload.ts` warms the cache (idle for the five paints, cabin and wheels; hover/focus for neighbouring options).
- **Layout**: at 1024 px and up, stage on the left and a 440 px rail on the right. Below 1024 px, a sticky stage band and a
  fixed bottom bar (`data-fixed data-config-bar`) with price and Back / Next; the footer gets extra bottom padding via CSS `:has`.
  Print CSS prints only `#config-summary`.

## 4. Forms

- **Schemas** (`src/lib/schemas.ts`) and the validation / processing functions (`src/lib/demo-forms.ts`) are shared by the
  client and the server: `validateTestDrive`, `validateContact`, `processTestDrive`, `processContact`, `readFormValues`.
  Results are `FormResult = idle | error { fieldErrors, values } | success { summary }`.
- **Server Actions**: `src/app/test-drive/actions.ts` and `src/app/contact/actions.ts` are thin `"use server"` wrappers
  that call the process functions. Forms use `useActionState` with `action={formAction}`, so they work without JavaScript.
- **Client behaviour** (`useDemoForm`): validation on blur (adds messages), on change (removes fixed ones) and on submit
  (focuses the error summary). The summary changes only on submit so the layout does not jump under the pointer.
- **Rules worth knowing**: control characters rejected; max lengths; test-drive date must be today or later (server uses
  now minus 24 h for time-zone slack) and within 183 days; optional attached configuration is re-validated server-side with
  `isValidConfig`; honeypot field `website` returns the same generic success and does nothing.
- **Demonstration workflow**: validate, return a summary (the message length, never its text), and stop. No email, storage,
  logging or external call. An e2e test asserts no cross-origin request is made.
- **A real backend would add**: an email or CRM provider (key in a server-only environment variable), rate limiting and
  bot protection, reviewed consent and privacy wording and a retention policy, confirmation emails, monitoring that does
  not log personal data, and an independent security / privacy review. See [DEPLOYMENT.md](DEPLOYMENT.md).

## 5. Motion system

- `Reveal` (fade and lift, or a clip-path "mask" wipe for images), `RevealLines` (headline line by line) and `ScrollMedia`
  (scrubbed scale / drift, used on the performance opener and the model interior only). GSAP and ScrollTrigger are loaded
  lazily by `loadGsap()` in `src/lib/gsap.ts`, so pages without motion never fetch them. Durations: 800 ms `power3.out`
  for reveals, 1100 ms for the mask wipe. Only transform, opacity and clip-path animate.
- **`js-motion` guard**: an inline script in `<head>` adds `js-motion` to `<html>` only when JavaScript runs and the visitor
  has not asked for reduced motion. CSS hides not-yet-revealed content (opacity or clip-path, never `visibility: hidden`,
  which would remove it from the accessibility tree) only under `html.js-motion:not(.motion-failed)`.
- **Failsafe**: if GSAP has not set `window.__motionReady` within 4 s, the script adds `motion-failed` and everything shows.
  Without JavaScript or with reduced motion nothing is ever hidden. `e2e/security.spec.ts` covers reduced motion, no JS
  and blocked scripts.
- **Page fade**: `SiteHeader` sets `html[data-nav]` on pathname change, which plays a 320 ms fade on `#main > *`.
  React `ViewTransition` was not used because it would snapshot the whole page element.
- Header hides on scroll down and shows on scroll up (not while focus is inside or the menu is open, and not under reduced
  motion). A global `prefers-reduced-motion` rule shortens all CSS animation and transition durations.

## 6. Images pipeline

- All images are AI-generated (Codex image tool), converted to WebP (quality 0.8, native size, never upscaled) and committed
  under `public/images/{aren,sola,vire,brand,editorial}/` (59 files). Originals stay in git-ignored
  `docs/image-requests/returned/`.
- **Slot registry**: `src/data/image-assets.ts` lists each slot key with its real src, width and height;
  `src/data/images.ts` merges it with alt text and metadata and exposes `getImageSlot`, `exteriorSlot`, `interiorSlot`.
  Editorial scenes (`ed-*`) are wired through `src/data/editorial-images.ts`. Components ask for a slot key, never a path.
- **`VehicleImage`** renders a slot with `next/image` at its intrinsic ratio, or a labelled placeholder (`data-image-pending`)
  when a slot has no src. Every non-full-width use sets an accurate `sizes`; `priority` maps to `preload`; hero use passes
  `quality={85}`.
- `next.config.ts`: `images.qualities` `[75, 85]`; `deviceSizes` capped at 1672 because no source is wider (details are
  1448), otherwise browsers would pick candidates larger than the file. The home hero is art-directed through
  `getImageProps` (desktop landscape and a portrait crop on phones).
- `docs/image-manifest.json` records every image (source, prompt brief, licence, visibility). `docs/ASSET_LICENSES.md`
  explains the licence position and lists the seven accepted `image-audit` "near-duplicate" results (same-pose paint
  variants the configurator needs).

## 7. Security headers and CSP

Set for every route in `next.config.ts`: CSP (`default-src 'self'`, same-origin scripts, styles, fonts, images and
connections, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`), `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, `X-Frame-Options: DENY`, HSTS (two
years, includeSubDomains) and `Cross-Origin-Opener-Policy: same-origin`. Compromise: `script-src` and `style-src` keep
`'unsafe-inline'` because static prerendered pages cannot carry a per-request nonce (Next's bootstrap and RSC payload
scripts, the motion guard, next/font and style props are inline). Dev adds `unsafe-eval` and `ws:`. Zod runs with
`jitless` so it does not trip the CSP. Full review: [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

## 8. Testing layout

- **Unit** (Vitest, jsdom): `src/**/*.test.ts(x)`: configurator logic and flow, schemas, demo forms, gallery filters,
  carousel, vehicle stats, editorial derivations, editorial images, `VehicleImage` (10 files, 88 tests).
- **End-to-end** (Playwright, `e2e/`): `smoke` (every route, 404s, menu at 390, no horizontal scroll, 250 px lock),
  `slice-a` (home, models, model page), `configurator`, `slice-c` (editorial pages), `slice-d` (gallery, forms),
  `a11y` (axe on 15 routes at 390 and 1440, heading order, skip link), `security` (headers, CSP violations, reduced motion,
  no JS, no cross-origin requests). 162 tests per browser.
- `playwright.config.ts` builds and starts the production app on port 3006 itself. Projects: chromium (`npm run e2e`),
  firefox and webkit (`npm run e2e:all`). Option cards are picked by clicking their label (WebKit ignores forced clicks on
  visually hidden inputs).
