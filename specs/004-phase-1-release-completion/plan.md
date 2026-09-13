# Plan 004 — Phase 1 release completion

**Spec:** `spec.md`  
**Status:** architecture approved

## Summary

Complete the locally verifiable T07–T10 release gates using native Next.js
metadata/headers, deterministic Playwright fixtures, axe scans, and documented
operations. Defer only the external Vercel deployment and exact-commit launch.

## Inputs reviewed

Specs 001–004, the Phase 1 tech spec, `docs/TASKS.md` T07–T10, current routes,
content adapters, metadata, analytics, Next config, and package scripts. Exa
research reviewed current official Playwright accessibility, web-server, and CI
guidance plus current Next.js metadata/security-header guidance.

## Assumptions

- Production canonical default is `https://slgaofficial.github.io` and can be
  overridden by `NEXT_PUBLIC_SITE_URL`.
- Imported content listed in the spec is editorially approved.
- Empty announcements/features are valid until genuine entries are supplied.

## Architecture approach

1. Centralize site-origin parsing and deployment-context indexing decisions.
2. Use Next Metadata APIs for canonical/Open Graph/language alternatives and
   JSON-LD rendered as escaped JSON script data.
3. Configure response security headers in `next.config.ts`, allowing only the
   origins required by Next, Sanity images/content, and Vercel analytics.
4. Add `@playwright/test` and `@axe-core/playwright`; use Playwright's
   `webServer`, deterministic seed mode, relative URLs, traces on retry, and
   Chromium/Firefox/WebKit projects.
5. Cover primary journeys and WCAG A/AA automated checks. Use Playwright MCP
   separately for interactive browser verification of the running site.
6. Add concise operations/founder documentation and retain launch as an
   explicit external approval gate.

## Affected modules

- `apps/web/src/app/**`: metadata, robots, structured data.
- `apps/web/src/lib/**`: origin/indexing helpers and focused unit-testable logic.
- `apps/web/next.config.ts`: security headers.
- `apps/web/package.json`, root scripts/Makefile, `pnpm-lock.yaml`: approved test tooling.
- `playwright.config.ts`, `tests/**`: browser and axe suites.
- `docs/**`, Spec 004: operations and completion state.

## Contracts and data model

No CMS or public API model changes. The externally observable contracts are
canonical URLs, robots directives, JSON-LD, security headers, and the existing
closed analytics event vocabulary.

## Dependencies

Add only `@playwright/test` and `@axe-core/playwright` as development
dependencies. This and the lockfile update are explicitly approved. Browser
binaries are installed by Playwright, not committed.

## Security, authorization, and observability

No auth changes. CSP forbids objects/frames and limits connections/images to
known origins. Tests and reports contain no credentials. Analytics remains the
existing three typed event families. No monitoring service is added.

## Testing strategy

- Existing lint/typecheck/build gates.
- Playwright smoke, keyboard, responsive, 404, metadata, headers, and axe tests.
- Chromium locally; all three engines before release where binaries are available.
- Playwright MCP manual pass against the running local server.

## Failure modes and rollback

An over-restrictive CSP may break fonts/images/analytics; header and browser
tests catch this before deployment. Metadata defaults remain overridable by
environment. Rollback is a code revert; no dataset mutation is planned.

## Risks and mitigations

- Live content drift: browser tests run in seed mode.
- Automated a11y incompleteness: retain keyboard/zoom/manual release checks.
- GitHub Pages may not run Next server features: production hosting decision is
  still required before launch despite the canonical default.
- Existing Studio dependency warning is unrelated and remains unmodified.

## Human architecture approval

Approved by the user's instruction to proceed and explicit dependency/content
confirmation. External deployment remains gated.
