"use client";

import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/cn";

export interface MobileNavItem {
  label: string;
  href: string;
  current: boolean;
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  navItems: readonly MobileNavItem[];
  discordUrl: string;
  facebookUrl: string;
  /** The hamburger button that opened this drawer — focus returns to it on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The mobile navigation drawer. Traps focus while open, closes on Escape or a
 * backdrop click, and restores focus to the element that opened it.
 * No portal/dependency is used — this is intentionally hand-rolled per
 * plan.md §3 (shadcn `Sheet` was rejected as unnecessary weight).
 */
export function MobileNav({ open, onClose, navItems, discordUrl, facebookUrl, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-abyss/72" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="animate-rise relative flex h-full w-[min(340px,86vw)] flex-col gap-1.5 border-l border-border bg-surface-raised p-5"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-mono text-label font-medium tracking-[0.14em] text-muted">MENU</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-[9px] border border-border bg-transparent font-sans text-lg text-foreground"
          >
            ×
          </button>
        </div>

        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={cn(
              "flex min-h-13 items-center justify-between rounded-[11px] border px-3.5 text-[17px]",
              item.current
                ? "border-accent bg-surface font-semibold text-foreground"
                : "border-border bg-transparent font-normal text-muted",
            )}
          >
            {item.label}
            {item.current && (
              <span className="font-mono text-label-lg font-medium tracking-[0.12em] text-accent">
                CURRENT
              </span>
            )}
          </a>
        ))}

        <div className="my-3.5 h-px bg-border" />

        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-13 items-center justify-center rounded-[11px] bg-accent font-sans text-base font-semibold text-accent-ink"
        >
          Join Discord ↗
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-13 items-center justify-center rounded-[11px] border border-border font-sans text-base font-medium text-foreground"
        >
          Join Facebook ↗
        </a>
      </div>
    </div>
  );
}
