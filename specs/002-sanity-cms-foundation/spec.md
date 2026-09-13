# Spec 002 — Sanity CMS foundation

**Type:** feature spec
**Status:** approved for implementation; live Sanity provisioning remains founder-gated
**Source of truth:** `docs/SLGA-PHASE-1-TECH-SPEC.md` §11 (content model), §10.2–10.3 (rendering/resilience), §13 (env)
**Roles:** `docs/TASKS.md` T02 (owner A2), with T04 follow-through
**Depends on:** Spec 001 (shipped — routes, content boundary, seed adapter)

## Problem statement

`apps/studio` is an empty shell. `sanity.config.ts` declares
`schema: { types: [] }`, there is no `schemaTypes/` directory and no
`structure/` directory. No founder can enter content, and no document type
exists for the web app to read.

The consequence is already visible: `apps/web/src/lib/content/index.ts`
selects the seed adapter in development and **throws** in production
(`SLGA_CONTENT_MISCONFIGURED`). Spec 001's build fails by design at
`pnpm build` for exactly this reason. The public site therefore cannot be
deployed at all until the content model exists.

A second, subtler problem: `apps/web/src/lib/sanity/queries.ts` was written
against TECH-SPEC §11 ahead of the Studio, and six fields the rendered pages
actually consume have no home in that schema. Those gaps are invisible today
because every page reads the seed adapter, which supplies them from migrated
prototype copy. The moment a real dataset is configured, the seed adapter is
bypassed and those fields degrade silently — empty tiles, frozen copy, and one
hard 500. Closing them is the substance of this spec, not a footnote.

## Goals

1. All content the shipped pages render is editable by a founder in Studio —
   no rendered string originates in a `.ts` file under `lib/sanity/`.
2. `sanityAdapter` and `seedAdapter` return structurally identical data, so
   switching the source changes nothing a visitor sees except the copy itself.
3. Invalid content cannot be published: missing alt text, non-HTTPS URLs,
   half-translated rules and empty announcements all fail Studio validation.
4. `siteSettings` is a true singleton — not creatable, duplicable or deletable
   through normal Studio affordances.
5. Sanity query result types are generated from the real schema, not
   hand-maintained, satisfying TECH-SPEC §10.3's "no untyped `any` content
   plumbing".
6. The Studio is covered by the same lint/typecheck gates as the web app.

## Non-goals

- Creating the Sanity project or `production` dataset, and provisioning founder
  accounts — founder-gated (TECH-SPEC §13, `docs/TASKS.md` T02 gate).
- Entering real production content, or approving the rule translations and
  member count carried over from the prototype (tracked as T09).
- Deploying the Studio to `slga.sanity.studio` (T10).
- Webhooks / on-demand revalidation — TECH-SPEC §10.2 defers these past Phase 1.
- Changing any page component. Spec 001's routes are the consumer contract and
  stay as-is; if a page needs changing to fit the schema, the schema is wrong.

## Actors

| Actor | Capability in this spec |
| --- | --- |
| Founder/editor | Creates and publishes all four document types in Studio; cannot publish invalid content |
| Visitor | Unaffected directly — sees founder-entered copy instead of seed copy |
| Implementation agent | Writes schema types, structure, validation, typegen wiring |

## User journeys

1. A founder opens Studio, sees four clearly named sections, and finds exactly
   one "Site & Homepage" document that cannot be duplicated or deleted.
2. A founder writes a new announcement, forgets the excerpt, and is blocked
   from publishing with a message naming the missing field.
3. A founder uploads a Facebook card image without alt text and cannot publish
   until it is supplied.
4. A founder adds rule 11 in English only and is blocked until the Sinhala
   title and body exist.
5. A founder edits the hero heading; within ~60 seconds the live homepage shows
   the new text with no code deployment (TECH-SPEC §10.2).

## Content-model gaps to close

These are the six places where the schema in TECH-SPEC §11 cannot supply what
the shipped pages consume. **Resolving them amends TECH-SPEC §11 and therefore
requires founder/A0 approval before implementation.** A recommendation is given
for each; none is implemented until approved.

| # | Gap | Evidence | Effect if shipped unresolved | Recommendation |
| --- | --- | --- | --- | --- |
| G1 | No `privacyNotice` document type exists in §11, but the adapter queries one and `/privacy` renders it | `queries.ts:142`, `getPrivacyNotice()` throws `SLGA_PRIVACY_NOTICE_MISSING` at `queries.ts:317` | `/privacy` returns a hard 500 on a live dataset | Add a fifth singleton type `privacyNotice` (`lastReviewed`, `intro`, `sections[]{heading, paragraphs[]}`) |
| G2 | `aboutFacts` has no schema field; the mapper hardcodes `[]` | `queries.ts:181,195` vs. `components/sections/about.tsx` rendering `settings.aboutFacts` | The homepage's three About tiles silently disappear | Add `aboutFacts` array (2–4 objects: `key`, `title`, `description`) to `siteSettings` |
| G3 | `Announcement.kind` has no schema field; the mapper hardcodes `"ANNOUNCEMENT"` | `queries.ts:226` | Every announcement badge and breadcrumb reads `ANNOUNCEMENT`; the design's `RULES UPDATE` / `COMMUNITY` kickers become unreachable | Add `kind` as a constrained string list (`ANNOUNCEMENT`, `RULES UPDATE`, `COMMUNITY`, `EVENT`), default `ANNOUNCEMENT` |
| G4 | `rules.outroTitle` / `outroBody` are hardcoded bilingual strings in the mapper | `queries.ts:201–205` | The Sinhala "Something unclear?" panel is frozen in code and uneditable — violates goal 1 | Add `rulesOutroTitleEn/Si`, `rulesOutroBodyEn/Si` to `siteSettings`, matching the existing `rulesHeading*` pattern |
| G5 | §11.1 defines a `featuredAnnouncement` reference, but no query reads it; the homepage uses `announcements[0]` | `app/page.tsx` `const latest = announcements[0]` | A founder's explicit pick is silently ignored; the field is dead weight in Studio | Either honour it in `getSiteSettings`/homepage, or drop it from §11.1. Prefer **honouring** it with newest-published fallback, as §11.1 already specifies |
| G6 | `heroHeading` / `aboutHeading` are `string` in §11.1 but the mapper splits them on `\n` to produce the design's stacked lines | `queries.ts:187,193` | An editor typing one line gets a single-line hero; the design's three-line stack is undiscoverable | Keep `string` + newline contract, but make it explicit via field `description` and a validation warning when the hero has no line break |

## Functional requirements

**FR-1 — Schema types.** Implement `siteSettings`, `rule`, `announcement`,
`facebookFeature` per TECH-SPEC §11.1–11.4 exactly, plus whichever of G1–G6 are
approved. Use `defineType`/`defineField` throughout for type inference.

**FR-2 — Restricted Portable Text.** Two distinct block configurations:
- rules (§11.2): paragraphs, `h3`, bold, italic, links, ordered + bullet lists.
- announcements (§11.3): the above plus `h2`, block quotes, and images with
  required alt text.
Neither permits raw HTML, scripts, iframes or arbitrary embeds. These must
match the allowlists already implemented in
`components/portable-text/{rules,announcement}-portable-text.tsx` — any style
the schema permits but the renderer does not register degrades to plain text.

**FR-3 — Validation.** At minimum: required fields per §11; `displayOrder`
integer ≥ 1 with a duplicate warning; `memberCount` non-negative integer;
`postUrl` and every social URL constrained to `https` scheme; alt text required
on every non-decorative image; both `title.en`/`title.si` and `body.en`/`body.si`
required together on `rule`; unique slug on `announcement`; `seoDescription`
guided toward 120–160 characters.

**FR-4 — Singleton.** `siteSettings` is reachable only through a fixed-ID
structure item, is filtered out of global "new document" options, and has
create/duplicate/delete actions removed.

**FR-5 — Studio structure.** Navigation matching TECH-SPEC §11.5:
`Site & Homepage`, `Rules`, `Announcements`, `Featured Facebook Posts` (plus
`Privacy notice` if G1 is approved). Rules ordered by `displayOrder`,
announcements newest-first, features by `displayOrder`. Previews show title,
state, date/order and a thumbnail where one exists.

**FR-6 — Typed integration.** Generate query result types from the schema
(`sanity typegen`) and consume them in `lib/sanity/queries.ts`, replacing the
hand-written `Raw*` interfaces. The generated artifact is committed. No `any`
in the content path.

**FR-7 — Quality gates.** `apps/studio` gains `lint` and `typecheck` scripts
and an ESLint config using the already-declared
`@sanity/eslint-config-studio`; root `pnpm lint` / `pnpm typecheck` (and the
`make` targets) cover both workspace packages, not just `@slga/web`.

## Acceptance criteria

- [ ] `apps/studio/schemaTypes/index.ts` exports all approved types; `sanity.config.ts` no longer declares an empty `types: []`.
- [ ] Studio starts via `make dev-studio` with no committed credentials (reads `SANITY_STUDIO_*` from the environment).
- [ ] A document missing any required field cannot be published, and the error names the field.
- [ ] An image without alt text cannot be published.
- [ ] An `http://` (non-TLS) URL fails validation in both `postUrl` and `socialLinks[].url`.
- [ ] A rule with an English title but no Sinhala title fails validation.
- [ ] Two announcements cannot share a slug.
- [ ] `siteSettings` does not appear in the global create menu and shows no duplicate/delete action.
- [ ] Every field consumed by a Spec 001 page is editable in Studio — verified field-by-field against `ContentAdapter` in `lib/content/types.ts`.
- [ ] Generated types exist, are committed, and `lib/sanity/queries.ts` imports them instead of declaring `Raw*` interfaces.
- [ ] `pnpm lint` and `pnpm typecheck` pass for both `apps/web` and `apps/studio`.
- [ ] With a configured project id, every route renders from Sanity with no visual regression against the seed rendering.

## Success criteria

A founder with no repository access can publish every piece of copy the site
displays, cannot publish content that would break a page, and sees the change
live within about a minute.

## Edge cases

| Case | Expected behaviour |
| --- | --- |
| No `siteSettings` document exists | Production build fails loudly (already implemented, `queries.ts:273`) — TECH-SPEC §10.3 |
| No announcements published | Homepage hides the Latest section; `/announcements` shows its empty message (already implemented) |
| No enabled `facebookFeature` | Homepage hides the Featured section entirely (already implemented) |
| More than three enabled features | Query caps at three by `displayOrder` (already implemented, `queries.ts:127`) |
| Announcement dated in the future | Excluded from lists, detail route 404s (already implemented) |
| Two rules share a `displayOrder` | Publishes, but Studio shows a warning; ordering falls back to `_createdAt` |
| `featuredAnnouncement` points at an unpublished/future doc | Falls back to newest published, never renders a draft |
| Social link enabled but URL empty | Fails validation; Facebook and Discord additionally required before launch (§11.1) |
| Rule body present in `si` but empty in `en` | Fails validation — no silent monolingual publish |

## Data sensitivity

The `production` dataset is public and readable without a token. Nothing
private may enter it: no member data, credentials, moderation reports or
internal notes (TECH-SPEC §11). No write token may reach the web app or the
browser — the client stays token-free (`lib/sanity/client.ts`).

## Assumptions

- **A1** — The Sanity project and dataset are provisioned by a founder before
  this work can be verified end-to-end. Schema code can be written and
  typechecked without them; only live validation testing is gated.
- **A2** — `sanity typegen` ships with the already-installed `sanity` v4 CLI,
  so FR-6 adds no new dependency. If it does require one, that is an
  approval-gated change (AGENTS.md) and will be raised before install.
- **A3** — Studio hosting choice (Sanity-hosted vs. self-hosted) does not
  affect schema code and is deferred to T10.
- **A4** — The six gaps above are schema bugs, not page bugs. If a founder
  prefers the opposite resolution for any of them (e.g. dropping `aboutFacts`
  from the design), that becomes a Spec 001 change and is out of scope here.

## Open questions

| # | Question | Blocks | Default if unanswered |
| --- | --- | --- | --- |
| Q1 | Approve the G1–G6 resolutions, i.e. amend TECH-SPEC §11? | Resolved: approved by the instruction to resume Spec 002 | Add all recommended schema fields and the privacy singleton |
| Q2 | Is the `kind` vocabulary (G3) correct — are four values enough? | Resolved: approved by the instruction to resume Spec 002 | Use the four-value vocabulary |
| Q3 | Should `featuredAnnouncement` be honoured or dropped (G5)? | Resolved: approved by the instruction to resume Spec 002 | Honour it, with newest-published fallback |
| Q4 | Who are the 1–3 founder Studio accounts? | T02 founder gate, not this code | Deferred |

None of Q1–Q4 blocks writing schema code for the uncontested §11 fields.

## Approval status

Approved through the instruction to resume Spec 002. Q1–Q3 use the documented
defaults. Live dataset verification and account provisioning remain subject to
the T02 founder gate.
