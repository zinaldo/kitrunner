import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";
import {
  IconCheckCircle,
  IconUserPlus,
} from "@/components/staff/station/candy-icons";
import { formatBibForDisplay } from "@/lib/format-bib";
import type { TvWallDeskTileModel } from "@/lib/display/tv-wall-types";

function statusLabel(status: TvWallDeskTileModel["status"]): string {
  if (status === "processing") return "Em processamento";
  if (status === "success") return "Concluído";
  return "";
}

function StatusChip({ desk }: { desk: TvWallDeskTileModel }) {
  if (desk.status === "idle") return null;
  const styles =
    desk.status === "success"
      ? "border-candy-secondary/40 bg-candy-secondary/12 text-candy-secondary"
      : "border-candy-primary/40 bg-candy-primary/12 text-candy-primary";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-candy-pill border px-3.5 py-1.5 text-sm font-bold uppercase tracking-wide ${styles}`}
    >
      {desk.showCheck ? (
        <IconCheckCircle className="h-5 w-5 shrink-0" />
      ) : null}
      {statusLabel(desk.status)}
    </span>
  );
}

type CandyTvDeskTileProps = {
  desk: TvWallDeskTileModel;
};

/** Read-only wall tile — Candy Joyful Pop, matches staff workstation language. */
export function CandyTvDeskTile({ desk }: CandyTvDeskTileProps) {
  const p = desk.participant;

  if (!p) {
    return (
      <CandyCard
        elevation="lg"
        className="flex h-full min-h-0 flex-col p-5 sm:p-6 lg:p-8"
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <p className="text-base font-bold uppercase tracking-[0.16em] text-candy-secondary sm:text-lg">
            {desk.deskLabel}
          </p>
        </div>
        <div className="mt-6 flex min-h-0 flex-1 flex-col items-center justify-center rounded-candy border-2 border-dashed border-candy-outline/35 bg-candy-container-low/50 px-4 py-10 text-center sm:py-12">
          <div className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-candy-tertiary/12 text-candy-tertiary sm:h-[4.5rem] sm:w-[4.5rem]">
            <IconUserPlus className="h-10 w-10 sm:h-11 sm:w-11" />
          </div>
          <p className="mt-6 text-2xl font-bold text-candy-ink sm:text-3xl lg:text-4xl">
            Aguardando próximo participante
          </p>
          <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-candy-muted sm:text-lg">
            Avance quando seu número de peito for chamado.
          </p>
        </div>
      </CandyCard>
    );
  }

  return (
    <CandyCard
      elevation="lg"
      className="flex h-full min-h-0 flex-col p-5 sm:p-6 lg:p-8"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="text-base font-bold uppercase tracking-[0.16em] text-candy-secondary sm:text-lg">
          {desk.deskLabel}
        </p>
        <StatusChip desk={desk} />
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <p className="font-mono text-5xl font-black tabular-nums tracking-tight text-candy-primary sm:text-6xl lg:text-7xl">
          {formatBibForDisplay(p.bibRaw)}
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-candy-ink sm:text-4xl lg:text-5xl">
          {p.name}
        </h2>

        <div className="mt-7 grid gap-5 sm:grid-cols-3 sm:gap-6">
          <div>
            <CandySectionTitle className="text-[0.7rem] sm:text-sm">
              Prova / distância
            </CandySectionTitle>
            <p className="mt-2 text-xl font-semibold text-candy-ink sm:text-2xl lg:text-3xl">
              {p.race}
            </p>
          </div>
          <div>
            <CandySectionTitle className="text-[0.7rem] sm:text-sm">
              Sexo
            </CandySectionTitle>
            <p className="mt-2 text-xl font-semibold text-candy-ink sm:text-2xl lg:text-3xl">
              {p.sex}
            </p>
          </div>
          <div>
            <CandySectionTitle className="text-[0.7rem] sm:text-sm">
              Faixa etária
            </CandySectionTitle>
            <p className="mt-2 text-xl font-semibold text-candy-ink sm:text-2xl lg:text-3xl">
              {p.ageGroup}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <CandySectionTitle className="text-[0.7rem] sm:text-sm">
            Status do kit
          </CandySectionTitle>
          <p className="mt-3 inline-flex rounded-candy-pill border border-candy-tertiary/35 bg-candy-tertiary/10 px-5 py-2.5 text-base font-bold text-candy-tertiary sm:text-lg">
            {p.kitStatus}
          </p>
        </div>
      </div>
    </CandyCard>
  );
}
