import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  /** e.g. "01" - rendered in the accent color ahead of the label. */
  number: string;
  label: string;
  heading: ReactNode;
  id?: string;
  className?: string;
  headingClassName?: string;
}

/**
 * The recurring numbered-kicker + heading pattern, e.g. "01 ABOUT SLGA"
 * followed by "A community first. Everything else second."
 */
export function SectionHeading({
  number,
  label,
  heading,
  id,
  className,
  headingClassName,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="mb-4 flex items-center gap-3 font-mono text-label-lg font-medium tracking-[0.16em] text-muted">
        <span className="text-accent">{number}</span>
        {label}
      </p>
      <h2
        id={id}
        className={cn(
          "m-0 text-h2 leading-[1.1] font-bold tracking-[-0.03em] text-foreground",
          headingClassName,
        )}
      >
        {heading}
      </h2>
    </div>
  );
}
