# Performance review — ORVANE (step 7)

Date: 2026-11-11. Production build (`npm run build && npm run start`, port 3006), Next 16.4.6, Windows laptop, Chromium (Playwright 1.65).

## Method (and an honest limitation)
- **Lighthouse could not be used.** `npx lighthouse` was tried against Google Chrome, Edge and Playwright's Chromium (CDP attach). Chrome/Edge failed with `NO_NAVSTART`, and the Playwright attach hung for several minutes per run on this machine. So there are **no Lighthouse Performance / Accessibility / Best Practices / SEO scores** in this document. Re-run on a normal machine: `npx lighthouse http://localhost:3006/ --view`.
- **Substitute: Playwright vitals** (`docs/checkpoints/polish/vitals-pw.mjs`, git-ignored): mobile profile 390x844 @2x, CPU 4x slowdown, throttled network (1.6 Mbps, 150 ms RTT), median of 3 cold loads, `PerformanceObserver` for LCP / layout-shift / longtask. TBT is approximated as long-task time over 50 ms after FCP; it is not Lighthouse's TBT and is noisy.
- Accessibility is covered by axe-core in `e2e/a11y.spec.ts` (see below), not by Lighthouse's score.

| Route | FCP | LCP | CLS | TBT (approx.) | Transferred |
|---|---|---|---|---|---|
| `/` | 1968 ms | 1968 ms | 0.000 | 1229 ms | 505 KB |
| `/models/aren` | 2368 ms | 2368 ms | 0.000 | 1124 ms | 512 KB |
| `/configure` | 1204 ms | 4264 ms | 0.016 | 1160 ms | 556 KB |

Reading: LCP on the home and model pages is the hero image (1672 px WebP, preloaded once). `/configure` prerenders only a fallback; the stage image is rendered after hydration, so LCP waits for the JavaScript (about 4 s under 4x CPU + slow 4G). TBT is dominated by React/Next hydration of about 185 KB gzip of framework JavaScript under a 4x CPU throttle; there is no single long script of ours to split.

## Route JavaScript (initial scripts referenced by the HTML, from `.next/static/chunks`)
| Route | Raw | Gzip | GSAP in initial JS | Configurator code |
|---|---|---|---|---|
| `/`, `/models`, `/technology`, `/innovation`, `/performance`, `/design`, `/story` | 594-598 KB | 185-186 KB | no | no |
| `/models/aren` (and sola, vire), `/gallery` | 603 KB | 188 KB | no | no |
| `/contact` | 720 KB | 222 KB | no | yes (saved-configuration attach) |
| `/test-drive` | 748 KB | 231 KB | no | yes (same reason) |
| `/configure` (largest) | 763 KB | 235 KB | no | yes |

- GSAP and ScrollTrigger are a lazy `import()` in `src/lib/gsap.ts`; they are in no route's initial scripts and load only after a Reveal / RevealLines / ScrollMedia mounts. Pages with none of them never fetch GSAP.
- Configurator logic (about 131 KB raw: vehicle data, rules, saved-state parsing) ships only to `/configure`, `/contact` and `/test-drive`, where saved configurations are read or validated. It is not in the initial scripts of any other route.

## Images and fonts
- Checked at 390 px, DPR 1: no image has a natural width more than 2.2x its slot on any of the 12 routes. Exactly one preloaded image on `/models/*`, `/configure`, `/performance`; none on the others (the home hero is art-directed through `getImageProps`). `/gallery` used to preload three images; changed to one eager image and the rest lazy.
- Fonts: next/font self-hosts Archivo (variable, `wdth` axis) and Inter (variable), `display: swap`, with size-adjusted fallbacks (Arial overrides), so there is no font-swap layout shift (CLS 0.000 on home and model pages). Only the Latin file of each is downloaded (unicode-range subsets). Archivo cannot be pinned to a single weight while keeping the `wdth` axis in `next/font/google`, so the variable file stays; it is the only weight/width axis the display type needs.

## Changed because of this review
- Gallery preload reduced from 3 to 1 image.
- Reveal / RevealLines no longer rely on `gsap.from` (which flashed content before GSAP loaded): CSS hides reveal content only while `html.js-motion` is set, GSAP animates with explicit `fromTo`, and a 4 s failsafe (`motion-failed`) shows everything if GSAP never arrives. `will-change: transform` removed from ScrollMedia (GSAP promotes the layer while tweening). Only transform, opacity and clip-path are animated.
- Security headers and the page fade add no requests.

## Inherent / not changed
- `noindex` and the disallow-all `robots.txt` mean Lighthouse's SEO "is crawlable" audit would fail by design (concept brand). Flip in `src/app/layout.tsx` and `src/app/robots.ts` to index.
- Source images are at most 1672 px wide (details 1448 px), so full-bleed heroes on 2x or very wide screens are upscaled and cannot be sharper without regenerating larger sources.
- Framework baseline of about 185 KB gzip JavaScript is React 19 + Next runtime; reducing it further would mean dropping client navigation.
