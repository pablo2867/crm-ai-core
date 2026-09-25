create table if not exists public.financial_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  fiscal_year integer not null,
  fiscal_period integer not null,
  source text not null default 'manual',
  source_type text,
  classification text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  code text not null,
  name text not null,
  type text not null,
  currency text not null default 'MXN',
  active boolean not null default true,
  source text not null default 'manual',
  source_type text,
  classification text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_data_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null,
  name text not null,
  publisher text,
  reference text,
  published_at timestamptz,
  period_id uuid references public.financial_periods(id) on delete set null,
  currency text,
  classification text not null,
  source text not null default 'import',
  created_at timestamptz not null default now()
);

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.financial_accounts(id) on delete restrict,
  period_id uuid references public.financial_periods(id) on delete set null,
  transaction_date date not null,
  description text not null,
  amount numeric(18,2) not null,
  currency text not null default 'MXN',
  type text not null,
  source text not null default 'manual',
  source_id uuid references public.financial_data_sources(id) on delete set null,
  source_type text,
  classification text,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_statements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  period_id uuid not null references public.financial_periods(id) on delete cascade,
  type text not null,
  currency text not null default 'MXN',
  source text not null default 'import',
  source_type text,
  classification text,
  created_at timestamptz not null default now()
);

create index if not exists idx_financial_periods_tenant
  on public.financial_periods(organization_id, workspace_id);

create index if not exists idx_financial_accounts_tenant
  on public.financial_accounts(organization_id, workspace_id);

create index if not exists idx_financial_sources_tenant
  on public.financial_data_sources(organization_id, workspace_id);

create index if not exists idx_financial_transactions_tenant
  on public.financial_transactions(organization_id, workspace_id);

create index if not exists idx_financial_statements_tenant
  on public.financial_statements(organization_id, workspace_id);

alter table public.financial_periods enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.financial_data_sources enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.financial_statements enable row level security;

drop policy if exists financial_periods_tenant_access on public.financial_periods;
create policy financial_periods_tenant_access
on public.financial_periods
for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
);

drop policy if exists financial_accounts_tenant_access on public.financial_accounts;
create policy financial_accounts_tenant_access
on public.financial_accounts
for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
);

drop policy if exists financial_sources_tenant_access on public.financial_data_sources;
create policy financial_sources_tenant_access
on public.financial_data_sources
for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
);

drop policy if exists financial_transactions_tenant_access on public.financial_transactions;
create policy financial_transactions_tenant_access
on public.financial_transactions
for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
);

drop policy if exists financial_statements_tenant_access on public.financial_statements;
create policy financial_statements_tenant_access
on public.financial_statements
for all
using (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
)
with check (
  organization_id in (
    select organization_id
    from public.organization_members
    where user_id = auth.uid()
      and active = true
  )
);
