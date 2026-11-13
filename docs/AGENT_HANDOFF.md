# Agent handoff: ORVANE (vizam-06-automotive)

_Last updated: 2026-11-12 America/Toronto, after step 9 (delivery). All nine plan steps are done._

## Objective
VIZAM portfolio concept: premium website for ORVANE, a fictional electric performance car brand. 12 page types, an
image-based configurator, validated demo forms, tests, documentation, portfolio screenshots. Plan: [PROJECT_PLAN.md](PROJECT_PLAN.md).

## Repository
- Path: `C:\Users\SteevenWemin\Documents\Projects\vizam-06-automotive`. Branch `feat/initial-build`. Commit: `git log --oneline -1`.
- **No remote.** Never push, add a remote, merge or deploy without Steeven's approval.
- `docs/design-references/*.jpg` are third-party screenshots with real brand logos: local only via `.git/info/exclude`,
  never commit. Git-ignored: `docs/image-requests/returned/` (generation originals), `docs/qa/`, `docs/checkpoints/`.

## Current state
Complete and verified locally; **not deployed**. Final deliverables:
- [README.md](../README.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [DEPLOYMENT.md](DEPLOYMENT.md),
  [CASE_STUDY.md](CASE_STUDY.md), [SECURITY_REVIEW.md](SECURITY_REVIEW.md), [PERFORMANCE_REVIEW.md](PERFORMANCE_REVIEW.md),
  [ASSET_LICENSES.md](ASSET_LICENSES.md), [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md), `image-manifest.json`.
- Portfolio screenshots: `docs/portfolio/` (34 WebP files, 17 screens at 1440 and 390 px, 1.2 MB, committed). No video was made
  (not approved). Re-shoot after visible UI changes (script was a throwaway; see the case-study skill, scenes listed in CASE_STUDY.md).

## Stack
Next 16.4.6 (App Router, Turbopack, `cacheComponents`, `partialPrefetching`), React 19.3.0, TypeScript 5.9 strict,
Tailwind 4.3.3, GSAP 3.15.1, lucide-react 1.72, Zod 4.6.7, Vitest 5.1, Playwright 1.65, Node 24. Read `AGENTS.md`: this
Next differs from older docs; check `node_modules/next/dist/docs/`.

## Scripts
`npm run dev` (3006) · `build` · `start` (3006) · `lint` · `typecheck` · `test` · `e2e` (chromium; builds and serves itself) ·
`e2e:all` (adds firefox and webkit).

## Environment variables (names only)
`NEXT_PUBLIC_SITE_URL` (optional, public, "config" visibility on Vercel; defaults to `http://localhost:3006`). Nothing else.

## Where things are
Architecture and the how-to for adding models, paints, packages: [ARCHITECTURE.md](ARCHITECTURE.md). Tokens and components:
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). Vercel steps, robots/noindex flip, forms-go-live list, rollback: [DEPLOYMENT.md](DEPLOYMENT.md).

## Rules to keep (gotchas)
- Every `position: fixed` element carries `data-fixed` (the 250 px lock finds it).
- With Cache Components, `notFound()` after the shell streams returns 200: keep `ensureStatic = "navigation"` on `/models/[slug]`.
- `Reveal` hides only under `html.js-motion` and with opacity, never `visibility: hidden`.
- Option cards in e2e are picked by clicking the label (WebKit ignores forced clicks on sr-only inputs).
- Scoped override for `minimatch` in `package.json` (dev-only advisory): remove when typescript-eslint depends on minimatch >= 11.0.1.
- Test-drive date check uses the server's clock minus 24 h for time-zone slack.

## Step 9 changes (this run)
- Viewed all 23 step-8 contact sheets (desktop and phone). Fixed: `/technology` header stats at 390 px (`390-720 kW` was
  clipped; `StatRow` now uses `text-2xl` below `md` for values longer than 5 characters); configurator price bar in the
  summary step (label and CAD wrapped on two or three lines; `Concept price` is now no-wrap with tighter tracking on phones, and
  Back is icon-only below 640 px with an `sr-only` "Back" label); `layout.tsx` default Twitter image pointed at the removed
  `/twitter-image.png`, now `/opengraph-image.png`. Everything else on the sheets looked right (the repeated fixed header
  inside section shots is a screenshot artefact).
- Wrote README, ARCHITECTURE, DESIGN_SYSTEM, DEPLOYMENT, CASE_STUDY and the portfolio screenshots; ticked step 9 in the plan.

## Last verified checks (2026-11-12, final tree)
| Check | Result |
|---|---|
| `npm run lint` | pass, 0 problems |
| `npm run typecheck` | pass |
| `npm test` | pass, 10 files / 88 tests |
| `npm run build` | pass (run by the e2e web server and by a separate build before the screenshots) |
| `npm run e2e` (chromium, full) | 162 passed (4.5 min) |
| WebKit, first full run (3 workers, before the UI edits above) | 156 passed, 5 failed, 1 skipped (clipboard); the 5 failures were 30 s timeouts or an unmet 5 s wait under load; all 5 pass when rerun alone with `--workers=1` (configurator keyboard flow, price total, security third-party requests, performance switcher, test-drive no-request) |
| WebKit, final tree | `--project=webkit --workers=2`, full: 160 passed, 1 failed, 1 skipped (clipboard) in 10.0 min. The one failure (`slice-d.spec.ts:87` "validates a field on blur": `aria-invalid` not set within 5 s, a hydration-timing flake) passes when rerun alone. Different tests flaked in the two full runs, none failed twice, so there is no known genuine WebKit failure |
| Firefox | not run: Playwright's Firefox does not start on this machine (Windows side-by-side configuration error) |
| `npm audit` | 0 (last run in step 8; dependencies unchanged since) |
| Lighthouse 13.6 (step 8, mobile, simulated) | accessibility 100 and best practices 100 on `/` and `/configure`; SEO 69 by design; performance 44-65 (hydration) |

## Open risks
- Firefox, real Safari, real phones and screen readers are not tested.
- CSP keeps `'unsafe-inline'` for scripts and styles (static prerender cannot carry a nonce). Forms are demonstrations; real
  collection needs the list in [DEPLOYMENT.md](DEPLOYMENT.md) section 4 and an independent security and privacy review.
- Deep link `/configure?model=sola|vire` shows the Aren stage image until hydration (trade-off of the LCP fix).
- WebKit under 3 parallel workers is timing-sensitive on this laptop; use `--workers=1` or 2 when verifying.
- Source images are at most 1672 px wide; heroes on very large or high-density screens are upscaled.
- Imagery is AI-generated; small artefacts remain (wheel detail, hubcap-like Aero wheel).
- No sitemap exists (only needed if indexing is enabled).

## Next step
1. **Steeven's UI/UX review gate** on the local build (`npm run build && npm run start`, http://localhost:3006) and the
   screenshots in `docs/portfolio/`. Taste notes go back as change requests.
2. His decision on pushing: create or add a GitHub remote, push the branch, and open a Vercel **preview** (follow
   [DEPLOYMENT.md](DEPLOYMENT.md); `NEXT_PUBLIC_SITE_URL` as "config"). Production deployment needs his separate approval.
3. Main session: run `vizam-project-retro`, and fill the "Actual" token figure in [PROJECT_PLAN.md](PROJECT_PLAN.md).

## Deployment (2026-11-12)
- GitHub: `SteevenOrell/vizam-06-automotive` (private), default branch `main`. PR #1 (`feat/initial-build`) merged.
- Vercel: project `orvane-automotive` (team vizam-projects), deployed from `main` with the Vercel CLI. Live at
  https://orvane-automotive.vercel.app (public alias; the team alias asks for Vercel sign-in).
- Env: `NEXT_PUBLIC_SITE_URL=https://orvane-automotive.vercel.app` (Production, config visibility). Preview builds fall
  back to localhost for canonical/OG URLs.
- The Vercel project is NOT connected to the GitHub repo: pushes do not redeploy. Redeploy with `npx vercel deploy --prod`
  from `main`, or connect the repo in the Vercel dashboard (Settings > Git).
- Live checks after deploy (quality gate against the live URL, 14 routes): 0 FAIL, 0 WARN (no horizontal scroll from
  300 px, 250 px lock, no console errors or broken images, equal cards, links). All 15 routes return 200, unknown 404;
  CSP, HSTS and X-Frame-Options present; OG URLs point at the live domain.
