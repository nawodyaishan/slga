interface JsonLdProps {
  readonly data: Readonly<Record<string, unknown>>;
}

/** Serializes trusted, code-owned schema data without allowing a closing script tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

