import Link from "next/link";
import { ImportParticipantsForm } from "@/components/admin/import/import-participants-form";
import { resolveImportRulesForEvent } from "@/lib/queries/event-import-rules-resolve";
import {
  fetchEventSettingsRow,
  fetchKitTypesForEventSettings,
  fetchRacesForEventSettings,
} from "@/lib/queries/event-settings";
import { resolveEventRow } from "@/lib/queries/resolve-event-desk";
import { adminEventsPath, adminEventSettingsPath } from "@/lib/routes";
import { getSupabaseAdminOrServer } from "@/lib/supabase/admin-or-server-client";
import { defaultImportRulesState } from "@/lib/event-import-rules";

type AdminImportPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function AdminImportPage({ params }: AdminImportPageProps) {
  const { eventId: eventParam } = await params;

  let loadError: string | null = null;
  let eventName = eventParam;
  let importRules = defaultImportRulesState();
  let races: { id: string; name: string }[] = [];
  let kitTypes: { id: string; name: string }[] = [];

  try {
    const { supabase } = await getSupabaseAdminOrServer();
    const resolved = await resolveEventRow(supabase, eventParam);
    if (!resolved) {
      loadError = "Evento não encontrado.";
    } else {
      eventName = resolved.name;
      const [settings, raceRows, kitRows, rules] = await Promise.all([
        fetchEventSettingsRow(supabase, resolved.id),
        fetchRacesForEventSettings(supabase, resolved.id),
        fetchKitTypesForEventSettings(supabase, resolved.id),
        resolveImportRulesForEvent(supabase, resolved.id),
      ]);
      if (!settings) {
        loadError = "Evento não encontrado.";
      } else {
        importRules = rules;
        races = raceRows.map((r) => ({ id: r.id, name: r.name }));
        kitTypes = kitRows.map((k) => ({ id: k.id, name: k.name }));
      }
    }
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar dados do evento.";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href={adminEventsPath()}
          className="text-sm font-semibold text-candy-secondary hover:text-candy-ink"
        >
          ← Eventos
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-candy-ink">
          Importar participantes
        </h1>
        <p className="mt-1 font-mono text-sm text-candy-muted">{eventParam}</p>
        {!loadError ? (
          <p className="mt-2 text-sm text-candy-muted">
            <Link
              href={adminEventSettingsPath(eventParam)}
              className="font-semibold text-candy-secondary underline-offset-2 hover:underline"
            >
              Configuração da prova
            </Link>
          </p>
        ) : null}
      </div>

      {loadError ? (
        <p className="text-sm font-medium text-red-600">{loadError}</p>
      ) : (
        <ImportParticipantsForm
          eventParam={eventParam}
          eventName={eventName}
          importRules={importRules}
          races={races}
          kitTypes={kitTypes}
        />
      )}
    </div>
  );
}
