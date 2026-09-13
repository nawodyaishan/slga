# Plan 006 — Responsive Buttons & shadcn/ui Button Alignment

**Spec:** `specs/006-responsive-buttons/spec.md`
**Owner:** A1 (Frontend/UI)

## Implementation Plan

### Step 1: Modernize `Button` with shadcn/ui `cva`
- Refactor `apps/web/src/components/ui/button.tsx`:
  - Import `cva` and `type VariantProps` from `class-variance-authority`.
  - Define `buttonVariants` with:
    - Base styles (focus ring, disabled states, transitions, flex alignment).
    - Variants: `solid` (default), `surface`, `outline`, `ghost`, `destructive`.
    - Sizes: `default` (min-h-11), `hero` (min-h-[54px]), `sm` (min-h-10), `lg` (min-h-13), `icon` (size-11).
  - Implement polymorphic forwardRef (`Button`) supporting `href` or native `<button>`.
  - Export `buttonVariants` and update `apps/web/src/components/ui/index.ts`.

### Step 2: Update Hero and Not-Found Button Layouts
- `apps/web/src/components/sections/hero.tsx`:
  - Change button container to `flex flex-col sm:flex-row flex-wrap gap-2.5`.
  - Update `ctaBase` to `w-full sm:w-auto` so buttons are full-width and touch-friendly on mobile (<640px) without horizontal clipping.
- `apps/web/src/app/not-found.tsx`:
  - Update button container to `flex flex-col sm:flex-row flex-wrap justify-center gap-3`.
  - Update button links to `w-full sm:w-auto text-center justify-center`.

### Step 3: Update Rules Outro, Community CTAs, and Announcement Detail
- `apps/web/src/components/sections/community-cta.tsx`:
  - Ensure card CTA buttons are `w-full` and text-centered.
- `apps/web/src/components/sections/rules-page.tsx`:
  - Make outro button `w-full sm:w-auto justify-center`.
- `apps/web/src/app/announcements/[slug]/page.tsx`:
  - Update footer navigation layout to `flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5`.
  - Outbound CTA is `w-full sm:w-auto justify-center`.

### Step 4: Update Mobile CTA Bar and Lightbox Touch Targets
- `apps/web/src/components/layout/mobile-cta-bar.tsx`:
  - Add `truncate px-2 text-center` to both buttons to prevent text overflow on 320px screens.
- `apps/web/src/components/ui/carousel.tsx`:
  - Ensure `CarouselPrevious` and `CarouselNext` maintain at least 44x44px touch target on mobile (`h-11 w-11`).

### Step 5: Verification
- Run `make lint` (`pnpm --filter @slga/web lint`).
- Run `make typecheck` (`pnpm typecheck`).
- Run `make build` (`pnpm build`).
