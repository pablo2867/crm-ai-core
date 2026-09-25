create table if not exists public.conversation_lifecycle (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.conversations(id)
    on delete cascade,

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  status text not null default 'open'
    check (status in ('open', 'closed', 'archived')),

  close_reason text,
  closed_by uuid,
  opened_at timestamptz,
  closed_at timestamptz,
  archived_at timestamptz,

  last_activity_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint conversation_lifecycle_unique
    unique (
      conversation_id,
      user_id,
      organization_id,
      workspace_id
    )
);

create index if not exists conversation_lifecycle_tenant_idx
on public.conversation_lifecycle (
  organization_id,
  workspace_id,
  status,
  updated_at desc
);

alter table public.conversation_lifecycle
enable row level security;

drop policy if exists conversation_lifecycle_select
on public.conversation_lifecycle;

create policy conversation_lifecycle_select
on public.conversation_lifecycle
for select
using (auth.uid() = user_id);

drop policy if exists conversation_lifecycle_insert
on public.conversation_lifecycle;

create policy conversation_lifecycle_insert
on public.conversation_lifecycle
for insert
with check (auth.uid() = user_id);

drop policy if exists conversation_lifecycle_update
on public.conversation_lifecycle;

create policy conversation_lifecycle_update
on public.conversation_lifecycle
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant all privileges
on table public.conversation_lifecycle
to service_role;

create or replace function public.set_conversation_lifecycle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists conversation_lifecycle_updated_at
on public.conversation_lifecycle;

create trigger conversation_lifecycle_updated_at
before update on public.conversation_lifecycle
for each row
execute function public.set_conversation_lifecycle_updated_at();
