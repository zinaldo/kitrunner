-- Tipos de kit por evento (nome configurável; importação CSV resolve por name).

create table if not exists public.kit_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, name)
);

create index if not exists kit_types_event_id_idx on public.kit_types (event_id);
