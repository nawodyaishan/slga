# Contributing to SLGA

Small, focused contributions are welcome: bug fixes, accessibility improvements, tests, documentation, and approved features. Follow the [README setup](README.md#quick-start), [technical specification](docs/SLGA-PHASE-1-TECH-SPEC.md), and [agent rules](AGENTS.md).

## A simple contribution flow

1. Open an issue or discuss the change with a maintainer. Describe the problem and expected outcome; include reproduction steps for bugs.
2. Create a branch from `main`. Keep the change focused and preserve unrelated work.
3. For non-trivial work, follow the SDD steps below **before coding**. A typo or small documentation correction does not need a new feature spec.
4. Implement the approved scope and add or update relevant tests.
5. Open a pull request with a summary, linked issue/spec/task, verification results, and screenshots for visual changes. Call out known gaps and any checks you could not run.

## Agentic SDD workflow

Spec-driven development keeps requirements, implementation, and verification aligned. Use the relevant existing feature under `specs/`; create a focused `specs/<feature>/` directory only when new work needs one.

| Step | Contributor action | Agentic SDD skill, when available |
| --- | --- | --- |
| Route | Identify the feature and current phase | `agentic-sdd-router` |
| Specify | Write/update `spec.md`: problem, scope, acceptance criteria, and open questions | `agentic-sdd-spec` |
| Plan | Write/update `plan.md`: approach, affected files, risks, and verification | `agentic-sdd-plan` |
| Approve | Resolve questions and get maintainer approval before implementation | `agentic-sdd-architecture-review` |
| Task | Define bounded work in `tasks.md`, including allowed files and checks | `agentic-sdd-tasks` |
| Implement | Complete only the approved task; seek approval if scope changes | `agentic-sdd-implement` |
| Verify | Review the diff against acceptance criteria and record actual check results | `agentic-sdd-verification-review` |

For AI-assisted work, load the globally installed router skill first and follow its selected phase. Skills are not bundled in this repository: ask the maintainer for the approved skill setup if they are missing, and do not claim to have run them. Human contributors can follow the same steps manually. Approval comes from a maintainer, not from an agent marking its own plan approved.

Do **not** run `agentic-sdd-bootstrap` here. Do not add constitutions, templates, review-checklist collections, retrospectives, or other SDD scaffolding unless explicitly requested. Keep artifacts proportional to the change and update them when the implementation differs from the approved plan.

## Verify your change

For web changes:

```sh
make lint
make typecheck
make build
pnpm test:e2e
```

`make verify` runs these together. See the README for browser installation and Sanity build configuration. For Studio changes, also run `make sanity-check` and review any generated schema/type changes. For documentation-only changes, check commands, links, and `git diff --check`; an application build is not normally necessary.

Use Playwright MCP for interactive browser inspection when available, alongside reproducible Playwright tests. For UI changes, check narrow screens, keyboard navigation, focus, and affected Sinhala content. Report console errors rather than relying solely on a passing test summary. Automated accessibility checks do not replace manual checks.

The pre-push hook runs web lint and workspace typechecks; it does not run the production build or browser suite. Record skipped or failing checks honestly—never disable a check just to make a PR pass.

## Safety and scope

- Get explicit approval before dependency/lockfile changes, secret handling, infrastructure, deployment, or destructive operations.
- Never commit tokens, local environment files, private member data, or moderation records. Keep `NEXT_PUBLIC_*` values safe for public exposure.
- Use fixtures or an approved development dataset for tests. Studio access is not permission to publish, import, or delete production content.
- Preserve published announcement slugs. Coordinate a permanent redirect before an approved slug change.
- Keep media attribution and usage rights intact; provide meaningful alt text for content images.
- Do not rewrite unrelated code, remove legacy history, or deploy as part of an ordinary PR. Release approval is separate from code review.
- When `.codegraph/` exists, agents should use CodeGraph before text search to understand code. Do not create an index without the user’s decision.

By submitting a contribution, you agree to make your original code and documentation available under the repository’s [MIT License](LICENSE). Identify any third-party material and its license in your PR.
