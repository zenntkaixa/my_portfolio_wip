# 01b — Tile layout rules

Per-tile rules split out of `01-design-system.md` (tokens, grid, focus and motion live there).
Read only the section for the tile you are changing.

## Hero
- The name is the page's only `<h1>` (display font, `--fs-2xl`) and names the hero section.
- A 72px photo (`public/profile.webp`, 216px source, `--r-md`, decorative `alt=""`) sits beside the name and role.
- Under the role, the headline (`profile.headline`, display font, `--fs-xl`, weight 600) states the outcome in
  industry-neutral terms (M11, 2026-11-19: Izzat is targeting roles beyond insurance and banking),
  then a proof line (`profile.proof`, a `role="list"` list at `--fs-sm` in `--muted`): employers and the
  AWS certification, approved by Izzat 2026-11-17. The photo has real alt text ("Photo of <name>"). Numbers stay in the Now tile, not here.
- Under the summary, a contact row: "Email me" as the primary button (`.button-link`, mailto) then "Try the live demo" (jumps to `#estimator`), a LinkedIn
  text link and the CV download, so a visitor can reach Izzat without scrolling. Email and LinkedIn only, never a phone number.
- The meta line is the location, then the availability text with a small `--ok` dot before it.

## Now
- Role block: job title semibold, organisation in `--muted`, then the detail line.
- Stats: a `<dl>` of div groups, `<dt>` (label) before `<dd>` (value) in the DOM; CSS shows the value
  first. Value in the display font at `--fs-xl`; label at `--fs-sm` in `--muted`.
- Three columns with 1px `--line` dividers between items only. The tile is a size container: under
  520px wide (mobile and desktop, where a column is too narrow for the longest label) the stats become
  rows, value beside label, with horizontal dividers. Tablet widths keep the three columns.

## Featured project
- First line under the title: the dated personal GitHub stat (`featuredProject.personal`, `--fs-sm`, `--muted`,
  number in `--ink`) with a link to the GitHub profile (M11).
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
  tabular-nums, `--muted`; the org in semibold with the role below it, then the field (`experience[].field`,
  `--fs-sm`, `--muted`) so the range of industries shows at a glance (M11); a 1px `--line` rule between.
- Visually hidden commas separate period, org, role and field for screen readers and copy-paste.
- Container query: when the tile is narrower than 420px, the period sits above each entry and the rule runs down
  the left edge. Education follows under an h3 "Education".

## Stack
- One group per category: an h3 at `--fs-sm` semibold, then a chips list whose accessible name comes
  from that heading (`aria-labelledby`). 1.25em between groups.

## Certifications
- A bullet-less list (`role="list"`): name on the left, year on the right at `--fs-sm`, tabular-nums,
  `--muted`, with 1px `--line` dividers. An empty year renders nothing.

## Contact
- Under the availability note: "What I'm looking for" (`--fs-sm`, semibold, `--muted` h3) and a short
  bulleted list (`profile.lookingFor`): roles, kinds of team, location, work mode, citizenship (M12, Batch D). No notice period.
- The email is a mailto link styled as the primary button (`.button-link`: `--accent` background,
  `--accent-ink` text, `--r-sm`, 2px underline on hover, `LinkText` border in forced colours).
- LinkedIn and GitHub are plain text links in a wrapping row. Never a phone number.

## Estimator results (Batch B additions)
- Timeline tab: under Assumptions and Risks, two more lists in the same `.tab1-list` style, "Questions to confirm" (`openQuestions`) and "Not included" (`outOfScope`); each hides when empty. When `calendarAdjusted` is set, a `.tab3-note` under the summary says the calendar was stretched to fit the team (`teamSize` comes from `Estimator.tsx`).
- Budget tab: a "Contingency (N%)" row (10/20/30% by confidence, with the reason underneath) sits before the build total, and People and Contingency show ranges from the effort range (rows sum exactly to the total range); below the table, a seniority note comes before the rate note, which states the cost basis (Klang Valley in-house rates). All copy is in `estimatorCopy`.

## Estimator plan actions (C2)
- A `.plan-actions` row (base buttons, quiet) sits above the result tabs: "Copy plan" (`lib/planText.ts` to the clipboard; label becomes "Copied" for 2 s, a polite status announces it or the failure) and "Print or save as PDF" (`window.print()`).
- `@media print` at the end of `app/globals.css` hides everything except `.estimator__results`, stacks all three tab panels (overriding `hidden`), prints black on white with no accent frame, avoids splitting timeline rows and table rows, and shows `.plan-print-footer`.

## Estimator usage line and cache notice (C3)
- `EstimatorTile` is an async Server Component: it calls `countPlans()` and, only when the count is at least 25, shows a muted `.estimator__built` line ("{n} plans generated since November 2026", `en-MY` formatting). `app/page.tsx` sets `revalidate = 3600`. No `DATABASE_URL` means no line.
- A muted `.estimator__model-note` under the submit button states the 24-hour plan cache and that the description isn't stored.

## Estimator, Batch D
- Submit is the filled `--accent` primary (`.estimator__submit`), full form width; disabled stays inset (`--surface-2`, `--muted`, `--line` edge).
- Under an error banner the kept plan is dimmed (`.estimator__plan[data-kept]`, opacity .55) with a "Previous plan for: ..." line above; never for the example.
- A chip over typed text keeps it behind an "Undo" chip for 10 s (announced politely; typing dismisses it).
- `cached: true` in the response shows a muted "saved plan" note above the plan title.
- Under the minimum, the counter line swaps "(at least 20 characters)" for "Add a few more words" once the visitor has typed.

## Estimator, Batch E (deterministic model UI)
- Effort card: likely hours plus "Likely; best–worst h range". Confidence card lists the missing facts in plain words ("Not stated: ...") or says all six were stated (`data-testid="missing-facts"`).
- Budget tab, below the table: "Same scope, two working styles" (`ModeComparison`, a 3-column fixed-layout table: effort, calendar, people cost; the chosen mode's column is shaded and tagged "current"; no sideways scroll at 320px), then the native `<details>` "Estimate drivers" (`EstimateDrivers`) listing each applied factor, built from the constants in `lib/estimateModel.ts` and `lib/budget.ts`.
- The comparison is `compareModes(scope, team)` (`lib/estimateCompare.ts`): both builds from the kept scope, no request. Shown for live plans and the example. Copy plan text includes the range, contingency rate, missing facts and the comparison. The drivers disclosure is not printed when closed.

## Estimator Tasks tab: pills and tags
- Roles render as `.pill` with a role-coloured dot (see Pills in the design system), in the Role column and, on phones, in `.tab2-role-line` under the task; the role chips above the table carry the same dot. Role names are read once per row (the hidden one is `display: none`).
- After the task text, `.tab2-tags` holds one pill: "AI" on `AGENT_FRIENDLY` categories in AI mode (hours reduced by the AI band), or "Added by code" on tasks with `addedByCode` (the review task `buildPlan` inserts). Both carry visually hidden explanations (`estimatorCopy.tasks.tag*`) and wrap below the text on narrow widths. The copied plan text ends those lines with `[AI]` / `[added by code]`.
- The comparison table marks the current working style with a `.pill--current` pill.

## Estimator "How it's built" panel (M14)
- A native `<details class="built">` in `EstimatorTile`, directly under the "Read the code" line, closed by default, no client JS. Copy is `howItsBuilt` in `lib/content.ts`.
- Sections: request pipeline (numbered `ol`, auto-fit grid, no horizontal scroll at 320px), "Model proposes, code enforces" (two lists, stacked under 30rem), "Live numbers" (`usageStats()`, last 30 days; shown only with at least 5 ok plans, so absent without `DATABASE_URL`), dated eval table (static record from `npm run eval:estimator`, run by hand, never in CI; the variance row stays), and ADR links on GitHub.
