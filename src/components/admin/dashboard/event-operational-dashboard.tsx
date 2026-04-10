import Link from "next/link";
import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";
import { PillButton } from "@/components/candy/pill-button";
import { AdminDeliveryHeatmapPlaceholder } from "@/components/admin/dashboard/admin-delivery-heatmap";
import { AdminHourlyFulfillmentChart } from "@/components/admin/dashboard/admin-hourly-chart";
import { AdminLiveActivityFeed } from "@/components/admin/dashboard/admin-live-activity-feed";
import type { EventOperationalMeta } from "@/lib/queries/event-operational-meta";
import {
  adminEventImportPath,
  adminEventsPath,
} from "@/lib/routes";

export type OperationalStats = {
  delivered: number;
  pending: number;
  atDesk: number;
  totalRegistrations: number;
};

type EventOperationalDashboardProps = {
  eventParam: string;
  eventName: string;
  eventMeta: EventOperationalMeta | null;
  stats: OperationalStats;
  loadError: string | null;
};

function formatRaceStart(meta: EventOperationalMeta | null): string {
  const iso = meta?.starts_at ?? meta?.event_date;
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function statusLabel(status: EventOperationalMeta | null): string {
  if (!status?.status) return "—";
  const map: Record<string, string> = {
    draft: "Rascunho",
    active: "Ativo",
    closed: "Encerrado",
  };
  return map[status.status] ?? status.status;
}

export function EventOperationalDashboard({
  eventParam,
  eventName,
  eventMeta,
  stats,
  loadError,
}: EventOperationalDashboardProps) {
  const totalActive = stats.delivered + stats.pending;
  const pctToGoal =
    totalActive > 0 ? Math.round((stats.delivered / totalActive) * 100) : 0;
  const pctDeliveredOfRoster =
    !loadError && stats.totalRegistrations > 0
      ? Math.round((stats.delivered / stats.totalRegistrations) * 100)
      : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 lg:space-y-10">
      <div className="flex flex-col gap-6 border-b border-candy-outline/12 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-candy-muted">
              KitRunner Admin · Operações de prova
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-candy-ink sm:text-3xl">
              Painel operacional
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-candy-pill border border-candy-primary/40 bg-candy-primary/12 px-4 py-2 text-xs font-bold uppercase tracking-widest text-candy-primary shadow-candy-card-soft">
            <span
              className="relative flex h-2 w-2"
              aria-hidden
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-candy-primary opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-candy-primary" />
            </span>
            Ao vivo
          </span>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-candy-muted">
            Foco do evento
          </p>
          <h2 className="mt-2 max-w-4xl text-2xl font-black uppercase leading-tight tracking-[0.12em] text-candy-ink sm:text-4xl sm:tracking-[0.14em]">
            {eventName}
          </h2>
        </div>

        <Link
          href={adminEventsPath()}
          className="inline-flex w-fit text-xs font-semibold text-candy-secondary underline-offset-4 hover:underline"
        >
          ← Todos os eventos
        </Link>
      </div>

      {loadError ? (
        <CandyCard elevation="md" className="border-candy-primary/25 bg-candy-primary/5 p-5">
          <p className="text-sm font-semibold text-candy-ink">{loadError}</p>
          <p className="mt-1 text-xs text-candy-muted">
            Verifique o slug ou UUID do evento, as chaves do Supabase e, se
            necessário,{" "}
            <code className="rounded bg-candy-container-low px-1 font-mono text-[11px]">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            para leituras no admin.
          </p>
        </CandyCard>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <CandyCard elevation="md" className="p-5 sm:p-6">
          <CandySectionTitle>Status do evento</CandySectionTitle>
          <p className="mt-3 text-lg font-bold text-candy-ink">{eventName}</p>
          <span className="mt-3 inline-flex rounded-candy-pill border border-candy-tertiary/35 bg-candy-tertiary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-candy-tertiary">
            {statusLabel(eventMeta)}
          </span>
        </CandyCard>
        <CandyCard elevation="md" className="p-5 sm:p-6">
          <CandySectionTitle>Horário de largada</CandySectionTitle>
          <p className="mt-4 font-mono text-2xl font-bold tabular-nums text-candy-ink sm:text-3xl">
            {formatRaceStart(eventMeta)}
          </p>
          <p className="mt-2 text-xs text-candy-muted">
            Campos de agenda do evento no Supabase
          </p>
        </CandyCard>
        <CandyCard elevation="md" className="p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
          <CandySectionTitle>Total de participantes</CandySectionTitle>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <p className="font-mono text-4xl font-black tabular-nums text-candy-ink sm:text-5xl">
              {loadError
                ? "—"
                : stats.totalRegistrations.toLocaleString("pt-BR")}
            </p>
            {pctDeliveredOfRoster !== null ? (
              <span className="mb-1 inline-flex items-center gap-1 rounded-candy-pill bg-candy-secondary/12 px-2.5 py-1 text-xs font-bold text-candy-secondary">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="m16 6-2.29 2.29-4.88 4.88-2-2L6.41 9 5 10.41l4.17 4.17 6.59-6.59L18 8v6h2V6h-4zm4 14H4v-4H2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4h-2v4z" />
                </svg>
                {pctDeliveredOfRoster}% kits entregues
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-candy-muted">
            Total de linhas em{" "}
            <code className="rounded bg-candy-container-low px-1 font-mono text-[11px]">
              registrations
            </code>{" "}
            para este evento no Supabase.
          </p>
        </CandyCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <CandyCard
          elevation="lg"
          className="p-6 sm:col-span-7 sm:p-8 lg:col-span-7"
        >
          <CandySectionTitle>Kits entregues</CandySectionTitle>
          <p className="mt-4 font-mono text-5xl font-black tabular-nums text-candy-primary sm:text-6xl">
            {loadError ? "—" : stats.delivered.toLocaleString("pt-BR")}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-candy-muted">
            {loadError
              ? "—"
              : `${pctToGoal}% da fila ativa já retirada`}
          </p>
          <p className="mt-4 text-sm text-candy-muted">
            Contagem a partir de{" "}
            <code className="rounded bg-candy-container-low px-1 font-mono text-xs">
              deliveries
            </code>{" "}
            no Supabase, ligada às inscrições deste evento.
          </p>
        </CandyCard>
        <div className="flex flex-col gap-4 sm:col-span-5 lg:col-span-5">
          <CandyCard elevation="md" className="flex-1 p-6">
            <CandySectionTitle>Pendentes</CandySectionTitle>
            <p className="mt-3 font-mono text-4xl font-black tabular-nums text-candy-ink">
              {loadError ? "—" : stats.pending.toLocaleString("pt-BR")}
            </p>
            <p className="mt-2 text-xs text-candy-muted">
              Inscrições com{" "}
              <code className="rounded bg-candy-container-low px-1 font-mono text-[10px]">
                kit_status = pending
              </code>
            </p>
          </CandyCard>
          <CandyCard elevation="md" className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-candy bg-candy-secondary/12 p-2 text-candy-secondary">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <div>
                <CandySectionTitle>Prazo no guichê</CandySectionTitle>
                <p className="mt-2 font-mono text-lg font-bold text-candy-ink">
                  2h 40m
                </p>
                <p className="mt-1 text-xs text-candy-muted">
                  Contagem ilustrativa — conectar à janela do evento ou SLA
                  depois.
                </p>
              </div>
            </div>
          </CandyCard>
          <CandyCard elevation="md" className="p-6">
            <CandySectionTitle>No guichê (TV)</CandySectionTitle>
            <p className="mt-2 font-mono text-3xl font-black tabular-nums text-candy-tertiary">
              {loadError ? "—" : stats.atDesk}
            </p>
            <p className="mt-2 text-xs text-candy-muted">
              Linhas em{" "}
              <code className="rounded bg-candy-container-low px-1 font-mono text-[10px]">
                desk_display_state
              </code>{" "}
              com inscrição projetada.
            </p>
          </CandyCard>
        </div>
      </div>

      <AdminHourlyFulfillmentChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <CandyCard elevation="lg" className="p-6 sm:p-8">
          <CandySectionTitle>Motor de inscrições em massa</CandySectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-candy-muted">
            Sincronize grandes bases de participantes com a grade da prova.
            Suporta CSV, XLSX e JSON.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <PillButton type="button" variant="secondary" size="sm" disabled>
              Escolher arquivos
            </PillButton>
            <PillButton type="button" variant="tertiary" size="sm" disabled>
              Acesso API
            </PillButton>
          </div>
          <Link
            href={adminEventImportPath(eventParam)}
            className="mt-6 block rounded-candy border-2 border-dashed border-candy-outline/25 bg-candy-container-low/40 p-10 text-center transition hover:border-candy-primary/35 hover:bg-candy-primary/5"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-candy-primary/15 text-candy-primary">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
            </span>
            <p className="mt-4 text-sm font-bold text-candy-ink">
              Solte o manifesto aqui
            </p>
            <p className="mt-1 text-xs text-candy-muted">
              Abre a rota de importação — upload completo em breve.
            </p>
          </Link>
        </CandyCard>
        <AdminLiveActivityFeed atDeskCount={loadError ? 0 : stats.atDesk} />
      </div>

      <AdminDeliveryHeatmapPlaceholder />
    </div>
  );
}
