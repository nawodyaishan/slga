import { test, expect } from "@playwright/test";
import { createPageMetadata, socialImage } from "../../apps/web/src/lib/site";

test("production metadata has canonical, article date and uploaded image priority", () => {
  const previous = { ...process.env };
  try {
    Object.assign(process.env, { NODE_ENV: "production", VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://example.org" });
    const metadata = createPageMetadata({
      title: "Server launch", description: "Join our community", path: "/announcements/launch",
      type: "article", publishedTime: "2026-09-13T10:00:00Z",
      image: { src: "https://cdn.sanity.io/images/test/production/cover.jpg?w=1600&h=900&rect=10,20,800,600", alt: "Community launch" },
      fallbackImage: { src: "/fallback.jpg", alt: "SLGA" },
    });
    expect(metadata.alternates?.canonical).toBe("https://example.org/announcements/launch");
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ type: "article", publishedTime: "2026-09-13T10:00:00Z", images: [{ width: 1200, height: 630, alt: "Community launch" }] });
    const image = socialImage({ src: "https://cdn.sanity.io/images/test/production/cover.jpg?rect=10,20,800,600", alt: "Cover" });
    const url = new URL(image!.url);
    expect(url.searchParams.get("w")).toBe("1200");
    expect(url.searchParams.get("h")).toBe("630");
    expect(url.searchParams.get("fit")).toBe("crop");
    expect(url.searchParams.get("rect")).toBe("10,20,800,600");
    expect(JSON.stringify(metadata.openGraph)).not.toContain("fallback.jpg");
  } finally { process.env = previous; }
});

test("preview is noindex without canonical and uses fallback image", () => {
  const previous = { ...process.env };
  try {
    Object.assign(process.env, { NODE_ENV: "production", VERCEL_ENV: "preview", NEXT_PUBLIC_SITE_URL: "https://example.org" });
    const metadata = createPageMetadata({ title: "Showcase", description: "Community art", path: "/showcase", fallbackImage: { src: "/fallback.jpg", alt: "SLGA" } });
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.robots).toEqual({ index: false, follow: false, noarchive: true });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: "https://example.org/fallback.jpg", alt: "SLGA" }] });
    expect(createPageMetadata({ title: "Privacy", description: "Privacy", path: "/privacy" }).twitter).toMatchObject({ card: "summary", images: undefined });
  } finally { process.env = previous; }
});

test("rendered article sharing metadata agrees with structured data", async ({ page }) => {
  await page.goto("/announcements");
  await page.locator('a[href^="/announcements/"]').first().click();
  const article = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", article.datePublished);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", article.headline);
  expect(article.publisher.name).toBeTruthy();
});
