# Plan 005 — Best artwork showcase

**Spec:** `specs/005-artwork-showcase/spec.md`
**Human architecture approval status:** Draft — Q1–Q3 in the spec are open; uncontested majority may proceed per spec's approval status note
**Primary owner:** A2 (Sanity schema/content adapter) for layers 1–2, A1 (Frontend/UI) for layers 3–5

## Approach

Five layers, built bottom-up, mirroring the sequencing Plan 002 already used
successfully for a new content type:

1. **Schema** — one new Sanity document type, `artwork`, composed from the
   existing `imageWithAlt` object (no new shared primitives needed — this is
   simpler than `announcement`, which needed a whole new Portable Text
   config; artwork has no rich-text body).
2. **Content boundary** — `Artwork` type + `getArtworks()` on `ContentAdapter`,
   implemented in both `seedAdapter` (fixture data, adapted from the design's
   mock array) and `sanityAdapter` (new GROQ query + mapper), so the page
   never touches Sanity directly — same discipline as every other route.
3. **Presentation** — the grid (custom) and the lightbox (shadcn/ui
   `Dialog` + `Carousel`, per explicit instruction — see spec FR-5/FR-5a).
   Built as two components, not one, because the grid is usable (and
   testable) without the lightbox ever mounting. The lightbox itself is
   generated via `npx shadcn@latest add dialog carousel`, then styled to
   match the design, not written from scratch — Radix supplies the focus
   trap/`aria-modal`/Escape handling and Embla supplies swipe + keyboard
   stepping, so this layer is mostly composition and visual styling rather
   than new interaction logic.
4. **Motion** — two CSS additions to `globals.css`, extending `slga-rise`
   for the grid's entrance animation, layered on top of the `Carousel`'s
   own Embla-driven slide transition (no separate crossfade needs writing).
5. **Wiring** — nav entry, route registration, and (gated on spec Q2) the two
   new analytics events.

Gap-style approval gating (spec Q1–Q3) is threaded the same way Plan 002
threaded G1–G6: build the uncontested majority now, leave a single isolated
task for whatever stays gated, so approval doesn't block everything else.

### Why this shape

**No new shared schema object.** `announcement`/`rule` needed
`localizedString`/`localizedText`/block-content because they carry bilingual
rich text. Artwork is English-only, plain-string fields plus one image — it
reuses `imageWithAlt` and needs nothing else. Inventing a primitive for a
single consumer would be the premature abstraction the project's own
conventions warn against.

**`displayOrder`, not "newest first."** The design's copy says "newest
first," but its own mock data has no separate date-added field — display
order is just array order. Every other admin-curated collection on this site
(`rule`, `facebookFeature`) already sorts by `displayOrder`. This plan takes
the established site convention over the design mock's placeholder copy
(see spec D1) — copy changes, not a new ordering mechanism.

**Grid and lightbox are separate Client Components, both owned by an A1
page.** The page itself stays a Server Component (`getArtworks()` runs at
request time, same as `/announcements`); only the interactive pieces below
it are client-rendered, keeping the JS bundle for a slow mobile connection
as small as the current site's precedent already establishes.

**The lightbox is shadcn `Dialog` + `Carousel`, not a hand-rolled third
implementation, because the user explicitly asked for the exact shadcn
components.** `MobileNav` proved the dependency-free pattern works, but
building it a second time for the lightbox (plus swipe-gesture math the
`MobileNav` precedent never needed) is exactly the kind of code shadcn's
Radix/Embla primitives already solve, tested at far larger scale than this
project can independently verify. This is a deliberate departure from
Plan 002/004's "no new dependency" discipline — flagged explicitly as FR-5a
in the spec rather than added quietly.

**Grid entrance animation stays CSS-only.** Only the lightbox needed a real
interaction primitive; the grid's stagger-in effect is decoration, not
interaction, so it keeps using the existing `slga-rise` keyframe rather than
recruiting Embla or Framer Motion for a one-directional entrance effect.

**Analytics widening is isolated to its own task.** Widening a closed,
security-reviewed union (`AnalyticsEvent`) is exactly the kind of change
that should be revertable on its own without touching the page that uses it
— the page must work with or without the two new event calls, so the calls
are added last and can be `git revert`ed in one commit if Q2 is declined.

## Affected modules

| Path | Owner | Change |
| --- | --- | --- |
| `apps/studio/schemaTypes/artwork.ts` | A2 | New — title/artist/game/image/sourceUrl/displayOrder/enabled |
| `apps/studio/schemaTypes/index.ts` | A2 | Register `artwork` in the barrel |
| `apps/studio/structure/index.ts` | A2 | Add an ordered list item for `artwork` (mirrors `rule`/`facebookFeature`, not a singleton) |
| `apps/web/src/lib/content/types.ts` | A2 | Add `Artwork` interface + `getArtworks()` on `ContentAdapter` |
| `apps/web/src/lib/content/seed.ts` | A2 | Add fixture artwork array (adapted from the design mock, no images required — placeholder image ref) |
| `apps/web/src/lib/sanity/queries.ts` | A2 | New `ARTWORK_QUERY` + `mapArtwork` |
| `apps/web/src/lib/sanity/adapter.ts` (or equivalent sanity adapter file) | A2 | Implement `getArtworks()` |
| `apps/web/src/lib/sanity/sanity.types.ts` | A2 | Regenerated via `sanity typegen` after schema lands |
| `apps/web/src/app/showcase/page.tsx` | A1 | New route — Server Component, empty state, renders grid |
| `apps/web/src/components/sections/artwork-grid.tsx` | A1 | New — Client Component, grid + lightbox open state |
| `apps/web/src/components/sections/artwork-lightbox.tsx` | A1 | New — Client Component composing shadcn `Dialog` + `Carousel` |
| `apps/web/src/components/ui/dialog.tsx` | A1 | New — generated by `npx shadcn@latest add dialog`, not hand-written |
| `apps/web/src/components/ui/carousel.tsx` | A1 | New — generated by `npx shadcn@latest add carousel` |
| `apps/web/src/lib/utils.ts` | A1 | New — `cn()` helper, created by the shadcn CLI on first `add` |
| `apps/web/components.json` | A1 | New — shadcn CLI config (created on first `add`) |
| `apps/web/package.json` | A0 | Add `@radix-ui/react-dialog`, `embla-carousel-react`, `clsx`, `class-variance-authority` (FR-5a, gated on Q4) |
| `apps/web/src/styles/globals.css` | A1 | Add grid stagger delay utilities (entrance animation only — the lightbox's motion comes from Embla) |
| `apps/web/src/app/layout.tsx` | A1 | Add "Showcase" to `NAV_ITEMS`/`SITE_LINKS` between Rules and Announcements |
| `apps/web/src/lib/analytics.ts` | A1 | Gated on Q2 — add `artwork_open`, `artwork_source_click` to the closed union |
| `docs/SLGA-PHASE-1-TECH-SPEC.md` | A0 + founder | Amendment: §7 route row, new §8.7, new §11.7, §15 event additions (gated on Q3) |

Explicitly untouched: every existing route/component not listed; the
`MobileNav` component is read as a pattern reference only, not modified.

## Dependency changes

**One approved exception, otherwise none.** No new Sanity plugin, no new
`@sanity/*` package — if `sanity typegen` requires anything beyond what
`apps/studio` already has installed (it does not, per Plan 002's own
verification), work stops for approval, same standing rule as Plan 002.

For `apps/web` only, FR-5a adds four packages to build the lightbox from the
exact shadcn/ui components as instructed:

| Package | Purpose |
| --- | --- |
| `@radix-ui/react-dialog` | shadcn `Dialog` primitive |
| `embla-carousel-react` | shadcn `Carousel` primitive |
| `clsx` | shadcn-generated component styling |
| `class-variance-authority` | shadcn-generated component styling |

This is treated as approved by the user's explicit "use exact shadcn
components" instruction (spec Q4), but is still called out here per
AGENTS.md's standing dependency-approval rule rather than silently added in
a component-authoring commit. No other workspace package, script, or
lockfile-adjacent tooling changes.

## Security impact

| Concern | Handling |
| --- | --- |
| Public dataset | `artwork` fields are all public-facing display copy and an image; no field invites private data (artist is a credit line, not contact info) |
| External links | `sourceUrl` is constrained to `https` via `Rule.uri({ scheme: ['https'] })`, same as `facebookFeature.postUrl`; rendered with `rel="noopener noreferrer"` and `target="_blank"` |
| Write tokens | None introduced; Studio auth unchanged |
| Analytics properties | New event properties are `artwork_id` (a Sanity document `_id`, not user data) and a literal `placement` string — no free text, no PII, consistent with the existing closed-union discipline |
| Content injection | No rich-text field on `artwork` — plain strings only, so there is no Portable Text allowlist to get wrong for this type |
| Focus/keyboard trap | Delegated to Radix `Dialog` (audited, widely-used primitive) rather than hand-rolled a third time; no custom trap logic to review here |
| New dependency supply chain | `@radix-ui/react-dialog`, `embla-carousel-react`, `clsx`, `class-variance-authority` are all high-download, actively-maintained packages installed via the official `shadcn` CLI, not hand-copied from an untrusted source; lockfile diff reviewed at PR time like any dependency change |

## Failure modes

| Failure | Detection | Response |
| --- | --- | --- |
| `getArtworks()` returns items missing `image`/`sourceUrl` from a bad manual Sanity edit | `pnpm typecheck` after typegen regen catches shape drift; runtime, the mapper should not need defensive fallbacks if schema validation is correct | Treat as a schema/mapper bug — same doctrine as Plan 002's failure table, never patch with an `as` cast |
| Lightbox opened with zero artworks (race after content changes) | Grid never renders an open affordance when `getArtworks()` returns `[]` — verified by the empty-state acceptance criterion | Lightbox component asserts a non-empty array at the type level (grid only mounts it when `items.length > 0`) |
| `dvh` unsupported in a target browser | Manual check on the oldest supported WebKit/Chromium per TECH-SPEC browser matrix | `vh` fallback declared first in the same rule, `dvh` as a progressive enhancement override |
| Stagger animation delay math breaks with >20 pieces | Capped stagger constant in the component, not computed unbounded | Fixed number of stagger buckets regardless of list length |
| Embla `Carousel`'s default styling doesn't match the design's 48px icon buttons / info-bar layout | Manual visual diff against the design during the lightbox task | `CarouselPrevious`/`CarouselNext` are restyled via `className`, not replaced — keeps the underlying keyboard/swipe behavior intact |
| Radix `Dialog` requires a `DialogTitle` that the design doesn't visually show | Typecheck/lint from the shadcn-generated component itself (Radix warns at runtime if omitted) | Render `DialogTitle` visually-hidden (`sr-only`) rather than skipping it |
| Q2/Q3 stay unanswered | This plan itself, at review | Ship the page fully functional without the two analytics events and without the TECH-SPEC amendment merged; both are additive follow-ups |

## Rollback

- Layers 1–2 (schema + content boundary) are additive: a new document type
  and a new adapter method. Reverting `artwork.ts` and the barrel entry
  removes the Studio surface with no effect on any other content type.
- Layer 3 (grid/lightbox/page) is a new route and new components under a
  directory nothing else imports from — deleting the route folder, the two
  section components, and the two shadcn-generated `ui/dialog.tsx` /
  `ui/carousel.tsx` files fully reverts it. `ui/dialog.tsx`/`ui/carousel.tsx`
  are inert if left in place (unused files, no runtime cost) if a future
  feature wants them again.
- The four FR-5a dependencies revert with a single `package.json`/lockfile
  change if the shadcn approach is ever abandoned; nothing else in the repo
  imports them.
- Layer 4 (motion) is a CSS-only addition with no JS coupling — removable
  independently.
- Layer 5 (nav entry + analytics) is the only change to already-shipped
  files (`layout.tsx`, `analytics.ts`); each is a small, isolated diff that
  reverts cleanly on its own.

No data migration; no existing document type is altered.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Q1–Q3 stay unanswered | Medium | Page ships without a date chip and without analytics; TECH-SPEC text temporarily undocumented | None of these block the functional page; isolated as their own tasks |
| shadcn `Dialog`/`Carousel` default visual style fights the design's dark, bespoke chrome | Medium | Lightbox looks "generic shadcn" instead of matching the rest of the site | Both are unstyled-by-default primitives (Tailwind classes only) — restyle via `className`/CSS vars, not a visual regression risk once done deliberately |
| Grid min-tile-width choice still overflows on very small/old devices | Low | Visual regression on the "better mobile UI" goal itself | Acceptance criterion explicitly tests a 320px viewport before merge |
| `displayOrder` convention change reads as silently ignoring design intent | Low | Founder confusion if they expected literal newest-first | Called out explicitly in spec D1 and in the meta-line copy, not silently substituted |
| Four new dependencies increase the web app's install/audit surface | Low | Slightly larger `node_modules`/lockfile diff to review | All four are widely-used, actively-maintained, and installed via the official `shadcn` CLI rather than ad hoc; explicitly flagged as Q4/FR-5a instead of bundled silently |

## Verification strategy

1. `pnpm --filter @slga/studio exec tsc --noEmit` after the schema lands.
2. `pnpm typecheck` and `pnpm lint` across both workspace packages after
   typegen regeneration and the content-boundary/page work.
3. Manual matrix against every acceptance criterion in the spec, including
   the 320px-viewport and keyboard-only passes.
4. Manual reduced-motion check (`prefers-reduced-motion: reduce` via
   browser devtools) confirming no entrance/transition animation plays.
5. Field-by-field audit of the new `Artwork` adapter type against the schema,
   the same discipline Plan 002 used for `ContentAdapter`.
6. `pnpm build` succeeds with the new route included in the static/prerender
   set.
