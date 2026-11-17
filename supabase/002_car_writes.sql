-- Run once, after 001_read_schema.sql.
begin;
grant insert (make, model, year, image_url, description) on public.cars to authenticated;
grant update (make, model, year, image_url, description) on public.cars to authenticated;
grant delete on public.cars to authenticated;
create policy "Members can create their own cars" on public.cars
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "Owners can update their cars" on public.cars
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "Owners can delete their cars" on public.cars
for delete to authenticated using ((select auth.uid()) = owner_id);
-- Column grants prevent callers from changing owner_id, id or created_at.
commit;
