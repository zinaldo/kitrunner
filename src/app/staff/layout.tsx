import { StaffShell } from "@/components/staff/staff-shell";
import { userCanAccessAdmin } from "@/lib/auth/app-role";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function StaffLayout({
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
    <StaffShell showAdministrationLink={showAdministrationLink}>{children}</StaffShell>
  );
}
