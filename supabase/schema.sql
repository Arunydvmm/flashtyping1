-- ============================================================
-- Typing Test Platform — Supabase / Postgres Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Test results table
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  mode text not null,                 -- 'time' | 'long'
  duration_setting int,               -- 15, 30, 60, or null for long
  text_id text,                       -- reference to the passage used
  wpm numeric(6,2) not null,
  raw_wpm numeric(6,2),
  accuracy numeric(5,2) not null,
  total_chars int not null,
  correct_chars int not null,
  incorrect_chars int not null,
  time_taken numeric(6,2) not null,   -- seconds
  created_at timestamptz default now()
);

create index if not exists idx_results_user_created
  on public.test_results(user_id, created_at desc);

alter table public.test_results enable row level security;

create policy "Users can view own results"
  on public.test_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own results"
  on public.test_results for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own results"
  on public.test_results for delete
  using (auth.uid() = user_id);


-- 3. Daily aggregate view (used by dashboard chart for users with lots of history)
create or replace view public.daily_performance as
select
  user_id,
  date_trunc('day', created_at) as day,
  avg(wpm)::numeric(6,2) as avg_wpm,
  avg(accuracy)::numeric(5,2) as avg_accuracy,
  count(*) as test_count,
  sum(time_taken) as total_time
from public.test_results
group by user_id, date_trunc('day', created_at);

-- Note: views inherit RLS from underlying tables when security_invoker is on (PG15+).
-- If needed, set: alter view public.daily_performance set (security_invoker = on);
alter view public.daily_performance set (security_invoker = on);
