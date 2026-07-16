-- Numio database schema — paste this whole file into Supabase: SQL Editor → New query → Run
-- (Milestone 3A: attempts + profiles. Stripe fields arrive in 3B.)

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  parent_email text,
  child_name text,
  tier text default 'foundation',
  created_at timestamptz default now()
);

create table if not exists attempts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade,
  ts timestamptz default now(),
  question_id text,
  spec_ref text,
  score int not null,
  out_of int not null,
  question text
);

-- Row Level Security: users only ever see their own data
alter table profiles enable row level security;
alter table attempts enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own attempts" on attempts for all using (auth.uid() = user_id);

-- Index for the parent report queries
create index if not exists attempts_user_ts on attempts (user_id, ts desc);
