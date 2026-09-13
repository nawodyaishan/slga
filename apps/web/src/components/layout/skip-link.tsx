/**
 * Must be the first focusable element in the document. Visually hidden until
 * it receives keyboard focus, per TECH-SPEC.md §16.
 */
export function SkipLink() {
  return (
    <a
      href="#slga-main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-[18px] focus:py-3.5 focus:font-sans focus:text-[14px] focus:font-semibold focus:text-accent-ink"
    >
      Skip to content
    </a>
  );
}
