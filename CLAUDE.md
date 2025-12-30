# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NYNT Schedule 25 is a Progressive Web App for the NYNT 26 event schedule. Built with Astro 5.x, it fetches schedule data from a Google Apps Script endpoint at build time and renders a static site with offline PWA capabilities.

## Essential Commands

### Development
```bash
pnpm dev          # Start dev server at http://localhost:4321
pnpm start        # Alias for dev
```

### Building & Testing
```bash
pnpm build        # Runs astro check, then builds static site
astro check       # Type-check the project
pnpm test         # Run Vitest unit tests
```

### Package Management
- **Required**: Node.js >= 22
- **Package Manager**: pnpm@10.19.0+ (specified in package.json)

## Architecture & Data Flow

### Static Site Generation (SSG)
The site is completely static. All schedule data is fetched at **build time** in `src/pages/index.astro:11-18`.

### Data Source
Schedule data comes from a Google Apps Script endpoint configured via the `GSCRIPT_IMPL_ID` environment variable (server-side secret).

### Data Model
The schedule uses ArkType schemas defined in `src/lib.ts`:

- **ScheduleResponse**: Top-level response containing a `data` object
- **DaySchedule**: Each day ("27", "28", ..., "04") has a `times` array
- **TimeSlot**: A tuple `[timeRange: string, content: string | Workshop[]]`
  - Simple events: `["09:00-10:00", "Lunch"]`
  - Parallel workshops: `["10:00-12:00", [Workshop, Workshop, Workshop]]`
- **Workshop**: Object with `name`, `teachers`, `prereqs`, `level` (all strings)

**Critical**: If the Google Apps Script endpoint changes its data structure, update both the ArkType schemas in `src/lib.ts` and the rendering logic in `src/pages/index.astro`.

## Code Organization

### Path Aliases (tsconfig.json)
```typescript
~/             → src/
@components/   → src/components/
@images/       → src/images/
@layouts/      → src/layouts/
@styles/       → src/styles/
@utils/        → src/components/utils/
```

### Key Files
- **src/pages/index.astro**: Entry point, fetches data, renders schedule
- **src/lib.ts**: ArkType schemas, TypeScript types, date utilities
- **src/components/Workshops.astro**: Renders workshop cards with CSS Grid subgrid
- **src/components/utils/**: Accessibility helpers (SkipLink, Navigation)
- **src/styles/**: Global CSS with Open Props design tokens
- **astro.config.mjs**: Astro + PWA configuration
- **netlify.toml**: Deployment config with security headers

### Workshop Layout
The Workshops component uses CSS Grid with **subgrid** for alignment. There's a fallback for browsers without subgrid support at `src/components/Workshops.astro:156-164`.

## Type Safety & Validation

### Runtime Validation with ArkType
```typescript
import { type } from "arktype";

// Define schema
const Workshop = type({
  name: nonEmptyTrimmedString,
  teachers: nonEmptyTrimmedString,
  // ...
});

// Use .assert() to validate and throw on failure
const { data } = ScheduleResponse.assert(resData);
```

### TypeScript
- Extends `astro/tsconfigs/strict`
- Full type coverage expected
- Types are inferred from ArkType schemas using `.infer`

## Styling

### Open Props
Design tokens from [Open Props](https://open-props.style/) provide CSS variables for colors, spacing, etc.

### Fluid Design (Utopia)
The project uses fluid typography and spacing principles without traditional breakpoints.

### CSS Transformer
Uses **LightningCSS** (configured in `astro.config.mjs:11-15`) instead of PostCSS.

### Workshop Level Colors
Workshop cards are color-coded by level in `src/components/Workshops.astro:166-221`:
- Open Level → Green
- Intermediate+ → Blue
- Intermediate-Advanced → Pink
- Advanced → Purple
- Pro → Red/Pro color
- Standing → Yellow

## PWA Configuration

### Service Worker
- Auto-updates via `registerType: "autoUpdate"` in `astro.config.mjs`
- Caches all `.{css,js,html,svg,png,ico,txt,woff2}` files
- Navigate fallback to `/` with 404 page at `/404`

### Manifest
- Configured in `astro.config.mjs:23-201`
- Name: "NYNT 26 Schedule"
- Theme color: `#ab0f29`
- Icons for iOS and Android at multiple sizes

## Client-Side Behavior

### Auto-scroll on Load (src/pages/index.astro:179-251)
On page load, the site scrolls to:
1. Day specified in `?day=XX` query parameter, OR
2. Today's date if within event range (Dec 27 - Jan 4)

### Active Navigation Tracking
Uses `IntersectionObserver` to track which day section is most visible and highlights the corresponding navigation item with `.active` class.

## Environment Variables

- **GSCRIPT_IMPL_ID**: Server-side secret for Google Apps Script endpoint (required for build)

## Security Headers (netlify.toml)

Configured with CSP, X-Frame-Options, HSTS, and other security headers. Note: CSP allows `'unsafe-inline'` for scripts and Umami analytics (`https://cloud.umami.is`).

## Testing

Tests use Vitest. Test files are located in `src/*.test.ts` (currently `src/lib.test.ts`).

## Deployment

Deployed to Netlify. The build command runs `astro check` before building to catch type errors.


use context7