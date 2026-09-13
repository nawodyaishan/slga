"use client";

import type { ReactNode } from "react";
import { TrackedLink } from "@/components/ui";
import { track } from "@/lib/analytics";

interface CommunityCtaLinkProps {
  destination: "facebook" | "discord";
  placement: "header" | "hero" | "footer";
  url: string;
  className?: string;
  children: ReactNode;
}

/**
 * Every outbound Discord/Facebook button on the page routes through here so
 * the three approved `community_cta_click` placements (TECH-SPEC.md §15) are
 * the only ones that can ever be sent — see `lib/analytics.ts`.
 */
export function CommunityCtaLink({ destination, placement, url, className, children }: CommunityCtaLinkProps) {
  return (
    <TrackedLink href={url} className={className} onOpen={() => track("community_cta_click", { destination, placement })}>
      {children}
    </TrackedLink>
  );
}
