import { redirect } from "next/navigation";
import { StaffPortalStitchPage } from "@/components/staff/staff-portal-stitch-page";
import { userCanAccessAdmin } from "@/lib/auth/app-role";
import { fetchStaffEventsWithDesksForUser } from "@/lib/queries/list-events";
import { loginPath } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function StaffEventsPortalPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect(loginPath());
  }

  let rows: Awaited<ReturnType<typeof fetchStaffEventsWithDesksForUser>> = [];
  let loadError: string | null = null;

  try {
    rows = await fetchStaffEventsWithDesksForUser(supabase, user.id);
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar os eventos do banco de dados.";
  }

  const showCreateEvent = userCanAccessAdmin(user);

  return (
    <StaffPortalStitchPage
      rows={rows}
      loadError={loadError}
      showCreateEvent={showCreateEvent}
    />
  );
}
