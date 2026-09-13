# Spec 001 — Phase 1 public site

**Type:** feature spec
**Status:** drafted by agent, awaiting founder approval
**Source of truth:** `TECH-SPEC.md` (product/architecture), `docs/TASKS.md` (agent roles)
**Visual source:** `design/phase_1/SLGA Phase 1.dc.html` (Claude Design export, reference only)

## Problem statement

The repository currently ships a placeholder Next.js scaffold: five routes with
lorem-grade copy, one hand-written stylesheet, no header/footer, no content
layer. The approved Phase 1 product — an obsidian/cyan community site with
bilingual rules, permanent announcement URLs and curated Facebook cards — exists
only as an approved Claude Design prototype. Nothing a visitor can reach today
reflects it.

The Claude Design export is a single-file, hash-routed prototype driven by a
`DCLogic` class and inline styles. It is a visual contract, not a codebase. It
must be rebuilt as real App Router routes and Server Components.

## Goals

1. Every route in `TECH-SPEC.md` §7 renders the approved design at 375, 768 and
   1440 px.
2. Design tokens, typography and interaction behaviour are defined once and
   reused, not repeated as inline styles.
3. All editorial content is read through one typed content boundary, so
   swapping the source (seed → Sanity) changes no page component.
4. The site is fully usable and correct with keyboard only, at 320 px, and at
   200% zoom.
5. No prototype artifact — hash routing, inline style soup, mock copy presented
   as fact, remote Google Fonts — reaches production.

## Non-goals

- Everything in `TECH-SPEC.md` §5.
- Creating the Sanity project, dataset, or entering production content
  (founder-gated; tracked as T02/T09 in `docs/TASKS.md`).
- Deploying to Vercel, disabling GitHub Pages, or tagging the legacy site.
- The prototype's "404 preview" footer link and viewport/atmosphere switches;
  those are Design review affordances, not product.

## Actors

| Actor | Capability in this spec |
| --- | --- |
| Visitor | Reads all public routes; joins Facebook/Discord; switches rules language |
| Founder/editor | Not exercised here — edits happen in Studio (T02) |
| Implementation agent | Builds routes/components against the typed content boundary |

## User journeys

1. A visitor lands on `/`, understands SLGA within the first screen, and opens
   Discord or Facebook from the hero.
2. A visitor opens `/rules`, jumps to rule 7 via the index, then switches to
   `/si/rules` and sees the same rule in Sinhala with correct language markers.
3. A visitor opens a shared `/announcements/<slug>` link and sees a titled,
   dated, readable article with a back link.
4. A visitor on a phone scrolls past the hero, gets a fixed Discord/Facebook
   bar, opens the menu with the keyboard, and closes it with Escape.
5. A visitor follows a dead link and lands on a branded 404 offering Home,
   Rules and Discord.

## Functional requirements

### FR-1 Global shell

- Skip link is the first focusable element and reveals on focus.
- Sticky header: wordmark → `/`; nav Home · Rules · Announcements; prominent
  Join Discord. Header background/border strengthen after ~12 px of scroll.
- Active route is marked with `aria-current="page"` **and** a visual indicator
  (underline on desktop, border + `CURRENT` label in the mobile sheet).
- Below 700 px the nav collapses to a compact Discord button plus a menu
  trigger opening a right-side dialog (`role="dialog"`, `aria-modal="true"`).
  Focus moves to the close button on open, is trapped while open, returns to
  the trigger on close, and Escape closes it.
- Below 700 px, after ~460 px of scroll, a fixed bottom bar offers Join Discord
  and Facebook, respecting `env(safe-area-inset-bottom)`.
- Footer: identity block, Site links (incl. `නීති (සිංහල)`), Community links
  from settings, auto-current-year copyright, and the
  "community-run · not an official governing body" disclaimer.

### FR-2 Homepage

Sections in order: Hero, About (+ three fact tiles), Latest announcement,
Featured from the group, Community CTA. Hero shows eyebrow, three-line H1,
lead, both CTAs, and the member-count proof point. Latest announcement and
Featured sections are omitted entirely when their content is empty. At most
three feature cards render.

### FR-3 Rules

- `/rules` and `/si/rules` are real routes, not a client toggle.
- A two-option language control links between them, marking the current one
  with `aria-current="page"` and a check glyph.
- Rules render ordered by `displayOrder` then `_createdAt`, each with its
  zero-padded number, localized title, and localized body blocks.
- A rules index (sticky column ≥1040 px, wrapped number chips below) links to
  `#rule-<n>` anchors with `scroll-margin-top` clearing the sticky header.
- Sinhala content sets `lang="si"` on the heading, intro, index and each rule,
  and uses the Sinhala font stack. It never falls back to English body text.
- `Last updated` renders as `<time datetime>`.

### FR-4 Announcements

- `/announcements` lists published announcements newest first as cards with
  type badge, `<time>`, title, excerpt and optional 16:9 image.
- `/announcements/[slug]` renders breadcrumb, badge, date, H1, excerpt,
  optional cover, body blocks (paragraph, h2, blockquote, list) and a back link.
- Unknown, draft, or future-dated slugs return a real 404.

### FR-5 Privacy and 404

- `/privacy` renders the approved sectioned notice with a reviewed-on `<time>`.
- `not-found.tsx` renders the branded 404 with Home, Rules and Discord actions.

### FR-6 Content boundary

- Page components import only from `lib/content`, never from `lib/sanity`
  directly, and never construct GROQ.
- The Sanity adapter is read-only, token-free, uses the API CDN and 60-second
  revalidation.
- When Sanity is not configured, a seed adapter serves the migrated rule text
  and clearly-labelled prototype content, and the site renders a persistent
  `PROTOTYPE` banner. This mode is a development affordance only: a production
  build with no Sanity configuration must fail, not ship seed data.

### FR-7 Analytics

Exactly the three events in `TECH-SPEC.md` §15, with their documented property
shapes, emitted from a single module. No URLs, names, or free text as
properties.

## Acceptance criteria

- [ ] All nine routes render the approved design at 375 / 768 / 1440 px.
- [ ] Keyboard-only: skip link → header → mobile menu open/trap/Escape/restore.
- [ ] `/si/rules` shows Sinhala titles and bodies with `lang="si"`; no English
      body text appears where Sinhala is expected.
- [ ] Rules index anchors land with the heading clear of the sticky header.
- [ ] An unknown announcement slug returns HTTP 404 with the branded page.
- [ ] Empty latest-announcement and empty features remove their sections
      entirely, leaving no empty padding.
- [ ] No more than three feature cards render regardless of input length.
- [ ] No runtime request to `fonts.googleapis.com` or any Facebook script.
- [ ] Contrast ≥ 4.5:1 for body text; all interactive targets ≥ 44 × 44 px.
- [ ] `prefers-reduced-motion` disables the entrance animations.
- [ ] `pnpm lint`, `pnpm typecheck` and `pnpm build` pass.
- [ ] Prototype content is visibly labelled and cannot ship as production fact.

## Success criteria

Technology-agnostic outcomes:

- A visitor can reach Discord or Facebook from any page within one action.
- A shared announcement link renders a complete, dated article.
- Both rule languages are reachable and shareable by URL.
- Replacing the content source requires edits only inside the content boundary.

## Edge cases

| Case | Expected |
| --- | --- |
| No published announcements | Homepage latest section and index empty state |
| Zero enabled feature cards | Featured section absent |
| More than three enabled cards | First three by `displayOrder` |
| Duplicate `displayOrder` on rules | Deterministic tie-break on creation time |
| Rule has Sinhala title but empty Sinhala body | Treated as unpublishable; never silently English |
| Announcement `publishedAt` in the future | Excluded from list, detail 404s, absent from sitemap |
| Very long rule title / unbroken token | Wraps; no horizontal scroll at 320 px |
| Missing cover image | Card and detail render without a reserved image slot |
| Social link disabled in settings | Omitted from footer and CTAs |

## Data sensitivity

No personal data is collected, stored or transmitted. The dataset is public and
carries only published community content. Analytics properties are a closed
enum set. No Sanity token, preview token or write credential may reach the
browser bundle.

## Integration expectations

- Sanity Content Lake, read-only published content, via the API CDN.
- Sanity image CDN for responsive transforms.
- Vercel Web Analytics for page views and the three custom events.
- Outbound links to Facebook and Discord only; no SDKs or embeds.

## Assumptions

1. **A1** — Sanity project/dataset do not exist yet, so the build ships with the
   seed adapter active in development and the Sanity adapter wired but dormant
   until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set.
2. **A2** — Rule text carried over from the prototype (10 rules, both languages)
   is *migration input pending founder approval*, surfaced behind the prototype
   banner and the design's migration notice, not published fact.
3. **A3** — Member count, announcements and feature cards from the prototype are
   mock. They are labelled as such and must be replaced in Studio before launch.
4. **A4** — `discord.gg/slga` and `facebook.com/groups/slga` in the prototype are
   placeholders; real URLs come from founders via `siteSettings`.
5. **A5** — Geist, Geist Mono and Noto Sans Sinhala are loaded through
   `next/font/google`, which self-hosts them at build time, satisfying the
   "no runtime Google request" rule.

## Open questions

| # | Question | Owner | Blocks |
| --- | --- | --- | --- |
| Q1 | Real Facebook group and Discord invite URLs | Founder | Launch, not build |
| Q2 | Verified current member count | Founder | Launch, not build |
| Q3 | Approved English translations of the ten rules | Founder | Launch, not build |
| Q4 | Sanity project id / dataset | Founder | T02, T04 activation |
| Q5 | Production origin for canonicals | Founder | T07 |

None of Q1–Q5 block this spec's implementation: each is content or credentials
consumed through the content boundary.

## Approval status

Agent-drafted. Founder approval required before content in A2–A4 is treated as
production fact.
