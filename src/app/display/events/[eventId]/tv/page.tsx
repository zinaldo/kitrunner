import { CandyTvDeskTile } from "@/components/display/candy-tv-desk-tile";
import { TvWallAutoRefresh } from "@/components/display/tv-wall-auto-refresh";
import { TvWallHeader } from "@/components/display/tv-wall-header";
import type { TvWallDeskTileModel } from "@/lib/display/tv-wall-types";
import { mapTvDeskTileRow } from "@/lib/display/map-tv-tiles";
import { fetchTvWallTiles } from "@/lib/queries/tv-wall-tiles";
import { resolveEventRow } from "@/lib/queries/resolve-event-desk";
import { formatDateDotBr } from "@/lib/format-display-text";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Always hit Supabase on refresh() — TV wall must not serve stale RSC cache. */
export const dynamic = "force-dynamic";

function tvWallHeadline(name: string, eventDate: string | null): string {
  const dateLabel = eventDate?.trim()
    ? formatDateDotBr(eventDate)
    : null;
  if (!dateLabel || dateLabel === "—") return name;
  return `${name} - ${dateLabel}`;
}

type DisplayTvPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function DisplayTvPage({ params }: DisplayTvPageProps) {
  const { eventId: eventParam } = await params;

  let tiles: TvWallDeskTileModel[] = [];
  let loadError: string | null = null;
  let headline: string = eventParam;

  try {
    const supabase = await createSupabaseServerClient();
    const event = await resolveEventRow(supabase, eventParam);
    if (!event) {
      loadError = "Evento não encontrado.";
    } else {
      headline = tvWallHeadline(event.name, event.event_date);
      const rows = await fetchTvWallTiles(supabase, event.id);
      tiles = rows.map(mapTvDeskTileRow);
    }
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar a parede de TVs do banco de dados.";
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {!loadError ? (
        <TvWallAutoRefresh enabled intervalMs={4000} />
      ) : null}
      <TvWallHeader headline={headline} />
      <div className="flex w-full flex-1 flex-col px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        {loadError ? (
          <p className="mx-auto max-w-xl text-center text-sm font-medium text-red-600">
            {loadError}
          </p>
        ) : tiles.length === 0 ? (
          <p className="mx-auto max-w-xl text-center text-sm text-candy-muted">
            Nenhum guichê configurado para este evento ainda.
          </p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 lg:gap-6">
            {tiles.map((desk) => (
              <div
                key={desk.deskId}
                className={`h-full min-h-0 ${
                  tiles.length === 1 ? "md:col-span-2" : ""
                }`}
              >
                <CandyTvDeskTile desk={desk} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
