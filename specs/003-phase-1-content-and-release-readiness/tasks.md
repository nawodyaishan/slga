# Tasks 003 — Phase 1 content and release readiness

**Spec:** `spec.md` · **Plan:** `plan.md`  
**Status:** complete
**Sources:** `docs/TASKS.md` T09 and Specs 001–002

## P3-01 — Migration and local-run tooling

- **Objective:** Add an idempotent original-content importer and combined local
  web/Studio command.
- **Allowed:** `apps/studio/scripts/`, scripts in `apps/studio/package.json`, `Makefile`.
- **Forbidden:** dependencies, lockfile, schemas, web routes/components.
- **Acceptance:** dry-run works; live mutation requires confirmation; no mock
  announcements/features; `dev-all` supplies both apps' public configuration.
- **Verify:** dry-run, Studio typecheck, `make -n dev-all`.
- **Risk:** Medium; authenticated dataset write is approval-gated.
- **Approval:** granted by direct user instruction.
- **Status:** done

## P3-02 — Backup and import original content

- **Objective:** Export the dataset, upload all retained images, and publish the
  two singletons plus ten bilingual rules.
- **Allowed:** configured Sanity project `lcgep8ux`, dataset `production`.
- **Forbidden:** deleting data; creating mock announcements/features.
- **Acceptance:** source asset inventory uploaded; exact IDs/counts query back;
  recovery export path recorded.
- **Verify:** authenticated GROQ count/ID query and Studio inspection.
- **Depends on:** P3-01.
- **Risk:** High (production dataset mutation).
- **Approval:** granted by direct user instruction.
- **Status:** done — backup `.backups/sanity-production-20260913-205740.tar.gz`;
  verified 13 assets, 10 rules, 1 settings, 1 privacy, and no mock content.

## P3-03 — Full local execution and route smoke test

- **Objective:** Run Studio and web concurrently against Sanity and probe all
  public route classes.
- **Allowed:** runtime processes and documentation status only.
- **Acceptance:** both endpoints start; core routes return expected HTTP codes;
  logs show the Sanity adapter, not seed fallback.
- **Verify:** HTTP probes for `/`, rules languages, announcements, privacy, and Studio.
- **Depends on:** P3-02.
- **Risk:** Low.
- **Status:** done — web and Studio started together; all listed endpoints returned HTTP 200.

## Dependency order

`P3-01 → P3-02 → P3-03`

## Handoff

The remaining T07–T10 production security, testing, editorial approval, QA, and
launch outcomes moved to `specs/004-phase-1-release-completion/spec.md`. They
are not incomplete work in this migration/local-readiness scope.
