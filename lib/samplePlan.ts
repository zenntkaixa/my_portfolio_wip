import type { Scope } from "@/lib/estimate";
import { buildPlan } from "@/lib/estimateModel";
import type { Team } from "@/lib/budget";
import { estimatorExamples } from "@/lib/content";

// The example the estimator shows on load: shown without any request, so it costs no human check, no
// rate-limit slot and no model call. Written by hand to show the format (the page says so); a real
// reply for the same feature can replace it. tests/unit/samplePlan.test.ts keeps it a valid Scope.
export const sampleFeature = estimatorExamples[0];
export const sampleTeam: Team = { size: 4, seniority: "mixed", mode: "traditional" };

export const sampleScope: Scope = {
  "title": "SMS one-time code login",
  "summary": "Add passwordless login for policyholders using a one-time code sent by SMS, with rate limiting and audit logging.",
  "assumptions": [
    "An SMS gateway account already exists",
    "Existing customer accounts have verified mobile numbers"
  ],
  "phases": [
    {
      "name": "Discovery",
      "goal": "Agree flows, edge cases and security rules",
      "startDay": 0,
      "durationDays": 2,
      "tasks": [
        {
          "task": "Refine acceptance criteria",
          "role": "BA",
          "category": "discovery",
          "baseHours": 8
        },
        {
          "task": "Threat model the login flow",
          "role": "Architect",
          "category": "security",
          "baseHours": 6
        }
      ]
    },
    {
      "name": "Design",
      "goal": "API contracts and data model",
      "startDay": 2,
      "durationDays": 2,
      "tasks": [
        {
          "task": "OTP API contract",
          "role": "Architect",
          "category": "design",
          "baseHours": 6
        },
        {
          "task": "Login screen design",
          "role": "Frontend",
          "category": "design",
          "baseHours": 6
        }
      ]
    },
    {
      "name": "Build",
      "goal": "Implement backend and frontend",
      "startDay": 4,
      "durationDays": 6,
      "tasks": [
        {
          "task": "OTP generate and verify endpoints",
          "role": "Backend",
          "category": "code",
          "baseHours": 24
        },
        {
          "task": "SMS gateway integration",
          "role": "Backend",
          "category": "integration",
          "baseHours": 12
        },
        {
          "task": "Login and code entry screens",
          "role": "Frontend",
          "category": "code",
          "baseHours": 20
        }
      ]
    },
    {
      "name": "Testing",
      "goal": "Prove it works and is safe",
      "startDay": 8,
      "durationDays": 4,
      "tasks": [
        {
          "task": "API and e2e tests",
          "role": "QA",
          "category": "tests",
          "baseHours": 16
        },
        {
          "task": "UAT support",
          "role": "QA",
          "category": "uat",
          "baseHours": 8
        }
      ]
    },
    {
      "name": "Release",
      "goal": "Ship safely",
      "startDay": 12,
      "durationDays": 1,
      "tasks": [
        {
          "task": "Pipeline, config and monitoring",
          "role": "DevOps",
          "category": "release",
          "baseHours": 6
        }
      ]
    }
  ],
  "risks": [
    "SMS delivery delays in some regions",
    "Brute-force attempts on codes"
  ],
  // Policyholders and an SMS provider are stated; systems, data, limits and scope are not: medium.
  "facts": { "users": true, "systems": false, "data": false, "integrations": true, "limits": false, "outOfScope": false },
  "openQuestions": [
    "How long should a code stay valid, and how many wrong tries lock the account?",
    "Does password login stay available, or does SMS replace it?",
    "Which countries' mobile numbers must the SMS provider reach?"
  ],
  "outOfScope": [
    "Email or authenticator-app codes as a fallback",
    "Changing the mobile number on an account"
  ],
  "costs": [
    { "item": "SMS provider for one-time codes", "kind": "monthly", "low": 150, "high": 600 },
    { "item": "Redis cache for codes and rate limits", "kind": "monthly", "low": 50, "high": 250 },
    { "item": "Error monitoring and alerts", "kind": "monthly", "low": 0, "high": 200 },
    { "item": "Security review of the login flow", "kind": "one-off", "low": 3000, "high": 8000 }
  ]
};

/** Built the same way as a live reply: 112 hours over 13 days (2.6 weeks) for 4 people, mixed, traditional. */
export const samplePlan = buildPlan(sampleScope, { teamSize: sampleTeam.size, seniority: sampleTeam.seniority, mode: sampleTeam.mode });
