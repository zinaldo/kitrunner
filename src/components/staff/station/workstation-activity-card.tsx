import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";

const METRICS = [
  { label: "Fila estimada", value: "12 min" },
  { label: "Kits expedidos", value: "842 / 1,2k" },
  { label: "Taxa de sucesso", value: "99,8%" },
  { label: "Carga do posto", value: "75%" },
] as const;

export function WorkstationActivityCard() {
  return (
    <CandyCard
      elevation="lg"
      className="pointer-events-none select-none p-6 opacity-45 saturate-[0.7] contrast-[0.92]"
    >
      <CandySectionTitle>Atividade do posto</CandySectionTitle>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-candy-outline/12 bg-gradient-to-br from-white/90 to-candy-container-low/90 p-4 shadow-candy-card-soft"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-candy-muted">
              {m.label}
            </p>
            <p className="mt-2 text-xl font-bold tabular-nums text-candy-ink">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </CandyCard>
  );
}
