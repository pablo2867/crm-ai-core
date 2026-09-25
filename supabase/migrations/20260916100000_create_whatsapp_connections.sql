-- ============================================================
-- CRM AI CORE
-- WhatsApp Connection Routing
-- ============================================================

create table if not exists public.whatsapp_connections (

  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  phone_number text not null,
  provider text not null default 'twilio',

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint whatsapp_connections_provider_check
    check (provider in ('twilio')),

  constraint whatsapp_connections_phone_unique
    unique (phone_number)
);

create index if not exists
  whatsapp_connections_tenant_idx
on public.whatsapp_connections (
  user_id,
  organization_id,
  workspace_id
);

create index if not exists
  whatsapp_connections_phone_idx
on public.whatsapp_connections (
  phone_number
);

create or replace function
public.set_whatsapp_connection_updated_at()

returns trigger
language plpgsql
as $$

begin
  new.updated_at = now();
  return new;

end;

$$;

drop trigger if exists
  whatsapp_connections_updated_at
on public.whatsapp_connections;

create trigger whatsapp_connections_updated_at

before update
on public.whatsapp_connections

for each row

execute function
public.set_whatsapp_connection_updated_at();

alter table public.whatsapp_connections
enable row level security;

drop policy if exists
  whatsapp_connections_select
on public.whatsapp_connections;

create policy whatsapp_connections_select

on public.whatsapp_connections

for select

using (
  auth.uid() = user_id
  and auth.uid() is not null
);

drop policy if exists
  whatsapp_connections_insert
on public.whatsapp_connections;

create policy whatsapp_connections_insert

on public.whatsapp_connections

for insert

with check (
  auth.uid() = user_id
  and auth.uid() is not null
);

drop policy if exists
  whatsapp_connections_update
on public.whatsapp_connections;

create policy whatsapp_connections_update

on public.whatsapp_connections

for update

using (
  auth.uid() = user_id
  and auth.uid() is not null
)

with check (
  auth.uid() = user_id
  and auth.uid() is not null
);

drop policy if exists
  whatsapp_connections_delete
on public.whatsapp_connections;

create policy whatsapp_connections_delete

on public.whatsapp_connections

for delete

using (
  auth.uid() = user_id
  and auth.uid() is not null
);
