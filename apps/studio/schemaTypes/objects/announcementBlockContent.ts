import { defineArrayMember, defineType } from "sanity";

/**
 * Restricted Portable Text for announcement bodies (TECH-SPEC §11.3). Same
 * allowlist as `rulesBlockContent` plus h2, blockquote, and inline images
 * with required alt text - matching
 * `apps/web/src/components/portable-text/announcement-portable-text.tsx`
 * exactly. No raw HTML, scripts, iframes or arbitrary embeds.
 */
export const announcementBlockContent = defineType({
  name: "announcementBlockContent",
  title: "Announcement body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
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
    defineArrayMember({ type: "imageWithAlt" }),
  ],
});
