-- Parede de TV: sexo e faixa etária (metadata.age_group). Remove race_wave da view.
--
-- CREATE OR REPLACE VIEW não pode mudar ordem/nome de colunas existentes no Postgres;
-- por isso DROP + CREATE.

drop view if exists public.tv_desk_tiles cascade;

create view public.tv_desk_tiles as
select
  d.id as desk_id,
  d.event_id,
  d.label as desk_label,
  d.sort_order as desk_sort_order,
  d.external_key as desk_external_key,
  s.registration_id,
  s.display_variant,
  coalesce(s.updated_at, d.updated_at) as display_updated_at,
  e.name as event_name,
  r.bib_number,
  r.full_name,
  rac.name as race_name,
  rac.distance_km as race_distance_km,
  r.kit_status,
  r.sex as participant_sex,
  r.metadata ->> 'age_group' as age_group
from public.desks d
inner join public.events e on e.id = d.event_id
left join public.desk_display_state s on s.desk_id = d.id
  and s.event_id = d.event_id
left join public.registrations r on r.id = s.registration_id
left join public.races rac on rac.id = r.race_id;
