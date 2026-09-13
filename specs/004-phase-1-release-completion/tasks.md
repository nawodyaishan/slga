# Tasks 004 — Phase 1 release completion

**Status:** approved for implementation

## P4-01 — Production identity, metadata, and security

- **Objective:** Complete T07 metadata, indexing, structured data, and headers.
- **Sources:** Spec 004 FR-1–FR-3; tech spec §§14–16.
- **Allowed:** `apps/web/src/app/**`, `apps/web/src/lib/**`, `apps/web/next.config.ts`.
- **Forbidden:** CMS schemas/data, dependencies, deployment.
- **Acceptance:** canonical/OG/alternates/JSON-LD/robots/headers work with safe defaults.
- **Verify:** lint, typecheck, build, HTTP/header/browser inspection.
- **Risk:** Medium. **Approval:** granted. **Status:** done.

## P4-02 — Playwright and accessibility foundation

- **Objective:** Add approved Playwright/axe dependencies, config, scripts, and ignores.
- **Allowed:** manifests, lockfile, Playwright config, `.gitignore`, Makefile.
- **Forbidden:** production dependencies and app behavior.
- **Acceptance:** deterministic seed-mode web server and three browser projects configured.
- **Verify:** list tests and run Chromium.
- **Depends on:** P4-01. **Risk:** Medium. **Approval:** granted. **Status:** done.

## P4-03 — Browser, keyboard, and axe coverage

- **Objective:** Cover primary routes, 404, community links, mobile menu, and WCAG A/AA.
- **Allowed:** `tests/**`.
- **Forbidden:** weakening app behavior or suppressing violations.
- **Acceptance:** Chromium passes with no critical/serious axe violations.
- **Verify:** `pnpm test:e2e --project=chromium` and Playwright MCP pass.
- **Depends on:** P4-02. **Risk:** Medium. **Status:** done.

## P4-04 — Founder and rollback guide

- **Objective:** Document editing, publishing, alt text, slug safety, access removal, and rollback.
- **Allowed:** `docs/**`.
- **Acceptance:** concise actionable guide covers code/content/Studio recovery.
- **Verify:** command/path review against repository tooling.
- **Depends on:** P4-01. **Risk:** Low. **Status:** done.

## P4-05 — Release verification and handoff

- **Objective:** Run all local release gates and record external blockers.
- **Allowed:** Spec 004 status only.
- **Acceptance:** lint/typecheck/build/tests pass; launch remains unclaimed.
- **Verify:** `make verify` plus browser checks.
- **Depends on:** P4-01–P4-04. **Risk:** Medium. **Status:** local gates complete; external launch approval pending.

## Order

`P4-01 → P4-02 → P4-03`; P4-04 may run after P4-01; then P4-05.
