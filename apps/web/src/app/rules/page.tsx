import type { Metadata } from "next";
import { RulesPage } from "@/components/sections/rules-page";
import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";

export const metadata: Metadata = {
  title: "Community rules",
  description: "SLGA community rules and guidelines, in English.",
  alternates: { languages: { en: "/rules", si: "/si/rules" } },
};

export default async function EnglishRulesPage() {
  const settings = await content.getSiteSettings();
  return <RulesPage locale="en" discordUrl={requireSocialUrl(settings.social, "discord")} />;
}
