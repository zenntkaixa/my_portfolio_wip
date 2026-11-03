# CLAUDE.md — Izzat Fahmi Portfolio

You are continuing development of Izzat Fahmi's personal portfolio website. Izzat is a backend-first
full-stack software engineer (Java, Spring Boot, React, TypeScript) moving into AI-integrated software
engineering. The site exists to win **senior full-stack roles in Malaysia**.

The signature feature is a **live AI demo**: a visitor describes a software feature, picks a team size
and seniority, and Claude returns an end-to-end delivery plan with effort and calendar estimates.

## 1. Start of every session (do this first, in order)

1. Read `docs/PROGRESS.md`, especially the latest entry and "Next up".
2. Read `docs/ROADMAP.md` and find the first unchecked task.
3. Read only the docs that task needs (see the doc map below). Don't load everything.
4. Enter plan mode, propose a short plan to Izzat, and wait for approval before editing.

If Izzat gives a different instruction, follow it instead and log that in PROGRESS.md.

## 2. Doc map

| Need | Read |
|---|---|
| Goals, audience, decisions already made | `docs/00-brief.md` |
| Colours, type, spacing, bento layout | `docs/01-design-system.md` |
| How the pieces fit, file responsibilities | `docs/02-architecture.md` |
| Estimator API contract, prompt, UI states | `docs/03-estimator-spec.md` |
| Site copy rules, what may and may not be published | `docs/04-content.md` |
| Vercel, Turnstile, env vars, spend limit | `docs/05-deployment.md` |
| Why things are the way they are | `docs/decisions/` |
| Moving between Windows and Ubuntu | `docs/WINDOWS-TO-UBUNTU.md` |

## 3. Commands

```bash
npm install            # first run after clone
npm run dev            # http://localhost:3000
npm run typecheck      # tsc --noEmit
npm run build          # production build (needs network for Google Fonts)
npm run test           # Vitest unit tests
npm run test:e2e       # Playwright (run `npx playwright install chromium` once)
npm run check          # typecheck + unit tests + build: the pre-commit gate
```

## 4. Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · plain CSS with design tokens (no Tailwind)
· Vercel hosting · Anthropic Messages API via `fetch` · Cloudflare Turnstile · Vitest · Playwright.

## 5. Session loop

```
/next-task  → plan (plan mode) → Izzat approves
            → delegate to the right subagent(s)
            → verify: npm run check, plus /visual-check for any UI change
            → code-reviewer subagent on the diff
            → /ship  (tick ROADMAP, log PROGRESS, commit, push)
```

One roadmap task per commit where practical. Keep diffs small and reviewable.

## 6. Subagents (`.claude/agents/`)

| Agent | Use for | Can edit? |
|---|---|---|
| `ui-builder` | Tiles, layout, theming, responsive CSS, motion | Yes |
| `api-engineer` | `app/api/**`, `lib/rateLimit.ts`, Turnstile verification | Yes |
| `prompt-engineer` | Estimator system prompt, JSON schema, `lib/estimate.ts` | Yes |
| `qa-tester` | Vitest and Playwright tests, fixing failing tests | Yes |
| `security-reviewer` | Secrets, injection, abuse and cost paths | No (read-only) |
| `code-reviewer` | Review any diff against this file before commit | No (read-only) |

Run `security-reviewer` before anything touching `app/api/**`, env vars, or deployment.

## 7. Skills (slash workflows in `.claude/skills/`)

- `/next-task` — pick and plan the next roadmap item
- `/visual-check` — Playwright screenshots: mobile and desktop, light and dark
- `/ship` — verify, review, tick roadmap, log progress, commit and push
- `/update-content` — change CV-driven copy safely in `lib/content.ts`

## 8. Coding standards

- **Server Components by default.** Add `"use client"` only to components that need state or browser APIs
  (currently `Estimator`, `ThemeToggle`, `Turnstile`).
- **All site copy lives in `lib/content.ts`.** Components never hard-code biography text.
- **Styling uses CSS variables from `app/globals.css` only.** No raw hex values in components, no inline
  colour styles, no Tailwind, no CSS-in-JS libraries.
- **TypeScript strict, no `any`.** Validate all external input (request bodies, model output) at the boundary.
- **No new dependencies without an ADR** in `docs/decisions/`. Prefer the platform.
- **Accessibility:** semantic HTML, visible focus, labelled form controls, colour contrast AA, respect
  `prefers-reduced-motion`.
- Keep components small: one tile per file in `components/tiles/`.

## 9. Guardrails (never break these)

- **Never read, print or commit `.env`, `.env.local` or any real key.** Use `.env.example` for shape only.
- **Never call the real Anthropic API in tests.** Mock `fetch`. Real calls cost Izzat money.
- **Never publish Izzat's phone number.** Contact is email and LinkedIn only.
- **Client names stay anonymised in case studies** (e.g. "a US insurer"). Employer names are fine.
- **Never weaken abuse protection** (Turnstile, rate limit, daily cap, input length limits) without asking.
- Don't change roadmap scope or design direction without asking Izzat first.
- Never `git push --force` and never rewrite published history.

## 10. Definition of done (per task)

- [ ] `npm run check` passes
- [ ] UI changes pass `/visual-check` at 390px and 1440px, light and dark
- [ ] `code-reviewer` has no blocking findings
- [ ] Roadmap item ticked and a PROGRESS.md entry written
- [ ] Committed with a conventional message: `feat(ui): ...`, `fix(api): ...`, `docs: ...`, `test: ...`

## 11. Environment notes

- Developed on Windows (`C:\my_projects\my_portfolio`) and Ubuntu with Claude Code. Line endings are forced
  to LF by `.gitattributes`.
- Node 22 (see `.nvmrc`).
