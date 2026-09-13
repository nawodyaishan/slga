# Plan 001 — Phase 1 public site

**Spec:** `specs/001-phase-1-public-site/spec.md`
**Status:** agent-drafted; no unapproved dependency, migration, auth, secret or
deployment change is proposed.

## Summary

Rebuild the Claude Design prototype as App Router Server Components on a
token-based Tailwind v4 theme, behind a single typed content boundary that has
two interchangeable adapters (seed, Sanity). Client JavaScript is limited to
four small islands: mobile navigation, header scroll state, the mobile CTA bar,
and analytics dispatch.

## Inputs reviewed

- `TECH-SPEC.md` §7–§18 (routes, design tokens, architecture, a11y, security)
- `docs/TASKS.md` §3 ownership, §5 tasks T03–T06
- `design/phase_1/SLGA Phase 1.dc.html` — full markup and `renderVals()` logic
- `design/phase_1/uploads/*.png` — five review screenshots
- Existing `apps/web` scaffold (Next 16, React 19, Tailwind v4, strict TS)
- Next.js `next/font` multi-family CSS-variable pattern (context7, `/vercel/next.js`)
- Tailwind v4 `@theme` CSS-first token namespaces (context7, `/websites/tailwindcss`)

## Assumptions

Carried from spec A1–A5. Additionally: Tailwind v4 is already wired through
`@tailwindcss/postcss`, so tokens are declared in `@theme` inside
`src/styles/globals.css` with no `tailwind.config.ts`.

## Architecture approach

### 1. Translate the prototype's runtime switches into CSS

`renderVals()` computes ~40 values from a JS-measured container width
(`sm < 700`, `md < 1040`, `xs < 420`). Reimplementing that as React state would
force the whole page to be a Client Component and cause hydration flicker.

Instead:

- The breakpoint-dependent scalars (`pad`, `h1`, `h2`, `lead`, `sectionPadY`, …)
  become `clamp()`-based custom properties in `@theme`, so one declaration
  covers the whole range fluidly.
- The boolean switches (`deskNav`/`mobileNav`, `indexCol`/`indexRow`,
  `ruleDir`) become Tailwind responsive variants at `md` (700 px) and
  `lg` (1040 px) custom breakpoints matching the prototype's thresholds.
- Only genuinely stateful switches (`scrolled`, `deep`, `menu`) stay in JS.

### 2. Content boundary

```
app/**  ──imports──▶  lib/content/index.ts   (typed adapters, the only import surface)
                            │
                    ┌───────┴────────┐
                    ▼                ▼
            lib/content/seed.ts   lib/sanity/*   (client, queries, image, types)
```

`lib/content/index.ts` selects the adapter once, at module scope:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` set → Sanity adapter.
- unset and `NODE_ENV !== "production"` → seed adapter + prototype banner on.
- unset and `NODE_ENV === "production"` → throw at build time (spec §10.3:
  never deploy an empty shell or ship seed data as fact).

Every adapter returns the same domain types (`SiteSettings`, `Rule`,
`Announcement`, `FacebookFeature`), so no page component knows the source.
Rule ordering, the three-card cap, and draft/future exclusion are enforced in
the boundary, not in pages, so both adapters obey them identically.

### 3. Component layers

| Layer | Path | Rendering |
| --- | --- | --- |
| Primitives | `components/ui/` | Server |
| Shell | `components/layout/` | Server + 3 client islands |
| Home sections | `components/sections/` | Server |
| Rich text | `components/portable-text/` | Server |

`components/ui/` holds `Button` (link/button polymorphic, cyan/outline/ghost),
`Card`, `Badge`, `SectionHeading` (the `01 ABOUT SLGA` eyebrow), `Prose`, and
`TrackedLink` — the one client primitive, wrapping an external anchor with
`rel="noopener noreferrer"`, an accessible "(opens in a new tab)" affordance and
an analytics call. shadcn `Sheet` is *not* installed: the design's drawer is a
single dialog with no variants, so a ~40-line focus-managed component is less
code than the primitive plus its Radix dependency. This is a deliberate
deviation from `TECH-SPEC.md` §9.2's expected component list, recorded below.

### 4. Routing and metadata

Static routes are plain `page.tsx`. `announcements/[slug]/page.tsx` uses
`generateStaticParams` over published slugs plus `generateMetadata` from the
same fetched document, and calls `notFound()` for unknown/draft/future slugs.
`/rules` and `/si/rules` declare `alternates.languages`. The Sinhala route wraps
its content in `lang="si"` rather than duplicating the root layout.

## Affected modules

| Path | Change | Owner (docs/TASKS.md §3) |
| --- | --- | --- |
| `src/styles/globals.css` | Replaced: `@theme` tokens, base layer | A1 |
| `src/app/layout.tsx` | Fonts, shell, skip link, analytics | A1 |
| `src/app/page.tsx` | Rebuilt from sections | A1 |
| `src/app/{rules,si/rules,announcements,privacy}/page.tsx` | Rebuilt | A1 |
| `src/app/announcements/[slug]/page.tsx` | New | A1 |
| `src/app/not-found.tsx` | Rebuilt | A1 |
| `src/app/sitemap.ts` | Adds published slugs | A0 |
| `src/components/**` | New | A1 |
| `src/lib/content/**` | New | A2 |
| `src/lib/sanity/**` | New | A2 |
| `src/lib/{analytics,format}.ts` | New | A0/A1 |
| `design-reference/` | Pointer to `design/phase_1/` | A1 |

## API and contract changes

None outbound. Inbound GROQ contracts are fixed by `TECH-SPEC.md` §11 and
implemented verbatim; no schema is invented here.

## Data model changes

None. `lib/content/types.ts` mirrors the §11 Sanity schema as the domain model,
with `PortableTextBlock` from `@portabletext/react` for rich text. Seed data
satisfies the same types.

## Dependency changes

**None.** Every capability is covered by the existing manifest: `next`,
`react`, `next-sanity`, `@sanity/image-url`, `@portabletext/react`,
`@vercel/analytics`, `lucide-react`, `tailwind-merge`, `tailwindcss`.
`tailwindcss-animate` is present but unused and is left untouched (removal is a
lockfile change and therefore founder-gated). No approval required for this
plan.

## Security impact

- No token in any client bundle; the Sanity client is constructed in server-only
  modules and reads `perspective: "published"` with `useCdn: true`.
- Portable Text renders through an explicit component allowlist; unknown block
  and mark types render as plain text rather than raw HTML.
- All external anchors carry `rel="noopener noreferrer"`.
- Response headers (CSP et al.) are **out of scope here** — they belong to T07
  (A0) and are listed in tasks as a follow-on, since enforcing CSP before the
  Sanity image origin is known would break images.

## Authorization boundaries

None. The public app is anonymous and read-only. No route reads or writes user
state, and no cookie is set.

## Observability impact

`lib/analytics.ts` is the single definition of the three approved events and
their property enums; it is typed so an unapproved event name or property fails
`pnpm typecheck`. Page views come from `@vercel/analytics` in the root layout,
already present.

## Testing strategy

This plan produces no test files — automated tests are T08 (owner A3) and
deliberately left to that task to avoid two agents owning `tests/**`. This plan
is verified by:

1. `pnpm lint && pnpm typecheck && pnpm build` — must pass clean.
2. `pnpm dev` + Playwright MCP: screenshot every route at 375 / 768 / 1440 px
   and compare against `design/phase_1/uploads/*.png`.
3. Keyboard walkthrough of the mobile menu (open, trap, Escape, restore).
4. `curl -s localhost:3000/announcements/does-not-exist -o /dev/null -w '%{http_code}'`
   → `404`.

The boundary is designed so T08 can inject a fixture adapter without touching
page components.

## Failure modes

| Failure | Behaviour |
| --- | --- |
| Sanity unreachable at build | Build fails loudly; last good deployment stays served |
| Sanity unreachable at request | Cached page served for the revalidation window |
| Settings document missing in production | Build throws with a named error |
| Announcement body has an unsupported block | Block skipped; page still renders |
| Image asset missing | Slot collapses; no broken-image box, no layout shift |
| Analytics blocked by client | No-op; page unaffected |

## Rollback and recovery

Pure application-code change on a feature branch, no migration and no
persistent state. Rollback is `git revert` of the merge commit, or redeploying
the previous Vercel build. The legacy site remains recoverable from history
(and from the `legacy-site-2021` tag once T01 creates it).

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Prototype mock copy mistaken for approved content | Seed adapter marks content `provisional`; persistent PROTOTYPE banner; production build refuses seed data |
| Fluid `clamp()` drifts from the prototype's stepped sizes | Clamps are solved to match the prototype's values exactly at 375/768/1440; verified by screenshot |
| Deviating from shadcn `Sheet` | Documented above; behaviour requirements (focus trap, Escape, `aria-modal`) are spec'd and verified manually, then by T08's axe + keyboard tests |
| Sinhala glyph rendering differs per OS | `next/font` self-hosts Noto Sans Sinhala with an explicit fallback chain; manual check is a T10 item |
| Rules anchor hidden behind sticky header | `scroll-margin-top` token tied to the header-height token |

## Human architecture approval status

**Pending.** Two decisions warrant an explicit founder/A0 nod:

1. Hand-rolled mobile drawer instead of shadcn `Sheet` (§9.2 deviation).
2. Seed adapter as a development-only content source, with a hard production
   failure, to unblock UI work before the Sanity project exists (spec A1).

Neither touches dependencies, secrets, infrastructure or data. Implementation
proceeds under these assumptions and is reversible if rejected.
