import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const expectedSocialUrls = {
  discord: "https://discord.com/invite/kHyyWcftg",
  facebook: "https://www.facebook.com/groups/slgaofficial",
} as const;

test("homepage exposes its primary journeys and structured data", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Home for");
  await expect(page.getByRole("link", { name: /Join Discord/ }).first()).toHaveAttribute(
    "href",
    expectedSocialUrls.discord,
  );
  await expect(page.getByRole("link", { name: /Join Facebook Community/ }).first()).toHaveAttribute(
    "href",
    expectedSocialUrls.facebook,
  );

  const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
  expect(structuredData).toContain('"@type":"Organization"');
  expect(structuredData).toContain('"@type":"WebSite"');
});

test("primary navigation reaches every public section", async ({ page }) => {
  await page.goto("/");

  for (const [name, path] of [
    ["Rules", "/rules"],
    ["Showcase", "/showcase"],
    ["Announcements", "/announcements"],
  ] as const) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
  }
});

test("rules are ordered and localized without English fallback", async ({ page }) => {
  await page.goto("/rules");
  await expect(page.locator('article[id^="rule-"]')).toHaveCount(10);
  await expect(page.locator("#rule-1")).toContainText("Allowed Gaming Platforms");

  await page.goto("/si/rules");
  await expect(page.locator('article[id^="rule-"]')).toHaveCount(10);
  await expect(page.locator("#rule-1 h2")).toHaveAttribute("lang", "si");
  await expect(page.locator("#rule-1")).toContainText("අනුමත වීඩියෝ ක්‍රීඩා මාධ්‍යයන්");
});

test("announcements link to a dated detail page with Article data", async ({ page }) => {
  await page.goto("/announcements");
  const detailLink = page.getByRole("link", { name: /SLGA Discord is now open/ });
  await expect(detailLink).toHaveAttribute("href", "/announcements/slga-discord-is-now-open");
  await detailLink.click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SLGA Discord is now open");
  await expect(page.locator("time").first()).toHaveAttribute("datetime", "2026-09-08T00:00:00.000Z");
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('"@type":"Article"');
});

test("unknown announcement returns the branded 404", async ({ page }) => {
  const response = await page.goto("/announcements/not-a-real-announcement");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This page is off the map");
});

test("mobile menu supports focus entry, Escape, and focus restoration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("development responses are non-indexable and carry security headers", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["permissions-policy"]).toContain("camera=()");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("sitemap includes every static route, including showcase", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();

  const sitemap = await response.text();
  for (const path of ["/rules", "/si/rules", "/showcase", "/announcements", "/privacy"]) {
    expect(sitemap).toContain(`<loc>http://127.0.0.1:3100${path}</loc>`);
  }
});

for (const path of [
  "/",
  "/rules",
  "/si/rules",
  "/showcase",
  "/announcements",
  "/announcements/slga-discord-is-now-open",
  "/privacy",
]) {
  test(`${path} has no serious automated accessibility violations`, async ({ page }) => {
    await page.goto(path);
    // Audit the stable page rather than intermediate opacity values from the
    // short staggered entrance animation.
    await page.waitForTimeout(1_000);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.filter(({ impact }) => impact === "critical" || impact === "serious")).toEqual([]);
  });
}
