# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This is Next.js 16 — not the Next.js you know

This project pins `next@16.2.2` and `react@19.2.4`, which have breaking changes vs. older Next.js conventions (APIs, file structure, middleware). **Read the relevant guide in `node_modules/next/dist/docs/` before writing App Router code, especially anything touching routing, middleware/proxy, or data fetching.** Heed deprecation notices you find there over prior training knowledge.

The clearest example already in this codebase: middleware lives in [src/proxy.ts](src/proxy.ts) (exporting a `proxy` function + `config.matcher`), not the traditional `middleware.ts` + `middleware` export.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config in eslint.config.mjs)

npm run db:generate  # diff src/db/schema/index.ts against migration history, write a new migration
npm run db:migrate   # apply pending migrations to DATABASE_URL (tracked in drizzle.__drizzle_migrations)
npm run db:studio    # browse the live DB with Drizzle Studio
```

There is no test runner configured (no `test` script, no test framework in package.json). One-off diagnostic scripts live in `scripts/` (e.g. `node scripts/check-user.mjs`) and are excluded from the TS build (`tsconfig.json` excludes `scripts` and `scratch`). `scratch/` holds throwaway/manual scripts, not part of the app.

## Architecture

**Stack**: Next.js App Router (`src/app`), Supabase (Postgres + storage), custom JWT auth (jose) — not Supabase Auth, Paystack for payments, Brevo/Resend/nodemailer for transactional email.

### Auth is fully custom, built on top of Supabase's database only

- Supabase Auth itself is **not** used for login — [src/lib/auth.ts](src/lib/auth.ts) signs/verifies its own HS256 JWTs via `jose`, stored as httpOnly cookies (`access_token`, 15 min; `refresh_token`, 30 days) and also accepted via `Authorization: Bearer` header.
- Route protection happens in [src/proxy.ts](src/proxy.ts): it verifies the JWT and redirects for `/profile`, `/admin` (also requires `role === "admin"`), `/book`, `/checkout`, and reverse-redirects away from `/auth` if already logged in. `/checkout/success` is intentionally excluded as a public post-payment landing page.
- Client-side session state is mirrored in [src/context/AuthContext.tsx](src/context/AuthContext.tsx) (`AuthProvider`/`useAuth`), which calls `POST /api/auth/refresh` on mount and every 10 minutes to keep the UI in sync with the (shorter-lived) access token cookie — the interval exists specifically because nothing else re-checks token expiry client-side.
- The JWT secret falls back through `SUPABASE_JWT_SECRET` → `JWT_SECRET` → a hardcoded dev default; production must set one of the env vars.
- Suspended users (`is_suspended` claim) are rejected at both token-verify time and proxy time.
- `auth_accounts` (private: credentials, verification) and `profiles` (public-facing extension, same `id`) both store `full_name`/`email`/`role`/`is_suspended`. These are kept in sync **by a DB trigger in both directions**, not application code — see `src/db/migrations/0002_sync_profiles_auth_accounts_fields.sql`. Write to either table's copy and the other updates automatically; don't reintroduce a manual dual-write in app code, and don't add more duplicated columns without extending the trigger to cover them.

### Supabase client layering ([src/lib/supabase.ts](src/lib/supabase.ts))

Three distinct clients, don't mix them up:
- `supabase` — singleton anon client, safe for client components, public/RLS-governed data.
- `getSupabase(token)` — per-JWT authenticated client (caches one instance per token) used to make requests *as* the logged-in user against RLS policies keyed on the custom JWT (policies defined in `src/db/schema/index.ts`, e.g. `auth_accounts_id()`/`get_account_id()`).
- `supabaseAdmin` — service-role client that bypasses RLS. Guarded by `typeof window === 'undefined'`; **never import it in client components**, only in `route.ts` handlers/server code.

### Database schema is Drizzle-managed schema-as-code (queries still go through supabase-js)

[src/db/schema/index.ts](src/db/schema/index.ts) is the **single source of truth** for the live Postgres schema — tables, enums, indexes, checks, foreign keys, and RLS policies (`pgPolicy`), organized by domain with section headers. It was introspected from the live DB with `drizzle-kit pull` and hand-cleaned into this one file; `npx drizzle-kit generate` against it currently produces "No schema changes" — keep it that way as the baseline drifts.

- **To change the schema**: edit `src/db/schema/index.ts`, run `npm run db:generate` (writes a new timestamped file to `src/db/migrations/`), review the generated SQL, then `npm run db:migrate` to apply it. Applied migrations are tracked in a `drizzle.__drizzle_migrations` table (by content hash) — re-running `db:migrate` is safe and idempotent, unlike hand-pasting SQL into the Supabase SQL editor (which is what caused duplicate-`CREATE POLICY` errors before this was set up).
- `src/db/migrations/0000_*.sql` is the introspected baseline — its SQL is wrapped in a comment block (drizzle-kit's convention for "this already exists, don't re-run it") and was marked applied by manually seeding `drizzle.__drizzle_migrations` with its hash, without executing it.
- **The old root-level `supabase_schema.sql` / `supabase_migration_*.sql` / `migrations/*.sql` / `custom_auth.sql` / `rls_integration.sql` files are now historical only** (each is annotated as such) — they document how the schema evolved by hand before Drizzle existed, but are no longer applied or authoritative.
- The app itself still queries through `@supabase/supabase-js` (`src/lib/supabase.ts`) — Drizzle here is schema/migrations tooling only, not a query layer. There's no `src/db/client.ts`; don't add app queries against `src/db/schema` unless that scope intentionally expands.
- `drizzle.config.ts` reads `DATABASE_URL` from `.env.local` (a direct Postgres connection string — separate from the `SUPABASE_*` REST API keys used elsewhere) via `dbCredentials.url`, needed for `db:generate`/`db:migrate`/`db:studio` to reach the DB directly.

### Domain model: two independent product lines

- **Calls** — bookable "surprise call" experiences. Catalog/pricing lives in [src/lib/pricing_config.ts](src/lib/pricing_config.ts) (`CALL_SERVICES`, each with `tiers` of `CallVariant`). Booking flow: [src/app/book/page.tsx](src/app/book/page.tsx) → `POST /api/bookings/create`. Admin manages call assignment/status under `src/app/admin/calls/` and `src/app/admin/special-calls/`.
- **Digital letters** — a separate creation/publish/share flow under `src/app/digital-letters/*` and `src/app/api/letters/*` ([src/lib/letters.ts](src/lib/letters.ts) defines `LetterTheme`/`LetterTier`/`LetterStatus`). Letters can be finalized into a subscription (`/api/letters/[id]/finalize-subscription`) and shared via a public code (`/api/letters/by-code/[code]`).
- **Subscriptions** — recurring plans in [src/lib/plans.ts](src/lib/plans.ts) (`SUBSCRIPTION_PLANS`: lite/plus/orbit/corporate, monthly vs. annual pricing, per-plan call quotas). `corporate` is a custom/contact-us tier (`isCustom: true`, no fixed quota).

### Payments

[src/lib/paystack.ts](src/lib/paystack.ts) switches between live/test keys via `NEXT_PUBLIC_PAYSTACK_MODE`. Amounts are in Naira in app code and converted to kobo (`* 100`) only at the `getPaystackConfig` boundary. Verification happens server-side via `POST /api/payments/verify`.

### Roles: three, each with its own walled-off section

`user_role` (`src/db/schema/index.ts`) is `user | admin | caller`, and each gets a completely separate route tree with its own layout — there is no shared dashboard shell between them:

- **`user`** (default/customer) — `src/app/profile/*`, built on [src/components/DashboardLayout.tsx](src/components/DashboardLayout.tsx) + `Sidebar`/`BottomTabNav`. Books calls/letters, views own history.
- **`admin`** — `src/app/admin/*`, own [layout.tsx](src/app/admin/layout.tsx) (role-gates on `user.role === 'admin'`, redirects otherwise) + `adminNavItems`/`AdminBottomTabNav`. Full visibility and control: sees all calls, assigns them to callers (`assigned_to`), edits admin-only fields (`admin_notes`, reassignment), manages CRM/offers/newsletter/analytics. Endpoints under `src/app/api/admin/*` use `supabaseAdmin` and check `payload.role === "admin"` per-route (not RLS-only).
- **`caller`** — `src/app/caller/*`, the staff member a call gets assigned to. Scoped to *only* the calls where `assigned_to = their own id`: list them ([src/app/caller/page.tsx](src/app/caller/page.tsx)), open one to progress `status` (`scheduled → delivered|failed`) and attach a recording ([src/components/caller/CallerCallModal.tsx](src/components/caller/CallerCallModal.tsx)). Cannot reassign a call, edit `admin_notes`, or see calls belonging to other callers. Endpoints under `src/app/api/caller/*` follow the same pattern as `/api/admin/*` (JWT role check + `supabaseAdmin`) but additionally filter/scope every query and mutation by `assigned_to = payload.id` — never trust `callId` alone. RLS policies on `calls` (in `src/db/schema/index.ts`) mirror this scoping for any direct/RLS-governed access path.

`proxy.ts` enforces route-level role gating for all three (`/profile`, `/admin`, `/caller`), and post-login redirects (`auth/page.tsx`, `AuthForm.tsx`) route each role to its own section.

### Email

[src/lib/email.ts](src/lib/email.ts) uses Brevo's transactional API for OTP/auth emails (`sendOTPEmail`); `nodemailer`/`resend` are additional dependencies used elsewhere for other mail flows — check call sites before assuming which provider a given feature uses.
