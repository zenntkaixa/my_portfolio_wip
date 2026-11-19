import type { Plan } from "@/lib/estimate";
import type { Team } from "@/lib/budget";
import { estimatorExamples } from "@/lib/content";

// The example the estimator shows on load: shown without any request, so it costs no human check, no
// rate-limit slot and no model call. Written by hand to show the format (the page says so); a real
// reply for the same feature can replace it. tests/unit/samplePlan.test.ts keeps it a valid Plan.
export const sampleFeature = estimatorExamples[0];
export const sampleTeam: Team = { size: 4, seniority: "mixed", mode: "traditional" };

export const samplePlan: Plan = {
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
          "hours": 8
        },
        {
          "task": "Threat model the login flow",
          "role": "Architect",
          "hours": 6
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
          "hours": 6
        },
        {
          "task": "Login screen design",
          "role": "Frontend",
          "hours": 6
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
          "hours": 24
        },
        {
          "task": "SMS gateway integration",
          "role": "Backend",
          "hours": 12
        },
        {
          "task": "Login and code entry screens",
          "role": "Frontend",
          "hours": 20
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
          "hours": 16
        },
        {
          "task": "UAT support",
          "role": "QA",
          "hours": 8
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
          "hours": 6
        }
      ]
    }
  ],
  "risks": [
    "SMS delivery delays in some regions",
    "Brute-force attempts on codes"
  ],
  "confidence": "medium",
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
  ],
  "totalHours": 112,
  "totalDays": 13,
  "calendarWeeks": 2.6
};
