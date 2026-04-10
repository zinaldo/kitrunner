import Link from "next/link";
import { redirect } from "next/navigation";
import { CandyCard } from "@/components/candy/candy-card";
import { fetchStaffEventsWithDesksForUser } from "@/lib/queries/list-events";
import { eventRouteKey, loginPath, staffDeskPath } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function StaffEventsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect(loginPath());
  }

  let rows: Awaited<ReturnType<typeof fetchStaffEventsWithDesksForUser>> = [];
  let loadError: string | null = null;

  try {
    rows = await fetchStaffEventsWithDesksForUser(supabase, user.id);
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Não foi possível carregar os eventos do banco de dados.";
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="border-b border-candy-outline/12 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-candy-muted">
          KitRunner · Guichê de entrega
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-candy-ink sm:text-3xl">
          Seus eventos
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-candy-muted">
          Escolha um evento e abra o guichê em que você está atendendo — mesmo
          fluxo visual do console na TV.
        </p>
      </div>

      {loadError ? (
        <CandyCard className="border-candy-primary/25 bg-candy-primary/5 p-5">
          <p className="text-sm font-semibold text-candy-ink">{loadError}</p>
        </CandyCard>
      ) : null}

      <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        {rows.length === 0 && !loadError ? (
          <li className="col-span-full">
            <CandyCard elevation="lg" className="p-10 text-center">
              <p className="text-sm font-medium text-candy-muted">
                Você ainda não está na equipe de nenhuma prova, ou não há guichês
                ativos nos eventos em que participa. Peça a um administrador para
                adicionar seu e-mail em Configurações da prova (equipe de
                entrega).
              </p>
            </CandyCard>
          </li>
        ) : null}
        {rows.map((event) => {
          const eventKey = eventRouteKey(event);
          return (
            <li key={event.id}>
              <CandyCard elevation="lg" className="flex h-full flex-col p-6 sm:p-7">
                <h2 className="text-lg font-bold text-candy-ink sm:text-xl">
                  {event.name}
                </h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-candy-muted">
                  {event.desks.length === 0
                    ? "Nenhum guichê ativo"
                    : `${event.desks.length} guichê${event.desks.length === 1 ? "" : "s"}`}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-candy-outline/10 pt-5">
                  {event.desks.map((desk) => (
                    <Link
                      key={`${event.id}-${desk.routeKey}`}
                      href={staffDeskPath(eventKey, desk.routeKey)}
                      className="inline-flex items-center rounded-candy-pill border-2 border-candy-tertiary/45 bg-white/95 px-4 py-2 text-xs font-bold text-candy-tertiary shadow-candy-tertiary transition hover:scale-[1.02] hover:border-candy-tertiary active:scale-[0.99]"
                    >
                      {desk.label}
                    </Link>
                  ))}
                </div>
              </CandyCard>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
