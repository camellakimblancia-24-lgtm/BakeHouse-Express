-- 1. Link profiles to Supabase Auth (delete any test rows in profiles first)
alter table profiles alter column id drop default;
alter table profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

-- 2. Seed roles (change names to whatever your team uses)
insert into roles (name, description) values
  ('manager', 'Manages catalog, recipes and users'),
  ('staff',   'Day-to-day production and sales')
on conflict (name) do nothing;

-- 3. Auto-create a profile on signup, defaulting to staff
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, role_id, full_name, email)
  values (
    new.id,
    (select id from public.roles where name = 'staff'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Helper for policies: the current user's role name
create or replace function public.current_role_name()
returns text language sql stable security definer set search_path = '' as $$
  select r.name
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.id = auth.uid() and p.is_active
$$;

-- 5. Ingredient checks from your catalog rules
alter table ingredients
  add constraint ingredients_stock_nonneg check (stock_qty >= 0),
  add constraint ingredients_reorder_nonneg check (reorder_level >= 0);

-- 6. RLS for the tables auth and the catalog need now
alter table roles       enable row level security;
alter table profiles    enable row level security;
alter table categories  enable row level security;
alter table units       enable row level security;
alter table ingredients enable row level security;

create policy "read roles" on roles for select to authenticated using (true);

create policy "read profiles" on profiles for select to authenticated
  using (id = auth.uid() or public.current_role_name() = 'manager');

create policy "read categories" on categories for select to authenticated using (true);
create policy "read units"      on units      for select to authenticated using (true);
create policy "read ingredients" on ingredients for select to authenticated using (true);

create policy "managers write ingredients" on ingredients for all to authenticated
  using (public.current_role_name() = 'manager')
  with check (public.current_role_name() = 'manager');