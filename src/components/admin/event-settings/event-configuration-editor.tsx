"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  addEventStaffAction,
  createEventAction,
  removeEventStaffAction,
  syncDesksAction,
  syncKitTypesAction,
  syncRacesAction,
  updateEventCoreAction,
  updateEventImportRulesAction,
  type DeskDraftInput,
  type KitTypeDraftInput,
  type RaceDraftInput,
} from "@/lib/actions/event-settings-actions";
import {
  type EventImportRulesState,
  type ImportColumnMode,
  IMPORT_FIELD_KEYS,
} from "@/lib/event-import-rules";
import { DEFAULT_KIT_SHIRT_ITEM_LABEL } from "@/lib/kit-architecture";
import type {
  DeskSettingsRow,
  EventSettingsRow,
  EventStaffSettingsRow,
  KitItemSettingsRow,
  KitTypeSettingsRow,
  RaceSettingsRow,
} from "@/lib/queries/event-settings";
import {
  adminEventImportPath,
  adminEventsPath,
  adminEventSettingsPath,
  adminEventStatsPath,
} from "@/lib/routes";
import type { EventStatus } from "@/lib/supabase/types";
import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";
import { PillButton } from "@/components/candy/pill-button";

const inputClass =
  "w-full rounded-candy border border-candy-outline/25 bg-white/90 px-3 py-2 text-sm text-candy-ink shadow-candy-card-soft placeholder:text-candy-muted/55 focus:border-candy-primary focus:outline-none focus:ring-2 focus:ring-candy-primary/25";

const selectClass = inputClass;

const IMPORT_LABELS: Record<(typeof IMPORT_FIELD_KEYS)[number], string> = {
  bib_number: "Peito (bib_number)",
  full_name: "Nome completo",
  sex: "Sexo",
  race_id: "Modalidade (nome cadastrado na prova)",
  document_id: "Documento",
  team: "Equipe",
  birth_date: "Data de nascimento",
  age_group: "Faixa etária (grava em metadata)",
  registration_proof_code: "Comprovante de inscrição",
  kit_type: "Kit (nome em kit_types)",
  shirt_size: "Tamanho da camisa",
};

function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function dateOnlyFromIsoOrDate(value: string | null | undefined): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return value.trim();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function statusLabelPt(status: EventStatus): string {
  const m: Record<EventStatus, string> = {
    draft: "Rascunho",
    active: "Ativo",
    closed: "Encerrado",
  };
  return m[status];
}

function categoryPreview(name: string, distanceKm: string, wave: string): string {
  if (distanceKm.trim()) {
    const n = Math.round(Number(distanceKm.replace(",", ".")));
    if (!Number.isNaN(n)) return `${n}K`;
  }
  if (wave.trim()) return wave.trim().toUpperCase();
  return "—";
}

export type EventConfigurationEditorProps = {
  mode: "create" | "edit";
  eventParam: string;
  initialEvent: EventSettingsRow | null;
  initialImportRules: EventImportRulesState;
  initialRaces: RaceSettingsRow[];
  initialDesks: DeskSettingsRow[];
  initialKitTypes: KitTypeSettingsRow[];
  initialKitItems: KitItemSettingsRow[];
  initialStaff: EventStaffSettingsRow[];
  loadError: string | null;
};

type LocalRace = RaceDraftInput & { clientKey: string };

type LocalDesk = DeskDraftInput & { clientKey: string };

type LocalKitType = KitTypeDraftInput & { clientKey: string };

function kitsToLocal(rows: KitTypeSettingsRow[]): LocalKitType[] {
  return rows.map((k) => ({
    clientKey: k.id,
    id: k.id,
    name: k.name,
  }));
}

function desksToLocal(rows: DeskSettingsRow[]): LocalDesk[] {
  return rows.map((d) => ({
    clientKey: d.id,
    id: d.id,
    label: d.label,
    externalKey: d.external_key?.trim() ?? "",
    isActive: d.is_active,
  }));
}

function racesToLocal(rows: RaceSettingsRow[]): LocalRace[] {
  return rows.map((r) => ({
    clientKey: r.id,
    id: r.id,
    name: r.name,
    distanceKm: r.distance_km != null ? String(r.distance_km) : "",
    wave: r.wave ?? "",
  }));
}

export function EventConfigurationEditor({
  mode,
  eventParam,
  initialEvent,
  initialImportRules,
  initialRaces,
  initialDesks,
  initialKitTypes,
  initialKitItems,
  initialStaff,
  loadError,
}: EventConfigurationEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const [name, setName] = useState(initialEvent?.name ?? "");
  const [slug, setSlug] = useState(initialEvent?.slug ?? "");
  const [status, setStatus] = useState<EventStatus>(initialEvent?.status ?? "draft");
  const [eventDate, setEventDate] = useState(
    dateOnlyFromIsoOrDate(initialEvent?.event_date ?? null),
  );
  const [startsAt, setStartsAt] = useState(
    isoToDatetimeLocal(initialEvent?.starts_at ?? null),
  );
  const [endsAt, setEndsAt] = useState(isoToDatetimeLocal(initialEvent?.ends_at ?? null));

  const [races, setRaces] = useState<LocalRace[]>(() =>
    mode === "edit" && initialRaces.length
      ? racesToLocal(initialRaces)
      : [],
  );

  const [desks, setDesks] = useState<LocalDesk[]>(() =>
    mode === "edit" && initialDesks.length
      ? desksToLocal(initialDesks)
      : [],
  );

  const [kitTypes, setKitTypes] = useState<LocalKitType[]>(() =>
    mode === "edit" ? kitsToLocal(initialKitTypes) : [],
  );

  const [staff, setStaff] = useState<EventStaffSettingsRow[]>(initialStaff);
  const [staffEmailInput, setStaffEmailInput] = useState("");

  const [importRules, setImportRules] =
    useState<EventImportRulesState>(initialImportRules);

  useEffect(() => {
    setImportRules(initialImportRules);
  }, [initialImportRules]);

  useEffect(() => {
    if (!initialEvent) return;
    setName(initialEvent.name);
    setSlug(initialEvent.slug ?? "");
    setStatus(initialEvent.status);
    setEventDate(dateOnlyFromIsoOrDate(initialEvent.event_date));
    setStartsAt(isoToDatetimeLocal(initialEvent.starts_at));
    setEndsAt(isoToDatetimeLocal(initialEvent.ends_at));
  }, [initialEvent]);

  useEffect(() => {
    if (mode === "edit") {
      setRaces(racesToLocal(initialRaces));
    }
  }, [mode, initialRaces]);

  useEffect(() => {
    if (mode === "edit") {
      setDesks(desksToLocal(initialDesks));
    }
  }, [mode, initialDesks]);

  useEffect(() => {
    if (mode === "edit") {
      setKitTypes(kitsToLocal(initialKitTypes));
    }
  }, [mode, initialKitTypes]);

  useEffect(() => {
    setStaff(initialStaff);
  }, [initialStaff]);

  const eventId = initialEvent?.id ?? null;
  const linkKey = useMemo(
    () => (initialEvent ? (initialEvent.slug?.trim() || initialEvent.id) : eventParam),
    [initialEvent, eventParam],
  );

  const kitItemsByTypeId = useMemo(() => {
    const m = new Map<string, KitItemSettingsRow[]>();
    for (const it of initialKitItems) {
      const list = m.get(it.kit_type_id) ?? [];
      list.push(it);
      m.set(it.kit_type_id, list);
    }
    for (const [, list] of m) {
      list.sort((a, b) => a.label.localeCompare(b.label, "pt"));
    }
    return m;
  }, [initialKitItems]);

  const flash = useCallback((type: "ok" | "err", text: string) => {
    setBanner({ type, text });
    if (type === "ok") {
      window.setTimeout(() => setBanner(null), 4000);
    }
  }, []);

  const saveGeneral = () => {
    if (!eventId) return;
    startTransition(async () => {
      const r = await updateEventCoreAction({
        eventId,
        name,
        slug,
        eventDate,
        startsAtLocal: startsAt,
        endsAtLocal: endsAt,
        status,
      });
      if (r.ok) {
        flash("ok", "Informações salvas.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const saveRaces = () => {
    if (!eventId) return;
    startTransition(async () => {
      const r = await syncRacesAction({
        eventId,
        races: races.map(({ id, name: n, distanceKm, wave }) => ({
          id,
          name: n,
          distanceKm,
          wave,
        })),
      });
      if (r.ok) {
        flash("ok", "Modalidades salvas.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const saveDesks = () => {
    if (!eventId) return;
    startTransition(async () => {
      const r = await syncDesksAction({
        eventId,
        desks: desks.map(({ id, label, externalKey, isActive }) => ({
          id,
          label,
          externalKey,
          isActive,
        })),
      });
      if (r.ok) {
        flash("ok", "Guichês salvos.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const saveKitTypes = () => {
    if (!eventId) return;
    startTransition(async () => {
      const r = await syncKitTypesAction({
        eventId,
        kitTypes: kitTypes.map(({ id, name: n }) => ({ id, name: n })),
      });
      if (r.ok) {
        flash("ok", "Tipos de kit salvos.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const saveImportRules = () => {
    if (!eventId) return;
    startTransition(async () => {
      const r = await updateEventImportRulesAction({ eventId, rules: importRules });
      if (r.ok) {
        flash("ok", "Regras salvas em event_required_fields.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const addRace = () => {
    setRaces((prev) => [
      ...prev,
      {
        clientKey: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: "",
        distanceKm: "",
        wave: "",
      },
    ]);
  };

  const removeRace = (clientKey: string) => {
    setRaces((prev) => prev.filter((x) => x.clientKey !== clientKey));
  };

  const updateRace = (clientKey: string, patch: Partial<RaceDraftInput>) => {
    setRaces((prev) =>
      prev.map((x) => (x.clientKey === clientKey ? { ...x, ...patch } : x)),
    );
  };

  const addDesk = () => {
    setDesks((prev) => [
      ...prev,
      {
        clientKey: `new-desk-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        label: "",
        externalKey: "",
        isActive: true,
      },
    ]);
  };

  const removeDesk = (clientKey: string) => {
    setDesks((prev) => prev.filter((x) => x.clientKey !== clientKey));
  };

  const updateDesk = (clientKey: string, patch: Partial<DeskDraftInput>) => {
    setDesks((prev) =>
      prev.map((x) => (x.clientKey === clientKey ? { ...x, ...patch } : x)),
    );
  };

  const addKitType = () => {
    setKitTypes((prev) => [
      ...prev,
      {
        clientKey: `new-kit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: "",
      },
    ]);
  };

  const removeKitType = (clientKey: string) => {
    setKitTypes((prev) => prev.filter((x) => x.clientKey !== clientKey));
  };

  const updateKitType = (clientKey: string, patch: Partial<KitTypeDraftInput>) => {
    setKitTypes((prev) =>
      prev.map((x) => (x.clientKey === clientKey ? { ...x, ...patch } : x)),
    );
  };

  const addStaffMember = () => {
    if (!eventId) return;
    const email = staffEmailInput.trim();
    if (!email) {
      flash("err", "Informe o e-mail do usuário.");
      return;
    }
    startTransition(async () => {
      const r = await addEventStaffAction({ eventId, email });
      if (r.ok) {
        setStaffEmailInput("");
        flash("ok", "Usuário adicionado à equipe de entrega.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const removeStaffMember = (row: EventStaffSettingsRow) => {
    if (!eventId) return;
    startTransition(async () => {
      const r = await removeEventStaffAction({
        staffRowId: row.id,
        eventId,
      });
      if (r.ok) {
        flash("ok", "Removido da equipe.");
        router.refresh();
      } else {
        flash("err", r.error);
      }
    });
  };

  const createFull = () => {
    if (mode !== "create") return;
    startTransition(async () => {
      const created = await createEventAction({
        name,
        slug,
        eventDate,
        startsAtLocal: startsAt,
        endsAtLocal: endsAt,
        status,
        importRules,
      });
      if (!created.ok) {
        flash("err", created.error);
        return;
      }
      const newId = created.eventId;
      const raceSync = await syncRacesAction({
        eventId: newId,
        races: races.map(({ id, name: n, distanceKm, wave }) => ({
          id,
          name: n,
          distanceKm,
          wave,
        })),
      });
      if (!raceSync.ok) {
        flash("err", `Evento criado, mas modalidades falharam: ${raceSync.error}`);
        router.push(adminEventsPath());
        router.refresh();
        return;
      }
      const deskSync = await syncDesksAction({
        eventId: newId,
        desks: desks.map(({ id, label, externalKey, isActive }) => ({
          id,
          label,
          externalKey,
          isActive,
        })),
      });
      if (!deskSync.ok) {
        flash("err", `Evento criado, mas guichês falharam: ${deskSync.error}`);
        router.push(adminEventsPath());
        router.refresh();
        return;
      }
      const kitSync = await syncKitTypesAction({
        eventId: newId,
        kitTypes: kitTypes.map(({ id, name: n }) => ({ id, name: n })),
      });
      if (!kitSync.ok) {
        flash("err", `Evento criado, mas tipos de kit falharam: ${kitSync.error}`);
        router.push(adminEventsPath());
        router.refresh();
        return;
      }
      const emails = staffEmailInput
        .split(/[\s,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const email of emails) {
        const ar = await addEventStaffAction({ eventId: newId, email });
        if (!ar.ok) {
          flash("err", `Evento criado; falha ao adicionar ${email}: ${ar.error}`);
          router.push(adminEventsPath());
          router.refresh();
          return;
        }
      }
      flash("ok", "Prova criada.");
      router.push(adminEventsPath());
      router.refresh();
    });
  };

  const setImportMode = (key: (typeof IMPORT_FIELD_KEYS)[number], m: ImportColumnMode) => {
    if (key === "bib_number" && m !== "required") return;
    if (key === "full_name" && m !== "required") return;
    if (key === "sex" && m !== "required") return;
    if (key === "race_id" && m !== "required") return;
    setImportRules((prev) => ({ ...prev, [key]: m }));
  };

  const title = mode === "create" ? "Nova prova" : "Configuração da prova";

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <div className="flex flex-col gap-4 border-b border-candy-outline/12 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-candy-muted">
          KitRunner Admin · {title}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-candy-ink sm:text-3xl">
            {title}
          </h1>
          <span className="rounded-candy-pill border border-candy-outline/20 bg-candy-container-low/60 px-3 py-1 font-mono text-xs text-candy-muted">
            {eventParam}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <Link
            href={adminEventsPath()}
            className="text-candy-secondary underline-offset-4 hover:underline"
          >
            ← Eventos
          </Link>
          {mode === "edit" && initialEvent ? (
            <>
              <span className="text-candy-outline">·</span>
              <Link
                href={adminEventStatsPath(linkKey)}
                className="text-candy-secondary underline-offset-4 hover:underline"
              >
                Estatísticas
              </Link>
              <span className="text-candy-outline">·</span>
              <Link
                href={adminEventImportPath(linkKey)}
                className="text-candy-secondary underline-offset-4 hover:underline"
              >
                Importar
              </Link>
            </>
          ) : null}
        </div>
      </div>

      {banner ? (
        <div
          className={
            banner.type === "ok"
              ? "rounded-candy border border-candy-secondary/35 bg-candy-secondary/10 px-4 py-3 text-sm font-medium text-candy-ink"
              : "rounded-candy border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-900"
          }
        >
          {banner.text}
        </div>
      ) : null}

      {loadError ? (
        <CandyCard className="border-candy-primary/25 bg-candy-primary/5 p-5">
          <p className="text-sm font-semibold text-candy-ink">{loadError}</p>
        </CandyCard>
      ) : null}

      {mode === "create" || initialEvent ? (
        <>
          <CandyCard elevation="lg" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-candy-outline/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-candy bg-candy-primary/12 text-candy-primary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </span>
                <CandySectionTitle className="!tracking-[0.12em]">
                  Informações gerais
                </CandySectionTitle>
              </div>
              {mode === "edit" ? (
                <PillButton
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={pending || !eventId}
                  onClick={saveGeneral}
                >
                  Salvar informações
                </PillButton>
              ) : null}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  Nome da prova
                </span>
                <input
                  className={`${inputClass} mt-1.5`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Corrida da Cidade 2026"
                  autoComplete="off"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  Slug (URL){mode === "create" ? " — opcional; geramos a partir do nome se vazio" : ""}
                </span>
                <input
                  className={`${inputClass} mt-1.5 font-mono text-xs`}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex.: corrida-cidade-2026"
                  autoComplete="off"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  Status
                </span>
                <select
                  className={`${selectClass} mt-1.5`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                >
                  <option value="draft">{statusLabelPt("draft")}</option>
                  <option value="active">{statusLabelPt("active")}</option>
                  <option value="closed">{statusLabelPt("closed")}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  Data da prova
                </span>
                <input
                  type="date"
                  className={`${inputClass} mt-1.5`}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  Início da retirada de kit
                </span>
                <input
                  type="datetime-local"
                  className={`${inputClass} mt-1.5`}
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  Fim da retirada de kit
                </span>
                <input
                  type="datetime-local"
                  className={`${inputClass} mt-1.5`}
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </label>
            </div>
            <p className="mt-4 text-[11px] text-candy-muted">
              Datas e horários usam o fuso do seu navegador e são gravados em ISO no Supabase.
            </p>
          </CandyCard>

          <CandyCard elevation="lg" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-candy-outline/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-candy bg-candy-secondary/12 text-candy-secondary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </span>
                <CandySectionTitle className="!tracking-[0.12em]">
                  Modalidades
                </CandySectionTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <PillButton type="button" variant="secondary" size="sm" onClick={addRace}>
                  Adicionar modalidade
                </PillButton>
                {mode === "edit" ? (
                  <PillButton
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={pending || !eventId}
                    onClick={saveRaces}
                  >
                    Salvar modalidades
                  </PillButton>
                ) : null}
              </div>
            </div>
            {races.length === 0 ? (
              <p className="mt-6 text-sm text-candy-muted">
                Nenhuma modalidade. Adicione distâncias ou provas (ex.: 5K, 10K, 21K).
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {races.map((race) => (
                  <li
                    key={race.clientKey}
                    className="rounded-candy border border-candy-outline/12 bg-candy-container-low/40 p-4"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3">
                        <label className="block sm:col-span-1">
                          <span className="text-[10px] font-bold uppercase text-candy-muted">
                            Nome
                          </span>
                          <input
                            className={`${inputClass} mt-1`}
                            value={race.name}
                            onChange={(e) =>
                              updateRace(race.clientKey, { name: e.target.value })
                            }
                            placeholder="Ex.: 10 km"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase text-candy-muted">
                            Distância (km)
                          </span>
                          <input
                            className={`${inputClass} mt-1`}
                            value={race.distanceKm}
                            onChange={(e) =>
                              updateRace(race.clientKey, { distanceKm: e.target.value })
                            }
                            placeholder="10"
                            inputMode="decimal"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-bold uppercase text-candy-muted">
                            Largada / wave
                          </span>
                          <input
                            className={`${inputClass} mt-1`}
                            value={race.wave}
                            onChange={(e) =>
                              updateRace(race.clientKey, { wave: e.target.value })
                            }
                            placeholder="Opcional"
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRace(race.clientKey)}
                        className="shrink-0 rounded-candy border border-red-500/25 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-500/10"
                      >
                        Remover
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-candy-muted">
                      Prévia de código:{" "}
                      <span className="font-mono font-semibold text-candy-secondary">
                        {categoryPreview(race.name, race.distanceKm, race.wave)}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CandyCard>

          <CandyCard elevation="lg" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-candy-outline/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-candy bg-candy-tertiary/12 text-candy-tertiary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M3 5v14h18V5H3zm2 2h14v4H5V7zm0 6h6v3H5v-3zm8 0h6v3h-6v-3z" />
                  </svg>
                </span>
                <CandySectionTitle className="!tracking-[0.12em]">
                  Guichês
                </CandySectionTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <PillButton type="button" variant="secondary" size="sm" onClick={addDesk}>
                  Adicionar guichê
                </PillButton>
                {mode === "edit" ? (
                  <PillButton
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={pending || !eventId}
                    onClick={saveDesks}
                  >
                    Salvar guichês
                  </PillButton>
                ) : null}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-candy-muted">
              Cada guichê aparece na área da equipe para abrir o console de atendimento. A{" "}
              <strong className="font-semibold text-candy-ink">chave de URL</strong> é opcional:
              use um slug curto (ex.: <span className="font-mono text-xs">retirada-1</span>) para
              links amigáveis; se ficar vazio, o sistema usa o ID do guichê na rota.
            </p>
            {desks.length === 0 ? (
              <p className="mt-6 text-sm text-candy-muted">
                Nenhum guichê. Adicione ao menos um para a equipe poder escolher o posto em{" "}
                <span className="font-medium text-candy-ink">Eventos</span>.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {desks.map((desk, idx) => (
                  <li
                    key={desk.clientKey}
                    className="rounded-candy border border-candy-outline/12 bg-candy-container-low/40 p-4"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-12">
                        <label className="block sm:col-span-5">
                          <span className="text-[10px] font-bold uppercase text-candy-muted">
                            Nome do guichê
                          </span>
                          <input
                            className={`${inputClass} mt-1`}
                            value={desk.label}
                            onChange={(e) =>
                              updateDesk(desk.clientKey, { label: e.target.value })
                            }
                            placeholder={`Ex.: Guichê ${idx + 1}`}
                          />
                        </label>
                        <label className="block sm:col-span-4">
                          <span className="text-[10px] font-bold uppercase text-candy-muted">
                            Chave de URL (opcional)
                          </span>
                          <input
                            className={`${inputClass} mt-1 font-mono text-xs`}
                            value={desk.externalKey}
                            onChange={(e) =>
                              updateDesk(desk.clientKey, { externalKey: e.target.value })
                            }
                            placeholder="ex.: retirada-norte"
                            autoComplete="off"
                          />
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 sm:col-span-3 sm:pt-6">
                          <input
                            type="checkbox"
                            checked={desk.isActive}
                            onChange={(e) =>
                              updateDesk(desk.clientKey, { isActive: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-candy-outline/40 text-candy-primary focus:ring-candy-primary/30"
                          />
                          <span className="text-sm font-medium text-candy-ink">Ativo</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDesk(desk.clientKey)}
                        className="shrink-0 rounded-candy border border-red-500/25 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-500/10"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CandyCard>

          <CandyCard elevation="lg" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-candy-outline/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-candy bg-candy-tertiary/12 text-candy-tertiary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-.9-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z" />
                  </svg>
                </span>
                <CandySectionTitle className="!tracking-[0.12em]">
                  Arquitetura de kits
                </CandySectionTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <PillButton type="button" variant="secondary" size="sm" onClick={addKitType}>
                  Adicionar tipo de kit
                </PillButton>
                {mode === "edit" ? (
                  <PillButton
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={pending || !eventId}
                    onClick={saveKitTypes}
                  >
                    Salvar kits
                  </PillButton>
                ) : null}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-candy-muted">
              Cadastre os <strong className="font-semibold text-candy-ink">nomes</strong> dos tipos de
              kit (<span className="font-mono text-xs">kit_types</span>). Ao salvar, cada kit recebe
              automaticamente o item <strong className="font-semibold text-candy-ink">Camisa</strong>{" "}
              (<span className="font-mono text-xs">kit_items</span>), para alinhar com o campo de
              importação <span className="font-mono text-xs">shirt_size</span> (tamanho da camisa).
              O <span className="font-mono text-xs">kit_type</span> na planilha deve repetir o nome
              cadastrado aqui.
            </p>
            {kitTypes.length === 0 ? (
              <p className="mt-6 text-sm text-candy-muted">
                Nenhum tipo de kit. Adicione pelo menos um se quiser vincular inscrições a um kit na
                importação.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {kitTypes.map((kit) => (
                  <li
                    key={kit.clientKey}
                    className="rounded-candy border border-candy-outline/12 bg-candy-container-low/40 p-4"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <label className="block min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase text-candy-muted">
                          Nome do kit
                        </span>
                        <input
                          className={`${inputClass} mt-1`}
                          value={kit.name}
                          onChange={(e) =>
                            updateKitType(kit.clientKey, { name: e.target.value })
                          }
                          placeholder="Ex.: Kit premium, Kit infantil"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeKitType(kit.clientKey)}
                        className="shrink-0 rounded-candy border border-red-500/25 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-500/10"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="mt-3 border-t border-candy-outline/10 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-candy-muted">
                        Itens do kit
                      </p>
                      {kit.id ? (
                        (kitItemsByTypeId.get(kit.id) ?? []).length > 0 ? (
                          <ul className="mt-1 list-inside list-disc text-sm text-candy-ink">
                            {(kitItemsByTypeId.get(kit.id) ?? []).map((item) => (
                              <li key={item.id}>{item.label}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm italic text-candy-muted">
                            {DEFAULT_KIT_SHIRT_ITEM_LABEL} — criado ao salvar os kits
                          </p>
                        )
                      ) : (
                        <p className="mt-1 text-sm italic text-candy-muted">
                          {DEFAULT_KIT_SHIRT_ITEM_LABEL} — criado ao salvar os kits
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CandyCard>

          <CandyCard elevation="lg" className="p-6 sm:p-8">
            <div className="flex items-center gap-2 border-b border-candy-outline/10 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-candy bg-candy-secondary/12 text-candy-secondary">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </span>
              <CandySectionTitle className="!tracking-[0.12em]">
                Equipe de entrega
              </CandySectionTitle>
            </div>
            <p className="mt-4 text-sm text-candy-muted">
              Busca o usuário no Supabase Auth pelo <strong className="font-semibold text-candy-ink">e-mail</strong> da
              conta (o mesmo usado no cadastro em Cadastro equipe). Exige{" "}
              <code className="rounded bg-candy-container-low px-1 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> no
              servidor.
            </p>
            {mode === "create" ? (
              <p className="mt-2 text-xs font-medium text-amber-800">
                Ao criar a prova, você pode colar um ou mais e-mails separados por espaço, vírgula ou
                ponto e vírgula; todos serão vinculados após o evento ser salvo.
              </p>
            ) : null}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
                  E-mail do usuário (Auth)
                </span>
                <input
                  type="email"
                  autoComplete="off"
                  className={`${inputClass} mt-1.5`}
                  value={staffEmailInput}
                  onChange={(e) => setStaffEmailInput(e.target.value)}
                  placeholder="nome@exemplo.com"
                />
              </label>
              {mode === "edit" ? (
                <PillButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={pending || !eventId}
                  onClick={addStaffMember}
                >
                  Adicionar
                </PillButton>
              ) : null}
            </div>
            <ul className="mt-6 divide-y divide-candy-outline/10 rounded-candy border border-candy-outline/12">
              {staff.length === 0 ? (
                <li className="px-4 py-6 text-sm text-candy-muted">
                  {mode === "edit"
                    ? "Nenhum membro vinculado ainda."
                    : "Nenhum membro — adicione e-mails antes de criar (opcional)."}
                </li>
              ) : (
                staff.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-candy-ink">
                        {row.email?.trim() ? row.email : "—"}
                      </p>
                      <p className="font-mono text-[11px] text-candy-muted">{row.user_id}</p>
                    </div>
                    {mode === "edit" ? (
                      <button
                        type="button"
                        onClick={() => removeStaffMember(row)}
                        disabled={pending}
                        className="rounded-candy border border-candy-outline/20 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-500/10"
                      >
                        Remover
                      </button>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </CandyCard>

          <CandyCard elevation="lg" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-candy-outline/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-candy bg-candy-primary/12 text-candy-primary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                  </svg>
                </span>
                <CandySectionTitle className="!tracking-[0.12em]">
                  Regras de importação (CSV)
                </CandySectionTitle>
              </div>
              {mode === "edit" ? (
                <PillButton
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={pending || !eventId}
                  onClick={saveImportRules}
                >
                  Salvar regras
                </PillButton>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-candy-muted">
              Gravado na tabela <code className="rounded bg-candy-container-low px-1 text-xs">event_required_fields</code>
              . Cada coluna do CSV pode ser obrigatória, opcional ou ignorada na importação.{" "}
              <strong className="font-semibold text-candy-ink">Peito</strong>,{" "}
              <strong className="font-semibold text-candy-ink">nome completo</strong>,{" "}
              <strong className="font-semibold text-candy-ink">sexo</strong> e{" "}
              <strong className="font-semibold text-candy-ink">modalidade</strong> são sempre
              obrigatórios. O texto de busca é gerado na importação (sem coluna na planilha). A coluna
              de modalidade deve trazer o <strong className="font-semibold text-candy-ink">nome</strong>{" "}
              da prova cadastrada. Ao criar uma prova nova, essas linhas são criadas com os valores
              escolhidos.
            </p>
            <div className="mt-6 overflow-x-auto rounded-candy border border-candy-outline/12">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-candy-outline/10 bg-candy-container-low/50 text-xs font-bold uppercase tracking-wide text-candy-muted">
                  <tr>
                    <th className="px-4 py-3">Campo</th>
                    <th className="px-4 py-3">Regra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-candy-outline/10">
                  {IMPORT_FIELD_KEYS.map((key) => (
                    <tr key={key}>
                      <td className="px-4 py-3 font-mono text-xs text-candy-ink">
                        {IMPORT_LABELS[key]}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className={selectClass}
                          value={importRules[key]}
                          disabled={
                            key === "bib_number" ||
                            key === "full_name" ||
                            key === "sex" ||
                            key === "race_id"
                          }
                          onChange={(e) =>
                            setImportMode(key, e.target.value as ImportColumnMode)
                          }
                        >
                          <option value="required">Obrigatória</option>
                          <option value="optional">Opcional</option>
                          <option value="off">Ignorar</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {mode === "edit" && initialEvent ? (
              <Link
                href={adminEventImportPath(linkKey)}
                className="mt-6 inline-flex text-sm font-semibold text-candy-secondary underline-offset-4 hover:underline"
              >
                Ir para importação de participantes →
              </Link>
            ) : null}
          </CandyCard>

          {mode === "create" ? (
            <div className="flex flex-wrap justify-end gap-3 border-t border-candy-outline/12 pt-6">
              <PillButton
                type="button"
                variant="primary"
                size="lg"
                disabled={pending}
                onClick={createFull}
              >
                Criar prova
              </PillButton>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
