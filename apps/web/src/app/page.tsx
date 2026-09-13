import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { LatestAnnouncement } from "@/components/sections/latest-announcement";
import { FeaturedFacebook } from "@/components/sections/featured-facebook";
import { CommunityCta } from "@/components/sections/community-cta";

export default async function HomePage() {
  const [settings, featuredAnnouncement, features] = await Promise.all([
    content.getSiteSettings(),
    content.getFeaturedAnnouncement(),
    content.getFacebookFeatures(),
  ]);

  const discordUrl = requireSocialUrl(settings.social, "discord");
  const facebookUrl = requireSocialUrl(settings.social, "facebook");

  return (
    <>
      <Hero settings={settings} discordUrl={discordUrl} facebookUrl={facebookUrl} />
      <About settings={settings} />
      {featuredAnnouncement && <LatestAnnouncement announcement={featuredAnnouncement} />}
      {features.length > 0 && <FeaturedFacebook features={features} />}
      <CommunityCta discordUrl={discordUrl} facebookUrl={facebookUrl} />
    </>
  );
}
