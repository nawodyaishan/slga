import { groq } from "next-sanity";
import type {
  Announcement,
  Artwork,
  ContentAdapter,
  FacebookFeature,
  PrivacyNotice,
  Rule,
  SiteSettings,
  SocialLink,
  SocialPlatform,
} from "@/lib/content/types";
import { getSanityClient } from "./client";
import { resolveSanityImage } from "./image";
import type {
  ANNOUNCEMENT_BY_SLUG_QUERYResult,
  ANNOUNCEMENTS_QUERYResult,
  ARTWORK_QUERYResult,
  FACEBOOK_FEATURES_QUERYResult,
  FEATURED_ANNOUNCEMENT_QUERYResult,
  PRIVACY_QUERYResult,
  RULES_QUERYResult,
  SITE_SETTINGS_QUERYResult,
} from "./sanity.types";

/**
 * GROQ against the schema in TECH-SPEC.md §11. Every query fetches the
 * `_createdAt` fields it needs for the documented ordering rules; ordering,
 * the three-card cap and draft/future exclusion are applied here, once, so
 * every caller of `sanityAdapter` sees already-correct results.
 *
 * `perspective: "published"` on the client (client.ts) already excludes
 * `drafts.*` documents; the explicit `!(_id in path("drafts.**"))` filters
 * below are kept anyway as defense in depth against a future perspective
 * change, per the "never expose a draft" requirement in TECH-SPEC.md §8.4/§8.5.
 */

const SOCIAL_MARKS: Readonly<Record<SocialPlatform, string>> = {
  facebook: "f",
  discord: "D",
  steam: "S",
  reddit: "R",
  instagram: "I",
  youtube: "Y",
};

const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
  siteName, shortName, heroEyebrow, heroHeading, heroBody, heroImage,
  memberCount, memberCountLabel, memberCountSource, aboutHeading, aboutBody,
  aboutFacts[]{ key, title, description },
  "socialLinks": socialLinks[enabled == true] | order(order asc){ platform, label, url, enabled },
  rulesHeadingEn, rulesHeadingSi, rulesIntroEn, rulesIntroSi,
  rulesOutroTitleEn, rulesOutroTitleSi, rulesOutroBodyEn, rulesOutroBodySi,
  rulesLastUpdated,
  seoTitle, seoDescription, defaultOgImage
}`;

const RULES_QUERY = groq`*[_type == "rule" && enabled == true && !(_id in path("drafts.**"))]
  | order(displayOrder asc, _createdAt asc){
    _id, displayOrder, title, body
  }`;

const ANNOUNCEMENT_PROJECTION = groq`{
  _id, title, "slug": slug.current, kind, excerpt, body, coverImage, publishedAt
}`;

const ANNOUNCEMENTS_QUERY = groq`*[
  _type == "announcement" &&
  !(_id in path("drafts.**")) &&
  defined(publishedAt) &&
  publishedAt <= now()
] | order(publishedAt desc) ${ANNOUNCEMENT_PROJECTION}`;

const ANNOUNCEMENT_BY_SLUG_QUERY = groq`*[
  _type == "announcement" &&
  !(_id in path("drafts.**")) &&
  defined(publishedAt) &&
  publishedAt <= now() &&
  slug.current == $slug
][0] ${ANNOUNCEMENT_PROJECTION}`;

const FEATURED_ANNOUNCEMENT_QUERY = groq`coalesce(
  *[
    _type == "announcement" &&
    !(_id in path("drafts.**")) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    _id == *[_type == "siteSettings" && !(_id in path("drafts.**"))][0].featuredAnnouncement._ref
  ][0] ${ANNOUNCEMENT_PROJECTION},
  *[
    _type == "announcement" &&
    !(_id in path("drafts.**")) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc)[0] ${ANNOUNCEMENT_PROJECTION}
)`;

const FACEBOOK_FEATURES_QUERY = groq`*[
  _type == "facebookFeature" &&
  enabled == true &&
  !(_id in path("drafts.**"))
] | order(displayOrder asc)[0...3]{
  _id, title, excerpt, postUrl, image, displayOrder
}`;

const ARTWORK_QUERY = groq`*[
  _type == "artwork" &&
  enabled == true &&
  !(_id in path("drafts.**"))
] | order(displayOrder asc, _createdAt asc){
  _id, title, artist, game, image, sourceUrl, displayOrder
}`;

const PRIVACY_QUERY = groq`*[_type == "privacyNotice" && !(_id in path("drafts.**"))][0]{
  lastReviewed, intro, sections
}`;

type SiteSettingsQueryData = NonNullable<SITE_SETTINGS_QUERYResult>;
type RuleQueryItem = RULES_QUERYResult[number];
type AnnouncementQueryItem = ANNOUNCEMENTS_QUERYResult[number];
type ArtworkQueryItem = ARTWORK_QUERYResult[number];
type FacebookFeatureQueryItem = FACEBOOK_FEATURES_QUERYResult[number];
type PrivacyQueryData = NonNullable<PRIVACY_QUERYResult>;

/** Portable Text arrives from Sanity already shaped as `RichText`; no `any`. */
function asRichText(value: unknown): Rule["body"]["en"] {
  return (Array.isArray(value) ? value : []) as Rule["body"]["en"];
}

interface PortableTextSpan {
  readonly text?: string;
}

interface PortableTextBlockLike {
  readonly _type?: string;
  readonly children?: readonly PortableTextSpan[];
}

/**
 * `SiteSettings.aboutBody` is `readonly string[]` (one entry per paragraph)
 * while the Sanity schema stores it as Portable Text (TECH-SPEC.md §11.1) -
 * flatten each text block's spans into a single paragraph string.
 */
function asParagraphs(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return (value as readonly PortableTextBlockLike[])
    .filter((block) => block._type === "block")
    .map((block) => (block.children ?? []).map((span) => span.text ?? "").join(""))
    .filter((text) => text.length > 0);
}

function mapSiteSettings(raw: SiteSettingsQueryData): SiteSettings {
  const social: SocialLink[] = raw.socialLinks.map((link) => ({
    platform: link.platform,
    label: link.label,
    url: link.url,
    mark: SOCIAL_MARKS[link.platform],
  }));

  return {
    siteName: raw.siteName,
    shortName: raw.shortName,
    heroEyebrow: raw.heroEyebrow ?? "",
    heroHeading: raw.heroHeading.split("\n"),
    heroBody: raw.heroBody,
    heroImage: resolveSanityImage(raw.heroImage, { width: 1200, height: 1500 }),
    memberCount: raw.memberCount,
    memberCountLabel: raw.memberCountLabel,
    memberCountSource: raw.memberCountSource,
    aboutHeading: raw.aboutHeading.split("\n"),
    aboutBody: asParagraphs(raw.aboutBody),
    aboutFacts: raw.aboutFacts,
    social,
    rules: {
      lastUpdated: raw.rulesLastUpdated,
      heading: { en: raw.rulesHeadingEn, si: raw.rulesHeadingSi },
      intro: { en: raw.rulesIntroEn, si: raw.rulesIntroSi },
      outroTitle: { en: raw.rulesOutroTitleEn, si: raw.rulesOutroTitleSi },
      outroBody: {
        en: raw.rulesOutroBodyEn,
        si: raw.rulesOutroBodySi,
      },
    },
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    defaultOgImage: resolveSanityImage(raw.defaultOgImage, { width: 1200, height: 630 }),
  };
}

function mapRule(raw: RuleQueryItem): Rule {
  return {
    id: raw._id,
    displayOrder: raw.displayOrder,
    title: { en: raw.title.en, si: raw.title.si },
    body: { en: asRichText(raw.body.en), si: asRichText(raw.body.si) },
  };
}

function mapAnnouncement(raw: AnnouncementQueryItem): Announcement {
  return {
    id: raw._id,
    slug: raw.slug,
    kind: raw.kind,
    title: raw.title,
    excerpt: raw.excerpt,
    body: asRichText(raw.body),
    coverImage: resolveSanityImage(raw.coverImage, { width: 1600, height: 900 }),
    publishedAt: raw.publishedAt,
  };
}

function mapFeature(raw: FacebookFeatureQueryItem): FacebookFeature {
  const image = resolveSanityImage(raw.image, { width: 800, height: 500 });
  return {
    id: raw._id,
    title: raw.title,
    excerpt: raw.excerpt,
    postUrl: raw.postUrl,
    // Schema requires this field, so a null image indicates a data problem
    // rather than an expected empty state - fail loudly instead of guessing.
    image: image ?? {
      src: "",
      alt: raw.title,
      placeholder: "IMAGE MISSING",
    },
    displayOrder: raw.displayOrder,
  };
}

function mapArtwork(raw: ArtworkQueryItem): Artwork {
  const image = resolveSanityImage(raw.image, { width: 800, height: 1000 });
  return {
    id: raw._id,
    title: raw.title,
    artist: raw.artist,
    game: raw.game,
    sourceUrl: raw.sourceUrl,
    image: image ?? {
      src: "",
      alt: raw.title,
      placeholder: "IMAGE MISSING",
    },
    displayOrder: raw.displayOrder,
  };
}

function mapPrivacyNotice(raw: PrivacyQueryData): PrivacyNotice {
  return {
    lastReviewed: raw.lastReviewed,
    intro: raw.intro,
    sections: raw.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
    })),
  };
}

export const sanityAdapter: ContentAdapter = {
  name: "sanity",
  provisional: false,

  async getSiteSettings() {
    const raw = await getSanityClient().fetch<SITE_SETTINGS_QUERYResult>(SITE_SETTINGS_QUERY, {}, {
      next: { revalidate: 60 },
    });
    if (!raw) {
      throw new Error(
        "SLGA_SITE_SETTINGS_MISSING: no siteSettings document found; the production build must not deploy without one (TECH-SPEC.md §10.3).",
      );
    }
    return mapSiteSettings(raw);
  },

  async getRules() {
    const raw = await getSanityClient().fetch<RULES_QUERYResult>(RULES_QUERY, {}, {
      next: { revalidate: 60 },
    });
    return raw.map(mapRule);
  },

  async getAnnouncements() {
    const raw = await getSanityClient().fetch<ANNOUNCEMENTS_QUERYResult>(ANNOUNCEMENTS_QUERY, {}, {
      next: { revalidate: 60 },
    });
    return raw.map(mapAnnouncement);
  },

  async getFeaturedAnnouncement() {
    const raw = await getSanityClient().fetch<FEATURED_ANNOUNCEMENT_QUERYResult>(
      FEATURED_ANNOUNCEMENT_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return raw ? mapAnnouncement(raw) : null;
  },

  async getAnnouncementBySlug(slug: string) {
    const raw = await getSanityClient().fetch<ANNOUNCEMENT_BY_SLUG_QUERYResult>(
      ANNOUNCEMENT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );
    return raw ? mapAnnouncement(raw) : null;
  },

  async getArtworks() {
    const raw = await getSanityClient().fetch<ARTWORK_QUERYResult>(
      ARTWORK_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return raw.map(mapArtwork);
  },

  async getFacebookFeatures() {
    const raw = await getSanityClient().fetch<FACEBOOK_FEATURES_QUERYResult>(
      FACEBOOK_FEATURES_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return raw.map(mapFeature);
  },

  async getPrivacyNotice() {
    const raw = await getSanityClient().fetch<PRIVACY_QUERYResult>(PRIVACY_QUERY, {}, {
      next: { revalidate: 60 },
    });
    if (!raw) {
      throw new Error("SLGA_PRIVACY_NOTICE_MISSING: no privacyNotice document found.");
    }
    return mapPrivacyNotice(raw);
  },
};
