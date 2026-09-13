"use client";

import Link from "next/link";
import { Container, Badge, SectionHeading } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Announcement } from "@/lib/content/types";

interface LatestAnnouncementProps {
  announcement: Announcement;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

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
          <div className="grid min-h-[230px] flex-[1_1_300px] place-items-center [background:repeating-linear-gradient(135deg,#151C2A_0_11px,#101724_11px_22px)]">
            <p className="m-0 px-5 py-5 text-center font-mono text-[10.5px] leading-[1.7] tracking-[0.1em] text-muted">
              COVER IMAGE
              <br />
              <span className="text-dim">16:9 · OPTIONAL</span>
            </p>
          </div>
          <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-4 p-(--spacing-card)">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{announcement.kind}</Badge>
              <time dateTime={announcement.publishedAt} className="font-mono text-[11px] tracking-[0.06em] text-muted">
                {dateFormatter.format(new Date(announcement.publishedAt))}
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
