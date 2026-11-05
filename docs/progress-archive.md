# Progress archive

Older `docs/PROGRESS.md` entries, newest first. Read only when history is needed.

---

## 2026-11-05 — Session 19: M2 results Tab 2

**Done**
- `feat(ui)`: role chips from `roleTotals`; task table with one `<tbody>` per phase (rowgroup header,
  subtotal row), total footer, focusable scroll region on mobile. `fix`: `normalisePlan` keeps exact
  half-hour `totalHours` (was rounded, so footer and summary could disagree with subtotals).
- ROADMAP: M3 CI item gets the agreed follow-up (branch protection, auto-delete head branches).

**Verified**
- `npm run check` passes (42 unit); Playwright 65/65 (develop had 61, not 65 as PR #4 said). Tab 2 crops clean.

**Next up**
- M2: Accessible tabs with keyboard support [ui-builder].

---

## 2026-11-05 — Session 18: M2 results Tab 1

**Done**
- `feat(ui)`: summary `<dl>` (hours, weeks, team, confidence badge: ink text, tone on border + dot),
  timeline rows (label above a bar placed by `toBars`, week gridlines), phase cards, assumptions and
  risks sections. `fix(ui)`: index keys in TaskTable for repeated phase names.
- New `tests/e2e/estimator-results.spec.ts` (fixture geometry, summary, counts, 320 overflow, dup names).

**Verified**
- `npm run check` passes; Playwright 65/65. Tab 1 crops 320/1440 light+dark clean. reviewer fixes applied.

**Next up**
- M2: Tab 2: role total chips and grouped task table [ui-builder].

**Waiting on Izzat**
- Merge the PR, then say "PR merged".

---

## 2026-11-05 — Session 17: M2 timeline maths

**Done**
- `feat`: `lib/timeline.ts` — `toBars` (percent positions clamped to 0..100, whole-day labels "Day 3 to
  7" / "Day 3", half-day starts floored), `weekMarkers` (every 5 days, excludes 0 and 100),
  `roleTotals` (hours desc, ties by name). 16 unit tests replace the `it.todo` stubs.

**Verified**
- `npm run check` passes (41 unit tests). No e2e: no caller until Tab 1. reviewer skipped (small diff).

**Next up**
- M2: Tab 1: summary row, timeline chart, phase cards, assumptions and risks [ui-builder].

**Waiting on Izzat**
- Merge the PR, then say "PR merged".

---

## 2026-11-05 — Session 16: adopt claude-team agents and skills (Izzat's instruction)

**Done**
- `chore`: Agent contract in CLAUDE.md for the generic `~/claude-team` agents; `code-reviewer`
  retired for `reviewer`; `/ship` follows `ship-pr` for git and PRs; `/next-task` offers ranked
  options when there's a real choice. ADR-005.

**Verified**
- Docs and config only; no code changed. No leftover `code-reviewer` references.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR, then say "PR merged".

---

## 2026-11-05 — Session 15: branch strategy change (Izzat's instruction)

**Done**
- `chore`: task branches off `develop`, one PR per task into `develop`; Izzat merges. Releases are PRs
  `develop` → `main`. ADR-004; CLAUDE.md section 1/4/6/7, `/next-task` and `/ship` updated.

**Verified**
- Docs-only; no code changed.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR. Optional: protect `develop` and `main` on GitHub (require PR before merge).

---

## 2026-11-05 — Session 14: M2 submit flow and error states

**Done**
- `feat(ui)`: idle → submitting → success | error. Disabled fieldset, skeleton + polite "Planning phases…",
  `aria-busy`. 400 inline (textarea focused); 403/422/503 banners; 429 warn banner + Retry-After countdown
  on the button; 502/504/network Retry gated on a fresh token. Non-JSON bodies, `isPlan` guard, abort on
  unmount, focus to banner/results heading, footer note. Copy in `estimatorCopy`.
- New `lib/estimatorClient.ts` (+10 unit tests) and `tests/e2e/estimator-submit.spec.ts` (10 tests).

**Verified**
- `npm run check` passes; Playwright 58/58. 12 estimator crops clean. code-reviewer: no blockers, fixes applied.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Backlog (unchanged): siteverify `hostname` check in `route.ts`; per-instance rate limit.

---

## 2026-11-05 — Session 13: M2 Turnstile component

**Done**
- `feat(ui)`: Turnstile renders from `Script onReady` (no polling; survives StrictMode re-runs),
  `onToken` held in a ref, re-renders on `data-theme` change, try/catch around render, failure message
  in a persistent polite live region; `reset()` clears token then widget. Copy moved to `lib/content.ts`.
- New `tests/e2e/turnstile.spec.ts` (render, reset after request, blocked script, theme change).

**Verified**
- `npm run check` passes; Playwright 48/48; dev mode widget loads. Estimator crops 320/1440 light+dark
  clean. code-reviewer findings fixed; security-reviewer: safe to ship.

**Next up**
- M2: submit flow and all error states from 03-estimator-spec [ui-builder].

**Waiting on Izzat**
- Backlog (security advisories, existing code): check siteverify `hostname` in `route.ts`; rate limit is
  per-instance memory, so Turnstile is the real gate.

---

## 2026-11-05 — Session 12: M2 estimator form controls

**Done**
- `feat(ui)`: example chips (strings moved to `lib/content.ts`), textarea with right-aligned counter
  (warn colour under 20, hint in a polite live region), styled team slider with `<output>` readout and
  `aria-valuetext`, seniority as a native-radio segmented pill (2x2 under 360px). Dark fieldset border fixed.
- New `tests/e2e/estimator-form.spec.ts` (chips, counter, slider, arrow keys, no scroll at 320).

**Verified**
- `npm run check` passes; Playwright 44/44. Estimator crops at 320/1440 checked; code-reviewer: no blockers.

**Next up**
- M2: Turnstile component (explicit render, reset after each request) [api-engineer].

**Waiting on Izzat**
- Unchanged from Session 11. Open nit: estimator UI labels stay in the component (not `content.ts`).

---

## 2026-11-05 — Session 11: M1 visual-check pass (closes M1); token-budget setup

**Done**
- `chore: cut per-session token use` (Izzat's instruction): trimmed CLAUDE.md, PROGRESS archive,
  docs/01b-tiles.md split, Sonnet subagents, crop-first `/visual-check`, `/ship` confirms not re-runs.
- Visual-check fixes: focus halo spread 8px so 4px shows outside the outline; Turnstile renders
  `compact` when its container is under 300px (no sideways scroll at 320px).

**Verified**
- `npm run check` passes; Playwright 40/40. 320 and 390: scrollWidth equals clientWidth; halo crop
  checked. Few-line diff, so no code-reviewer run (CLAUDE.md section 4).

**Next up**
- M2: estimator form. Estimator styling also covers the deferred visual findings (plain controls,
  dark-mode fieldset border, cramped example buttons, radio wrapping at 320).

**Waiting on Izzat**
- Certifications empty space at 1024 (comparison image in the session). Now tile stat label wraps to
  5 lines at 1440: shorter copy or earlier row layout. M2 tile-hover roadmap line. Session 8 copy
  points, radiozk live URL, Anthropic key, `AGENTS.md`.

---

## 2026-11-04 — Session 10: M1 load animation with reduced-motion support

**Done**
- CSS-only `tile-in` (fade and rise 8px, 400ms ease-out), staggered 40ms per tile in DOM order via
  `nth-child`, capped at 440ms. All inside `prefers-reduced-motion: no-preference`; no JS, so tiles
  appear without hydration.
- Fill mode `backwards`, not `both`: a forwards fill leaves an identity transform on every tile, making
  it a containing block for `position: fixed` children (would trap M2 overlays).
- Visual spec emulates reduced motion, so screenshots never catch a mid-fade.
- New `tests/e2e/motion.spec.ts`: reduced motion means no animation; stagger delays in DOM order;
  no lingering transform after finish (shown to fail with `both`); works with JS blocked.
- docs/01: Motion section rewritten. Tile hover deferred to M2 with the estimator tile.

**Verified**
- `npm run check` passes; Playwright 40/40; motion spec 5x repeat, no flakes. Screenshots at
  390/1024/1440, light and dark, unchanged.
- code-reviewer: no blockers. Fixed: duplicated style reader in the spec, cap comment, mobile
  trade-off wording in docs.

**Found, not fixed**
- The hero paints at opacity 0 for its first frame, so LCP lands about a frame later. Negligible;
  exempt `.tile--hero` if Lighthouse ever flags it.

**Next up**
- M1: `/visual-check` pass at 390 / 1024 / 1440, light and dark; fix findings.

**Waiting on Izzat**
- Copy points from Session 8. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`. Whether to fix the 1024 empty space
  under Certifications.

---

## 2026-11-04 — Session 9: M1 Experience, Stack, Certifications, Contact tiles

**Done**
- Experience: `ol.timeline` with the period in a tabular-nums `--muted` column, org and role, a
  `--line` rule; container query stacks the period above each entry under 420px. Education under an h3.
- Stack: h3 per group; each chips list is named by its heading (`aria-labelledby`).
- Certifications: name left, year right in tabular-nums with `--line` dividers; empty year renders
  nothing.
- Contact: email as the primary mailto button (`--accent-ink` on `--accent`, 5.9:1 light, 7.1:1
  dark); LinkedIn and GitHub as new-tab links. No phone number. Note moved to `profile.contactNote`.
- Cross-tile: new `components/ExternalLink.tsx` (used by Project and Contact); `role="list"` on every
  bullet-less list; shared `lib/slug.ts` (with a unit test) replaces two copies.
- e2e (content only): the four tiles' content in order, mailto href, external link attributes, and
  a page-wide check that every bullet-less list has `role="list"`.
- docs/01: Experience, Stack, Certifications, Contact, Lists and external links sections.

**Verified**
- `npm run check` passes; Playwright 36/36 (home spec also 3x repeat, no flakes). Checked at
  390/1024/1440, light and dark.
- code-reviewer: no blockers. Fixed: stale CSS list comment, duplicated `slug()`, brittle empty-year
  guard, redundant hand-maintained list test, unused `className` prop, Experience key, container
  query wording.

**Found, not fixed**
- At 1024 Certifications stretches to Stack's height and has empty space at the bottom.
- Labels "Education", "LinkedIn", "GitHub" are UI chrome in components (allowed, like tile titles).

**Next up**
- M1: load animation with reduced-motion support.

**Waiting on Izzat**
- Copy points from Session 8. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`. Whether to fix the 1024 empty space.

---

## 2026-11-04 — Session 8: M1 case study tiles x3

**Done**
- Context line in `--muted` at `--fs-sm` (`.tile__meta`), body, then "Tech stack" chips.
- Each tile is a flex column and the body grows, so the chips sit at the bottom and line up across the
  equal-height row (desktop row 4; tablet tiles 1 and 2).
- e2e (content only): one region per case study, context, body and stack items in order; no
  duplicate or missing titles.
- docs/01: Case studies section.

**Verified**
- `npm run check` passes; Playwright 28/28 (two runs; the new test was shown to fail when the
  expected order was reversed). Checked at 390/1024/1440, light and dark.
- code-reviewer: no blockers. Anonymisation guardrail passes: only vendor and product names
  (Guidewire, Jutro, SonarQube, Azure and so on), no client names, internal system names or ticket IDs.

**Found, not fixed** (copy decisions for Izzat, via `/update-content`)
- "Guidewire Digital Portal program" could read as a client programme name; "Guidewire Digital
  Portals" would be unambiguous.
- "authorization" is US spelling; the other case studies use UK spelling.

**Next up**
- M1: Experience, Stack, Certifications, Contact tiles (Contact: same new-tab link treatment as the
  project tile).

**Waiting on Izzat**
- The two copy points above. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 7: M1 AI workflow tile

**Done**
- Native `<ol>` with numbers styled via `::marker` (display font, `--accent`). No `list-style: none` or
  counters, so Safari/VoiceOver keep list semantics and numbers aren't read twice.
- Each step: semibold name on its own line, then the sentence; a visually hidden ":" between them so
  screen readers don't run the two together. Hand-typed "1." numbering removed.
- e2e (content only): one `<ol>`, steps in content order with exact text, name in `<strong>`.
- docs/01: AI workflow section; `--accent` usage now includes list markers.

**Verified**
- `npm run check` passes; Playwright 27/27. Tile checked at 390 and 1440, light and dark: markers align
  with the step name and wrapped text aligns under the text. Marker contrast 5.9:1 light, 6.2:1 dark.
- code-reviewer: no blockers; the hidden separator, test merge and doc nits applied.

**Next up**
- M1: Case study tiles x3.
- Contact tile: same new-tab link treatment as the project tile (see Session 6).

**Waiting on Izzat**
- radiozk live URL (one line in `lib/content.ts`). Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 6: M1 featured project tile (radiozk)

**Done**
- Tagline as a lead line (`--fs-lg`, 600), description, compact highlights list, "Tech stack" chips.
- Links as a list in a wrapping row: "View code on GitHub", plus "Live demo" once
  `featuredProject.live` is set. Both open in a new tab with `rel="noopener noreferrer"` and hidden
  " (opens in a new tab)" text for screen readers.
- e2e (content only, per Izzat): tagline, description and highlights; stack items in order; GitHub
  link href/target/rel/name; no live link while `live` is empty (and the right one once it's set).
- docs/01: Featured project section.

**Verified**
- `npm run check` passes; Playwright 26/26. The GitHub repo URL returns 200. With a temporary live URL
  (reverted), the two-link row renders correctly and the live branch of the test passes.
- code-reviewer: no blockers; docs sync, tagline line-height and the links-as-list nit applied.

**Next up**
- M1: AI workflow tile (four numbered steps).
- When doing the Contact tile: give its links the same new-tab treatment (`rel="noopener noreferrer"`,
  hidden new-tab text, no `" "` spacing). Consider a shared `ExternalLink` component then.

**Waiting on Izzat**
- radiozk live URL (one line in `lib/content.ts`). Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 5: M1 Now tile

**Done**
- Role block: title semibold, organisation in `--muted`, then the detail (replaces `<strong>`/`<br>`).
- Stats: `<dl>` groups with dt (label) before dd (value) in the DOM; CSS shows the value first, in the
  display font at `--fs-xl`. Three columns with `--line` dividers between items.
- The tile is a size container: under 360px wide it switches to rows, value beside label. That
  happens on mobile and also on desktop around 1025-1125px.
- e2e: content, and dt/dd pairing and order. Layout tests (columns at 1440, rows at 390 and 1100)
  were written, then removed at Izzat's request; the layout is checked by `/visual-check` instead.
- docs/01: Now section; Typography line notes the stat-value exception.

**Verified**
- `npm run check` passes; Playwright 22/22 with the final test set. Now tile checked
  at 1440 and 390, light and dark; rows at 1100 were confirmed by a test before it was removed.
- code-reviewer: no blockers; its docs sync and component nits applied.

**Found, not fixed**
- At 1440 each stat column is about 130px wide, so "merged pull requests contributed to, Apr to Oct
  2026" wraps to 5 lines. Copy decision for Izzat (via `/update-content`).
- One full e2e run took 2.7 minutes instead of about 30 seconds, likely VM load from another session.

**Next up**
- M1: Featured project tile (radiozk).

**Waiting on Izzat**
- Optional: a shorter PR stat label. radiozk live URL (featured project tile). M2 needs the Anthropic
  key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 4: M1 hero tile

**Done**
- The hero name is now the page's only `<h1>` and names the hero section (was a hidden "About Izzat
  Fahmi" h2; the page had no h1). `Tile` gained `headingLevel` and `titleClassName`; `hideTitle`
  removed.
- Hero layout: 72px initials avatar beside the name (`--fs-2xl`) and role, then headline, summary,
  and a meta line with the location and the availability text after an `--ok` dot. Forced-colours
  handling for the avatar and dot.
- e2e: region name updated; new test for a single h1, hero content and the hidden avatar.
- docs/01 has a Hero section; docs/02 Bento row updated.

**Verified**
- `npm run check` passes; Playwright 20/20 (qa-tester ran it twice plus 3 repeats of home.spec;
  I reran it after the review fixes). Hero checked at 390 and 1440, light and dark: the name fits on
  one line at 390.
- code-reviewer: no blockers. Contrast: initials 4.9:1, dot 4.0:1, meta 5.9:1 or better.

**Next up**
- M1: Now tile (current role and three stats).

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 3: M1 theme toggle

**Done**
- Repaired the local git repo: the VM shut down uncleanly and left 11 empty object files from
  `96801b9`. I backed up `.git`, deleted the empty files and refetched them from origin; `git fsck` is
  now clean and no work was lost.
- `ThemeToggle`: 40px icon button (sun in light, moon in dark), fixed name "Dark theme" plus
  `aria-pressed`. Both icons are in the HTML and CSS shows the right one, so it's correct before
  hydration. Follows live system changes until the visitor picks a theme.
- Fixed, from code-reviewer: with storage blocked, the bootstrap can't set `data-theme`, so the
  toggle now falls back to the system scheme instead of assuming light.
- e2e: `home.spec.ts` updated; new `theme.spec.ts` covers no-flash (JS chunks blocked), system
  fallback, icons, live follow and blocked storage.
- docs/01 and docs/02 synced.

**Verified**
- `npm run check` passes; Playwright 19/19, run twice. The blocked-storage test fails on the old code
  and passes with the fix. Toggle checked at 390 and 1440, light and dark.

**Found, not fixed**
- Turnstile keeps the theme it rendered with; toggling doesn't restyle it (M2 Turnstile task).
- qa-tester saw `visual.spec.ts` time out once on a cold first run (dev server compiling). It didn't
  recur in 7 runs, including a cold one; watch for it.

**Next up**
- M1: Hero tile.

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-03 — Session 2: M1 finish `app/globals.css`

**Done**
- ≤720px: Hero then Estimator via CSS `order` (`.tile--hero`, `.tile--estimator`); DOM/focus order
  unchanged. Trade-off recorded in docs/01.
- Tile base: `.tile__title`, vertical rhythm (`.tile > * + *`), lists, `.muted`/`.tile__meta` hooks,
  shared `.chips`. Rules inside tiles use `:where(.tile)` so component classes win.
- Links and form controls in `@layer base`. Text fields use a `--muted` border (3:1 non-text contrast;
  `--line` was 1.36:1). Range/radio/checkbox keep native shape with `accent-color`.
- Focus: existing outline + halo, plus a `forced-colors` `Highlight` outline. Focus and form-control
  specs added to docs/01.

**Verified**
- `npm run check` passes; Playwright 11/11. Visual check at 390/1024/1440, light and dark: spans per
  docs/01, no horizontal scroll, 390px order Hero → Estimator → Now. Computed styles confirmed the
  textarea border, range slider and chips in both themes. Focus ring checked normally and with
  emulated forced colours.
- code-reviewer: one blocker (field border contrast) and the cascade findings fixed before commit.

**Found, not fixed** (belong to later tasks)
- Hero, Now stats, Contact links and the estimator form are still unstyled. Stale "stack chips"
  TODOs remain in ProjectTile, CaseStudyTile and StackTile; clear them in those tile tasks.

**Next up**
- M1: theme toggle with no flash on load.

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-03 — Session 1: stack upgrade (Izzat's instruction, outside the roadmap)

Izzat asked to upgrade to the latest LTS/stable versions before starting M1, so the first roadmap task
was deferred.

**Done**
- `194ff48` Node 22 → 26 LTS: `.nvmrc` 26, `engines.node` `26.x` (the old `>=20` would have let Vercel
  silently move to 26), `@types/node` ^26, version notes in docs.
- `fc96df9` React 19.1 → 19.3.1, Vitest 3 → 5.1 (Vite 8 is now a peer). `vitest.config.ts` renamed to
  `.mts` for Vite's native config loader; `*.mts` added to tsconfig `include`.
- `767e6d6` Next.js 15.5 → 16.4.4 via `@next/codemod upgrade --skip-adoption` (no source changes needed; Next
  rewrote `tsconfig.json`: `jsx: react-jsx`, `.next/dev/types`).
- e2e: `visual.spec.ts` waits for fonts + the Turnstile iframe instead of `networkidle`, which timed out
  10/12 runs on Next 16 vs 0/12 on Next 15 (root cause not found). Fixed the rate-limit test's
  `getByRole("alert")`, which also matched Next's route announcer (failed on Next 15 too).
- `ef2f030` Branching: `develop` is the working branch, `main` is for releases (CLAUDE.md §5 Branches).
- TypeScript 5.7 → 7.0.2 (native compiler). Added `"types": ["node"]` to tsconfig: TS 7 defaults
  `types` to `[]`, and `@types/node` was only arriving via Next's own type references.

**Verified** (on Node 26.13.0)
- `npm run check` passes. Playwright 11/11 in 3 consecutive runs. This is the first e2e run on Ubuntu.
- TS 7: a deliberate type error fails both `tsc` and `next build`. The post-edit hook shells out to
  `tsc`, so it's unaffected by TS 7 having no stable JS compiler API yet.
- Editors: TS 7 ships no `tsserver` and no language-service plugins yet. Editors set to "use workspace
  TypeScript" need the TypeScript native-preview extension (or fall back to their bundled TS), and the
  `next` tsconfig plugin gives no hints.

**Found, not fixed**
- Turnstile widget isn't painted in the 390px screenshot (same on Next 15). Look at it in M1/M2.
- npm's install-scripts policy blocks esbuild's postinstall; everything works without it.

- M0 "First run on Ubuntu" ticked: Izzat installed Node 26.13.0 via nvm (default alias `lts/*`,
  npm 11.20.0). On it, `npm run check` passes and Playwright passes 11/11.

**Next up**
- M1 via `/next-task`: finish `app/globals.css`.

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local` for the manual test.
- Decide what to do with the untracked `AGENTS.md`.

---

## 2026-11-03 — Session 0 (planned in Claude.ai, before first clone)

**Done**
- Scaffolded Next.js 15 project, wrote `lib/content.ts`, `lib/estimate.ts`, `lib/rateLimit.ts` and
  `app/api/estimate/route.ts`.
- Wrote CLAUDE.md, docs 00–05, ADRs 001–003, subagents, skills and the post-edit typecheck hook.
- Added compiling skeletons for every tile and the estimator UI, plus starter tests.

**Verified in the sandbox**
- `npm run typecheck` and `npm run test` pass.
- `npm run build` passes with fonts stubbed (the sandbox can't reach Google Fonts). Run the real build on Ubuntu.
- PostToolUse typecheck hook: exits 0 on clean edits, 2 with errors on broken ones.
- **Not yet run:** Playwright e2e (no browser in the sandbox). Run `npm run test:e2e` on Ubuntu.

**Next up**
- M0 last task: first run on Ubuntu, then start M1 with `/next-task`.

**Waiting on Izzat**
- radiozk live URL, Anthropic API key in `.env.local`, Vercel and Cloudflare accounts.
