import { expect, test } from "@playwright/test";
import { profile, siteUrl } from "@/lib/content";

// Escape the dots so the canonical match is exact; an optional trailing slash is fine.
const siteUrlPattern = new RegExp(`^${siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`);

// In dev, Next resolves file-based image URLs against localhost; production uses siteUrl (https).
test("home head carries Open Graph, Twitter and canonical metadata", async ({ page }) => {
  await page.goto("/");
  const meta = (attr: "property" | "name", key: string) =>
    page.locator(`head meta[${attr}="${key}"]`).first().getAttribute("content");

  expect(await meta("property", "og:title")).toContain(profile.name);
  expect(await meta("property", "og:description")).toBe(profile.headline);
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
