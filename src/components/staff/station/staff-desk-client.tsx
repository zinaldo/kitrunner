"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { CandyCard } from "@/components/candy/candy-card";
import { PillButton } from "@/components/candy/pill-button";
import { ParticipantEditModal } from "@/components/staff/station/participant-edit-modal";
import { StaffStationWorkspace } from "@/components/staff/station/staff-station-workspace";
import { confirmDeliveryAction } from "@/lib/actions/confirm-delivery";
import { projectToTvAction } from "@/lib/actions/project-to-tv";
import { searchRegistrationsAction } from "@/lib/actions/search-registrations";
import type { SearchRegistrationRow } from "@/lib/queries/search-registrations";
import {
  mapSearchRowToStationParticipant,
  type StationParticipantContext,
} from "@/lib/staff/map-registration-to-station";

function kitStatusLabelPt(status: string): string {
  switch (status) {
    case "pending":
      return "pendente";
    case "at_desk":
      return "no guichê";
    case "delivered":
      return "entregue";
    default:
      return status;
  }
}

type DeskSelectOption = { id: string; name: string };

type StaffDeskClientProps = {
  eventId: string;
  deskId: string;
  eventParam: string;
  eventName: string;
  deskLabel: string;
  participantContext: StationParticipantContext;
  raceOptions: DeskSelectOption[];
  kitTypeOptions: DeskSelectOption[];
};

export function StaffDeskClient({
  eventId,
  deskId,
  eventParam,
  eventName,
  deskLabel,
  participantContext,
  raceOptions,
  kitTypeOptions,
}: StaffDeskClientProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRegistrationRow[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SearchRegistrationRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [searchPending, startSearchTransition] = useTransition();
  const [projectPending, startProjectTransition] = useTransition();
  const [confirmPending, startConfirmTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const participant = useMemo(
    () =>
      selected
        ? mapSearchRowToStationParticipant(selected, participantContext)
        : null,
    [selected, participantContext],
  );

  const runSearch = useCallback(() => {
    setSearchError(null);
    startSearchTransition(async () => {
      const res = await searchRegistrationsAction(eventId, query);
      if (!res.ok) {
        setResults([]);
        setSearchError(res.error);
        return;
      }
      setResults(res.rows);
    });
  }, [eventId, query]);

  const onProjectToTv = useCallback(() => {
    if (!selected) return;
    setActionError(null);
    startProjectTransition(async () => {
      const res = await projectToTvAction({
        eventId,
        deskId,
        registrationId: selected.id,
      });
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
    });
  }, [deskId, eventId, selected]);

  const onConfirmDelivery = useCallback(() => {
    if (!selected) return;
    setActionError(null);
    startConfirmTransition(async () => {
      const res = await confirmDeliveryAction({
        registrationId: selected.id,
        deskId,
      });
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
      setSelected((prev) =>
        prev && prev.id === selected.id
          ? { ...prev, kit_status: "delivered" }
          : prev,
      );
    });
  }, [deskId, selected]);

  const onParticipantSaved = useCallback((row: SearchRegistrationRow) => {
    setSelected(row);
    setResults((prev) =>
      prev.map((r) => (r.id === row.id ? row : r)),
    );
  }, []);

  const searchSlot = (
    <CandyCard elevation="md" className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-candy-muted">
        Buscar participante
      </p>
      <p className="mt-1 text-sm text-candy-muted">
        Nome, número de peito, documento ou comprovante — usa{" "}
        <code className="rounded bg-candy-container-low px-1 text-candy-ink">
          search_text
        </code>
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
          placeholder="Buscar…"
          className="w-full flex-1 rounded-candy border border-candy-outline/25 bg-white/90 px-4 py-2.5 text-sm text-candy-ink placeholder:text-candy-muted/60 focus:border-candy-primary focus:outline-none focus:ring-2 focus:ring-candy-primary/30"
        />
        <PillButton
          type="button"
          variant="secondary"
          className="shrink-0"
          disabled={searchPending}
          onClick={runSearch}
        >
          {searchPending ? "Buscando…" : "Buscar"}
        </PillButton>
      </div>
      {searchError ? (
        <p className="mt-3 text-sm font-medium text-red-600">{searchError}</p>
      ) : null}
      {results.length > 0 ? (
        <ul className="mt-4 max-h-56 divide-y divide-candy-outline/15 overflow-auto rounded-candy border border-candy-outline/15 bg-candy-container-low/40">
          {results.map((row) => {
            const active = selected?.id === row.id;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(row);
                    setActionError(null);
                  }}
                  className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition hover:bg-white/80 ${
                    active ? "bg-candy-primary/10" : ""
                  }`}
                >
                  <span className="font-semibold text-candy-ink">
                    {row.full_name}{" "}
                    <span className="font-mono text-candy-primary">
                      #{row.bib_number}
                    </span>
                  </span>
                  <span className="text-xs text-candy-muted">
                    {row.races?.name ?? "Prova —"}{" "}
                    {row.races?.wave ? `· ${row.races.wave}` : ""} ·{" "}
                    {kitStatusLabelPt(row.kit_status)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </CandyCard>
  );

  return (
    <>
      <StaffStationWorkspace
        eventParam={eventParam}
        eventName={eventName}
        deskLabel={deskLabel}
        participant={participant}
        searchSlot={searchSlot}
        editPillProps={{
          onClick: () => setEditOpen(true),
          disabled: !selected,
        }}
        tertiaryPillProps={{
          onClick: onProjectToTv,
          disabled: !selected || projectPending,
          children: projectPending ? "Enviando…" : "Enviar para a TV",
        }}
        participantCardProps={{
          onConfirmDelivery: selected ? onConfirmDelivery : undefined,
          isConfirming: confirmPending,
          confirmDisabled:
            !selected ||
            selected.kit_status === "delivered",
        }}
      />
      {actionError ? (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          {actionError}
        </p>
      ) : null}
      <ParticipantEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        eventId={eventId}
        row={selected}
        raceOptions={raceOptions}
        kitTypeOptions={kitTypeOptions}
        onSaved={onParticipantSaved}
      />
    </>
  );
}
