# Tasks 005 — Best artwork showcase

**Spec:** `specs/005-artwork-showcase/spec.md` · **Plan:** `specs/005-artwork-showcase/plan.md`
**Status legend:** `todo` · `blocked` · `in-progress` · `done`

---

## P5-01 — `artwork` Sanity document type

- **Objective:** Define the `artwork` document type — `title`, `artist`, `game`, `image` (reuses `imageWithAlt`), `sourceUrl`, `displayOrder`, `enabled`.
- **Source:** Spec FR-2; `design/phase_1.1/SLGA Phase 1.dc.html:604` (`// future Sanity type: artwork {...}` comment); `apps/studio/schemaTypes/facebookFeature.ts` as the closest structural precedent (single image + external URL + displayOrder + enabled)
- **Allowed paths:** `apps/studio/schemaTypes/artwork.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** `title`/`artist`/`game` required strings; `image` required `imageWithAlt` (alt enforced by the shared object); `sourceUrl` required, `Rule.uri({ scheme: ['https'] })` — an `http://` value fails; `displayOrder` required integer ≥ 1; `enabled` boolean, default `true`. Preview shows order + title + enabled state, mirroring `facebookFeature`'s preview.
- **Verify:** `pnpm --filter @slga/studio exec tsc --noEmit`; paste an `http://` URL in Studio and confirm it blocks publish.
- **Depends on:** — (reuses existing `objects/imageWithAlt.ts` from Spec 002)
- **Risk:** Low
- **Status:** done

## P5-02 — Register `artwork` in schema barrel and Studio structure

- **Objective:** Add `artwork` to `schemaTypes/index.ts` and give it an ordered list item in Studio navigation (not a singleton — an ordered collection, same shape as `rule`/`facebookFeature`).
- **Source:** Spec FR-2; `apps/studio/schemaTypes/index.ts`; `apps/studio/structure/index.ts`
- **Allowed paths:** `apps/studio/schemaTypes/index.ts`, `apps/studio/structure/index.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** `artwork` appears in Studio's desk navigation, orderable/listable like `rule`; no singleton enforcement (`document.actions`/`newDocumentOptions`) applied to it.
- **Verify:** `pnpm --filter @slga/studio exec tsc --noEmit`; `make dev-studio`, confirm the new list item and that "Create new" works without restriction.
- **Depends on:** P5-01
- **Risk:** Low
- **Status:** done

## P5-03 — `Artwork` content-adapter type and interface method

- **Objective:** Add `Artwork` to `lib/content/types.ts` and `getArtworks(): Promise<Artwork[]>` to `ContentAdapter`.
- **Source:** Spec FR-3; `apps/web/src/lib/content/types.ts` (full interface, read this session)
- **Allowed paths:** `apps/web/src/lib/content/types.ts`
- **Forbidden paths:** `apps/studio/`
- **Acceptance:** `Artwork` has `id`, `title`, `artist`, `game`, `image: ImageRef`, `sourceUrl`, `displayOrder` — no field the page doesn't render (no unused surface). `ContentAdapter.getArtworks()` documented the same way every other method is (ordered, enabled-only, per Spec FR-3).
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit` (will fail until P5-04/05 implement it — expected until this sub-slice lands together).
- **Depends on:** —
- **Risk:** Low
- **Status:** done

## P5-04 — `seedAdapter.getArtworks()`

- **Objective:** Implement the seed/dev fixture, adapted from the design's `artworkData` mock (title/artist/game fields), dropping the per-item date field per spec D1/Q1 default.
- **Source:** Spec FR-3; `design/phase_1.1/SLGA Phase 1.dc.html:605-622` (`artworkData` mock); `apps/web/src/lib/content/seed.ts`
- **Allowed paths:** `apps/web/src/lib/content/seed.ts`
- **Forbidden paths:** `apps/studio/`
- **Acceptance:** Returns a non-empty, `displayOrder`-sorted fixture array satisfying the new `Artwork` type — enough entries (≥6) to meaningfully exercise the grid and lightbox stepping in dev.
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`; `pnpm dev` (seed mode), confirm `/showcase` renders fixture data.
- **Depends on:** P5-03
- **Risk:** Low
- **Status:** done

## P5-05 — `sanityAdapter.getArtworks()` + GROQ query

- **Objective:** New `ARTWORK_QUERY` (ordered by `displayOrder` asc, `_createdAt` tiebreak, `enabled == true` filter) and `mapArtwork` mapper; wire into the Sanity-backed adapter.
- **Source:** Spec FR-3; `apps/web/src/lib/sanity/queries.ts` (`FACEBOOK_FEATURES_QUERY`/`mapFacebookFeature` as the direct structural precedent)
- **Allowed paths:** `apps/web/src/lib/sanity/queries.ts`, the sanity adapter implementation file
- **Forbidden paths:** `apps/studio/`
- **Acceptance:** Query excludes `enabled == false` documents; mapper produces a fully-typed `Artwork`, no `as` casts. Ordering matches `displayOrder`, then `_createdAt`.
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`; once P5-01/02 are live in a dataset, compare seed vs. Sanity output route-by-route (Plan 002's own verification pattern).
- **Depends on:** P5-01, P5-03
- **Risk:** Low
- **Status:** done

## P5-06 — Sanity typegen regeneration

- **Objective:** Run `sanity typegen` after P5-01 lands so `sanity.types.ts` includes the generated `Artwork`-backing shape, and confirm `mapArtwork` (P5-05) consumes the generated type rather than a hand-written one.
- **Source:** Plan 002's typegen precedent; `apps/web/src/lib/sanity/sanity.types.ts`
- **Allowed paths:** `apps/web/src/lib/sanity/sanity.types.ts`
- **Forbidden paths:** everything else
- **Acceptance:** Generated types include the new `artwork` document shape; no hand-written `Raw*` interface reintroduced for it.
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`
- **Depends on:** P5-01
- **Risk:** Low
- **Status:** done

## P5-07 — shadcn `Dialog` + `Carousel` installation

- **Objective:** Run `npx shadcn@latest add dialog carousel` in `apps/web`, per the explicit instruction to use the exact shadcn components (spec FR-5/FR-5a, Q4). This is the task that actually changes `package.json`/lockfile — isolated so the dependency diff is reviewable on its own.
- **Source:** Spec FR-5a; shadcn/ui docs (`ui.shadcn.com/docs/components/dialog`, `/carousel`) confirmed via context7 this session
- **Allowed paths:** `apps/web/package.json`, `apps/web/pnpm-lock.yaml` (or root lockfile, whichever pnpm updates), `apps/web/components.json`, `apps/web/src/lib/utils.ts`, `apps/web/src/components/ui/dialog.tsx`, `apps/web/src/components/ui/carousel.tsx`
- **Forbidden paths:** `apps/studio/`, any file not generated/touched by the CLI command itself
- **Acceptance:** `@radix-ui/react-dialog`, `embla-carousel-react`, `clsx`, `class-variance-authority` appear in `apps/web/package.json` as direct dependencies; the two generated component files compile as-is with no manual edits in this task (styling happens in P5-09).
- **Verify:** `pnpm install`; `pnpm --filter @slga/web exec tsc --noEmit`; `git diff --stat` reviewed to confirm only the expected files changed.
- **Depends on:** — (can run any time; gated on Q4 approval per spec, treated as approved by explicit instruction)
- **Risk:** Low — mechanical CLI step, but the one task in this file that touches the lockfile, so flagged for extra review.
- **Status:** done

## P5-08 — `/showcase` route and empty state

- **Objective:** New Server Component route calling `content.getArtworks()`, rendering the grid (P5-10) or an empty-state message when the array is empty.
- **Source:** Spec FR-1; `apps/web/src/app/announcements/page.tsx` as the direct template (metadata export, `Container`/`Eyebrow`, empty-state pattern)
- **Allowed paths:** `apps/web/src/app/showcase/page.tsx`
- **Forbidden paths:** `apps/studio/`, other routes
- **Acceptance:** Metadata (title/description) present; empty state is plain text, not a broken grid, when `getArtworks()` returns `[]`; page reads eyebrow "COMMUNITY SHOWCASE" / H1 "Best artwork" / intro copy from the design (lines 347-349), with the meta line changed per spec D1 to "CURATED ORDER · UPDATED BY ADMINS" instead of the design's "NEWEST FIRST" claim.
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`; `pnpm dev`, visit `/showcase` with seed data, then temporarily empty the seed array to check the empty state.
- **Depends on:** P5-04
- **Risk:** Low
- **Status:** done

## P5-09 — Nav entry wiring

- **Objective:** Add "Showcase" to `NAV_ITEMS`/`SITE_LINKS` in `layout.tsx`, positioned between Rules and Announcements per the design's nav order.
- **Source:** Spec FR-1; `apps/web/src/app/layout.tsx` (`NAV_ITEMS`/`SITE_LINKS` section); `design/phase_1.1/SLGA Phase 1.dc.html:725` (`{ label: "Showcase", href: "#/showcase", route: "showcase" }`)
- **Allowed paths:** `apps/web/src/app/layout.tsx`
- **Forbidden paths:** everything else
- **Acceptance:** "Showcase" appears in desktop nav, mobile nav (`MobileNav`), and footer site links (wherever `SITE_LINKS` is consumed), in the correct order, with no change to `MobileNav`'s own component code.
- **Verify:** `pnpm dev`; visually confirm nav order on desktop and mobile (open the mobile menu).
- **Depends on:** P5-08
- **Risk:** Low
- **Status:** done

## P5-10 — Artwork grid component

- **Objective:** `artwork-grid.tsx` — responsive `auto-fill` grid of 4:5 tiles (order badge, title, artist, game), owning the "which index is open" state and rendering the lightbox (P5-11) when non-null. Staggered `animate-rise` entrance.
- **Source:** Spec FR-4, FR-6, FR-8; `design/phase_1.1/SLGA Phase 1.dc.html:353-372` (grid markup, `artMin`/`artGap` responsive tokens at lines ~875-882)
- **Allowed paths:** `apps/web/src/components/sections/artwork-grid.tsx`
- **Forbidden paths:** `apps/studio/`, `apps/web/src/components/ui/`
- **Acceptance:** Tiles are real `<button>` elements (not inert anchors), each opening the lightbox at that index; grid `minmax()` floor chosen so a 320px viewport shows ≥2 columns with no horizontal scroll (FR-8); every interactive target ≥44px; first N tiles stagger in via `animate-rise` with a capped `animation-delay`, remaining tiles share the final delay bucket (no unbounded stagger math per plan's failure-mode table).
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`; resize devtools to 320px width, confirm no horizontal overflow and ≥2 columns; toggle `prefers-reduced-motion: reduce` and confirm tiles render with no animation.
- **Depends on:** P5-08
- **Risk:** Medium — the concrete "better mobile UI" acceptance bar lives here.
- **Status:** done

## P5-11 — Artwork lightbox: shadcn `Dialog` + `Carousel` composition

- **Objective:** `artwork-lightbox.tsx` — compose the generated `Dialog`/`Carousel` (P5-07) into the design's viewer: position indicator, close button, prev/next, stage, bottom info bar (title/artist/game + "View original post ↗"), info-bar direction flip at the `nav` breakpoint.
- **Source:** Spec FR-5; `design/phase_1.1/SLGA Phase 1.dc.html:497-518` (lightbox markup); shadcn `Dialog`/`Carousel` docs (context7, this session) for `DialogContent`/`DialogTitle`/`DialogClose`, `CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`, `setApi`/`CarouselApi` pattern
- **Allowed paths:** `apps/web/src/components/sections/artwork-lightbox.tsx`
- **Forbidden paths:** `apps/studio/`, `apps/web/src/components/ui/dialog.tsx`, `apps/web/src/components/ui/carousel.tsx` (style via `className` from the consumer, don't fork the generated primitives)
- **Acceptance:** `Carousel` is seeded with `startIndex` = the tapped tile's index via `opts`/`setApi`; the position indicator subscribes to the carousel's `select` event (per the `CarouselApi` pattern) rather than tracking index independently; `DialogTitle` is present but visually hidden (`sr-only`) since the design doesn't show a redundant title; close/prev/next icons are `lucide-react` `X`/`ChevronLeft`/`ChevronRight`; "View original post ↗" uses `target="_blank" rel="noopener noreferrer"`; stage height uses `dvh` with a `vh` fallback declared first in the same rule (FR-8/D2); bottom info bar padding includes `env(safe-area-inset-bottom)`.
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`; manual keyboard pass (Tab stays inside the dialog, Escape closes and returns focus to the triggering tile, ArrowLeft/ArrowRight step); manual touch-swipe pass on a real mobile device or devtools touch emulation; position indicator correct at both list ends (wraps).
- **Depends on:** P5-07, P5-10
- **Risk:** Medium — the composition is new even though the primitives are proven; get the `CarouselApi` wiring and focus-restore right or the dialog silently drops keyboard/screen-reader users.
- **Status:** done

## P5-12 — Reduced-motion and empty/singleton edge cases

- **Objective:** Verify (not implement — this is a check task) that `prefers-reduced-motion: reduce` disables the grid's stagger animation and the `Carousel`'s slide transition, and that a one-item artwork list still opens/steps correctly (wraps to itself rather than hiding controls).
- **Source:** Spec acceptance criteria; existing global reduced-motion rule in `apps/web/src/styles/globals.css`
- **Allowed paths:** none (verification-only; fix forward in P5-10/P5-11 if something fails)
- **Forbidden paths:** n/a
- **Acceptance:** Both edge cases from the spec's edge-case table pass manually.
- **Verify:** Manual — devtools `prefers-reduced-motion` emulation; temporarily trim the seed fixture to one item and exercise the lightbox.
- **Depends on:** P5-10, P5-11
- **Risk:** Low
- **Status:** done

## P5-13 — Analytics events (approval-gated: Q2)

- **Objective:** Add `artwork_open` (`{ artwork_id, placement: "showcase" }`) and `artwork_source_click` (`{ artwork_id }`) to the closed `AnalyticsEvent` union; fire them from the lightbox open handler and the "View original post" link.
- **Source:** Spec FR-7, Q2; `apps/web/src/lib/analytics.ts` (closed union, `track<Name>()` generic — read via codegraph this session)
- **Allowed paths:** `apps/web/src/lib/analytics.ts`, `apps/web/src/components/sections/artwork-lightbox.tsx` (call sites only)
- **Forbidden paths:** `apps/studio/`
- **Acceptance:** Both events added as literal-typed union members, no property widened to `string`; the page functions identically with this task skipped (isolated per plan's design).
- **Verify:** `pnpm --filter @slga/web exec tsc --noEmit`; trigger both events in dev and confirm the analytics call fires with the exact documented shape.
- **Depends on:** P5-11
- **Risk:** Low — isolated by design; revertable in one commit if Q2 is declined.
- **Status:** done

## P5-14 — TECH-SPEC amendment (approval-gated: Q3)

- **Objective:** Add a §7 route row for `/showcase`, a new §8.7 page spec (mirroring the format of §8.1-§8.6), a new §11.7 schema table for `artwork`, and the two new §15 event entries (gated on P5-13 actually landing).
- **Source:** Spec Q3; `docs/SLGA-PHASE-1-TECH-SPEC.md` §7, §8, §11, §15
- **Allowed paths:** `docs/SLGA-PHASE-1-TECH-SPEC.md`
- **Forbidden paths:** everything else
- **Acceptance:** New sections follow the exact table/heading format of the existing §7/§8/§11 entries; §15 additions only included if P5-13 shipped.
- **Verify:** Manual read-through; heading numbering doesn't collide with existing sections.
- **Depends on:** P5-01 through P5-11 (documents what actually shipped, not what was planned)
- **Risk:** Low — documentation only.
- **Status:** done

---

## Parallel-safe groups

- **Group A (schema, no cross-deps):** P5-01 → P5-02 can run alongside P5-03 (types) and P5-07 (shadcn install) — none of these three touch the same files.
- **Group B (content boundary, depends on A):** P5-04, P5-05, P5-06 depend on P5-01/P5-03 but not on each other's files — P5-04 (seed) and P5-05/06 (Sanity + typegen) can run in parallel once P5-01/03 land.
- **Group C (presentation, depends on B + P5-07):** P5-08 → P5-09 (route/nav) can proceed in parallel with P5-10 (grid), which itself must land before P5-11 (lightbox) since the grid owns the open-index state the lightbox consumes.
- **Group D (verification + gated follow-ups):** P5-12 after P5-10/11; P5-13 and P5-14 are independently blocked on Q2/Q3 and do not block anything else.

## Blocked / approval-required

| Task | Blocked on | Default if unanswered | Status |
| --- | --- | --- | --- |
| P5-13 | Q2 — approve widening `AnalyticsEvent` | Skip; page ships without these two events | done |
| P5-14 | Q3 — approve the TECH-SPEC amendment | Skip; implementation proceeds, documentation follow-up deferred | done |
| P5-07 | Q4 — approve the four new `apps/web` dependencies | Treated as approved by the explicit "use exact shadcn components" instruction; still the one task that changes the lockfile, so it's called out here for review rather than silently bundled | done |
