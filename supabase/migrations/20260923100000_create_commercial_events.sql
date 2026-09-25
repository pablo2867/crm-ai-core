create table if not exists public.commercial_events (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null,
    organization_id uuid not null,
    workspace_id uuid not null,

    event_name text not null,
    event_data jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

create index if not exists commercial_events_user_id_idx
    on public.commercial_events(user_id);

create index if not exists commercial_events_organization_id_idx
    on public.commercial_events(organization_id);

create index if not exists commercial_events_workspace_id_idx
    on public.commercial_events(workspace_id);

create index if not exists commercial_events_event_name_idx
    on public.commercial_events(event_name);

create index if not exists commercial_events_created_at_idx
    on public.commercial_events(created_at);

alter table public.commercial_events
    enable row level security;

create policy commercial_events_select
    on public.commercial_events
    for select
    using (auth.uid() = user_id);

create policy commercial_events_insert
    on public.commercial_events
    for insert
    with check (auth.uid() = user_id);

create policy commercial_events_update
    on public.commercial_events
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy commercial_events_delete
    on public.commercial_events
    for delete
    using (auth.uid() = user_id);
