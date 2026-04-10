-- Staff linked to Auth users for kit delivery at an event.

create table if not exists public.event_staff (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.event_staff_role not null default 'staff'::public.event_staff_role,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index if not exists event_staff_event_id_idx on public.event_staff (event_id);

alter table public.event_staff enable row level security;
