import { expect, test } from "@playwright/test";
import { profile } from "@/lib/content";

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
