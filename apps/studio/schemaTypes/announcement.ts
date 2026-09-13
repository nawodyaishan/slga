import { defineField, defineType } from "sanity";

/**
 * Announcement document (TECH-SPEC §11.3). Backs the homepage/announcements
 * feed and `/announcements/[slug]` — see
 * `apps/web/src/lib/sanity/queries.ts` (`ANNOUNCEMENTS_QUERY`,
 * `ANNOUNCEMENT_BY_SLUG_QUERY`, `mapAnnouncement`) and the `Announcement`
 * type in `apps/web/src/lib/content/types.ts`.
 */
export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  orderings: [
    {
      title: "Publication date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      description:
        "Short uppercase kicker shown on the announcement card and detail page.",
      options: {
        list: [
          { title: "Announcement", value: "ANNOUNCEMENT" },
          { title: "Rules update", value: "RULES UPDATE" },
          { title: "Community", value: "COMMUNITY" },
          { title: "Event", value: "EVENT" },
        ],
        layout: "radio",
      },
      initialValue: "ANNOUNCEMENT",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      description: "Short summary shown on announcement cards. Aim for 200 characters or fewer.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "announcementBlockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "string",
      description: "Meta description for search and social previews. Aim for 120–160 characters.",
      validation: (Rule) =>
        Rule.max(160).warning("Keep the SEO description between 120 and 160 characters.").custom((value) => {
          if (!value) return true;
          if (value.length < 120) {
            return "Shorter than 120 characters — consider adding more detail for search previews.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      kind: "kind",
      publishedAt: "publishedAt",
    },
    prepare({ title, kind, publishedAt }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : "No date";
      return {
        title,
        subtitle: [kind, date].filter(Boolean).join(" · "),
      };
    },
  },
});
