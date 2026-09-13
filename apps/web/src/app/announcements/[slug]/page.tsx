import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui";
import { announcementPortableTextComponents } from "@/components/portable-text/announcement-portable-text";
import { CommunityCtaLink } from "@/components/sections/community-cta-link";
import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";

interface AnnouncementDetailPageProps {
  params: Promise<{ slug: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export async function generateMetadata({ params }: AnnouncementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await content.getAnnouncementBySlug(slug);
  if (!announcement) return { title: "Announcement not found" };

  return {
    title: announcement.title,
    description: announcement.excerpt,
    openGraph: {
      title: announcement.title,
      description: announcement.excerpt,
      images: announcement.coverImage ? [{ url: announcement.coverImage.src }] : undefined,
    },
  };
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const { slug } = await params;
  const [announcement, settings] = await Promise.all([
    content.getAnnouncementBySlug(slug),
    content.getSiteSettings(),
  ]);

  if (!announcement) notFound();

  const discordUrl = requireSocialUrl(settings.social, "discord");

  return (
    <article>
      <Container className="pt-(--spacing-page-top)">
        <nav aria-label="Breadcrumb">
          <ol className="m-0 mb-8.5 flex list-none flex-wrap items-center gap-2 p-0 font-mono text-[11px] tracking-[0.08em] text-dim">
            <li>
              <Link href="/" className="text-muted">
                HOME
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/announcements" className="text-muted">
                ANNOUNCEMENTS
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-accent">
              {announcement.kind}
            </li>
          </ol>
        </nav>
        <div className="max-w-[72ch]">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-accent">
              {announcement.kind}
            </span>
            <time dateTime={announcement.publishedAt} className="font-mono text-[11.5px] tracking-[0.06em] text-muted">
              {dateFormatter.format(new Date(announcement.publishedAt))}
            </time>
          </div>
          <h1 className="m-0 text-h1-page leading-[1.06] font-extrabold tracking-[-0.03em]">{announcement.title}</h1>
          <p className="mt-5.5 text-lead leading-[1.68] text-muted">{announcement.excerpt}</p>
        </div>
      </Container>

      {announcement.coverImage && (
        <Container className="pt-(--spacing-section)">
          <div className="relative grid aspect-[16/7] place-items-center overflow-hidden rounded-2xl border border-border [background:repeating-linear-gradient(135deg,#151C2A_0_11px,#101724_11px_22px)]">
            {announcement.coverImage.src ? (
              <img
                src={announcement.coverImage.src}
                alt={announcement.coverImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </div>
        </Container>
      )}

      <Container className="py-(--spacing-section)">
        <div className="flex max-w-[72ch] flex-col gap-5">
          <PortableText value={announcement.body} components={announcementPortableTextComponents} />
        </div>
        <div className="mt-12 flex max-w-[72ch] flex-wrap items-center justify-between gap-3.5 border-t border-border pt-7">
          <Link href="/announcements" className="flex min-h-11 items-center gap-2.5 text-[15px] font-semibold">
            <span aria-hidden="true">←</span>
            All announcements
          </Link>
          <CommunityCtaLink
            destination="discord"
            placement="footer"
            url={discordUrl}
            className="flex min-h-12 items-center gap-2.5 rounded-[10px] border border-border bg-surface px-5.5 font-sans text-[15px] font-medium text-foreground"
          >
            Join Discord
            <span aria-hidden="true" className="font-mono text-xs text-muted">
              ↗
            </span>
          </CommunityCtaLink>
        </div>
      </Container>
    </article>
  );
}
