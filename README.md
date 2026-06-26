# Lip Survey — Next.js + Supabase

A single-page survey ("Your lips, your honest take") that stores every
submission in a Supabase (Postgres) table.

## How it works

```
Survey page (app/page.tsx)
        │  POST /api/submit
        ▼
API route (app/api/submit/route.ts)   ← runs on the server
        │  insert (service_role key)
        ▼
Supabase table: submissions           ← view/export in the dashboard
```

The survey questions live in one config array in `app/page.tsx`. Each question
`id` maps to a column in the `submissions` table (`supabase/schema.sql`).

## Setup

### 1. Create the Supabase project
- Go to https://supabase.com → New project (free tier is fine).
- Wait for it to provision.

### 2. Create the table
- In the dashboard: **SQL Editor → New query**.
- Paste the contents of `supabase/schema.sql` and click **Run**.

### 3. Add your keys
- In the dashboard: **Project Settings → API**.
- Copy `.env.local.example` to `.env.local` and fill in:
  - `NEXT_PUBLIC_SUPABASE_URL` → the **Project URL**
  - `SUPABASE_SERVICE_ROLE_KEY` → the **service_role** secret key
    (keep this secret — it's server-only and bypasses Row Level Security)

### 4. Install & run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Viewing results
- **Table Editor** → `submissions` to browse / filter / export CSV.
- **SQL Editor** for custom queries, e.g.:
  ```sql
  select * from submissions order by created_at desc;
  ```

## Deploy to Vercel
- Push to a Git repo and import it on https://vercel.com.
- In the Vercel project settings → **Environment Variables**, add the same
  `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Deploy.
