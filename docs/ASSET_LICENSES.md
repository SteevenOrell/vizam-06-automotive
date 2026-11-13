# Asset licences

ORVANE is a fictional concept brand (VIZAM portfolio project). All imagery is synthetic.

## Images
Every file under `public/images/` is **AI-generated (Codex built-in image generation)**. The prompts are in:
- `docs/image-requests/01-vehicle-sets.md` (model views, paint and interior sets, details), and
- `docs/image-requests/02-heroes-and-wheels.md` (cinematic heroes, wheel designs), and
- `docs/image-requests/03-editorial.md` (12 editorial scenes for Technology, Innovation, Performance, Design and Story, under `public/images/editorial/`).

Per-file slot, page, subject and composition: `docs/image-manifest.json`. The shipped files are compressed WebP;
the PNG originals stay in the git-ignored `docs/image-requests/returned/`. No stock photos are used. The vehicles are
original fictional designs and carry no real manufacturer marks.

Social card: `src/app/opengraph-image.png` (1200x630 PNG, derived from the home hero by `scripts/make-brand-assets.mjs`)
is used for both `og:image` and `twitter:image`; a separate `twitter-image.png` was removed in step 8 (duplicate file,
flagged by the image audit). PNG is kept on purpose for this one file because social crawlers handle PNG/JPEG reliably.

### Accepted image-audit findings (step 8, 2026-11-11)
`image-audit.mjs validate --images public` reports 7 FAIL "near-duplicate images" (hash distance 2-6), all between
paint variants of the same car in the same studio pose:
aren basalt-black ~ tide-blue, aren glacier-white ~ lunar-silver, sola basalt-black ~ tide-blue, sola ember ~ lunar-silver,
sola ember ~ tide-blue, vire basalt-black ~ tide-blue, vire glacier-white ~ lunar-silver (`public/images/<model>/<model>-ext-<paint>.webp`).
**Accepted, not removed**: the configurator needs the same pose in each paint so the colour change reads as a real
repaint; they are never shown side by side as different photos (the gallery uses at most one extra paint per model).
The validator has no variant allow-list, so these 7 FAILs will keep appearing; any other FAIL is a real defect.
The related WARNs (look-alike paint/interior variants, 15 exteriors and 9 interiors sharing one composition on
/configure) are accepted for the same reason.

## Fonts
- Archivo and Inter: SIL Open Font License 1.1, self-hosted at build time through `next/font`.

## Icons and code libraries
- Lucide (`lucide-react`): ISC licence.
- GSAP: standard no-charge licence (free for this use).
- Other dependencies: see `package.json`; all open-source licences.

## Design references
The files in `docs/design-references/` are third-party screenshots kept for inspiration only. They show real brands and
are **excluded from git** (`.git/info/exclude`); none of their assets, logos or copy are used.
