import { defineArrayMember, defineType } from "sanity";

/**
 * Restricted Portable Text for rule bodies (TECH-SPEC §11.2). The allowlist
 * below must match `apps/web/src/components/portable-text/rules-portable-text.tsx`
 * exactly: normal paragraphs, h3, strong/em marks, https-only links, and
 * bullet/numbered lists. No image type, no h1/h2, no blockquote - any style
 * permitted here but not registered in the renderer degrades to plain text.
 */
export const rulesBlockContent = defineType({
  name: "rulesBlockContent",
  title: "Rule body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 3", value: "h3" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.required().uri({ scheme: ["https"] }),
              },
            ],
          },
        ],
      },
    }),
  ],
});
