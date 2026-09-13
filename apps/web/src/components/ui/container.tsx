import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps<T extends ElementType> {
  as?: T;
  children: ReactNode;
  className?: string;
}

/**
 * The recurring `max-width:1200px; margin:0 auto; padding:0 {pad}` frame.
 * Bound to the `--spacing-shell` (max width) and `--spacing-gutter`
 * (fluid horizontal padding) tokens from globals.css.
 */
export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: ContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Tag = as ?? "div";
  return (
    <Tag className={cn("mx-auto w-full max-w-(--spacing-shell) px-(--spacing-gutter)", className)} {...rest}>
      {children}
    </Tag>
  );
}
