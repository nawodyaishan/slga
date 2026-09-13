import { defineField, defineType } from "sanity";

/**
 * Featured Facebook post cards (TECH-SPEC §11.4). `FACEBOOK_FEATURES_QUERY`
 * (apps/web/src/lib/sanity/queries.ts) reads at most three of these,
 * ordered by `displayOrder`, with disabled cards excluded.
 */
export const facebookFeature = defineType({
  name: "facebookFeature",
  title: "Featured Facebook Post",
  type: "document",
  orderings: [
    {
      title: "Display order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postUrl",
      title: "Post URL",
      type: "url",
      description: "Link to the original Facebook post. Must be https.",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      enabled: "enabled",
      displayOrder: "displayOrder",
    },
    prepare({ title, enabled, displayOrder }) {
      return {
        title,
        subtitle: `${enabled ? "Enabled" : "Disabled"} · Order ${displayOrder ?? "—"}`,
      };
    },
  },
});
