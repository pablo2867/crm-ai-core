create table if not exists public.business_catalog_pricing (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  catalog_item_id uuid not null
    references public.business_catalog_items(id)
    on delete cascade,

  pricing_type text not null
    check (pricing_type in ('fixed', 'range')),

  price numeric(14,2),

  minimum_price numeric(14,2),
  maximum_price numeric(14,2),

  currency text not null default 'MXN',

  unit text,

  minimum_quantity numeric(14,3),
  maximum_quantity numeric(14,3),

  conditions jsonb not null default '[]'::jsonb,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint business_catalog_pricing_values_check
    check (
      (
        pricing_type = 'fixed'
        and price is not null
        and price >= 0
        and minimum_price is null
        and maximum_price is null
      )
      or
      (
        pricing_type = 'range'
        and minimum_price is not null
        and maximum_price is not null
        and minimum_price >= 0
        and maximum_price >= minimum_price
        and price is null
      )
    ),

  constraint business_catalog_pricing_quantity_check
    check (
      (
        minimum_quantity is null
        or minimum_quantity >= 0
      )
      and
      (
        maximum_quantity is null
        or maximum_quantity >= 0
      )
      and
      (
        minimum_quantity is null
        or maximum_quantity is null
        or maximum_quantity >= minimum_quantity
      )
    )
);

create index if not exists idx_business_catalog_pricing_tenant
on public.business_catalog_pricing (
  user_id,
  organization_id,
  workspace_id
);

create index if not exists idx_business_catalog_pricing_item
on public.business_catalog_pricing (
  user_id,
  organization_id,
  workspace_id,
  catalog_item_id
);

create index if not exists idx_business_catalog_pricing_active
on public.business_catalog_pricing (
  user_id,
  organization_id,
  workspace_id,
  active
);

alter table public.business_catalog_pricing
enable row level security;

drop policy if exists business_catalog_pricing_owner_select
on public.business_catalog_pricing;

create policy business_catalog_pricing_owner_select
on public.business_catalog_pricing
for select
using (
  user_id = auth.uid()
);

drop policy if exists business_catalog_pricing_owner_insert
on public.business_catalog_pricing;

create policy business_catalog_pricing_owner_insert
on public.business_catalog_pricing
for insert
with check (
  user_id = auth.uid()
);

drop policy if exists business_catalog_pricing_owner_update
on public.business_catalog_pricing;

create policy business_catalog_pricing_owner_update
on public.business_catalog_pricing
for update
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
);

drop policy if exists business_catalog_pricing_owner_delete
on public.business_catalog_pricing;

create policy business_catalog_pricing_owner_delete
on public.business_catalog_pricing
for delete
using (
  user_id = auth.uid()
);

grant all privileges
on table public.business_catalog_pricing
to service_role;

create or replace function public.set_business_catalog_pricing_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

drop trigger if exists business_catalog_pricing_updated_at
on public.business_catalog_pricing;

create trigger business_catalog_pricing_updated_at
before update
on public.business_catalog_pricing
for each row
execute function public.set_business_catalog_pricing_updated_at();