create table if not exists public.business_catalog_items (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  name text not null,
  description text,
  category text,

  features jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,

  unit text,

  available boolean not null default true,

  specific_rules jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_business_catalog_items_tenant
on public.business_catalog_items (
  user_id,
  organization_id,
  workspace_id
);

create index if not exists idx_business_catalog_items_name
on public.business_catalog_items (
  user_id,
  organization_id,
  workspace_id,
  name
);

alter table public.business_catalog_items
enable row level security;

drop policy if exists business_catalog_items_owner_select
on public.business_catalog_items;

create policy business_catalog_items_owner_select
on public.business_catalog_items
for select
using (
  user_id = auth.uid()
);

drop policy if exists business_catalog_items_owner_insert
on public.business_catalog_items;

create policy business_catalog_items_owner_insert
on public.business_catalog_items
for insert
with check (
  user_id = auth.uid()
);

drop policy if exists business_catalog_items_owner_update
on public.business_catalog_items;

create policy business_catalog_items_owner_update
on public.business_catalog_items
for update
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
);

drop policy if exists business_catalog_items_owner_delete
on public.business_catalog_items;

create policy business_catalog_items_owner_delete
on public.business_catalog_items
for delete
using (
  user_id = auth.uid()
);

grant all privileges
on table public.business_catalog_items
to service_role;

create or replace function public.set_business_catalog_items_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

drop trigger if exists business_catalog_items_updated_at
on public.business_catalog_items;

create trigger business_catalog_items_updated_at
before update
on public.business_catalog_items
for each row
execute function public.set_business_catalog_items_updated_at();