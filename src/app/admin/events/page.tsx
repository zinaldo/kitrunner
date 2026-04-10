import Link from "next/link";
import {
  adminEventImportPath,
  adminEventSettingsPath,
  adminEventStatsPath,
  adminNewEventPath,
  eventRouteKey,
} from "@/lib/routes";
import { fetchAdminEventsList } from "@/lib/queries/list-events";
import { getSupabaseAdminOrServer } from "@/lib/supabase/admin-or-server-client";

export default async function AdminEventsPage() {
  let rows: Awaited<ReturnType<typeof fetchAdminEventsList>> = [];
  let loadError: string | null = null;

  try {
    const { supabase } = await getSupabaseAdminOrServer();
    rows = await fetchAdminEventsList(supabase);
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar os eventos do banco de dados.";
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-candy-ink">
            Eventos
          </h1>
          <p className="mt-1 text-sm text-candy-muted">
            Importe listas, gerencie a equipe e veja estatísticas de entrega —
            dados do Supabase.
          </p>
        </div>
        <Link
          href={adminNewEventPath()}
          className="rounded-candy-pill bg-candy-secondary/80 px-4 py-2 text-sm font-semibold text-white shadow-candy-card-soft transition hover:bg-candy-secondary"
        >
          Nova prova
        </Link>
      </div>

      {loadError ? (
        <p className="text-sm font-medium text-red-600">{loadError}</p>
      ) : null}

      <div className="overflow-hidden rounded-candy border border-candy-outline/15 bg-candy-surface/95 shadow-candy-card-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-candy-outline/12 bg-candy-container-low/60 text-xs font-bold uppercase tracking-wide text-candy-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="hidden px-4 py-3 sm:table-cell">Slug / ID</th>
              <th className="px-4 py-3">Participantes</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-candy-outline/10">
            {rows.length === 0 && !loadError ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-candy-muted"
                >
                  Nenhum evento ainda. Crie um no Supabase ou rode sua seed /
                  migration.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => {
              const key = eventRouteKey(row);
              const idLabel = row.slug?.trim() || row.id;
              const participants =
                row.registrationCount === null
                  ? "—"
                  : row.registrationCount.toLocaleString("pt-BR");

              return (
                <tr key={row.id} className="text-candy-ink">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="hidden max-w-[200px] truncate px-4 py-3 font-mono text-xs text-candy-muted sm:table-cell">
                    {idLabel}
                  </td>
                  <td className="px-4 py-3 text-candy-muted">{participants}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={adminEventSettingsPath(key)}
                        className="rounded-candy border border-candy-outline/20 px-2 py-1 text-xs font-medium hover:border-candy-primary/40"
                      >
                        Configuração
                      </Link>
                      <Link
                        href={adminEventImportPath(key)}
                        className="rounded-candy border border-candy-outline/20 px-2 py-1 text-xs font-medium hover:border-candy-primary/40"
                      >
                        Importar
                      </Link>
                      <Link
                        href={adminEventStatsPath(key)}
                        className="rounded-candy border border-candy-outline/20 px-2 py-1 text-xs font-medium hover:border-candy-primary/40"
                      >
                        Estatísticas
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
