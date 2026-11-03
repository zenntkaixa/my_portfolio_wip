# 00 — Project brief

## Goal
A live, modern portfolio that gets Izzat shortlisted for **senior full-stack software engineer roles in
Malaysia**. It should prove three things within 30 seconds:

1. He is a strong **backend-first** engineer (Java, Spring Boot, APIs, enterprise insurance and banking).
2. He ships **full-stack** (React, TypeScript, Guidewire Jutro).
3. He is already **working with AI** in real delivery, not just talking about it.

## Audience
- Malaysian tech recruiters and hiring managers (banks, insurers, consultancies, product companies)
- Engineering leads who will open the GitHub repo and judge the code

## Decisions already made by Izzat (do not reopen without asking)

| Topic | Decision |
|---|---|
| Visual style | Bento grid dashboard, clean and minimal, light and dark mode |
| Framework and hosting | Next.js on Vercel, free `.vercel.app` domain first, custom domain later |
| AI demo | Feature description in, end-to-end technical workflow and time-to-done estimate out |
| AI model | Claude via the Anthropic API (Izzat pays per use) |
| Team setup in demo | Visitor picks team size and seniority |
| Demo output | Both views, in tabs: phases plus timeline chart, and a task table with hours per role |
| Abuse protection | Cloudflare Turnstile bot check plus per-visitor rate limit (daily cap as extra) |
| Project tiles | Both: anonymised work case studies and side projects |
| Featured side project | radiozk — https://github.com/zenntkaixa/radiozk |
| Avatar | Initials ("IF"), no photo |
| Contact | Email and LinkedIn only. **No phone number.** |

## Open items (ask Izzat when you reach them)
- Live URL for radiozk on Render (add to `featuredProject.live` in `lib/content.ts`)
- Final production Turnstile keys and the Vercel URL
- Whether to add more side projects later
- Custom domain name

## Source of truth for facts
Izzat's CV (October 2026). All facts are already captured in `lib/content.ts`. Never invent employers,
dates, numbers, certifications or projects. If something is missing, ask.

## Success criteria
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile)
- Estimator returns a plan in under 20 seconds for a typical description
- Looks deliberate at 390px and 1440px, light and dark
- Repo is clean enough that a hiring manager reading it is impressed too
