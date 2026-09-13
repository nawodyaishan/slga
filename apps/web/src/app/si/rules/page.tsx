import type { Metadata } from "next";
import { RulesPage } from "@/components/sections/rules-page";
import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";

export const metadata: Metadata = {
  title: "සමූහයේ නීති",
  description: "SLGA සමූහයේ නීති සහ මාර්ගෝපදේශ, සිංහලෙන්.",
  alternates: { languages: { en: "/rules", si: "/si/rules" } },
};

export default async function SinhalaRulesPage() {
  const settings = await content.getSiteSettings();
  return <RulesPage locale="si" discordUrl={requireSocialUrl(settings.social, "discord")} />;
}
