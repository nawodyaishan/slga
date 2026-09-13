import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "solid" | "outline" | "ghost";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] px-6 font-sans text-[16px] font-semibold tracking-[-0.01em] transition-colors";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-accent text-accent-ink hover:bg-accent-soft",
  outline: "border border-border bg-transparent text-foreground hover:border-accent",
  ghost: "bg-transparent text-foreground hover:text-accent",
};

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

/**
 * Renders an `<a>` when `href` is supplied, otherwise a `<button>`.
 * Every variant meets the 44×44 CSS px minimum target size.
 */
export function Button({ variant = "solid", className, children, ...rest }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as NativeButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
