"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useScrollState } from "./use-scroll-state";
import { MobileNav, type MobileNavItem } from "./mobile-nav";

export interface NavItem {
  label: string;
  href: string;
  current: boolean;
}

export interface HeaderProps {
  navItems: readonly NavItem[];
  discordUrl: string;
  facebookUrl: string;
  homeHref?: string;
}

/**
 * Sticky global header. Owns the mobile drawer's open state and scroll
 * thresholds so callers only need to supply nav data and the two community
 * URLs. Composes `MobileNav`; nothing else in the tree needs to know it exists.
 */
export function Header({ navItems, discordUrl, facebookUrl, homeHref = "/" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled } = useScrollState();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const mobileItems: MobileNavItem[] = navItems.map(({ label, href, current }) => ({
    label,
    href,
    current,
  }));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-[14px] transition-colors duration-250",
          scrolled ? "border-border bg-background/92" : "border-border/40 bg-background/55",
        )}
      >
        <div className="mx-auto flex h-15 max-w-(--spacing-shell) items-center justify-between gap-4 px-(--spacing-gutter) nav:h-19">
          <a
            href={homeHref}
            aria-label="Sri Lankan Gaming Alliance — home"
            className="flex min-h-11 items-center gap-2.5 text-foreground"
          >
            <span
              aria-hidden="true"
              className="grid size-[30px] flex-none place-items-center rounded-[7px] border border-accent font-sans text-[13px] font-bold tracking-[-0.02em] text-accent"
            >
              SL
            </span>
            <span className="flex flex-col leading-[1.05]">
              <span className="font-sans text-[15px] font-bold tracking-[-0.02em]">SLGA</span>
              <span className="hidden font-mono text-[9.5px] font-medium tracking-[0.1em] text-muted nav:inline">
                SRI LANKAN GAMING ALLIANCE
              </span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 nav:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center px-3.5 text-[14.5px] tracking-[-0.01em]",
                  item.current ? "font-semibold text-foreground" : "font-normal text-muted",
                )}
              >
                {item.label}
                {item.current && (
                  <span
                    aria-hidden="true"
                    className="absolute right-3.5 bottom-2 left-3.5 h-0.5 rounded-full bg-accent"
                  />
                )}
              </a>
            ))}
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex min-h-11 items-center gap-2 rounded-[9px] bg-accent px-5 font-sans text-[14.5px] font-semibold tracking-[-0.01em] text-accent-ink"
            >
              Join Discord
              <span aria-hidden="true" className="font-mono text-[11px] opacity-60">
                ↗
              </span>
            </a>
          </nav>

          <div className="flex items-center gap-2 nav:hidden">
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center rounded-[9px] bg-accent px-3.5 font-sans text-[13.5px] font-semibold text-accent-ink"
            >
              Discord
            </a>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-[9px] border border-border bg-surface text-foreground"
            >
              <span aria-hidden="true" className="flex flex-col gap-1">
                <span className="block h-[1.5px] w-[17px] bg-foreground" />
                <span className="block h-[1.5px] w-[17px] bg-foreground" />
                <span className="block h-[1.5px] w-[11px] bg-accent" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={mobileItems}
        discordUrl={discordUrl}
        facebookUrl={facebookUrl}
        triggerRef={triggerRef}
      />
    </>
  );
}
