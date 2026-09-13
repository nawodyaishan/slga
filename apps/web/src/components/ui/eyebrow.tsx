import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** Show the small accent leading bar (used in page-intro eyebrows). */
  bar?: boolean;
}

/** Small-caps mono label, optionally preceded by a short accent bar. */
export function Eyebrow({ children, className, bar = false }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-label-lg font-medium tracking-[0.18em] text-accent",
        className,
      )}
    >
      {bar && <span aria-hidden="true" className="h-px w-[22px] bg-accent" />}
      {children}
    </p>
  );
}
