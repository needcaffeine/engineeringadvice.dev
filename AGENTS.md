# AGENTS.md

This file provides practical guidance for coding agents working in this
repository.

## Project Snapshot

- Framework: Astro 6 + Preact + Tailwind CSS v4
- Deployment target: Cloudflare Workers (`@astrojs/cloudflare` adapter)
- Package manager: npm (`package-lock.json` is canonical)
- Runtime expectation: Node `>=22.12.0 <26`

## Commands

- Dev server: `npm run dev` (Astro dev server on `localhost:4321`)
- Build: `npm run build` (`astro check && astro build`)
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Preview: `npm run preview`

## Current Architecture

- Primary config: `starpod.config.ts`
- Astro config: `astro.config.mjs`
- RSS ingestion and episode shaping: `src/lib/rss.ts`
- About page host rendering: `src/pages/about.astro`

`starpod.config.ts` is the source of truth for show metadata (blurb,
description, hosts, platform URLs, RSS feed URL).

## Important Implementation Details

### Episode numbering is global and sequential

Episode numbers are assigned in `src/lib/rss.ts` by sorting all episodes by
publish date (oldest to newest) and assigning `1..N` across all seasons.

If numbering behavior changes, update this logic intentionally and verify:

- episode pages (`src/pages/[episode].astro`)
- episode list UI (`src/components/EpisodeList.astro`)
- markdown endpoints (`src/pages/[episode].html.md.ts`)

### Host profile images and links

- Host images are local files under `src/img/people/`
- `starpod.config.ts` should reference image filenames (for example
  `keyur-hindocha.jpg`)
- `src/pages/about.astro` resolves images via `import.meta.glob(...)` with
  fallback to `avatar-light.png`
- Host social links (X/GitHub/website) are read directly from
  `starpod.config.ts`

## Cloudflare + Vite Stability Notes

Recent dependency upgrades introduced two failure modes. The current config
contains mitigations and should not be reverted casually.

### 1) SSR import failure: `Could not import cloudflare:workers`

Context: this surfaced from `@astrojs/cloudflare` image SSR entrypoints.

Key settings in `astro.config.mjs`:

- `adapter: cloudflare({ imageService: 'passthrough', prerenderEnvironment: 'node' })`
- `vite.optimizeDeps.exclude` includes cloudflare server/preview entrypoints
- `vite.ssr.optimizeDeps.exclude` includes the same entrypoints

### 2) Dev server crashes with missing `node_modules/.vite/deps_ssr/chunk-*`

Key settings in `astro.config.mjs`:

- `vite.optimizeDeps.ignoreOutdatedRequests: true`
- `vite.ssr.optimizeDeps.noDiscovery: true`
- `vite.ssr.optimizeDeps.ignoreOutdatedRequests: true`
- watcher ignores build artifacts (`**/dist/**`, `**/.vercel/**`)

Also important:

- Do not reintroduce a `prebuild` cache wipe that deletes `node_modules/.vite`
  while `npm run dev` may be running.

## CI and Scheduled Rebuild

- `.github/workflows/ci.yml` runs lint + build on pushes/PRs to `main`
- `.github/workflows/rebuild.yml` triggers a daily webhook rebuild
  (uses `REBUILD_WEBHOOK` secret)

Keep both workflows unless there is an intentional platform/process change.

## Environment Variables

- `DISCORD_WEBHOOK`: used by `src/pages/api/contact.ts` for contact form
  delivery

No Playwright/test framework is configured in this repository.
