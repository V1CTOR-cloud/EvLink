
# EvLink — Payment Flow Database Reference

## Scope

This document describes the inspected remote Supabase database definitions for `payments`, `payment_methods`, and the existing charging/payment RPC functions.

The payment system is a simulation for the MVP. It does not charge a real card or communicate with a real payment processor.

## `public.payments`

### Columns

| Column         | Type                    | Nullable | Default               |
| -------------- | ----------------------- | -------- | --------------------- |
| `id`         | `uuid`                | No       | `gen_random_uuid()` |
| `created_at` | `timestamptz`         | No       | `now()`             |
| `session_id` | `uuid`                | No       | None                  |
| `user_id`    | `uuid`                | No       | None                  |
| `amount`     | `numeric`             | No       | None                  |
| `currency`   | `text`                | No       | `'EUR'`             |
| `status`     | `payment_status` enum | No       | `'pending'`         |
| `updated_at` | `timestamptz`         | No       | `now()`             |

### Constraints and relationships

- `id` is the primary key.
- `session_id` references `charging_sessions(id)`, with `ON UPDATE CASCADE` and `ON DELETE RESTRICT`.
- `session_id` is unique: at most one payment row can exist for each charging session.
- `user_id` references `profiles(id)`, with `ON UPDATE CASCADE` and `ON DELETE RESTRICT`.

### RLS

The inspected `SELECT` policy applies to `authenticated` and permits access when `user_id = auth.uid()` or `is_admin()`.

No other `payments` policies were returned by the inspection. Do not assume clients can directly insert, update or delete payments.

## Existing RPC functions

### `finish_charging(p_session_id uuid, p_energy_kwh numeric)`

Returns `charging_sessions`.

- Requires an authenticated user.
- Rejects null or negative energy.
- Locks the session row using `FOR UPDATE`.
- Rejects missing sessions, sessions owned by another user, and sessions not in `pending` or `charging`.
- Sets the session to `completed`.
- Stores `ended_at`, `energy_kwh`, and `total_amount = energy_kwh * price_per_kwh`.
- Updates `updated_at`.
- Sets the associated connector status to `available`.
- Returns the updated session.

### `create_payment(p_session_id uuid)`

Returns `payments`.

- Requires authentication and ownership of the charging session.
- Locks the session row using `FOR UPDATE`.
- Requires the session to be `completed`.
- Rejects a null or negative `total_amount`.
- Returns the existing payment if one already exists for the session.
- Otherwise creates a payment using the session's owner and final amount, with currency `EUR` and status `pending`.

This function is designed to be idempotent for repeated calls on the same session, subject to the database constraints and transaction behavior.

### `process_payment(p_payment_id uuid)`

Returns `payments`.

- Requires authentication and payment ownership.
- Locks the payment row using `FOR UPDATE`.
- Returns the payment unchanged if its status is already `completed`.
- Rejects any status other than `pending`.
- Changes `pending` to `completed` and updates `updated_at`.
- This is a simulation, not a real card charge.

## Relationship to `payment_methods`

`payment_methods` stores fictional card metadata for the user. The inspected `create_payment` function does not accept a `payment_method_id`, does not read `payment_methods`, and does not associate a payment with a saved method.

Therefore, do not claim that the current RPC uses a saved card to process a payment. Any future association between payments and saved methods must be designed explicitly and must not be assumed to exist in the current schema.

## Guidance for Copilot

1. Read `docs/database/database.types.ts`, `docs/database/payment-methods.md`, and this file before editing payment code.
2. Inspect the existing implementation in `src/` and identify what's already complete.
3. Preserve the existing service → hook → UI separation and project conventions.
4. Reuse the authenticated Supabase client and derive the current user's ID from the authenticated session.
5. Keep saved payment methods separate from the simulated `payments` lifecycle unless an explicit product requirement says otherwise.
6. Do not invent database columns, policies, RPC functions or relationships.
7. Do not rewrite functioning code just to match a preferred pattern.
8. If a database change is necessary, explain why and propose the SQL migration before applying it.
9. After implementation, run the project's available lint, type-check and build commands, and report any failures accurately.

## Source and verification

This reference was prepared from a read-only inspection of the remote Supabase schema and function definitions. Verify any subsequent schema changes against the live database before relying on this document.
