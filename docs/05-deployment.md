# 05 — Deployment

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel (Production + Preview), `.env.local` | Server only. Never prefix with `NEXT_PUBLIC_`. |
| `ANTHROPIC_MODEL` | Optional | Default `claude-haiku-5-5` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel, `.env.local` | Public by design |
| `TURNSTILE_SECRET_KEY` | Vercel, `.env.local` | Server only |
| `TURNSTILE_HOSTNAME` | Optional, Vercel | Production domain; when set, siteverify must report this hostname |
| `RATE_LIMIT_PER_HOUR` | Optional | Default 5 |
| `DAILY_LIMIT` | Optional | Default 150 |

Local development uses Cloudflare's official **test keys** (already in `.env.example`), which always pass.

## First deploy (Izzat does the account steps; Claude Code can guide)
1. Push the repo to GitHub (`gh repo create my_portfolio --private --source . --push`, or public when ready).
2. In Vercel: **Add New → Project → Import** the repo. Framework is detected as Next.js.
3. Add the env vars above. Use the Turnstile **test** keys for the very first deploy.
4. Deploy. Note the `.vercel.app` URL.
5. In Cloudflare: **Turnstile → Add widget**, hostname = the `.vercel.app` URL (add `localhost` too).
   Mode: Managed. Copy the real site key and secret.
6. Replace both Turnstile env vars in Vercel with the real keys. Redeploy.
7. In the Anthropic Console: set a **monthly spend limit** (start low, e.g. USD 10).

## Every later deploy
Push to `main` (a release, see CLAUDE.md section 4, Branches) → Vercel builds and deploys to production. Pushes to
`develop` and pull requests get preview URLs.

## Post-deploy checks
- Estimator works on the live URL and the Turnstile widget appears.
- Submitting 6 times in an hour returns the 429 message.
- `curl -X POST <url>/api/estimate -d '{}'` returns 400, not 500.
- Lighthouse mobile run meets the targets in `00-brief.md`.

## Custom domain (later)
Vercel → Project → Settings → Domains. Then add the new hostname to the Turnstile widget.
