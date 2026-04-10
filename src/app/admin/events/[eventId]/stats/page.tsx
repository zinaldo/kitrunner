import { EventOperationalDashboard } from "@/components/admin/dashboard/event-operational-dashboard";
import type { EventOperationalMeta } from "@/lib/queries/event-operational-meta";
import { fetchEventOperationalMeta } from "@/lib/queries/event-operational-meta";
import { fetchEventStats } from "@/lib/queries/event-stats";
import { resolveEventRow } from "@/lib/queries/resolve-event-desk";
import { createSupabaseAdminServerClient } from "@/lib/supabase/admin-server-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type AdminStatsPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function AdminStatsPage({ params }: AdminStatsPageProps) {
  const { eventId: eventParam } = await params;

  let loadError: string | null = null;
  let stats = {
    delivered: 0,
    pending: 0,
    atDesk: 0,
    totalRegistrations: 0,
  };
  let eventName = "Evento";
  let eventMeta: EventOperationalMeta | null = null;

  try {
    const admin = createSupabaseAdminServerClient();
    const supabase = admin ?? (await createSupabaseServerClient());
    const event = await resolveEventRow(supabase, eventParam);
    if (!event) {
      loadError = "Evento não encontrado.";
      eventName = eventParam;
    } else {
      eventName = event.name;
      const [meta, counts] = await Promise.all([
        fetchEventOperationalMeta(supabase, event.id),
        fetchEventStats(supabase, event.id),
      ]);
      eventMeta = meta;
      stats = counts;
    }
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar as estatísticas do banco de dados.";
    eventName = eventParam;
  }

  return (
    <EventOperationalDashboard
      eventParam={eventParam}
      eventName={eventName}
      eventMeta={eventMeta}
      stats={stats}
      loadError={loadError}
    />
  );
}
