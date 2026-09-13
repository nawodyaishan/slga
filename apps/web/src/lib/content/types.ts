import type { PortableTextBlock } from "@portabletext/react";

/**
 * Domain model for all published SLGA content.
 *
 * These types mirror the Sanity schema in TECH-SPEC.md §11 but are deliberately
 * source-agnostic: every content adapter (seed, Sanity, and any test fixture)
 * returns exactly these shapes, so no page component knows where content came
 * from.
 */

export type RichText = PortableTextBlock[];

export interface ImageRef {
  /** Resolved, CDN-ready source. */
  readonly src: string;
  /** Required for content images; empty string marks a decorative asset. */
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  /** Sanity hotspot-aware focal point, as CSS `object-position`. */
  readonly focalPoint?: string;
  /**
   * Set when no real asset exists yet. Renderers draw the design's hatched
   * placeholder instead of a broken image, and never claim it is final art.
   */
  readonly placeholder?: string;
}

export type SocialPlatform =
  | "facebook"
  | "discord"
  | "steam"
  | "reddit"
  | "instagram"
  | "youtube";

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly url: string;
  /** Single-character glyph used by the footer's bordered mark. */
  readonly mark: string;
}

export interface SiteSettings {
  readonly siteName: string;
  readonly shortName: string;
  readonly heroEyebrow: string;
  readonly heroHeading: readonly string[];
  readonly heroBody: string;
  readonly heroImage: ImageRef | null;
  readonly memberCount: number;
  readonly memberCountLabel: string;
  readonly memberCountSource: string;
  readonly aboutHeading: readonly string[];
  readonly aboutBody: readonly string[];
  readonly aboutFacts: readonly AboutFact[];
  readonly social: readonly SocialLink[];
  readonly rules: RulesCopy;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly defaultOgImage: ImageRef | null;
}

export interface AboutFact {
  readonly key: string;
  readonly title: string;
  readonly description: string;
}

export type Locale = "en" | "si";

export interface RulesCopy {
  /** ISO date shown as `Last updated` on both language variants. */
  readonly lastUpdated: string;
  readonly heading: Readonly<Record<Locale, string>>;
  readonly intro: Readonly<Record<Locale, string>>;
  readonly outroTitle: Readonly<Record<Locale, string>>;
  readonly outroBody: Readonly<Record<Locale, string>>;
}

export interface Rule {
  readonly id: string;
  readonly displayOrder: number;
  readonly title: Readonly<Record<Locale, string>>;
  readonly body: Readonly<Record<Locale, RichText>>;
}

/** A rule already resolved to one language, ready to render. */
export interface LocalizedRule {
  readonly id: string;
  readonly number: number;
  /** Zero-padded for the design's mono numerals. */
  readonly label: string;
  readonly title: string;
  /** The other language's title, shown as a subtitle. Null when identical. */
  readonly alternateTitle: string | null;
  readonly body: RichText;
}

export interface Announcement {
  readonly id: string;
  readonly slug: string;
  /** Short uppercase kicker, e.g. `RULES UPDATE`. */
  readonly kind: string;
  readonly title: string;
  readonly excerpt: string;
  readonly body: RichText;
  readonly coverImage: ImageRef | null;
  /** ISO 8601. Documents dated in the future are never returned publicly. */
  readonly publishedAt: string;
}

export interface FacebookFeature {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly postUrl: string;
  readonly image: ImageRef;
  readonly displayOrder: number;
}

export interface PrivacySection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface PrivacyNotice {
  readonly lastReviewed: string;
  readonly intro: string;
  readonly sections: readonly PrivacySection[];
}

/**
 * The contract every content source implements. Ordering, the three-card cap
 * and draft/future exclusion are the adapter's responsibility, never the
 * page's — see plan.md §2.
 */
export interface ContentAdapter {
  readonly name: "seed" | "sanity";
  /**
   * True when the content is migration input or mock data awaiting founder
   * approval. Drives the persistent PROTOTYPE banner.
   */
  readonly provisional: boolean;
  getSiteSettings(): Promise<SiteSettings>;
  /** Ordered by displayOrder, then creation time. Disabled rules excluded. */
  getRules(): Promise<Rule[]>;
  /** Newest first. Drafts and future-dated documents excluded. */
  getAnnouncements(): Promise<Announcement[]>;
  /** Founder-selected published announcement, falling back to the newest published item. */
  getFeaturedAnnouncement(): Promise<Announcement | null>;
  getAnnouncementBySlug(slug: string): Promise<Announcement | null>;
  /** At most three, ordered by displayOrder. Disabled cards excluded. */
  getFacebookFeatures(): Promise<FacebookFeature[]>;
  getPrivacyNotice(): Promise<PrivacyNotice>;
}
