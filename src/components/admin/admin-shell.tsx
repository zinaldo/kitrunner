import Link from "next/link";
import { adminEventsPath, staffEventsPath } from "@/lib/routes";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-candy-outline/15 bg-candy-surface/95 shadow-candy-card-soft md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link
              href={adminEventsPath()}
              className="text-sm font-semibold text-candy-ink"
            >
              KitRunner Admin
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-candy-pill border border-candy-primary/35 bg-candy-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-candy-primary">
                <span
                  className="h-1 w-1 animate-pulse rounded-full bg-candy-primary"
                  aria-hidden
                />
                Ao vivo
              </span>
              <Link
                href={staffEventsPath()}
                className="text-xs font-semibold text-candy-secondary"
              >
                Guichês
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
