# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-13 — Session 44: Faster CI (at Izzat's request, outside the roadmap)

**Done**
- Browser tests that are not about Turnstile now load a fake widget (`tests/e2e/fakeTurnstile.ts`): five
  specs (a11y, estimator, estimator-submit, -results, -tabs). Real widget stays in four specs.
- CI skips the browser tests on PRs that change only `docs/` or root `*.md` files.

**Verified**
- `npm run check` 238 unit; e2e 93/93 in 70 s locally (CI step was 82 to 98 s; compare on this PR).

**Waiting on Izzat**
- Unchanged parked items: Hallmark; three audit items; stale CLAUDE.md "Accepted risks" wording.

---

## 2026-11-13 — Session 43: Custom domain live; roadmap complete

**Done**
- Released PR #43. Izzat set `TURNSTILE_HOSTNAME=zenntkaixa.dev`, redeployed, removed the old hostname
  from the Turnstile widget and refreshed LinkedIn's Post Inspector.
- Every roadmap item is now ticked.

**Verified**
- https://zenntkaixa.dev: canonical, `og:url` and share image on the new domain; fake token 403;
  Izzat's estimate worked; Upstash has today's day counter. The old `vercel.app` address redirects (308).

**Waiting on Izzat**
- Parked: Hallmark polish/redesign; audit items (e2e on the production build, Dependabot alerts, refund
  a slot on AI errors). CLAUDE.md "Accepted risks" rate-limit wording is stale.

---

