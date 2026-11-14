# ORVANE

A website for **ORVANE**, a fictional electric performance car brand. It is a VIZAM portfolio concept project, not a real
company, product or offer. Every specification, range, price and story on the site is concept data and is labelled as such
in the interface. All imagery is AI-generated (see [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md)).

Status: built and verified locally on branch `feat/initial-build`. **Not deployed.** Pushing and deploying need the
owner's approval (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).

## Features

- **12 page types**: home, models index, model detail (`/models/aren`, `sola`, `vire`, `tarn`, `vanta`: five models), configurator,
  technology, innovation, performance, design philosophy, brand story, gallery, test drive, contact. Plus a designed 404.
- **Image-based configurator** (`/configure`): 7 steps (model, variant, colour, wheels, interior, packages, summary),
  live price breakdown, package rules (requires / conflicts / included by trim), stage with exterior, interior and wheel
  views, save and resume on this device, deep links (`?model=&step=`), copy / print / restart summary.
- **Demo forms** (`/test-drive`, `/contact`): validated with Zod in the browser and again in Server Actions, working without
  JavaScript, honeypot field, accessible error summary. They are demonstrations: nothing is sent, stored or logged.
- **Gallery** with filters, masonry layout and a keyboard / swipe lightbox (native `<dialog>`).
- **Motion** with GSAP (loaded lazily): scroll reveals, a scroll-scrubbed hero and interior, page fade, auto-hiding header.
  Fully off under `prefers-reduced-motion`, and content stays visible without JavaScript.
- Accessibility work (skip link, focus management in menu and lightbox, axe checks on 15 routes at 390 and 1440 px),
  security headers including a CSP, Open Graph metadata, and Steeven's 250 px layout lock for very narrow screens.

## Tech stack

| Area | Choice (version from `package.json`) |
|---|---|
| Framework | Next.js 16.4.6 (App Router, Turbopack, Cache Components, partial prefetching) |
| UI | React 19.3.0, TypeScript 5.x (strict), Tailwind CSS 4.3.3 via `@tailwindcss/turbopack` |
| Motion / icons | GSAP ^3.15.1 (+ ScrollTrigger), lucide-react ^1.72.0 |
| Validation | Zod ^4.6.7 |
| Fonts | Archivo (variable, width axis) and Inter through `next/font` (self-hosted at build time) |
| Unit tests | Vitest ^5.1.0, Testing Library, jsdom ^31 |
| End-to-end | Playwright ^1.65.0, `@axe-core/playwright` ^4.14.0 |
| Lint | ESLint 9 with `eslint-config-next` 16.4.6 |

This Next.js version differs from older documentation. Read `AGENTS.md` and `node_modules/next/dist/docs/` before changing
framework-level code.

## Getting started

Requires Node.js 24 (the version used for development) and npm.

```bash
npm install
npm run dev        # http://localhost:3006
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on port 3006 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3006 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright, Chromium only. It builds and starts the app on 3006 itself and reuses a server already running there |
| `npm run e2e:all` | Playwright on Chromium, Firefox and WebKit (run `npx playwright install firefox webkit` once) |

### Environment variables

Names only, see `.env.example`. The site has no backend, database or third-party runtime service.

| Name | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No (defaults to `http://localhost:3006`) | Public origin used for canonical and Open Graph URLs (`metadataBase`). Set it per deployment. |

## Project structure

```
src/
  app/            routes (one folder per page), layout, metadata files (icons, manifest, robots, OG image),
                  globals.css (design tokens, 250px lock, motion CSS), Server Actions for the two forms
  components/
    configurator/ configurator UI (orchestrator, steps, stage, summary, saved-state store)
    editorial/    technology / innovation / performance building blocks
    forms/        form primitives, test-drive and contact forms, demo success state
    gallery/      gallery grid and lightbox
    layout/       header, full-screen menu, footer, wordmark
    motion/       Reveal, RevealLines, ScrollMedia
    sections/     home and models-index sections
    ui/           Button, Section / Container, Eyebrow / Heading / TwoTone, StatRow, ConceptNote, VehicleImage, PageHeader
    vehicle/      model-page sections (hero, exterior hotspots, interior, specs, gallery, pager)
  data/           vehicles, image slot registry and asset list, editorial copy, gallery, site config
  hooks/          useReducedMotion
  lib/            pure logic and tests: configurator, schemas, demo-forms, gallery, carousel, metadata, gsap loader
  types/          shared TypeScript types
e2e/              Playwright specs (smoke, slice-a, configurator, slice-c, slice-d, a11y, security)
public/images/    compressed WebP images (aren, sola, vire, tarn, vanta, brand, editorial)
docs/             project documentation (see below)
scripts/          make-brand-assets.mjs (Open Graph / icon generation)
```

## Testing

Latest results (2026-11-12, final tree of the delivery step):

| Check | Result |
|---|---|
| `npm run lint` | pass, 0 problems |
| `npm run typecheck` | pass |
| `npm test` | pass, 10 files / 88 tests |
| `npm run build` | pass |
| `npm run e2e` (Chromium) | pass, 162 tests |
| WebKit (`npx playwright test --project=webkit --workers=2`) | 160 passed, 1 skipped, 1 timing flake that passes when rerun alone |
| Firefox | not verified: Playwright's Firefox does not start on the development machine |
| `npm audit` | 0 vulnerabilities (a scoped `minimatch` override in `package.json` handles a dev-only advisory) |
| Lighthouse 13.6 (mobile, simulated) | Accessibility 100 and Best Practices 100 on `/` and `/configure` after fixes, SEO 69 by design (`noindex`), Performance 44-65 (main-thread hydration time on a throttled CPU) |

Not tested: real Safari or Firefox, real phones, screen readers. Details in
[docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md) and [docs/PERFORMANCE_REVIEW.md](docs/PERFORMANCE_REVIEW.md).

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): routing, data, configurator, forms, motion, images, security, tests
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): tokens, components, patterns, accessibility rules
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): Vercel steps, preview checklist, going live, rollback
- [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md) and [docs/PERFORMANCE_REVIEW.md](docs/PERFORMANCE_REVIEW.md)
- [docs/CASE_STUDY.md](docs/CASE_STUDY.md) and `docs/portfolio/` (screenshots)
- [docs/DESIGN_REFERENCE.md](docs/DESIGN_REFERENCE.md), [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md),
  [docs/AGENT_HANDOFF.md](docs/AGENT_HANDOFF.md), [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md)

## Licence and assets

No open-source licence is declared in this repository; it is a VIZAM portfolio concept. All vehicle, scene and brand images were generated with
an AI image tool for this project and are listed in `docs/image-manifest.json`. GSAP is used under its standard "no charge"
licence. The ORVANE name and mark are invented; no real automotive brand, logo or design is reproduced. Third-party design
reference screenshots used during design are kept local and are not part of the repository.
