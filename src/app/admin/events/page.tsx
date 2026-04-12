import { OrganizerEventsStitchPage } from "@/components/admin/organizer/organizer-events-stitch-page";
import { fetchAdminEventsList } from "@/lib/queries/list-events";
import { getSupabaseAdminOrServer } from "@/lib/supabase/admin-or-server-client";

export default async function AdminEventsPage() {
  let rows: Awaited<ReturnType<typeof fetchAdminEventsList>> = [];
  let loadError: string | null = null;

  try {
    const { supabase } = await getSupabaseAdminOrServer();
    rows = await fetchAdminEventsList(supabase);
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar os eventos do banco de dados.";
  }

  return <OrganizerEventsStitchPage rows={rows} loadError={loadError} />;
}
