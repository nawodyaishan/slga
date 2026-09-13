# Plan 002 — Sanity CMS foundation

**Spec:** `specs/002-sanity-cms-foundation/spec.md`
**Human architecture approval status:** Approved; Q1–Q3 use the recommendations in the spec
**Primary owner:** A2 (content/CMS), with A0 for workspace tooling

## Approach

Four layers, built bottom-up so each is verifiable before the next depends on
it:

1. **Shared schema primitives** — the localized-text object, the image object
   with required alt, and the two Portable Text block configurations. Building
   these first stops the four document types from each inventing their own
   rich-text allowlist, which is how renderer/schema drift starts.
2. **Document types** — `siteSettings`, `rule`, `announcement`,
   `facebookFeature` (+ `privacyNotice` if G1 is approved), each composed from
   layer 1 and carrying its own validation.
3. **Studio structure** — the navigation tree, singleton enforcement, orderings
   and previews. Structure is deliberately separate from schema so a schema
   change never risks breaking navigation and vice versa.
4. **Typed integration** — run `sanity typegen` against the finished schema,
   commit the generated types, and rewire `lib/sanity/queries.ts` to use them
   instead of hand-written `Raw*` interfaces.

Gap-closing (G1–G6) is threaded through layers 2–4 rather than done as a
separate pass, because each gap is a field on a document type and a line in
the mapper; splitting them would mean touching every file twice.

### Why this shape

**Schema types live in `apps/studio`, not a shared package.** TECH-SPEC §12
places them there, and the web app does not import schema definitions — it
imports *generated types*, which is a one-directional dependency through a
committed artifact. Introducing a shared package to hold schemas would create
a build-order coupling between two apps for no benefit at this size.

**The web app is the consumer, not the driver.** Spec 001's pages and
`ContentAdapter` are frozen for this work. The schema's job is to satisfy
`lib/content/types.ts`. Where §11 cannot do that, the spec proposes amending
§11 — never bending the page.

**Validation is authored as rules, not conventions.** Every constraint in the
spec's acceptance criteria maps to a `validation:` callback that a founder will
actually hit in the editor. A comment saying "always use https" is not a
control; `Rule.uri({ scheme: ['https'] })` is.

**Typegen replaces, not supplements, the `Raw*` interfaces.** Keeping both
would give two sources of truth for the same shape and guarantee they diverge.
The `Raw*` interfaces are deleted in the same task that introduces generated
types, so there is never a window where both exist.

## Affected modules

| Path | Owner | Change |
| --- | --- | --- |
| `apps/studio/schemaTypes/objects/*.ts` | A2 | New — localized text, image-with-alt, rules/announcement block content |
| `apps/studio/schemaTypes/siteSettings.ts` | A2 | New — singleton, §11.1 + G2/G4/G6 |
| `apps/studio/schemaTypes/rule.ts` | A2 | New — §11.2, bilingual required-together validation |
| `apps/studio/schemaTypes/announcement.ts` | A2 | New — §11.3 + G3 |
| `apps/studio/schemaTypes/facebookFeature.ts` | A2 | New — §11.4 |
| `apps/studio/schemaTypes/privacyNotice.ts` | A2 | New — G1, approval-gated |
| `apps/studio/schemaTypes/index.ts` | A2 | New — barrel export |
| `apps/studio/structure/index.ts` | A2 | New — `StructureResolver`, singleton items, orderings |
| `apps/studio/sanity.config.ts` | A2 | Wire `schema.types`, `structure`, `document.newDocumentOptions`, `document.actions` |
| `apps/studio/eslint.config.mjs` | A0 | New — uses existing `@sanity/eslint-config-studio` |
| `apps/studio/package.json` | A0 | Add `lint` / `typecheck` scripts (no dependency change) |
| `package.json` (root) | A0 | `lint`/`typecheck`/`build` stop filtering to `@slga/web` only |
| `apps/web/src/lib/sanity/queries.ts` | A2 | Delete `Raw*` interfaces, import generated types, close G1–G6 in the mappers |
| `apps/web/src/lib/sanity/*.generated.ts` | A2 | New — committed typegen output |
| `apps/web/src/lib/content/{types,seed}.ts`, `apps/web/src/app/page.tsx` | A1/A2 | G5 scope amendment: add a dedicated featured-announcement read without changing newest-first list ordering |
| `docs/SLGA-PHASE-1-TECH-SPEC.md` §11 | A0 + founder | Amendment recording the approved G1–G6 resolutions |

Explicitly untouched: page/component files other than `apps/web/src/app/page.tsx`,
`lib/content/index.ts`, `lib/sanity/client.ts`, and all unrelated routes.

## Dependency changes

**None planned.** `sanity` v4 and `@sanity/vision` v4 are already installed in
`apps/studio`; `@sanity/eslint-config-studio` is already a devDependency with
no config file consuming it.

`sanity typegen` is expected to be part of the installed `sanity` CLI. This is
verified as the first step of the typegen task, not assumed. **If it turns out
to need a new package, work stops and approval is requested** — AGENTS.md
requires explicit approval before dependency or lockfile changes, and a
convenience is not a reason to bypass that.

## Security impact

| Concern | Handling |
| --- | --- |
| Public dataset | No field in any schema invites private data. Field descriptions state that the dataset is world-readable where a founder might otherwise paste something sensitive. |
| Write tokens | None introduced. The Studio authenticates the human via `sanity login`; the web client stays token-free and read-only. |
| Committed credentials | Studio continues to read `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` from the environment. `.env.example` gains no real values. No `.env` file is created by this work. |
| Injection via content | Both Portable Text configurations are allowlists. No `html` block type, no arbitrary embed, no raw-markup escape hatch. External URLs are constrained to `https`. |
| Link targets | Link annotations validate scheme; the announcement renderer already applies `rel="noopener noreferrer"` for external links (Spec 001). |
| Studio deployment | Out of scope (T10). No `SANITY_AUTH_TOKEN` is introduced, referenced or stored here. |

## Failure modes

| Failure | Detection | Response |
| --- | --- | --- |
| Schema permits a Portable Text style the renderer does not register | Manual cross-check task against `components/portable-text/*`; visible as unstyled text | Narrow the schema — the renderer allowlist is the contract |
| Generated types disagree with the GROQ projections | `pnpm typecheck` fails in `apps/web` | Fix the query or the schema; never cast to satisfy the compiler |
| Singleton enforcement bypassed via direct URL | Structure test: attempt `/desk/__edit__…` create | Actions are removed at the `document.actions` level, not only hidden in structure, so URL access cannot create a second doc |
| Founder publishes a rule with `displayOrder` duplicated | Studio warning (non-blocking by design) + `_createdAt` tiebreak in GROQ | Warning is deliberate: blocking mid-reorder would trap the editor |
| Typegen not available in the installed CLI | First typegen task step | Stop, request dependency approval |
| Live dataset renders differently from seed | Route-by-route comparison task | Treat as a schema/mapper bug, not a page bug |

## Rollback

Every layer is additive and independently revertable:

- Layers 1–3 are new files plus one `sanity.config.ts` edit. Reverting that
  edit returns the Studio to `schema: { types: [] }` with no effect on the web
  app, which still runs on the seed adapter in development.
- Layer 4 is the only change to shipped web code. Reverting restores the
  hand-written `Raw*` interfaces; the GROQ strings themselves are unchanged.
- Tooling changes (root scripts, ESLint config) are reversible in isolation and
  affect no runtime output.

No data migration is involved — there is no existing dataset content to
migrate. Nothing in this plan deletes or rewrites documents.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Q1–Q3 stay unanswered, blocking G1–G6 | Medium | `/privacy` 500s and About tiles vanish on a live dataset | Uncontested §11 fields proceed in parallel; gap tasks are isolated so approval unblocks them without rework |
| No Sanity project provisioned (T02 founder gate) | High near-term | End-to-end validation testing cannot run | All schema/structure/typegen work is verifiable by typecheck and local Studio; only live-publish assertions defer |
| Schema/renderer drift returns later | Medium | Silent visual degradation | Portable Text configs are shared objects referenced by both documents, so there is one place to change |
| Root script change breaks CI expectations | Low | Failing pipeline | Verify `pnpm lint`/`typecheck` pass across both packages before the change lands |
| Bilingual validation is annoying enough to be worked around | Medium | Monolingual rules published | Required-together is enforced at the field level; the §11.2 design already treats Sinhala as mandatory, not optional |

## Verification strategy

1. `pnpm typecheck` and `pnpm lint` across both workspace packages.
2. `make dev-studio` starts with only `SANITY_STUDIO_*` env vars set.
3. Manual validation matrix — each acceptance criterion in the spec exercised
   in the running Studio against the real dataset (gated on the founder gate).
4. Field-by-field audit of `ContentAdapter` against the schema, confirming no
   consumed field is unbacked.
5. With a project id configured, `pnpm build` succeeds — the Spec 001 build
   failure resolving is itself the headline signal that this work is done.
