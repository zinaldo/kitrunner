import { CandyTvDeskTile } from "@/components/display/candy-tv-desk-tile";
import { TvWallAutoRefresh } from "@/components/display/tv-wall-auto-refresh";
import { TvWallHeader } from "@/components/display/tv-wall-header";
import { mapTvDeskTileRow } from "@/lib/display/map-tv-tiles";
import { formatDateDotBr } from "@/lib/format-display-text";
import {
  fetchTvDeskTileForDesk,
} from "@/lib/queries/tv-wall-tiles";
import {
  resolveDeskRow,
  resolveEventRow,
} from "@/lib/queries/resolve-event-desk";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Sempre buscar estado no Supabase ao dar refresh — TV de guichê único. */
export const dynamic = "force-dynamic";

function tvWallHeadline(name: string, eventDate: string | null): string {
  const dateLabel = eventDate?.trim()
    ? formatDateDotBr(eventDate)
    : null;
  if (!dateLabel || dateLabel === "—") return name;
  return `${name} - ${dateLabel}`;
}

type DisplayDeskPageProps = {
  params: Promise<{ eventId: string; deskId: string }>;
};

export default async function DisplayDeskPage({ params }: DisplayDeskPageProps) {
  const { eventId: eventParam, deskId: deskParam } = await params;

  let loadError: string | null = null;
  let headline: string = eventParam;
  let tile = null;

  try {
    const supabase = await createSupabaseServerClient();
    const event = await resolveEventRow(supabase, eventParam);
    if (!event) {
      loadError = "Evento não encontrado.";
    } else {
      headline = tvWallHeadline(event.name, event.event_date);
      const desk = await resolveDeskRow(supabase, event.id, deskParam);
      if (!desk) {
        loadError = "Guichê não encontrado para esta prova.";
      } else {
        const row = await fetchTvDeskTileForDesk(supabase, event.id, desk.id);
        if (!row) {
          loadError = "Não foi possível carregar o estado deste guichê.";
        } else {
          tile = mapTvDeskTileRow(row);
        }
      }
    }
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar a tela do guichê.";
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {!loadError && tile ? (
        <TvWallAutoRefresh enabled intervalMs={4000} />
      ) : null}
      <TvWallHeader headline={headline} />
      <div className="flex w-full flex-1 flex-col px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        {loadError ? (
          <p className="mx-auto max-w-xl text-center text-sm font-medium text-red-600">
            {loadError}
          </p>
        ) : tile ? (
          <div className="grid w-full grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <div className="h-full min-h-0">
              <CandyTvDeskTile desk={tile} />
            </div>
          </div>
        ) : (
          <p className="mx-auto max-w-xl text-center text-sm text-candy-muted">
            Nenhum dado para exibir.
          </p>
        )}
      </div>
    </div>
  );
}
