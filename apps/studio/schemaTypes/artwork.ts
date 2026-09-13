import { defineField, defineType } from "sanity";

/**
 * Community artwork showcase (Spec 005, TECH-SPEC §11.7).
 * Admins curate artwork submissions from the community.
 * `ARTWORK_QUERY` reads active pieces ordered by `displayOrder` asc,
 * with `_createdAt` as a deterministic tiebreak.
 */
export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
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
      name: "artist",
      title: "Artist credit",
      type: "string",
      description: "Credit line for the creator (e.g. member name or handle).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "game",
      title: "Game",
      type: "string",
      description: "Game name or title.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Artwork image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Link to original post in Facebook group or source post. Must be https.",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
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
      media: "image",
    },
    prepare({ title, enabled, displayOrder, media }) {
      return {
        title: title ?? "Untitled artwork",
        subtitle: `${enabled ? "Enabled" : "Disabled"} · Order ${displayOrder ?? "-"}`,
        media,
      };
    },
  },
});
