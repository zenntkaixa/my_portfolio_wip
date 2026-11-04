# 01 — Design system

## Concept: "delivery blueprint"
Izzat's story is turning requirements into shipped systems. The site borrows from engineering
blueprints: a cool cobalt on a light blue-grey, navy in dark mode, precise thin borders. The **estimator
tile is the one bold element** (blueprint grid background, largest tile). Everything else stays quiet.

## Tokens (implemented in `app/globals.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F2F4F8` | `#0D1424` | Page background |
| `--surface` | `#FFFFFF` | `#152038` | Tile background |
| `--surface-2` | `#E9EDF4` | `#1C2A47` | Inset areas, table stripes, chips |
| `--ink` | `#13203A` | `#E6ECF6` | Primary text |
| `--muted` | `#5A6578` | `#9AA7BD` | Secondary text |
| `--line` | `#D7DDE7` | `#26365A` | Borders, dividers |
| `--accent` | `#2B57E0` | `#7E9CFF` | Links, primary buttons, timeline bars |
| `--accent-ink` | `#FFFFFF` | `#0D1424` | Text on accent |
| `--accent-soft` | `#E3EAFD` | `#22325C` | Accent backgrounds, focus halo |
| `--ok` | `#0E8F7E` | `#4CC9B4` | Success, "open to roles" dot |
| `--warn` | `#B4570C` | `#F0A55E` | Risks, rate-limit messages |
| `--grid` | `rgba(43,87,224,.08)` | `rgba(126,156,255,.09)` | Blueprint grid lines |

Theme switching: `data-theme="light|dark"` on `<html>`, set before paint by an inline script in
`app/layout.tsx` (stored choice, else `prefers-color-scheme`).
With no stored choice the page follows live system changes; a click stores the choice and stops that.
The toggle is a 40px icon button (sun in light, moon in dark) with the fixed name "Dark theme" and
`aria-pressed`.

## Typography
- **Display:** Bricolage Grotesque (600–700) via `next/font/google` → `--font-display`
- **Body:** IBM Plex Sans (400, 500, 600) → `--font-body`
- **Numbers in tables/timeline:** IBM Plex Sans with `font-variant-numeric: tabular-nums` (no mono font).
  Now-tile stat values are the exception: display font, `--fs-xl`, `tabular-nums`.
- Scale: `--fs-xs 0.8rem`, `--fs-sm 0.9rem`, `--fs-base 1rem`, `--fs-lg 1.2rem`, `--fs-xl 1.6rem`,
  `--fs-2xl clamp(2.2rem, 5vw, 3.6rem)` (name in hero only)
- Line height 1.55 for body, 1.1 for display.

## Hero
- The name is the page's only `<h1>` (display font, `--fs-2xl`) and names the hero section.
- A 72px initials avatar (`--accent` on `--accent-soft`, `--r-md`) sits beside the name and role.
- The meta line is the location, then the availability text with a small `--ok` dot before it.

## Now
- Role block: job title semibold, organisation in `--muted`, then the detail line.
- Stats: a `<dl>` of div groups, `<dt>` (label) before `<dd>` (value) in the DOM; CSS shows the value
  first. Value in the display font at `--fs-xl`; label at `--fs-sm` in `--muted`.
- Three columns with 1px `--line` dividers between items only. The tile is a size container: under
  360px wide (mobile, and desktop around 1025-1125px) the stats become rows, value beside label,
  with horizontal dividers.

## Shape and depth
- Radius by hierarchy: hero and estimator `--r-lg 28px`, standard tiles `--r-md 20px`, chips and inputs
  `--r-sm 10px`.
- Depth comes from 1px `--line` borders and surface contrast. **No drop shadows** except a soft focus halo.

## Bento grid

12 columns, `gap: 16px`, max width 1200px, page padding `clamp(16px, 4vw, 40px)`.

| Row | Tiles (desktop column spans) |
|---|---|
| 1 | Hero `7` · Now `5` |
| 2 | Estimator `12` |
| 3 | Featured project (radiozk) `7` · AI workflow `5` |
| 4 | Case study `4` · Case study `4` · Case study `4` |
| 5 | Experience `7` · Stack `5` |
| 6 | Certifications `5` · Contact `7` |

- **≤ 1024px:** 6 columns. Half width (span 3): case studies 1 and 2, Stack, Certifications.
  Everything else is full width (span 6). In DOM order this gives clean rows with no orphans.
  Adjust only if `/visual-check` shows a problem, and update this line.
- **≤ 720px:** single column, Estimator directly after Hero. This is visual only (CSS `order` on
  `.tile--hero` and `.tile--estimator`). DOM, reading and focus order stay Hero, Now, Estimator, so
  keyboard and screen-reader users reach Now before the Estimator. Accepted trade-off (Izzat, 2026-11-03):
  the Now tile has nothing focusable, and moving the DOM would need explicit desktop grid placement.

## Focus
- `:focus-visible`: 2px `--accent` outline, 2px offset, plus a 4px `--accent-soft` halo (the only shadow).
- `forced-colors: active`: 2px `Highlight` outline, no halo.

## Form controls
- Text inputs, textareas and selects: `--surface` fill, 1px `--muted` border (3:1 non-text contrast;
  `--line` is too faint for a field edge), `--r-sm`.
- Buttons: 1px `--line` border (their text labels them), `--accent` border on hover.
- Range, radio, checkbox: native shape with `accent-color: var(--accent)`.
- Disabled: `--muted` text on `--surface-2`, no opacity fade.
- Base link and control styles sit in `@layer base`, so component styles always override them.

## Motion
- Tiles fade and rise 8px on first load, staggered 40ms, 400ms ease-out.
- Hover on interactive tiles: border colour moves to `--accent`, no scale.
- Everything wrapped in `@media (prefers-reduced-motion: no-preference)`.

## Copy style on the page
- First person, plain English, short sentences.
- Sentence case for headings. No all-caps labels, no "eyebrow" kickers.
- No emoji in the UI.

## Avoid (keeps it from looking templated)
- Purple gradients, glassmorphism, glowing blobs, giant drop shadows
- Identical radius on every element
- Mono fonts used as decoration
- Arrow glyphs inside button labels
