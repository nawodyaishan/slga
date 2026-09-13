import { defineField, defineType } from "sanity";

/**
 * Longer bilingual copy (paragraphs, intros). Same required-together shape
 * as `localizedString`, but backed by a multi-line `text` field.
 */
export const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "si",
      title: "Sinhala",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "en" },
  },
});
