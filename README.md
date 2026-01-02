# Gambia: A Visual Journey

A production-ready, interactive single-page application exploring the landscapes of The Gambia.

## Features

-   **Interactive Cards:** Expandable cards with FLIP-like animations.
-   **Map Integration:** Dynamic Leaflet maps with CartoDB Voyager tiles.
-   **Accessibility:** WCAG 2.1 AA compliant, reduced motion support, screen reader optimized.
-   **Performance:** Optimized font loading, minimal dependencies.
-   **Security:** strict CSP, SRI hashes, secure external links.

## Development

### Prerequisites

-   Node.js (v18+)
-   pnpm (v9+)

### Setup

```bash
pnpm install
```

### Running Tests

```bash
pnpm test
```

### Linting & Formatting

```bash
pnpm lint
pnpm format
```

## Production Readiness

This project adheres to strict production standards:

-   **Code Quality:** Enforced via ESLint and Prettier.
-   **Security:**
    -   Content Security Policy (CSP) prevents XSS.
    -   External resources verified with Subresource Integrity (SRI).
    -   `noopener noreferrer` on all external links.
-   **Testing:** Comprehensive End-to-End testing with Playwright, including accessibility (Axe) and visual regression checks.
-   **Performance:**
    -   SVGs for vector graphics.
    -   CSS variables for efficient styling.
    -   Native lazy loading attributes (ready for implementation on images).

## Deployment

Deploy this static site to any provider (Vercel, Netlify, GitHub Pages, etc.).

1.  Ensure all tests pass: `pnpm test`
2.  Deploy the root directory.
