import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { content } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";
import { formatShortDate } from "@/lib/date";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await content.getSiteSettings();
  return createPageMetadata({
    fallbackImage: settings.defaultOgImage,
    title: "Privacy notice",
    description: "How SLGA's website handles analytics and external links.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const privacy = await content.getPrivacyNotice();

  return (
    <Container className="pt-(--spacing-page-top) pb-(--spacing-section)">
      <div className="max-w-[72ch]">
        <Eyebrow bar className="mb-[22px]">
          PRIVACY &amp; ANALYTICS
        </Eyebrow>
        <h1 className="m-0 text-h1-page leading-[1.06] font-extrabold tracking-[-0.03em]">Privacy notice</h1>
        <p className="mt-5.5 text-lead leading-[1.7] text-body">{privacy.intro}</p>
        <p className="mt-3.5 font-mono text-[11px] tracking-[0.06em] text-muted">
          LAST REVIEWED{" "}
          <time dateTime={privacy.lastReviewed} className="text-foreground">
            {formatShortDate(privacy.lastReviewed)}
          </time>
        </p>
        <div className="mt-11 flex flex-col gap-8.5">
          {privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="m-0 mb-3.5 text-h3 leading-[1.2] font-bold tracking-[-0.025em]">{section.heading}</h2>
              <div className="flex flex-col gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="m-0 text-article leading-[1.75] text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
