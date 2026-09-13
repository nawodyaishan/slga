# Tasks 002 — Sanity CMS foundation

**Spec:** `specs/002-sanity-cms-foundation/spec.md` · **Plan:** `specs/002-sanity-cms-foundation/plan.md`
**Status legend:** `todo` · `blocked` · `in-progress` · `done`

---

## P2-01 — Shared schema objects

- **Objective:** Define the reusable building blocks every document type composes from: `localizedString`, `localizedText`, `imageWithAlt`.
- **Source:** TECH-SPEC §11.1–11.4; `apps/web/src/lib/content/types.ts` (`ImageRef`, `Locale`)
- **Allowed paths:** `apps/studio/schemaTypes/objects/`
- **Forbidden paths:** everything under `apps/web/`
- **Acceptance:** `imageWithAlt` requires `alt` on every instance; hotspot enabled (the web side already maps hotspot → `object-position`); localized objects carry both `en` and `si` with both required.
- **Verify:** `pnpm --filter @slga/studio exec tsc --noEmit`
- **Depends on:** —
- **Risk:** Low
- **Status:** done

## P2-02 — Portable Text block configurations

- **Objective:** Two named block-content objects — `rulesBlockContent` and `announcementBlockContent` — with allowlists matching the shipped renderers exactly.
- **Source:** TECH-SPEC §11.2, §11.3; `apps/web/src/components/portable-text/rules-portable-text.tsx` and `announcement-portable-text.tsx`
- **Allowed paths:** `apps/studio/schemaTypes/objects/`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** rules = normal, `h3`, strong, em, link, bullet + numbered lists. announcements = the above plus `h2`, blockquote, and `imageWithAlt`. Neither declares an `html` type or an unconstrained embed. Link annotations validate `https`. Every style either has a registered renderer component or is removed.
- **Verify:** Side-by-side diff of schema `styles`/`marks`/`lists` arrays against the renderer's `block`/`marks`/`list` keys; typecheck.
- **Depends on:** P2-01
- **Risk:** Medium — this is the drift surface; an unmatched style renders unstyled with no error.
- **Status:** done

## P2-03 — `rule` document type

- **Objective:** Implement §11.2 — `titleEn/titleSi`, `bodyEn/bodySi`, `displayOrder`, `anchorId`, `isActive`.
- **Source:** TECH-SPEC §11.2; GROQ at `apps/web/src/lib/sanity/queries.ts` (`RULES_QUERY`)
- **Allowed paths:** `apps/studio/schemaTypes/rule.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** English and Sinhala title and body are each required — a rule cannot publish half-translated. `displayOrder` is a required integer ≥ 1. `anchorId` matches the slug pattern the rules page anchors on. Preview shows order + English title.
- **Verify:** Typecheck; live validation matrix once P2-12 is unblocked.
- **Depends on:** P2-02
- **Risk:** Low
- **Status:** done

## P2-04 — `announcement` document type

- **Objective:** Implement §11.3 — `title`, `slug`, `excerpt`, `body`, `publishedAt`, `coverImage`, `seoDescription` — plus the `kind` field from gap G3.
- **Source:** TECH-SPEC §11.3; spec G3; `queries.ts:226`
- **Allowed paths:** `apps/studio/schemaTypes/announcement.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** slug sourced from title and unique; `excerpt` required with a sane max length; `publishedAt` required and defaulting to now; `coverImage` optional but alt-required when present; `seoDescription` guided toward 120–160 chars. `kind` is a required list-constrained string defaulting to `ANNOUNCEMENT`.
- **Note:** The `kind` portion is approval-gated (spec Q1/Q2). Ship the §11.3 fields regardless; add `kind` when approved.
- **Verify:** Typecheck; attempt to publish an announcement with a duplicate slug and with no excerpt.
- **Depends on:** P2-02
- **Risk:** Low
- **Status:** done

## P2-05 — `facebookFeature` document type

- **Objective:** Implement §11.4 — `title`, `postUrl`, `summary`, `image`, `displayOrder`, `isEnabled`.
- **Source:** TECH-SPEC §11.4; `FACEBOOK_FEATURES_QUERY`
- **Allowed paths:** `apps/studio/schemaTypes/facebookFeature.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** `postUrl` required and restricted to `https`; an `http://` URL fails. Image alt required. `displayOrder` required integer ≥ 1. Preview shows enabled state and order.
- **Verify:** Typecheck; paste an `http://facebook.com/...` URL and confirm it blocks.
- **Depends on:** P2-01
- **Risk:** Low
- **Status:** done

## P2-06 — `siteSettings` singleton document type

- **Objective:** Implement §11.1 — site title, hero and about headings/body, member count + source, social links, rules heading/intro copy, `featuredAnnouncement` — plus gaps G2 (`aboutFacts`), G4 (`rulesOutro*`) and G6 (newline guidance).
- **Source:** TECH-SPEC §11.1; spec G2/G4/G5/G6; `mapSiteSettings` at `queries.ts:175–210`
- **Allowed paths:** `apps/studio/schemaTypes/siteSettings.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** every field `mapSiteSettings` reads has a backing schema field. `socialLinks` entries require `platform` (constrained to the six in `SocialPlatform`), `label` and an `https` URL; Facebook and Discord entries are required to exist before launch. `memberCount` is a non-negative integer and `memberCountSource` is required alongside it. `heroHeading` and `aboutHeading` descriptions state that line breaks produce the stacked display lines.
- **Note:** G2/G4 fields are approval-gated (spec Q1). The §11.1 fields ship regardless.
- **Verify:** Typecheck; field-by-field walk of `SiteSettings` in `lib/content/types.ts`.
- **Depends on:** P2-01, P2-02, P2-04 (for the `featuredAnnouncement` reference target)
- **Risk:** Medium — largest surface, and the source of three of the six gaps.
- **Status:** done

## P2-07 — `privacyNotice` singleton document type

- **Objective:** Add the fifth document type the `/privacy` route already depends on: `lastReviewed`, `intro`, `sections[]{heading, paragraphs[]}`.
- **Source:** Spec gap G1; `PRIVACY_QUERY` at `queries.ts:142`; `getPrivacyNotice()` at `queries.ts:317`
- **Allowed paths:** `apps/studio/schemaTypes/privacyNotice.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** Shape matches `PrivacyNotice` / `PrivacySection` in `lib/content/types.ts` exactly. At least one section required. Field descriptions warn that the dataset is public.
- **Verify:** Typecheck; `/privacy` renders against a live dataset without throwing.
- **Depends on:** P2-01
- **Risk:** Low — but **blocked** on spec Q1, since this type is absent from TECH-SPEC §11 and adding it amends the source of truth.
- **Status:** done

## P2-08 — Schema barrel and config wiring

- **Objective:** Export all types from `apps/studio/schemaTypes/index.ts` and register them in `sanity.config.ts`, replacing `schema: { types: [] }`.
- **Source:** TECH-SPEC §12
- **Allowed paths:** `apps/studio/schemaTypes/index.ts`, `apps/studio/sanity.config.ts`
- **Forbidden paths:** `apps/web/`
- **Acceptance:** Studio boots with all document types listed; no schema validation warnings in the console.
- **Verify:** `make dev-studio` with `SANITY_STUDIO_*` set; console clean.
- **Depends on:** P2-03, P2-04, P2-05, P2-06
- **Risk:** Low
- **Status:** done

## P2-09 — Studio structure and singleton enforcement

- **Objective:** Build the §11.5 navigation and make `siteSettings` (and `privacyNotice`, if approved) genuine singletons.
- **Source:** TECH-SPEC §11.5
- **Allowed paths:** `apps/studio/structure/`, `apps/studio/sanity.config.ts`
- **Forbidden paths:** `apps/web/`, `apps/studio/schemaTypes/`
- **Acceptance:**
  - Sections: `Site & Homepage`, `Rules`, `Announcements`, `Featured Facebook Posts` (+ `Privacy notice`).
  - Singletons open a fixed-ID editor directly, are excluded from `newDocumentOptions` at global creation context, and have create/duplicate/delete removed from `document.actions` — so a direct URL cannot create a second one.
  - Rules list ordered by `displayOrder`; announcements newest-first; features by `displayOrder`.
  - Previews show title, published/enabled state, and date or order.
- **Verify:** Manual: attempt to create a second `siteSettings` via the global create menu and via direct URL; both must fail.
- **Depends on:** P2-08
- **Risk:** Medium — singleton enforcement is easy to implement as cosmetic hiding only.
- **Status:** done

## P2-10 — Studio lint and typecheck gates

- **Objective:** Give `apps/studio` an ESLint config and `lint`/`typecheck` scripts, and stop the root scripts from filtering to `@slga/web` only.
- **Source:** Spec FR-7; root `package.json`; `Makefile`
- **Allowed paths:** `apps/studio/eslint.config.mjs`, `apps/studio/package.json` (scripts only), `package.json` (scripts only), `Makefile`
- **Forbidden paths:** any `dependencies`/`devDependencies` block; `pnpm-lock.yaml`
- **Acceptance:** `pnpm lint` and `pnpm typecheck` at the repo root exercise both packages and pass. `@sanity/eslint-config-studio` is consumed by a real config file. No dependency or lockfile change.
- **Verify:** `pnpm lint && pnpm typecheck` from the repo root; `git diff pnpm-lock.yaml` is empty.
- **Depends on:** P2-08
- **Risk:** Low — but touching root scripts affects CI, so verify before landing.
- **Status:** done

## P2-11 — Typed GROQ integration

- **Objective:** Generate query result types from the finished schema, commit them, and delete the hand-written `Raw*` interfaces in favour of the generated ones.
- **Source:** TECH-SPEC §10.3; `docs/TASKS.md` T04; spec FR-6
- **Allowed paths:** `apps/studio/sanity.cli.ts` (typegen config only), `apps/web/src/lib/sanity/`
- **Forbidden paths:** `apps/web/src/app/`, `apps/web/src/components/`, `lib/content/types.ts`, `lib/content/seed.ts`
- **Acceptance:** Generated types are committed. `queries.ts` declares no `Raw*` interface and no `any` in the content path. Mappers compile against the generated shapes. GROQ strings themselves are unchanged except where a gap task requires a new projection.
- **First step:** Confirm `sanity typegen` exists in the installed v4 CLI. If it needs a new package, **stop and request approval** (AGENTS.md) — do not install.
- **Verify:** `pnpm typecheck`; generated file present in `git status`.
- **Depends on:** P2-08
- **Risk:** Medium — a typegen/GROQ mismatch surfaces as compile errors that are tempting to cast away. Fix the query, never the cast.
- **Status:** done — schema extracted for project `lcgep8ux`; 21 schema types and 8 GROQ results generated and consumed without client-method overloading.

## P2-12 — Close mapper gaps G2–G6

- **Objective:** Remove the last hardcoded values from `lib/sanity/queries.ts` now that schema fields back them.
- **Source:** Spec gap table
- **Allowed paths:** `apps/web/src/lib/sanity/queries.ts`, `apps/web/src/lib/content/types.ts`, `apps/web/src/lib/content/seed.ts`, `apps/web/src/app/page.tsx`
- **Forbidden paths:** other files under `apps/web/src/app/`, all of `apps/web/src/components/`
- **Acceptance:**
  - `aboutFacts` projects real documents instead of `const aboutFacts = []` (G2).
  - `kind` reads from the document instead of the literal `"ANNOUNCEMENT"` (G3).
  - `rules.outroTitle`/`outroBody` read from `siteSettings` instead of inline bilingual strings (G4).
  - `featuredAnnouncement` is resolved and preferred by the homepage's latest slot, falling back to newest published when absent, unpublished or future-dated (G5).
  - Newline-split behaviour for `heroHeading`/`aboutHeading` is documented at the split site (G6).
  - No literal user-facing copy remains anywhere in `lib/sanity/`.
- **Verify:** `rg` for hardcoded strings in `lib/sanity/`; `pnpm typecheck`; route-by-route comparison against the seed rendering.
- **Depends on:** P2-06, P2-11, and spec Q1–Q3 approval
- **Risk:** Medium
- **Status:** done — G5 uses a dedicated adapter method, preserving newest-first announcement-list ordering.

## P2-13 — Validation matrix and live verification

- **Objective:** Exercise every acceptance criterion in the running Studio against the real dataset.
- **Source:** Spec acceptance criteria; `docs/TASKS.md` T02 "done when"
- **Allowed paths:** documentation only — record results in this file
- **Acceptance:** Each of these is attempted and blocked: missing alt text; `http://` URL; English-only rule; announcement with no excerpt; duplicate slug; second `siteSettings`. Each of these succeeds: publishing a complete document of every type; a homepage copy edit appearing live within ~60s.
- **Verify:** Manual, recorded outcomes.
- **Depends on:** P2-09, P2-12, and the T02 founder gate
- **Risk:** Low
- **Status:** blocked

## P2-14 — TECH-SPEC §11 amendment

- **Objective:** Record the approved G1–G6 resolutions in the architecture source of truth so the spec and the code agree.
- **Source:** Spec gap table; the approval outcome of Q1–Q3
- **Allowed paths:** `docs/SLGA-PHASE-1-TECH-SPEC.md` (§11 and §12 only)
- **Forbidden paths:** all code
- **Acceptance:** §11 lists five document types with the approved fields; §12's file tree matches what was built. No undocumented divergence remains between schema and spec.
- **Verify:** Read-through against `apps/studio/schemaTypes/`.
- **Depends on:** P2-12, founder approval
- **Risk:** Low
- **Status:** done — approved G1–G6 decisions are recorded in §11 and §12.

---

## Parallel-safe groups

| Group | Tasks | Notes |
| --- | --- | --- |
| G-A | P2-01, P2-02 | P2-02 depends on P2-01's `imageWithAlt`; run sequentially within the group |
| G-B | P2-03, P2-04, P2-05, P2-07 | Fully independent document types, one file each |
| G-C | P2-06 | Must follow P2-04 (reference target) |
| G-D | P2-08 → P2-09, P2-10, P2-11 | P2-09/10/11 touch disjoint paths and can run in parallel after P2-08 |
| G-E | P2-12 → P2-13 → P2-14 | Strictly sequential; all gated on approval |

Two agents must not hold `sanity.config.ts` at once — P2-08, P2-09 and P2-10
all touch it or its siblings. Sequence them.

## Blocked / approval required

| Item | Gate | Who | Effect while unresolved |
| --- | --- | --- | --- |
| P2-13 live verification | `docs/TASKS.md` T02 gate — Sanity project, dataset, 1–3 founder accounts | Founder | Validation provable only by typecheck, not by publishing |

None of these block P2-01 through P2-05, P2-08, P2-09, P2-10, or the §11
portion of P2-06 — roughly two-thirds of the work can proceed today.
