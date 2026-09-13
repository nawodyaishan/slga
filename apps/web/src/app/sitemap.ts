import type { MetadataRoute } from "next";
import { content } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/rules", "/si/rules", "/announcements", "/privacy"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const announcements = await content.getAnnouncements();
  const announcementRoutes = announcements.map((announcement) => ({
    url: `${base}/announcements/${announcement.slug}`,
    lastModified: new Date(announcement.publishedAt),
  }));

  return [...staticRoutes, ...announcementRoutes];
}
