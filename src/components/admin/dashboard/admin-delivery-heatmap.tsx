import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";

const CELL_KEYS = Array.from({ length: 48 }, (_, i) => i);

export function AdminDeliveryHeatmapPlaceholder() {
  return (
    <CandyCard elevation="md" className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CandySectionTitle>Mapa de calor das entregas</CandySectionTitle>
        <span className="rounded-candy-pill border border-candy-tertiary/35 bg-candy-tertiary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-candy-tertiary">
          Ao vivo
        </span>
      </div>
      <p className="mt-2 text-sm text-candy-muted">
        Visualização geográfica ou por densidade de guichês — grade ilustrativa
        no ritmo do painel.
      </p>
      <div
        className="mt-6 grid grid-cols-12 gap-1.5 sm:gap-2"
        aria-hidden
      >
        {CELL_KEYS.map((i) => (
          <div
            key={i}
            className="aspect-square rounded-md bg-candy-primary/20 shadow-candy-card-soft"
            style={{
              opacity: 0.15 + (i % 7) * 0.1,
            }}
          />
        ))}
      </div>
    </CandyCard>
  );
}
