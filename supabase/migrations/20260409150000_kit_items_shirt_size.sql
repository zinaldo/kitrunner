-- Item de kit (por tipo) e tamanho de camisa na inscrição (importação CSV).
-- Exige public.kit_types (migração 20260409120000_kit_types.sql).
--
-- Se public.kit_items já existir com outro esquema, CREATE TABLE IF NOT EXISTS não
-- adiciona colunas; por isso usamos ADD COLUMN IF NOT EXISTS antes do índice.

create table if not exists public.kit_items (
  id uuid primary key default gen_random_uuid()
);

alter table public.kit_items
  add column if not exists kit_type_id uuid;

alter table public.kit_items
  add column if not exists label text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class r on r.oid = c.conrelid
    join pg_namespace n on n.oid = r.relnamespace
    where n.nspname = 'public'
      and r.relname = 'kit_items'
      and c.conname = 'kit_items_kit_type_id_fkey'
  ) then
    alter table public.kit_items
      add constraint kit_items_kit_type_id_fkey
      foreign key (kit_type_id) references public.kit_types (id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'kit_items'
      and indexdef ilike '%unique%'
      and indexdef like '%kit_type_id%'
      and indexdef like '%label%'
  ) then
    create unique index kit_items_kit_type_id_label_uidx
      on public.kit_items (kit_type_id, label);
  end if;
end $$;

create index if not exists kit_items_kit_type_id_idx on public.kit_items (kit_type_id);

alter table public.registrations
  add column if not exists shirt_size text null;
