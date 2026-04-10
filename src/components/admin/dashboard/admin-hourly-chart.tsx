import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";

const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

/** Illustrative hourly bars (no time-series API yet). Heights 0–100 for layout fidelity. */
const ACTUAL = [38, 52, 68, 82, 74, 58, 44];
const PROJECTION = [42, 48, 62, 78, 80, 66, 52];

export function AdminHourlyFulfillmentChart() {
  return (
    <CandyCard elevation="lg" className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-candy-outline/12 pb-5">
        <div>
          <CandySectionTitle>Retiradas por hora</CandySectionTitle>
          <p className="mt-2 text-sm text-candy-muted">
            Acompanhamento entre centrais de entrega
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          <span className="flex items-center gap-2 text-candy-ink">
            <span
              className="h-2 w-6 rounded-full bg-candy-primary"
              aria-hidden
            />
            Realizado
          </span>
          <span className="flex items-center gap-2 text-candy-muted">
            <span
              className="h-2 w-6 rounded-full bg-candy-secondary/45"
              aria-hidden
            />
            Projeção
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
          {HOURS.map((label, i) => (
            <div
              key={label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-40 w-full max-w-[4.5rem] items-end justify-center gap-1 sm:gap-1.5">
                <div
                  className="w-2/5 min-w-[10px] max-w-5 rounded-t-md bg-candy-secondary/35"
                  style={{ height: `${PROJECTION[i]}%` }}
                  title="Projeção"
                />
                <div
                  className="w-2/5 min-w-[10px] max-w-5 rounded-t-md bg-candy-primary shadow-candy-primary"
                  style={{ height: `${ACTUAL[i]}%` }}
                  title="Realizado"
                />
              </div>
              <span className="text-[10px] font-semibold tabular-nums text-candy-muted sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-candy-muted">
          Curva ilustrativa — conectar a carimbos de entrega quando houver
          agregados por hora.
        </p>
      </div>
    </CandyCard>
  );
}
