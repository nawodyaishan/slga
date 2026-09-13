import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton content for the public privacy notice. */
export const privacyNotice = defineType({
  name: "privacyNotice",
  title: "Privacy notice",
  type: "document",
  description: "Public website copy only. Do not enter member data, credentials, or internal notes.",
  fields: [
    defineField({
      name: "lastReviewed",
      title: "Last reviewed",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 4 })],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Privacy notice" };
    },
  },
});

