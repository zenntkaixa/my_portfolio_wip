# CLAUDE.md — Izzat Fahmi Portfolio

Personal portfolio for Izzat Fahmi, a backend-first full-stack engineer (Java, Spring Boot, React,
TypeScript) moving into AI-integrated software engineering. Goal: win **senior full-stack roles in
Malaysia**. Signature feature: a **live AI demo** where a visitor describes a feature, picks team size and
seniority, and Claude returns a delivery plan with effort and calendar estimates.

## 1. Start of every session

1. `git switch develop && git pull`, then `gh pr list` to see open PRs. If the previous task's PR
   is still open, say so: its ROADMAP tick isn't on `develop` yet, so wait for Izzat to merge it.
2. Read only the **latest** entry of `docs/PROGRESS.md` (everything above the first `---` after it).
   Older entries are in `docs/progress-archive.md`; don't read it unless needed.
3. Find the first unchecked task in `docs/ROADMAP.md`.
4. Read only the docs that task needs (map below). Propose a short plan and wait for Izzat's approval.

If Izzat gives a different instruction, follow it and log that in PROGRESS.md.

## 2. Doc map

| Need | Read |
|---|---|
| Goals, audience, decisions already made | `docs/00-brief.md` |
| Tokens, type, bento grid, focus, motion | `docs/01-design-system.md` |
| Per-tile layout rules (read only the tile you touch) | `docs/01b-tiles.md` |
| How the pieces fit | `docs/02-architecture.md` |
| Estimator API contract, prompt, UI states | `docs/03-estimator-spec.md` |
| Copy rules, what may be published | `docs/04-content.md` |
| Vercel, Turnstile, env vars, spend limit | `docs/05-deployment.md` |
| Why things are the way they are | `docs/decisions/` |
| Windows and Ubuntu setup | `docs/WINDOWS-TO-UBUNTU.md` |

## 3. Commands

Node 26 via nvm. In a fresh shell: `export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh; nvm use`
(system node is older). Scripts are in `package.json`; the two that matter:

- `npm run check`: typecheck, unit tests and build. The pre-commit gate.
- `npm run test:e2e`: Playwright, starts its own dev server.

Kill dev servers by PID (including the child `next-server`), never with `pkill -f`.

## 4. Session loop and token budget

```
/next-task → plan → Izzat approves → task branch → build → verify once → code-reviewer
  → /ship (push + PR into develop) → /clear → Izzat merges the PR
```

- **One task per session, one branch and one PR per task.** `/clear` after `/ship` opens the PR; ROADMAP and PROGRESS carry the state.
- **Small tasks** (one tile, a few lines): one subagent does the code and its tests. Docs-only or
  few-line diffs skip `code-reviewer`; the main agent fixes small review findings inline.
- **Verify once.** Whoever edited last runs `npm run check` and e2e. Don't re-run unless you edited since.
- **Screenshots:** one agent inspects them, never two. See `/visual-check` for crop-first rules.
- **Reports** from subagents: 15 lines or fewer.
- Run `security-reviewer` before anything touching `app/api/**`, env vars or deployment.
- Model choice: Sonnet for UI, tests, review of small diffs, content and bookkeeping. Opus for the
  estimator prompt, security reviews, hard bugs and architecture decisions.

### Branches and PRs (ADR-004)

- **`main`** holds released versions only; production deploys from it. Never commit to it directly.
- **`develop`** is the release in development. Nothing is committed to it directly; it changes only
  through merged PRs.
- **Task branches** come off an up-to-date `develop`, one per roadmap task, named
  `<type>/<milestone>-<slug>` with the conventional-commit type (e.g. `feat/m2-timeline`,
  `docs/m4-readme`, `chore/branch-workflow` when there's no milestone).
- **`/ship`** pushes the task branch and opens a PR into `develop` with `gh pr create`. Izzat reviews
  and merges it on GitHub; Claude never merges task PRs.
- **Releasing** = a PR from `develop` into `main`, opened only when Izzat asks and only after
  `npm run check` and `npm run test:e2e` pass on `develop`. Izzat merges it with a merge commit.

## 5. Coding standards

- **Server Components by default.** `"use client"` only where state or browser APIs are needed.
- **All site copy lives in `lib/content.ts`.** Components never hard-code biography text.
- **Styling uses CSS variables from `app/globals.css` only.** No raw hex in components, no inline
  colour styles, no Tailwind, no CSS-in-JS.
- **TypeScript strict, no `any`.** Validate external input (request bodies, model output) at the boundary.
- **No new dependencies without an ADR** in `docs/decisions/`. Prefer the platform.
- **Accessibility:** semantic HTML, visible focus, labelled controls, AA contrast,
  `prefers-reduced-motion`, `role="list"` on any list with bullets removed.
- One tile per file in `components/tiles/`.

## 6. Guardrails (never break these)

- **Never read, print or commit `.env`, `.env.local` or any real key.** `.env.example` is for shape only.
- **Never call the real Anthropic API in tests.** Mock `fetch`. Real calls cost Izzat money.
- **Never publish Izzat's phone number.** Contact is email and LinkedIn only.
- **Client names stay anonymised in case studies** (e.g. "a US insurer"). Employer names are fine.
- **Never weaken abuse protection** (Turnstile, rate limit, daily cap, input length limits) without asking.
- Don't change roadmap scope or design direction without asking Izzat first.
- Never `git push --force` and never rewrite published history.
- Never commit directly to `main` or `develop`, and never merge PRs; Izzat merges. Release PRs into
  `main` only when Izzat asks.
- Don't commit `.claude/settings.json` or `AGENTS.md` unless Izzat asks; stage explicit paths.

## 7. Definition of done (per task)

- [ ] `npm run check` passes (and e2e for UI or behaviour changes)
- [ ] UI changes pass `/visual-check`
- [ ] `code-reviewer` has no blocking findings (unless skipped as a small diff, per section 4)
- [ ] Roadmap item ticked and a PROGRESS.md entry written (12 lines or fewer)
- [ ] Conventional commit: `feat(ui): ...`, `fix(api): ...`, `docs: ...`, `test: ...`, `chore: ...`
- [ ] Task branch pushed and a PR open into `develop` (title = the commit subject)
