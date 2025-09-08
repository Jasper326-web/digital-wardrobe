-- feedback table to collect anonymous and authenticated feedback
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_id uuid null,
  language text not null check (language in ('zh','en')),
  message text not null,
  email text null,
  page_url text null,
  user_agent text null
);

-- enable RLS and allow anonymous inserts
alter table public.feedback enable row level security;

-- anyone can insert feedback (anonymous allowed)
create policy if not exists feedback_insert_anyone
on public.feedback
for insert
to anon, authenticated
with check (true);

-- only owner (or anonymous none) can select their own rows; but we disable broad select by default
create policy if not exists feedback_select_owner
on public.feedback
for select
to authenticated
using (auth.uid() = user_id);

-- allow service role to select all (handled by supabase)

-- index for created_at
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);


