# Architecture review 004

## SEO follow-up verification — 2026-09-14

Status: Needs changes for release sign-off. SEO assertions passed; production
article hydration needs investigation. Deployment remains pending.

- Secondary routes now load the CMS default sharing image explicitly (Next.js
  shallow-merges Open Graph metadata). Announcement metadata includes publication
  time and uploaded-image priority; social images retain alt text and use Sanity
  1200 × 630 crops. Article publisher identity is self-contained.
- Sitemap includes `/showcase`, published announcements and bilingual rules
  alternates; static routes no longer claim an invented modification date.
  Non-indexable robots output does not advertise a production sitemap.
- `make lint`: passed with seven existing image-element warnings.
- `make typecheck`: passed. `make build`: passed after permitting public Sanity
  network access (initial sandbox attempt failed DNS resolution).
- `pnpm test:e2e`: 54 passed across Chromium, Firefox and WebKit, including
  focused production/preview metadata, fallback, crop and article regression tests.
- Playwright MCP inspected the local production build using published content:
  `/showcase` canonical, indexing and default image; sitemap and robots output;
  bilingual alternates; published article date/JSON-LD and uploaded image with
  actual natural dimensions 1200 × 630.
- Local Vercel Analytics script unavailable outside Vercel; analytics receipt
  and external social-preview crawler validation remain deployment checks.
- MCP also recorded React error #418 (hydration mismatch) on the published
  announcement route. The cause is not established and seed tests do not
  reproduce it. Do not treat the passing SEO assertions as runtime release
  approval; reproduce and diagnose against published content before launch.
- No dependencies, schema, live content, or deployment changed in this follow-up.

References: [Next.js metadata merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata),
[Sanity image transformations](https://www.sanity.io/docs/content-lake/image-urls).

**Status:** Approved  
**Reviewed:** spec, plan, Phase 1 tech spec, T07–T10, dependency and rollback notes  
**Reviewer/date:** Codex / 2026-09-13

## Findings

- Blocking: none for local implementation.
- The two new test dependencies and lockfile change are explicitly approved.
- Canonical default is documented; actual web deployment remains gated because
  no Vercel project was supplied.
- Tests use deterministic seed content and cannot mutate Sanity.

## Required boundary

Do not deploy the public web app, disable GitHub Pages, or alter production
content during this implementation phase.

## Verification review

**Status:** Approved for code review; not approved for public deployment
**Reviewed:** implementation diff against P4-01–P4-05
**Reviewer/date:** Codex / 2026-09-14

### Findings

- Blocking findings: none for the local implementation.
- The approved dependencies are development-only and the lockfile is updated.
- All 45 Chromium, Firefox, and WebKit checks cover navigation, rules localization,
  announcements/404, mobile-menu keyboard behavior, indexing/headers, sitemap,
  structured data, and WCAG A/AA checks.
- Playwright MCP confirmed narrow-layout navigation and `/showcase` in the
  generated sitemap.
- Repository scans found no committed secret or private key.

### External release gates still open

- Lighthouse thresholds and manual 200% zoom/screen-reader/platform Sinhala checks.
- Deployed production/preview response and social-card validation.
- Analytics receipt validation against the deployed project.
- Code/content rollback rehearsal on the selected hosting project.
- Founder approval of the exact release commit before deployment.
