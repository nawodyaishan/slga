"use client";

import { buttonVariants } from "@/components/ui";
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
        className={buttonVariants({
          variant: "solid",
          size: "default",
          className: "flex-1 min-w-0 px-2 text-[14px] xs:text-[14.5px]",
        })}
      >
        <span className="truncate">Join Discord</span>
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({
          variant: "outline",
          size: "default",
          className: "flex-1 min-w-0 px-2 text-[14px] xs:text-[14.5px] font-medium",
        })}
      >
        <span className="truncate">Join Facebook</span>
      </a>
    </div>
  );
}
