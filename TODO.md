# TODO

- Align the API response shape with the front-end expectations (or vice versa) so `servers` and `shops` data use consistent camelCase fields; the current Prisma responses (`src/app/api/servers/route.ts`, `src/app/api/shops/route.ts`) expose `hostUrl`/`isOwner`/`serverName`, but the dashboards still read `host_url`/`is_owner`/`server_name` and end up rendering empty stats.
- Fix the BTCPay store fetcher (`src/app/api/stores/[serverId]/route.ts`) to use each server's stored API key instead of the global `BTCPAY_API_KEY`, and stop casting store IDs with `parseInt`—BTCPay store IDs are strings so the active-subscription check never matches.
- Introduce a lightweight mapping between BTCPay stores and local `Shop`/`Subscription` records so the "hasActiveSubscription" flag is accurate without relying on numeric IDs; this prevents false negatives when showing server details in `src/app/infrastructure/[serverId]/page.tsx`.
