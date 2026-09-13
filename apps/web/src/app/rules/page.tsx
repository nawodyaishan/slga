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
    locale: "en_LK",
    title: "Community rules",
    description: "SLGA community rules and guidelines, in English.",
    path: "/rules",
  }),
  alternates: isIndexableDeployment()
    ? { canonical: "/rules", languages: { en: "/rules", si: "/si/rules" } }
    : undefined,
  };
}

export default async function EnglishRulesPage() {
  const settings = await content.getSiteSettings();
  return <RulesPage locale="en" discordUrl={requireSocialUrl(settings.social, "discord")} />;
}
