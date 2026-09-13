import { defineArrayMember, defineField, defineType } from "sanity";

const socialPlatforms = [
  { title: "Facebook", value: "facebook" },
  { title: "Discord", value: "discord" },
  { title: "Steam", value: "steam" },
  { title: "Reddit", value: "reddit" },
  { title: "Instagram", value: "instagram" },
  { title: "YouTube", value: "youtube" },
] as const;

function hasPlatform(value: unknown, platform: string): boolean {
  if (!Array.isArray(value)) return false;
  return value.some(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      "platform" in entry &&
      entry.platform === platform &&
      "enabled" in entry &&
      entry.enabled === true,
  );
}

/** Singleton homepage and global settings document (TECH-SPEC §11.1). */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site & Homepage",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "Sri Lankan Gaming Alliance",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Short name",
      type: "string",
      initialValue: "SLGA",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "text",
      rows: 3,
      description: "Use line breaks to control the stacked heading lines in the public design.",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value) =>
          typeof value === "string" && value.includes("\n")
            ? true
            : "Add at least one line break so the heading stack is intentional.",
        ).warning(),
      ],
    }),
    defineField({
      name: "heroBody",
      title: "Hero summary",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({ name: "heroImage", title: "Hero image", type: "imageWithAlt" }),
    defineField({
      name: "memberCount",
      title: "Member count",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "memberCountLabel",
      title: "Member count label",
      type: "string",
      description: "For example: community members.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "memberCountSource",
      title: "Member count source",
      type: "string",
      description: "Public-facing provenance for the number. Verify it before every update.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutHeading",
      title: "About heading",
      type: "text",
      rows: 3,
      description: "Use line breaks to control the stacked heading lines in the public design.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutBody",
      title: "About body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "aboutFacts",
      title: "About facts",
      type: "array",
      description: "Two to four short facts shown as homepage tiles.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "key", title: "Key", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      description:
        "This dataset is public. Add public community URLs only; Facebook and Discord must both be enabled before launch.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: { list: [...socialPlatforms], layout: "dropdown" },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "order",
              title: "Display order",
              type: "number",
              validation: (Rule) => Rule.required().integer().min(1),
            }),
          ],
          preview: { select: { title: "label", subtitle: "platform" } },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .custom((links) => {
            if (!hasPlatform(links, "facebook")) return "An enabled Facebook link is required before launch.";
            if (!hasPlatform(links, "discord")) return "An enabled Discord link is required before launch.";
            return true;
          }),
    }),
    defineField({ name: "featuredAnnouncement", title: "Featured announcement", type: "reference", to: [{ type: "announcement" }] }),
    defineField({ name: "rulesHeadingEn", title: "Rules heading — English", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesHeadingSi", title: "Rules heading — Sinhala", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesIntroEn", title: "Rules introduction — English", type: "text", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesIntroSi", title: "Rules introduction — Sinhala", type: "text", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesOutroTitleEn", title: "Rules outro title — English", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesOutroTitleSi", title: "Rules outro title — Sinhala", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesOutroBodyEn", title: "Rules outro body — English", type: "text", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesOutroBodySi", title: "Rules outro body — Sinhala", type: "text", validation: (Rule) => Rule.required() }),
    defineField({ name: "rulesLastUpdated", title: "Rules last updated", type: "date", validation: (Rule) => Rule.required() }),
    defineField({ name: "seoTitle", title: "Default SEO title", type: "string", validation: (Rule) => Rule.required().max(70) }),
    defineField({
      name: "seoDescription",
      title: "Default SEO description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(120).max(160),
    }),
    defineField({ name: "defaultOgImage", title: "Default social image", type: "imageWithAlt", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "siteName", subtitle: "heroHeading", media: "heroImage" },
  },
});
