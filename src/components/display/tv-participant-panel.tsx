type TvParticipantPanelProps = {
  deskLabel: string;
  participant: {
    eventName: string;
    bib: string;
    name: string;
    race: string;
    birthDate: string;
    sex: string;
    team: string;
    extra?: string;
  } | null;
};

/** Stitch-aligned TV typography: high contrast, large readable type. */
export function TvParticipantPanel({
  deskLabel,
  participant,
}: TvParticipantPanelProps) {
  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-teal-500/40 bg-slate-900/80 p-6 shadow-xl ring-1 ring-white/5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300/90">
        {deskLabel}
      </p>
      {!participant ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-2xl font-medium text-slate-500">
            Aguardando próximo atleta
          </p>
        </div>
      ) : (
        <dl className="mt-4 flex flex-1 flex-col gap-3 text-left">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Evento
            </dt>
            <dd className="text-lg font-semibold text-white">
              {participant.eventName}
            </dd>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Peito
              </dt>
              <dd className="text-4xl font-bold tabular-nums tracking-tight text-teal-300">
                {participant.bib}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Nome
              </dt>
              <dd className="text-2xl font-semibold text-white">
                {participant.name}
              </dd>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Prova / distância
              </dt>
              <dd className="text-xl text-slate-100">{participant.race}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Nascimento
              </dt>
              <dd className="text-xl text-slate-100">{participant.birthDate}</dd>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Sexo
              </dt>
              <dd className="text-xl text-slate-100">{participant.sex}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Equipe
              </dt>
              <dd className="text-xl text-slate-100">{participant.team}</dd>
            </div>
          </div>
          {participant.extra ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Observações
              </dt>
              <dd className="text-base text-slate-300">{participant.extra}</dd>
            </div>
          ) : null}
        </dl>
      )}
    </div>
  );
}
