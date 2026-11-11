# Design reference mapping — ORVANE

References live in `docs/design-references/` (see its README). This file says what each one becomes in the build.

## Brand

- **ORVANE**: fictional electric performance manufacturer. VIZAM portfolio concept; every page carries a
  "Concept project by VIZAM" label and all vehicle figures are labelled concept data.
- Lineup: **Aren** (grand touring sedan), **Sola** (performance SUV), **Vire** (two-door coupé).
- Tone: precise, calm, engineered. Short sentences. No superlatives that read as real-world claims.

## Tokens (define once as CSS variables, map into Tailwind)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0C0E` | primary dark background |
| `--carbon` | `#15171A` | raised dark surfaces, option rail |
| `--graphite` | `#2A2D32` | borders on dark, dividers |
| `--mist` | `#8A8F98` | secondary text (check contrast: use on dark only at >= 14px; on light use `--slate`) |
| `--slate` | `#5B616B` | secondary text on light |
| `--paper` | `#F4F1EC` | warm white sections |
| `--bone` | `#E7E2DA` | light surfaces, cards on paper |
| `--amber` | `#D9772B` | single accent: active states, links, key CTA; on light text use `#A8541A` for contrast |

- Type: display = a wide, tight grotesk for model names and headlines (self-hosted via `next/font`, e.g. Archivo
  expanded widths); text = Inter or Manrope. Model names set very large, uppercase, wide tracking.
- Radius: 2px on buttons/cards (sharp, engineered), full pill only for the nav and chips.
- Motion: 600–900ms `power3.out` reveals, 300ms UI transitions; everything off under `prefers-reduced-motion`.
- Spacing: section padding 96–160px desktop, 56–72px phone; 12-column grid, max width 1440.

## Mapping

| Reference element | Where it goes | Notes |
|---|---|---|
| Lucid: stage left + option rail right + step tabs + running price | `/configure` desktop | Phone: stage sticky on top, rail below, price bar fixed at bottom |
| Lucid: sticky "View summary" button | `/configure` | Amber CTA at rail bottom |
| Lotus: numbered step rail, angle dots, interior thumbnail | `/configure` | Dots switch views; thumbnail toggles exterior/interior |
| Mercedes: trim cards with spec chips and check mark | `/configure` trim + packages, `/models` cards | Equal-height cards |
| Mercedes: price + proceed bar | `/configure` | Price labelled "Concept price" |
| Taycan light: oversized name behind centred car, two-tone headline | Vehicle detail intro, `/design` | Own typography, no brush lettering copy; thin vertical guide lines as a subtle motif |
| Taycan light: pill nav | Global header | Minimal: Models, Configure, Technology, Story + menu for the rest |
| Taycan dark: stage, hotspots, stat row | Homepage hero + vehicle detail "Exterior" | Hotspots are real buttons with popovers, keyboard reachable |

## Deliberately different

- Original name, mark, copy and vehicle imagery; no real manufacturer logos or recognisable real cars as ORVANE models.
- Accent is amber, not red or yellow. Sharp 2px corners rather than the glass cards of reference 04.
- Accessibility first where references ignore it: contrast, visible focus, 44px tap targets, non-pointer controls.

## Checkpoints

- After Slice A (homepage): screenshots at 390 and 1440 next to references 03 and 05; list matches and gaps.
- UI/UX review gate before any push: 240/390/768/1440 screenshots + this table with an "implemented?" column.
