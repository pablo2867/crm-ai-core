-- ============================================================
-- CRM AI CORE
-- WhatsApp Conversation Core
-- ============================================================

-- ============================================================
-- 1. CONVERSATIONS
-- ============================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  channel text not null default 'whatsapp',
  contact_phone text not null,
  contact_name text,

  lead_id bigint references public.leads(id)
    on delete set null,

  status text not null default 'open',

  last_message_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint conversations_channel_check
    check (channel in ('whatsapp')),

  constraint conversations_status_check
    check (
      status in (
        'open',
        'closed',
        'archived'
      )
    )
);

-- ============================================================
-- 2. CONVERSATION TENANT INDEX
-- ============================================================

create unique index if not exists
  conversations_tenant_phone_channel_idx
on public.conversations (
  user_id,
  organization_id,
  workspace_id,
  contact_phone,
  channel
);

create unique index if not exists
  conversations_tenant_id_idx
on public.conversations (
  id,
  user_id,
  organization_id,
  workspace_id
);

create index if not exists
  conversations_tenant_last_message_idx
on public.conversations (
  organization_id,
  workspace_id,
  last_message_at desc
);

-- ============================================================
-- 3. CONVERSATION MESSAGES
-- ============================================================

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null,

  user_id uuid not null,
  organization_id uuid not null,
  workspace_id uuid not null,

  direction text not null,

  sender text,
  recipient text,

  body text not null,

  provider text,
  provider_message_id text,

  status text not null default 'queued',

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint conversation_messages_direction_check
    check (
      direction in (
        'inbound',
        'outbound'
      )
    ),

  constraint conversation_messages_status_check
    check (
      status in (
        'queued',
        'sent',
        'delivered',
        'read',
        'failed',
        'received'
      )
    ),

  constraint conversation_messages_conversation_fk
    foreign key (
      conversation_id,
      user_id,
      organization_id,
      workspace_id
    )
    references public.conversations (
      id,
      user_id,
      organization_id,
      workspace_id
    )
    on delete cascade
);

-- ============================================================
-- 4. MESSAGE INDEXES
-- ============================================================

create index if not exists
  conversation_messages_conversation_idx
on public.conversation_messages (
  conversation_id,
  created_at
);

create index if not exists
  conversation_messages_tenant_idx
on public.conversation_messages (
  user_id,
  organization_id,
  workspace_id,
  created_at desc
);

create unique index if not exists
  conversation_messages_provider_id_idx
on public.conversation_messages (
  provider,
  provider_message_id
)
where provider_message_id is not null;

-- ============================================================
-- 5. UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_conversation_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 6. CONVERSATION UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
  conversations_updated_at
on public.conversations;

create trigger conversations_updated_at
before update on public.conversations
for each row
execute function public.set_conversation_updated_at();

-- ============================================================
-- 7. MESSAGE UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
  conversation_messages_updated_at
on public.conversation_messages;

create trigger conversation_messages_updated_at
before update on public.conversation_messages
for each row
execute function public.set_conversation_updated_at();

-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================

alter table public.conversations
enable row level security;

alter table public.conversation_messages
enable row level security;

-- ============================================================
-- 9. CONVERSATIONS SELECT
-- ============================================================

drop policy if exists
  conversations_tenant_select
on public.conversations;

create policy conversations_tenant_select
on public.conversations
for select
using (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 10. CONVERSATIONS INSERT
-- ============================================================

drop policy if exists
  conversations_tenant_insert
on public.conversations;

create policy conversations_tenant_insert
on public.conversations
for insert
with check (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 11. CONVERSATIONS UPDATE
-- ============================================================

drop policy if exists
  conversations_tenant_update
on public.conversations;

create policy conversations_tenant_update
on public.conversations
for update
using (
  auth.uid() = user_id
  and auth.uid() is not null
)
with check (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 12. CONVERSATIONS DELETE
-- ============================================================

drop policy if exists
  conversations_tenant_delete
on public.conversations;

create policy conversations_tenant_delete
on public.conversations
for delete
using (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 13. MESSAGES SELECT
-- ============================================================

drop policy if exists
  conversation_messages_tenant_select
on public.conversation_messages;

create policy conversation_messages_tenant_select
on public.conversation_messages
for select
using (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 14. MESSAGES INSERT
-- ============================================================

drop policy if exists
  conversation_messages_tenant_insert
on public.conversation_messages;

create policy conversation_messages_tenant_insert
on public.conversation_messages
for insert
with check (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 15. MESSAGES UPDATE
-- ============================================================

drop policy if exists
  conversation_messages_tenant_update
on public.conversation_messages;

create policy conversation_messages_tenant_update
on public.conversation_messages
for update
using (
  auth.uid() = user_id
  and auth.uid() is not null
)
with check (
  auth.uid() = user_id
  and auth.uid() is not null
);

-- ============================================================
-- 16. MESSAGES DELETE
-- ============================================================

drop policy if exists
  conversation_messages_tenant_delete
on public.conversation_messages;

create policy conversation_messages_tenant_delete
on public.conversation_messages
for delete
using (
  auth.uid() = user_id
  and auth.uid() is not null
);
