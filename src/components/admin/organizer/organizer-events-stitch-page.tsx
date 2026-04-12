"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminEventListRow } from "@/lib/queries/list-events";
import {
  adminEventImportPath,
  adminEventSettingsPath,
  adminEventStatsPath,
  adminEventsPath,
  adminNewEventPath,
  eventRouteKey,
  staffEventsPath,
  staffSignUpPath,
} from "@/lib/routes";
import {
  IconAdd,
  IconAnalytics,
  IconBadge,
  IconBarChart,
  IconBell,
  IconCalendar,
  IconCheckCircle,
  IconChevronsDown,
  IconCountertops,
  IconDashboard,
  IconEdit,
  IconEvent,
  IconFilterList,
  IconGroups,
  IconHelp,
  IconHome,
  IconLocation,
  IconPerson,
  IconPersonAdd,
  IconSearch,
  IconSettings,
  IconTimer,
  IconTrendingUp,
  IconUpload,
} from "./organizer-icons";

const RACE_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmXRZvaIzMhsHTJZWHQtKvIdZm1Osx_KGY2gv--ukIadcNY6SV0IO6Nxc3D-e1zBFcLI6Qk58TzOnuudhaVMTdLUIEyZEui7pbPMV2EInJvRFF1E2NLHIcnM9JPdOugpglitleK7JDPnEzI9wXw6zsAElo5NjdbMF4hmP_3vojbMEZniELG27E09KCc7Qbe60RVfMW080MlGgO4PIUhiSIbZD9OWvGlN02uyiEzhyJo9Y9DtDz-0yrzGQQYuUpsz6VkJtBmbcMfYLx",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDtkhapT1H7EJs6tW86MMCy4ufND6w4gpzgVVcFE8bgnjcIU4-FISETJCBHc5CAc5LvGxiuJcbOahYTngDlhGiIH2BUexRJbTPZa6vlK8w0VGkdMP4mVqD9e2A9jETGY6jqjuIjcecXZaWCh8ctaXV8Fwmz1u_Y_5cgGVxROz9v74gUiI4HDUKaA1HoLLHGeL-7Qt0xdHBQyX6_Su7wFxsQKocaGNPL9-N-56N-3d8izLjs-2yS5cxtAtq4rKSnBMrKMRJdJGFcjILz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIJsGhDh5_v6f3iQQsurfBm8tX55NKfp4xJZB26U6HH6YQU4_edNDa4BovPGvic75j9zfFH2rc_QWFix_TYzAQZEGS1l5BuPO990hlrdPdCBaFHMrnct6RB_HLQiVaRcW93V-Pb89QJLuGQiFU4bM6v-CgTwbI_b45Lyy8TQk542DJ2Qze_N_oVMor75-VbwoSvHazSsWWRQQ0NhRz258TZNZoGA-Wngt8_SpMGPZh66UXfuRZJIt1z3MPGRTmO5z2ka2UKiXX50Tr",
] as const;

const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBKe4LiOtwjyLun4HDSe6j_12KXRvOoXtPsBRJmmlpJqbhr1_L6BQTIWWfzWu2zEdU1JaGO6vVV0bSm_e2JyCaC1P099h8c5py6ToAS6G6A4Nj37W76Bi3X6ZIDlfNV8hTcSXjZWxYsCvlzATkhLmhheB2xJkmZbP0dgs0kGxc-SlDXWDPnphreRB8Sa6UQOlubMcJzF4gX6H79brR5codNwYm_R3dWhtCmvyjMtOiBGXWzCvCOYRFVcBCUV3YK9mt_CDLQt0IvRAwc";

const PLACEHOLDER_LOCATIONS = [
  "Circuito Centro",
  "Parque Alta Serra",
  "Passeio Riverside",
] as const;

function formatKrId(id: string): string {
  const compact = id.replace(/-/g, "");
  return `KR-${compact.slice(0, 5).toUpperCase()}`;
}

function formatParticipantsShort(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return n.toLocaleString("pt-BR");
}

function formatEventDateStitch(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatParticipantsLine(n: number | null): string {
  if (n === null) return "—";
  return `${n.toLocaleString("pt-BR")} participantes`;
}

type CardVariant = "live" | "scheduled" | "completed";

function statusToVariant(status: AdminEventListRow["status"]): CardVariant {
  if (status === "active") return "live";
  if (status === "closed") return "completed";
  return "scheduled";
}

/**
 * Organizer events list — Stitch visual reference with app-shell scroll:
 * fixed header, fixed sidebar, only `main` scrolls vertically.
 */
export function OrganizerEventsStitchPage({
  rows,
  loadError,
}: {
  rows: AdminEventListRow[];
  loadError: string | null;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const slug = r.slug?.toLowerCase() ?? "";
      return (
        r.name.toLowerCase().includes(q) ||
        slug.includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  const totalParticipants = useMemo(
    () =>
      rows.reduce(
        (acc, r) =>
          acc + (typeof r.registrationCount === "number" ? r.registrationCount : 0),
        0,
      ),
    [rows],
  );

  const upcomingCount = useMemo(
    () => rows.filter((r) => r.status === "draft" || r.status === "active").length,
    [rows],
  );

  const completedCount = useMemo(
    () => rows.filter((r) => r.status === "closed").length,
    [rows],
  );

  const showDemoStructure = rows.length === 0 && !loadError;

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 w-full max-w-full items-center justify-between bg-[rgb(248_250_252/0.88)] px-4 md:px-6 lg:px-8 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-6 lg:gap-12">
          <span className="font-uptempo-headline text-2xl font-black tracking-tighter text-[#075985]">
            KitRunner
          </span>
          <nav className="hidden gap-8 md:flex">
            <Link
              href={adminEventsPath()}
              className="font-uptempo-headline text-sm font-medium text-[#475569] transition-colors hover:text-[#0284c7]"
            >
              Eventos
            </Link>
            <span className="cursor-default font-uptempo-headline text-sm font-medium text-[#475569]">
              Equipe
            </span>
            <span className="cursor-default font-uptempo-headline text-sm font-medium text-[#475569]">
              Financeiro
            </span>
            <span className="cursor-default font-uptempo-headline text-sm font-medium text-[#475569]">
              Suporte
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 rounded-xl border border-[#bdc8d1]/15 bg-[#f7f1ff] px-4 py-1.5 lg:flex">
            <IconSearch className="h-[1.125rem] w-[1.125rem] shrink-0 text-[#6e7881]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 border-0 bg-transparent text-sm text-[#1b1345] placeholder:text-[#6e7881] focus:outline-none focus:ring-0"
              placeholder="Buscar evento..."
              type="search"
              aria-label="Buscar evento"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="scale-95 text-[#475569] transition-colors duration-150 ease-in-out hover:text-[#0284c7]"
              aria-label="Notificações"
            >
              <IconBell className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="scale-95 text-[#475569] transition-colors duration-150 ease-in-out hover:text-[#0284c7]"
              aria-label="Configurações"
            >
              <IconSettings className="h-6 w-6" />
            </button>
            <Image
              src={AVATAR_URL}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          </div>
        </div>
      </header>

      <div className="pt-16 lg:pl-64">
      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100dvh-4rem)] w-64 flex-col space-y-2 overflow-x-hidden bg-[#f8fafc] px-4 py-6 lg:flex">
          <div className="mb-8 shrink-0 px-2">
            <h2 className="font-uptempo-headline text-xl font-bold text-[#075985]">
              KitRunner Pro
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5f588d] opacity-70">
              Gestão elite de eventos
            </p>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
            <Link
              href={adminEventsPath()}
              className="flex items-center gap-3 rounded-lg bg-[rgb(224_231_255/0.55)] px-4 py-3 font-uptempo-headline text-sm font-medium tracking-tight text-[#4338ca] transition-colors hover:bg-[rgb(224_231_255/0.85)]"
            >
              <IconDashboard className="h-6 w-6 shrink-0 text-[#4338ca]" />
              Painel
            </Link>
            <Link
              href={adminEventsPath()}
              className="flex items-center gap-3 rounded-lg px-4 py-3 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]"
            >
              <IconEvent className="h-6 w-6 shrink-0 text-[#64748b]" />
              Minhas provas
            </Link>
            <Link
              href={staffEventsPath()}
              className="flex items-center gap-3 rounded-lg px-4 py-3 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]"
            >
              <IconGroups className="h-6 w-6 shrink-0 text-[#64748b]" />
              Portal da equipe
            </Link>
            <span className="flex cursor-default items-center gap-3 rounded-lg px-4 py-3 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]">
              <IconCountertops className="h-6 w-6 shrink-0 text-[#64748b]" />
              Atribuições
            </span>
            <span className="flex cursor-default items-center gap-3 rounded-lg px-4 py-3 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]">
              <IconAnalytics className="h-6 w-6 shrink-0 text-[#64748b]" />
              Relatórios
            </span>
          </nav>
          <div className="shrink-0 border-t border-[#bdc8d1]/10 px-2 pt-6">
            <Link
              href={staffSignUpPath()}
              className="uptempo-kinetic-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-uptempo-headline text-sm font-bold text-white shadow-lg shadow-uptempo-primary/20 transition-transform hover:scale-[1.02]"
            >
              <IconPersonAdd className="h-5 w-5 shrink-0 text-white" />
              Convidar equipe
            </Link>
            <div className="mt-6 space-y-1">
              <span className="flex cursor-default items-center gap-3 px-4 py-2 font-uptempo-headline text-xs font-medium text-[#94a3b8]">
                <IconHelp className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                Central de ajuda
              </span>
            </div>
          </div>
        </aside>

        <main className="h-[calc(100dvh-4rem)] min-w-0 w-full overflow-y-auto overscroll-y-contain">
        <div className="w-full px-4 pb-28 pt-8 sm:px-6 md:px-8 md:pb-8 lg:px-8 lg:pt-12 lg:pb-8 xl:px-10">
        <div className="mx-auto w-full max-w-[1360px]">
          {loadError ? (
            <div
              className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {loadError}
            </div>
          ) : null}

          <div className="mb-4 lg:hidden">
            <div className="flex items-center gap-2 rounded-xl border border-[#bdc8d1]/15 bg-[#f7f1ff] px-4 py-1.5">
              <IconSearch className="h-[1.125rem] w-[1.125rem] shrink-0 text-[#6e7881]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#1b1345] placeholder:text-[#6e7881] focus:outline-none focus:ring-0"
                placeholder="Buscar evento..."
                type="search"
                aria-label="Buscar evento"
              />
            </div>
          </div>

          <div className="mb-12 flex min-w-0 flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-uptempo-primary">
                Portfólio de eventos
              </span>
              <h1 className="font-uptempo-headline text-4xl font-black leading-tight tracking-tighter text-uptempo-on-surface sm:text-5xl xl:text-6xl">
                Coleção de <br />
                provas
              </h1>
            </div>
            <div className="flex w-full min-w-0 shrink-0 flex-wrap items-stretch gap-3 sm:gap-4 xl:w-auto">
              <button
                type="button"
                className="flex min-h-[3rem] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-uptempo-surface-container-high px-6 py-3 font-uptempo-headline text-sm font-bold text-uptempo-primary transition-all hover:bg-uptempo-surface-container-highest sm:flex-initial sm:px-8 sm:py-4 sm:text-base"
              >
                <IconFilterList className="h-6 w-6 shrink-0" />
                Filtrar
              </button>
              <Link
                href={adminNewEventPath()}
                className="uptempo-kinetic-gradient flex min-h-[3rem] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-center font-uptempo-headline text-sm font-bold text-white shadow-xl shadow-uptempo-primary/25 transition-all hover:scale-[1.03] sm:flex-initial sm:px-8 sm:py-4 sm:text-base"
              >
                <IconAdd className="h-6 w-6 shrink-0" />
                Nova prova
              </Link>
            </div>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
            <div className="flex min-h-[160px] flex-col justify-between rounded-xl border border-uptempo-outline-variant/10 bg-uptempo-surface-container-lowest p-6 shadow-sm md:col-span-2 sm:p-8 2xl:col-span-2">
              <span className="font-uptempo-headline text-sm font-bold text-uptempo-secondary opacity-60">
                Total de participantes ativos
              </span>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-uptempo-headline text-5xl font-black text-uptempo-on-surface">
                  {formatParticipantsShort(totalParticipants)}
                </span>
                <span className="flex items-center text-sm font-bold text-uptempo-tertiary-container">
                  <IconTrendingUp className="mr-1 h-4 w-4 shrink-0" />
                  +12%
                </span>
              </div>
            </div>
            <div className="group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl bg-uptempo-primary p-6 text-white sm:p-8">
              <div className="relative z-10">
                <span className="font-uptempo-headline text-sm font-bold opacity-80">
                  Próximas
                </span>
                <div className="mt-2 font-uptempo-headline text-5xl font-black">
                  {String(upcomingCount).padStart(2, "0")}
                </div>
              </div>
              <IconTimer className="absolute -bottom-4 -right-4 h-[10.5rem] w-[10.5rem] opacity-10 transition-transform group-hover:scale-110" />
            </div>
            <div className="group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl bg-uptempo-secondary p-6 text-white sm:p-8">
              <div className="relative z-10">
                <span className="font-uptempo-headline text-sm font-bold opacity-80">
                  Concluídas
                </span>
                <div className="mt-2 font-uptempo-headline text-5xl font-black">
                  {String(completedCount).padStart(2, "0")}
                </div>
              </div>
              <IconCheckCircle className="absolute -bottom-4 -right-4 h-[10.5rem] w-[10.5rem] opacity-10 transition-transform group-hover:scale-110" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-2">
              <h3 className="font-uptempo-headline text-xl font-extrabold text-uptempo-on-surface">
                Provas ativas e próximas
              </h3>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-uptempo-outline">
                <span className="text-uptempo-primary underline decoration-2 underline-offset-8">
                  Linha do tempo
                </span>
                <span className="opacity-50">Grade</span>
              </div>
            </div>

            {showDemoStructure ? (
              <>
                <OrganizerRaceCard
                  variant="live"
                  title="Maratona Noturna Neo-City"
                  tag="SÉRIE ELITE"
                  idLabel="KR-99201"
                  dateLabel="24 de out. de 2024"
                  participantsLabel="2.450 participantes"
                  locationLabel="Circuito Centro"
                  routeKey={null}
                  imageSrc={RACE_IMAGES[0]}
                  placeholder
                />
                <OrganizerRaceCard
                  variant="scheduled"
                  title="Ultra Summit Peak 50K"
                  tag="TRAIL RUN"
                  idLabel="—"
                  dateLabel="12 de nov. de 2024"
                  participantsLabel="840 participantes"
                  locationLabel="Parque Alta Serra"
                  routeKey={null}
                  imageSrc={RACE_IMAGES[1]}
                  placeholder
                />
                <OrganizerRaceCard
                  variant="completed"
                  title="Sprint 5K Orla"
                  tag="COMUNIDADE"
                  idLabel="—"
                  dateLabel="5 de ago. de 2024"
                  participantsLabel="1.120 participantes"
                  locationLabel={null}
                  routeKey={null}
                  imageSrc={RACE_IMAGES[2]}
                  placeholder
                />
              </>
            ) : (
              filtered.map((row, i) => (
                <OrganizerRaceCard
                  key={row.id}
                  variant={statusToVariant(row.status)}
                  title={row.name}
                  tag={
                    row.status === "active"
                      ? "SÉRIE ELITE"
                      : row.status === "closed"
                        ? "COMUNIDADE"
                        : "TRAIL RUN"
                  }
                  idLabel={formatKrId(row.id)}
                  dateLabel={formatEventDateStitch(row.event_date)}
                  participantsLabel={formatParticipantsLine(row.registrationCount)}
                  locationLabel={
                    row.status === "closed"
                      ? null
                      : PLACEHOLDER_LOCATIONS[i % PLACEHOLDER_LOCATIONS.length]
                  }
                  routeKey={eventRouteKey(row)}
                  imageSrc={RACE_IMAGES[i % RACE_IMAGES.length]}
                  placeholder={false}
                />
              ))
            )}

            {!showDemoStructure && filtered.length === 0 && !loadError ? (
              <p className="px-2 text-sm text-uptempo-outline">
                Nenhuma prova corresponde à sua busca.
              </p>
            ) : null}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              className="flex items-center gap-2 font-uptempo-headline font-bold text-uptempo-primary transition-all hover:gap-4"
            >
              Ver eventos arquivados
              <IconChevronsDown className="h-6 w-6 shrink-0" />
            </button>
          </div>
          </div>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t border-[#e2e8f0] bg-[rgb(255_255_255/0.88)] px-4 pb-6 pt-2 shadow-[0_-10px_30px_rgba(27,19,69,0.06)] backdrop-blur-lg md:hidden">
        <div className="flex flex-col items-center justify-center text-[#94a3b8] duration-100 scale-90">
          <IconHome className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Início
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#e0f2fe] px-5 py-2 text-[#075985] duration-100 scale-90">
          <IconEdit className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Provas
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#94a3b8] duration-100 scale-90">
          <IconBadge className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Trabalho
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#94a3b8] duration-100 scale-90">
          <IconPerson className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Perfil
          </span>
        </div>
      </footer>
    </>
  );
}

function OrganizerRaceCard({
  variant,
  title,
  tag,
  idLabel,
  dateLabel,
  participantsLabel,
  locationLabel,
  routeKey,
  imageSrc,
  placeholder,
}: {
  variant: CardVariant;
  title: string;
  tag: string;
  idLabel: string;
  dateLabel: string;
  participantsLabel: string;
  locationLabel: string | null;
  routeKey: string | null;
  imageSrc: string;
  placeholder: boolean;
}) {
  const isLive = variant === "live";
  const isScheduled = variant === "scheduled";
  const isCompleted = variant === "completed";

  const shell = isLive
    ? "group flex min-w-0 max-w-full flex-col items-center gap-8 rounded-xl border border-uptempo-outline-variant/10 bg-uptempo-surface-container-lowest p-6 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 lg:flex-row lg:p-8"
    : isScheduled
      ? "group flex min-w-0 max-w-full flex-col items-center gap-8 rounded-xl border border-transparent bg-uptempo-surface-container-low p-6 shadow-none transition-all hover:border-uptempo-outline-variant/20 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 lg:flex-row lg:p-8"
      : "group flex min-w-0 max-w-full flex-col items-center gap-8 rounded-xl bg-uptempo-surface-container-low p-6 opacity-70 transition-all hover:opacity-100 lg:flex-row lg:p-8";

  const imgWrap = isLive
    ? "relative aspect-square w-full overflow-hidden rounded-full border-4 border-uptempo-primary/10 lg:w-32"
    : isScheduled
      ? "aspect-square w-full overflow-hidden rounded-full border-4 border-transparent grayscale transition-all group-hover:border-uptempo-secondary/10 group-hover:grayscale-0 lg:w-32"
      : "aspect-square w-full overflow-hidden rounded-full grayscale lg:w-32";

  const titleHover = isLive
    ? "group-hover:text-uptempo-primary"
    : isScheduled
      ? "group-hover:text-uptempo-secondary"
      : "";

  const accent = isLive
    ? "text-uptempo-primary"
    : isScheduled
      ? "text-uptempo-secondary"
      : "text-uptempo-outline";

  const tagClass = isLive
    ? "rounded-lg bg-uptempo-tertiary-container/20 px-2 py-0.5 font-uptempo-headline text-[10px] font-bold text-uptempo-on-tertiary-container"
    : isScheduled
      ? "rounded-lg bg-uptempo-secondary-container/20 px-2 py-0.5 font-uptempo-headline text-[10px] font-bold text-uptempo-secondary"
      : "rounded-lg bg-uptempo-outline-variant/30 px-2 py-0.5 font-uptempo-headline text-[10px] font-bold text-uptempo-outline";

  const statusPill = isLive ? (
    <span className="inline-block rounded-xl bg-uptempo-primary/10 px-4 py-1.5 font-uptempo-headline text-sm font-bold text-uptempo-primary">
      Em andamento
    </span>
  ) : isScheduled ? (
    <span className="inline-block rounded-xl bg-uptempo-secondary-container px-4 py-1.5 font-uptempo-headline text-sm font-bold text-uptempo-on-secondary-container">
      Agendada
    </span>
  ) : (
    <span className="inline-block rounded-xl bg-uptempo-on-surface-variant/10 px-4 py-1.5 font-uptempo-headline text-sm font-bold text-uptempo-on-surface-variant">
      Concluída
    </span>
  );

  const iconBtn = isLive
    ? "rounded-xl bg-uptempo-surface-container-high p-3 transition-all hover:bg-uptempo-primary hover:text-white"
    : isScheduled
      ? "rounded-xl bg-uptempo-surface-container-high p-3 transition-all hover:bg-uptempo-secondary hover:text-white"
      : "rounded-xl bg-uptempo-surface-container-high p-3 transition-all hover:bg-uptempo-on-surface hover:text-white";

  return (
    <div className={shell}>
      <div className={imgWrap}>
        <Image
          src={imageSrc}
          alt=""
          width={256}
          height={256}
          className="h-full w-full object-cover"
          unoptimized
        />
        {isLive ? (
          <div className="absolute inset-0 flex items-center justify-center bg-uptempo-primary/20">
            <span className="flex items-center gap-1 rounded bg-uptempo-primary-container px-2 py-1 font-uptempo-headline text-[10px] font-black text-uptempo-on-primary-container">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              AO VIVO
            </span>
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className={tagClass}>{tag}</span>
          {isLive ? (
            <span className="font-uptempo-headline text-xs font-medium text-uptempo-outline">
              ID: {idLabel}
            </span>
          ) : null}
        </div>
        <h4
          className={`break-words font-uptempo-headline text-xl font-extrabold text-uptempo-on-surface transition-colors sm:text-2xl ${titleHover}`}
        >
          {title}
        </h4>
        <div className="mt-4 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-uptempo-on-surface-variant">
            <IconCalendar className={`h-6 w-6 shrink-0 ${accent}`} />
            <span className="text-sm font-bold">{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-uptempo-on-surface-variant">
            <IconPerson className={`h-6 w-6 shrink-0 ${accent}`} />
            <span className="text-sm font-bold">{participantsLabel}</span>
          </div>
          {locationLabel ? (
            <div className="flex items-center gap-2 text-uptempo-on-surface-variant">
              <IconLocation className={`h-6 w-6 shrink-0 ${accent}`} />
              <span className="text-sm font-bold">{locationLabel}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-row flex-wrap items-center gap-4 border-t border-uptempo-outline-variant/20 pt-6 lg:w-auto lg:flex-nowrap lg:flex-col lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <div className="flex-1 lg:flex-none">
          <span className="mb-1 block font-uptempo-headline text-[10px] font-bold uppercase tracking-widest text-uptempo-outline">
            Status
          </span>
          {statusPill}
        </div>
        {placeholder || !routeKey ? (
          <>
            <span
              className={`${iconBtn} pointer-events-none opacity-40`}
              title="Importar participantes"
            >
              <IconUpload className="h-6 w-6" />
            </span>
            <span
              className={`${iconBtn} pointer-events-none opacity-40`}
              title="Configurar"
            >
              <IconSettings className="h-6 w-6" />
            </span>
            {isCompleted ? (
              <span
                className={`${iconBtn} pointer-events-none opacity-40`}
                title="Estatísticas"
              >
                <IconBarChart className="h-6 w-6" />
              </span>
            ) : null}
          </>
        ) : (
          <>
            <Link
              href={adminEventImportPath(routeKey)}
              className={iconBtn}
              title="Importar participantes"
            >
              <IconUpload className="h-6 w-6" />
            </Link>
            <Link
              href={adminEventSettingsPath(routeKey)}
              className={iconBtn}
              title="Configurar"
            >
              <IconSettings className="h-6 w-6" />
            </Link>
            {isCompleted ? (
              <Link
                href={adminEventStatsPath(routeKey)}
                className={iconBtn}
                title="Estatísticas"
              >
                <IconBarChart className="h-6 w-6" />
              </Link>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
