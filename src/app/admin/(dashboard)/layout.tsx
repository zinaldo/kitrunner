import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Demais rotas /admin/events/* (exceto o índice) usam o shell admin Candy + sidebar.
 * O índice /admin/events fica fora deste grupo para o layout Stitch (organizador).
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="candy-admin min-h-dvh bg-candy-background font-sans text-candy-ink antialiased">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
