# Agent workflow

Use the globally installed Agentic SDD skills for non-trivial work in this repository.

Minimal workflow:

1. `agentic-sdd-router` selects the phase.
2. For a new change, write or update one focused spec/plan before implementation.
3. Implement only the approved, bounded task.
4. Run `make lint`, `make typecheck`, and `make build` for web changes.
5. Use `agentic-sdd-verification-review` before merge when the change is substantial.

Repository-specific constraints:

- Do not run `agentic-sdd-bootstrap` for this repository.
- Do not create a constitution, templates, review-checklists, retrospectives, or other SDD scaffolding unless explicitly requested.
- Keep SDD artifacts focused and place feature-specific documents under `specs/<feature>/` only when the work requires them.
- Treat `docs/SLGA-PHASE-1-TECH-SPEC.md` as the product and architecture source of truth.
- Get explicit approval before dependency, lockfile, secret, infrastructure, deployment, or destructive changes.

