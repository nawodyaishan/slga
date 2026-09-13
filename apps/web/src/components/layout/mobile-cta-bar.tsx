"use client";

import { useScrollState } from "./use-scroll-state";

export interface MobileCtaBarProps {
  discordUrl: string;
  facebookUrl: string;
}

/**
 * Fixed bottom action bar shown only on small screens once the visitor has
 * scrolled past the hero (design reference lines 464-469). Hidden at and
 * above the `nav` breakpoint, where the header's own CTA is already visible.
 */
export function MobileCtaBar({ discordUrl, facebookUrl }: MobileCtaBarProps) {
  const { deep } = useScrollState();

  if (!deep) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[45] flex gap-2.5 border-t border-border bg-surface-raised/95 px-(--spacing-gutter) pt-2.5 backdrop-blur-[14px] nav:hidden"
      style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
    >
      <a
        href={discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 flex-1 items-center justify-center rounded-[10px] bg-accent font-sans text-[14.5px] font-semibold text-accent-ink"
      >
        Join Discord
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 flex-1 items-center justify-center rounded-[10px] border border-border font-sans text-[14.5px] font-medium text-foreground"
      >
        Join Facebook
      </a>
    </div>
  );
}
