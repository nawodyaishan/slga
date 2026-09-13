import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { resolveSanityImage, type SanityImageField } from "@/lib/sanity/image";

/**
 * Allowlisted renderer for announcement bodies (TECH-SPEC.md §11.3):
 * paragraphs, h2/h3, bold, italic, links, lists, block quotes, and images
 * with required alt text — matching the article column markup in the design
 * (`design/phase_1/SLGA Phase 1.dc.html` lines 373–378). Any other block,
 * mark or type is not registered here, so `@portabletext/react` falls back
 * to plain text instead of raw HTML.
 *
 * Deviation from the design mock: the prototype never links out mid-article,
 * so it has no rule for link target behavior. This renderer opens only
 * absolute `http(s)` links in a new tab (with `rel="noopener noreferrer"`);
 * anything else (e.g. an in-page anchor) opens in place.
 */
export const announcementPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-article leading-[1.78] text-[color:var(--color-body)]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-4 text-h3 font-bold leading-[1.2] tracking-[-0.025em] text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-h3 font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="rounded-xl border border-border border-l-2 border-l-accent bg-surface-sunken px-6 py-5 text-article leading-[1.7] text-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : undefined;
      if (!href) return <>{children}</>;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="text-accent underline underline-offset-2"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col gap-2.5 list-none p-0">{children}</ul>,
    number: ({ children }) => <ol className="flex flex-col gap-2.5 list-none p-0">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-article leading-[1.7] text-[color:var(--color-body)]">
        <span aria-hidden="true" className="mt-[0.6em] h-[5px] w-[5px] flex-none rounded-full bg-accent" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="flex gap-3 text-article leading-[1.7] text-[color:var(--color-body)]">
        <span aria-hidden="true" className="mt-[0.6em] h-[5px] w-[5px] flex-none rounded-full bg-accent" />
        <span>{children}</span>
      </li>
    ),
  },
  types: {
    // In-body images arrive as a raw Sanity image reference (the same shape
    // `resolveSanityImage` already handles for cover images), not a
    // pre-resolved `ImageRef` — resolve it here so the renderer works for
    // both the sanity adapter and any future seed content with inline images.
    image: ({ value }) => {
      const resolved = resolveSanityImage(value as SanityImageField, { width: 1600, height: 900 });
      if (!resolved) return null;
      return (
        <span className="block overflow-hidden rounded-2xl border border-border">
          <Image
            src={resolved.src}
            alt={resolved.alt}
            width={resolved.width ?? 1600}
            height={resolved.height ?? 900}
            sizes="(min-width: 72rem) 72ch, 100vw"
            className="h-auto w-full"
          />
        </span>
      );
    },
  },
};
