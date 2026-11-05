# 01b — Tile layout rules

Per-tile rules split out of `01-design-system.md` (tokens, grid, focus and motion live there).
Read only the section for the tile you are changing.

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

## Featured project
- Tagline is the lead line: `--fs-lg`, weight 600 (bolder than the hero headline because it sits
  right under a tile title), line-height 1.4.
- Highlights: bulleted list with tighter 0.25em item spacing. Stack: `.chips` labelled "Tech stack".
- Links: a list in a wrapping flex row. Every external link gets `target="_blank"`,
  `rel="noopener noreferrer"` and visually hidden " (opens in a new tab)". No arrow glyphs or icons.

## AI workflow
- A real `<ol>` with native numbering. Numbers are styled with `::marker` (display font, `--accent`,
  tabular-nums). No `list-style: none` or CSS counters: Safari drops list semantics, and generated
  numbers can be read twice.
- Each step: name in semibold `--ink` on its own line, a visually hidden ":", then the sentence
  below; 0.9em between steps; 1.6em marker gutter.

## Case studies
- Title, then the context line in `--muted` at `--fs-sm` (`.tile__meta`), the body,
  then "Tech stack" chips.
- The tile is a flex column and the body grows, so the chips sit at the bottom and line up across
  equal-height tiles in a row. Clients stay anonymised (see 04-content).

## Experience
- A vertical timeline (`ol.timeline`, `role="list"`): the period in a 7.5em left column at `--fs-sm`,
  tabular-nums, `--muted`; the org in semibold with the role below it; a 1px `--line` rule between.
- Visually hidden commas separate period, org and role for screen readers and copy-paste.
- Container query: when the tile is narrower than 420px, the period sits above each entry and the rule runs down
  the left edge. Education follows under an h3 "Education".

## Stack
- One group per category: an h3 at `--fs-sm` semibold, then a chips list whose accessible name comes
  from that heading (`aria-labelledby`). 1.25em between groups.

## Certifications
- A bullet-less list (`role="list"`): name on the left, year on the right at `--fs-sm`, tabular-nums,
  `--muted`, with 1px `--line` dividers. An empty year renders nothing.

## Contact
- The email is a mailto link styled as the primary button (`.button-link`: `--accent` background,
  `--accent-ink` text, `--r-sm`, 2px underline on hover, `LinkText` border in forced colours).
- LinkedIn and GitHub are plain text links in a wrapping row. Never a phone number.
