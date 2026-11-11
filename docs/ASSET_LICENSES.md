# Asset licences

ORVANE is a fictional concept brand (VIZAM portfolio project). All imagery is synthetic.

## Images
Every file under `public/images/` is **AI-generated (Codex built-in image generation)**. The prompts are in:
- `docs/image-requests/01-vehicle-sets.md` (model views, paint and interior sets, details), and
- `docs/image-requests/02-heroes-and-wheels.md` (cinematic heroes, wheel designs).

Per-file slot, page, subject and composition: `docs/image-manifest.json`. The shipped files are compressed WebP;
the PNG originals stay in the git-ignored `docs/image-requests/returned/`. No stock photos are used. The vehicles are
original fictional designs and carry no real manufacturer marks.

## Fonts
- Archivo and Inter: SIL Open Font License 1.1, self-hosted at build time through `next/font`.

## Icons and code libraries
- Lucide (`lucide-react`): ISC licence.
- GSAP: standard no-charge licence (free for this use).
- Other dependencies: see `package.json`; all open-source licences.

## Design references
The files in `docs/design-references/` are third-party screenshots kept for inspiration only. They show real brands and
are **excluded from git** (`.git/info/exclude`); none of their assets, logos or copy are used.
