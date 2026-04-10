-- One row per (event, field_key) for import configuration.
create unique index if not exists event_required_fields_event_id_field_key_uidx
  on public.event_required_fields (event_id, field_key);
