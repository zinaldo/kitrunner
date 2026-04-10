import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="candy-admin min-h-dvh bg-candy-background font-sans antialiased text-candy-ink">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
