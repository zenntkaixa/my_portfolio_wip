import { expect, test, type Page } from "@playwright/test";
import { now, profile } from "@/lib/content";

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
