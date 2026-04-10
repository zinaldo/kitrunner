"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import {
  importRegistrationsAction,
  type ImportRegistrationsResult,
} from "@/lib/actions/import-registrations-action";
import type { EventImportRulesState } from "@/lib/event-import-rules";
import { IMPORT_FIELD_KEYS } from "@/lib/event-import-rules";
import { adminEventSettingsPath } from "@/lib/routes";
import { PillButton } from "@/components/candy/pill-button";

const inputFileClass =
  "block w-full cursor-pointer rounded-candy border border-dashed border-candy-outline/35 bg-candy-container-low/40 px-4 py-8 text-center text-sm font-medium text-candy-ink file:mr-4 file:cursor-pointer file:rounded-candy file:border-0 file:bg-candy-secondary/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-candy-primary/40";

const RULE_LABEL: Record<string, string> = {
  required: "obrigatória",
  optional: "opcional",
  off: "ignorada",
};

type ImportParticipantsFormProps = {
  eventParam: string;
  eventName: string;
  importRules: EventImportRulesState;
  races: { id: string; name: string }[];
  kitTypes: { id: string; name: string }[];
};

export function ImportParticipantsForm({
  eventParam,
  eventName,
  importRules,
  races,
  kitTypes,
}: ImportParticipantsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportRegistrationsResult | null>(null);

  return (
    <div className="space-y-8">
      <section className="rounded-candy border border-candy-outline/15 bg-candy-surface/95 p-6 shadow-candy-card-soft">
        <h2 className="text-sm font-bold uppercase tracking-wide text-candy-muted">
          Regras ativas (CSV)
        </h2>
        <p className="mt-2 text-xs text-candy-muted">
          Vêm da tabela <code className="rounded bg-candy-container-low px-1">event_required_fields</code>{" "}
          (ajuste em{" "}
          <Link
            href={adminEventSettingsPath(eventParam)}
            className="font-semibold text-candy-secondary underline-offset-2 hover:underline"
          >
            Configuração da prova
          </Link>
          ). Ordem sugerida nas regras: peito, nome, sexo, modalidade, demais campos, kit e tamanho
          da camisa (opcionais). Cabeçalhos aceitos incluem{" "}
          <span className="font-mono">kit_type</span>,{" "}
          <span className="font-mono">shirt_size</span> e equivalentes como{" "}
          <span className="font-mono">tamanho_camisa</span>.
          O texto de busca é montado no servidor.
        </p>
        <ul className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
          {IMPORT_FIELD_KEYS.map((key) => (
            <li key={key} className="flex justify-between gap-2 font-mono">
              <span className="text-candy-ink">{key}</span>
              <span className="text-candy-muted">{RULE_LABEL[importRules[key]]}</span>
            </li>
          ))}
        </ul>
      </section>

      {races.length > 0 ? (
        <section className="rounded-candy border border-candy-outline/12 bg-candy-container-low/30 p-5 text-sm text-candy-ink">
          <p className="font-bold text-candy-secondary">Provas deste evento</p>
          <p className="mt-2 text-xs text-candy-muted">
            Na coluna de prova use o <strong className="text-candy-ink">nome da modalidade</strong>{" "}
            (igual ao cadastro), ex.: &quot;{races[0]?.name}&quot;. UUID ainda é aceito por
            compatibilidade.
          </p>
          <ul className="mt-3 max-h-32 list-inside list-disc overflow-y-auto text-xs text-candy-muted">
            {races.map((r) => (
              <li key={r.id}>
                <span className="font-semibold text-candy-ink">{r.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-candy border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950">
          Nenhuma modalidade cadastrada. Cadastre provas em{" "}
          <Link
            href={adminEventSettingsPath(eventParam)}
            className="font-semibold underline underline-offset-2"
          >
            Configuração
          </Link>{" "}
          para vincular inscrições a uma corrida.
        </p>
      )}

      {kitTypes.length > 0 ? (
        <section className="rounded-candy border border-candy-outline/12 bg-candy-container-low/30 p-5 text-sm text-candy-ink">
          <p className="font-bold text-candy-secondary">Tipos de kit deste evento</p>
          <p className="mt-2 text-xs text-candy-muted">
            Na coluna de kit use o <strong className="text-candy-ink">nome</strong> cadastrado em
            Arquitetura de kits (regra opcional).
          </p>
          <ul className="mt-3 max-h-32 list-inside list-disc overflow-y-auto text-xs text-candy-muted">
            {kitTypes.map((k) => (
              <li key={k.id}>
                <span className="font-semibold text-candy-ink">{k.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form
        ref={formRef}
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setResult(null);
          startTransition(async () => {
            const r = await importRegistrationsAction(fd);
            setResult(r);
            if (r.ok && r.inserted > 0 && formRef.current) {
              formRef.current.reset();
            }
          });
        }}
      >
        <input type="hidden" name="eventParam" value={eventParam} />
        <div>
          <label className="block">
            <span className="text-sm font-bold text-candy-ink">
              Arquivo CSV ou TXT (vírgula ou ponto-e-vírgula)
            </span>
            <input
              type="file"
              name="file"
              required
              accept=".csv,.txt,text/csv,text/plain"
              className={`${inputFileClass} mt-2`}
            />
          </label>
          <p className="mt-2 text-xs text-candy-muted">
            Primeira linha = cabeçalhos (ex.:{" "}
            <span className="font-mono">bib_number;full_name;document_id</span>). UTF-8.
          </p>
        </div>
        <PillButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Importando…" : "Importar participantes"}
        </PillButton>
      </form>

      {result && !result.ok ? (
        <div className="rounded-candy border border-red-500/35 bg-red-500/10 p-4 text-sm text-red-900">
          <p className="font-semibold">{result.error}</p>
          {result.errors && result.errors.length > 0 ? (
            <ul className="mt-3 max-h-48 list-inside list-disc overflow-y-auto text-xs">
              {result.errors.map((err) => (
                <li key={`${err.line}-${err.message}`}>
                  Linha {err.line}: {err.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {result && result.ok ? (
        <div className="space-y-3 rounded-candy border border-candy-secondary/35 bg-candy-secondary/10 p-4 text-sm text-candy-ink">
          <p className="font-semibold">
            Inseridos: {result.inserted}
            {result.skipped > 0 ? (
              <span className="ml-2 text-candy-muted">
                · Ignorados com erro: {result.skipped}
              </span>
            ) : null}
          </p>
          {result.warnings.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase text-candy-muted">Avisos</p>
              <ul className="mt-1 max-h-36 list-inside list-disc overflow-y-auto text-xs">
                {result.warnings.map((w) => (
                  <li key={`${w.line}-${w.message}`}>
                    Linha {w.line}: {w.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {result.rowErrors.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase text-amber-800">Linhas com erro</p>
              <ul className="mt-1 max-h-48 list-inside list-disc overflow-y-auto text-xs text-amber-950">
                {result.rowErrors.map((w) => (
                  <li key={`${w.line}-${w.message}`}>
                    Linha {w.line}: {w.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="text-center text-xs text-candy-muted">
        Evento: <span className="font-semibold text-candy-ink">{eventName}</span>
      </p>
    </div>
  );
}
