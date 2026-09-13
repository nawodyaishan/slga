import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardTone = "raised" | "sunken";

const tones: Record<CardTone, string> = {
  raised: "bg-surface",
  sunken: "bg-surface-sunken",
};

interface CardProps<T extends ElementType> {
  as?: T;
  tone?: CardTone;
  children: ReactNode;
  className?: string;
}

/**
 * The bordered, rounded surface used for feature cards, announcement cards
 * and CTA panels throughout the design.
 */
export function Card<T extends ElementType = "div">({
  as,
  tone = "raised",
  children,
  className,
  ...rest
}: CardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CardProps<T>>) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn(
        "overflow-hidden rounded-2xl border border-border text-foreground",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
