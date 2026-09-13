# Sri Lankan Gaming Alliance

The community-run home for Sri Lankan gamers. This repository contains the SLGA public website and the Sanity Studio used by its editors.

[Contribute](CONTRIBUTING.md) · [Technical specification](docs/SLGA-PHASE-1-TECH-SPEC.md) · [Editor guide](docs/FOUNDER-OPERATIONS-GUIDE.md) · [MIT license](LICENSE)

## What’s inside

- A homepage with community links, the latest announcement, and curated Facebook features.
- Community rules in English and Sinhala.
- Announcements with permanent URLs and social-sharing previews.
- A member artwork showcase and privacy notice.
- CMS-managed content, search metadata, structured data, and a generated sitemap.

The site is English-first; Sinhala localization currently covers the rules. Public accounts, forums, and live Facebook/Discord integrations are outside Phase 1.

## Stack and deployment

Next.js App Router, React, TypeScript, Tailwind CSS, and selected shadcn/ui components power the website. Sanity Content Lake supplies published content through a typed adapter; Studio is a separate workspace. Playwright and axe cover browser flows and automated accessibility checks.

Vercel is the planned Next.js hosting platform. Do not assume production deployment or PR previews are configured merely because this repository exists. See the [release review](specs/004-phase-1-release-completion/review.md) for outstanding verification and approval gates. The repository name does not make the Next.js app a GitHub Pages static export.

## Quick start

Use Node.js **22.12 or later**, **pnpm 10.33.0** (pinned in `package.json`), and Make for the convenience commands below.

```sh
git clone https://github.com/slgaofficial/slgaofficial.github.io.git
cd slgaofficial.github.io
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000). On a fresh checkout without Sanity environment variables, development uses bundled mock content—no CMS account or token required. Mock content is never a production fallback.

### Work with Sanity content

Copy the examples only if the destination files do not already exist:

```sh
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env.local
```

Review the values before starting. The examples point to SLGA’s public production dataset; reading it does not grant editing permission. Use your own approved project/dataset for content experiments. Never publish test content to production.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Web | Public Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Web | Dataset to read |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Web | Pinned Sanity API date |
| `NEXT_PUBLIC_SITE_URL` | Web | Absolute origin for metadata; use `http://localhost:3000` locally |
| `SANITY_STUDIO_PROJECT_ID` | Studio | Project managed by Studio |
| `SANITY_STUDIO_DATASET` | Studio | Dataset managed by Studio |

Run `pnpm dev` and `pnpm dev:studio` in separate terminals. Studio opens at [localhost:3333](http://localhost:3333); editing requires an authorized Sanity account. Never put secrets in `NEXT_PUBLIC_*` variables or commit local environment files.

## Everyday commands

Run from the repository root:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the web development server |
| `pnpm dev:studio` | Start Studio using its local environment |
| `make dev-all` | Start both apps using Make’s Sanity project/dataset values |
| `make lint` | Lint the web app |
| `make typecheck` | Typecheck both workspaces |
| `make build` | Build the web app using published Sanity content |
| `pnpm test:e2e` | Run Chromium, Firefox, and WebKit tests with development fixtures |
| `make verify` | Run lint, typecheck, build, and browser tests |
| `make sanity-check` | Regenerate schema/types, then lint and typecheck Studio |

`make dev-all`, `make build`, and the Sanity Make targets default to the SLGA project and `production` dataset. Override them for a different approved project:

```sh
make dev-all SANITY_PROJECT_ID=your_project_id SANITY_DATASET=development
```

Install browser binaries before the first test run:

```sh
pnpm --filter @slga/web exec playwright install chromium firefox webkit
pnpm test:e2e
```

The test server uses port **3100**. Stop any unrelated server on that port before testing. Production builds need network access to public Sanity content; passing fixture tests alone is not a production release sign-off.

## Repository map

```text
apps/web/       Public Next.js app, content adapters, and SEO helpers
apps/studio/    Sanity schemas, Studio configuration, and content tooling
tests/e2e/      Browser, metadata, and accessibility regression tests
specs/         Focused feature specifications, approved plans, and tasks
docs/          Product architecture, release tasks, and editor operations
design/        Design references
assets/        Preserved legacy-site assets
AGENTS.md      Repository rules for coding agents
```

Make changes to the current website in `apps/web/`; legacy files are retained for reference, not as the application entry point.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Non-trivial changes follow **Agentic SDD**: agree on the requirement, write a focused spec and plan, obtain approval, implement a bounded task, and verify the result. Human contributors and coding agents follow the same review gates; AI tooling is not required to contribute.

For editorial changes, use the [founder operations guide](docs/FOUNDER-OPERATIONS-GUIDE.md). Deployment, production content mutations, and dependency changes require explicit maintainer approval.

## License

Project code and documentation are available under the [MIT License](LICENSE). Third-party dependencies and retained third-party assets remain subject to their own licenses. Community artwork, game imagery, and brand marks are not automatically relicensed by this repository’s license; obtain the relevant permission before reusing them.
