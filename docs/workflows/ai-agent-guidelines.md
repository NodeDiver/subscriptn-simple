# AGENTS Guidelines for This Repository

This repository contains a Next.js 15 Bitcoin subscription platform. Follow these guidelines when working with AI agents.

## 1. Use the Development Server

* **Always use `npm run dev`** while iterating on the application
* **Do not run `npm run build`** during agent sessions - this can break HMR

## 2. Keep Dependencies in Sync

If you add or update dependencies:
1. Update `package-lock.json`
2. Restart the development server

## 3. Coding Conventions

* Use TypeScript (`.tsx`/`.ts`) for new components
* Follow existing patterns in `src/components/` and `src/app/`
* Use Tailwind CSS classes from the custom color palette
* Never modify `prisma/migrations/` files directly

## 4. Database Operations

* Use Prisma Client for all database operations
* Run `npx prisma generate` after schema changes
* Use `npx prisma db push` for development

## 5. Lightning Network Integration

* Use existing `@getalby/bitcoin-connect` components
* Follow WebLN standards for wallet communication
* Test with real Lightning wallets when possible

## 6. Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server with HMR |
| `npm run lint` | Run ESLint checks |
| `npx tsc --noEmit` | Type check |
| `npx prisma studio` | View database |

## 7. Safety Boundaries

* Do not touch `.env*` files
* Do not modify migration files
* Do not commit sensitive data
* Follow existing auth patterns

---

Keep it simple. When in doubt, restart the dev server.
