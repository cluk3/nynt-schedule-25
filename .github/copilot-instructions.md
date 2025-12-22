# GitHub Copilot Instructions for nynt-schedule-25

This is an Astro project for the NYNT 26 Schedule, built with TypeScript, Open Props, and PWA capabilities.

## Architecture & Core Concepts

- **Framework**: Astro 4.x with TypeScript.
- **Rendering**: Static Site Generation (SSG). The schedule is fetched at build time.
- **Data Source**: Schedule data is fetched from a Google Apps Script endpoint (hardcoded in `src/pages/index.astro`).
- **Data Model**:
  - The schedule is keyed by day (e.g., "28", "29").
  - Each day has a `times` array.
  - Items in `times` are tuples: `[timeRange, content]`.
  - `content` can be a `string` (simple event like "Lunch") or an `Array<Workshop>` (parallel workshops).
- **Styling**:
  - Uses [Open Props](https://open-props.style/) for CSS variables.
  - Global styles in `src/styles/`.
  - Scoped styles within `.astro` components.
  - Fluid design principles (Utopia) for responsiveness.
- **PWA**: Configured via `@vite-pwa/astro` in `astro.config.mjs`.

## Project Structure

- `src/pages/index.astro`: Main entry point. Fetches data and renders the schedule list.
- `src/lib.ts`: Shared utilities (date formatting) and types (`Workshop`).
- `src/components/`: UI components.
  - `Workshops.astro`: Renders the workshop cards for a specific slot.
  - `utils/`: Accessibility and navigation helpers (`SkipLink`, `Navigation`).
- `src/styles/`: Global CSS files (`global.css`, `reset.css`, `variables.css`).

## Conventions & Patterns

- **Imports**: Use path aliases defined in `tsconfig.json`:
  - `~/` -> `src/`
  - `@components/` -> `src/components/`
  - `@layouts/` -> `src/layouts/`
  - `@utils/` -> `src/components/utils/`
  - `@styles/` -> `src/styles/`
- **Type Safety**: Use TypeScript interfaces for data models (e.g., `Workshop` in `src/lib.ts`).
- **Data Validation**: Use [ArkType](https://arktype.io/docs) for runtime data validation.
  - Schemas are defined in `src/lib.ts`.
  - Use `type` from `arktype` to define schemas.
  - Use `.assert()` to validate data and throw errors on failure.
- **Testing**: Use [Vitest](https://vitest.dev/) for unit testing.
  - Run tests with `pnpm test`.
  - Tests are located in `src/*.test.ts`.
- **Accessibility**:
  - Always include `SkipLink` in layouts.
  - Use semantic HTML (`<main>`, `<section>`, `<h1>`-`<h6>`).
  - Ensure sufficient color contrast (checked via `open-props` usage).
- **Date Handling**: Use `getFormattedDates` from `src/lib.ts` for generating the date range.

## Development Workflow

- **Start Dev Server**: `pnpm dev` or `npm start`
- **Build**: `pnpm build` (runs `astro check` first)
- **Type Check**: `astro check`
- **Test**: `pnpm test` (runs `vitest`)
- **Linting**: Prettier with `prettier-plugin-astro`.

## Critical Integration Points

- **Google Script**: The fetch URL in `src/pages/index.astro` is the single source of truth for content.
  - _Note_: If the data structure from the endpoint changes, `src/pages/index.astro` and `src/lib.ts` types must be updated.
- **Netlify**: Deployed to Netlify. Configuration in `netlify.toml`.
