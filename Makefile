SANITY_PROJECT_ID ?= lcgep8ux
SANITY_DATASET ?= production
SANITY_ENV = SANITY_STUDIO_PROJECT_ID=$(SANITY_PROJECT_ID) SANITY_STUDIO_DATASET=$(SANITY_DATASET)

.PHONY: install dev dev-all dev-studio sanity-dev sanity-schema sanity-typegen sanity-check sanity-build sanity-export sanity-import-original sanity-deploy lint typecheck build clean

install:
	pnpm install

dev:
	pnpm dev

dev-all:
	$(SANITY_ENV) NEXT_PUBLIC_SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) NEXT_PUBLIC_SANITY_DATASET=$(SANITY_DATASET) NEXT_PUBLIC_SANITY_API_VERSION=2026-09-13 pnpm --parallel --stream --filter @slga/web --filter @slga/studio run dev

dev-studio:
	$(MAKE) sanity-dev

sanity-dev:
	$(SANITY_ENV) pnpm --filter @slga/studio dev

sanity-schema:
	$(SANITY_ENV) pnpm --filter @slga/studio schema:extract

sanity-typegen:
	$(SANITY_ENV) pnpm --filter @slga/studio typegen

sanity-check: sanity-typegen
	pnpm --filter @slga/studio lint
	pnpm --filter @slga/studio typecheck

sanity-build:
	$(SANITY_ENV) pnpm --filter @slga/studio build

sanity-export:
	@mkdir -p .backups
	$(SANITY_ENV) pnpm --filter @slga/studio exec sanity dataset export $(SANITY_DATASET) ../../.backups/sanity-$(SANITY_DATASET)-$$(date +%Y%m%d-%H%M%S).tar.gz

sanity-import-original:
	@test "$(CONFIRM)" = "yes" || (echo "Refusing to modify $(SANITY_PROJECT_ID)/$(SANITY_DATASET). Re-run with CONFIRM=yes"; exit 1)
	$(SANITY_ENV) pnpm --filter @slga/studio run content:import-original

sanity-deploy:
	@test "$(CONFIRM)" = "yes" || (echo "Refusing to deploy. Re-run with CONFIRM=yes"; exit 1)
	$(SANITY_ENV) pnpm --filter @slga/studio run deploy

lint:
	pnpm --filter @slga/web lint

typecheck:
	pnpm typecheck

build:
	NEXT_PUBLIC_SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) NEXT_PUBLIC_SANITY_DATASET=$(SANITY_DATASET) pnpm build

clean:
	rm -rf apps/web/.next
