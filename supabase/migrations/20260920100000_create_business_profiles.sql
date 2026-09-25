create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  business_name text not null,
  description text,
  business_type text,
  target_customer text,
  value_proposition text,
  communication_tone text,

  business_hours jsonb not null default '{}'::jsonb,

  policies jsonb not null default '[]'::jsonb,
  commercial_rules jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint business_profiles_tenant_unique
    unique (
      user_id,
      organization_id,
      workspace_id
    )
);

create index if not exists idx_business_profiles_tenant
on public.business_profiles (
  user_id,
  organization_id,
  workspace_id
);

alter table public.business_profiles enable row level security;

drop policy if exists business_profiles_owner_select
on public.business_profiles;

create policy business_profiles_owner_select
on public.business_profiles
for select
using (
  user_id = auth.uid()
);

drop policy if exists business_profiles_owner_insert
on public.business_profiles;

create policy business_profiles_owner_insert
on public.business_profiles
for insert
with check (
  user_id = auth.uid()
);

drop policy if exists business_profiles_owner_update
on public.business_profiles;

create policy business_profiles_owner_update
on public.business_profiles
for update
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
);

drop policy if exists business_profiles_owner_delete
on public.business_profiles;

create policy business_profiles_owner_delete
on public.business_profiles
for delete
using (
  user_id = auth.uid()
);

grant all privileges
on table public.business_profiles
to service_role;

grant usage, select
on all sequences in schema public
to service_role;

create or replace function public.set_business_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists business_profiles_updated_at
on public.business_profiles;

create trigger business_profiles_updated_at
before update on public.business_profiles
for each row
execute function public.set_business_profiles_updated_at();