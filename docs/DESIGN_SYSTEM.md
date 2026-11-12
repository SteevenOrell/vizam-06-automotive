# Design system

Values come from `src/app/globals.css` and the components in `src/components/`. Tokens are CSS variables in `:root`, mapped
into Tailwind with `@theme inline`, so they are available as utilities (`bg-ink`, `text-amber-ink`, `rounded-sharp`,
`font-display`, `ease-out-expo`). Design rationale and references: [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md).

## 1. Tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0b0c0e` | Page background, darkest surface, text on light surfaces and on amber |
| `--carbon` | `#15171a` | Second dark surface (alternating dark sections, cards on ink) |
| `--graphite` | `#2a2d32` | Borders and panels on dark, placeholder gradient |
| `--mist` | `#8a8f98` | Secondary text on dark only, 14 px and up |
| `--slate` | `#5b616b` | Secondary text on light surfaces, placeholders |
| `--paper` | `#f4f1ec` | Light surface and text on dark |
| `--bone` | `#e7e2da` | Second light surface (alternating light sections, cards on paper) |
| `--amber` | `#d9772b` | The single accent: primary buttons, active states, eyebrows on dark, focus ring on dark |
| `--amber-soft` | `#e58b45` | Hover state of amber surfaces |
| `--amber-ink` | `#9a4a14` | Amber for text and focus ring on light surfaces |
| error red | `#a4201a` | Form errors on light surfaces (`ERROR_TEXT` in `forms/Field.tsx`) |

Contrast ratios (WCAG, calculated from the hex values above):

| Pair (text on background) | Ratio | Verdict |
|---|---|---|
| paper on ink | 17.4:1 | AA and AAA |
| paper on carbon | 15.9:1 | AA and AAA |
| mist on ink | 6.0:1 | AA (keep at 14 px and up) |
| mist on carbon | 5.5:1 | AA |
| amber on ink / carbon | 6.2:1 / 5.7:1 | AA |
| ink on amber (button label) | 6.2:1 | AA |
| slate on paper / bone | 5.5:1 / 4.8:1 | AA |
| amber-ink on paper / bone | 5.5:1 / 4.8:1 | AA |
| error red on paper / bone | 6.7:1 / 5.8:1 | AA |

Do not use plain `--amber` for text on paper or bone (about 3:1); use `--amber-ink`. Do not use `--mist` on light surfaces.

### Typography

| Role | Family | Notes |
|---|---|---|
| Display and headings | Archivo, variable with width axis (`--font-display-face`, utility `font-display`) | Width set per size: `[font-stretch:125%]` for `display`, `112%` for `xl` and `lg` |
| Body and UI | Inter, variable (`--font-text`, utility `font-sans`) | Falls back to system sans |

Both are loaded through `next/font` (`display: swap`, self-hosted at build). Heading sizes (`Heading` in `ui/Typography.tsx`):

| `size` | Style |
|---|---|
| `display` | `clamp(2.75rem, 9vw, 8.5rem)`, uppercase, leading 0.92, tracking 0.02em, width 125% |
| `xl` (default for h1) | `clamp(2.25rem, 5.5vw, 4.75rem)`, leading 1, tracking -0.01em, width 112% |
| `lg` (default for h2) | `clamp(1.75rem, 3.6vw, 3rem)`, leading 1.08, width 112% |
| `md` (default for h3) | `text-2xl`, `md:text-3xl` |
| `sm` (default for h4) | `text-lg`, `md:text-xl` |

Eyebrow labels: `text-xs`, uppercase, tracking `0.24em`, medium weight. Stat figures: `text-3xl md:text-4xl` (long values
over 5 characters use `text-2xl` on phones), or `clamp(2.25rem, 5vw, 4.5rem)` for `size="lg"`; units are `text-base`.
`h1`-`h3` use `text-wrap: balance`, paragraphs `text-wrap: pretty`.

### Spacing, layout, radius

- `Container`: max width 1440 px, horizontal padding `px-5 sm:px-8 lg:px-12 xl:px-16`.
- `Section` vertical padding: `default` 64 px phone / 96 px from `md` / 160 px from `xl`; `compact` 56 / 80; `none`.
- Page header: `pt-32 pb-16`, then `md:pt-44 md:pb-24` (clears the fixed header).
- Radius: `--radius-sharp: 2px` (`rounded-sharp`) on buttons, inputs and cards. Pills are used only by the header and filter chips.
- Minimum tap target 44 px (`min-h-11` on buttons and form controls).

### Motion

| Token | Value |
|---|---|
| `--ease-out-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--duration-ui` | `300ms` (colour and border transitions on buttons use `duration-300`) |
| Scroll reveal | 800 ms `power3.out` (GSAP), mask wipe 1100 ms |
| Tab panel swap | 400 ms (`.panel-in`) |
| Page fade | 320 ms ease-out |
| Menu links | 500 ms, staggered 40 ms |
| Configurator stage crossfade | 400 ms |

Under `prefers-reduced-motion: reduce` all CSS animation and transition durations become 0.01 ms and GSAP reveals are skipped.

## 2. Components

### Primitives (`src/components/ui/`)

| Component | File | Variants and notes |
|---|---|---|
| `Button`, `LinkButton`, `buttonClasses` | `Button.tsx` | `variant`: `primary` (amber), `solid` (paper on dark, ink on light), `ghost` (outline). `tone`: `dark` or `light` (the surface it sits on). `size`: `md`, `lg`. 44 px minimum height |
| `Container`, `Section` | `Layout.tsx` | `Section tone`: `ink`, `carbon`, `paper`, `bone` (sets `data-tone`, which switches the focus ring colour); `spacing`: `default`, `compact`, `none`. `isDarkTone()` helper |
| `Eyebrow`, `Heading`, `TwoTone` | `Typography.tsx` | `Eyebrow accent`: `dark` (amber), `light` (amber-ink), `none`; `as`: p, h2, h3, span. `Heading level` 1-4 and independent `size`. `TwoTone` = muted lead-in (opacity 60%) plus solid ending |
| `StatRow` | `StatRow.tsx` | Large figures with small units and labels; adds a "Concept data" caption by default; `size`: `md`, `lg` |
| `ConceptNote` | `ConceptNote.tsx` | Info icon plus the standard `CONCEPT_DATA_NOTE` text (or custom children) |
| `VehicleImage` | `VehicleImage.tsx` | Slot key to `next/image`, or a labelled placeholder at the slot's ratio |
| `PageHeader` | `PageHeader.tsx` | The page's single h1 block with eyebrow and intro; `tone` prop |

### Layout (`src/components/layout/`)

`SiteHeader` (floating dark pills: wordmark, nav, Test drive link, Menu button; hides on scroll down), `SiteMenu` (full-screen
dialog listing every route; focus trap, Esc, scroll lock, focus return), `SiteFooter` (grouped nav, "Concept project by
VIZAM" chip, concept-data note), `Wordmark` (original arc mark plus "ORVANE").

### Forms (`src/components/forms/`)

`Field` (label, "(required)" / "(optional)" text, hint, error, linked by `for`, `aria-describedby`, `aria-invalid`), the
controls `TextInput`, `Textarea`, `Select`, `Checkbox` (exported from `Field.tsx`; light surface, 45% ink border, 44 px
height), `Honeypot`, `ErrorSummary` (focused on submit), `FormStatus` (demonstration notice), `DemoSuccess`,
`TestDriveForm`, `ContactForm`, `TestDriveExperience`, hook `useDemoForm`.

### Configurator (`src/components/configurator/`)

`Configurator` (orchestrator), `StepNav` (numbered stepper, `aria-current="step"`), `StepPanels`, `OptionCard` (native radio
or checkbox card; select by clicking the label), `VehicleStage` and `StageImage` (crossfading stage), `SummaryPanel`.

### Vehicle, gallery, editorial, sections

- `vehicle/`: `VehicleHero` (paper variant with the name behind the car, dark variant with the name overlaid),
  `SwitchableImage` (aria-pressed colour switcher), `FeatureHotspots`, `ExteriorSection`, `InteriorSection`, `SpecsSection`,
  `FeatureGroups`, `Gallery` (scroll-snap carousel with arrow keys and buttons), `ModelPager`.
- `gallery/`: `GalleryExplorer` (filter chips as `aria-pressed` buttons with counts, masonry that keeps image ratios) and
  `Lightbox` (native `<dialog>` via `showModal`; arrows, Home / End, swipe, caption; focus returns to the tile).
- `editorial/`: `PlatformExplorer` (tabs), `InnovationSequence` (sticky media), `ModelSwitcher`, `CompareChart`, `SectionIntro`, `EdImage`.
- `sections/`: `HomeHero`, `FeaturedModels`, `BrandPhilosophy`, `PerformanceHighlights`, `TechShowcase`, `CtaBand`,
  `ModelPanel`, `ComparisonTable`.
- `motion/`: `Reveal`, `RevealLines`, `ScrollMedia`.

## 3. Patterns

- **Dark and paper alternation**: sections alternate `ink` / `carbon` and `paper` / `bone` to create rhythm. Text colour
  follows the surface (`Section` sets it). Cards sit one step away from their section (`carbon` on `ink`, `bone` on `paper`).
- **Concept-data labelling**: any block with specs, ranges, prices or story carries a visible "Concept data" caption
  (`StatRow`) or a `ConceptNote`. The footer repeats the note on every page, the story page opens with a concept-narrative
  note, and the forms say nothing is sent or stored.
- **`data-fixed` rule**: every `position: fixed` element must carry the `data-fixed` attribute (header, menu, configurator price
  bar, lightbox). The 250 px lock selects by it.
- **250 px lock**: `@media (max-width: 250px)` sets `#root` and `[data-fixed]` to `width: 500px`, fixed elements also
  `right: auto`; `html { overflow-x: auto }` lets visitors pan. `#root` uses `overflow-x: clip` so there is no horizontal
  scroll from 300 px up (clip keeps `position: sticky` working). Known limit: on desktop Chromium at 240 px the Menu button
  is off-screen because fixed elements do not pan; real phones pan the visual viewport.
- **Data-driven numbers**: figures shown on editorial pages are derived from `vehicles.ts`, not typed again.
- **Reveal**: wrap content in `Reveal` / `RevealLines`; never hide content with CSS outside the `html.js-motion` rule.
- **Tables**: wrap in a `div role="region" tabIndex={0}` with `overflow-x-auto` and a label so they scroll by keyboard.

## 4. Accessibility rules

- One `h1` per page, no skipped heading levels (axe and a heading-order test run on 15 routes at 390 and 1440 px).
- Skip link to `#main` (first focusable element); `main` is focusable (`tabIndex={-1}`).
- Visible `:focus-visible` outline: 2 px amber on dark, amber-ink on paper and bone (switched by `data-tone`), offset 3 px.
- Dialogs (menu, lightbox) trap focus, close on Esc, lock scroll and return focus to the opener.
- State is never colour only: required / optional is written out, errors are written text with a screen-reader-only "Error:" prefix, selected options use `aria-pressed`, `aria-current` or a checked native input.
- Native controls first (radio, checkbox, select, `<dialog>`); custom behaviour only where needed.
- Live regions announce configurator price and selection changes.
- 44 px minimum tap targets; text 14 px and up for `mist`.
- Reduced motion and no-JavaScript paths keep all content visible (see ARCHITECTURE.md section 5).
- Alt text comes from the slot registry; decorative uses pass `alt=""`.
