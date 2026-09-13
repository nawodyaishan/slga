# Spec 003 — Phase 1 content and release readiness

**Type:** migration and local-readiness spec
**Status:** complete
**Source of truth:** `docs/SLGA-PHASE-1-TECH-SPEC.md`, `docs/TASKS.md` T09
**Depends on:** Specs 001 and 002

## Problem statement

The Phase 1 web app and Studio were implemented, but the real Sanity dataset had
no baseline content and local development was split across separate commands.

## Goals

1. Import the retained legacy images and ten bilingual rules into Sanity using
   a repeatable, auditable process.
2. Supply the minimum settings and privacy documents required for every public
   route to run against Sanity locally.
3. Start the web app and Studio together with the real project configuration.

## Non-goals

- Treating prototype announcements or Facebook cards marked `MOCK CONTENT` as
  real published content.
- Claiming the migrated English rule translations, member count, social URLs,
  or image usage rights have founder approval.
- Deploying the public Next.js site or changing dependencies.
- Adding accounts, previews, webhooks, or any Phase 2 feature.

## Actors and journeys

- A developer runs one command and gets the web app and Studio locally against
  project `lcgep8ux`, dataset `production`.
- An editor opens Studio and finds the original assets, ten ordered bilingual
  rules, site settings, and privacy notice ready for review.
- A founder can revise and approve migrated content before public-site launch.

## Functional requirements

- FR-1: Migration uses stable document IDs and is safe to rerun.
- FR-2: All files under `assets/img/` are uploaded without deleting or moving
  their repository originals.
- FR-3: The ten rules come from the existing migration source in
  `apps/web/src/lib/content/seed.ts` and preserve both languages and ordering.
- FR-4: Required singleton documents are populated from the same source.
- FR-5: Prototype mock announcements/features are not imported.
- FR-6: Dataset mutation requires explicit confirmation and authenticated CLI
  access; no token is committed or exposed to the browser.
- FR-7: A recoverable dataset export is taken before the first mutation.
- FR-8: One local command starts both applications with consistent public env.

## Acceptance criteria

- Sanity contains 10 published `rule` documents with IDs `rule-1`…`rule-10`.
- `siteSettings` and `privacyNotice` exist under their singleton IDs.
- All 13 retained files from `assets/img/` are available as Sanity assets.
- No mock announcement or Facebook feature is created by the migration.
- The import can be rerun without duplicate content documents.
- `/`, `/rules`, `/si/rules`, `/announcements`, and `/privacy` respond locally
  while reading Sanity.
- Studio and web run concurrently from a documented Make target.

## Edge cases and safety

- Existing documents with migration-owned IDs are replaced; unrelated editor
  documents and assets are untouched.
- A failed upload stops before documents are committed.
- Existing binary assets may be deduplicated by Sanity; acceptance counts the
  complete source inventory rather than requiring duplicate blobs.
- Missing authentication aborts with no committed token.

## Data sensitivity

The dataset is public and contains community-facing material only. The import
must never contain credentials, member records, moderation data, or private
notes. The local authenticated CLI token remains in Sanity's user config.

## Assumptions

- The user's instruction authorizes writing migration content to the configured
  `production` dataset, but does not constitute final editorial approval.
- `home1.jpg` is the most appropriate retained hero/default sharing image;
  all other images are uploaded for editor selection without invented usage.
- The Facebook and Discord URLs were founder-corrected after migration; the
  66,000 count remains a review item under T09.

## Open questions

None. Release-level questions and founder gates are owned by
`specs/004-phase-1-release-completion/spec.md`.

## Approval status

Completed and verified. Migration tooling, authenticated import, and local
execution were approved by direct user instruction. Public-site release work is
explicitly handed off to Spec 004.
