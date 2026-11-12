# Deployment

**Nothing is deployed. The repository has no remote, and a push, a Vercel project or a production deployment each need
Steeven's explicit approval.** This document is the plan for when he gives it.

The site is a standard Next.js 16 app with no database, no server-only secrets and no third-party runtime services, so it
needs no hosted backend. Server Actions run on Vercel's functions but do nothing beyond validation.

## 1. Vercel setup (preview first)

1. Push the branch to a GitHub repository (after approval). Never push to `main` directly.
2. In Vercel, **Add New > Project**, import the repository.
3. Framework preset: **Next.js** (auto-detected). Root directory: the repository root.
4. Build settings: leave the defaults. Build command `npm run build` (`next build`), install command `npm install`, no output
   directory override. Local production start is `npm run start` (port 3006); Vercel does not use it.
5. Node.js version: **24.x** (Project Settings > General > Node.js Version), the version used for development and tests.
6. Environment variable (one, optional):

   | Name | Value | Environments | Visibility |
   |---|---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | The public origin, e.g. the preview URL or the final domain, no trailing slash | Preview and Production | **config** (a public value, not a secret) |

   It feeds `metadataBase` in `src/app/layout.tsx` (canonical and Open Graph URLs). Without it the site falls back to
   `http://localhost:3006`, so absolute URLs in link previews would be wrong. For preview deployments either set it to a
   fixed preview alias or accept that previews show the localhost fallback in their metadata.
7. Deploy the branch to get a **Preview** URL. Do not promote to Production until the checklist below is done and approved.

## 2. What to verify on the preview

Phone checklist (a real phone, 390 px class):

- [ ] Home hero shows the portrait crop, the headline is readable, no horizontal scroll.
- [ ] Menu button opens the full-screen menu, every link works, Esc or the close button returns focus.
- [ ] `/models`, then each model page: hero, colour switcher changes the image, interior switcher, spec table scrolls sideways inside its box only.
- [ ] `/configure`: pick a model, a colour and wheels, add a package, check the price bar and Next / Back, open the summary, save, reload and use Resume.
- [ ] `/technology` tabs, `/performance` model and trim switcher, `/design` swatches, `/story`.
- [ ] `/gallery`: filters, open the lightbox, swipe, close.
- [ ] `/test-drive` and `/contact`: submit empty (errors appear and the summary is focused), submit valid (success message says nothing was sent).
- [ ] Rotate to landscape on a few pages; text and images stay inside the screen.
- [ ] Very narrow widths: below 250 px the page locks at 500 px and pans.

Headers check (replace the URL):

```bash
curl -sI https://<preview-url>/ | grep -i -E "content-security-policy|x-content-type-options|referrer-policy|permissions-policy|x-frame-options|strict-transport-security|cross-origin-opener-policy"
```

All seven headers from `next.config.ts` should be present. Also check `https://<preview-url>/robots.txt` (expect
`Disallow: /`), the page source for `<meta name="robots" content="noindex, nofollow">`, `/manifest.webmanifest`,
`/opengraph-image.png` (HTTP 200), and that an unknown path such as `/models/nope` returns HTTP 404.

Optionally rerun the suites against the preview: the Playwright config targets `http://localhost:3006`, so for a remote run
change `baseURL` locally and drop the `webServer` block; these edits should not be committed.

## 3. Indexing: flipping `noindex`

The site is `noindex` on purpose (a concept brand). To allow search engines, change **both** together:

1. `src/app/layout.tsx`: remove `robots: { index: false, follow: false }` from `metadata` (or set both to `true`).
2. `src/app/robots.ts`: replace the disallow-all rule with `{ rules: { userAgent: "*", allow: "/" }, sitemap: "<origin>/sitemap.xml" }`.
3. There is no `sitemap.xml` yet; add `src/app/sitemap.ts` (route list is in `src/data/site.ts`) before referencing it.
4. Set `NEXT_PUBLIC_SITE_URL` to the real origin, rebuild, and check the headers and metadata again. Lighthouse SEO should
   then rise above the current 69 (its only failing audit is "is crawlable").

Think before doing this: the content is fictional. If it is public, keep the concept labels visible and do not present
ORVANE as a real manufacturer.

## 4. Before the forms collect real data

The forms are demonstrations. Do not point them at real visitors until all of this exists:

- an email or CRM provider and its API key, stored as a server-only environment variable (never `NEXT_PUBLIC_`), with the
  Server Action in `src/app/*/actions.ts` calling it after validation;
- rate limiting (per IP and per address) and bot protection (a challenge service) in front of the actions; the honeypot is only a first layer;
- reviewed privacy and consent text for the target country, a retention policy and a named contact for data requests,
  replacing the current "nothing is sent or stored" wording;
- a confirmation email, delivery error handling and monitoring that does not log personal data;
- real locations or dealer data if the test-drive form should offer them;
- a tightened CSP once any provider needs it (currently everything is same-origin), and an independent security and privacy review.

## 5. Rollback

- Vercel keeps every deployment. To roll back production, open the project's **Deployments** list, pick the last good
  deployment and choose **Promote to Production** (or **Instant Rollback**). Preview deployments are unaffected.
- In Git, revert the offending commit on a branch and open a pull request; do not force-push.
- Configuration mistakes with `NEXT_PUBLIC_SITE_URL` need a redeploy, because the value is inlined at build time.
