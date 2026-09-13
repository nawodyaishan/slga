.PHONY: install dev dev-studio lint typecheck build clean

install:
	 pnpm install

dev:
	 pnpm dev

dev-studio:
	 pnpm dev:studio

lint:
	 pnpm lint

typecheck:
	 pnpm typecheck

build:
	 pnpm build

clean:
	 rm -rf apps/web/.next

