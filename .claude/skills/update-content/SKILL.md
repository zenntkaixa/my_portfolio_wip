---
name: update-content
description: Safely change biography, experience, project, case study or contact copy on the site. Use when Izzat asks to update text, add a project, change a job, or adjust wording.
---

# /update-content

1. Edit **only** `lib/content.ts` unless a new kind of content needs a new tile (then plan it with
   `/next-task` first).
2. Check the change against `docs/04-content.md`:
   - No phone number
   - Client names anonymised in case studies
   - No invented facts: if Izzat hasn't stated it, ask
   - First person, short sentences, sentence case, no exclamation marks
3. Keep the existing TypeScript shapes. If a shape must change, update every component that reads it.
4. Run `npm run typecheck`.
5. Show Izzat a before/after of the changed lines and wait for approval before committing.
