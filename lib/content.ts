// All site copy lives here, so updating the portfolio never means touching layout code.

import { CONTINGENCY } from "@/lib/budget";

export const profile = {
  name: "Mohd. Izzat Fahmi Suhaimi",
  firstName: "Mohd. Izzat Fahmi",
  lastName: "Suhaimi",
  // Legal name, as registered with Guidewire's Certification Checker.
  fullName: "Mohamad Izzat Fahmi bin Suhaimi",
  initials: "MIFS",
  role: "Senior full-stack engineer · Java, Spring Boot, React, AWS",
  headline: "I build reliable systems and the integrations that hold them together.",
  // Approved by Izzat 2026-11-17 (M6). Employers and the certification only: the Now tile already shows the numbers.
  proof: ["Built at PwC · Allianz Technology · Hitachi", "AWS Certified Solutions Architect, Associate"],
  proofLabel: "Track record",
  summary:
    "Eight years of Java, Spring Boot and React. Now I ship with AI coding agents. I stay accountable for every line that merges.",
  emailCta: "Email me",
  demoCta: "Try the live demo",
  // Web copy of the CV: no phone number, clients anonymised (docs/04-content.md).
  cv: { label: "Download CV", note: "PDF, 3 pages", href: "/izzat-fahmi-cv.pdf" },
  location: "Petaling Jaya, Malaysia",
  availability: "Open to senior full-stack roles in Malaysia",
  contactNote: "The fastest way to reach me is email.",
  lookingForLabel: "What I'm looking for",
  lookingFor: [
    "Senior full-stack or backend engineering roles",
    "B2B SaaS, enterprise software, platform and cloud teams, or a new industry",
    "Based in Petaling Jaya and used to working with teams across time zones",
    "Work mode: onsite, hybrid or remote",
    "Malaysian citizen",
  ],
  email: "hello@zenntkaixa.dev",
  linkedin: "https://www.linkedin.com/in/mohamad-izzat-fahmi-bin-suhaimi-00b047145",
  github: "https://github.com/zenntkaixa",
};

export const siteUrl = "https://zenntkaixa.dev";

export const seo = {
  siteName: "Mohd. Izzat Fahmi Suhaimi, portfolio",
  /** Search and share description: fuller than the hero headline. */
  description:
    "Backend-first full-stack engineer. Eight years building reliable systems and integrations across insurance, banking, compliance and SaaS, now shipping with AI coding agents.",
  ogTagline: "Live AI demo: describe a feature, get a delivery plan",
  ogAlt: "Mohd. Izzat Fahmi Suhaimi, senior full-stack engineer. Live AI demo: describe a feature, get a delivery plan.",
};

export const skipLink = "Skip to the estimator";

export const notFound = {
  title: "Page not found",
  body: "That link doesn't go anywhere. The whole portfolio, including the live AI demo, is on one page.",
  homeCta: "Back to the portfolio",
};

export const footer = {
  text: (year: number) => `© ${year} ${profile.name}. Built with Next.js and Claude.`,
};

export const now = {
  title: "Senior Associate, Full-Stack Developer",
  org: "PwC Acceleration Centers, Kuala Lumpur",
  detail: "Customer portal features for a US insurance program, with onshore teams across time zones.",
  stats: [
    { value: "8+", label: "years in production software" },
    { value: "100", label: "merged pull requests I contributed to across 13 repositories, Apr to Oct 2026" },
    { value: "32", label: "failed release-branch merges resolved to keep releases on schedule" },
  ],
};

export const featuredProject = {
  name: "radiozk",
  tagline: "A lossless web radio player with listener ratings",
  description:
    "Plays the Radio Calico HLS stream in FLAC with an automatic AAC fallback, shows what's playing, and stores thumbs up or down per track in PostgreSQL.",
  highlights: [
    "Express 5 API with per-IP rate limiting and request validation",
    "Unit, API, UI and Playwright end-to-end tests in GitHub Actions",
    "Production and dev Docker Compose setups, plus a Render Blueprint",
  ],
  stack: ["React 19", "TypeScript", "Node.js", "Express", "PostgreSQL", "nginx", "Docker"],
  repo: "https://github.com/zenntkaixa/radiozk",
  // Personal GitHub activity (zenntkaixa, public repos), counted 2026-11-19. Dated so it never overclaims.
  personal: {
    value: "176",
    text: "merged pull requests on personal projects since Oct 2026, many of them small, AI-assisted changes I reviewed",
    link: "My GitHub profile",
  },
  live: "https://zenntkaixa-radiozk.onrender.com/",
};

export const aiWorkflow = [
  { step: "Read the ticket", text: "Break the Jira requirement into acceptance criteria and edge cases." },
  { step: "Brief the agent", text: "Give it screenshots, API request and response samples, and our engineering guidelines." },
  { step: "Review the change", text: "Check the diff against coding standards, security and the original intent." },
  { step: "Verify and ship", text: "Run the tests, confirm the behaviour in the app, then raise the pull request." },
];

export const caseStudies = [
  {
    title: "Multi-policy changes with batch APIs",
    context: "US insurer, Guidewire Digital Portal program",
    body: "Built React and TypeScript features on Guidewire Jutro. Implemented multi-policy changes with composite and batch API requests to reduce unnecessary round trips, built a risk-scoring integration reused across product lines, and brought documents from two backend systems into one view with role-based access. Resolved 32 failed release-branch merges to keep releases on schedule.",
    stack: ["React", "TypeScript", "Jutro"],
  },
  {
    title: "Compliance-grade document checks with OCR",
    context: "Regional life insurer, digital platform",
    body: "Built Spring Boot REST APIs that bring OCR results into review and correction workflows, added anti-money-laundering checks, and kept quality gates green with unit tests, SonarQube and Jenkins on Azure.",
    stack: ["Java", "Spring Boot", "Azure"],
  },
  {
    title: "Modernising a legacy banking platform",
    context: "Regional bank, digital banking",
    body: "Started on the legacy platform, then moved it to microservices: API-first Spring Boot services on PostgreSQL, data synchronisation between old and new services, and DevOps delivery with GitLab, Jenkins and OpenShift.",
    stack: ["Spring Boot", "PostgreSQL", "OpenShift"],
  },
];

export const experience = [
  // field: the domain, so the range of industries shows at a glance.
  { org: "PwC Acceleration Centers", role: "Senior Associate, Full-Stack Developer", period: "2025 to now", field: "Insurance customer portals" },
  { org: "Allianz Technology", role: "Life Core Developer", period: "2024 to 2025", field: "Life insurance core systems" },
  { org: "Beyondsoft Malaysia", role: "Java Developer", period: "2023 to 2024", field: "Compliance and document checks" },
  // Role and field left out on purpose: "Career break" is all Izzat chose to say (2026-11-24).
  { org: "Career break", period: "2022 to 2023" },
  { org: "Hitachi eBworx, then Hitachi Digital Host", role: "Application Engineer", period: "2020 to 2022", field: "Digital banking modernisation" },
  { org: "Vetter Software", role: "Junior Software Engineer, then QA Engineer", period: "2017 to 2020", field: "Veterinary practice SaaS" },
];

export const stack = [
  { group: "Backend", items: ["Java", "Spring Boot", "Node.js", "REST APIs", "Microservices", "Oracle PL/SQL"] },
  { group: "Frontend", items: ["React", "TypeScript", "Guidewire Jutro"] },
  { group: "Data and cloud", items: ["PostgreSQL", "Oracle", "AWS", "Azure", "OpenShift", "Docker"] },
  { group: "AI and quality", items: ["Claude", "Gemini", "OpenAI", "CI/CD", "SonarQube", "Playwright"] },
];

// Exam-based certifications only (Izzat, 2026-11-19), newest first. Course certificates stay off.
export const certificationsNote = "Each one earned by passing a paid exam.";

// url: the issuer's public verification page. Guidewire has none per certificate (see guidewireCheck).
export const certifications = [
  { name: "Guidewire InsuranceSuite Developer, Associate", year: "2026" },
  { name: "Guidewire Jutro Developer, Associate", year: "2026" },
  {
    name: "EC-Council Certified Blockchain Professional v2",
    year: "2025",
    url: "https://aspen.eccouncil.org/VerifyBadge?type=certification&a=01GkhY5%2B2oWIqQRU420B9ODaazlz%2FX6n3RG703e64UA%3D",
  },
  {
    name: "EC-Council Certified Blockchain Professional v2, Business Leaders",
    year: "2025",
    url: "https://aspen.eccouncil.org/VerifyBadge?type=certification&a=hkxP%2FY3Fixvny%2BW%2FJqIbo12KUtqjBX8IP%2B92lrrW5k8%3D",
  },
  {
    name: "AWS Certified Solutions Architect, Associate",
    year: "2025",
    url: "https://www.credly.com/badges/a8c36b1e-52e4-4d9d-9f99-013c88ac4c56",
  },
];

export const guidewireCheck = {
  link: "Guidewire's Certification Checker",
  url: "https://education.guidewire.com/lmt/lmtlogin.prHome?site=guidewire",
  after: `: search “${profile.fullName}” to verify the Guidewire ones.`,
};

export const education = "Bachelor of Computer Science (Software Engineering) with Honours, Universiti Tun Hussein Onn Malaysia";

export const turnstileFailedMessage =
  "The human check couldn't load. Disable content blockers for this site or refresh the page.";
export const turnstileNotConfiguredNote =
  "Human check not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY (see .env.example).";

/**
 * Detailed briefs: one is shown on each page load next to two short examples, so visitors can compare
 * the confidence a detailed description earns. Each states the users, systems, data, integrations,
 * limits and scope that the prompt's confidence rule counts.
 */
export const estimatorBriefs = [
  {
    title: "Claim photo upload",
    text: "In our existing React and Spring Boot claims portal, let logged-in policyholders attach up to 5 JPEG or PNG photos (10 MB each) to an open claim. Store them encrypted in our current S3 bucket, read the repair invoice total and date with AWS Textract, and pre-fill those two fields for the customer to confirm. About 2,000 claims a month. Out of scope: video and the mobile apps.",
  },
  {
    title: "Clinic booking",
    text: "Patients of our 3 clinics book a 15-minute GP slot on our existing Next.js website. Doctors' schedules already live in our Postgres database. Send an SMS reminder 24 hours before through our current Twilio account, and let patients cancel from a link in the SMS. About 300 bookings a day. Staff keep the existing admin panel; no payments in this phase.",
  },
  {
    title: "Table QR ordering",
    text: "Diners at our 12 restaurants scan a QR code on the table, see the menu from our existing POS API, and send an order straight to the kitchen screens we already have. Payment stays at the counter for now. Menus in English and Bahasa Malaysia. Peak load is about 50 orders a minute across all outlets, and the web app must work on older Android phones.",
  },
  {
    title: "Leave approval",
    text: "Our 400 staff apply for annual and medical leave in our existing Angular HR portal (Java backend, Oracle database). Managers get an email and approve or reject in one click. Balances come from the current payroll tables, and approved leave appears in the team's Outlook calendar through Microsoft Graph. Public holidays differ by state. No mobile app.",
  },
  {
    title: "Delivery tracking",
    text: "Customers of our parcel service open a tracking link from an SMS and see the rider's live position on a map with an ETA. Riders already use our Android app, which can send GPS every 15 seconds to our Node.js backend. About 800 riders and 20,000 deliveries a day. The link expires an hour after delivery, and customer phone numbers are never shown to riders.",
  },
  {
    title: "Badminton booking",
    text: "A web app for our badminton club's 4 courts. About 60 members log in with Google, book a 1-hour slot up to 7 days ahead, and invite up to 3 friends who each pay their share by DuitNow QR before the booking is confirmed. Unpaid bookings are released after 15 minutes. Built as a weekend project on Supabase and Next.js; no mobile app.",
  },
  {
    title: "Trip cost splitter",
    text: "A mobile-friendly web app for group trips. One person creates a trip and shares a link; up to 15 friends join with just a name. Anyone adds an expense with the payer, the amount in MYR or another currency, and who shared it. The app shows who owes whom with the fewest transfers. Data is deleted after 90 days. No accounts and no payments inside the app.",
  },
  {
    title: "Spending alerts",
    text: "In our existing banking app (React Native, Java microservices), customers set a monthly limit per spending category. Card transactions already arrive on our Kafka topic within seconds. At 80% and 100% of a limit, send a push notification through our current Firebase setup. About 1 million active customers. Categories come from the merchant code; no changes to the card system.",
  },
];

/** Two are shown at random on each page load. The first one is also the stored example plan's feature. */
export const estimatorExamples = [
  // Insurance and billing
  "Let policyholders log in with a one-time code sent by SMS",
  "Customers upload claim photos and OCR fills in the claim form",
  "Email each customer a monthly PDF billing statement",
  "Customers pay their premium online with FPX or a debit card",
  "Customers track their claim status on their phone",
  "Flag claims that look like possible fraud for a manual review",
  // Other industries
  "Shoppers get an email alert when a sold-out item is back in stock",
  "Diners order from their table by scanning a QR code on the menu",
  "A cafe loyalty card that gives a free drink after nine stamps",
  "Patients book clinic appointments online and get an SMS reminder",
  "Track delivery riders live on a map with an ETA for each order",
  "Teachers post homework and parents see what is due this week",
  "Staff apply for leave online and managers approve it in one tap",
  "Tenants report a broken item with a photo and track the repair",
  "Residents report potholes on a map and vote on the worst ones",
  "Warn users before they go over their monthly budget",
  "Sell event tickets with a QR code that is scanned at the door",
  "Machine sensors warn the factory before a part fails",
  "Gym members book a class and join a waitlist when it is full",
  "Send a WhatsApp reminder three days before a payment is due",
  "A chatbot answers FAQs and hands off to a human",
  // Common building blocks
  "Admins manage user roles, with an audit log of every change",
  "Export any report table to Excel with the current filters applied",
  "Let users switch the app between English and Bahasa Malaysia",
  "A public status page for outages and maintenance",
  // Fun projects
  "Friends split a group trip's costs and see who owes whom",
  "Spin a wheel to pick where friends eat tonight",
  "A daily word puzzle with a leaderboard for a group of friends",
  "Match people with shelter pets based on their home and lifestyle",
  "A plant-watering reminder app with a photo diary for each plant",
  "Turn family recipe cards into a searchable cookbook",
  "Guests queue karaoke songs from their phones",
  "Book a badminton court and split the fee between the players",
  "A running club leaderboard of each member's weekly distance",
  "Plan a Raya open house with RSVPs and a food sign-up",
];

export const estimatorIntro =
  "Describe a software feature, choose your team, and get a delivery plan with effort and calendar estimates from Claude. It follows how I break down requirements at work.";

export const estimatorBuiltBy = {
  text: "I built this with Next.js, the Claude API, Cloudflare Turnstile and a rate limit. ",
  link: "Read the code",
  url: "https://github.com/zenntkaixa/portfolio",
};

const adr = "https://github.com/zenntkaixa/portfolio/blob/develop/docs/decisions/";

/** "How it's built" panel under the estimator intro. Stats come from Neon (lib/estimator/events.ts usageStats). */
export const howItsBuilt = {
  summary: "How it's built",
  pathTitle: "The path of one request",
  path: [
    { step: "Browser form", note: "You describe the feature, team size and seniority." },
    { step: "Cloudflare Turnstile", note: "A human check, verified on the server." },
    { step: "API route", note: "Validates and length-limits every input." },
    { step: "Rate limit and daily cap", note: "Shared across servers in Upstash Redis." },
    { step: "24-hour plan cache", note: "The same brief inside a day costs nothing." },
    { step: "Claude Haiku", note: "Returns the scope as schema-checked JSON (structured outputs)." },
    { step: "Code applies every factor", note: "buildPlan turns the scope into hours, calendar and budget." },
    { step: "Plan shown", note: "One metadata row goes to Postgres (Neon, Singapore), never your text." },
  ],
  splitTitle: "Model proposes, code enforces",
  modelTitle: "The model decides",
  model: ["Tasks", "Roles and categories", "Mid-level base hours", "Which facts the brief states", "Risks and questions"],
  codeTitle: "Code decides",
  code: ["Seniority and AI factors", "Confidence", "Effort range", "Contingency", "Calendar and budget", "Every total"],
  splitWhy: "So the same scope gives both working styles, and the numbers always add up.",
  statsTitle: "Live numbers",
  statsMin: 5,
  stats: (s: { plans: number; medianS: number; p95S: number; cacheHitPct: number; costCents: number }) => ({
    caption: `Last 30 days, ${s.plans} plans`,
    items: [
      ["Median time to a new plan", `${s.medianS.toFixed(1)} s`],
      ["Slowest 5% of new plans (p95)", `${s.p95S.toFixed(1)} s`],
      ["Served from cache", `${Math.round(s.cacheHitPct)}%`],
      ["Model cost per new plan", `${s.costCents.toFixed(2)} US cents`],
    ] as [string, string][],
  }),
  evalTitle: "Tested against the real model",
  evalCaption:
    "Run on 2026-11-20 with Claude Haiku on 9 briefs. I run it by hand with npm run eval:estimator, never in CI, because real calls cost money.",
  evalHead: ["Check", "Result"],
  evalRows: [
    ["Valid plans, including a one-line request (dark mode)", "6 of 6"],
    ["Refused as intended (vague, off-topic, prompt injection)", "3 of 3"],
    ["With AI agents vs traditional, same scope", "10% to 12% fewer hours"],
    ["Same brief run twice", "264 h vs 291 h (+10%), same facts, 22 tasks each"],
    ["Cost of the whole run", "US$0.0080"],
  ],
  linksTitle: "Why it works this way",
  links: [
    { label: "ADR-011: the model proposes, code enforces", url: adr + "ADR-011-model-proposes-code-enforces.md" },
    { label: "ADR-013: a deterministic effort model", url: adr + "ADR-013-deterministic-effort-model.md" },
    { label: "ADR-009: a shared rate limit", url: adr + "ADR-009-upstash-rate-limit.md" },
  ],
};

/** Plain-words names for the six facts the description may leave out (Fact in lib/estimate.ts). */
const factLabels = {
  users: "who the users are",
  systems: "existing systems",
  data: "the data involved",
  integrations: "outside services",
  limits: "limits such as volume, security or deadlines",
  outOfScope: "what is out of scope",
};

const pct = (n: number) => `${Math.round(n * 100)}%`;

export const estimatorCopy = {
  tabsLabel: "Plan views",
  tabPhases: "Timeline",
  tabTasks: "Tasks",
  tabBudget: "Budget",
  budget: {
    caption: "Estimated budget in Malaysian ringgit",
    regionLabel: "Budget table, scrolls sideways on small screens",
    item: "Item",
    cost: "Cost (MYR)",
    buildGroup: "Build",
    people: "People",
    seats: "AI agent seats",
    seatsDetail: (count: number, months: number, low: number, high: number) =>
      `${count} ${count === 1 ? "seat" : "seats"} × ${months} ${months === 1 ? "month" : "months"} × RM ${low}–${high}`,
    contingency: (ratePct: number) => `Contingency (${ratePct}%)`,
    contingencyWhy: `Higher when fewer facts were given: ${pct(CONTINGENCY.high)} for high confidence, ${pct(CONTINGENCY.medium)} for medium, ${pct(CONTINGENCY.low)} for low.`,
    peopleDetail: (hours: number, rate: number, seniority: string) =>
      `${hours} hours likely × RM ${rate} per hour (${seniority}); the range uses the best and worst effort`,
    buildTotal: "Estimated build cost",
    monthlyGroup: "Running costs after launch",
    monthlyTotal: "Per month",
    none: "None listed",
    rateNote: (rates: Record<string, number>) =>
      `People cost uses assumed Klang Valley in-house rates (salary plus EPF, SOCSO, EIS and overheads): ${Object.entries(rates)
        .map(([k, v]) => `${k} RM ${v}`)
        .join(", ")} per hour. Agency rates are higher.`,
    seniorityNote:
      "Juniors take more hours at a lower rate; seniors fewer hours at a higher rate. Mixed assumes 1 senior, 2 mid and 1 junior.",
    note: "Tool and running costs are typical market ranges for planning only. Verify with vendors before you commit.",
  },
  submit: "Estimate this feature",
  cacheNote: "Plans are kept for 24 hours so the same request gets the same answer. Your description isn't stored word for word.",
  plansGenerated: (n: string) => `${n} plans generated since November 2026`,
  briefChip: (title: string) => `Detailed brief: ${title}`,
  modelNote: "Uses Claude Haiku for a fast answer in about 10 seconds. Treat the plan as a starting point, not a quote.",
  example: {
    note: (feature: string) => `Example plan for: ${feature}. Describe your own feature in the form for a live estimate.`,
    footer: "This example was written by hand to show the format. Live estimates are generated by Claude.",
    preview: (title: string, hours: string, weeks: string) => `See an example plan below: ${title}, ${hours}, ${weeks}`,
  },
  mode: {
    legend: "Working style",
    options: { traditional: "Traditional team", "ai-assisted": "With AI agents" },
    teamSuffix: ", with AI agents",
  },
  /** Added by code (lib/estimateModel.ts) to plans with AI agents; the model never sees the working style. */
  aiPlan: {
    reviewTask: "Review and correct agent output",
    assumption: "AI coding agents draft code, tests and configuration; a named engineer reviews, corrects and owns every change.",
    reviewRisk: "Human review of agent output can become the bottleneck, so the calendar shrinks less than the effort.",
    soloRisk: "With one or two people, the author of a change is often its only reviewer: weak separation of duties.",
  },
  people: (n: number) => `${n} ${n === 1 ? "person" : "people"}`,
  atLeast: (min: number) => ` (at least ${min} characters)`,
  /** Replaces `atLeast` once the visitor has typed something but is still under the minimum. */
  moreWords: (min: number) => ` Add a few more words (${min} characters minimum).`,
  cachedNote: "Same request as before, so this is the saved plan from the last 24 hours.",
  previousPlan: (desc: string) => `Previous plan for: “${desc.length > 60 ? `${desc.slice(0, 60).trimEnd()}…` : desc}”`,
  undo: { button: "Undo", announce: "Example added. Undo is available for 10 seconds." },
  planning: "Planning phases…",
  /** Rotates every ~2.5s while waiting; visual only (the status line announces `planning` once). */
  steps: ["Reading your brief…", "Sizing the phases…", "Estimating tasks…", "Costing the team…"],
  usuallyWait: "Usually about 10 seconds.",
  cta: { text: "Like how I break down work? Let's talk about your team.", email: "Email me", linkedin: "LinkedIn" },
  feedback: {
    text: "Spotted something off in this plan?",
    link: "Tell me",
    subject: (title: string) => `Feedback on the estimator plan: ${title}`,
  },
  resultsCrashed: "Something went wrong showing this plan. Reload the page and try again.",
  summary: {
    hours: "Effort",
    weeks: "Calendar",
    team: "Team",
    confidence: "Confidence",
    hints: {
      hours: "Total person-hours across all tasks",
      weeks: "Working weeks from start to release with this team",
      team: "The size, seniority and working style you picked",
      confidence: {
        low: "Your description left a lot open. Name the users, systems and limits for a tighter plan.",
        medium: "Some details were assumed. Check the Assumptions list below.",
        high: "Your description was specific, so few guesses were needed.",
      },
    },
    hoursValue: (n: number) => `${n} hours`,
    rangeNote: (best: number, worst: number) => `Likely; ${best}–${worst} h range`,
    missing: (list: string) => `Not stated: ${list}.`,
    allStated: `All ${Object.keys(factLabels).length} facts were stated: ${Object.values(factLabels).join(", ")}.`,
    weeksValue: (n: number) => `${n} ${n === 1 ? "week" : "weeks"}`,
  },
  factLabels,
  drivers: {
    heading: "Estimate drivers",
    intro: "Every number above comes from these fixed rules, applied by code to the same list of tasks.",
    seniority: (name: string, factor: number) =>
      factor === 1 ? `Seniority (${name}): task hours stay as estimated for a mid-level engineer.` : `Seniority (${name}): task hours are multiplied by ${factor}.`,
    ai: (lessLow: number, lessHigh: number, likelyPct: number, reviewPct: number) =>
      `With AI agents: ${lessLow}–${lessHigh}% fewer hours, ${likelyPct}% likely, only on code, tests, docs and config. A review task of ${reviewPct}% of that work is added to each phase.`,
    spread: (best: number, worst: number, confidence: string) =>
      `Confidence (${confidence}): the range runs from ${Math.round(best * 100)}% to ${Math.round(worst * 100)}% of the likely hours.`,
    contingency: (ratePct: number) => `Contingency: ${ratePct}% on people cost, set by confidence.`,
    capacity: (hours: number) =>
      `Calendar: ${hours} productive hours per person-day. Each phase grows or shrinks with its adjusted hours (seniority and working style), and the whole plan is stretched if the team is too small.`,
  },
  compare: {
    heading: "Same scope, two working styles",
    caption: "Effort, calendar and people cost for the same scope",
    row: "Measure",
    traditional: "Traditional",
    ai: "With AI agents",
    current: "current",
    effort: "Effort (likely)",
    calendar: "Calendar",
    people: "People cost",
    seats: "AI agent seats",
    noSeats: "None",
    build: "Build total",
    hoursRange: (likely: number, best: number, worst: number) => `${likely} h (${best}–${worst})`,
  },
  timelineLabel: (days: number) => `Timeline, ${days} ${days === 1 ? "day" : "days"}`,
  weekLabel: (n: number) => `Week ${n}`,
  duration: (n: number) => `${n} ${n === 1 ? "day" : "days"}`,
  taskCount: (n: number) => `${n} ${n === 1 ? "task" : "tasks"}`,
  tasks: {
    roleChipsLabel: "Hours by role",
    chip: (role: string, hours: number) => `${role} ${hours} h`,
    tagAi: "AI",
    tagAiHint: "hours reduced by AI agents",
    tagAdded: "Added by code",
    tagAddedHint: "not written by the model",
    caption: "Tasks by phase with effort hours",
    regionLabel: "Task table, scrolls sideways on small screens",
    task: "Task",
    role: "Role",
    hours: "Hours",
    subtotal: "Subtotal",
    total: "Total",
  },
  assumptionsHeading: "Assumptions",
  risksHeading: "Risks",
  questionsHeading: "Questions to confirm",
  outOfScopeHeading: "Not included",
  calendarAdjusted: (n: number) => `Calendar stretched to fit a team of ${n} at about 6 productive hours a day.`,
  waitLabel: (time: string) => `Try again in ${time}`,
  retry: "Try again",
  retryWaiting: "Waiting for human check…",
  actions: {
    label: "Plan actions",
    copy: "Copy plan",
    copied: "Copied",
    copyFailed: "Couldn't copy. Select the text and copy it instead.",
    print: "Print or save as PDF",
    team: "Team",
    totals: (hours: number, weeks: number) => `Total: ${hours} hours, ${weeks} weeks`,
    days: (a: number, b: number) => `days ${a}–${b}`,
    footer: (name: string) => `Estimated with ${new URL(siteUrl).host}, built by ${name}`,
  },
  footerNote: "Estimates are generated by Claude for illustration. Real plans need a real team's input.",
  networkError: "Couldn't reach the server. Check your connection and try again.",
  badPlan: "The plan that came back was incomplete. Try again.",
  /** Used when the response body is missing or not JSON (e.g. an HTML 504 from the platform). */
  fallback: {
    400: "Check the description and try again.",
    403: "The human check failed. Wait for it to refresh, then try again.",
    422: "That doesn't look like a software feature. Describe something a team could build.",
    429: "Too many estimates for now. Try again shortly.",
    502: "The estimator hit a problem. Try again.",
    503: "The estimator isn't set up on this server yet.",
    504: "The estimator took too long to answer. Try again.",
    other: "Something went wrong. Try again.",
  } as Record<number | "other", string>,
};
