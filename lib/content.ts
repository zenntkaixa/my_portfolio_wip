// All site copy lives here, so updating the portfolio never means touching layout code.

export const profile = {
  name: "Izzat Fahmi",
  fullName: "Mohamad Izzat Fahmi bin Suhaimi",
  initials: "IF",
  role: "Full-stack software engineer",
  headline:
    "Backend-first engineer. Eight years building the systems insurers and banks run on, now shipping them with AI coding agents.",
  summary:
    "Java, Spring Boot and REST APIs on the backend, React and TypeScript on the front. I stay accountable for every line that merges.",
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
  ogTagline: "Live AI demo: describe a feature, get a delivery plan",
  ogAlt: "Izzat Fahmi, full-stack software engineer. Live AI demo: describe a feature, get a delivery plan.",
};

export const skipLink = "Skip to the estimator";

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
    stack: ["React", "TypeScript", "Jutro", "REST APIs"],
  },
  {
    title: "OCR in insurance onboarding",
    context: "Regional life insurer, digital platform",
    body: "Built Spring Boot REST APIs that bring OCR results into insurance workflows, added anti-money-laundering checks, and kept quality gates green with unit tests, SonarQube and Jenkins on Azure.",
    stack: ["Java", "Spring Boot", "Azure", "SonarQube"],
  },
  {
    title: "Modernising a banking platform",
    context: "Regional bank, digital banking",
    body: "Helped move a monolithic Java codebase toward microservices, including data synchronisation between old and new services, and supported releases on GitLab, Jenkins and OpenShift.",
    stack: ["Java", "Spring Boot", "OpenShift", "PostgreSQL"],
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

export const certifications = [
  { name: "AWS Certified Solutions Architect, Associate", year: "2025" },
  { name: "Guidewire InsuranceSuite Developer, Associate", year: "2026" },
  { name: "Guidewire Jutro Developer, Associate", year: "" },
  { name: "Anthropic Claude Code 101", year: "2026" },
];

export const education = "BSc Computer Science (Software Engineering), Universiti Tun Hussein Onn Malaysia";

export const turnstileFailedMessage =
  "The human check couldn't load. Disable content blockers for this site or refresh the page.";
export const turnstileNotConfiguredNote =
  "Human check not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY (see .env.example).";

/** Three are shown at random on each page load. The first one is also the stored example plan's feature. */
export const estimatorExamples = [
  // Insurance and billing
  "Let policyholders log in with a one-time code sent by SMS",
  "Customers upload claim photos and OCR fills in the claim form",
  "Email each customer a monthly PDF billing statement",
  "Customers pay their premium online with FPX or a debit card",
  "Customers track their claim status step by step on a mobile page",
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
  "Users set a monthly budget and get warned before they overspend",
  "Sell event tickets with a QR code that is scanned at the door",
  "Factory machines send sensor readings and warn before a part fails",
  "Gym members book a class and join a waitlist when it is full",
  "Send a WhatsApp reminder three days before a payment is due",
  "A chatbot answers common customer questions and hands off to a human",
  // Common building blocks
  "Admins manage user roles, with an audit log of every change",
  "Export any report table to Excel with the current filters applied",
  "Let users switch the app between English and Bahasa Malaysia",
  "A public status page shows outages and planned maintenance",
  // Fun projects
  "Friends split a group trip's costs and see who owes whom",
  "Spin a wheel of nearby restaurants when friends can't decide where to eat",
  "A daily word puzzle with a leaderboard for a group of friends",
  "Match people with shelter pets based on their home and lifestyle",
  "A plant-watering reminder app with a photo diary for each plant",
  "Turn a family's handwritten recipes into a searchable cookbook",
  "A karaoke night queue where guests add songs from their phones",
  "Book a badminton court and split the fee between the players",
  "A running club leaderboard of each member's weekly distance",
  "Plan a Raya open house with a guest list, RSVPs and a food sign-up",
];

export const estimatorCopy = {
  tabsLabel: "Plan views",
  tabPhases: "Phases and timeline",
  tabTasks: "Task table",
  submit: "Estimate this feature",
  modelNote: "Uses Claude Haiku for a fast answer in about 10 seconds. Treat the plan as a starting point, not a quote.",
  example: {
    button: "See an example plan",
    note: (feature: string) => `Example plan for: ${feature}. Describe your own feature above for a live estimate.`,
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
      confidence: "How much of the plan rests on guesses: high means few, low means many",
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
