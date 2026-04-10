import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StaffDeskClient } from "@/components/staff/station/staff-desk-client";
import { userIsEventStaff } from "@/lib/queries/event-staff-access";
import { displayDeskPath, displayTvPath, loginPath } from "@/lib/routes";
import type { ImportFieldKey } from "@/lib/event-import-rules";
import {
  IMPORT_FIELD_DEFAULT_LABELS,
  isImportFieldKey,
  resolveImportRulesForEvent,
} from "@/lib/queries/event-import-rules-resolve";
import {
  fetchKitTypesForEventSettings,
  fetchRacesForEventSettings,
} from "@/lib/queries/event-settings";
import { resolveDeskRow, resolveEventRow } from "@/lib/queries/resolve-event-desk";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type DeskConsolePageProps = {
  params: Promise<{ eventId: string; deskId: string }>;
};

export default async function StaffDeskConsolePage({
  params,
}: DeskConsolePageProps) {
  const { eventId: eventParam, deskId: deskParam } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    redirect(loginPath());
  }

  const event = await resolveEventRow(supabase, eventParam);
  if (!event) notFound();

  const allowed = await userIsEventStaff(supabase, user.id, event.id);
  if (!allowed) notFound();

  const desk = await resolveDeskRow(supabase, event.id, deskParam);
  if (!desk) notFound();

  const [raceList, kitTypeList] = await Promise.all([
    fetchRacesForEventSettings(supabase, event.id),
    fetchKitTypesForEventSettings(supabase, event.id),
  ]);

  const raceOptions = raceList.map((r) => ({ id: r.id, name: r.name }));
  const kitTypeOptions = kitTypeList.map((k) => ({ id: k.id, name: k.name }));

  const rules = await resolveImportRulesForEvent(supabase, event.id);
  const { data: fieldConfig } = await supabase
    .from("event_required_fields")
    .select("field_key, label, is_enabled, is_required, sort_order")
    .eq("event_id", event.id)
    .order("sort_order", { ascending: true });

  const fieldLabels: Record<ImportFieldKey, string> = {
    ...IMPORT_FIELD_DEFAULT_LABELS,
  };
  const requiredFieldDisplayOrder: ImportFieldKey[] = [];
  for (const r of fieldConfig ?? []) {
    if (!r.field_key || !isImportFieldKey(r.field_key)) continue;
    fieldLabels[r.field_key] = r.label;
    if (r.is_enabled && r.is_required) {
      requiredFieldDisplayOrder.push(r.field_key);
    }
  }

  return (
    <>
      <StaffDeskClient
        eventId={event.id}
        deskId={desk.id}
        eventParam={eventParam}
        eventName={event.name}
        deskLabel={desk.label}
        participantContext={{
          rules,
          fieldLabels,
          requiredFieldDisplayOrder,
        }}
        raceOptions={raceOptions}
        kitTypeOptions={kitTypeOptions}
      />
      <footer className="mt-8 border-t border-candy-outline/15 pt-4 text-center text-xs text-candy-muted">
        <span className="font-medium text-candy-ink/80">Display público</span>
        <span className="mx-2 text-candy-outline">·</span>
        <Link
          href={displayTvPath(eventParam)}
          className="font-semibold text-candy-tertiary underline-offset-2 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          TV multi-guichê
        </Link>
        <span className="mx-2 text-candy-outline">·</span>
        <Link
          href={displayDeskPath(eventParam, deskParam)}
          className="font-semibold text-candy-tertiary underline-offset-2 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Só este guichê
        </Link>
      </footer>
    </>
  );
}
