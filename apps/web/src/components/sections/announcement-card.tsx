"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Announcement } from "@/lib/content/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <Link
      href={`/announcements/${announcement.slug}`}
      onClick={() => track("announcement_open", { slug: announcement.slug, placement: "index" })}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface text-foreground hover:border-accent"
    >
      {announcement.coverImage && (
        <div className="relative grid aspect-video place-items-center border-b border-border [background:repeating-linear-gradient(135deg,#151C2A_0_11px,#101724_11px_22px)]">
          {announcement.coverImage.src ? (
            <img
              src={announcement.coverImage.src}
              alt={announcement.coverImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone="neutral" dot={false}>
            {announcement.kind}
          </Badge>
          <time dateTime={announcement.publishedAt} className="font-mono text-[11px] tracking-[0.06em] text-muted">
            {dateFormatter.format(new Date(announcement.publishedAt))}
          </time>
        </div>
        <h2 className="m-0 text-[21px] leading-[1.24] font-bold tracking-[-0.025em]">{announcement.title}</h2>
        <p className="m-0 flex-1 text-[14.5px] leading-[1.62] text-muted">{announcement.excerpt}</p>
        <span className="flex min-h-6 items-center gap-2 text-[14.5px] font-semibold text-accent">
          Read announcement
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
