import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client.
// Uses the service_role key, so this module must NEVER be imported into a
// client component. It is only used inside the /api/submit route.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Surfaces a clear error during development if env vars are missing.
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
