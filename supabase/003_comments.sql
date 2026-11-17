-- Run once, after 001 and 002.
begin;
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index comments_car_id_created_at_idx on public.comments(car_id, created_at);
create index comments_author_id_idx on public.comments(author_id);
alter table public.comments enable row level security;
revoke all on public.comments from anon, authenticated;
grant select on public.comments to anon, authenticated;
grant insert(car_id, body) on public.comments to authenticated;
grant delete on public.comments to authenticated;
create policy "Anyone can read comments" on public.comments for select to anon, authenticated using (true);
create policy "Members can post their comments" on public.comments for insert to authenticated
with check ((select auth.uid()) = author_id);
create policy "Authors can delete their comments" on public.comments for delete to authenticated
using ((select auth.uid()) = author_id);
commit;
