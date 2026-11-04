# Progress log

Newest entry first. Each session adds one entry. Keep entries short: what changed, what was verified,
what's next, anything blocked on Izzat.

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
