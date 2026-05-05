-- SQL to create the app_state table for Supabase/Postgres
-- Run in Supabase SQL editor or psql connected to your project

CREATE TABLE IF NOT EXISTS public.app_state (
  id text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Optional: grant minimal permissions for anon/auth roles used by your app
-- Replace "anon" with the role your client uses (be cautious with permissions)
-- GRANT SELECT, INSERT, UPDATE ON public.app_state TO anon;
