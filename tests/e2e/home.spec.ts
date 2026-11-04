import { expect, test } from "@playwright/test";

test("home page renders every tile", async ({ page }) => {
  await page.goto("/");
  for (const name of [
    "About Izzat Fahmi",
    "Right now",
    "Try it: feature to delivery plan",
    "Featured project: radiozk",
    "How I build with AI agents",
    "Experience",
    "Stack",
    "Certifications",
    "Let's talk",
  ]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }
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
