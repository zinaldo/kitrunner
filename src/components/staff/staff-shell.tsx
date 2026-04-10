import Link from "next/link";
import { StaffAuthNav } from "@/components/staff/staff-auth-nav";
import { adminEventsPath, staffEventsPath } from "@/lib/routes";

/**
 * Shell da área equipe — Candy / Stitch “Joyful Pop”, alinhado ao guichê de entrega.
 */
export function StaffShell({
  children,
  showAdministrationLink = false,
}: {
  children: React.ReactNode;
  /** Contas de organizador (não staff) podem ir ao /admin; staff só vê equipe. */
  showAdministrationLink?: boolean;
}) {
  return (
    <div className="candy-staff flex min-h-dvh flex-col bg-candy-background font-sans text-candy-ink antialiased">
      <header className="shrink-0 border-b border-candy-outline/15 bg-candy-surface/95 shadow-candy-card-soft">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href={staffEventsPath()}
              className="text-sm font-bold tracking-tight text-candy-ink"
            >
              KitRunner
            </Link>
                       <nav className="hidden gap-1 text-sm sm:flex">
              <Link
                href={staffEventsPath()}
                className="rounded-candy px-3 py-1.5 font-medium text-candy-muted transition hover:bg-candy-primary/10 hover:text-candy-ink"
              >
                Eventos
              </Link>
              {showAdministrationLink ? (
                <Link
                  href={adminEventsPath()}
                  className="rounded-candy px-3 py-1.5 font-medium text-candy-muted transition hover:bg-candy-primary/10 hover:text-candy-ink"
                >
                  Administração
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden rounded-candy-pill border border-candy-secondary/30 bg-candy-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-candy-secondary sm:inline">
              Console operacional
            </span>
            <StaffAuthNav />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {children}
      </div>
    </div>
  );
}
