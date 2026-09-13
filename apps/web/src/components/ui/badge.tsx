import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "accent" | "neutral";

const tones: Record<BadgeTone, string> = {
  accent: "border-accent text-accent",
  neutral: "border-border text-body",
};

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

/** The pill-shaped mono-font label, e.g. an announcement's `RULES UPDATE` kicker. */
export function Badge({ tone = "accent", dot = true, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-label font-medium tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
