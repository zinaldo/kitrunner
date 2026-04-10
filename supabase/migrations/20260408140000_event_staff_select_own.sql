-- Allow authenticated users to read their own event_staff rows (staff area + access checks).

create policy "event_staff_select_own"
  on public.event_staff
  for select
  to authenticated
  using (user_id = auth.uid());
