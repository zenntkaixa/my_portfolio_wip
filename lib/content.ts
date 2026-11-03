// All site copy lives here, so updating the portfolio never means touching layout code.

export const profile = {
  name: "Izzat Fahmi",
  fullName: "Mohamad Izzat Fahmi bin Suhaimi",
  initials: "IF",
  role: "Full-stack software engineer",
  headline:
    "Backend-first engineer. Eight years building the systems insurers and banks run on, now shipping them with AI coding agents.",
  summary:
    "I work across Java, Spring Boot and REST APIs on the backend and React with TypeScript on the front. Lately I orchestrate AI coding agents to turn requirements into reviewed, production-ready changes, and I stay accountable for every line that merges.",
  location: "Petaling Jaya, Malaysia",
  availability: "Open to senior full-stack roles in Malaysia",
  email: "zenntkaixa@yahoo.com",
  linkedin: "https://www.linkedin.com/in/mohamad-izzat-fahmi-bin-suhaimi-00b047145",
  github: "https://github.com/zenntkaixa",
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
  // Add the live Render URL here once you have it, e.g. "https://radiozk.onrender.com"
  live: "",
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
