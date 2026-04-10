import { CandyCard } from "@/components/candy/candy-card";
import { CandySectionTitle } from "@/components/candy/candy-section-title";

type FeedItem = {
  icon: "check" | "truck" | "warning" | "person";
  title: string;
  time: string;
  detail: string;
};

const PLACEHOLDER_ITEMS: FeedItem[] = [
  {
    icon: "check",
    title: "Kit entregue: #40291",
    time: "há 2 min",
    detail: "Atendido por: Marcus Aurelius (Elite B)",
  },
  {
    icon: "truck",
    title: "Hub de expedição delta",
    time: "há 14 min",
    detail: "Lote #RC-204 liberado para o piso",
  },
  {
    icon: "warning",
    title: "Exceção de endereço",
    time: "há 28 min",
    detail: "Kit #11029 exige conferência manual",
  },
  {
    icon: "person",
    title: "Nova importação em massa",
    time: "há 1 h",
    detail: "420 inscrições sincronizadas via API",
  },
];

function FeedIcon({ kind }: { kind: FeedItem["icon"] }) {
  const cls = "h-5 w-5 shrink-0";
  switch (kind) {
    case "check":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
    case "truck":
      return (
        <svg
          className={cls}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18h2" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      );
    case "warning":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      );
    case "person":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9 0c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm9 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    default:
      return null;
  }
}

type AdminLiveActivityFeedProps = {
  atDeskCount: number;
};

export function AdminLiveActivityFeed({ atDeskCount }: AdminLiveActivityFeedProps) {
  const liveItems: FeedItem[] =
    atDeskCount > 0
      ? [
          {
            icon: "person",
            title: `${atDeskCount} no painel dos guichês`,
            time: "Agora",
            detail: "Inscrições atualmente projetadas nos TVs",
          },
          ...PLACEHOLDER_ITEMS,
        ]
      : PLACEHOLDER_ITEMS;

  return (
    <CandyCard elevation="lg" className="flex h-full flex-col p-6 sm:p-8">
      <CandySectionTitle>Atividade ao vivo</CandySectionTitle>
      <p className="mt-2 text-sm text-candy-muted">
        Sinais do piso e importações — narrativa de exemplo até o log de
        auditoria existir.
      </p>
      <ul className="mt-6 flex flex-1 flex-col gap-0 divide-y divide-candy-outline/12">
        {liveItems.map((item) => (
          <li key={`${item.title}-${item.time}`} className="flex gap-3 py-4 first:pt-0">
            <div className="mt-0.5 text-candy-tertiary">
              <FeedIcon kind={item.icon} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-candy-ink">
                  {item.title}
                </p>
                <span className="shrink-0 text-[11px] font-medium tabular-nums text-candy-muted">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-xs text-candy-muted">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 w-full rounded-candy-pill border border-candy-outline/20 bg-candy-container-low/60 py-2.5 text-xs font-bold uppercase tracking-wide text-candy-muted transition hover:border-candy-primary/30 hover:text-candy-ink"
        disabled
      >
        Ver log completo de auditoria
      </button>
    </CandyCard>
  );
}
