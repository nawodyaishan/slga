import type { SocialLink, SocialPlatform } from "./types";

/** Every page needing a CTA URL fails loudly rather than linking somewhere wrong. */
export function requireSocialUrl(social: readonly SocialLink[], platform: SocialPlatform): string {
  const match = social.find((entry) => entry.platform === platform);
  if (!match) {
    throw new Error(`SLGA_SOCIAL_LINK_MISSING: siteSettings has no "${platform}" entry in socialLinks.`);
  }
  return match.url;
}
