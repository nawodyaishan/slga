# Sri Lankan Gaming Alliance

The SLGA website is being rebuilt as a Next.js App Router application with a separately hosted Sanity Studio.

## Workspace commands

```bash
pnpm install
pnpm dev
pnpm dev:studio
pnpm lint
pnpm typecheck
pnpm build
```

The public app lives in `apps/web`; the CMS foundation lives in `apps/studio`. See [`TECH-SPEC.md`](TECH-SPEC.md) for the approved Phase 1 architecture. Existing files in `assets/` are preserved as migration/reference assets and are not yet part of the new app bundle.
