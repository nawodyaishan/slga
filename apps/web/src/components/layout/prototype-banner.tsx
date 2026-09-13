/**
 * Persistent notice shown while the active content adapter is provisional
 * (design reference lines 31-36, `showMockNotice`). Disappears the moment a
 * founder-approved Sanity dataset becomes the content source, since
 * `sanityAdapter.provisional` is `false` (TECH-SPEC.md §21).
 */
export function PrototypeBanner() {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5 border-b border-border bg-surface-raised px-5 py-2.5 font-mono text-[11px] leading-[1.5] tracking-[0.04em] text-muted">
      <span className="text-accent">PROTOTYPE</span>
      <span>
        Content on this site is migration input from the approved design prototype and is not yet
        founder-approved for production. Rule translations and announcement bodies are placeholders.
      </span>
    </div>
  );
}
