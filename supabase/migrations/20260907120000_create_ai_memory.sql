create table if not exists public.ai_memory (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  lead_id bigint null,

  memory_type text not null,

  workflow text null,
  skill text null,

  title text not null,
  content text not null,

  recommendation text null,

  priority text null,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists ai_memory_user_idx
  on public.ai_memory (user_id);

create index if not exists ai_memory_tenant_idx
  on public.ai_memory (organization_id, workspace_id);

create index if not exists ai_memory_lead_idx
  on public.ai_memory (organization_id, workspace_id, lead_id);

create index if not exists ai_memory_type_idx
  on public.ai_memory (organization_id, workspace_id, memory_type);

alter table public.ai_memory enable row level security;

drop policy if exists "Users can view own ai memory"
  on public.ai_memory;

create policy "Users can view own ai memory"
  on public.ai_memory
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own ai memory"
  on public.ai_memory;

create policy "Users can insert own ai memory"
  on public.ai_memory
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own ai memory"
  on public.ai_memory;

create policy "Users can update own ai memory"
  on public.ai_memory
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own ai memory"
  on public.ai_memory;

create policy "Users can delete own ai memory"
  on public.ai_memory
  for delete
  using (auth.uid() = user_id);
