import { defineField, defineType } from "sanity";

/**
 * Image type with hotspot enabled and a required `alt` field. The `production`
 * dataset is public — no field here should ever invite sensitive content
 * (spec 002, "Data sensitivity").
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Required for every content image. Describes the image for screen readers and search engines.",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
