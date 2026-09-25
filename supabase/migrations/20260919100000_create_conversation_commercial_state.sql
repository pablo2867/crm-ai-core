create table if not exists public.conversation_commercial_state (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.conversations(id)
    on delete cascade,

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  commercial_data jsonb not null default '{}'::jsonb,
  opportunity_state jsonb not null default '{}'::jsonb,
  objections jsonb not null default '[]'::jsonb,
  qualification jsonb not null default '{}'::jsonb,

  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint conversation_commercial_state_unique
    unique (
      conversation_id,
      user_id,
      organization_id,
      workspace_id
    )
);

create index if not exists
  conversation_commercial_state_tenant_idx
on public.conversation_commercial_state (
  organization_id,
  workspace_id,
  updated_at desc
);

alter table public.conversation_commercial_state
enable row level security;

drop policy if exists conversation_commercial_state_select
on public.conversation_commercial_state;

create policy conversation_commercial_state_select
on public.conversation_commercial_state
for select
using (auth.uid() = user_id);

drop policy if exists conversation_commercial_state_insert
on public.conversation_commercial_state;

create policy conversation_commercial_state_insert
on public.conversation_commercial_state
for insert
with check (auth.uid() = user_id);

drop policy if exists conversation_commercial_state_update
on public.conversation_commercial_state;

create policy conversation_commercial_state_update
on public.conversation_commercial_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_conversation_commercial_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists
  conversation_commercial_state_updated_at
on public.conversation_commercial_state;

create trigger conversation_commercial_state_updated_at
before update on public.conversation_commercial_state
for each row
execute function public.set_conversation_commercial_state_updated_at();
