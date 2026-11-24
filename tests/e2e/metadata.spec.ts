import { expect, test } from "@playwright/test";
import { notFound, profile, seo, siteUrl } from "@/lib/content";

// Escape the dots so the canonical match is exact; an optional trailing slash is fine.
const siteUrlPattern = new RegExp(`^${siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`);

// In dev, Next resolves file-based image URLs against localhost; production uses siteUrl (https).
test("home head carries Open Graph, Twitter and canonical metadata", async ({ page }) => {
  await page.goto("/");
  const meta = (attr: "property" | "name", key: string) =>
    page.locator(`head meta[${attr}="${key}"]`).first().getAttribute("content");

  expect(await meta("property", "og:title")).toContain(profile.name);
  expect(await meta("property", "profile:first_name")).toBe(profile.firstName);
  expect(await meta("property", "profile:last_name")).toBe(profile.lastName);
  expect(await meta("property", "og:description")).toBe(seo.description);
  expect(await meta("property", "og:url")).toMatch(siteUrlPattern);
  expect(await meta("name", "twitter:card")).toBe("summary_large_image");
  expect(await meta("name", "twitter:image")).toMatch(/^https?:\/\//);
  const ogImage = await meta("property", "og:image");
  expect(ogImage).toMatch(/^https?:\/\//);
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute("href", siteUrlPattern);
});

test("og image, icon and apple icon are served as PNG", async ({ page, request }) => {
  await page.goto("/");
  const ogImage = await page.locator('head meta[property="og:image"]').first().getAttribute("content");
  const paths = [new URL(ogImage ?? "").pathname, "/icon", "/apple-icon"];
  for (const path of paths) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toContain("image/png");
  }
});

test("local page does not load the Vercel analytics script", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('script[src*="/_vercel/insights"]')).toHaveCount(0);
});

test("robots.txt and sitemap.xml are served and point at the site", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toContain("Allow: /");
  expect(text).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain(`<loc>${siteUrl}</loc>`);
  expect(xml).toContain(`<loc>${siteUrl}${profile.cv.href}</loc>`);
});

test("unknown paths get the branded 404 with a link home and noindex", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: notFound.title })).toBeVisible();
  const robots = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content")));
  expect(robots.length).toBeGreaterThan(0);
  for (const content of robots) expect(content).toMatch(/noindex/);
  await page.getByRole("link", { name: notFound.homeCta }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: profile.name })).toBeVisible();
});
