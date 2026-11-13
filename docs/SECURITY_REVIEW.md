# Security review — ORVANE (vizam-06-automotive)

- **Date:** 2026-11-11 (America/Toronto), plan step 8.
- **Reviewer:** VIZAM agent (Opus), independent of the agents that built steps 1-7. Source review plus the automated
  checks listed at the end. This is **not** a penetration test or an independent third-party review, and automated
  scans do not prove the site is secure.
- **Scope:** the whole repository on branch `feat/initial-build`: `src/` (Next 16.4.6 App Router, Cache Components),
  the two Server Actions, client storage, `next.config.ts` headers, dependencies, git tree and full history, `public/`
  assets. Out of scope: hosting configuration (not deployed), real email/CRM integrations (none exist).

## 1. What the site is
A static, prerendered concept site for a fictional brand. No backend, database, accounts, analytics, cookies, payments,
third-party scripts or runtime services. The only server-side code is two demonstration Server Actions.

## 2. Server Actions (`src/app/test-drive/actions.ts`, `src/app/contact/actions.ts`)
| Topic | Finding |
|---|---|
| Server-side validation | Both actions re-validate everything on the server with Zod (`src/lib/demo-forms.ts`, `src/lib/schemas.ts`); the client check is only for UX. `model` and `topic` are enums, text fields have max lengths (name 80, email 160, location 80, message 1000/2000), single-line fields reject control characters, multi-line fields reject control characters except tab/newline. Test-drive date: not in the past (server uses now minus 24 h for time-zone slack), max 183 days ahead. |
| Size limits | `readFormValues` reads only the named text fields (files and unknown fields are ignored) and cuts each value at 5000 characters before validation. The attached configuration JSON is rejected above 1500 characters and must equal its own repaired form (`isValidConfig`). Next's default Server Action body limit (1 MB) applies; not raised. |
| Reflection of input | On error the action returns the submitted values so the form can be refilled; React renders them as escaped attribute/text values. On success it returns a fixed summary: name, email, enums mapped to labels, the message **length** only (never the message text), and a configuration description built from data ids, not from input strings. No HTML is built from input anywhere. |
| Logging / storage / sending | None. No `console.*` calls in `src/` (grep), no `fetch`, no file or database writes, no email. The e2e suite asserts that submitting either form makes no cross-origin request. |
| Honeypot | Hidden `website` field. When filled, the action returns the same generic success with an empty summary and does nothing else (bots get no signal). It is only a first layer. |
| Deliberately absent | **Rate limiting** and **bot protection** (CAPTCHA/Turnstile): not needed while nothing is sent or stored; required before the forms do anything real. **CSRF tokens**: Next Server Actions accept only POST, use unguessable action ids, and Next compares the `Origin` header with the host and rejects cross-site calls (`serverActions.allowedOrigins` is not widened here); `SameSite` cookies are irrelevant because there is no session. A real deployment behind a proxy must make sure `Host`/`X-Forwarded-Host` are correct so this check holds. |

## 3. Client storage
- One key: `orvane.configurator.v1` in `localStorage`, written only when the visitor presses "Save configuration".
  Value `{version, savedAt, config}` where `config` is option ids only (model, trim, colour, wheels, interior, packages).
  **No personal data** is stored; form fields are never persisted.
- Reading goes through `parseSaved` (`src/lib/configurator.ts`): `JSON.parse` in try/catch, then `repairConfig` whitelists
  every id against the vehicle data and re-parses with Zod. Corrupt or unrecoverable values return `null` and the key is
  removed; repaired values are flagged and the visitor is told. Stored values are only ever rendered through React text
  (escaped) or mapped to known labels; no `eval`, `innerHTML` or `new Function` touches them.
- The test-drive form attaches the saved configuration only if the visitor ticks the box; the server validates it again.

## 4. XSS surface
- `dangerouslySetInnerHTML`: one use, `src/app/layout.tsx`, a constant motion-guard script string with no
  interpolation of runtime data. No `innerHTML`, `eval` or `new Function` in `src/` (grep).
- URL parameters: `?model=` and `?step=` (configurator, `parseUrlParams`) and `?model=` (test drive) are checked against
  the fixed slug/step lists; anything else is ignored. They are never rendered raw, never used in redirects, and the URL
  the configurator writes back (`history.replaceState`) is built only from whitelisted values. No open redirect exists
  (no `redirect()` or `location` assignment from input).
- All `href`s are built from static data (`src/data/site.ts`, vehicle slugs).
- The inline SVG mask in `VehicleHero` is built from static path data in `src/data/silhouettes.ts` and URI-encoded.

## 5. HTTP headers (`next.config.ts`, all routes)
Set: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (camera, microphone, geolocation, payment, usb off), `X-Frame-Options: DENY` plus CSP
`frame-ancestors 'none'`, `Strict-Transport-Security: max-age=63072000; includeSubDomains`,
`Cross-Origin-Opener-Policy: same-origin`. CSP is same-origin only for scripts, styles, fonts, images, connections,
media and manifest; `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`.

**CSP compromises (kept, with reasons):**
- `script-src 'unsafe-inline'`: pages are prerendered static HTML (Cache Components). Next's inline bootstrap / RSC
  payload scripts and the motion guard are inline, and static HTML cannot carry a per-request nonce.
- `style-src 'unsafe-inline'`: next/font, next/image and React `style` props emit inline styles.
- Dev only: `'unsafe-eval'` and `ws:` for React Refresh.

**Production hardening option:** a nonce-based CSP (`script-src 'nonce-…' 'strict-dynamic'`) set in middleware/proxy
needs every page to render dynamically per request (loses static prerendering and CDN caching), or a hash-based policy
for the few fixed inline scripts if the framework's inline payloads become hashable. Add `report-to` for CSP violation
reports once there is an endpoint. HSTS `preload` only after the real domain is chosen. Because the site has no
third-party content, no user-generated HTML and no session, the practical risk of the inline allowances is low.

## 6. Dependencies
See section 9 (audit state, the override and its removal condition).

**Direct dependency licences** (from each package's `package.json`):

| Package | Version | Type | Licence |
|---|---|---|---|
| next | 16.4.6 | prod | MIT |
| react / react-dom | 19.3.0 | prod | MIT |
| zod | 4.6.7 | prod | MIT |
| lucide-react | 1.72.0 | prod | ISC |
| gsap | 3.15.1 | prod | GSAP Standard "no charge" licence (allows this use; not OSI open source) |
| @playwright/test | 1.65.0 | dev | Apache-2.0 |
| @axe-core/playwright | 4.14.0 | dev | MPL-2.0 (test-only, not shipped) |
| typescript | 5.9.3 | dev | Apache-2.0 |
| eslint 9.39.5, eslint-config-next 16.4.6, vitest 5.1.0, @vitejs/plugin-react 6.3.0, jsdom 31.0.0, tailwindcss + @tailwindcss/turbopack 4.3.3, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @types/node 24.19.2, @types/react(-dom) 19.3.0 | | dev | MIT |

Every direct dependency is used (grep of imports and configs); placement is correct (runtime libraries in
`dependencies`, build/test tooling in `devDependencies`; Tailwind is build-time only).

## 7. Secrets
- No secrets exist in this project: it uses no API keys. `.env*` is git-ignored except `.env.example`, which holds
  one variable **name** (`NEXT_PUBLIC_SITE_URL`, public, optional) and no value.
- Quality-gate secret scan of the working tree and of **all git history**: see section 9.
- No `.env`, key, `.claude/` or `CLAUDE.md` file is tracked (gate "tracked private files" check).

## 8. Third-party requests, assets and licences
- **Runtime third-party requests: none.** Fonts (Archivo, Inter) are self-hosted by `next/font` at build time; all
  images are local; no analytics or embeds. The e2e suite asserts no cross-origin request and no CSP violation.
- Images: all AI-generated (Codex) for this project, no stock, no real manufacturer marks or models; details in
  `docs/ASSET_LICENSES.md` and `docs/image-manifest.json`.
- `docs/design-references/*.jpg` (third-party screenshots that show real brands) are excluded via `.git/info/exclude`.
  Checked: **not tracked, and never present in any commit of the history** (`git log --all --name-only`).
  No PNG originals (`docs/image-requests/returned/`), `docs/checkpoints/` or `docs/qa/` are tracked or in history.
  The only tracked PNGs are the app icons and the social card under `src/app/`.

## 9. Automated results and fixes in this review
**Dependency audit** (`vizam-dependency-audit-fix`):
- Before: `npm audit` 7 moderate, all dev-only: GHSA-g3hv-75wg-m249 (minimatch >=7.0.0 <11.0.1, "potential denial of
  service via globparts amplification", CWE-405) at `node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch`
  (10.2.6), pulled in by eslint-config-next 16.4.6 -> typescript-eslint 8.72.2 -> @typescript-eslint/{typescript-estree,
  parser, type-utils, utils, eslint-plugin}. `npm audit --omit=dev`: 0. typescript-eslint 8.72.2 is the latest release,
  so no upstream upgrade exists.
- Fix: scoped override in `package.json`: `"overrides": { "@typescript-eslint/typescript-estree": { "minimatch": "^11.0.1" } }`
  (resolves 11.0.8; Node 20 or >=22 required, we use 24). Only that one nested copy changed; eslint and the other
  plugins keep minimatch 3.1.5 (not affected). No `--force`, no `--legacy-peer-deps`.
- After: `npm audit` 0, `npm audit --omit=dev` 0. Lint still applies the typescript-eslint rules (21 `@typescript-eslint/*`
  rules active in `eslint --print-config`), typecheck, unit, build and e2e pass.
- **Removal condition:** delete the override once typescript-eslint ships a release that depends on minimatch >=11.0.1
  (check with `npm view @typescript-eslint/typescript-estree dependencies.minimatch`), then reinstall and re-audit.

**Secrets / tracked files** (quality gate, full run on 2026-11-11): tracked private files PASS, secret scan of the
working tree PASS, secret scan of the full git history PASS.

**Fixed during this review:**
| Finding | Severity | Fix |
|---|---|---|
| Zod's `new Function` probe raised a CSP `securitypolicyviolation` (script-src, `eval`) on `/configure` and `/test-drive` (swallowed, so no console error and the old e2e check missed it) | Low (CSP noise; no bypass) | `z.config({ jitless: true })` in `src/lib/schemas.ts`; `e2e/security.spec.ts` now also collects `securitypolicyviolation` events on 7 routes |
| Reveal content not yet scrolled into view was `visibility: hidden`, removing headings and links from the accessibility tree (Lighthouse `heading-order`) | Accessibility | opacity-only hiding in `src/app/globals.css` and `src/components/motion/Reveal.tsx` |
| Redundant `src/app/twitter-image.png` (tracked non-WebP + duplicate image-audit FAIL) | Hygiene | removed; `twitter:image` points at the same `/opengraph-image.png` (e2e asserts it and that the PNG returns 200) |
| Smooth `scroll-behavior` on `<html>` animated route changes: a new page could open part-way down and Back did not restore the position | UX | `data-scroll-behavior="smooth"` on `<html>` (Next 16 opt-in) |

No vulnerability of medium or higher severity was found in the application code.

**Quality gate on the final tree (2026-11-12, audit / secrets / layout part):** npm audit prod 0 and all 0; tracked
private files PASS; secret scan working tree PASS; secret scan full git history PASS; no horizontal scroll from 300 px
(15 routes) PASS; 250 px lock PASS; images PASS; cards PASS; internal links PASS. The single "browser" FAIL is the
deliberate 404 route returning HTTP 404 (correct behaviour; the gate counts any 4xx document as a failure).

**Not verified:** Firefox (Playwright's Firefox does not start on this machine), real Safari/iOS, real devices,
screen readers, a hosted deployment's headers (checked only on `next start`).

## 10. Open risks and what a real deployment must add
1. Forms do nothing; a real version needs an email/CRM provider (key in env vars with secret visibility, never in the
   repo), **rate limiting** (per IP and per email), **bot protection** (Turnstile or similar) beyond the honeypot,
   reviewed consent/privacy text and a retention policy for the target country (PIPEDA / Quebec Law 25 for Canada),
   a confirmation email, and error monitoring that does not log personal data.
2. CSP keeps `'unsafe-inline'` for scripts and styles (section 5). Move to nonces if the site ever renders dynamically
   or embeds third-party or user-generated content.
3. `NEXT_PUBLIC_SITE_URL` must be set per deployment, or canonical / Open Graph URLs point at localhost.
4. `noindex` and disallow-all `robots.txt` are deliberate for a concept brand; flip them only on purpose.
5. Dev-only audit override (section 9) must be removed when upstream ships a fix.
6. An independent security and privacy review is recommended before any version collects real personal data.
