import type { PortableTextComponents } from "@portabletext/react";

/**
 * Allowlisted renderer for rule bodies (TECH-SPEC.md §11.2): paragraphs, h3,
 * bold, italic, links, ordered/bullet lists only - matching the reading
 * column markup in the design (`design/phase_1/SLGA Phase 1.dc.html` lines
 * 286-291). Any other block or mark type is not registered here, so
 * `@portabletext/react` falls back to plain text instead of raw HTML.
 */
export const rulesPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="max-w-[72ch] text-body leading-[1.78] text-[color:var(--color-body)]">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="text-h3 font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
        {children}
      </h3>
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
    bullet: ({ children }) => (
      <ul className="flex max-w-[72ch] flex-col gap-2.5 list-none p-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="flex max-w-[72ch] flex-col gap-2.5 list-none p-0">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-body leading-[1.7] text-[color:var(--color-body)]">
        <span aria-hidden="true" className="mt-[0.55em] h-[5px] w-[5px] flex-none rounded-full bg-border" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="flex gap-3 text-body leading-[1.7] text-[color:var(--color-body)]">
        <span aria-hidden="true" className="mt-[0.55em] h-[5px] w-[5px] flex-none rounded-full bg-border" />
        <span>{children}</span>
      </li>
    ),
  },
};
