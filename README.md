# NYNT Schedule 25

A Progressive Web App (PWA) for the NYNT 26 event schedule, built with [Astro](https://astro.build/).

## About

This project provides an accessible, offline-capable schedule viewer for the NYNT 26 event. The schedule data is fetched from a Google Apps Script endpoint at build time and rendered as a static site with PWA capabilities for offline access.

## Tech Stack

- **Framework**: [Astro 5.x](https://astro.build/) with TypeScript
- **Styling**: [Open Props](https://open-props.style/) for design tokens
- **PWA**: [@vite-pwa/astro](https://github.com/vite-pwa/astro) for Progressive Web App features
- **Typography**: Custom fonts via Fontsource (Bricolage Grotesque, BBH Sans Bartle, Fira Sans Extra Condensed)
- **Data Validation**: [ArkType](https://arktype.io/) for runtime type checking
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Netlify](https://netlify.com/)

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm (recommended package manager)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
# or
npm start
```

Starts the development server at `http://localhost:4321`

### Build

```bash
pnpm build
```

Runs type checking with `astro check` before building the static site.

### Testing

```bash
pnpm test
```

Runs unit tests with Vitest.

## Features

### Fluid Responsive Design

Built with [Utopia](https://utopia.fyi/) principles for fluid typography and spacing that adapts to any viewport without breakpoints.

### Accessibility

- Skip link navigation
- Semantic HTML structure
- Color contrast compliance via Open Props
- Keyboard navigation support

### Progressive Web App

- Offline functionality
- Installable on mobile and desktop
- Service worker for caching
- Automatic reload prompt for updates

### Data Architecture

Schedule data structure:
- Organized by day (e.g., "28", "29")
- Each day contains an array of time slots
- Time slots can have either:
  - Simple events (strings like "Lunch")
  - Parallel workshops (arrays of `Workshop` objects)

### Type Safety

- Full TypeScript coverage
- Runtime validation with ArkType schemas
- Compile-time type checking

### Code Organization

Path aliases for cleaner imports:
- `~/` → `src/`
- `@components/` → `src/components/`
- `@layouts/` → `src/layouts/`
- `@utils/` → `src/components/utils/`
- `@styles/` → `src/styles/`

## Security

Security headers configured in `netlify.toml`:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## License

See [LICENSE](LICENSE) file for details.
