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

## Step 8 follow-up (2026-11-11/12): /configure LCP
**Change:** the prerendered Suspense fallback of `/configure` (`src/app/configure/page.tsx`) now paints the default
model's stage image (Aren, Lunar Silver, front 3/4) in the same box, `sizes` and quality as the live stage, with
`preload`. The live stage then reuses the cached file. The fallback's stepper row is 57 px (measured, same as the live
row) and its rail is `100dvh` tall below lg, so hydration no longer pushes the footer (that was the 0.016 CLS).
Saved-build banner and `?model=` / `?step=` deep links are unchanged (all e2e green). Trade-off: a deep link to Sola or
Vire shows the Aren image until hydration, then switches.

Same method as above (Playwright vitals, mobile 390x844 @2x, CPU 4x, 1.6 Mbps / 150 ms, median of 3), final build:

| Route | FCP | LCP | CLS | TBT (approx.) | Transferred |
|---|---|---|---|---|---|
| `/` | 1736 ms | 1736 ms | 0.000 | 1205 ms | 506 KB |
| `/models/aren` | 1708 ms | 1708 ms | 0.000 | 1100 ms | 497 KB |
| `/configure` | 1268 ms | **1268 ms** (was 4264) | **0.000** (was 0.016) | 1449 ms | 399 KB |

LCP element on `/configure` confirmed as the fallback stage image (PerformanceObserver), no layout shifts recorded.

**Lighthouse now runs** (`npx lighthouse@13.6.0 … --chrome-flags="--headless=new"` with `CHROME_PATH` set to
Playwright's Chromium 1248; default mobile preset, simulated throttling). Single runs on a busy laptop, so treat as
indicative:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 65 | 98 → **100** after fix | 100 | 69 | 1.0 s | 1.0 s | 3410 ms | 0 |
| `/models/aren` | 44 | 98 (same cause, fixed; Lighthouse not re-run on this route) | 100 | 69 | 1.1 s | 5.7 s | 2930 ms | 0 |
| `/configure` | 50 | 100 | 96 → **100** after fix | 69 | 1.0 s | 4.4 s | 4193 ms | 0 |

- SEO 69 is by design (`noindex` + disallow-all robots for a concept brand; the only failing SEO audit is "is-crawlable").
- Accessibility 98: `heading-order`, because Reveal hid not-yet-scrolled headings with `visibility: hidden`, which also
  removed them from the accessibility tree. **Fixed**: reveals now use opacity only (`globals.css`, `Reveal.tsx`); rerun: 100.
- Best practices 96 on `/configure`: a CSP issue from Zod's `new Function` feature probe (swallowed, but reported as a
  violation). **Fixed** with `z.config({ jitless: true })` in `src/lib/schemas.ts`; rerun: 100; e2e now collects
  `securitypolicyviolation` events too.
- Lighthouse's simulated LCP for `/models/aren` and `/configure` is much higher than the observed throttled LCP: its
  Lantern model attributes the image to the post-hydration element and adds the CPU work. With real DevTools throttling
  (`--throttling-method=devtools`) `/configure` measured FCP 3.1 s / LCP 3.8 s (LCP 0.7 s after FCP, i.e. not waiting
  for hydration). The remaining performance cost is main-thread JavaScript (TBT), i.e. React/Next hydration under 4x CPU.

## Inherent / not changed
- `noindex` and the disallow-all `robots.txt` mean Lighthouse's SEO "is crawlable" audit would fail by design (concept brand). Flip in `src/app/layout.tsx` and `src/app/robots.ts` to index.
- Source images are at most 1672 px wide (details 1448 px), so full-bleed heroes on 2x or very wide screens are upscaled and cannot be sharper without regenerating larger sources.
- Framework baseline of about 185 KB gzip JavaScript is React 19 + Next runtime; reducing it further would mean dropping client navigation.
