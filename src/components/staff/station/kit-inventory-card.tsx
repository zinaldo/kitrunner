import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";

const ITEMS = [
  { label: "Camisa performance", done: true },
  { label: "Peito com RFID", done: true },
  { label: "Kit nutricional", done: true },
  { label: "Sacola patrocinador", done: false },
] as const;

export function KitInventoryCard() {
  return (
    <CandyCard
      elevation="lg"
      className="pointer-events-none select-none p-6 opacity-45 saturate-[0.7] contrast-[0.92]"
    >
      <CandySectionTitle>Inventário do kit</CandySectionTitle>
      <ul className="mt-4 space-y-3">
        {ITEMS.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-candy-outline/12 bg-candy-container-low/60 px-3 py-2.5"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                item.done
                  ? "border-candy-tertiary bg-candy-tertiary/15 text-candy-tertiary"
                  : "border-candy-outline/35 text-candy-muted"
              }`}
              aria-hidden
            >
              {item.done ? "✓" : ""}
            </span>
            <span className="text-sm font-semibold text-candy-ink">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-candy-outline/15 pt-4">
        {["QTD 1", "QTD 2", "QTD 3", "PENDENTE"].map((tag) => (
          <span
            key={tag}
            className="rounded-candy-pill border border-candy-secondary/25 bg-candy-primary/5 px-3 py-1 text-xs font-bold text-candy-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </CandyCard>
  );
}
