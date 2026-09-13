"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

interface TrackedLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {
  href: string;
  children: ReactNode;
  /**
   * Invoked on click, before navigation. Callers wire this to their own
   * analytics dispatch (e.g. `lib/analytics.ts`) - this component has no
   * knowledge of what "tracking" means, only that external links need a
   * hook point.
   */
  onOpen?: () => void;
}

/**
 * An external link that always opens in a new tab safely, tells assistive
 * technology that it does, and gives callers a hook to record the click.
 */
export function TrackedLink({ href, children, onOpen, onClick, ...rest }: TrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        onOpen?.();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
