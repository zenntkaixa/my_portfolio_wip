# Progress log

Newest entry first. Each session adds one entry. Keep entries short: what changed, what was verified,
what's next, anything blocked on Izzat.

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
