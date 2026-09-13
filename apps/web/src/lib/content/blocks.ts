import type { PortableTextBlock } from "@portabletext/react";
import type { RichText } from "./types";

/**
 * Minimal Portable Text builders.
 *
 * Used by the seed adapter (and available to test fixtures) so hand-authored
 * content is structurally identical to what Sanity returns, and therefore
 * exercises the same renderers.
 */

let keySeed = 0;
const nextKey = () => `k${(keySeed += 1).toString(36)}`;

function block(
  style: PortableTextBlock["style"],
  text: string,
  listItem?: "bullet" | "number",
): PortableTextBlock {
  return {
    _type: "block",
    _key: nextKey(),
    style,
    markDefs: [],
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  } as PortableTextBlock;
}

/** A paragraph. */
export const p = (text: string): PortableTextBlock => block("normal", text);

/** A subheading (`h2` in announcements, `h3` in rules). */
export const h2 = (text: string): PortableTextBlock => block("h2", text);
export const h3 = (text: string): PortableTextBlock => block("h3", text);

/** A pull quote. */
export const quote = (text: string): PortableTextBlock => block("blockquote", text);

/** A bullet list. */
export const ul = (items: readonly string[]): PortableTextBlock[] =>
  items.map((item) => block("normal", item, "bullet"));

/** Convenience for the common `paragraph only` body. */
export const prose = (...blocks: (PortableTextBlock | PortableTextBlock[])[]): RichText =>
  blocks.flat();
