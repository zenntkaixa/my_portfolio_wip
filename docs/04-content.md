# 04 — Content rules

## Where copy lives
All biography, project and contact text is in `lib/content.ts`. Change copy there only, using the
`/update-content` skill. Components render it; they never contain it.

## Allowed to publish
- Employer names and job titles (PwC Acceleration Centers, Allianz Technology, Beyondsoft Malaysia,
  Hitachi Digital Host, Vetter Software). These are already public on LinkedIn.
- Metrics from the CV: 8+ years, 100 merged PRs and 13 repositories (Apr to Oct 2026), 32 release-branch
  merges resolved.
- Certifications and education as listed.
- Email `zenntkaixa@yahoo.com`, LinkedIn, GitHub.

## Never publish
- Phone number
- Client names in case studies. Use "a US insurer", "a regional life insurer", "a regional bank".
- Internal system names, ticket IDs, screenshots from client work, or anything under NDA
- Invented facts. If a tile needs something the CV doesn't have, leave a `TODO(izzat):` and ask.

## Voice
- First person ("I build…"), confident, specific, no buzzword stacking.
- Lead with outcomes, then the stack.
- Short sentences. Sentence case. No exclamation marks.

## SEO and metadata
- Title: "Izzat Fahmi — Full-stack software engineer"
- Description: one sentence from `profile.headline`.
- Open Graph image: generated in M5 with `next/og` (initials, name, role, on the blueprint grid).
