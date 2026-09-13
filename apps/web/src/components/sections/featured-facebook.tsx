"use client";

import { Container } from "@/components/ui";
import { TrackedLink } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { FacebookFeature } from "@/lib/content/types";

interface FeaturedFacebookProps {
  features: readonly FacebookFeature[];
}

/** Hidden entirely when the group has no featured posts selected. */
export function FeaturedFacebook({ features }: FeaturedFacebookProps) {
  return (
    <section aria-labelledby="slga-featured-h" className="border-b border-border">
      <Container className="py-(--spacing-section)">
        <p className="mb-4 flex items-center gap-3 font-mono text-label-lg font-medium tracking-[0.16em] text-muted">
          <span className="text-accent">03</span>
          FROM OUR COMMUNITY
        </p>
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3.5">
          <h2 id="slga-featured-h" className="m-0 text-h2 leading-[1.1] font-bold tracking-[-0.03em]">
            Featured from the group
          </h2>
          <p className="m-0 max-w-[42ch] text-[13.5px] text-muted">
            Hand-picked posts from the Facebook group. Selected by admins, not an automatic feed.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4.5">
          {features.map((feature) => (
            <TrackedLink
              key={feature.id}
              href={feature.postUrl}
              onOpen={() => track("facebook_feature_click", { feature_id: feature.id, placement: "homepage" })}
              className="flex flex-col overflow-hidden rounded-[14px] border border-border bg-surface text-foreground hover:border-accent"
            >
              <div className="grid aspect-[16/10] place-items-center border-b border-border [background:repeating-linear-gradient(135deg,#151C2A_0_11px,#101724_11px_22px)]">
                <p className="m-0 px-4 py-4 text-center font-mono text-[10px] leading-[1.7] tracking-[0.1em] text-dim">
                  {feature.image.placeholder ?? feature.image.alt}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-5.5">
                <p className="m-0 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-muted">
                  <span aria-hidden="true" className="grid size-4 place-items-center rounded border border-border font-sans text-[10px] font-bold text-body">
                    f
                  </span>
                  FACEBOOK POST
                </p>
                <h3 className="m-0 text-[17.5px] leading-[1.3] font-semibold tracking-[-0.02em]">{feature.title}</h3>
                <p className="m-0 flex-1 text-[14.5px] leading-[1.6] text-muted">{feature.excerpt}</p>
                <span className="flex min-h-6 items-center gap-2 text-sm font-semibold text-accent">
                  View on Facebook
                  <span aria-hidden="true">↗</span>
                </span>
              </div>
            </TrackedLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
