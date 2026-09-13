# Spec 005 — Best artwork showcase

**Type:** feature spec
**Status:** drafted by agent, awaiting founder/A0 approval (this spec amends TECH-SPEC §7, §8, §11, §15, and requests a new-dependency approval per FR-5a)
**Source of truth:** `design/phase_1.1/SLGA Phase 1.dc.html` (lines 343–374, 497–526, 604–622, 861–897), `docs/SLGA-PHASE-1-TECH-SPEC.md`
**Depends on:** Specs 001–004 (shipped — public site, Sanity CMS, content/release readiness)

## Problem statement

The Phase 1.1 design (`design/phase_1_1/`) adds a page not present in the
original TECH-SPEC: a community artwork showcase at `/showcase`, navigable
from a new "Showcase" entry between Rules and Announcements. The design ships
its own mock data model and interaction spec, including a line the designer
left as a direct instruction to the CMS engineer:

```
// future Sanity type: artwork { title, artist, game, image+alt, sourceUrl, displayOrder, enabled }
```

This spec turns that design into a real route, a real Sanity document type,
and a real content-adapter contract — following exactly the pattern specs
001–002 already established for every other content type on this site — and
extends it in two directions the user asked for explicitly: **materially
better mobile ergonomics** than the reference design, and **entrance/transition
animation** consistent with the site's existing motion language
(`slga-rise` in `apps/web/src/styles/globals.css`).

## What the reference design specifies

Read directly from `design/phase_1_1/SLGA Phase 1.dc.html` and
`support.js`:

- **Grid page** (`isShowcase`, lines 343–374): eyebrow "COMMUNITY SHOWCASE",
  H1 "Best artwork", intro copy, a meta line ("SHOWING N PIECES · CURATED IN
  THE CMS · NEWEST FIRST"), then a CSS grid of cards
  (`repeat(auto-fill, minmax(artMin, 1fr))`, 4:5 image tiles, order badge,
  title, artist credit, game tag + date), and a closing CTA telling members
  how to get featured.
- **Full-screen lightbox** (`artOpen`, lines 497–526): a `role="dialog"`
  overlay with a position indicator ("i / total"), a close button, prev/next
  arrow buttons, a touch-swipeable stage, and a bottom info bar (title,
  artist, game, date, "View original post ↗" linking to the source Facebook
  post). Layout direction flips from row to column under the `sm` breakpoint.
- **Interaction logic** (`support.js` lines 671–697, 845–897): `stepArt`
  wraps modulo the list length; `Escape` closes the lightbox or the mobile
  menu; `ArrowLeft`/`ArrowRight` step the lightbox when open; touch swipe
  fires on a 48px horizontal delta; opening the lightbox moves focus to its
  close button (matching the existing `MobileNav` focus-management pattern
  already shipped in `apps/web/src/components/layout/mobile-nav.tsx`).
- **Mock data model** (lines 604–622): sixteen artwork entries, each with
  title, artist credit, game, ISO date, and display date — no image asset,
  since this is a design-stage mock.

## What this spec changes versus the reference design

The reference design is a visual/interaction reference to rebuild, not to
paste in (per `AGENTS.md` / `docs/TASKS.md` rule 4). Three deliberate
departures, each because the user asked for better mobile UI and real
animation than a static mock can specify:

| # | Reference design | This spec | Why |
| --- | --- | --- | --- |
| D1 | Meta line claims "NEWEST FIRST" but the mock array has no independent ordering field — display order equals array order | Sort by `displayOrder` (curator-controlled), matching every other collection on this site (`rule`, `facebookFeature`) | Consistency: this is the one CMS-driven list on the site that would otherwise use a different ordering convention for no reason. Meta line copy changes to "CURATED ORDER · UPDATED BY ADMINS" |
| D2 | Lightbox stage height is `vh`-based (`54vh`/`68vh`) | Use `dvh` with a `vh` fallback | Mobile browser chrome show/hide resizes `100vh` mid-interaction, causing the stage to jump under the user's thumb — the exact "worse mobile UI" this spec is asked to improve on |
| D3 | Grid and lightbox appear instantly, no motion | Grid tiles enter with a capped, staggered `animate-rise` (existing keyframe); the lightbox backdrop fades and its panel scale-fades in; slide transitions are Embla's built-in motion | Direct ask ("with animations"); layered on top of shadcn Carousel's own transition rather than reinventing one |
| D4 | Design hand-rolls the dialog and its touch/keyboard/focus logic from scratch (as `MobileNav` also does) | Lightbox chrome is shadcn/ui `Dialog` (Radix) and the stage/step/swipe mechanic is shadcn/ui `Carousel` (Embla) | Explicit instruction to use exact shadcn components (see FR-5a) instead of a third hand-rolled implementation; Radix `Dialog` already supplies the focus trap, `aria-modal`, and Escape-to-close that `MobileNav` had to build manually, and Embla already supplies swipe + keyboard stepping |

Everything else in the design's interaction spec (position indicator,
"View original post" link, info-bar direction flip) is adopted as-is.
Focus management, Escape handling, swipe threshold, and keyboard arrows are
no longer hand-rolled per-D4 — they come from the two shadcn primitives,
verified against the design's acceptance behaviour rather than reimplemented
from `MobileNav`.

## Goals

1. `/showcase` exists as a real, indexable route with founder-editable content
   in Studio — no artwork data lives in a `.ts` file.
2. The grid and lightbox work correctly and comfortably on a 320px-wide phone,
   not just at desktop width — this is the explicit "better mobile UI" bar.
3. Opening, closing and stepping through the lightbox is animated, and the
   grid has a tasteful entrance animation, both respecting
   `prefers-reduced-motion` (already enforced globally in `globals.css`).
4. Every field the page renders is validated in Studio: alt text, `https`
   source URLs, and required title/artist/game.
5. The lightbox uses shadcn/ui's own `Dialog` and `Carousel` components
   exactly as documented, rather than a third hand-rolled modal/swipe
   implementation — see FR-5a for the resulting dependency addition, which
   is the one deliberate exception to "no new dependency" in this spec.

## Non-goals

- A per-artwork detail route or shareable URL beyond `/showcase` itself. The
  lightbox is a same-page overlay (matches the reference design; simpler,
  and consistent with how the design treats this as a single curated page
  rather than a content archive).
- Public submission of artwork through the website. Submission stays
  Facebook-group-based, as the design's closing CTA already states.
- Zooming/panning inside the lightbox, or serving multiple image sizes beyond
  what `@sanity/image-url` already provides via `next/image`.
- Pagination. Founders curate a bounded, hand-picked set (design defaults to
  16); if this grows unbounded later, that is a separate spec.
- Populating real artwork content — this spec ships the schema and page;
  founders add pieces afterward (parallel to how Spec 002 shipped the CMS
  before Spec 003 populated it).

## Actors

| Actor | Capability in this spec |
| --- | --- |
| Founder/editor | Curates artwork documents in Studio: title, artist credit, game, image+alt, source URL, order, enabled |
| Visitor | Browses the grid, opens the lightbox, views full-size art, follows through to the original Facebook post |
| Implementation agent | Adds the `artwork` schema, the route, the grid/lightbox components, the analytics events |

## User journeys

1. A visitor taps "Showcase" in the mobile nav, sees a 2-column grid on their
   phone with no horizontal scroll, and taps a tile.
2. The lightbox opens with a subtle scale-fade, focus lands on its close
   button, and swiping left steps to the next piece with a smooth crossfade.
3. A visitor on desktop uses the keyboard: `→`/`←` step through pieces,
   `Escape` closes the lightbox and returns focus to the tile that opened it.
4. A visitor taps "View original post ↗" and lands on the credited Facebook
   post in a new tab.
5. A founder adds a seventeenth piece in Studio without an alt text and is
   blocked from publishing.
6. A founder disables a piece; it disappears from the grid without changing
   any other piece's position number.
7. No artwork has been curated yet: the page shows an empty state, not a
   broken grid or a runtime error.

## Functional requirements

**FR-1 — Route.** `apps/web/src/app/showcase/page.tsx`, an async Server
Component fetching `content.getArtworks()`. Adds "Showcase" to `NAV_ITEMS`
and `SITE_LINKS` in `apps/web/src/app/layout.tsx`, positioned between Rules
and Announcements, matching the design's nav order.

**FR-2 — Content type.** New Sanity document `artwork`:
`title` (string, required), `artist` (string, required — credit line, not a
member account), `game` (string, required), `image` (`imageWithAlt`,
required), `sourceUrl` (url, required, `https` only), `displayOrder`
(integer, required, min 1), `enabled` (boolean, default true). Ordered by
`displayOrder` in both Studio and the public query, with `_createdAt` as a
deterministic tiebreak — the same convention already used for `rule` and
`facebookFeature`.

**FR-3 — Content adapter.** Add to `lib/content/types.ts`:
```ts
export interface Artwork {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly game: string;
  readonly image: ImageRef;
  readonly sourceUrl: string;
  readonly displayOrder: number;
}
```
and `getArtworks(): Promise<Artwork[]>` on `ContentAdapter`, implemented in
both `seedAdapter` and `sanityAdapter`, ordered by `displayOrder` ascending
with disabled pieces excluded — mirroring `getFacebookFeatures()` exactly.

**FR-4 — Grid.** `apps/web/src/components/sections/artwork-grid.tsx`
(Client Component — owns lightbox open/close state). Responsive
`auto-fill` grid; tile = 4:5 image, order badge, title, artist, game + date
meta is dropped (the schema has no per-piece date — `_createdAt` is an
implementation detail, not editorial content, so it is not displayed;
see open question Q1). Each tile is a real interactive element (`button`,
not an anchor to a URL that never navigates) opening the lightbox at that
index.

**FR-5 — Lightbox.** `apps/web/src/components/sections/artwork-lightbox.tsx`
(Client Component), built from two shadcn/ui primitives rather than
hand-rolled, per the user's explicit instruction to use the exact shadcn
components:

- **`Dialog`** (`apps/web/src/components/ui/dialog.tsx`, generated by
  `npx shadcn@latest add dialog`) supplies the modal chrome: `DialogContent`
  (full-bleed, `role="dialog"` `aria-modal="true"` already wired by Radix),
  a visually-hidden `DialogTitle` (required by Radix for a11y — set to the
  artwork's title, not shown redundantly in the visible header), and
  `DialogClose` for the close button. Radix supplies the focus trap,
  Escape-to-close, and focus-restore to the triggering tile out of the box
  — this spec does not reimplement `MobileNav`'s manual trap for this
  component.
- **`Carousel`** (`apps/web/src/components/ui/carousel.tsx`, generated by
  `npx shadcn@latest add carousel`, built on `embla-carousel-react`)
  supplies the stage: `CarouselContent`/`CarouselItem` per artwork,
  `CarouselPrevious`/`CarouselNext` restyled to match the design's 48px
  square icon buttons, and swipe/keyboard-arrow stepping via Embla's own
  gesture and keyboard handling. The `setApi`/`CarouselApi` pattern
  (documented by shadcn) drives the position indicator ("i / total") and is
  seeded with `startIndex` equal to the tapped grid tile's index.

The position indicator, "View original post ↗" external link, and the
info-bar direction flip to column under the `nav` breakpoint (700px) are
adopted from the design as-is, rendered inside `DialogContent` below the
`Carousel`. Close/prev/next icons use `lucide-react` (`X`, `ChevronLeft`,
`ChevronRight`) — already a project dependency — instead of the design's
raw glyph characters.

**FR-5a — New dependency (approval required).** Adopting shadcn/ui `Dialog`
and `Carousel` as specified in FR-5 requires adding, none of which are
currently installed in `apps/web`:

| Package | Why |
| --- | --- |
| `@radix-ui/react-dialog` | `Dialog` primitive itself |
| `embla-carousel-react` | `Carousel` primitive itself |
| `clsx` | shadcn-generated components import this for conditional classes |
| `class-variance-authority` | shadcn-generated `Button`/variant styling used inside `DialogContent` |

`tailwind-merge` and `lucide-react` are already present. A `cn()` helper in
`apps/web/src/lib/utils.ts` does not exist yet and is created by the shadcn
CLI's `add` command the first time it runs. This is the one deliberate
exception to Plan 002/004's "no new dependency" discipline in this spec,
made explicit here rather than silently added — AGENTS.md requires approval
before dependency or lockfile changes.

**FR-6 — Animation.** Two new CSS utilities in `globals.css`, extending the
existing `slga-rise` keyframe rather than introducing a new system:
- Grid tiles animate in with `animate-rise`, staggered via inline
  `animation-delay`, capped (e.g., first 8 tiles stagger, the rest share the
  final delay) so a 16-tile grid does not make the last row wait visibly.
- A `slga-scale-in` keyframe (opacity + `scale(0.97 → 1)`) for the lightbox
  panel; the backdrop uses a plain opacity fade.
All animation is already covered by the existing global
`prefers-reduced-motion` block — no new media query needed.

**FR-7 — Analytics.** Extend the closed `AnalyticsEvent` union in
`apps/web/src/lib/analytics.ts` with two events:
- `artwork_open` — `{ artwork_id: string, placement: "showcase" }`, fired
  when the lightbox opens.
- `artwork_source_click` — `{ artwork_id: string }`, fired on "View original
  post ↗".
This is the same pattern as `facebook_feature_click` and widens a
security-relevant closed list (TECH-SPEC §15) — flagged for approval below.

**FR-8 — Mobile ergonomics (the explicit "better" bar).** All interactive
targets in the grid and lightbox are ≥44px, matching the site-wide minimum
already used in `MobileNav` and the mobile CTA bar. The lightbox stage uses
`dvh` (falling back to `vh` for browsers that lack it) instead of a plain
`vh`, to avoid the stage resizing when mobile browser chrome shows/hides
mid-swipe. The grid's minimum tile width is chosen so a 320px viewport shows
at least two full columns with no horizontal scroll. The lightbox bottom bar
respects `env(safe-area-inset-bottom)`, matching the existing
`MobileCtaBar` pattern.

## Acceptance criteria

- [ ] `/showcase` renders server-side with real founder content once
      configured; shows an empty state with zero artwork documents.
- [ ] A 320px viewport shows the grid with no horizontal overflow and at
      least two columns.
- [ ] Tapping a tile opens the lightbox with focus on its close button;
      `Escape` closes it and returns focus to the originating tile.
- [ ] `ArrowRight`/`ArrowLeft` step the lightbox when it is open and do
      nothing when it is closed.
- [ ] A left/right swipe of >48px steps the lightbox on touch devices.
- [ ] The lightbox position indicator reads `i / total` correctly at both
      ends of the list (wraps, does not go out of bounds).
- [ ] "View original post ↗" opens `sourceUrl` in a new tab with
      `rel="noopener noreferrer"`.
- [ ] An `artwork` document without alt text, without a `https` source URL,
      or missing any required field cannot be published.
- [ ] Disabling an artwork document removes it from the grid without
      shifting other pieces' `displayOrder`.
- [ ] With `prefers-reduced-motion: reduce`, no entrance/transition animation
      plays (verified against the existing global rule — no feature-specific
      override needed).
- [ ] `pnpm lint` and `pnpm typecheck` pass for both `apps/web` and
      `apps/studio`.

## Edge cases

| Case | Expected behaviour |
| --- | --- |
| Zero enabled artwork | Grid section shows an empty-state message (mirrors `/announcements`' empty state), no lightbox affordance |
| Exactly one enabled artwork | Lightbox opens with prev/next controls that wrap to the same item (matches `stepArt`'s modulo behaviour) rather than being hidden |
| `sourceUrl` uses `http://` | Blocked at Studio validation, not silently accepted |
| Two artworks share `displayOrder` | Publishes with a Studio warning; `_createdAt` breaks the tie deterministically |
| Visitor opens the lightbox, then resizes past the `nav` breakpoint | Info bar direction re-flows on the next render; no state is lost |
| Visitor navigates directly to `/showcase#somehash` | No per-item deep link exists (non-goal); the grid loads normally, hash is ignored |

## Assumptions

- **A1** — "Artist" is a free-text credit line supplied by the founder, not a
  linked member account or profile — there are no member accounts in Phase 1
  (TECH-SPEC §8.2 empty-state rules, §11 generally).
- **A2** — Images are founder-uploaded into Sanity (consistent with
  `coverImage`/`facebookFeature.image`), not hot-linked from Facebook.
- **A3** — `dvh` unit support (Safari 15.4+, Chrome 108+) is acceptable
  given the fallback `vh` value; this does not raise the site's baseline
  browser support beyond what TECH-SPEC already targets.

## Open questions

| # | Question | Blocks | Default if unanswered |
| --- | --- | --- | --- |
| Q1 | Should artwork carry an editorial date (e.g., "featured on") separate from `_createdAt`, to preserve the design's date chip in the grid/lightbox? | FR-2/FR-3 field list | Omit the date chip; ship without it (current draft) |
| Q2 | Approve widening `AnalyticsEvent` with `artwork_open`/`artwork_source_click` (FR-7)? | FR-7 only — the rest of the page ships without analytics if unanswered | Ship without these two events; add them once approved |
| Q3 | Approve the TECH-SPEC amendment adding §7 route, §8.7 page spec, §11.7 schema, and the two §15 events? | Nothing blocks implementation; this is a documentation formality mirroring Spec 002's Q1 pattern | Proceed with implementation; land the TECH-SPEC amendment in the same change |
| Q4 | Approve adding `@radix-ui/react-dialog`, `embla-carousel-react`, `clsx`, `class-variance-authority` (FR-5a) to use the exact shadcn `Dialog`/`Carousel` components as instructed? | FR-5/FR-5a — the lightbox specifically | Treated as approved by the explicit "use exact shadcn components" instruction that produced FR-5a; recorded here so the dependency addition is visible and reviewable rather than silently bundled into a component commit |

## Approval status

Agent-drafted. Implementation may proceed on the uncontested majority (route,
schema, grid, lightbox, mobile/animation work) while Q1–Q3 are resolved; Q2
specifically gates only the two new analytics events, not the page itself.
Q4 (the shadcn `Dialog`/`Carousel` dependency addition) is treated as
approved via the explicit instruction that drove FR-5a, but is still called
out per AGENTS.md's dependency-approval rule rather than folded silently
into implementation.
