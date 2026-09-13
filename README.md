# Sri Lankan Gaming Alliance (SLGA) Official Website

The official website for the **Sri Lankan Gaming Alliance**, rebuilt as a modern Next.js application with a Sanity CMS backend.

This repository holds the monorepo containing both the public-facing website and the Sanity Studio content management system.

## 🏗️ Architecture

- **Frontend:** Next.js 16+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend/CMS:** Sanity Content Lake & Sanity-hosted Studio.
- **Hosting:** Vercel (`main` deploys to production automatically).
- **Package Manager:** pnpm.

Read the [Phase 1 Technical Specification](docs/SLGA-PHASE-1-TECH-SPEC.md) for full details on the architecture, technical decisions, content model, and project goals.

## 🚀 Getting Started

Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) and [pnpm](https://pnpm.io/) installed.

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables (copy the examples and add your keys)
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env.local

# 3. Start both the web app and Sanity studio locally
# (In one terminal window)
pnpm dev

# (In another terminal window)
pnpm dev:studio
```

- The web app will be available at [http://localhost:3000](http://localhost:3000)
- The Sanity Studio will be available at [http://localhost:3333](http://localhost:3333)

## 🛠️ Workspace Commands

Run these from the repository root:

| Command | Description |
|---|---|
| `pnpm install` | Install all workspace dependencies. |
| `pnpm dev` | Start the Next.js development server for the public web app. |
| `pnpm dev:studio` | Start the Sanity Studio development server. |
| `pnpm build` | Build the Next.js application for production. |
| `pnpm lint` | Run ESLint across all packages. |
| `pnpm typecheck` | Run TypeScript compiler checks across all packages. |

## 📁 Repository Structure

- `apps/web/` - The Next.js 16 App Router application (Public Website).
- `apps/studio/` - The Sanity Studio application (Content Management).
- `docs/` - Project documentation and specifications.
- `design/` - Design references and exported resources.
- `assets/` - Legacy site assets preserved for migration purposes.

## 🤝 Contributing

1. Create a feature branch off `main`.
2. Ensure your changes pass `pnpm lint` and `pnpm typecheck`.
3. Submit a pull request. Vercel will automatically generate a preview deployment.
4. Note: Husky hooks will run linting and typechecking automatically before `git push`.

---
*Built for the community. Community-run. Not an official governing body.*
