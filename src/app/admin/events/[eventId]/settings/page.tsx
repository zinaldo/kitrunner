import { EventConfigurationEditor } from "@/components/admin/event-settings/event-configuration-editor";
import { defaultImportRulesState } from "@/lib/event-import-rules";
import { resolveImportRulesForEvent } from "@/lib/queries/event-import-rules-resolve";
import {
  fetchDesksForEventSettings,
  fetchEventSettingsRow,
  fetchEventStaffForSettings,
  fetchKitItemsForEventSettings,
  fetchKitTypesForEventSettings,
  fetchRacesForEventSettings,
} from "@/lib/queries/event-settings";
import { resolveEventRow } from "@/lib/queries/resolve-event-desk";
import { adminNewEventPath } from "@/lib/routes";
import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

type AdminEventSettingsPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function AdminEventSettingsPage({
  params,
}: AdminEventSettingsPageProps) {
  const { eventId: eventParam } = await params;

  if (eventParam.trim().toLowerCase() === "new") {
    redirect(adminNewEventPath());
  }

  let loadError: string | null = null;
  let event: Awaited<ReturnType<typeof fetchEventSettingsRow>> = null;
  let races: Awaited<ReturnType<typeof fetchRacesForEventSettings>> = [];
  let desks: Awaited<ReturnType<typeof fetchDesksForEventSettings>> = [];
  let kitTypes: Awaited<ReturnType<typeof fetchKitTypesForEventSettings>> = [];
  let kitItems: Awaited<ReturnType<typeof fetchKitItemsForEventSettings>> = [];
  let staff: Awaited<ReturnType<typeof fetchEventStaffForSettings>> = [];
  let importRules = defaultImportRulesState();

  try {
    const admin = createSupabaseAdminServerClient();
    const supabase = admin ?? (await createSupabaseServerClient());
    const resolved = await resolveEventRow(supabase, eventParam);
    if (!resolved) {
      loadError = "Evento não encontrado.";
    } else {
      const [row, raceRows, deskRows, kitRows, kitItemRows, staffRows, rules] =
        await Promise.all([
          fetchEventSettingsRow(supabase, resolved.id),
          fetchRacesForEventSettings(supabase, resolved.id),
          fetchDesksForEventSettings(supabase, resolved.id),
          fetchKitTypesForEventSettings(supabase, resolved.id),
          fetchKitItemsForEventSettings(supabase, resolved.id),
          fetchEventStaffForSettings(supabase, resolved.id, {
            enrichEmailsWithAdmin: admin,
          }),
          resolveImportRulesForEvent(supabase, resolved.id),
        ]);
      event = row;
      races = raceRows;
      desks = deskRows;
      kitTypes = kitRows;
      kitItems = kitItemRows;
      staff = staffRows;
      importRules = rules;
      if (!row) {
        loadError = "Evento não encontrado.";
      }
    }
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar a configuração do evento.";
  }

  return (
    <EventConfigurationEditor
      mode="edit"
      eventParam={eventParam}
      initialEvent={event}
      initialImportRules={importRules}
      initialRaces={races}
      initialDesks={desks}
      initialKitTypes={kitTypes}
      initialKitItems={kitItems}
      initialStaff={staff}
      loadError={loadError}
    />
  );
}
