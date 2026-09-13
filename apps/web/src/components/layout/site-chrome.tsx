"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SocialLink } from "@/lib/content/types";
import { Header, type NavItem } from "./header";
import { Footer, type FooterLink } from "./footer";
import { MobileCtaBar } from "./mobile-cta-bar";

interface NavSource {
  readonly label: string;
  readonly href: string;
}

interface SiteChromeProps {
  navItems: readonly NavSource[];
  siteLinks: readonly FooterLink[];
  socialLinks: readonly SocialLink[];
  discordUrl: string;
  facebookUrl: string;
  children: ReactNode;
}

function isCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`) || pathname === `/si${href}`;
}

/**
 * Client boundary that owns the one piece of state the shared shell needs
 * from the URL — which nav item is current — so `layout.tsx` can stay a
 * Server Component that only fetches `siteSettings` once per request.
 */
export function SiteChrome({ navItems, siteLinks, socialLinks, discordUrl, facebookUrl, children }: SiteChromeProps) {
  const pathname = usePathname();

  const items: NavItem[] = navItems.map((item) => ({
    ...item,
    current: isCurrent(pathname, item.href),
  }));

  return (
    <>
      <Header navItems={items} discordUrl={discordUrl} facebookUrl={facebookUrl} />
      <main id="slga-main">{children}</main>
      <Footer siteLinks={siteLinks} socialLinks={socialLinks} />
      <MobileCtaBar discordUrl={discordUrl} facebookUrl={facebookUrl} />
    </>
  );
}
