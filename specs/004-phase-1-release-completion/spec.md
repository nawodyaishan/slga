# Spec 004 — Phase 1 release completion

**Type:** release specification  
**Status:** local implementation complete; external release approval pending
**Source of truth:** `docs/SLGA-PHASE-1-TECH-SPEC.md`, `docs/TASKS.md` T07–T10  
**Depends on:** Specs 001–003

## Problem statement

The Phase 1 public site, Sanity content model, hosted Studio, original-asset
migration, and local Sanity-backed runtime now exist. The project is not ready
for public launch because production identity and indexing behavior are
unconfirmed, release security and metadata are not fully verified, automated
regression/accessibility coverage is absent, migrated editorial material still
needs founder review, and no exact release candidate has passed the complete
cross-browser launch gate.

This specification defines the remaining outcome: a secure, tested,
editor-approved Phase 1 site that can replace the legacy GitHub Pages site with
a documented rollback path.

## Current baseline

- The Next.js site implements the Phase 1 routes and reads published Sanity
  content through the typed content boundary.
- Sanity Studio is deployed at `https://slgaofficial.sanity.studio`.
- The `production` dataset contains site settings, privacy content, ten ordered
  bilingual rules, and thirteen retained legacy images.
- Founder-supplied community links are:
  - Facebook: `https://www.facebook.com/groups/slgaofficial`
  - Discord: `https://discord.com/invite/kHyyWcftg`
- Prototype announcements and featured Facebook cards were deliberately not
  migrated because they are marked as mock content.
- Local web and Studio servers run together and all primary routes currently
  return HTTP 200.

## Goals

1. Complete production SEO, social-sharing metadata, analytics, indexing rules,
   and browser security controls from the Phase 1 tech spec.
2. Establish deterministic automated coverage for core content behavior,
   navigation, accessibility, and route correctness.
3. Obtain explicit editorial approval for every claim, rule translation,
   image, link, privacy statement, announcement, and featured card that will be
   public at launch.
4. Pass the complete accessibility, responsive, cross-browser, performance,
   metadata, and security release matrix.
5. Publish an explicitly approved release candidate with clear operational and
   editorial rollback instructions.

## Non-goals

- Public accounts, authentication, profiles, comments, LFG, events,
  tournaments, directories, live Discord/Facebook integrations, or other
  Phase 2 features.
- Site-wide Sinhala or Tamil localization beyond the two rules routes.
- Automated member counts, Facebook embeds, preview mode, or CMS webhooks.
- Rewriting the accepted visual system or replacing the current framework/CMS.
- Removing the legacy site or history before the replacement is verified.

## Actors

| Actor | Responsibility |
| --- | --- |
| Visitor | Reads, navigates, shares, and follows community links safely across supported devices |
| Founder | Approves public copy, media rights, privacy notice, production URL, and exact release candidate |
| Editor | Maintains validated content in Studio and can recover from an editorial mistake |
| Release owner | Verifies security, metadata, analytics, deployment, monitoring, and rollback |
| QA contributor | Runs deterministic automated and manual acceptance checks without mutating live content |

## User journeys

1. A visitor opens any production URL and receives the correct canonical,
   share preview, indexing behavior, and security headers.
2. A keyboard or screen-reader user navigates every primary route, including
   the mobile menu and bilingual rules, without a serious accessibility issue.
3. A visitor follows the verified Facebook or Discord action from any relevant
   page and reaches the correct community destination.
4. An editor publishes a valid content correction, observes it on the site
   within about 60 seconds, and can recover the previous revision.
5. A release owner detects a bad site or content release and restores the last
   known-good state using documented procedures.

## Functional requirements

### FR-1 — Production identity and discoverability

- Every public route has a canonical URL based on the founder-approved
  production origin.
- Preview deployments are non-indexable and do not claim production canonicals.
- The homepage exposes valid Organization and WebSite structured data.
- Announcement detail pages expose valid Article structured data.
- Open Graph and fallback metadata use approved copy and media.
- The sitemap contains all public static routes and only published,
  non-future announcements.
- Rules routes expose correct English/Sinhala language alternatives.

### FR-2 — Privacy-preserving analytics

- Analytics is limited to page views and the three event families approved in
  the tech spec.
- Event properties use closed, documented values and contain no names, URLs,
  identifiers, free text, or other personal data.
- Blocking or failure of analytics never blocks navigation or rendering.
- The approved privacy notice accurately describes the launch configuration.

### FR-3 — Browser security

- Production responses enforce the CSP, Referrer-Policy,
  X-Content-Type-Options, and Permissions-Policy requirements in the tech spec.
- Required Sanity image and analytics resources continue to work under those
  controls.
- No secret, write token, authenticated dataset request, or private material is
  present in browser code, generated output, logs, or committed files.
- External destinations use safe new-tab behavior where applicable.

### FR-4 — Deterministic automated quality coverage

- Content behavior is tested independently of mutable production data.
- Automated checks cover rule ordering/localization, publication filtering,
  dates, image handling, metadata fallbacks, analytics mappings, and external
  link safety.
- Browser smoke coverage includes global navigation, both rules routes,
  announcements, unknown-announcement 404 behavior, community calls to action,
  and mobile-menu keyboard behavior.
- Automated accessibility scans cover every important page type and report no
  critical or serious issue.

### FR-5 — Editorial readiness

- Each retained rule, translation, claim, privacy statement, social URL, and
  image is classified as approved, rewrite, or discard by a founder.
- The member count and its source are current and explicitly approved.
- Image usage rights and alt text are confirmed before an image appears publicly.
- Only genuine, founder-approved announcements and up to three genuine featured
  Facebook cards are published; prototype mock entries remain excluded.
- Studio validation, publish/unpublish, revision history, and approximately
  60-second site refresh behavior are demonstrated.

### FR-6 — Release qualification and operations

- The release candidate passes keyboard, screen-reader-oriented semantics,
  200% zoom, 320 px layout, Sinhala font, broken-link, social-preview,
  analytics, and responsive visual checks.
- Supported Chromium, Firefox, and WebKit flows pass before launch.
- Lighthouse reaches Performance ≥90 and Accessibility, Best Practices, and
  SEO ≥95 on representative production pages.
- A concise founder guide covers editing, publishing, rollback, image alt text,
  slug safety, and removing Studio access.
- Code deployment, content rollback, and Studio rollback procedures are tested
  and documented.
- The founder approves the exact release commit before production deployment.

## Acceptance criteria

- [ ] The exact production origin and canonical policy are founder-approved.
- [ ] Production and preview indexing behavior is verified from deployed responses.
- [ ] Structured data and share cards validate for homepage and announcement pages.
- [ ] Approved analytics emits only the documented event/property combinations.
- [ ] Required security headers are present and do not break images or analytics.
- [ ] Repository and built-client scans find no secret or write credential.
- [ ] Deterministic unit/integration and browser suites pass without depending on live CMS mutations.
- [ ] Chromium, Firefox, and WebKit release suites pass.
- [ ] Automated accessibility scans report no critical or serious findings.
- [ ] Keyboard, mobile-menu, 320 px, 200% zoom, and Sinhala rendering checks pass.
- [ ] Lighthouse thresholds are met on representative pages.
- [ ] Every published content item and media asset has recorded founder approval.
- [ ] Correct Facebook and Discord links work while logged out.
- [ ] A Studio edit appears publicly within approximately 60 seconds.
- [ ] Code and content rollback procedures are successfully rehearsed.
- [ ] Founder guide is delivered and the exact release commit is approved.
- [ ] The replacement site is verified before legacy GitHub Pages is disabled.

## Success criteria

- A visitor can use every Phase 1 journey on a supported browser without a
  release-blocking functional, accessibility, privacy, or security defect.
- Search engines and social platforms receive the intended production identity
  without indexing previews or unpublished content.
- Founders can maintain and recover public content without repository access.
- A failed deployment or editorial change can be rolled back through a tested,
  documented process.

## Edge cases

| Case | Expected outcome |
| --- | --- |
| Preview deployment | Non-indexable; does not emit a misleading production canonical |
| Missing optional announcement image | Valid metadata fallback; no broken layout or image |
| Future/draft announcement | Excluded from pages, sitemap, structured data, and static paths |
| Empty announcements/features | Honest empty/omitted states; no mock replacement content |
| Analytics blocked | Site and outbound actions continue normally |
| CSP blocks a required origin | Release fails until policy or integration is corrected explicitly |
| Unapproved image or translation | Remains unpublished regardless of technical validity |
| Duplicate or changed announcement slug | Studio warning/validation and documented editor recovery path |
| Sanity temporarily unavailable | Last valid cached/static output remains usable where supported |
| Release regression | Restore last known-good code deployment without deleting CMS history |

## Data sensitivity and compliance

The public site must remain account-free and must not collect member data.
Analytics data is aggregate and constrained to the approved event schema.
Sanity contains only content intended for public reading; moderation records,
credentials, personal details, and internal notes are prohibited. Privacy copy
must be approved against the actual launch configuration before release.

## Integration expectations

- Sanity remains the public, token-free content source with hosted Studio for
  authorized editors.
- Vercel is the expected web hosting and analytics platform, subject to final
  project/origin confirmation.
- Facebook and Discord remain outbound links only; no SDK, embed, or API is
  introduced.
- Tests use deterministic fixtures rather than modifying the production dataset.

## Assumptions

1. The hosted Studio and current Sanity project/dataset remain the launch CMS.
2. The existing Phase 1 routes and visual design remain accepted baselines.
3. The corrected Facebook and Discord URLs are approved unless the founder
   supersedes them explicitly.
4. Dependency and lockfile changes needed for automated testing require a
   separate explicit approval before implementation.
5. GitHub Pages remains available until the replacement deployment is verified.

## Open questions

| # | Question | Owner | Blocks |
| --- | --- | --- | --- |
| Q1 | What is the exact production web origin and Vercel project? | Resolved by documented default | Use `https://slgaofficial.github.io`; Vercel deployment remains deferred |
| Q2 | Approve adding the minimal test dependencies and lockfile changes required for browser and accessibility automation? | Resolved: approved | Add Playwright Test and axe integration |
| Q3 | Which imported content is approved for launch? | Resolved: approved | Rules, privacy copy, retained images, and 66,000-member count are approved |

## Human approval status

Approved through the instruction to proceed, add Playwright/accessibility
coverage, and treat the imported content as confirmed. Public web deployment
still requires explicit approval of the exact release commit.
