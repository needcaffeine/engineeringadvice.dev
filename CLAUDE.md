# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## What is Starpod?

Starpod is an open-source Astro-based podcast website generator. It creates a
full podcast site from an RSS feed and a `starpod.config.ts` configuration file.
The reference deployment is [whiskey.fm](https://whiskey.fm) (Whiskey Web and
Whatnot podcast).

## Commands

- **Dev server:** `npm run dev` (runs on localhost:4321)
- **Build:** `npm run build` (runs `astro check` then `astro build`)
- **Lint:** `npm run lint` (ESLint with caching)
- **Lint fix:** `npm run lint:fix`

## Architecture

### Framework Stack

- **Astro 5** with static output, deployed to Vercel
- **Preact** for interactive components (player, search, contact form)
- **Tailwind CSS v4** via Vite plugin
- **Drizzle ORM** with Turso/libSQL for episode guests and sponsors
- **Valibot** for config validation

### Key Configuration

- `starpod.config.ts` — podcast metadata (hosts, platforms, RSS feed URL,
  description). Uses `defineStarpodConfig()` from `src/utils/config.ts` for type
  safety and validation.
- `astro.config.mjs` — Astro config with Vercel adapter, Preact, and sitemap
  integrations.
- `drizzle.config.ts` — Drizzle Kit config for schema push, migrations, and
  studio.

### Data Flow

Episodes are fetched from the RSS feed at build time via `src/lib/rss.ts`.
Guest/sponsor data lives in `db/data/` as TypeScript files and is seeded to
Turso via `db/seed.ts`. The DB schema is in `db/schema.ts` (Drizzle ORM) with
tables: Episode, Person, HostOrGuest, Sponsor, SponsorForEpisode. The DB
connection is configured in `db/index.ts`.

### Source Structure

- `src/pages/` — Astro pages and API routes. Dynamic episode pages use
  `[episode].astro`. LLM-friendly `.html.md.ts` endpoints generate markdown
  versions.
- `src/components/` — Mix of `.astro` (static) and `.tsx` (Preact interactive)
  components. The audio player (`src/components/player/`) and search dialog are
  Preact.
- `src/components/state.ts` — Preact signals for shared player state.
- `src/lib/` — Core utilities: RSS fetching, image optimization, LLM content
  generation.
- `src/content/transcripts/` — Markdown transcript files named by episode
  number.
- `src/layouts/Layout.astro` — Single shared layout.
- `db/` — Database schema (`schema.ts`), connection (`index.ts`), seed script
  (`seed.ts`), and static data files (`data/`).

### Testing

No automated test suite is configured in this repository.

### TypeScript

Strict mode with `baseUrl: "."` allowing bare `src/...` imports. JSX is
configured for Preact (`jsxImportSource: "preact"`).

## Environment Variables

- `DISCORD_WEBHOOK` — Used by the contact form API route
  (`src/pages/api/contact.ts`) to post to Discord.
- `ASTRO_DB_REMOTE_URL` — Turso/libSQL database URL (e.g.,
  `libsql://your-db.turso.io`).
- `ASTRO_DB_APP_TOKEN` — Authentication token for Turso database.
