/** Central route builders — swap for env/basePath later without touching every Link. */

/** Prefer slug in URLs when present; otherwise use event UUID. */
export function eventRouteKey(row: { slug: string | null; id: string }): string {
  const s = row.slug?.trim();
  return s && s.length > 0 ? s : row.id;
}

export function loginPath() {
  return "/login";
}

/** Cadastro de operadores de guichê (Supabase Auth). */
export function staffSignUpPath() {
  return "/signup/staff";
}

export function staffEventsPath() {
  return "/staff/events";
}

export function staffDeskPath(eventId: string, deskId: string) {
  return `/staff/events/${eventId}/desk/${deskId}`;
}

export function displayTvPath(eventId: string) {
  return `/display/events/${eventId}/tv`;
}

export function displayDeskPath(eventId: string, deskId: string) {
  return `/display/events/${eventId}/desk/${deskId}`;
}

export function adminEventsPath() {
  return "/admin/events";
}

export function adminNewEventPath() {
  return "/admin/events/new";
}

export function adminEventImportPath(eventId: string) {
  return `/admin/events/${eventId}/import`;
}

export function adminEventStatsPath(eventId: string) {
  return `/admin/events/${eventId}/stats`;
}

export function adminEventSettingsPath(eventId: string) {
  return `/admin/events/${eventId}/settings`;
}
