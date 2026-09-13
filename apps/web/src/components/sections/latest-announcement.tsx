"use client";

import Link from "next/link";
import { Container, Badge, SectionHeading } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Announcement } from "@/lib/content/types";
import { formatShortDate } from "@/lib/date";

interface LatestAnnouncementProps {
  announcement: Announcement;
}

/** Hidden entirely when there are no announcements - never renders an empty-state card. */
export function LatestAnnouncement({ announcement }: LatestAnnouncementProps) {
  return (
    <section aria-labelledby="slga-latest-h" className="border-b border-border">
      <Container className="py-(--spacing-section)">
        <div className="mb-7.5 flex flex-wrap items-baseline justify-between gap-3.5">
          <SectionHeading number="02" label="LATEST ANNOUNCEMENT" id="slga-latest-h" heading="Official communication" />
          <Link href="/announcements" className="flex min-h-11 items-center gap-2 text-[14.5px] font-medium">
            All announcements
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Link
          href={`/announcements/${announcement.slug}`}
          onClick={() => track("announcement_open", { slug: announcement.slug, placement: "homepage" })}
          className="flex flex-wrap overflow-hidden rounded-2xl border border-border bg-surface text-foreground hover:border-accent"
        >
          {announcement.coverImage && (
            <div className="relative min-h-[230px] flex-[1_1_300px] overflow-hidden">
              <img
                src={announcement.coverImage.src}
                alt={announcement.coverImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: announcement.coverImage.focalPoint }}
              />
            </div>
          )}
          <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-4 p-(--spacing-card)">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{announcement.kind}</Badge>
              <time dateTime={announcement.publishedAt} className="font-mono text-[11px] tracking-[0.06em] text-muted">
                {formatShortDate(announcement.publishedAt)}
              </time>
            </div>
            <h3 className="m-0 max-w-[28ch] text-h3 leading-[1.15] font-bold tracking-[-0.025em]">{announcement.title}</h3>
            <p className="m-0 max-w-[60ch] text-[15.5px] leading-[1.62] text-muted">{announcement.excerpt}</p>
            <span className="flex items-center gap-2.5 text-[15px] font-semibold text-accent">
              Read announcement
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </Container>
    </section>
  );
}
