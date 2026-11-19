// All site copy lives here, so updating the portfolio never means touching layout code.

export const profile = {
  name: "Izzat Fahmi",
  fullName: "Mohamad Izzat Fahmi bin Suhaimi",
  initials: "IF",
  role: "Full-stack software engineer",
  headline: "I build the systems insurers and banks run on.",
  // Approved by Izzat 2026-11-17 (M6). Employers and the certification only: the Now tile already shows the numbers.
  proof: ["Shipped at PwC · Allianz Technology · Hitachi", "AWS Certified Solutions Architect"],
  proofLabel: "Track record",
  summary:
    "Eight years of Java, Spring Boot and React, now shipped with AI coding agents. I stay accountable for every line that merges.",
  emailCta: "Email me",
  location: "Petaling Jaya, Malaysia",
  availability: "Open to senior full-stack roles in Malaysia",
  contactNote: "The fastest way to reach me is email.",
  email: "zenntkaixa@yahoo.com",
  linkedin: "https://www.linkedin.com/in/mohamad-izzat-fahmi-bin-suhaimi-00b047145",
  github: "https://github.com/zenntkaixa",
};

export const siteUrl = "https://zenntkaixa.dev";

export const seo = {
  siteName: "Izzat Fahmi, portfolio",
  /** Search and share description: fuller than the hero headline. */
  description:
    "Backend-first engineer. Eight years building the systems insurers and banks run on, now shipping them with AI coding agents.",
  ogTagline: "Live AI demo: describe a feature, get a delivery plan",
  ogAlt: "Izzat Fahmi, full-stack software engineer. Live AI demo: describe a feature, get a delivery plan.",
};

export const skipLink = "Skip to the estimator";

export const footer = {
  text: (year: number) => `© ${year} ${profile.name}. Built with Next.js and Claude.`,
};

export const now = {
  title: "Senior Associate, Full-Stack Developer",
  org: "PwC Acceleration Centers, Kuala Lumpur",
  detail: "Customer portal features for a US insurance program, with onshore teams across time zones.",
  stats: [
    { value: "8+", label: "years in production software" },
    { value: "100", label: "merged pull requests contributed to, Apr to Oct 2026" },
    { value: "13", label: "repositories touched in the same period" },
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
    title: "Customer portal for a US insurer",
    context: "Guidewire Digital Portal program",
    body: "Built React and TypeScript features on Guidewire Jutro, wired to REST, composite and batch APIs with role-based access. Resolved 32 failed release-branch merges and cleared UAT defects in the driver, vehicle and authorization flows to keep releases on schedule.",
    stack: ["React", "TypeScript", "Jutro"],
  },
  {
    title: "OCR in insurance onboarding",
    context: "Regional life insurer, digital platform",
    body: "Built Spring Boot REST APIs that bring OCR results into insurance workflows, added anti-money-laundering checks, and kept quality gates green with unit tests, SonarQube and Jenkins on Azure.",
    stack: ["Java", "Spring Boot", "Azure"],
  },
  {
    title: "Modernising a banking platform",
    context: "Regional bank, digital banking",
    body: "Helped move a monolithic Java codebase toward microservices, including data synchronisation between old and new services, and supported releases on GitLab, Jenkins and OpenShift.",
    stack: ["Java", "Spring Boot", "OpenShift"],
  },
];

export const experience = [
  { org: "PwC Acceleration Centers", role: "Senior Associate, Full-Stack Developer", period: "2025 to now" },
  { org: "Allianz Technology", role: "Life Core Developer", period: "2024 to 2025" },
  { org: "Beyondsoft Malaysia", role: "Java Developer", period: "2023 to 2024" },
  { org: "Hitachi Digital Host", role: "Application Engineer", period: "2020 to 2022" },
  { org: "Vetter Software", role: "Engineer, then QA Engineer", period: "2017 to 2020" },
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

export const education = "BSc Computer Science (Software Engineering), Universiti Tun Hussein Onn Malaysia";

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

export const estimatorCopy = {
  tabsLabel: "Plan views",
  tabPhases: "Phases and timeline",
  tabTasks: "Task table",
  tabBudget: "Budget",
  budget: {
    caption: "Estimated budget in Malaysian ringgit",
    regionLabel: "Budget table, scrolls sideways on small screens",
    item: "Item",
    cost: "Cost (MYR)",
    buildGroup: "Build",
    people: "People",
    peopleDetail: (hours: number, rate: number, seniority: string) =>
      `${hours} hours × RM ${rate} per hour (${seniority})`,
    seats: "AI agent seats",
    seatsDetail: (count: number, months: number, low: number, high: number) =>
      `${count} ${count === 1 ? "seat" : "seats"} × ${months} ${months === 1 ? "month" : "months"} × RM ${low}–${high}`,
    buildTotal: "Estimated build cost",
    monthlyGroup: "Running costs after launch",
    monthlyTotal: "Per month",
    none: "None listed",
    rateNote: (rates: Record<string, number>) =>
      `People cost uses assumed in-house rates in Malaysia, including EPF, SOCSO, EIS and overheads: ${Object.entries(rates)
        .map(([k, v]) => `${k} RM ${v}`)
        .join(", ")} per hour.`,
    note: "Tool and running costs are typical market ranges for planning only. Verify with vendors before you commit.",
  },
  submit: "Estimate this feature",
  briefChip: (title: string) => `Detailed brief: ${title}`,
  modelNote: "Uses Claude Haiku for a fast answer in about 10 seconds. Treat the plan as a starting point, not a quote.",
  example: {
    note: (feature: string) => `Example plan for: ${feature}. Describe your own feature in the form for a live estimate.`,
    footer: "This example was written by hand to show the format. Live estimates are generated by Claude.",
  },
  mode: {
    legend: "Working style",
    options: { traditional: "Traditional team", "ai-assisted": "With AI agents" },
    teamSuffix: ", with AI agents",
  },
  people: (n: number) => `${n} ${n === 1 ? "person" : "people"}`,
  atLeast: (min: number) => ` (at least ${min} characters)`,
  planning: "Planning phases…",
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
    weeksValue: (n: number) => `${n} ${n === 1 ? "week" : "weeks"}`,
  },
  timelineLabel: (days: number) => `Timeline, ${days} ${days === 1 ? "day" : "days"}`,
  duration: (n: number) => `${n} ${n === 1 ? "day" : "days"}`,
  taskCount: (n: number) => `${n} ${n === 1 ? "task" : "tasks"}`,
  tasks: {
    roleChipsLabel: "Hours by role",
    chip: (role: string, hours: number) => `${role} ${hours} h`,
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
  waitLabel: (time: string) => `Try again in ${time}`,
  retry: "Try again",
  retryWaiting: "Waiting for human check…",
  footerNote: "Estimates are generated by Claude for illustration. Real plans need a real team's input.",
  networkError: "Couldn't reach the server. Check your connection and try again.",
  badPlan: "The plan that came back was incomplete. Try again.",
  /** Used when the response body is missing or not JSON (e.g. an HTML 504 from the platform). */
  fallback: {
    400: "Check the description and try again.",
    403: "The human check failed. Wait for it to refresh, then try again.",
    422: "That doesn't look like a software feature. Describe something a team could build.",
    429: "Too many estimates for now. Please try again shortly.",
    502: "The estimator hit a problem. Try again.",
    503: "The estimator isn't set up on this server yet.",
    504: "The estimator took too long to answer. Try again.",
    other: "Something went wrong. Try again.",
  } as Record<number | "other", string>,
};
