import { expect, test, type Page } from "@playwright/test";
import {
  aiWorkflow,
  caseStudies,
  certifications,
  education,
  experience,
  featuredProject,
  now,
  profile,
  stack,
} from "@/lib/content";

test("home page renders every tile", async ({ page }) => {
  await page.goto("/");
  // Exact names, so "Izzat Fahmi" cannot match some other region whose name merely contains it.
  for (const name of [
    profile.name,
    "Right now",
    "Try it: feature to delivery plan",
    "Featured project: radiozk",
    "How I build with AI agents",
    "Experience",
    "Stack",
    "Certifications",
    "Let's talk",
  ]) {
    await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
  }
  // Case-study tiles are named by their title; iterating the data keeps this in sync with content.
  for (const study of caseStudies) {
    await expect(page.getByRole("region", { name: study.title, exact: true })).toBeVisible();
  }
});

test("hero owns the page's only h1 and shows role, location and availability", async ({ page }) => {
  await page.goto("/");
  const hero = page.getByRole("region", { name: profile.name, exact: true });

  // Exactly one h1 on the page, it is the name, and it lives inside the hero.
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(profile.name);
  await expect(hero.getByRole("heading", { level: 1, name: profile.name, exact: true })).toBeVisible();

  await expect(hero.getByText(profile.role, { exact: true })).toBeVisible();
  await expect(hero.getByText(profile.location, { exact: true })).toBeVisible();
  await expect(hero.getByText(profile.availability, { exact: true })).toBeVisible();

  // The initials avatar is decorative: visible on screen, absent from the accessibility tree.
  const initials = hero.getByText(profile.initials, { exact: true });
  await expect(initials).toBeVisible();
  await expect(initials).toHaveAttribute("aria-hidden", "true");
  const snapshot = await hero.ariaSnapshot();
  expect(snapshot).not.toMatch(new RegExp(`\\b${profile.initials}\\b`));
});

test("never shows a phone number", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/\+?60\s?1\d[\s-]?\d{3,4}[\s-]?\d{4}/);
});

test("theme toggle switches and remembers", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: "Dark theme" });
  // aria-pressed only appears after hydration, so this also waits for React.
  await expect(toggle).toHaveAttribute("aria-pressed", /^(true|false)$/);
  const before = (await html.getAttribute("data-theme")) === "dark" ? "dark" : "light";
  const after = before === "dark" ? "light" : "dark";

  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", after);
  await expect(toggle).toHaveAttribute("aria-pressed", String(after === "dark"));
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(after);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", after);
  await expect(toggle).toHaveAttribute("aria-pressed", String(after === "dark"));
});

test.describe("now tile", () => {
  const region = (page: Page) =>
    page.getByRole("region", { name: "Right now", exact: true });

  test("shows the current role, org and detail", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    await expect(tile.getByText(now.title, { exact: true })).toBeVisible();
    await expect(tile.getByText(now.org, { exact: true })).toBeVisible();
    await expect(tile.getByText(now.detail, { exact: true })).toBeVisible();
  });

  test("stats pair each label with its value, label first in the DOM", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    // dl has no implicit ARIA role, so the list itself is found by tag; its contents by role.
    const groups = tile.locator("dl > div");
    await expect(groups).toHaveCount(now.stats.length);
    await expect(tile.getByRole("term")).toHaveText(now.stats.map((s) => s.label));
    await expect(tile.getByRole("definition")).toHaveText(now.stats.map((s) => s.value));

    for (const [i, stat] of now.stats.entries()) {
      const group = groups.nth(i);
      // Screen readers follow DOM order: exactly one dt then one dd per group.
      const tags = await group.evaluate((el) => Array.from(el.children, (c) => c.tagName));
      expect(tags).toEqual(["DT", "DD"]);
      await expect(group.getByRole("term")).toHaveText(stat.label);
      await expect(group.getByRole("definition")).toHaveText(stat.value);
    }
  });
});

test.describe("featured project tile", () => {
  const region = (page: Page) =>
    page.getByRole("region", { name: `Featured project: ${featuredProject.name}`, exact: true });

  test("shows the tagline, description and each highlight", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    await expect(tile.getByText(featuredProject.tagline, { exact: true })).toBeVisible();
    await expect(tile.getByText(featuredProject.description, { exact: true })).toBeVisible();
    for (const highlight of featuredProject.highlights) {
      await expect(tile.getByText(highlight, { exact: true })).toBeVisible();
    }
  });

  test("tech stack list has exactly the stack items, in order", async ({ page }) => {
    await page.goto("/");
    const stack = region(page).getByRole("list", { name: "Tech stack", exact: true });
    await expect(stack).toBeVisible();
    await expect(stack.getByRole("listitem")).toHaveText(featuredProject.stack);
  });

  test("GitHub link points at the repo and opens safely in a new tab", async ({ page }) => {
    await page.goto("/");
    const link = region(page).getByRole("link", {
      name: "View code on GitHub (opens in a new tab)",
      exact: true,
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", featuredProject.repo);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
  });

  test("live demo link appears only when a live URL is set", async ({ page }) => {
    await page.goto("/");
    const link = region(page).getByRole("link", { name: /Live demo/ });
    if (!featuredProject.live) {
      await expect(link).toHaveCount(0);
      return;
    }
    await expect(link).toHaveCount(1);
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", featuredProject.live);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
  });
});

test.describe("ai workflow tile", () => {
  const region = (page: Page) =>
    page.getByRole("region", { name: "How I build with AI agents", exact: true });

  test("is one ordered list of the steps in content order, name in strong", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    // Role "list" covers both ol and ul, so the ordered-ness is checked by tag.
    const lists = tile.getByRole("list");
    await expect(lists).toHaveCount(1);
    expect(await lists.evaluate((el) => el.tagName)).toBe("OL");

    // Exact text also proves there is no hand-typed number (numbering comes from the <ol>) and
    // that the hidden ":" separates the step name from its sentence for screen readers.
    const items = lists.getByRole("listitem");
    await expect(items).toHaveCount(aiWorkflow.length);
    await expect(items).toHaveText(aiWorkflow.map((s) => `${s.step}: ${s.text}`));

    for (const [i, s] of aiWorkflow.entries()) {
      const strong = items.nth(i).locator("strong");
      await expect(strong).toHaveCount(1);
      await expect(strong).toHaveText(s.step);
    }
  });
});

test.describe("case study tiles", () => {
  test("one region per case study, each with its context, body and stack in order", async ({ page }) => {
    await page.goto("/");

    // Every title names exactly one region, and no case study is missing or duplicated.
    const titles = caseStudies.map((s) => s.title);
    expect(new Set(titles).size).toBe(caseStudies.length);
    const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const anyTitle = new RegExp(`^(?:${titles.map(escape).join("|")})$`);
    await expect(page.getByRole("region", { name: anyTitle })).toHaveCount(caseStudies.length);

    for (const study of caseStudies) {
      const tile = page.getByRole("region", { name: study.title, exact: true });
      await expect(tile).toHaveCount(1);
      await expect(tile).toBeVisible();
      await expect(tile.getByText(study.context, { exact: true })).toBeVisible();
      await expect(tile.getByText(study.body, { exact: true })).toBeVisible();

      const stack = tile.getByRole("list", { name: "Tech stack", exact: true });
      await expect(stack).toHaveCount(1);
      await expect(stack).toBeVisible();
      await expect(stack.getByRole("listitem")).toHaveText(study.stack);
    }
  });
});

test.describe("experience tile", () => {
  const region = (page: Page) => page.getByRole("region", { name: "Experience", exact: true });

  test("timeline lists every role in content order as period, org, role", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    const timeline = tile.getByRole("list");
    await expect(timeline).toHaveCount(1);
    // Exact text proves the hidden ", " separators sit between the parts, in this order.
    await expect(timeline.getByRole("listitem")).toHaveText(
      experience.map((e) => `${e.period}, ${e.org}, ${e.role}`),
    );
  });

  test("has an Education h3 followed by the education entry", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    await expect(tile.getByRole("heading", { level: 3, name: "Education", exact: true })).toBeVisible();
    await expect(tile.getByText(education, { exact: true })).toBeVisible();
  });
});

test.describe("stack tile", () => {
  const region = (page: Page) => page.getByRole("region", { name: "Stack", exact: true });

  test("each group is an h3 naming its chips list, items in content order", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    await expect(tile.getByRole("heading", { level: 3 })).toHaveText(stack.map((g) => g.group));
    await expect(tile.getByRole("list")).toHaveCount(stack.length);

    for (const g of stack) {
      await expect(tile.getByRole("heading", { level: 3, name: g.group, exact: true })).toBeVisible();
      // The list's accessible name comes from aria-labelledby pointing at the heading.
      const list = tile.getByRole("list", { name: g.group, exact: true });
      await expect(list).toHaveCount(1);
      await expect(list).toBeVisible();
      await expect(list.getByRole("listitem")).toHaveText(g.items);
    }
  });
});

test.describe("certifications tile", () => {
  const region = (page: Page) => page.getByRole("region", { name: "Certifications", exact: true });

  test("lists certifications in content order; an empty year leaves no year or separator", async ({ page }) => {
    await page.goto("/");
    const items = region(page).getByRole("list").getByRole("listitem");
    // Exact text: "name, year" when there is a year, just "name" (no trailing ", ") when not.
    await expect(items).toHaveText(
      certifications.map((c) => (c.year ? `${c.name}, ${c.year}` : c.name)),
    );
  });
});

test.describe("contact tile", () => {
  const region = (page: Page) => page.getByRole("region", { name: "Let's talk", exact: true });

  test("shows the contact note and an email link with an exact mailto href", async ({ page }) => {
    await page.goto("/");
    const tile = region(page);
    await expect(tile.getByText(profile.contactNote)).toBeVisible();
    const email = tile.getByRole("link", { name: profile.email, exact: true });
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  for (const [label, key] of [
    ["LinkedIn", "linkedin"],
    ["GitHub", "github"],
  ] as const) {
    test(`${label} link opens safely in a new tab`, async ({ page }) => {
      await page.goto("/");
      const link = region(page).getByRole("link", {
        name: `${label} (opens in a new tab)`,
        exact: true,
      });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", profile[key]);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
      await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
    });
  }
});

test.describe("list semantics", () => {
  test("every unstyled ul/ol keeps role=list (Safari drops it otherwise)", async ({ page }) => {
    await page.goto("/");
    const offenders = await page.evaluate(() =>
      Array.from(document.querySelectorAll("ul, ol"))
        .filter((el) => getComputedStyle(el).listStyleType === "none")
        .filter((el) => el.getAttribute("role") !== "list")
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
    );
    expect(offenders).toEqual([]);
  });
});
