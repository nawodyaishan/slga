import { defineField, defineType } from "sanity";

/**
 * Rule document (TECH-SPEC §11.2). Backs `/rules` and `/si/rules` - see
 * `apps/web/src/lib/sanity/queries.ts` (`RULES_QUERY`, `mapRule`) and the
 * `Rule` type in `apps/web/src/lib/content/types.ts`.
 *
 * Field names below intentionally mirror what `RULES_QUERY` projects
 * (`title`, `body`, `displayOrder`, `enabled`) rather than the flat
 * `titleEn`/`titleSi`/`isActive` naming sometimes used in planning docs -
 * the query and its `RawRule` mapper are the source of truth for shape.
 *
 * Both languages are required on `title` and `body` together - a rule must
 * never publish half-translated (spec 002, FR-3).
 */
export const rule = defineType({
  name: "rule",
  title: "Rule",
  type: "document",
  orderings: [
    {
      title: "Display order",
      name: "displayOrderAsc",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "_createdAt", direction: "asc" },
      ],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "rulesBlockContent",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "si",
          title: "Sinhala",
          type: "rulesBlockContent",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Integer ≥ 1. Rules are shown in ascending order; avoid duplicates.",
      validation: (Rule) => [
        Rule.required().integer().min(1),
        Rule.custom(async (value, context) => {
          if (typeof value !== "number" || !context.document?._id) return true;
          const publishedId = context.document._id.replace(/^drafts\./, "");
          const duplicateCount = await context
            .getClient({ apiVersion: "2026-09-13" })
            .fetch<number>(
              'count(*[_type == "rule" && displayOrder == $value && !(_id in [$publishedId, $draftId])])',
              { value, publishedId, draftId: `drafts.${publishedId}` },
            );
          return duplicateCount === 0
            ? true
            : `Another rule already uses display order ${value}.`;
        }).warning(),
      ],
    }),
    defineField({
      name: "anchorId",
      title: "Anchor ID",
      type: "slug",
      description:
        "Stable identifier the rules page can deep-link to (e.g. rule-3). Lowercase letters, numbers and hyphens only.",
      options: { source: "title.en", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value?.current) return "Required";
          return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.current)
            ? true
            : "Use lowercase letters, numbers and hyphens only (e.g. rule-3).";
        }),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      description: "Disabled rules are excluded from the public rules page.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      displayOrder: "displayOrder",
      titleEn: "title.en",
    },
    prepare({ displayOrder, titleEn }) {
      const order = typeof displayOrder === "number" ? String(displayOrder).padStart(2, "0") : "-";
      return {
        title: titleEn || "Untitled rule",
        subtitle: `Rule ${order}`,
      };
    },
  },
});
