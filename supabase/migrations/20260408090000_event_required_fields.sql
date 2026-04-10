-- CSV / import column configuration per event (source of truth for admin + import pipeline).

create table if not exists public.event_required_fields (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  field_key text not null,
  label text not null,
  is_enabled boolean not null default true,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_required_fields_event_id_idx
  on public.event_required_fields (event_id);
