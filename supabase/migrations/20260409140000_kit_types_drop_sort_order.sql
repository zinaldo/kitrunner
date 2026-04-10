-- Alinhar com o app: kit_types não usa mais sort_order (ordenação por name no client).
-- Ignora erro se a coluna não existir (Postgres não tem IF EXISTS em DROP COLUMN em versões antigas;
-- use SQL Editor manual se necessário).

alter table public.kit_types drop column if exists sort_order;
