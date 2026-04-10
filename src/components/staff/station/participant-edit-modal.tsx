"use client";

import { useEffect, useState, useTransition } from "react";
import { CandyCard } from "@/components/candy/candy-card";
import { PillButton } from "@/components/candy/pill-button";
import { updateRegistrationFromDeskAction } from "@/lib/actions/update-registration-from-desk";
import type { SearchRegistrationRow } from "@/lib/queries/search-registrations";

type DeskOption = { id: string; name: string };

function metaString(
  metadata: SearchRegistrationRow["metadata"],
  key: string,
): string {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "";
  }
  const v = (metadata as Record<string, unknown>)[key];
  return typeof v === "string" ? v : "";
}

type ParticipantEditModalProps = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  row: SearchRegistrationRow | null;
  raceOptions: DeskOption[];
  kitTypeOptions: DeskOption[];
  onSaved: (row: SearchRegistrationRow) => void;
};

export function ParticipantEditModal({
  open,
  onClose,
  eventId,
  row,
  raceOptions,
  kitTypeOptions,
  onSaved,
}: ParticipantEditModalProps) {
  const [fullName, setFullName] = useState("");
  const [bib, setBib] = useState("");
  const [sex, setSex] = useState("");
  const [team, setTeam] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [proof, setProof] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [raceId, setRaceId] = useState("");
  const [kitTypeId, setKitTypeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !row) return;
    setFullName(row.full_name);
    setBib(row.bib_number);
    setSex(row.sex ?? "");
    setTeam(row.team ?? "");
    setDocumentId(row.document_id ?? "");
    setProof(row.registration_proof_code ?? "");
    setBirthDate(row.birth_date?.slice(0, 10) ?? "");
    setShirtSize(row.shirt_size ?? "");
    setAgeGroup(metaString(row.metadata, "age_group"));
    setRaceId(row.race_id ?? "");
    setKitTypeId(row.kit_type_id ?? "");
    setError(null);
  }, [open, row]);

  if (!open) return null;

  const inputClass =
    "w-full rounded-candy border border-candy-outline/25 bg-white/90 px-3 py-2 text-sm text-candy-ink placeholder:text-candy-muted/60 focus:border-candy-primary focus:outline-none focus:ring-2 focus:ring-candy-primary/30";

  const onSubmit = () => {
    if (!row) return;
    setError(null);
    startTransition(async () => {
      const res = await updateRegistrationFromDeskAction({
        eventId,
        registrationId: row.id,
        full_name: fullName,
        bib_number: bib,
        sex,
        team,
        document_id: documentId,
        registration_proof_code: proof,
        birth_date: birthDate,
        shirt_size: shirtSize,
        age_group: ageGroup,
        race_id: raceId,
        kit_type_id: kitTypeId,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved(res.row);
      onClose();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-candy-ink/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="participant-edit-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <CandyCard
        elevation="lg"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="participant-edit-title"
          className="text-lg font-bold text-candy-ink"
        >
          Editar dados do atleta
        </h2>
        <p className="mt-1 text-sm text-candy-muted">
          Alterações entram na busca e na ficha do posto assim que salvar.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Nome completo
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Nº de peito
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={bib}
              onChange={(e) => setBib(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Sexo
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Equipe
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Documento
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Comprovante
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={proof}
              onChange={(e) => setProof(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Data de nascimento
            </span>
            <input
              type="date"
              className={`mt-1 ${inputClass}`}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Tamanho da camisa
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Faixa etária
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Modalidade
            </span>
            <select
              className={`mt-1 ${inputClass}`}
              value={raceId}
              onChange={(e) => setRaceId(e.target.value)}
            >
              <option value="">—</option>
              {raceOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-candy-muted">
              Tipo de kit
            </span>
            <select
              className={`mt-1 ${inputClass}`}
              value={kitTypeId}
              onChange={(e) => setKitTypeId(e.target.value)}
            >
              <option value="">—</option>
              {kitTypeOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <PillButton
            type="button"
            variant="primary"
            disabled={pending || !row}
            onClick={onSubmit}
          >
            {pending ? "Salvando…" : "Salvar"}
          </PillButton>
          <PillButton
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={onClose}
          >
            Cancelar
          </PillButton>
        </div>
      </CandyCard>
    </div>
  );
}
