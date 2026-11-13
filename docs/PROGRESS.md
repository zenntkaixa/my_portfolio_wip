# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-13 — Session 42: M5 custom domain zenntkaixa.dev

**Done**
- Izzat bought zenntkaixa.dev (Cloudflare), added it and `www` in Vercel, DNS only, and added the
  hostname to the Turnstile widget. The bare domain is primary; `www` redirects to it.
- `siteUrl` in `lib/content.ts` is now https://zenntkaixa.dev (canonical, `og:url`, share image); README
  and the switch-over order in `docs/05-deployment.md`.

**Verified**
- https://zenntkaixa.dev returns 200 with a valid certificate; `www` and http redirect to it.
- `npm run check` 238 unit; e2e 93/93.

**Waiting on Izzat**
- After release: set `TURNSTILE_HOSTNAME=zenntkaixa.dev` in Vercel Production and redeploy; then check an
  estimate on the new domain and remove the old hostname from the Turnstile widget.

---

## 2026-11-12 — Session 41: Shared rate limit verified; roadmap parked

**Done**
- Released PR #38 (Upstash limiter, audit fixes). Upstash database `portfolio-ratelimit` created
  (Singapore, free); Izzat added both env vars to Vercel Production and redeployed.
- Hallmark design audit run; Izzat parked the polish/redesign choice. Custom domain deferred (remind Izzat).

**Verified**
- Limit script run on the real database (test keys, deleted). After 6 estimates on production the 6th
  was refused; day counter 5, one hashed visitor key with 5 hits, expiries set.

**Waiting on Izzat**
- Custom domain (only open roadmap item). Open audit items, not on the roadmap: e2e on the production
  build, Dependabot alerts, refund a slot on AI errors. CLAUDE.md "Accepted risks" rate-limit wording is stale.

---
