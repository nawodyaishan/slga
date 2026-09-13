import type { Metadata } from "next";
import { content } from "@/lib/content";
import { requireSocialUrl } from "@/lib/content/social";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { LatestAnnouncement } from "@/components/sections/latest-announcement";
import { FeaturedFacebook } from "@/components/sections/featured-facebook";
import { CommunityCta } from "@/components/sections/community-cta";
import { createPageMetadata, absoluteSiteUrl } from "@/lib/site";
import { JsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await content.getSiteSettings();
  return createPageMetadata({
    title: settings.seoTitle,
    description: settings.seoDescription,
    path: "/",
    image: settings.defaultOgImage,
  });
}

export default async function HomePage() {
  const [settings, featuredAnnouncement, features] = await Promise.all([
    content.getSiteSettings(),
    content.getFeaturedAnnouncement(),
    content.getFacebookFeatures(),
  ]);

  const discordUrl = requireSocialUrl(settings.social, "discord");
  const facebookUrl = requireSocialUrl(settings.social, "facebook");
  const origin = absoluteSiteUrl("/");
  const sameAs = settings.social.map((link) => link.url);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${origin}#organization`,
              name: settings.siteName,
              url: origin,
              sameAs,
            },
            {
              "@type": "WebSite",
              "@id": `${origin}#website`,
              name: settings.siteName,
              url: origin,
              publisher: { "@id": `${origin}#organization` },
            },
          ],
        }}
      />
      <Hero settings={settings} discordUrl={discordUrl} facebookUrl={facebookUrl} />
      <About settings={settings} />
      {featuredAnnouncement && <LatestAnnouncement announcement={featuredAnnouncement} />}
      {features.length > 0 && <FeaturedFacebook features={features} />}
      <CommunityCta discordUrl={discordUrl} facebookUrl={facebookUrl} />
    </>
  );
}
