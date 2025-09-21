# TODO

- Fix auth flows to stop sanitizing passwords before hashing; the current `sanitizeString` call in `src/app/api/auth/login/route.ts` and `src/app/api/auth/register/route.ts` mangles credentials (it strips `<`/`>` and trims).
- Make the API responses match the UI expectations (or vice versa) so server/shop fields use one naming style; right now `server-prisma.ts` returns camelCase while pages like `src/app/infrastructure/page.tsx` still read snake_case.
- Persist each BTCPay store’s ID in the database (e.g., add `btcpayStoreId` on `Shop`) and switch `src/app/api/stores/[serverId]/route.ts` to match on that ID instead of names so "hasActiveSubscription" is accurate.
- Drop the legacy `src/lib/auth.ts` helpers and point everything at `auth-prisma.ts` to avoid two copies of the same logic (the mixed imports are already causing type mismatches in the client context).
