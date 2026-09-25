-- ============================================================
-- CRM AI CORE
-- BLOCK 10.5 — HUMAN HANDOFF
-- ============================================================

create table if not exists public.conversation_handoffs (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.conversations(id)
    on delete cascade,

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  status text not null default 'pending',

  reason text,
  intent text,
  confidence numeric,

  assigned_to uuid,
  assigned_at timestamptz,

  requested_at timestamptz not null default now(),
  started_at timestamptz,
  resolved_at timestamptz,

  resolution_note text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint conversation_handoffs_status_check
    check (
      status in (
        'pending',
        'assigned',
        'in_progress',
        'resolved',
        'cancelled'
      )
    )
);

create index if not exists
  conversation_handoffs_tenant_idx
on public.conversation_handoffs (
  organization_id,
  workspace_id,
  status,
  created_at desc
);

create index if not exists
  conversation_handoffs_conversation_idx
on public.conversation_handoffs (
  conversation_id,
  created_at desc
);

create unique index if not exists
  conversation_handoffs_active_unique_idx
on public.conversation_handoffs (
  conversation_id,
  user_id,
  organization_id,
  workspace_id
)
where status in (
  'pending',
  'assigned',
  'in_progress'
);

alter table public.conversation_handoffs
enable row level security;

drop policy if exists
  conversation_handoffs_owner_select
on public.conversation_handoffs;

create policy
  conversation_handoffs_owner_select
on public.conversation_handoffs
for select
using (
  user_id = auth.uid()
);

drop policy if exists
  conversation_handoffs_owner_insert
on public.conversation_handoffs;

create policy
  conversation_handoffs_owner_insert
on public.conversation_handoffs
for insert
with check (
  user_id = auth.uid()
);

drop policy if exists
  conversation_handoffs_owner_update
on public.conversation_handoffs;

create policy
  conversation_handoffs_owner_update
on public.conversation_handoffs
for update
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
);

grant all privileges
on table public.conversation_handoffs
to service_role;

create or replace function
public.set_conversation_handoff_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists
  conversation_handoffs_updated_at
on public.conversation_handoffs;

create trigger
  conversation_handoffs_updated_at
before update on public.conversation_handoffs
for each row
execute function
public.set_conversation_handoff_updated_at();
