# Plan 003 — Phase 1 content and release readiness

**Spec:** `specs/003-phase-1-content-and-release-readiness/spec.md`  
**Status:** approved by direct user instruction

## Summary and inputs reviewed

Build an authenticated Sanity CLI migration around the existing seed adapter,
then expose guarded Make targets for import and combined local development.
Inputs: Specs 001/002, `docs/SLGA-PHASE-1-TECH-SPEC.md`, `docs/TASKS.md`
T07–T10, the seed adapter, Studio schemas, legacy asset inventory, and the
Claude Design source.

## Architecture approach

- `apps/studio/scripts/import-original-content.ts` reads the existing seed
  adapter, uploads `assets/img/*`, translates domain objects to schema-shaped
  documents, and uses `createOrReplace` with stable IDs.
- The script requires `--confirm-production`; a dry run performs inventory and
  transformation without writes.
- `sanity exec --with-user-token` supplies the authenticated CLI client. No API
  token or new dependency is introduced.
- The import owns only `siteSettings`, `privacyNotice`, and `rule-1`…`rule-10`.
- A Make target exports the dataset before invoking the confirmed import.
- `dev-all` runs both workspace dev scripts with the Sanity and Next public
  variables set from shared Make defaults.

This follows Sanity's current documented pattern for authenticated CLI scripts
and Node stream asset uploads.

## Affected modules and contracts

- `apps/studio/scripts/`: new migration script.
- `apps/studio/package.json`: scripts only, no dependency changes.
- `Makefile`: guarded import/export and combined local runtime targets.
- Sanity dataset: creates/replaces two singleton documents and ten rule docs;
  uploads the retained image inventory.
- `specs/003-*`: remaining Phase 1 execution contract.

No web domain type, query, route, schema, dependency, or lockfile changes.

## Security and authorization

Dataset writes use the already-authenticated developer identity and require an
explicit confirmation flag. The CLI token stays outside the repository. The
script checks project/dataset before mutation and never deletes documents.

## Testing strategy

1. Run migration dry-run and verify inventory/document counts.
2. Export the dataset, run confirmed import, and query IDs/counts back.
3. Run `make lint`, `make typecheck`, and `make build` with Sanity env.
4. Start `make dev-all`; probe web and Studio HTTP endpoints and key routes.
5. Compare rule count/order and both language bodies against the seed source.

## Failure modes, rollback, and recovery

- Upload or transform failure occurs before the document transaction.
- Transaction failure leaves prior documents intact.
- Stable IDs make a corrected rerun replace only migration-owned documents.
- The pre-import dataset export is the recovery artifact for unexpected live
  data changes; no automatic destructive rollback is attempted.

## Risks and mitigations

- Migrated copy mistaken for approved: scope and task gates retain founder
  review; mock announcements/features are excluded.
- Existing migration-owned docs overwritten: IDs and overwrite behavior are
  explicit, with a pre-write export.
- Asset rights unknown: upload preserves material for review; public launch is
  blocked until rights are confirmed.
- `styled-components` compatibility warning: tracked as dependency work and not
  changed without approval.

## Dependency and observability impact

No dependency or lockfile changes. Migration logs project, dataset, asset
inventory, and affected IDs without logging credentials.

## Human architecture approval

Approved by the user's instruction. Public deployment and dependency updates
remain separate approval gates.
