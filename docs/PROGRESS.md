# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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
