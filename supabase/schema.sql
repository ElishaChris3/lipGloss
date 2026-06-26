-- Run this in the Supabase dashboard:  SQL Editor -> New query -> paste -> Run
-- It creates the table that stores every survey submission.

create table if not exists public.submissions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- 01 About you
  name              text,
  age               text,
  city              text,
  frequency         text,        -- how often they wear lip products

  -- 02 What you use now
  products_used     text[],      -- multi-select
  spend             text,
  buy_places        text[],      -- multi-select
  fav_brands        text,

  -- 03 Your lips & the sun
  lip_issues        text[],      -- multi-select
  protects_from_sun text,
  knew_sun_damage   text,

  -- 04 A new idea
  interest          int,         -- 1..5 scale
  likelihood        text,
  wanted_products   text[],      -- multi-select
  pick_reasons      text[],      -- multi-select
  barriers          text[],      -- multi-select

  -- 05 Price
  fair_price        text,

  -- 06 Last bit
  improve_wish      text,
  contact           text
);

-- Row Level Security: keep the table locked down.
-- We insert ONLY from the server using the service_role key, which bypasses RLS,
-- so we do NOT add any public insert/select policy. The table stays private.
alter table public.submissions enable row level security;

-- Handy: index for sorting/filtering results by date in the dashboard.
create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);
