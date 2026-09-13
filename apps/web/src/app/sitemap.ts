import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { absoluteSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/rules", "/si/rules", "/showcase", "/announcements", "/privacy"].map((path) => ({
    url: absoluteSiteUrl(path),
    ...(["/rules", "/si/rules"].includes(path) ? {
      alternates: { languages: { en: absoluteSiteUrl("/rules"), si: absoluteSiteUrl("/si/rules") } },
    } : {}),
  }));

  const announcements = await content.getAnnouncements();
  const announcementRoutes = announcements.map((announcement) => ({
    url: absoluteSiteUrl(`/announcements/${announcement.slug}`),
    lastModified: new Date(announcement.publishedAt),
  }));

  return [...staticRoutes, ...announcementRoutes];
}
