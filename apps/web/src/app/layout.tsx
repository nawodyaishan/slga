import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Sinhala } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SkipLink } from "@/components/layout/skip-link";
import { PrototypeBanner } from "@/components/layout/prototype-banner";
import { SiteChrome } from "@/components/layout/site-chrome";
import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";
import "../styles/globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const notoSansSinhala = Noto_Sans_Sinhala({ subsets: ["sinhala"], variable: "--font-noto-sinhala" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Sri Lankan Gaming Alliance", template: "%s | SLGA" },
  description: "The home for Sri Lankan gamers.",
};

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Rules", href: "/rules" },
  { label: "Announcements", href: "/announcements" },
] as const;

const SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rules", href: "/rules" },
  { label: "Announcements", href: "/announcements" },
  { label: "Privacy", href: "/privacy" },
] as const;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await content.getSiteSettings();
  const discordUrl = requireSocialUrl(settings.social, "discord");
  const facebookUrl = requireSocialUrl(settings.social, "facebook");

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSansSinhala.variable}`}>
      <body>
        <SkipLink />
        {content.provisional && <PrototypeBanner />}
        <SiteChrome
          navItems={NAV_ITEMS}
          siteLinks={SITE_LINKS}
          socialLinks={settings.social}
          discordUrl={discordUrl}
          facebookUrl={facebookUrl}
        >
          {children}
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}

