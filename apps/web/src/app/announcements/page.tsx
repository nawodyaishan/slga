import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { AnnouncementCard } from "@/components/sections/announcement-card";
import { content } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await content.getSiteSettings();
  return createPageMetadata({
  fallbackImage: settings.defaultOgImage,
  title: "Announcements",
  description: "Notices published by the SLGA admin team: rule changes, server news and community programmes.",
  path: "/announcements",
  });
}

export default async function AnnouncementsPage() {
  const announcements = await content.getAnnouncements();

  return (
    <div>
      <section className="border-b border-border">
        <Container className="pt-(--spacing-page-top) pb-(--spacing-section)">
          <Eyebrow bar className="mb-[22px]">
            OFFICIAL ANNOUNCEMENTS
          </Eyebrow>
          <h1 className="m-0 max-w-[22ch] text-h1-page leading-[1.04] font-extrabold tracking-[-0.03em]">
            Announcements
          </h1>
          <p className="mt-6 max-w-[62ch] text-lead leading-[1.7] text-muted">
            Notices published by the SLGA admin team: rule changes, server news and community programmes. Every
            announcement keeps a permanent link.
          </p>
        </Container>
      </section>
      <Container className="py-(--spacing-section)">
        {announcements.length === 0 ? (
          <p className="text-body text-muted">No announcements have been published yet.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-start gap-4.5">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
