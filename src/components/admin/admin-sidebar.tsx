"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminEventsPath, staffEventsPath } from "@/lib/routes";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href === adminEventsPath()
      ? pathname === href || pathname.startsWith(`${href}/`)
      : pathname === href || pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "rounded-candy px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-candy-primary/12 text-candy-ink shadow-candy-card-soft"
          : "text-candy-muted hover:bg-candy-container-low/80 hover:text-candy-ink",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-candy-outline/15 bg-candy-surface/90 shadow-candy-card-soft md:flex md:flex-col">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-candy-muted">
              KitRunner Admin
            </p>
            <p className="mt-1 text-sm font-semibold text-candy-ink">
              Operações de prova
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-candy-pill border border-candy-primary/35 bg-candy-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-candy-primary">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-candy-primary"
              aria-hidden
            />
            Ao vivo
          </span>
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-candy-muted">
          Navegação
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          <NavLink href={adminEventsPath()}>Eventos</NavLink>
          <NavLink href={staffEventsPath()}>Console da equipe</NavLink>
        </nav>

        <div className="mt-auto rounded-candy border border-candy-outline/12 bg-candy-container-low/50 p-3">
          <p className="text-xs font-semibold text-candy-ink">Operacional</p>
          <p className="mt-1 text-[11px] leading-snug text-candy-muted">
            KPIs de entrega, ritmo por hora e atividade do piso para o evento
            selecionado.
          </p>
        </div>
      </div>
    </aside>
  );
}
