import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role (bypasses RLS)
// Only use in Server Actions and API routes
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key);
}
