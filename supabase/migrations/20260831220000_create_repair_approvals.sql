create table if not exists public.repair_approvals (

  id uuid
    primary key
    default gen_random_uuid(),

  issue_id text
    not null,

  user_id uuid
    not null,

  organization_id uuid
    not null,

  workspace_id uuid
    not null,

  status text
    not null
    default 'pending',

  approved boolean
    not null
    default false,

  plan jsonb
    not null,

  actions jsonb
    not null,

  decided_by uuid
    null,

  reason text
    not null,

  created_at timestamptz
    not null
    default now(),

  decided_at timestamptz
    null,

  constraint repair_approvals_status_check
    check (
      status in (
        'pending',
        'approved',
        'rejected'
      )
    )

);

create unique index if not exists
  repair_approvals_tenant_issue_idx
on public.repair_approvals (
  organization_id,
  workspace_id,
  user_id,
  issue_id
);

create index if not exists
  repair_approvals_organization_idx
on public.repair_approvals (
  organization_id,
  workspace_id
);

create index if not exists
  repair_approvals_user_idx
on public.repair_approvals (
  user_id
);

alter table public.repair_approvals
enable row level security;

create policy "Users can view own repair approvals"
on public.repair_approvals
for select
using (
  auth.uid() = user_id
);

create policy "Users can create own repair approvals"
on public.repair_approvals
for insert
with check (
  auth.uid() = user_id
);

create policy "Users can update own repair approvals"
on public.repair_approvals
for update
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);
