-- Run once in the SQL Editor of a NEW Supabase project.
begin;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 30)
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
create policy "Anyone can read public names" on public.profiles for select to anon, authenticated using (true);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, display_name)
  values(new.id, coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), 'Member'));
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table public.cars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  make text not null check (char_length(btrim(make)) between 2 and 40),
  model text not null check (char_length(btrim(model)) between 1 and 60),
  year integer not null check (year between 1886 and extract(year from current_date)::integer + 1),
  image_url text not null check (image_url ~ '^https://[^[:space:]]+$' and char_length(image_url) <= 2000),
  description text not null check (char_length(btrim(description)) between 20 and 3000),
  created_at timestamptz not null default now()
);
create index cars_owner_id_idx on public.cars(owner_id);
create index cars_created_at_idx on public.cars(created_at desc);
alter table public.cars enable row level security;
revoke all on public.cars from anon, authenticated;
grant select on public.cars to anon, authenticated;
create policy "Anyone can read cars" on public.cars for select to anon, authenticated using (true);
commit;
