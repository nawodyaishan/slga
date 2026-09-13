# Tasks 001 — Phase 1 public site

**Spec:** `spec.md` · **Plan:** `plan.md`
**Maps to `docs/TASKS.md`:** T03 (UI foundation), T04 (data layer), T05 (home),
T06 (rules/announcements/privacy/404).

## Track summary

| Track | Tasks | Owner role |
| --- | --- | --- |
| Foundation | P1-01 … P1-04 | A1 |
| Content boundary | P1-05 … P1-07 | A2 |
| Pages | P1-08 … P1-12 | A1 |
| Integration | P1-13 | A0 |

## Prerequisites

- `pnpm install` succeeds; `apps/web` scaffold present. ✔ (T01 complete)
- No Sanity credentials required — P1-06 wires the adapter dormant.

## Task list

### P1-01 — Design tokens and typography
- **Objective:** Encode the prototype's palette, fluid type scale, spacing and
  breakpoints as Tailwind v4 `@theme` tokens; load Geist, Geist Mono and Noto
  Sans Sinhala via `next/font/google` as CSS variables.
- **Source:** design export `<style>` block + `renderVals()` responsive scale.
- **Allowed:** `src/styles/globals.css`, `src/app/layout.tsx`
- **Forbidden:** `src/lib/**`, `package.json`
- **Acceptance:** `--color-*`, `--font-*`, `--text-*`, `--spacing-*` tokens exist;
  no runtime request to `fonts.googleapis.com`; reduced-motion honoured in base
  layer; `:focus-visible` uses the accent token.
- **Verify:** `pnpm typecheck && pnpm build`; grep built output for
  `fonts.googleapis` → no match.
- **Depends:** — · **Risk:** low · **Status:** done

### P1-02 — UI primitives
- **Objective:** `Button`, `Card`, `Badge`, `SectionHeading`, `Eyebrow`,
  `Container`, `TrackedLink`, `cn()`.
- **Allowed:** `src/components/ui/**`, `src/lib/cn.ts`
- **Acceptance:** every interactive primitive is ≥44 px tall; `TrackedLink` sets
  `rel="noopener noreferrer"` and an accessible new-tab hint.
- **Verify:** `pnpm lint && pnpm typecheck`
- **Depends:** P1-01 · **Risk:** low · **Status:** done

### P1-03 — Analytics module
- **Objective:** Single typed definition of the three approved events.
- **Allowed:** `src/lib/analytics.ts`
- **Acceptance:** event name/property unions make an unapproved value a compile
  error; no URL, name or free text is accepted as a property.
- **Verify:** `pnpm typecheck`
- **Depends:** — · **Risk:** low · **Status:** done · **Parallel-safe with:** P1-01, P1-05

### P1-04 — Shell: skip link, header, mobile drawer, CTA bar, footer
- **Objective:** Build the global chrome including the three client islands.
- **Allowed:** `src/components/layout/**`, `src/app/layout.tsx`
- **Acceptance:** `aria-current="page"` on the active route; drawer is
  `role="dialog" aria-modal="true"`, traps focus, closes on Escape and restores
  focus to the trigger; CTA bar appears only below 700 px past 460 px of scroll.
- **Verify:** keyboard walkthrough; Playwright MCP screenshots at 375/768/1440.
- **Depends:** P1-01, P1-02, P1-03 · **Risk:** medium · **Status:** done

### P1-05 — Domain types
- **Objective:** `SiteSettings`, `Rule`, `Announcement`, `FacebookFeature`,
  `SocialLink` mirroring `TECH-SPEC.md` §11.
- **Allowed:** `src/lib/content/types.ts`
- **Acceptance:** no `any`; Portable Text typed via `@portabletext/react`.
- **Depends:** — · **Risk:** low · **Status:** done · **Parallel-safe with:** P1-01…P1-04

### P1-06 — Content boundary and adapters
- **Objective:** Seed adapter (migrated rules + labelled prototype content),
  Sanity adapter (token-free, CDN, 60 s revalidate), and the selector that
  throws in production when Sanity is unconfigured.
- **Allowed:** `src/lib/content/**`, `src/lib/sanity/**`
- **Forbidden:** `src/app/**`, `src/components/**`
- **Acceptance:** ordering, three-card cap and draft/future exclusion live in
  the boundary; no token reaches the client bundle; seed data carries a
  `provisional` marker.
- **Verify:** `pnpm build` with no Sanity env in `NODE_ENV=production` → fails
  with a named error.
- **Depends:** P1-05 · **Risk:** medium · **Status:** done

### P1-07 — Portable Text renderers
- **Objective:** Allowlisted renderers for rules (p, h3, lists, marks) and
  announcements (p, h2/h3, blockquote, lists, images).
- **Allowed:** `src/components/portable-text/**`
- **Acceptance:** unknown types degrade to plain text; no `dangerouslySetInnerHTML`.
- **Depends:** P1-05 · **Risk:** low · **Status:** done

### P1-08 — Homepage
- **Allowed:** `src/app/page.tsx`, `src/components/sections/**`
- **Acceptance:** section order per spec FR-2; empty latest/features remove
  their sections; ≤3 cards; Server Components only.
- **Depends:** P1-04, P1-06, P1-07 · **Risk:** low · **Status:** done

### P1-09 — Rules (EN + SI)
- **Allowed:** `src/app/rules/**`, `src/app/si/rules/**`, `src/components/sections/rules-*`
- **Acceptance:** real cross-links, `lang="si"` markers, index anchors clear the
  sticky header, no silent English fallback.
- **Depends:** P1-04, P1-06, P1-07 · **Risk:** medium · **Status:** done

### P1-10 — Announcements index and detail
- **Allowed:** `src/app/announcements/**`
- **Acceptance:** newest first; unknown/draft/future slug → 404;
  `generateMetadata` from the fetched document.
- **Verify:** `curl -o /dev/null -w '%{http_code}' localhost:3000/announcements/nope` → 404
- **Depends:** P1-04, P1-06, P1-07 · **Risk:** medium · **Status:** done

### P1-11 — Privacy
- **Allowed:** `src/app/privacy/page.tsx`
- **Acceptance:** sectioned notice with reviewed-on `<time>`; copy is
  founder-gated before launch.
- **Depends:** P1-04 · **Risk:** low · **Status:** done

### P1-12 — Branded 404
- **Allowed:** `src/app/not-found.tsx`
- **Depends:** P1-04 · **Risk:** low · **Status:** done

### P1-13 — Sitemap from published slugs
- **Allowed:** `src/app/sitemap.ts`
- **Acceptance:** drafts and future-dated announcements excluded.
- **Depends:** P1-06, P1-10 · **Risk:** low · **Status:** done

## Dependency order

```
P1-01 ─┬─ P1-02 ─┐
       │         ├─ P1-04 ─┬─ P1-08 ─ P1-13
P1-03 ─┘         │         ├─ P1-09
P1-05 ─┬─ P1-06 ─┤         ├─ P1-10 ─ P1-13
       └─ P1-07 ─┘         ├─ P1-11
                           └─ P1-12
```

## Parallel-safe groups

- **G1:** P1-01, P1-03, P1-05 — disjoint write sets.
- **G2:** P1-06, P1-07 (lib) ∥ P1-02, P1-04 (components).
- **G3:** P1-09, P1-10, P1-11, P1-12 — one route directory each.

## Verification matrix

| Check | Command | Covers |
| --- | --- | --- |
| Lint | `pnpm lint` | all |
| Types | `pnpm typecheck` | P1-03, P1-05, P1-06 |
| Build | `pnpm build` | all |
| 404 | `curl -w '%{http_code}'` on unknown slug | P1-10 |
| Visual | Playwright MCP @ 375/768/1440 | P1-04, P1-08…P1-12 |
| Keyboard | manual drawer walkthrough | P1-04 |

## Blocked / approval-required

| Item | Blocked on | Owner | Not blocking |
| --- | --- | --- | --- |
| Activating the Sanity adapter | project id + dataset (Q4) | Founder | build |
| Real Facebook/Discord URLs, member count | Q1, Q2 | Founder | build |
| Approved English rule translations | Q3 | Founder | build |
| Response headers / CSP | Sanity image origin | A0 (T07) | build |
| Automated tests + axe | this track landing | A3 (T08) | build |
| shadcn `Sheet` deviation | architecture nod | A0 | build |
