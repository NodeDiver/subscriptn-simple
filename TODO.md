# TODO

- Fix auth flows to stop sanitizing passwords before hashing; the current `sanitizeString` call in `src/app/api/auth/login/route.ts` and `src/app/api/auth/register/route.ts` mangles credentials (it strips `<`/`>` and trims).
- Make the API responses match the UI expectations (or vice versa) so server/shop fields use one naming style; right now `server-prisma.ts` returns camelCase while pages like `src/app/infrastructure/page.tsx` still read snake_case.
- Persist each BTCPay store’s ID in the database (e.g., add `btcpayStoreId` on `Shop`) and switch `src/app/api/stores/[serverId]/route.ts` to match on that ID instead of names so "hasActiveSubscription" is accurate.
- Drop the legacy `src/lib/auth.ts` helpers and point everything at `auth-prisma.ts` to avoid two copies of the same logic (the mixed imports are already causing type mismatches in the client context).
- Refresh the color system in `tailwind.config.js` to a more professional palette: e.g. `primary` deep navy `#14213D`, `accent` bitcoin orange `#F7931A`, support teal `#2A9D8F`, and neutral grays `#F4F6F8` / `#1F2933`; remove the current neon gradients so light/dark themes read calmer.
- Normalize button styling across `src/app/page.tsx`, `src/components/TopBar.tsx`, and the auth forms to use the new palette with flat fills, subdued shadows, and consistent sizing (no hover scale/gradient jumps).
- Rework marketing sections in `src/app/page.tsx` to rely on stronger typography, real product imagery, and whitespace instead of stacked cards with emoji bullets—aim for fewer accent colors per section.
- Update infrastructure and dashboard cards (`src/app/infrastructure/page.tsx`, `src/app/dashboard/page.tsx`) to adopt a single card component with quieter hover states, solid borders, and aligned iconography.
- Replace emoji tab icons in `src/app/settings/page.tsx` with a proper icon set (e.g. Heroicons) and tighten spacing so the settings header feels enterprise rather than playful.
- Audit secondary pages (`src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/nwc-management/page.tsx`) to remove the green/blue gradients, switch CTA buttons to the new primary color, and introduce heading/subheading pairs that match the updated home hero.
