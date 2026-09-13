import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-[-0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        solid: "bg-accent text-accent-ink hover:bg-accent-soft active:bg-accent-soft/90",
        default: "bg-accent text-accent-ink hover:bg-accent-soft active:bg-accent-soft/90",
        surface: "border border-border bg-surface text-foreground hover:border-accent hover:bg-surface-raised",
        outline: "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent",
        ghost: "bg-transparent text-foreground hover:text-accent hover:bg-surface",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "min-h-11 rounded-[10px] px-6 text-[16px]",
        hero: "min-h-[54px] rounded-[10px] px-6 text-[16px] leading-none",
        sm: "min-h-10 rounded-[9px] px-4 text-[13.5px] sm:text-[14px]",
        lg: "min-h-13 rounded-[10px] px-6.5 text-base",
        icon: "size-11 rounded-[10px] p-0",
      },
      fullWidth: {
        true: "w-full",
        responsive: "w-full sm:w-auto",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
      fullWidth: false,
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

interface CommonButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children?: React.ReactNode;
}

export type ButtonProps = CommonButtonProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

/**
 * Renders an `<a>` when `href` is supplied, otherwise a `<button>`.
 * Built on shadcn/ui cva architecture while strictly preserving SLGA design system tokens.
 * Every variant meets the 44×44 CSS px minimum touch target size.
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = "solid", size = "default", fullWidth = false, className, children, ...rest }, ref) => {
    const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

    if ("href" in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    const { type = "button", ...buttonRest } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        {...buttonRest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
