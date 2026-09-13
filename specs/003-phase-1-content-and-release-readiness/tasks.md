# Tasks 003 — Phase 1 content and release readiness

**Spec:** `spec.md` · **Plan:** `plan.md`  
**Sources:** `docs/TASKS.md` T07–T10 and Specs 001–002

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

## P3-04 — Security headers and production configuration (T07)

- **Objective:** Implement CSP/security headers, metadata/canonicals, env
  validation, and production build/deploy configuration from the tech spec.
- **Allowed/forbidden:** define in a focused implementation pass after origin
  and analytics choices are approved.
- **Verify:** header probes and configured production build.
- **Approval:** production config and deployment require explicit approval.
- **Status:** blocked — production origin and Vercel project are unknown.

## P3-05 — Automated test suite (T08)

- **Objective:** Add unit/integration, Playwright, and axe coverage for the
  acceptance matrix in Spec 001 and `docs/TASKS.md` T08.
- **Verify:** Chromium CI, then Firefox/WebKit before release.
- **Approval:** dependency/lockfile changes require explicit approval.
- **Status:** blocked — test dependency decision not approved.

## P3-06 — Editorial review and replacement content (T09)

- **Objective:** Review imported rules/assets and member count, verify the
  founder-supplied social links, and add approved announcements and featured cards.
- **Verify:** Studio validation, logged-out links, rights confirmation, and
  founder sign-off for both rule languages.
- **Status:** blocked — founder editorial inputs and rights approval required.

## P3-07 — Release QA and launch (T10)

- **Objective:** Complete cross-browser/a11y/performance QA, founder guide,
  rollback documentation, exact-commit approval, and public launch.
- **Depends on:** P3-03 through P3-06.
- **Verify:** all Phase 1 acceptance criteria and Lighthouse targets.
- **Approval:** exact release commit and deployment approval required.
- **Status:** blocked.

## Dependency order

`P3-01 → P3-02 → P3-03 → (P3-04, P3-05, P3-06) → P3-07`

P3-04, P3-05, and P3-06 are parallel-safe once their separate approval gates
are resolved; their write scopes must be fixed before agents are assigned.
