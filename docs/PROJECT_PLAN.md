# Project plan — ORVANE (vizam-06-automotive)

Approved by Steeven 2026-11-11 ("Yes, proceed"). Estimate ~1.8–2.6M tokens. Branch `feat/initial-build`.
No push, merge or deploy without his say. Night run: not authorised.

## Decisions (approved with the kickoff recommendations)

- Vehicle imagery: Codex-generated renders of the fictional models (fixed studio angle per model, paint mask for
  real colour changes, wheel variants); stock only for roads, detail and atmosphere.
- No React Three Fiber: no licensed 3D asset of a fictional car. 360 from generated angles is a stretch goal only.
- Hero: still image with scroll motion. No video, no voice.
- Forms: Zod on client and in a server action; clearly labelled demonstration workflow, nothing is sent or stored.

## Steps

- [x] 0 Intake: references saved and mapped, media key check, plan + handoff
- [x] 1 Setup: Next.js scaffold, tokens, layout, nav, footer, data models, 250px lock, test tooling (Opus)
- [x] 2 Assets: Codex briefs, stock picks, audit, manifest, licence doc
- [x] 3 Slice A: Homepage, Models, vehicle detail template (3 models) → screenshot checkpoint for Steeven
- [ ] 4 Slice B: Configurator (state, pricing, summary, save/restart)
- [ ] 5 Slice C: Technology, Innovation, Performance, Design Philosophy, Brand Story
- [ ] 6 Slice D: Gallery, Contact, Book a Test Drive
- [ ] 7 Polish: motion pass, reduced motion, mobile nav, image performance
- [ ] 8 QA: unit + e2e, quality gate, content QA, dependency audit, security review (Opus)
- [ ] 9 Delivery: README, architecture, design system, deploy notes, portfolio screenshots, handoff, retro

## Blocked / waiting on Steeven

- Step 2: `media.env` not found (Pixabay, Unsplash MISSING; Envato OK) and Codex CLI not on PATH. Until fixed, pages
  are built against labelled placeholder slots with the final dimensions; Envato stock covers atmosphere shots.
