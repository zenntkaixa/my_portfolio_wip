# 04 — Content rules

## Where copy lives
All biography, project and contact text is in `lib/content.ts`. Change copy there only, using the
`/update-content` skill. Components render it; they never contain it.

## Allowed to publish
- Employer names and job titles (PwC Acceleration Centers, Allianz Technology, Beyondsoft Malaysia,
  Hitachi eBworx and its subsidiary Hitachi Digital Host, Vetter Software). These are already public on LinkedIn.
- Metrics from the CV: 8+ years, 100 merged PRs across 13 repositories (Apr to Oct 2026), 32 release-branch
  merges resolved. Personal GitHub: 176 merged PRs on public repos since Oct 2026 (counted 2026-11-19;
  dated on the page so it never overclaims; update at each release).
- Certifications and education as listed.
- Email `zenntkaixa@yahoo.com`, LinkedIn, GitHub.
- `public/izzat-fahmi-cv.pdf`: the web copy of Izzat's CV (from the private Word CV v4 in his Drive), with
  the display name as its heading, the phone number removed and clients anonymised as below. Before replacing it, run
  `pdftotext public/izzat-fahmi-cv.pdf -` and check the text has no phone number and no client names.

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
- Display name: "Mohd. Izzat Fahmi Suhaimi" (first name "Mohd. Izzat Fahmi", last name "Suhaimi"; Izzat, 2026-11-19).
  Initials "MIFS" (icons and share card). The legal name stays in `profile.fullName` for the Guidewire checker.
- Title: "Mohd. Izzat Fahmi Suhaimi — Senior full-stack engineer" (the role before " · "; the stack list stays in the hero)
- Description: `seo.description` (the fuller sentence; the hero headline is shorter).
- Open Graph image: generated in M5 with `next/og` (initials, name, role, on the blueprint grid).
