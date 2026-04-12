"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { StaffEventCardRow } from "@/lib/queries/list-events";
import {
  IconAnalytics,
  IconBadge,
  IconBell,
  IconCalendar,
  IconCheckCircle,
  IconCountertops,
  IconDashboard,
  IconEdit,
  IconEvent,
  IconGroups,
  IconHelp,
  IconHome,
  IconLocation,
  IconPerson,
  IconSettings,
} from "@/components/admin/organizer/organizer-icons";
import {
  IconArrowForward,
  IconLandscape,
  IconRocket,
  IconRun,
} from "@/components/staff/staff-portal-icons";
import {
  adminEventsPath,
  adminNewEventPath,
  eventRouteKey,
  staffDeskPath,
  staffEventsPath,
  staffSignUpPath,
} from "@/lib/routes";

const HEADER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC62fsfFAUhDKYgFEEQJazZkdW4B6e-YThiGtsjJCfP5AqyoE45j65O-JEyGlGD4t1V_QcSQczjjrtCLhasSZ-xZEszT1ZYg5n10iWezAoX0yaKnfZuNW_5SF55U3WqoPg4qSJrUsMm9673D3UJSMW3wzz2hVm7pVR_62nYZveD5lYoc1--uTkeRn9gKaxXdrNO2K6Lc5SNZ39czkxUXePfsa50R_fUUzXMZQVPsGCEXhcXziKlebwTVT491t4A85u_m_31S5cUC9yC";

const FEATURE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDC_PI9qhPKzEqjqiNWoF-sYyl8rG6NUnJan2SQbqG0kT0m43KE31ku8IyqgyHVUiBgxoKJNjAkf4i8PcPH_9UhJjuaQUyCd1lVpYNAwTs9iGNHwa5V6fpwQQm7CaqU3wIriiZsmLq4chCoSJ0MhuXIQ9S5kAGE_1sRnQBCGKaFfhlHEmJTWT2aztiUlVNBaSDRa5ijPYyxZIO4a9gHWDp67lvIu0O7wGjqH6g4w3Atn4pRO46DqIJdrZ6sOeqv5nbSRSf18kVMcCP5";

const TEAM_A =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfoyDpIjh_X3KubrgMCMreRnqMAyMvDo1lKtcvQz_EOAyazMsn1HFW94qIGfe2lbC9bnRfm6houpUN2L81Y3Q5mw1UHdZlM--IoTZW4Zf08Ye9rEuZ3KCpAyX9rkFJfkRXk2nIUctELA_9sMEDxcXXuqp7K-W_Ho6099WCqgqWDkA_3tzAatydkgNuaQIeDGcSfpXd8udJG_HP0IrSjcoTMuDmYXDDtsocMq0RVvWZiPmGHKGzOEztMzWVEkf7XbMDUqskI61Fb7-";

const TEAM_B =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBYT86qqxJ8slPBCBDb4Suvonu0U4N1_gvIEswoH2SHH1M_NtKQztoW2tHFsKPMQPYphAZsTI3dmIs3mpoDPSbqoVxttCQQv5eXTncR0ecSG9OCZeJKzzP8akRSN084ZiotRoFgUze02rPNLZUznofmdJi5of5XCN4MWwAB0nImOE8qT6GNU9LkuJVXcQq97DFhjT_g5dWD3V-sEJPzjm1L-yByBLRrLZzCvkxAz5Tbup2BlujrVe2niPeCp8XHhxbThDJMxBExDmB5";

export function StaffPortalStitchPage({
  rows,
  loadError,
  showCreateEvent,
}: {
  rows: StaffEventCardRow[];
  loadError: string | null;
  showCreateEvent: boolean;
}) {
  const confirmedCount = useMemo(
    () => rows.filter((r) => r.desks.length > 0).length,
    [rows],
  );

  const featured = rows[0];
  const rest = rows.slice(1);
  const scheduleA = rest[0];
  const scheduleB = rest[1];
  const cardB = rest[0] ?? null;
  const cardC = rest[1] ?? null;

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-16 w-full max-w-full items-center justify-between bg-[rgb(248_250_252/0.88)] px-4 shadow-sm backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-6 md:gap-8">
          <span className="font-uptempo-headline text-2xl font-black tracking-tighter text-[#075985]">
            KitRunner
          </span>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href={adminEventsPath()}
              className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0284c7]"
            >
              Eventos
            </Link>
            <Link
              href={staffEventsPath()}
              className="border-b-2 border-[#0284c7] pb-0.5 text-sm font-bold text-[#0369a1]"
            >
              Equipe
            </Link>
            <span className="cursor-default text-sm font-medium text-[#475569]">
              Financeiro
            </span>
            <span className="cursor-default text-sm font-medium text-[#475569]">
              Suporte
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-uptempo-on-surface-variant transition-colors hover:text-uptempo-primary"
            aria-label="Notificações"
          >
            <IconBell className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="text-uptempo-on-surface-variant transition-colors hover:text-uptempo-primary"
            aria-label="Configurações"
          >
            <IconSettings className="h-6 w-6" />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-uptempo-primary-container">
            <Image
              src={HEADER_AVATAR}
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          {showCreateEvent ? (
            <Link
              href={adminNewEventPath()}
              className="hidden rounded-xl bg-gradient-to-r from-[#00658c] to-[#00b0f0] px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95 md:inline-block"
            >
              Criar evento
            </Link>
          ) : null}
        </div>
      </nav>

      <div className="pt-16 md:pl-64">
        <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100dvh-4rem)] w-64 flex-col space-y-2 overflow-x-hidden bg-[#f8fafc] px-4 py-6 md:flex">
          <div className="mb-8 shrink-0 px-2">
            <h2 className="font-uptempo-headline text-xl font-bold text-[#075985]">
              KitRunner Pro
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
              Gestão elite de eventos
            </p>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
            <Link
              href={adminEventsPath()}
              className="flex items-center gap-3 rounded-lg px-4 py-2 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]"
            >
              <IconDashboard className="h-6 w-6 shrink-0" />
              Painel
            </Link>
            <Link
              href={adminEventsPath()}
              className="flex items-center gap-3 rounded-lg px-4 py-2 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]"
            >
              <IconEvent className="h-6 w-6 shrink-0" />
              Minhas provas
            </Link>
            <Link
              href={staffEventsPath()}
              className="flex items-center gap-3 rounded-lg bg-[rgb(224_231_255/0.55)] px-4 py-2 font-uptempo-headline text-sm font-medium tracking-tight text-[#4338ca] transition-colors hover:bg-[rgb(224_231_255/0.85)]"
            >
              <IconGroups className="h-6 w-6 shrink-0 text-[#4338ca]" />
              Portal da equipe
            </Link>
            <span className="flex cursor-default items-center gap-3 rounded-lg px-4 py-2 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]">
              <IconCountertops className="h-6 w-6 shrink-0" />
              Atribuições
            </span>
            <span className="flex cursor-default items-center gap-3 rounded-lg px-4 py-2 font-uptempo-headline text-sm font-medium tracking-tight text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]">
              <IconAnalytics className="h-6 w-6 shrink-0" />
              Relatórios
            </span>
          </nav>
          <div className="shrink-0 space-y-1 border-t border-[#e2e8f0] pt-4">
            <span className="flex cursor-default items-center gap-3 px-4 py-2 font-uptempo-headline text-sm font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9]">
              <IconHelp className="h-6 w-6 shrink-0" />
              Central de ajuda
            </span>
            <Link
              href={staffSignUpPath()}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-uptempo-surface-container-high py-3 font-uptempo-headline text-sm font-bold text-uptempo-primary transition-all hover:bg-uptempo-surface-container-highest"
            >
              Convidar equipe
            </Link>
          </div>
        </aside>

        <main className="h-[calc(100dvh-4rem)] min-w-0 w-full overflow-y-auto overscroll-y-contain bg-uptempo-surface">
          <div className="w-full px-4 pb-28 pt-8 md:p-12 md:pb-12">
            {loadError ? (
              <div
                className="mx-auto mb-8 max-w-6xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                role="alert"
              >
                {loadError}
              </div>
            ) : null}

            <header className="mx-auto mb-12 max-w-6xl">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-uptempo-primary">
                    Atribuições ativas
                  </span>
                  <h1 className="font-uptempo-headline text-4xl font-black tracking-tight text-uptempo-secondary sm:text-5xl">
                    Portal de eventos — equipe
                  </h1>
                  <p className="max-w-xl text-lg text-uptempo-on-surface-variant">
                    Gerencie suas atribuições, escolha o guichê de operação e
                    entre no modo de trabalho.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex min-h-[5.25rem] min-w-0 items-center gap-5 rounded-xl border border-uptempo-outline-variant/15 bg-uptempo-surface-container-lowest px-5 py-5 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-uptempo-tertiary-container text-white">
                      <IconCheckCircle className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                        Confirmados
                      </p>
                      <p className="font-uptempo-headline text-xl font-bold leading-tight text-uptempo-secondary">
                        {confirmedCount}{" "}
                        {confirmedCount === 1 ? "evento" : "eventos"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="relative flex flex-col gap-8 overflow-hidden rounded-xl border border-uptempo-outline-variant/15 bg-uptempo-surface-container-lowest p-8 group md:flex-row lg:col-span-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-uptempo-primary-container/12 transition-transform group-hover:scale-110" />
                <div className="relative z-[1] h-48 w-full flex-shrink-0 overflow-hidden rounded-xl shadow-sm md:w-48">
                  <Image
                    src={FEATURE_IMAGE}
                    alt=""
                    width={384}
                    height={384}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative z-[1] flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="flex min-h-[1.75rem] items-center gap-1.5 rounded-xl bg-uptempo-primary-container px-4 py-1.5 font-uptempo-headline text-[10px] font-black uppercase leading-none tracking-widest text-white">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        Pulso ao vivo
                      </span>
                      <span className="inline-flex min-h-[1.75rem] items-center rounded-xl bg-uptempo-tertiary-container/20 px-4 py-1.5 font-uptempo-headline text-[10px] font-black uppercase leading-none tracking-widest text-uptempo-tertiary">
                        Atribuído
                      </span>
                    </div>
                    {featured ? (
                      <>
                        <h3 className="mb-2 font-uptempo-headline text-2xl font-black leading-tight text-uptempo-secondary sm:text-3xl">
                          {featured.name}
                        </h3>
                        <div className="mb-6 flex flex-wrap gap-4 text-uptempo-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <IconCalendar className="h-4 w-4 shrink-0 text-uptempo-primary" />
                            <span className="text-sm font-semibold">—</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconLocation className="h-4 w-4 shrink-0 text-uptempo-primary" />
                            <span className="text-sm font-semibold">
                              Local a confirmar
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="mb-2 font-uptempo-headline text-2xl font-black leading-tight text-uptempo-secondary sm:text-3xl">
                          Nenhuma prova atribuída
                        </h3>
                        <p className="mb-6 text-sm text-uptempo-on-surface-variant">
                          Quando um organizador adicionar você à equipe, o evento
                          aparecerá aqui com o guichê disponível.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="mt-auto flex w-full flex-col gap-4 border-t border-slate-200/50 pt-6 sm:flex-row sm:items-end">
                    {featured && featured.desks.length > 0 ? (
                      <FeaturedDeskActions
                        eventKey={eventRouteKey(featured)}
                        desks={featured.desks}
                      />
                    ) : (
                      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="w-full sm:w-48">
                          <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase text-[#64748b]">
                            Selecionar guichê
                          </label>
                          <select
                            disabled
                            className="min-h-[2.625rem] w-full rounded-lg border-0 bg-uptempo-surface-container-low px-3 py-2.5 text-sm font-semibold opacity-50 focus:ring-2 focus:ring-uptempo-primary/20"
                          >
                            <option>—</option>
                          </select>
                        </div>
                        <span className="inline-flex min-h-[2.625rem] w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-uptempo-primary-container/40 px-8 py-2.5 font-uptempo-headline text-sm font-bold text-white opacity-60 sm:w-auto">
                          Ir trabalhar
                          <IconRocket className="h-4 w-4" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl bg-uptempo-secondary p-8 text-uptempo-on-secondary lg:col-span-4">
                <div>
                  <h4 className="mb-4 font-uptempo-headline text-2xl font-black">
                    Agenda confirmada
                  </h4>
                  <div className="space-y-4">
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md">
                      <p className="text-xs font-bold uppercase text-uptempo-primary-container">
                        {scheduleA
                          ? "Próximo na lista"
                          : "Amanhã, 06:00 (ex.)"}
                      </p>
                      <p className="font-uptempo-headline font-bold">
                        {scheduleA?.name ?? "Corrida da Meia-Noite 10K"}
                      </p>
                      <p className="text-xs opacity-70">
                        {scheduleA && scheduleA.desks[0]
                          ? `${scheduleA.desks[0].label} • Equipe`
                          : "Guichê 1 • Arena principal"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md">
                      <p className="text-xs font-bold uppercase text-uptempo-primary-container">
                        {scheduleB
                          ? "Em seguida"
                          : "Sábado que vem, 05:30 (ex.)"}
                      </p>
                      <p className="font-uptempo-headline font-bold">
                        {scheduleB?.name ?? "Desafio corporativo"}
                      </p>
                      <p className="text-xs opacity-70">
                        {scheduleB && scheduleB.desks[0]
                          ? `${scheduleB.desks[0].label} • Equipe`
                          : "Guichê 5 • Parque tecnológico"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-8 flex items-center gap-2 font-uptempo-headline text-xs font-black uppercase tracking-widest text-uptempo-primary-container transition-colors hover:text-white"
                >
                  Ver calendário completo
                  <IconArrowForward className="h-4 w-4" />
                </button>
              </div>

              <MediumEventCard
                event={cardB}
                variant="confirmed"
                icon={<IconRun className="h-8 w-8 text-uptempo-primary" />}
              />
              <MediumEventCard
                event={cardC}
                variant="assigned"
                icon={
                  <IconLandscape className="h-8 w-8 text-uptempo-primary" />
                }
              />
            </div>

            {rows.length === 0 && !loadError ? (
              <p className="mx-auto mt-10 max-w-6xl px-2 text-center text-sm text-uptempo-on-surface-variant">
                Você ainda não está na equipe de nenhuma prova, ou não há
                guichês ativos. Peça a um administrador para adicionar seu
                e-mail nas configurações da prova.
              </p>
            ) : null}
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t border-[#e2e8f0] bg-[rgb(255_255_255/0.88)] px-4 pb-6 pt-2 shadow-[0_-10px_30px_rgba(27,19,69,0.06)] backdrop-blur-md md:hidden">
        <span className="flex flex-col items-center text-[#94a3b8]">
          <IconHome className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Início
          </span>
        </span>
        <span className="flex flex-col items-center text-[#94a3b8]">
          <IconEdit className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Eventos
          </span>
        </span>
        <span className="flex flex-col items-center rounded-xl bg-[#e0f2fe] px-5 py-2 text-[#075985]">
          <IconBadge className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Trabalho
          </span>
        </span>
        <span className="flex flex-col items-center text-[#94a3b8]">
          <IconPerson className="h-6 w-6" />
          <span className="mt-1 font-uptempo-headline text-[10px] font-semibold uppercase tracking-widest">
            Perfil
          </span>
        </span>
      </nav>
    </>
  );
}

function FeaturedDeskActions({
  eventKey,
  desks,
}: {
  eventKey: string;
  desks: StaffEventCardRow["desks"];
}) {
  const [idx, setIdx] = useState(0);
  const desk = desks[idx] ?? desks[0];
  const href = desk ? staffDeskPath(eventKey, desk.routeKey) : "#";

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
      <div className="w-full sm:w-48">
        <label
          htmlFor="staff-desk-select"
          className="mb-1.5 ml-1 block text-[10px] font-bold uppercase text-[#64748b]"
        >
          Selecionar guichê
        </label>
        <select
          id="staff-desk-select"
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          className="min-h-[2.625rem] w-full rounded-lg border-0 bg-uptempo-surface-container-low px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-uptempo-primary/20"
        >
          {desks.map((d, i) => (
            <option key={d.routeKey} value={i}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <Link
        href={href}
        className="flex min-h-[2.625rem] w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-uptempo-primary-container px-8 py-2.5 font-uptempo-headline text-sm font-bold text-white shadow-lg shadow-uptempo-primary/20 transition-all active:scale-95 hover:bg-uptempo-primary sm:w-auto"
      >
        Ir trabalhar
        <IconRocket className="h-4 w-4" />
      </Link>
    </div>
  );
}

function MediumEventCard({
  event,
  variant,
  icon,
}: {
  event: StaffEventCardRow | null;
  variant: "confirmed" | "assigned";
  icon: ReactNode;
}) {
  const pill =
    variant === "confirmed" ? (
      <span className="inline-flex min-h-[1.75rem] items-center rounded-xl bg-uptempo-tertiary-container/20 px-4 py-1.5 font-uptempo-headline text-[10px] font-black uppercase leading-none tracking-widest text-uptempo-tertiary">
        Confirmado
      </span>
    ) : (
      <span className="inline-flex min-h-[1.75rem] items-center rounded-xl bg-uptempo-secondary-container/30 px-4 py-1.5 font-uptempo-headline text-[10px] font-black uppercase leading-none tracking-widest text-uptempo-secondary">
        Atribuído
      </span>
    );

  const title =
    event?.name ??
    (variant === "confirmed"
      ? "Vertical Sky Tower Run"
      : "Sierra Trail Masters");
  const placeholderLead =
    variant === "confirmed" ? "2 dias" : "3 dias";

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border border-uptempo-outline-variant/15 p-8 lg:col-span-6 ${
        variant === "confirmed"
          ? "bg-uptempo-surface-container-low"
          : "bg-uptempo-surface-container-lowest"
      }`}
    >
      <div>
        <div className="mb-6 flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${
              variant === "confirmed"
                ? "bg-uptempo-surface-container-lowest"
                : "bg-[#c5e7ff]"
            }`}
          >
            {icon}
          </div>
          {pill}
        </div>
        <h3 className="mb-2 font-uptempo-headline text-2xl font-black text-uptempo-secondary">
          {title}
        </h3>
        <p className="mb-6 text-sm text-uptempo-on-surface-variant">
          {event ? (
            <>
              {event.desks.length}{" "}
              {event.desks.length === 1
                ? "guichê ativo"
                : "guichês ativos"}
            </>
          ) : (
            <>
              Começa em{" "}
              <span className="font-bold text-uptempo-primary">
                {placeholderLead}
              </span>
            </>
          )}
        </p>
      </div>
      <div className="flex items-center justify-end border-t border-slate-200 pt-6">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-200">
            <Image
              src={TEAM_A}
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-200">
            <Image
              src={TEAM_B}
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-uptempo-primary-container text-[10px] font-bold text-white">
            {event && event.desks.length > 2
              ? `+${event.desks.length - 2}`
              : variant === "confirmed"
                ? "+12"
                : "+5"}
          </div>
        </div>
      </div>
    </div>
  );
}
