
# Payment Methods — Database Reference

## Purpose

`public.payment_methods` stores fictional payment methods associated with EvLink users. These records represent payment method metadata for the MVP; they do not store complete card numbers or CVVs and do not represent real bank charges.

## Columns

| Column           | PostgreSQL type | Nullable | Default               |
| ---------------- | --------------- | -------- | --------------------- |
| `id`           | `uuid`        | No       | `gen_random_uuid()` |
| `user_id`      | `uuid`        | No       | None                  |
| `brand`        | `text`        | No       | None                  |
| `last_four`    | `text`        | No       | None                  |
| `expiry_month` | `integer`     | No       | None                  |
| `expiry_year`  | `integer`     | No       | None                  |
| `is_default`   | `boolean`     | No       | `false`             |
| `created_at`   | `timestamptz` | No       | `now()`             |
| `updated_at`   | `timestamptz` | No       | `now()`             |

## Relationships

- `user_id` references `public.profiles(id)`.
- The foreign key uses `ON DELETE CASCADE`.
- Deleting a profile therefore deletes its associated payment methods.

## Constraints

- `id` is the primary key.
- `brand` must be one of: `visa`, `mastercard`, `amex`.
- `last_four` must match `^[0-9]{4}$`.
- `expiry_month` must be between 1 and 12.
- `expiry_year` must be between 2026 and 9999, inclusive.

The database constraint on `expiry_year` does not, by itself, verify that the card has not expired in the current month. Any stronger expiry validation must be implemented deliberately and consistently.

## Indexes

- `payment_methods_pkey`: unique primary-key index on `id`.
- `payment_methods_user_id_idx`: index on `user_id`.
- `payment_methods_one_default_per_user_idx`: unique partial index on `user_id` where `is_default = true`.

The partial unique index enforces **at most one default payment method per user**. It does not require every user to have a default payment method.

## Row-Level Security (RLS)

RLS is enabled. `FORCE ROW LEVEL SECURITY` is disabled.

All four policies apply to the `authenticated` role:

- **SELECT — `Users can view own payment methods`:** rows are visible only when `user_id = auth.uid()`.
- **INSERT — `Users can create own payment methods`:** inserted rows must have `user_id = auth.uid()`.
- **UPDATE — `Users can update own payment methods`:** the existing row must belong to the authenticated user, and the resulting row must also belong to that user.
- **DELETE — `Users can delete own payment methods`:** only rows belonging to the authenticated user can be deleted.

Application queries must use the authenticated user's Supabase client. Do not rely on client-side filtering as a replacement for RLS.

## Triggers

No non-internal triggers were returned by the schema inspection. Therefore, do not assume that `updated_at` is automatically maintained by a trigger. Verify the existing implementation before relying on automatic updates.

## Implementation guidance for Copilot

1. Inspect the existing payment-method services, hooks, components, types and validation before editing anything.
2. Reuse the existing project architecture and naming conventions. Do not rewrite working functionality unnecessarily.
3. Never accept `user_id` from an untrusted form as proof of ownership. Derive ownership from the authenticated user.
4. Preserve the allowed brand values and validation constraints in the UI and service layer, while treating PostgreSQL as the final enforcement layer.
5. Handle the unique-default index correctly when selecting a default method. Avoid leaving multiple defaults or assuming every user must have one.
6. Do not store complete card numbers or CVVs. These are fictional payment methods for the MVP.
7. Do not claim that payments are processed by a bank or payment provider.
8. Before changing database functions, policies, constraints or indexes, inspect the actual database definitions and explain any proposed migration.
9. Consult `docs/database/database.types.ts` for the generated Supabase TypeScript schema.

## Source of truth

This document was prepared from a read-only inspection of the remote Supabase database. If code or older documentation disagrees with the current database, verify the discrepancy before making changes.
