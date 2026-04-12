import { StaffShell } from "@/components/staff/staff-shell";
import { userCanAccessAdmin } from "@/lib/auth/app-role";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * Candy shell for guichê / console routes under `/staff/events/.../desk/...`.
 * O índice `/staff/events` usa layout próprio (portal Stitch) em `(portal)/events`.
 */
export default async function StaffWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const showAdministrationLink = userCanAccessAdmin(user);

  return (
    <StaffShell showAdministrationLink={showAdministrationLink}>
      {children}
    </StaffShell>
  );
}
