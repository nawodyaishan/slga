import { defineField, defineType } from "sanity";

/**
 * Short bilingual text (titles, headings, labels). Both `en` and `si` are
 * required together — a document cannot publish half-translated copy
 * (spec 002, FR-3 / edge case "Rule body present in `si` but empty in `en`").
 *
 * Use `localizedText` instead for longer copy that needs a multi-line field.
 */
export const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "si",
      title: "Sinhala",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "en" },
  },
});
