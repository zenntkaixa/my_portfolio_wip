# Izzat Fahmi — Portfolio

[![CI](https://github.com/zenntkaixa/my_portfolio_wip/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zenntkaixa/my_portfolio_wip/actions/workflows/ci.yml)

Personal portfolio of **Izzat Fahmi**, a backend-first full-stack software engineer (Java, Spring Boot,
React, TypeScript) working on AI-integrated software engineering.

The centrepiece is a live AI demo: describe a software feature, choose a team size and seniority, and
Claude returns an end-to-end delivery plan with effort and calendar estimates.

**Live:** _coming soon_ · **Built with:** Next.js 16, React 19, TypeScript, Anthropic Claude, Cloudflare Turnstile, Vercel

---

## What's worth a look

- **The estimator path** (`app/api/estimate/route.ts`, `lib/estimate.ts`). Requests are checked in a
  fixed order: content type and size, then schema validation, then Cloudflare Turnstile, then
  per-visitor and daily limits, and only then the Claude call. The model's JSON is never trusted:
  `normalisePlan` caps, clamps and re-totals it before the UI sees it.
- **Spend and abuse controls**: input limits, rate limit, daily cap, a small default model, metadata-only
  error logging. Reasoning in `docs/decisions/ADR-002-abuse-protection.md` and
  `docs/security-review-m2.md`.
- **Accessibility**: WCAG 2.2 AA axe scans of every estimator state in light and dark, a keyboard-only
  walkthrough, a design-token contrast test, and a skip link (`tests/e2e/a11y.spec.ts`,
  `tests/e2e/keyboard.spec.ts`, `tests/unit/contrast.test.ts`).
- **Quality gate**: GitHub Actions runs typecheck, unit tests, build and Playwright e2e on every PR. Tests
  never call the real API.

## Quick start

```bash
nvm use                 # Node 26
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev             # http://localhost:3000
```

`.env.example` ships with Cloudflare's always-pass Turnstile **test keys**, so the human check works
locally without an account.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e (AI call mocked). Run `npx playwright install chromium` once. |
| `npm run check` | Typecheck + unit tests + build |

## How this repo is developed

This project is built with **Claude Code** using a documented workflow:

- `CLAUDE.md` — project rules and the session loop Claude follows
- `docs/` — brief, design system, architecture, estimator spec, content rules, deployment, ADRs
- `docs/ROADMAP.md` and `docs/PROGRESS.md` — what's next and what happened
- One branch and one pull request per roadmap task into `develop`; releases are PRs from `develop` into
  `main` (`docs/decisions/ADR-004-pr-branch-workflow.md`)
- `.claude/agents/` — project builders (UI, API, prompt, QA) and a security reviewer; generic reviewer,
  verifier and release agents come from a shared team setup (`docs/decisions/ADR-005-claude-team-agents.md`)
- `.claude/skills/` — workflows: `/next-task`, `/visual-check`, `/ship`, `/update-content`
- `.claude/settings.json` — permissions (secrets unreadable, pushes need approval) and a typecheck hook

### First session on a new machine

```bash
git clone <repo-url> my_portfolio && cd my_portfolio
npm install && npx playwright install chromium
cp .env.example .env.local    # add the API key yourself; Claude is blocked from reading it
claude
```

Then in Claude Code:

```
/next-task
```

## Security and cost controls
Input limits, per-visitor rate limit, daily cap, server-side Turnstile verification, a small default
model, and a monthly spend limit on the Anthropic account. Details in
`docs/decisions/ADR-002-abuse-protection.md`.

## Contact
[zenntkaixa@yahoo.com](mailto:zenntkaixa@yahoo.com) ·
[LinkedIn](https://www.linkedin.com/in/mohamad-izzat-fahmi-bin-suhaimi-00b047145) ·
[GitHub](https://github.com/zenntkaixa)
