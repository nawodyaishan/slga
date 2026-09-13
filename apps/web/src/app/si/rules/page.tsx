import type { Metadata } from "next";
import { RulesPage } from "@/components/sections/rules-page";
import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";
import { createPageMetadata, isIndexableDeployment } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await content.getSiteSettings();
  return {
    ...createPageMetadata({
      fallbackImage: settings.defaultOgImage,
      locale: "si_LK",
      title: "සමූහයේ නීති",
      description: "SLGA සමූහයේ නීති සහ මාර්ගෝපදේශ, සිංහලෙන්.",
      path: "/si/rules",
    }),
    alternates: isIndexableDeployment()
      ? { canonical: "/si/rules", languages: { en: "/rules", si: "/si/rules" } }
      : undefined,
  };
}

export default async function SinhalaRulesPage() {
  const settings = await content.getSiteSettings();
  return <RulesPage locale="si" discordUrl={requireSocialUrl(settings.social, "discord")} />;
}
