# Amroha Pharmacy UI modernization

## Scope

This upgrade modernizes the presentation layer while preserving the existing application contracts.

- Next.js App Router / React frontend retained.
- Prisma/PostgreSQL schema retained.
- Existing `/api/*` and `/api/admin/*` routes retained.
- Existing authentication/session contexts retained.
- Existing cart and wishlist state retained.
- Existing product/order request and response shapes retained.
- Existing environment variable names retained.

## Main UI changes

- Reworked global header with responsive navigation, search, account menu, and accessible focus states.
- Added a compact mobile navigation bar and mobile-first search experience.
- Reworked product cards with clearer hierarchy, discount treatment, stock states, and cart feedback.
- Reworked footer into a structured, responsive information architecture.
- Introduced a consistent visual system for surfaces, borders, typography, form focus, buttons, shadows, and spacing.
- Added reduced-motion handling and more deliberate responsive behavior.
- Refreshed metadata/Open Graph defaults without changing application behavior.

## Data/API integrity

No API route, Prisma model, authentication endpoint, business workflow, or database script was intentionally changed as part of the UI redesign.
