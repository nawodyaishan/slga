# Spec 006 — Responsive Buttons & shadcn/ui Button Alignment

## Status
- **Phase:** Design & Implementation
- **Author:** Antigravity (Agent A1)
- **Approved by:** User Request ("make all buttons responsive or use shadcn preserving all original styles")
- **Target workspace:** `apps/web`

## Context & Objectives
The SLGA Phase 1 site features call-to-action buttons, navigation triggers, and interactive elements across various pages (Hero, Mobile CTA Bar, Community CTAs, Rules outro, 404, Announcements detail, Artwork Lightbox, Header, and Mobile Nav).

While desktop layouts look great, on mobile screens (especially 320px–480px viewports):
1. Paired button groups (such as the Hero and 404 CTAs) suffer from horizontal cramping and awkward line breaks when long text (e.g. "Join Facebook Community" ~ 23 characters) is displayed side-by-side with another CTA.
2. Button components across the codebase were previously written as one-off Tailwind classes instead of leveraging the shared `buttonVariants` (cva pattern from shadcn/ui).
3. The existing `Button` component in `apps/web/src/components/ui/button.tsx` did not use `class-variance-authority` (cva), lacked standard size/variant exports, and lacked responsive width modifiers.

This specification modernizes `Button` to the shadcn/ui `cva` architecture while **strictly preserving 100% of the original visual design language, colors, borders, typography, and hover effects**, and makes all button layouts fully responsive across all viewports down to 320px.

---

## Requirements

### FR-1: Unified shadcn-compatible Button Component (`buttonVariants` via `cva`)
Refactor `apps/web/src/components/ui/button.tsx` to use `class-variance-authority` (`cva`):
1. **Base styles**:
   `inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-[-0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap`
2. **Variants**:
   - `solid` (or `default`): `bg-accent text-accent-ink hover:bg-accent-soft active:bg-accent-soft/90`
   - `surface`: `border border-border bg-surface text-foreground hover:border-accent hover:bg-surface-raised`
   - `outline`: `border border-border bg-transparent text-foreground hover:border-accent hover:text-accent`
   - `ghost`: `bg-transparent text-foreground hover:text-accent hover:bg-surface`
   - `destructive`: `bg-red-600 text-white hover:bg-red-700`
3. **Sizes**:
   - `default`: `min-h-11 rounded-[10px] px-6 text-[16px]` (meets $\ge 44\text{px}$ touch target)
   - `hero`: `min-h-[54px] rounded-[10px] px-6 text-[16px] leading-none`
   - `sm`: `min-h-10 rounded-[9px] px-4 text-[13.5px] sm:text-[14px]`
   - `lg`: `min-h-13 rounded-[10px] px-6.5 text-base`
   - `icon`: `size-11 rounded-[10px] p-0`
4. **Polymorphism & Accessibility**:
   - Supports rendering as `<button>` or `<a>` (when `href` is present).
   - Supports `React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>`.
   - Supports `fullWidth?: boolean` or responsive classes (`w-full sm:w-auto`).
   - Export `buttonVariants` helper from `button.tsx` and `ui/index.ts` so other components (`Link`, `CommunityCtaLink`, `CarouselPrevious`, etc.) can consume the exact same classes.

### FR-2: Responsive Button Layouts
Update all CTA and button groups to behave responsively:
1. **Hero (`Hero.tsx`)**:
   - Change CTA container from `flex flex-wrap gap-2.5` to `flex flex-col sm:flex-row flex-wrap gap-2.5`.
   - Buttons scale to full-width on `< sm` viewports (`w-full sm:w-auto`) with centered text, preventing "Join Facebook Community" from clipping or wrapping awkwardly on 320px–375px screens.
2. **Not Found (`not-found.tsx`)**:
   - Change action buttons container to `flex flex-col sm:flex-row flex-wrap justify-center gap-3`.
   - Buttons scale `w-full sm:w-auto` for comfortable tapping.
3. **Community CTA (`community-cta.tsx`)**:
   - Ensure card action buttons span `w-full` inside each card with `min-h-13` and centered alignment.
4. **Rules Outro (`rules-page.tsx`)**:
   - CTA card outro button `Join Discord` scales to `w-full sm:w-auto` on mobile.
5. **Announcement Detail (`announcements/[slug]/page.tsx`)**:
   - Navigation row wraps cleanly on narrow screens (`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5`).
6. **Mobile CTA Bar (`mobile-cta-bar.tsx`)**:
   - Add `truncate text-center px-2` to prevent label overflow on ultra-narrow viewports.
7. **Lightbox & Carousel (`artwork-lightbox.tsx`, `carousel.tsx`)**:
   - Carousel navigation buttons ensure at least 44x44px touch target on mobile (`h-11 w-11`).
   - Dialog close button maintains `size-11` (44x44px) touch target.
   - "View original post" button retains full-width on mobile (`w-full nav:w-auto`).

### NFR-1: Visual Fidelity Preservation
All original colors, borders, radius tokens (`rounded-[9px]`, `rounded-[10px]`, `rounded-[11px]`, `rounded-full`), fonts (`font-sans`, `font-mono`), and hover transitions must remain identical to the original phase 1 visual design.

### NFR-2: Strict Code Quality & Build Passing
All changes must pass:
- `pnpm --filter @slga/web lint` (0 errors)
- `pnpm typecheck` (0 errors)
- `make build` (0 errors)
